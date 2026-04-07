import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Check, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import DocumentUploadZone from '../../components/DocumentUploadZone';
import AppHeader from "../../components/AppHeader";
import axios from "axios";

const typeConfig = {
  unemployment: { label: 'Unemployment', icon: Briefcase, color: 'text-yellow-600', bg: 'bg-yellow-100' },
};

const requiredDocuments = {
  unemployment: [
    { id: "id_proof", label: "Identity Proof", required: true },
    { id: "ssn", label: "Social Security Verification", required: true },
    { id: "employment", label: "Proof of Employment", required: true },
    { id: "pay_stubs", label: "Recent Pay Stubs", required: true },
    { id: "separation", label: "Separation Proof", required: true },
    { id: "w2", label: "W-2 / Tax Document", required: false },
  ],
};
const NewClaimForm = () => {
    const today = new Date().toISOString().split("T")[0];
    const [subStep, setSubStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [triedSubmit, setTriedSubmit] = useState(false);
const [aiDocuments, setAiDocuments] = useState([]);
const [showPopup, setShowPopup] = useState(false);
const [formData, setFormData] = useState({
  street: "",
  city: "",
  state: "",
  phone: "",
  zip: "",
});
const chatEndRef = useRef(null);
const [openEmployers, setOpenEmployers] = useState([0]);
const [deleteIndex, setDeleteIndex] = useState(null);
const [employers, setEmployers] = useState([
  {
    employer: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    wage: "",
    wageType: "",
    reason: "",
  },
]);
const validateFields = () => {
  const newErrors = {};

  if (!formData.street) newErrors.street = "Street address is required";
  if (!formData.city) newErrors.city = "City is required";
  if (!formData.state) newErrors.state = "State is required";
  if (!formData.zip) newErrors.zip = "ZIP is required";
  if (!formData.phone) {
  newErrors.phone = "Phone number is required";
} else {
  const digits = formData.phone.replace(/\D/g, "");
  if (digits.length !== 10) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }
}
employers.forEach((emp, index) => {
  if (!emp.employer)
    newErrors[`employer_${index}`] = "Employer required";

  if (!emp.jobTitle)
    newErrors[`job_${index}`] = "Job title required";

if (!emp.startDate) {
  newErrors[`start_${index}`] = "Start date required";
}

if (!emp.endDate) {
  newErrors[`end_${index}`] = "End date required";
}

if (emp.startDate && emp.endDate) {
  const start = new Date(emp.startDate);
  const end = new Date(emp.endDate);
  const todayDate = new Date();

  if (end < start) {
    newErrors[`end_${index}`] = "End date cannot be before start date";
  }

  if (start > todayDate) {
    newErrors[`start_${index}`] = "Start date cannot be in future";
  }

  if (end > todayDate) {
    newErrors[`end_${index}`] = "End date cannot be in future";
  }
}

  if (!emp.wage)
    newErrors[`wage_${index}`] = "Wage required";

  if (!emp.wageType)
    newErrors[`wageType_${index}`] = "Wage type required";

  if (index === 0 && !emp.reason)
    newErrors[`reason_${index}`] = "Reason required";
});

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const [chatMessages, setChatMessages] = useState([]);
const [currentQuestion, setCurrentQuestion] = useState(null);
const [aiAnswers, setAiAnswers] = useState({});
const [loadingAI, setLoadingAI] = useState(false);
const [inputValue, setInputValue] = useState("");
const [aiFinished, setAiFinished] = useState(false);
const [initialLoading, setInitialLoading] = useState(false);
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chatMessages, loadingAI]);
const startAI = async () => {
  try {
    setInitialLoading(true); 

    const res = await axios.post(
      "http://localhost:5000/api/ai/next-question",
      { formData, employers, answers: {} }
    );

    setCurrentQuestion(res.data);

    setChatMessages([
      { sender: "ai", text: res.data.question }
    ]);

    setInitialLoading(false);

  } catch (err) {
    console.error(err);
    setInitialLoading(false);
  }
};

