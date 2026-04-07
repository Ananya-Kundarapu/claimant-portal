import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { claimsData } from "../../data/claimsData";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  XCircle,
  Search,
} from "lucide-react";
import AppHeader from "../../components/AppHeader";
import AIHelpBot from "../../components/AIHelpBot";

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

const statusConfig = {
  all: { label: "All Claims", icon: FileText },
  pending: { label: "Pending", icon: Clock },
  under_review: { label: "Under Review", icon: Search },
  approved: { label: "Approved", icon: CheckCircle2 },
  rejected: { label: "Rejected", icon: XCircle },
};

function ClaimantDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const claimant = JSON.parse(
    localStorage.getItem("claimant") || '{"name":"User"}'
  );

  const claims =
    filter === "all"
      ? claimsData
      : claimsData.filter((c) => c.status === filter);

    const latestClaim = [...claimsData].sort(
  (a, b) => new Date(b.filedOn) - new Date(a.filedOn)
)[0];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* TITLE */}
       <div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-2xl font-bold">My Claims</h1>

    <div className="text-gray-500 mt-1 text-sm">
      <p>{claimsData.length} total claims</p>

      {latestClaim && (
        <div className="mt-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
          
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            Latest Filing
          </p>

          <p>
            <span className="font-medium text-gray-700">Last Employer:</span>{" "}
            {latestClaim.employer}
          </p>

          <p>
            <span className="font-medium text-gray-700">Reason for Separation:</span>{" "}
            {latestClaim.reason}
          </p>

          <p>
            <span className="font-medium text-gray-700">Filed On:</span>{" "}
            {new Date(latestClaim.submittedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <p>
            <span className="font-medium text-gray-700">Claim Amount:</span>{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(latestClaim.amount)}
          </p>

        </div>
      )}
    </div>

  </div>

          <button
            onClick={() => navigate("/claimant/new-claim")}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            File New Claim
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {["all","pending", "under_review", "approved", "rejected"].map((status) => {
            const cfg = statusConfig[status];
            const count =
  status === "all"
    ? claimsData.length
    : claimsData.filter((c) => c.status === status).length;
            const Icon = cfg.icon;

            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all text-left ${
                  filter === status
                    ? "ring-2 ring-blue-500"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1 rounded-md ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                </div>
                  <span className="text-sm text-gray-500">
                    {cfg.label}
                  </span>
                </div>

                <p className="text-2xl font-bold">{count}</p>
              </button>
            );
          })}
        </div>

        {/* CLAIM LIST */}
        <div className="space-y-3">
          {claims.map((claim) => {
            const cfg = statusConfig[claim.status];
            const StatusIcon = cfg.icon;

            return (
              <div
  key={claim.id}
  onClick={() => navigate(`/claim/${claim.id}`)}
               className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white shadow-sm transition-all cursor-pointer group hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="font-medium">{claim.id}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {claim.reason} • {new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(claim.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 hidden sm:inline">
  {new Date(claim.filedOn).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}
</span>

                  {/* STATUS BADGE */}
                  <span
  className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 ${getStatusColor(claim.status)}`}
>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

      </main>
      <AIHelpBot />
    </div>
  );
}

export default ClaimantDashboard;