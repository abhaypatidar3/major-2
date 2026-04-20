import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import FlashMessage from "./components/FlashMessage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReadMore from "./pages/ReadMore";
import Calculator from "./pages/Calculator";
import Symptoms from "./pages/Symptoms";
import SymptomDetail from "./pages/SymptomDetail";
import Education from "./pages/Education";
import Community from "./pages/Community";
import SyncoraAI from "./pages/SyncoraAI";
import Profile from "./pages/Profile";
import FindGynaecologists from "./pages/FindGynaecologists";

const AppLayout = () => {
  const location = useLocation();
  const isIntroPage = location.pathname === "/";

  if (isIntroPage) {
    return <Intro />;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/readmore" element={<ReadMore />} />
          <Route path="/services" element={<ReadMore />} />
          <Route path="/period-calculator" element={<Calculator />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/symptoms/:id" element={<SymptomDetail />} />
          <Route path="/education" element={<Education />} />
          <Route path="/community" element={<Community />} />
          <Route
            path="/find-gynaecologists"
            element={
              <ProtectedRoute>
                <FindGynaecologists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/syncora-ai"
            element={
              <ProtectedRoute>
                <SyncoraAI />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <FlashMessage />
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
