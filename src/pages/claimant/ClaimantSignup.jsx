import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  CreditCard,
  Lock,
  ArrowRight,
  Shield,
  Eye,
  Upload,
  EyeOff,
  Camera,
} from "lucide-react";

function ClaimantSignup() {
  const navigate = useNavigate();
    const [mockStep, setMockStep] = useState(null);
const [uploadedFileName, setUploadedFileName] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    ssn: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ SSN FORMATTER
  const formatSSN = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);

    if (digits.length <= 3) return digits;
    if (digits.length <= 5)
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  };

  // ✅ VALIDATION
  const validate = () => {
    let newErrors = {};

    // Email
    if (!form.email.includes("@") || !form.email.includes(".")) {
      newErrors.email = "Enter a valid email address";
    }

    // SSN (must be 9 digits)
    const digits = form.ssn.replace(/\D/g, "");
    if (digits.length !== 9) {
      newErrors.ssn = "Please enter full 9-digit SSN";
    }

    // Password match
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setMockStep("create_credentials");
  };

  const confirmCreateAccount = () => {
    localStorage.setItem(
      "claimant",
      JSON.stringify({
        name: form.name,
        email: form.email,
        ssn: form.ssn,
      })
    );

    navigate("/claimant/dashboard");
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

            <h1 className="text-4xl font-bold mb-4">ClaimShield</h1>

            <p className="text-lg opacity-90 leading-relaxed">
              File and track your insurance claims with AI-powered assistance.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <h2 className="text-2xl font-bold mb-6">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-10 py-2 border rounded-xl"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 py-2 border rounded-xl ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* SSN */}
            <div>
              <label className="text-sm font-medium">SSN</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <input
                  type="text"
                  placeholder="XXX-XX-XXXX"
                  className={`w-full pl-10 py-2 border rounded-xl ${
                    errors.ssn ? "border-red-500" : ""
                  }`}
                  value={form.ssn}
                  onChange={(e) =>
                    setForm({ ...form, ssn: formatSSN(e.target.value) })
                  }
                />
              </div>
              {errors.ssn && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ssn}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2 border rounded-xl"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
    type="button"
    onClick={() =>
  setShowPassword(!showPassword)
}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
  >
    {showPassword ? (
      <EyeOff className="w-5 h-5" />
    ) : (
      <Eye className="w-5 h-5" />
    )}
  </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 py-2 border rounded-xl  ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
  >
    {showConfirmPassword ? (
      <EyeOff className="w-5 h-5" />
    ) : (
      <Eye className="w-5 h-5" />
    )}
  </button>
                
              </div>
              
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button className="w-full bg-primary text-white py-2 rounded-xl">
              Create Account
            </button>

          </form>

   {mockStep && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

      {/* HEADER */}
      <div className="bg-gray-50 border-b p-4 flex justify-between">
        <span className="font-bold text-blue-600">ID.me</span>
        <button onClick={() => setMockStep(null)}>✕</button>
      </div>

      <div className="p-6">

        {/* 🔥 STEP 1 (THIS IS WHAT YOU WANT) */}
        {mockStep === "create_credentials" && (
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">
              Create ID.me Account
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              First, set up your login details.
            </p>

            <button
              onClick={() => setMockStep("upload")}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Continue to Identity Verification
            </button>
          </div>
        )}

       {mockStep === "upload" && (
  <div className="text-center">
    <h3 className="text-lg font-bold mb-2">
      Verify Identity
    </h3>

    <p className="text-sm text-gray-500 mb-6">
      Please upload a valid Driver's License or Passport.
    </p>

    {/* Upload Box */}
    <label
      htmlFor="id-upload-input"
      className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition block w-full"
    >
      <Upload className="w-8 h-8 text-blue-500 mb-2" />

      <span className="text-sm font-medium text-gray-600">
        {uploadedFileName ? uploadedFileName : "Click to browse files"}
      </span>
    </label>

    {/* Hidden Input */}
    <input
      id="id-upload-input"
      type="file"
      accept=".pdf,.jpg,.png"
      className="hidden"
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          setUploadedFileName(e.target.files[0].name);
        }
      }}
    />

    {/* Button */}
    <button
      onClick={() => setMockStep("selfie")}
      className="w-full py-2.5 bg-[#1a56db] text-white rounded-lg font-medium hover:bg-blue-700 transition"
    >
      Upload & Continue
    </button>
  </div>
)}

 {mockStep === "selfie" && (
  <div className="text-center">
    <h3 className="text-lg font-bold mb-2">
      Face Match
    </h3>

    <p className="text-sm text-gray-500 mb-6">
      Take a selfie to match with your provided ID.
    </p>

    {/* Camera Preview Box */}
    <div className="bg-gray-900 rounded-xl h-48 mb-6 flex flex-col items-center justify-center relative overflow-hidden">
      <Camera className="w-10 h-10 text-white/50 mb-2" />

      <span className="text-sm text-white/70">
        Camera Preview Simulated
      </span>

      {/* Overlay border */}
      <div className="absolute inset-0 border-4 border-[#1a56db] rounded-xl opacity-20"></div>
    </div>

    {/* Button */}
    <button
      onClick={() => {
        setMockStep("verifying");

        setTimeout(() => {
          setMockStep("verified");

          setTimeout(() => {
            localStorage.setItem(
              "claimant",
              JSON.stringify({
                name: form.name,
                email: form.email,
                ssn: form.ssn,
              })
            );

            navigate("/claimant/dashboard");
          }, 900);
        }, 1500);
      }}
      className="w-full py-2.5 bg-[#1a56db] text-white rounded-lg font-medium hover:bg-blue-700 transition"
    >
      Take Selfie & Verify
    </button>
  </div>
)}

        {/* VERIFYING */}
        {mockStep === "verifying" && (
          <div className="text-center py-6">
            Verifying...
          </div>
        )}

        {/* VERIFIED */}
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
      </div>
    </div>
  );
}

export default ClaimantSignup;