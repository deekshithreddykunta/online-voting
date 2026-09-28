import axios from "axios";

const API = "https://online-voting-qss7.onrender.com/api/candidate";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

// ==============================
// Dashboard
// ==============================

export const getDashboard = () =>
    axios.get(`${API}/dashboard`, authHeader());

// ==============================
// Profile
// ==============================

export const getCandidateProfile = () =>
    axios.get(`${API}/profile`, authHeader());

export const updateCandidateProfile = (data) =>
    axios.put(`${API}/profile`, data, authHeader());

export const changeCandidatePassword = (data) =>
    axios.put(`${API}/change-password`, data, authHeader());

// ==============================
// Elections
// ==============================

export const getAvailableElections = () =>
    axios.get(`${API}/elections`, authHeader());

export const getPositions = (electionId) =>
    axios.get(
        `${API}/elections/${electionId}/positions`,
        authHeader()
    );

// ==============================
// Applications
// ==============================

export const getApplications = () =>
    axios.get(`${API}/nominations`, authHeader());

export const applyElection = (data) =>
    axios.post(
        `${API}/applications`,
        data,
        authHeader()
    );
export const submitNomination = (data) =>
    axios.post(
        `${API}/submit-nomination`,
        data,
        authHeader()
    );
export const getMyNominations = () =>
    axios.get(
        `${API}/nominations`,
        authHeader()
    );
export const getCandidateResults = () =>
    axios.get(
        `${API}/results`,
        authHeader()
    );
 export const checkNomination = async (electionId, positionId) => {

    const res = await axios.get(
        `${API}/check-nomination`,
        {
            params: {
                election_id: electionId,
                position_id: positionId
            },
            ...authHeader()
        }
    );

    return res.data;

};