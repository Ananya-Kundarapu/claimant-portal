import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, CheckCircle, Camera, Upload, X } from "lucide-react";

function ClaimantLogin() {
  const navigate = useNavigate();

  // 🔥 STATES (from popup code)
  const [mockStep, setMockStep] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [email, setEmail] = useState("");
  const [ssn, setSsn] = useState("");
  const [emailError, setEmailError] = useState("");

  const completeLogin = () => {
    const userEmail = email.trim() || "demo_user@gmail.com";
    const userName = userEmail.split("@")[0];

    localStorage.setItem(
      "claimant",
      JSON.stringify({ name: userName, email: userEmail, ssn })
    );

    navigate("/claimant/dashboard");
  };

  const handleVerifyProcess = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Enter a valid email");
      return;
    }

    setEmailError("");
    setMockStep("verifying");

    setTimeout(() => {
      setMockStep("verified");
      setTimeout(() => {
        completeLogin();
      }, 900);
    }, 1500);
  };

  const proceedToUpload = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Enter a valid email");
      return;
    }

    setEmailError("");
    setMockStep("upload");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="relative max-w-md text-center text-primary-foreground">

          <div className="absolute inset-0 bg-white/10 blur-3xl opacity-20 rounded-full"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-md mb-8 shadow-lg">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>

            <h1 className="text-4xl font-bold mb-4">
              ClaimShield
            </h1>

            <p className="text-lg opacity-90 leading-relaxed">
              File and track your insurance claims with AI-powered assistance.
              Fast, transparent, and secure.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* HEADER */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-3">
              Verify Your Identity
            </h2>

            <p className="text-muted-foreground text-sm">
              ClaimShield routes through ID.me for federated identity verification.
              Your secure data vault is heavily protected.
            </p>
          </div>

          {/* SECURITY CARD */}
          <div className="border rounded-2xl bg-muted/30 p-5 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>

              <div>
                <p className="text-sm font-semibold mb-1">
                  Government-Grade Security
                </p>
                <p className="text-xs text-muted-foreground">
                  ID.me uses NIST IAL2 identity verification.
                </p>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setMockStep("ask")}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-medium bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <span className="font-bold text-xs bg-white text-primary px-2 py-1 rounded">
              ID.me
            </span>

            Secure Sign In
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          {/* CREATE */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an ID.me account?{" "}
            <span
              onClick={() => navigate("/claimant/signup")}
              className="text-primary font-medium hover:underline cursor-pointer"
            >
              Create one free
            </span>
          </p>

        </div>
      </div>

      {/* 🔥 FULL POPUP (UNCHANGED FROM YOUR ORIGINAL) */}
      {mockStep && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">

            {/* Header */}
            <div className="bg-gray-50 border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#1a56db] font-black text-sm">ID.me</span>
              </div>
              <button onClick={() => setMockStep(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">

              {mockStep === "ask" && (
                <div className="text-center">
                  <h3 className="font-bold mb-4">
                    Do you have an ID.me account?
                  </h3>

                  <button
                    onClick={() => setMockStep("login")}
                    className="w-full bg-blue-600 text-white py-2 rounded mb-3"
                  >
                    Yes, Sign In
                  </button>

                  <button
                    onClick={() => navigate("/claimant/signup")}
                    className="w-full border py-2 rounded"
                  >
                    Create Account
                  </button>
                </div>
              )}

              {mockStep === "login" && (
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3"
                  />

                  <input
                    type="text"
                    placeholder="Last 4 SSN"
                    maxLength={4}
                    className="w-full border p-2 mb-4"
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                  />

                  <button
                    onClick={handleVerifyProcess}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                  >
                    Login with ID.me
                  </button>
                </div>
              )}

              {mockStep === "verifying" && (
                <div className="text-center">Verifying...</div>
              )}

              {mockStep === "verified" && (
                <div className="text-center text-green-600 font-bold">
                  Verified ✅
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ClaimantLogin;