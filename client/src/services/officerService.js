import axios from "axios";

const API = "https://online-voting-qss7.onrender.com/api/officer";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});
export const activateElection = (id) =>
    axios.put(
        `${API}/elections/${id}/activate`,
        {},
        authHeader()
    );

export const closeElection = (id) =>
    axios.put(
        `${API}/elections/${id}/close`,
        {},
        authHeader()
    );
export const getElectionById = (id) =>
    axios.get(
        `${API}/elections/${id}`,
        authHeader()
    );
export const updateElection = (id, data) =>
    axios.put(
        `${API}/elections/${id}`,
        data,
        authHeader()
    );
export const deleteElection = (id) =>
    axios.delete(
        `${API}/elections/${id}`,
        authHeader()
    );
export const getApplications = () =>
    axios.get(
        `${API}/applications`,
        authHeader()
    );


export const getApplicationById = (id) =>
    axios.get(`${API}/applications/${id}`, authHeader());

export const approveApplication = (id) =>
    axios.put(
        `${API}/applications/${id}/approve`,
        {},
        authHeader()
    );

export const rejectApplication = (id, remarks) =>
    axios.put(
        `${API}/applications/${id}/reject`,
        { remarks },
        authHeader()
    );
export const getPositions = async () => {

    const res = await axios.get(

        `${API}/positions`,

        authHeader()

    );

    return res.data;

};
export const getPositionById = async (id) => {

    const res = await axios.get(

        `${API}/positions/${id}`,

        authHeader()

    );

    return res.data;

};
export const createPosition = async (data) => {

    const res = await axios.post(

        `${API}/positions`,

        data,

        authHeader()

    );

    return res.data;

};
export const updatePosition = async (id, data) => {

    const res = await axios.put(

        `${API}/positions/${id}`,

        data,

        authHeader()

    );

    return res.data;

};
export const deletePosition = async (id) => {

    const res = await axios.delete(

        `${API}/positions/${id}`,

        authHeader()

    );

    return res.data;

};
export const getDashboard = () =>
    axios.get(`${API}/dashboard`, authHeader());

export const getElections = async () => {

    const res = await axios.get(

        `${API}/elections`,

        authHeader()

    );

    return res.data;

};
export const getVoters = async (search = "") => {
    const res = await axios.get(
        `${API}/voters?search=${encodeURIComponent(search)}`,
        authHeader()
    );
    return res.data;
};
export const getVoterById = async (id) => {
    const res = await axios.get(
        `${API}/voters/${id}`,
        authHeader()
    );
    return res.data;
};

export const verifyVoter = async (id) => {
    const res = await axios.put(
        `${API}/voters/${id}/verify`,
        {},
        authHeader()
    );
    return res.data;
};
export const getVotingStatus = async (id) => {
    const res = await axios.get(
        `${API}/voters/${id}/voting-status`,
        authHeader()
    );
    return res.data;
};
export const getResults = async () => {
    const res = await axios.get(
        `${API}/results`,
        authHeader()
    );
    return res.data;
};
export const generateResults = async (data) => {
    const res = await axios.post(
        `${API}/results/generate`,
        data,
        authHeader()
    );
    return res.data;
};
export const getResultByElection = async (electionId) => {
    const res = await axios.get(
        `${API}/results/election/${electionId}`,
        authHeader()
    );
    return res.data;
};
export const publishResults = async (data) => {
    const res = await axios.post(
        `${API}/results/publish`,
        data,
        authHeader()
    );
    return res.data;
};
export const getLiveVoting = async () => {
    const res = await axios.get(
        `${API}/live-voting`,
        authHeader()
    );
    return res.data;
};
export const getProfile = async () => {
    const res = await axios.get(`${API}/profile`, authHeader());
    return res.data;
};

export const updateProfile = async (data) => {
    const res = await axios.put(`${API}/profile`, data, authHeader());
    return res.data;
};

export const changePassword = async (data) => {
    const res = await axios.put(`${API}/change-password`, data, authHeader());
    return res.data;
};
export const createElection = (data) =>
    axios.post(`${API}/elections`, data, authHeader());


export const assignSymbol = async (id, data) => {
    const res = await axios.put(`${API}/applications/${id}/symbol`, data, authHeader());
    return res.data;
};