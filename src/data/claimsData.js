const REQUIRED_UNEMPLOYMENT_DOCS = [
  { id: "id_proof", label: "Identity Proof", required: true },
  { id: "ssn", label: "Social Security Verification", required: true },
  { id: "employment", label: "Proof of Employment", required: true },
  { id: "pay_stubs", label: "Recent Pay Stubs", required: true },
  { id: "separation", label: "Separation Proof", required: true },
  { id: "w2", label: "W-2 / Tax Document", required: false },
];

export const claimsData = [
  {
    id: "CLM001",
    lastEmployer: "Amazon",
    filedOn: "2026-04-01",
    status: "pending",
    amount: 12000,
    reason: "Job Loss due to Layoff",

    personal: {
      name: "Ananya Kundarapu",
      address: "Seattle, WA 98101",
      phone: "(206) 555-0123",
      email: "ananya@gmail.com",
    },

    employmentHistory: [
      {
        employer: "Amazon",
        startDate: "2023-01-10",
        endDate: "2026-03-28",
        reason: "Layoff",
        wage: 5000,
    wageType: "monthly",
      },
    ],

    documents: {
      required: [...REQUIRED_UNEMPLOYMENT_DOCS],
      ai: [
        { name: "Layoff Analysis Report", type: "AI Generated", url: "#" },
      ],
    },
  },

  // ❌ REJECTED FIRST (Jan)
  {
    id: "CLM002",
    lastEmployer: "Tesla",
    filedOn: "2026-01-10",
    status: "rejected",
    amount: 8000,
    reason: "Medical Resignation",

    personal: {
      name: "Ananya Kundarapu",
      address: "Seattle, WA 98101",
      phone: "(206) 555-0123",
      email: "ananya@gmail.com",
    },

    employmentHistory: [
      {
        employer: "Tesla",
        startDate: "2022-05-01",
        endDate: "2025-12-20",
        reason: "Medical Resignation",
        wage: 4500,
  wageType: "monthly",
      },
      {
        employer: "Infosys",
        startDate: "2020-02-01",
        endDate: "2022-04-30",
        wage: 3000,
  wageType: "monthly",
      },
    ],

    documents: {
      required: [...REQUIRED_UNEMPLOYMENT_DOCS],
      ai: [
        { name: "Medical Eligibility Analysis", type: "AI Generated", url: "#" },
      ],
    },
  },

  // 🟡 AFTER 3 MONTHS → UNDER REVIEW
{
  id: "CLM003",
  lastEmployer: "Google",
  filedOn: "2026-03-20",
  status: "under_review",
  amount: 18000,
  reason: "Contract Ended",

  personal: {
    name: "Ananya Kundarapu",
    address: "Seattle, WA 98101",
    phone: "(206) 555-0123",
    email: "ananya@gmail.com",
  },

  employmentHistory: [
    {
      employer: "Google",
      startDate: "2025-01-01",
      endDate: "2026-03-10",
      reason: "Contract Ended",

      wage: 6500,
      wageType: "monthly",
    },
    {
      employer: "Domino's Pizza",
      startDate: "2024-09-01",
      endDate: "2024-12-15",

      wage: 120,
      wageType: "daily",
    },
    {
      employer: "Local Cafe",
      startDate: "2024-05-01",
      endDate: "2024-08-30",

      wage: 15,
      wageType: "hourly",
    },
  ],

  documents: {
    required: [...REQUIRED_UNEMPLOYMENT_DOCS],
    ai: [
      { name: "Contract Risk Analysis", type: "AI Generated", url: "#" },
    ],
  },
},

  // ✅ APPROVED (AFTER VALID GAP)
  {
  id: "CLM004",
  lastEmployer: "Walmart",
  filedOn: "2026-07-05",
  status: "approved",
  amount: 45000,
  reason: "Family Emergency",

  personal: {
    name: "Ananya Kundarapu",
    address: "Seattle, WA 98101",
    phone: "(206) 555-0123",
    email: "ananya@gmail.com",
  },

  employmentHistory: [
    {
      employer: "Walmart",
      startDate: "2025-02-01",
      endDate: "2026-06-30",
      reason: "Family Emergency",

      wage: 3800,
      wageType: "monthly",
    },
    {
      employer: "Amazon Warehouse",
      startDate: "2024-08-01",
      endDate: "2025-01-15",

      wage: 18,
      wageType: "hourly",
    },
    {
      employer: "Food Truck (Street Bites)",
      startDate: "2024-03-01",
      endDate: "2024-07-20",

      wage: 100,
      wageType: "daily",
    },
  ],

  documents: {
    required: [...REQUIRED_UNEMPLOYMENT_DOCS],
    ai: [
      { 
        name: "Family Emergency Justification Report", 
        type: "AI Generated", 
        url: "#" 
      },
      {
        name: "Dependent Care Requirement Analysis",
        type: "AI Generated",
        url: "#"
      }
    ],
  },
},
];