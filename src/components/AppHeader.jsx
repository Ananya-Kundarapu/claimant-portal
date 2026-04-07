import { useNavigate, useLocation, Link } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
    if (location.pathname === "/") return null;
  const stored = localStorage.getItem("claimant");
  const claimant = stored ? JSON.parse(stored) : null;

  const isLoggedIn = !!claimant;

  const handleLogout = () => {
    localStorage.removeItem("claimant");
    navigate("/");
    window.location.reload(); 
  };

  return (
    <header className="sticky top-0 z-50 h-16 px-10 flex items-center justify-between backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <Shield className="w-6 h-6 text-blue-600" />
        <span className="font-bold text-lg">ClaimShield</span>
      </div>

      {/* RIGHT */}
 <div className="flex items-center gap-4">

  {/* 🔵 IF LOGGED IN */}
  {isLoggedIn ? (
    <>
      <span className="text-base text-gray-500">
        Welcome, {claimant.name}
      </span>

      <button
        onClick={handleLogout}
        className="p-2 rounded-md hover:bg-gray-100 transition"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </>
  ) : (
    /* 🟢 NOT LOGGED IN */
    <>
      {/* ✅ FEATURES ONLY BEFORE LOGIN */}
      <button
        onClick={() => {
          if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          } else {
            document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
          }
        }}
        className="text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        Features
      </button>

      <Link
        to="/claimant/login"
        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        Sign In
      </Link>

      <button
        onClick={() => navigate("/claimant/login")}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 active:scale-95"
      >
        Apply Now
      </button>
    </>
  )}
</div>

    </header>
  );
};

export default AppHeader;