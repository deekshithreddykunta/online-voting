import axios from "axios";

const API = "http://localhost:5000/api/dashboard";

export const getDashboard = async () => {

    const token = localStorage.getItem("token");

    const res = await axios.get(API + "/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};