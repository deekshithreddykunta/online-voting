import axios from "axios";

const API = "http://localhost:5000/api/admin/elections";

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
        "http://localhost:5000/api/admin/elections/active",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};