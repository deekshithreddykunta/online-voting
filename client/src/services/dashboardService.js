import axios from "axios";

const API = "https://online-voting-qss7.onrender.com/api/dashboard";

export const getDashboard = async () => {

    const token = localStorage.getItem("token");

    const res = await axios.get(API + "/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};