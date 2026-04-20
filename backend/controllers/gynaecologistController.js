import axios from "axios";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

const NEXT_DATA_START = '<script id="__NEXT_DATA__" type="application/json">';
const NEXT_DATA_END = "</script>";
const JUSTDIAL_CACHE_TTL_MS = Number(
  process.env.JD_CACHE_TTL_MS || 15 * 60 * 1000,
);
const JUSTDIAL_CACHE_MAX_ENTRIES = Number(
  process.env.JD_CACHE_MAX_ENTRIES || 100,
);

const justdialCityCache = new Map();

const GYNAE_INCLUDE_KEYWORDS = [
  "gyna",
  "gyne",
  "obstetric",
  "maternity",
  "pregnan",
  "fertility",
  "ivf",
  "women hospital",
  "womens hospital",
  "women clinic",
  "womens clinic",
  "lady doctor",
];

const IRRELEVANT_KEYWORDS = [
  "institute",
  "institutes",
  "academy",
  "college",
  "coaching",
  "tuition",
  "tutorial",
  "training",
  "education",
  "school",
  "classes",
  "career",
  "computer",
  "english",
  "spoken",
];

const normalizeSpaces = (value = "") =>
  String(value).replaceAll(/\s+/g, " ").trim();

const getYearsText = (attrData = {}) => {
  const raw = attrData?.node3?.[0] || "";
  const plainText = raw.replaceAll(/<[^>]+>/g, "");
  return normalizeSpaces(plainText);
};

const extractNextDataJson = (html) => {
  const start = html.indexOf(NEXT_DATA_START);
  if (start === -1) return null;

  const end = html.indexOf(NEXT_DATA_END, start);
  if (end === -1) return null;

  return html.slice(start + NEXT_DATA_START.length, end);
};

const mapJustdialListing = (row, columns) => {
  const item = {};

  columns.forEach((column, index) => {
    item[column] = row[index];
  });

  const specialization = normalizeSpaces(item.type || "");
  const experience = getYearsText(item.attr_data) || "Not specified";

  return {
    name: normalizeSpaces(item.name || ""),
    hospital: normalizeSpaces(item.NewAddress || "Not specified"),
    rating: item.compRating ? Number(item.compRating) : null,
    experience,
    area: normalizeSpaces(item.area || "Not specified"),
    specialization: specialization || "General gynecology",
    contact: normalizeSpaces(item.VNumber || "Not available"),
  };
};

const hasAnyKeyword = (text, keywords) =>
  keywords.some((keyword) => text.includes(keyword));

const isGynaecologyResult = (doctor) => {
  const text =
    `${doctor.name} ${doctor.specialization} ${doctor.hospital}`.toLowerCase();
  const hasGynaeSignal = hasAnyKeyword(text, GYNAE_INCLUDE_KEYWORDS);
  const hasIrrelevantSignal = hasAnyKeyword(text, IRRELEVANT_KEYWORDS);
  return hasGynaeSignal && !hasIrrelevantSignal;
};

const dedupeDoctors = (doctors) => {
  const seen = new Set();
  return doctors.filter((doctor) => {
    const key = `${doctor.name.toLowerCase()}|${doctor.contact.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getCacheKey = (city) => city.toLowerCase();

const getCachedDoctors = (city) => {
  const key = getCacheKey(city);
  const cached = justdialCityCache.get(key);
  if (!cached) return null;

  const isExpired = Date.now() - cached.cachedAt > JUSTDIAL_CACHE_TTL_MS;
  if (isExpired) {
    justdialCityCache.delete(key);
    return null;
  }

  return cached;
};

const setCachedDoctors = (city, doctors) => {
  const key = getCacheKey(city);
  justdialCityCache.set(key, {
    doctors,
    cachedAt: Date.now(),
  });

  if (justdialCityCache.size > JUSTDIAL_CACHE_MAX_ENTRIES) {
    const oldestKey = justdialCityCache.keys().next().value;
    if (oldestKey) {
      justdialCityCache.delete(oldestKey);
    }
  }
};

const parseDoctorsFromJustdialHtml = (html) => {
  const nextDataText = extractNextDataJson(html);
  if (!nextDataText) return [];

  const nextData = JSON.parse(nextDataText);
  const columns = nextData?.props?.pageProps?.listData?.results?.columns || [];
  const rows = nextData?.props?.pageProps?.listData?.results?.data || [];

  if (!Array.isArray(columns) || !Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((row) => mapJustdialListing(row, columns))
    .filter((doctor) => doctor.name);
};

export const getJustdialGynaecologists = catchAsyncErrors(
  async (req, res, next) => {
    const city = normalizeSpaces(req.query.city || "");

    if (!city) {
      return next(new ErrorHandler("City is required", 400));
    }

    const cached = getCachedDoctors(city);
    if (cached) {
      return res.status(200).json({
        success: true,
        source: "justdial",
        city,
        doctors: cached.doctors,
        cached: true,
      });
    }

    const encodedCity = encodeURIComponent(city);
    const searchUrls = [
      `https://www.justdial.com/${encodedCity}/Gynaecologist/nct-10269960`,
      `https://www.justdial.com/${encodedCity}/Gynecologist`,
      `https://www.justdial.com/${encodedCity}/Obstetricians-and-Gynaecologists`,
    ];

    const requestConfig = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9",
        Referer: "https://www.justdial.com/",
      },
      timeout: 15000,
    };

    const collected = [];

    for (const searchUrl of searchUrls) {
      try {
        const response = await axios.get(searchUrl, requestConfig);
        const doctorsFromUrl = parseDoctorsFromJustdialHtml(response.data);
        if (doctorsFromUrl.length) {
          collected.push(...doctorsFromUrl);
        }
      } catch {
        // Try the next URL pattern if one fails.
      }
    }

    if (!collected.length) {
      return next(
        new ErrorHandler("Unable to fetch Justdial data for this city", 502),
      );
    }

    const doctors = dedupeDoctors(collected)
      .filter(isGynaecologyResult)
      .slice(0, 5);

    if (doctors.length) {
      setCachedDoctors(city, doctors);
    }

    res.status(200).json({
      success: true,
      source: "justdial",
      city,
      doctors,
      cached: false,
    });
  },
);
