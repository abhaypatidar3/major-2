import axios from "axios";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

const NEXT_DATA_START = '<script id="__NEXT_DATA__" type="application/json">';
const NEXT_DATA_END = "</script>";

// Updated URL with 2026 Category IDs
const SEARCH_CATEGORY_ID = "nct-12102921"; // Women Gynaecologist & Obstetrician ID

/**
 * Robust JSON Extractor: 
 * Justdial 2026 uses a deeply nested initialState object.
 */
const parseJustdialData = (html) => {
  try {
    const start = html.indexOf(NEXT_DATA_START);
    const end = html.indexOf(NEXT_DATA_END, start);
    if (start === -1 || end === -1) return [];

    const jsonText = html.slice(start + NEXT_DATA_START.length, end);
    const parsed = JSON.parse(jsonText);

    // Try multiple possible paths as JD updates their Next.js structure monthly
    const resultsObj = 
      parsed?.props?.pageProps?.initialState?.listData?.results || 
      parsed?.props?.pageProps?.listData?.results || 
      parsed?.props?.pageProps?.results;

    if (!resultsObj || !resultsObj.data) return [];

    const columns = resultsObj.columns || [];
    return resultsObj.data.map((row) => {
      const item = {};
      columns.forEach((col, i) => { item[col] = row[i]; });
      
      return {
        name: (item.name || "Unknown").trim(),
        hospital: (item.compName || item.NewAddress || "Not specified").replace(/<[^>]+>/g, "").trim(),
        rating: item.compRating ? parseFloat(item.compRating) : null,
        experience: item.attr_data?.node3?.[0]?.replace(/<[^>]+>/g, "") || "Not specified",
        area: (item.area || "Not specified").trim(),
        contact: item.VNumber || item.contact || "Not available",
      };
    });
  } catch (err) {
    console.error("Parse Error:", err.message);
    return [];
  }
};

export const getJustdialGynaecologists = catchAsyncErrors(async (req, res, next) => {
  const city = req.query.city?.trim();
  if (!city) return next(new ErrorHandler("City is required", 400));

  // 1. Browser-grade Headers
  const baseHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
  };

  try {
    // 2. STEP ONE: Get Session Cookies from the Homepage
    // Justdial blocks direct NCT deep-links if no session cookie exists.
    const homeResponse = await axios.get("https://www.justdial.com/", { 
      headers: baseHeaders, 
      timeout: 8000 
    });
    
    const cookies = homeResponse.headers["set-cookie"];
    const cookieString = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : "";

    // 3. STEP TWO: Search for Doctors using the session
    const searchUrl = `https://www.justdial.com/${encodeURIComponent(city)}/Women-Gynaecologist-Obstetrician-Doctors/${SEARCH_CATEGORY_ID}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        ...baseHeaders,
        "Cookie": cookieString,
        "Referer": "https://www.justdial.com/",
      },
      timeout: 15000,
    });

    const doctors = parseJustdialData(response.data);

    if (doctors.length === 0) {
      // Logic for 2026: If structure fails, log a snippet for debugging
      console.log("HTML Sample:", response.data.slice(0, 500));
      return next(new ErrorHandler("Justdial structure changed or bot detected. Check console logs.", 502));
    }

    // 4. Final filter and response
    const finalDoctors = doctors.slice(0, 10);

    res.status(200).json({
      success: true,
      source: "justdial",
      city,
      count: finalDoctors.length,
      doctors: finalDoctors,
    });

  } catch (error) {
    const status = error.response?.status || 500;
    const message = status === 403 ? "IP Blocked by Justdial. Use a VPN or Proxy." : error.message;
    return next(new ErrorHandler(message, status));
  }
});