import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  CreditCard,
  Copy,
  Eye,User, MapPin, Phone, Mail, XCircle, Clock, Search 
} from "lucide-react";
import { claimsData } from "../../data/claimsData";

export default function ClaimDetail() {
  const { id } = useParams();
  const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "under_review":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "under_review":
      return <Search className="w-4 h-4" />;
    case "approved":
      return <CheckCircle2 className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};
 const storedClaims = JSON.parse(localStorage.getItem("claims")) || [];

const allClaims = [...storedClaims, ...claimsData];

const claim = allClaims.find((c) => c.id === id);

  if (!claim) return null;

  const steps = ["Applied", "Pending", "Under Review", "Approved", "Payment Completed"];

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">

      {/* BACK */}
      <Link
        to="/claimant/dashboard"
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </Link>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{claim.id}</h1>

           <span
  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
    claim.status
  )}`}
>
  {getStatusIcon(claim.status)}
  {claim.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
</span>
          </div>

          <p className="text-gray-500">
            Filed on {new Date(claim.filedOn).toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})} • {claim.lastEmployer}
          </p>
        </div>

        </div>

      {/* TIMELINE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-6">
 <div className="flex items-center justify-center w-full">

    {steps.map((label, i) => {
      const statusStepMap = {
  pending: 1,
  under_review: 2,
  approved: 3,
  rejected: 3, 
};

const currentStep = statusStepMap[claim.status] ?? 1;
      return (
        <div key={i} className="flex items-center flex-1 relative max-w-[250px]">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition
              ${
                i < currentStep
  ? "bg-blue-600 text-white"
  : claim.status === "rejected" && i === currentStep
  ? "bg-red-600 text-white"
  : i === currentStep
  ? "border-2 border-blue-600 text-blue-600"
  : "bg-gray-200 text-gray-500"
              }
            `}
          >
{claim.status === "rejected" && i === currentStep ? (
  <XCircle className="w-4 h-4" />
) : i <= currentStep - 1 ? (
  <CheckCircle2 className="w-4 h-4" />
) : (
  i + 1
)}
          </div>
          <div className="flex flex-col items-start ml-2">

  <span
    className={`text-sm whitespace-nowrap ${
      i <= currentStep
        ? "text-slate-900 font-medium"
        : "text-gray-400"
    }`}
  >
    {claim.status === "rejected" && label === "Approved"
  ? "Rejected"
  : label}
  </span>

  {label === "Payment Completed" && claim.status === "Payment Completed" && (
    <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">

      <span>{claim.referenceNumber}</span>

      <button
        onClick={() => {
          navigator.clipboard.writeText(claim.referenceNumber);
        }}
        className="hover:text-blue-800"
      >
        <Copy className="w-3 h-3" />
      </button>

    </div>
  )}

</div>

          {i !== steps.length - 1 && (
            <div
              className={`flex-1 h-[2px] mx-3 transition
                ${
                  i < currentStep || (claim.status === "approved" && i === currentStep)
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }
              `}
            />
          )}
        </div>
      );
    })}

  </div>
</div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* CLAIM INFO */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-blue-600" />
              Claim Information
            </h2>

            <div className="grid md:grid-cols-2 gap-10">

  {/* 🔵 PERSONAL DETAILS */}
  <div>
    <p className="text-xs text-gray-400 font-semibold mb-4 tracking-wide">
      PERSONAL DETAILS
    </p>

    <div className="space-y-3 text-sm text-gray-700">

      <p className="flex items-center gap-3">
  <User className="w-4 h-4 text-gray-400" />
  {claim.personal.name}
</p>

<p className="flex items-center gap-3">
  <MapPin className="w-4 h-4 text-gray-400" />
  {claim.personal.address}
</p>

<p className="flex items-center gap-3">
  <Phone className="w-4 h-4 text-gray-400" />
  {claim.personal.phone}
</p>

<p className="flex items-center gap-3">
  <Mail className="w-4 h-4 text-gray-400" />
  {claim.personal.email}
</p>

    </div>
  </div>

  {/* 🟣 EMPLOYMENT HISTORY */}
  <div>
    <p className="text-xs text-gray-400 font-semibold mb-4 tracking-wide">
      EMPLOYMENT HISTORY
    </p>

    <div className="space-y-4">

      {claim.employmentHistory.map((emp, index) => (
        <div
          key={index}
          className="bg-gray-50 p-4 rounded-2xl border border-gray-200"
        >
          <p className="font-semibold text-gray-900">
            {emp.employer}
          </p>

          <p className="text-sm text-gray-500">
            {emp.startDate} to {emp.endDate}
          </p>
        {emp.wage && (
      <p className="text-sm text-gray-700 mt-1">
        Wage: ${emp.wage} / {emp.wageType}
      </p>
    )}
          {/* ✅ ONLY LATEST SHOWS REASON */}
          {index === 0 && emp.reason && (
            <p className="text-sm text-gray-700 mt-1">
              Reason: {emp.reason}
            </p>
          )}
        </div>
      ))}

    </div>
  </div>

</div>
          </div>

          {/* BENEFITS */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-blue-600" />
              Benefit Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Weekly</p>
                <p className="font-semibold">
                  ${(claim.amount / 26).toFixed(2)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold">${claim.amount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - DOCUMENTS */}
        <div>
          <div className="bg-white rounded-2xl border p-6">

            <h2 className="font-semibold flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-600" />
              Uploaded Documents
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              All documents submitted for this claim
            </p>

            {/* LIST */}
            <div className="space-y-3">
              {[
  ...(claim.documents?.required || []),
  ...(claim.documents?.ai || [])
].map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border border-dashed hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />

                    <div>
                      <p className="text-sm font-medium">
  {doc.label || doc.name}
</p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(doc.url, "_blank")}
                    className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}