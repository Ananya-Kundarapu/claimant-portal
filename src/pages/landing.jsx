import { useNavigate } from "react-router-dom";
import { Shield, FileText, ArrowRight } from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Glow Effects (Soft Light) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl w-full flex flex-col items-center text-center relative z-10 animate-fade-in">

        {/* Logo Shield */}
        <div className="relative group cursor-pointer mb-8">
          <div className="absolute inset-0 bg-blue-200/50 rounded-3xl blur-xl group-hover:bg-blue-300/60 transition-all duration-500"></div>
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white border border-blue-100 shadow-xl">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          ClaimShield Solutions
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          The next-generation unemployment insurance portal. File claims, track payments, and verify your identity securely in a unified ecosystem.
        </p>

        {/* Single Action Card */}
        <div className="w-full max-w-md mx-auto">
          <button
            onClick={() => navigate("/claimant/login")}
            className="w-full p-6 rounded-2xl border border-slate-200 bg-white text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-400 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                
                {/* Icon Box */}
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-wide">
                    Claimant Portal
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Secure login via ID.me
                  </p>
                </div>
              </div>

              <div className="h-14 flex items-center">
                <div className="p-3 rounded-full bg-slate-100 group-hover:bg-blue-600 transition-colors duration-300">
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Footer Meta */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex items-center gap-6 text-sm font-medium text-slate-500">
          <p>© 2026 ClaimShield Inc.</p>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          <p>Secure Government ID verified</p>
        </div>

      </div>
    </div>
  );
}

export default Landing;