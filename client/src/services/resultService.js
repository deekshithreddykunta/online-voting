import axios from "axios";

const BASE_URL = "http://localhost:5000/api/admin/results";

const token = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export const getResults = async () => {
    const res = await axios.get(BASE_URL, token());
    return res.data;
};

export const getWinners = async () => {
    const res = await axios.get(`${BASE_URL}/winners`, token());
    return res.data;
};

export const getVoterResults = async () => {
    const res = await axios.get(BASE_URL, token());
    return res.data;
};