import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AppHeader from "./components/AppHeader";

import Landing from "./pages/landing";
import ClaimantLogin from "./pages/claimant/ClaimantLogin";
import ClaimantSignup from "./pages/claimant/ClaimantSignup";
import ClaimantDashboard from "./pages/claimant/ClaimantDashboard";
import NewClaimForm from "./pages/claimant/NewClaimForm";
import ClaimDetails from "./pages/claimant/ClaimDetails";

function Layout() {
  const location = useLocation();

  const hideHeaderRoutes = [
    "/claimant/login",
    "/claimant/signup"
  ];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <AppHeader />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/claimant/login" element={<ClaimantLogin />} />
        <Route path="/claimant/signup" element={<ClaimantSignup />} />
        <Route path="/claimant/dashboard" element={<ClaimantDashboard />} />
        <Route path="/claim/:id" element={<ClaimDetails />} />
        <Route path="/claimant/new-claim" element={<NewClaimForm />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;