import axios from "axios";

const API = "http://localhost:5000/api/vote";

const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const getBallot = () => {
    return axios.get(`${API}/ballot`, authHeader());
};

export const castVote = (data) => {
    return axios.post(API, data, authHeader());
};
export const getVotingStatus = () => {
    return axios.get(`${API}/status`, authHeader());
};
export const getMyVotes = () => {
    return axios.get(`${API}/my-votes`, authHeader());
};
