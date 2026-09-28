import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./Pages/Admin/Dashboard";
import Officers from "./Pages/Admin/Officers";
import Voters from "./Pages/Admin/Voters";
import Candidates from "./Pages/Admin/Candidates";
import Election from "./Pages/Admin/Election";
import Positions from "./Pages/Admin/Position";
import AdminResults from "./Pages/Admin/Results";
import Reports from "./Pages/Admin/Reports";
import Settings from "./Pages/Admin/Settings";
import AdminProfile from "./Pages/Admin/Profile";

// Voter
import VoterLayout from "./layouts/VoterLayout";
import VoterDashboard from "./Pages/Voter/Dashboard";
import Vote from "./Pages/Voter/Vote";
import Profile from "./Pages/Voter/Profile";
import MyVotes from "./Pages/Voter/MyVotes";
import AvailableElections from "./Pages/Voter/AvailableElections";
import Results from "./Pages/Voter/Results";
import OfficerLayout from "./layouts/OfficerLayout";

import OfficerDashboard from "./Pages/Officer/Dashboard";
import OfficerElections from "./Pages/Officer/Elections";
import OfficerCandidates from "./Pages/Officer/Candidates";
import OfficerPositions from "./Pages/Officer/Positions";
import OfficerVoters from "./Pages/Officer/Voters";
import OfficerResults from "./Pages/Officer/Results";
import OfficerProfile from "./Pages/Officer/Profile";
import CandidateLayout from "./layouts/CandidateLayout";

import CandidateDashboard from "./Pages/Candidate/Dashboard";
import CandidateAvailableElections from "./Pages/Candidate/AvailableElections";
import CandidateProfile from "./Pages/Candidate/Profile";
import ChangePassword from "./Pages/Candidate/ChangePassword";
import Step1Position from "./Pages/Candidate/Nomination/Step1Position";
import Step2Personal from "./Pages/Candidate/Nomination/Step2Personal";
import Step3Election from "./Pages/Candidate/Nomination/Step3Election";
import Step4Qualification from "./Pages/Candidate/Nomination/Step4Qualification";
import Step5Manifesto from "./Pages/Candidate/Nomination/Step5Manifesto";
import Step6Documents from "./Pages/Candidate/Nomination/Step6Documents";
import Step7Declaration from "./Pages/Candidate/Nomination/Step7Declaration";
import Preview from "./Pages/Candidate/Nomination/Preview";
import SubmitSuccess from "./Pages/Candidate/Nomination/SubmitSuccess";
import MyNominations from "./Pages/Candidate/MyNominations";
import CandidateResults from "./Pages/Candidate/Results";
import OfficerLiveVoting from "./Pages/Officer/LiveVoting";
import CreateElection from "./Pages/Officer/CreateElection";
function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="officers" element={<Officers />} />
          <Route path="voters" element={<Voters />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="elections" element={<Election />} />
          <Route path="positions" element={<Positions />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Voter */}
<Route path="/voter" element={<VoterLayout />}>
    <Route index element={<VoterDashboard />} />
    <Route path="vote" element={<Vote />} />
    <Route path="profile" element={<Profile />} />
    <Route path="my-votes" element={<MyVotes />} />
    <Route path="available-elections" element={<AvailableElections />} />
    <Route path="results" element={<Results />} />
</Route>
<Route path="/officer" element={<OfficerLayout />}>

    <Route index element={<OfficerDashboard />} />

    <Route
        path="dashboard"
        element={<OfficerDashboard />}
    />

    <Route
        path="elections"
        element={<OfficerElections />}
    />

    <Route
        path="candidates"
        element={<OfficerCandidates />}
    />

    <Route
        path="positions"
        element={<OfficerPositions />}
    />

    <Route
        path="voters"
        element={<OfficerVoters />}
    />

    <Route
        path="results"
        element={<OfficerResults />}
    />

    <Route
        path="profile"
        element={<OfficerProfile />}
    />
    <Route
    path="live-voting"
    element={<OfficerLiveVoting />}
/>
<Route
    path="elections/create"
    element={<CreateElection />}
/>
</Route>
{/* Candidate */}

<Route path="/candidate" element={<CandidateLayout />}>

    <Route
        index
        element={<CandidateDashboard />}
    />

    <Route
        path="dashboard"
        element={<CandidateDashboard />}
    />
<Route
    path="elections"
    element={<CandidateAvailableElections />}
/>
<Route
    path="profile"
    element={<CandidateProfile />}
/>
<Route
    path="change-password"
    element={<ChangePassword />}
/>
<Route
    path="nomination/:id"
    element={<Step1Position />}
/>

<Route
    path="nomination/personal"
    element={<Step2Personal />}
/>

<Route
    path="nomination/election"
    element={<Step3Election />}
/>

<Route
    path="nomination/qualification"
    element={<Step4Qualification />}
/>

<Route
    path="nomination/manifesto"
    element={<Step5Manifesto />}
/>

<Route
    path="nomination/documents"
    element={<Step6Documents />}
/>

<Route
    path="nomination/declaration"
    element={<Step7Declaration />}
/>

<Route
    path="nomination/preview"
    element={<Preview />}
/>

<Route
    path="nomination/success"
    element={<SubmitSuccess />}
/>
<Route
    path="my-nominations"
    element={<MyNominations />}
/>
<Route
    path="results"
    element={<CandidateResults />}
/>
<Route path="/candidate/results" element={<CandidateResults />} />
</Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;