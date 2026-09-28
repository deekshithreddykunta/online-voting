import axios from "axios";

const API = "http://localhost:5000/api/auth";

// ===============================
// AUTH
// ===============================
export const registerUser = (data) =>
    axios.post(`${API}/register`, data);

export const loginUser = (data) =>
    axios.post(`${API}/login`, data);

export const forgotPassword = (data) =>
    axios.post(`${API}/forgot-password`, data);

export const verifyOTP = (data) =>
    axios.post(`${API}/verify-otp`, data);

export const resetPassword = (data) =>
    axios.post(`${API}/reset-password`, data);

// ===============================
// TOKEN HEADER
// ===============================
const authHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

// ===============================
// PROFILE
// ===============================
export const getProfile = () =>
    axios.get(
        "http://localhost:5000/api/profile",
        authHeader()
    );

export const updateProfile = (data) =>
    axios.put(
        "http://localhost:5000/api/profile",
        data,
        authHeader()
    );

// ===============================
// CHANGE PASSWORD
// ===============================
export const changePassword = (data) =>
    axios.put(
        "http://localhost:5000/api/change-password",
        data,
        authHeader()
    );

