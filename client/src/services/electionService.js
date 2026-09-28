import axios from "axios";

const API = "https://online-voting-qss7.onrender.com/api/admin/elections";

export const getActiveElection = () => {
    const token = localStorage.getItem("token");

    return axios.get(`${API}/active`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const getActiveElections = () => {
    const token = localStorage.getItem("token");

    return axios.get(
        "https://online-voting-qss7.onrender.com/api/admin/elections/active",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};