const handleAnswer = async (value) => {
  const updatedAnswers = {
    ...aiAnswers,
    [currentQuestion.field]: value,
  };

  setAiAnswers(updatedAnswers);
  setChatMessages((prev) => [
    ...prev,
    { sender: "user", text: value }
  ]);

  setLoadingAI(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/ai/next-question",
      {
        formData,
        employers,
        answers: updatedAnswers,
      }
    );

    if (res.data.done) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.data.message }
      ]);

      setAiDocuments(res.data.documents || []);
      setAiFinished(true); // 🔥 IMPORTANT

      setCurrentQuestion(null); // stop input

      setLoadingAI(false);
      return;
    }
    setCurrentQuestion(res.data);

    setChatMessages((prev) => [
      ...prev,
      { sender: "ai", text: res.data.question }
    ]);

    setLoadingAI(false);

  } catch (err) {
    console.error(err);
    setLoadingAI(false);
  }
};

  const navigate = useNavigate();
  const [step, setStep] = useState(0);
const [type] = useState('unemployment');
  const [docFiles, setDocFiles] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Claim Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your {typeConfig[type].label} claim has been submitted successfully.
          </p>
          <button
            onClick={() => navigate('/claimant/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    // STEP 2
    <div key="details" className="space-y-5">
      <h3 className="text-lg font-semibold">
{subStep === 0
  ? "Personal Information"
  : "Employer Details"
}
</h3>

<div className="space-y-4">

  {/* 🔹 PERSONAL INFO */}
  {subStep === 0 && (
    <>
      {/* 🔹 FULL NAME */}
<div>
  <label className="text-sm font-medium">Full Name</label>
  <input
    value="Ananya Kundarapu"
    disabled
    className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-600"
    placeholder="Full Name"
  />
</div>

{/* 🔹 EMAIL */}
<div>
  <label className="text-sm font-medium">Email Address</label>
  <input
    value="ananya@gmail.com"
    disabled
    className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-600"
    placeholder="Email Address"
  />
</div>

{/* 🔹 SSN */}
<div>
  <label className="text-sm font-medium">Social Security Number (SSN)</label>
  <input
    value="***-**-1234"
    disabled
    className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-600"
    placeholder="XXX-XX-XXXX"
  />
</div>

      {/* 🔹 STREET + HOUSE */}
<div>
  <label className="text-sm font-medium">Street Address</label>
  <input
    placeholder="e.g. 123 Main St"
    className={`w-full border rounded-md px-3 py-2 mt-1 ${
      errors.street ? "border-red-500" : ""
    }`}
    value={formData.street}
    onChange={(e) => {
      setFormData({ ...formData, street: e.target.value });
      setErrors({ ...errors, street: "" });
    }}
  />

  {errors.street && (
    <p className="text-red-500 text-xs mt-1">{errors.street}</p>
  )}
</div>

{/* 🔹 CITY */}
<div className="grid grid-cols-2 gap-4">

  <div>
    <label className="text-sm font-medium">City / Town</label>
    <input
      placeholder="e.g. Los Angeles"
      className={`w-full border rounded-md px-3 py-2 mt-1 ${
        errors.city ? "border-red-500" : ""
      }`}
      value={formData.city}
      onChange={(e) => {
        setFormData({ ...formData, city: e.target.value });
        setErrors({ ...errors, city: "" });
      }}
    />
    {errors.city && (
      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
    )}
  </div>

  {/* 🔹 ZIP CODE */}
  <div>
    <label className="text-sm font-medium">ZIP Code</label>
    <input
      placeholder="e.g. 90001"
      className={`w-full border rounded-md px-3 py-2 mt-1 ${
        errors.zip ? "border-red-500" : ""
      }`}
      value={formData.zip}
      onChange={(e) => {
        setFormData({ ...formData, zip: e.target.value });
        setErrors({ ...errors, zip: "" });
      }}
    />
    {errors.zip && (
      <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
    )}
  </div>

</div>

{/* 🔹 STATE DROPDOWN */}
<div>
  <label className="text-sm font-medium">State</label>

  <select
    className={`w-full border rounded-md px-3 py-2 mt-1 ${
      errors.state ? "border-red-500" : ""
    }`}
    value={formData.state}
    onChange={(e) => {
      setFormData({ ...formData, state: e.target.value });
      setErrors({ ...errors, state: "" });
    }}
  >
    <option value="">Select State</option>

    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    <option value="AR">Arkansas</option>
    <option value="CA">California</option>
    <option value="CO">Colorado</option>
    <option value="CT">Connecticut</option>
    <option value="DE">Delaware</option>
    <option value="FL">Florida</option>
    <option value="GA">Georgia</option>
    <option value="HI">Hawaii</option>
    <option value="ID">Idaho</option>
    <option value="IL">Illinois</option>
    <option value="IN">Indiana</option>
    <option value="IA">Iowa</option>
    <option value="KS">Kansas</option>
    <option value="KY">Kentucky</option>
    <option value="LA">Louisiana</option>
    <option value="ME">Maine</option>
    <option value="MD">Maryland</option>
    <option value="MA">Massachusetts</option>
    <option value="MI">Michigan</option>
    <option value="MN">Minnesota</option>
    <option value="MS">Mississippi</option>
    <option value="MO">Missouri</option>
    <option value="MT">Montana</option>
    <option value="NE">Nebraska</option>
    <option value="NV">Nevada</option>
    <option value="NH">New Hampshire</option>
    <option value="NJ">New Jersey</option>
    <option value="NM">New Mexico</option>
    <option value="NY">New York</option>
    <option value="NC">North Carolina</option>
    <option value="ND">North Dakota</option>
    <option value="OH">Ohio</option>
    <option value="OK">Oklahoma</option>
    <option value="OR">Oregon</option>
    <option value="PA">Pennsylvania</option>
    <option value="RI">Rhode Island</option>
    <option value="SC">South Carolina</option>
    <option value="SD">South Dakota</option>
    <option value="TN">Tennessee</option>
    <option value="TX">Texas</option>
    <option value="UT">Utah</option>
    <option value="VT">Vermont</option>
    <option value="VA">Virginia</option>
    <option value="WA">Washington</option>
    <option value="WV">West Virginia</option>
    <option value="WI">Wisconsin</option>
    <option value="WY">Wyoming</option>
    <option value="DC">District of Columbia</option>
  </select>

  {errors.state && (
    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
  )}
</div>

<div>
  <label className="text-sm font-medium">Phone Number</label>

  <div
    className={`flex items-center border rounded-md px-3 py-2 mt-1 ${
      errors.phone ? "border-red-500" : ""
    }`}
  >
    <span className="text-gray-500 mr-2">+1</span>

    <input
      type="tel"
      placeholder="(123) 456-7890"
      className="w-full outline-none"
      value={formData.phone}
      onChange={(e) => {
  let val = e.target.value.replace(/\D/g, "");
  val = val.slice(0, 10);

  if (val.length <= 3) {
    val = val;
  } else if (val.length <= 6) {
    val = `(${val.slice(0, 3)}) ${val.slice(3)}`;
  } else {
    val = `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6, 10)}`;
  }

  const digits = val.replace(/\D/g, "");

  let errorMsg = "";
  if (digits.length > 0 && digits.length < 10) {
    errorMsg = "Enter a valid 10-digit phone number";
  }

  setFormData({ ...formData, phone: val });
  setErrors({ ...errors, phone: errorMsg });
}}
    />
  </div>

  {errors.phone && (
    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
  )}
</div>
    </>
  )}

{subStep === 1 && (
  <div className="space-y-4">

    {employers.map((emp, index) => {
      const isOpen = openEmployers.includes(index);

      return (
        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">

          {/* HEADER */}
          <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-800">
                Employer {index + 1} {index === 0 ? "(Latest)" : ""}
              </h4>

              {!isOpen && emp.employer && (
                <p className="text-sm text-gray-500">{emp.employer}</p>
              )}
            </div>

            <button
  onClick={() => {
    if (isOpen) {
      setOpenEmployers(openEmployers.filter(i => i !== index));
    } else {
      setOpenEmployers([...openEmployers, index]);
    }
  }}
  className="text-gray-600"
>
  {isOpen ? <ChevronUp /> : <ChevronDown />}
</button>
          </div>

          {/* BODY */}
          {isOpen && (
            <div className="p-4 space-y-4">

              <div>
  <label className="text-sm font-medium">Company Name</label>

  <input
    placeholder="eg: Google"
    value={emp.employer || ""}
    className={`w-full border rounded-md px-3 py-2 mt-1 ${
  triedSubmit && errors[`employer_${index}`] ? "border-red-500" : ""
}`}
    onChange={(e) => {
      const updated = [...employers];
      updated[index].employer = e.target.value;
      setEmployers(updated);

      setErrors({ ...errors, [`employer_${index}`]: "" });
    }}
  />

  {errors[`employer_${index}`] && (
    <p className="text-red-500 text-xs mt-1">
      {errors[`employer_${index}`]}
    </p>
  )}
</div>

            <div>
  <label className="text-sm font-medium">Job Title</label>

  <input
    placeholder="eg: Software Engineer"
    value={emp.jobTitle || ""}
    className={`w-full border rounded-md px-3 py-2 mt-1 ${
      triedSubmit && errors[`job_${index}`] ? "border-red-500" : ""
    }`}
    onChange={(e) => {
      const updated = [...employers];
      updated[index].jobTitle = e.target.value;
      setEmployers(updated);

      setErrors({ ...errors, [`job_${index}`]: "" });
    }}
  />

  {errors[`job_${index}`] && (
    <p className="text-red-500 text-xs mt-1">
      {errors[`job_${index}`]}
    </p>
  )}
</div>

  <div className="grid grid-cols-2 gap-4">

  {/* START DATE */}
  <div>
    <label className="text-sm font-medium">Start Date</label>

    <input
      type="date"
      max={today}
      value={emp.startDate || ""}
      className={`w-full border rounded-md px-3 py-2 mt-1 ${
        triedSubmit && errors[`start_${index}`] ? "border-red-500" : ""
      }`}
      onChange={(e) => {
        const updated = [...employers];
        updated[index].startDate = e.target.value;
        setEmployers(updated);

        setErrors({ ...errors, [`start_${index}`]: "" });
      }}
    />

    {errors[`start_${index}`] && (
      <p className="text-red-500 text-xs mt-1">
        {errors[`start_${index}`]}
      </p>
    )}
  </div>

  {/* END DATE */}
  <div>
    <label className="text-sm font-medium">End Date</label>

    <input
      type="date"
      max={today}
      value={emp.endDate || ""}
      className={`w-full border rounded-md px-3 py-2 mt-1 ${
        triedSubmit && errors[`end_${index}`] ? "border-red-500" : ""
      }`}
      onChange={(e) => {
        const updated = [...employers];
        updated[index].endDate = e.target.value;
        setEmployers(updated);

        setErrors({ ...errors, [`end_${index}`]: "" });
      }}
    />

    {errors[`end_${index}`] && (
      <p className="text-red-500 text-xs mt-1">
        {errors[`end_${index}`]}
      </p>
    )}
  </div>

</div>

   <div className="grid grid-cols-2 gap-4">

  {/* WAGE */}
  <div>
    <label className="text-sm font-medium">Wage</label>

    <input
      type="number"
      placeholder="eg: 5000"
      value={emp.wage || ""}
      className={`w-full border rounded-md px-3 py-2 mt-1 ${
        triedSubmit && errors[`wage_${index}`] ? "border-red-500" : ""
      }`}
      onChange={(e) => {
        const updated = [...employers];
        updated[index].wage = e.target.value;
        setEmployers(updated);

        setErrors({ ...errors, [`wage_${index}`]: "" });
      }}
    />

    {errors[`wage_${index}`] && (
      <p className="text-red-500 text-xs mt-1">
        {errors[`wage_${index}`]}
      </p>
    )}
  </div>

  {/* WAGE TYPE */}
  <div>
    <label className="text-sm font-medium">Wage Frequency</label>

    <select
      value={emp.wageType || ""}
      className={`w-full border rounded-md px-3 py-2 mt-1 ${
        triedSubmit && errors[`wageType_${index}`] ? "border-red-500" : ""
      }`}
      onChange={(e) => {
        const updated = [...employers];
        updated[index].wageType = e.target.value;
        setEmployers(updated);

        setErrors({ ...errors, [`wageType_${index}`]: "" });
      }}
    >
      <option value="">Select</option>
      <option value="hourly">Hourly</option>
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="biweekly">Bi-weekly</option>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
    </select>

    {errors[`wageType_${index}`] && (
      <p className="text-red-500 text-xs mt-1">
        {errors[`wageType_${index}`]}
      </p>
    )}
  </div>

</div>

              {index === 0 && (
               <div>
  <label className="text-sm font-medium">Reason for Separation</label>

  <select
    value={emp.reason || ""}
    className={`w-full border rounded-md px-3 py-2 mt-1 ${
    triedSubmit &&errors[`reason_${index}`] ? "border-red-500" : ""
    }`}
    onChange={(e) => {
      const updated = [...employers];
      updated[0].reason = e.target.value;
      setEmployers(updated);

      setErrors({ ...errors, [`reason_${index}`]: "" });
    }}
  >
    <option value="">Select</option>
    <option value="layoff">Laid Off</option>
    <option value="fired">Fired</option>
    <option value="resigned">Resigned</option>
    <option value="contract_end">Contract Ended</option>
    <option value="temporary_job_end">Temporary Job Ended</option>
    <option value="business_closed">Business Closed</option>
    <option value="reduction_hours">Reduction in Hours</option>
    <option value="medical">Medical</option>
    <option value="family">Family</option>
    <option value="relocation">Relocation</option>
    <option value="job_refusal">Refused Job</option>
    <option value="other">Other</option>
  </select>

  {errors[`reason_${index}`] && (
    <p className="text-red-500 text-xs mt-1">
      {errors[`reason_${index}`]}
    </p>
  )}
</div>
 )}
            {index > 0 && (
  <button
    onClick={() => setDeleteIndex(index)}
    className="w-full border-t pt-3 mt-2 flex justify-center text-red-500"
  >
    <Trash2 className="w-4 h-4 mr-2" />
    Delete Employer
  </button>
)}
            </div>
            
          )}
        </div>
        
      );
    })}

    {/* ADD EMPLOYER */}
    <button
      type="button"
      onClick={() => {
  const updated = [
    ...employers,
    {
      employer: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      wage: "",
      wageType: "",
      reason: "",
    },
  ];

  setEmployers(updated);
  setOpenEmployers([updated.length - 1]);
}}
      className="w-full py-3 border-2 border-dashed rounded-xl text-blue-600"
    >
      + Add Another Employer
    </button>

  </div>
)}
</div>
    </div>,
<div key="ai" className="space-y-6">

  <h3 className="text-lg font-semibold">
    Answer a few quick questions
  </h3>

  {initialLoading && (
  <div className="flex items-center gap-2 text-blue-600">
    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <span>Preparing your questions...</span>
  </div>
)}

<div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
  {chatMessages.map((msg, index) => (
    <div
      key={index}
      className={`p-3 rounded-md max-w-[80%] ${
        msg.sender === "ai"
          ? "bg-gray-100"
          : "bg-blue-600 text-white ml-auto"
      }`}
    >
      {msg.text}
    </div>
  ))}

  {loadingAI && (
    <div className="text-sm text-gray-500">Typing...</div>
  )}
    <div ref={chatEndRef} />


</div>

{currentQuestion && !loadingAI && !aiFinished && (
  <div className="mt-4">

    {currentQuestion.type === "boolean" ? (
      <div className="flex gap-4">
        <button
          onClick={() => handleAnswer("yes")}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Yes
        </button>

        <button
          onClick={() => handleAnswer("no")}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          No
        </button>
      </div>
    ) : (
      <div className="flex gap-2">
  <input
    type="text"
    placeholder="Type your answer..."
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    className="w-full border rounded-md px-3 py-2"
  />

  <button
    onClick={() => {
      if (!inputValue.trim()) return;
      handleAnswer(inputValue);
      setInputValue("");
    }}
    className="px-4 py-2 bg-blue-600 text-white rounded-md"
  >
    Send
  </button>
</div>
    )}

  </div>
)}

</div>,
    // STEP 3
    <div key="docs" className="space-y-6">
      <h3 className="text-lg font-semibold">Upload Documents</h3>

<DocumentUploadZone
  requiredDocs={[...requiredDocuments[type], ...aiDocuments]}
  files={docFiles}
  onFilesChange={setDocFiles}
/>
<button
  onClick={() => {
const allDocs = [...requiredDocuments[type], ...aiDocuments];
const required = allDocs.filter(doc => doc.required);
    const allUploaded = required.every(doc => docFiles[doc.id]);

    if (!allUploaded) {
      alert("Please upload all required documents");
      return;
    }
    console.log("Form Data:", formData);
    console.log("AI Answers:", aiAnswers);
    console.log("Documents:", docFiles);
    const newClaim = {
  id: "CLM" + Date.now(),
  status: "pending",
  filedOn: new Date().toISOString(),

  // for dashboard preview
  employer: employers[0]?.employer,
  reason: employers[0]?.reason,
  amount: 0,

  // 🔥 FULL DATA
  formData,
  employers,
};

// get existing claims
const existingClaims = JSON.parse(localStorage.getItem("claims")) || [];

// save
localStorage.setItem(
  "claims",
  JSON.stringify([newClaim, ...existingClaims])
);

// then navigate
navigate("/claimant/claim-details", {
  state: newClaim,
});
  }}
  className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-md"
>
  Submit Claim
</button>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

<main className="max-w-2xl mx-auto px-6 py-8">

  <div className="flex items-center gap-3 mb-6">
  <button
    onClick={() => navigate('/claimant/dashboard')}
    className="text-gray-600 hover:text-black"
  >
    <ArrowLeft className="w-5 h-5" />
  </button>
  <span className="font-semibold text-lg">New Claim</span>
</div>
        <div className="flex items-center mb-8">
          {['Details', 'Questions', 'Documents'].map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${i <= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
              `}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>

              <span className={`ml-2 text-sm ${i <= step ? 'text-black font-medium' : 'text-gray-400'}`}>
                {label}
              </span>

              {i < 2 && (
                <div className={`flex-1 h-[2px] mx-3 
                  ${i < step ? 'bg-blue-600' : 'bg-gray-300'}
                `}></div>
              )}
            </div>
          ))}
        </div>
{showPopup && (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    onClick={() => setShowPopup(false)}
  >
    <div
      className="bg-white rounded-lg p-6 shadow-lg w-[350px] relative"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold mb-2 text-blue-600">
        Please check before proceeding
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Make sure all details are correct. You cannot go back after this step.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowPopup(false)}
          className="px-4 py-2 border rounded-md"
        >
          No
        </button>

  <button
  onClick={() => {
    setTriedSubmit(true);
    const isValid = validateFields();

    if (!isValid) {
      alert("Please fill all the fields");

      const firstErrorKey = Object.keys(errors)[0];

      if (firstErrorKey && firstErrorKey.includes("_")) {
        const index = parseInt(firstErrorKey.split("_")[1]);

        if (!isNaN(index)) {
          setOpenEmployers([index]);
        }
      }

      return;
    }
    setShowPopup(false);
    startAI();
    setStep(1);
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded-md"
>
  Yes
</button>
      </div>
    </div>
  </div>
)}

{deleteIndex !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-[300px]">
      <h3 className="font-semibold mb-3">Delete Employer?</h3>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setDeleteIndex(null)}
          className="px-3 py-1 border rounded"
        >
          No
        </button>

        <button
          onClick={() => {
  const updated = employers.filter((_, i) => i !== deleteIndex);
  setDeleteIndex(null);
  setEmployers(updated);
  setOpenEmployers(
    updated.map((_, i) => i)
  );
}}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}

        {steps[step]}
<div className="flex items-center mt-8">

{step === 0 && subStep > 0 ? (
      <button
    onClick={() => {
      if (step === 0 && subStep === 1) {
        setSubStep(0);
      } else if (step === 1) {
        setStep(0);
      }
    }}
    className="px-4 py-2 border rounded-md flex items-center gap-2"
  >
    <ArrowLeft className="w-4 h-4" /> Back
  </button>
) : (
  <div />
)}

  <div className="ml-auto">

    {/* STEP 0 → Personal Info */}
    {step === 0 && subStep === 0 && (
      <button
        onClick={() => {
  setSubStep(1);
}}
        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
      >
        Next <ArrowRight className="w-4 h-4" />
      </button>
    )}

{step === 0 && subStep === 1 && (
  <button
    onClick={() => {
  setShowPopup(true);
}}
    className="px-4 py-2 bg-blue-600 text-white rounded-md"
  >
    Proceed →
  </button>
)}

    {step === 1 && aiFinished && (
  <button
    onClick={() => setStep(2)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Next →
      </button>
    )}

  </div>
</div>
      </main>
    </div>
  );
};

export default NewClaimForm;