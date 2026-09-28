import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaUserShield,
  FaEdit,
  FaSave,
} from "react-icons/fa";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../services/authService";

import "./Profile.css";
import { toast } from "react-toastify";
export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [user, setUser] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load Profile
  // Load Profile
const loadProfile = async () => {
  try {
    const res = await getProfile();

    console.log("Admin Profile Response:", res.data);

    setUser({
      full_name: res.data?.full_name || "",
      username: res.data?.username || "",
      email: res.data?.email || "",
      phone: res.data?.phone || "",
    });

  } catch (err) {
    console.log(err);
    toast.error("Failed to load profile");
  }
};

  useEffect(() => {
    loadProfile();
  }, []);

  // Handle Profile Inputs
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Save Profile
  const handleSave = async () => {
  try {

    await updateProfile({
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
    });

    toast.success("Profile updated successfully!");

    setEditing(false);

    loadProfile();

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Profile update failed"
    );

  }
};

  // Password Input
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // Change Password
  const savePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

     toast.success("Password changed successfully!");
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      setShowPassword(false);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
     toast.error(
    err.response?.data?.message ||
    "Password change failed"
);
      setMessageType("error");
    }
  };

  return (
    <div className="profile-page">
      <h1>Admin Profile</h1>
      <p>Manage your administrator account.</p>

      <div className="profile-card">

        <div className="profile-left">

          <FaUserCircle className="profile-avatar" />

          <h2>{user.full_name}</h2>

          <span className="role">
            <FaUserShield /> Administrator
          </span>

          {!editing ? (
            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
               Edit Profile
            </button>
          ) : (
            <button
              className="edit-btn"
              onClick={handleSave}
            >
              Save Changes
            </button>
          )}

          <button
            className="password-btn"
            onClick={() => setShowPassword(true)}
          >
            Change Password
          </button>

          {message && (
            <p
              className={
                messageType === "success"
                  ? "profile-success"
                  : "profile-error"
              }
            >
              {message}
            </p>
          )}

        </div>

        <div className="profile-right">

          <div className="info-box">
            <label>Full Name</label>

            <input
              name="full_name"
              value={user.full_name || ""}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>

          <div className="info-box">
            <label>Username</label>

            <input
              name="username"
              value={user.username || ""}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>

          <div className="info-box">
            <label>Email</label>

            <input
              name="email"
              value={user.email || ""}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>

          <div className="info-box">
            <label>Phone</label>

            <input
              name="phone"
              value={user.phone || ""}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>

      {showPassword && (
    <div className="modal-overlay">

        <div className="password-box">

            <h2>Change Password</h2>

            <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
            />

            <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
            />

            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
            />

            <div className="modal-buttons">

                <button onClick={savePassword}>
                    Save
                </button>

                <button onClick={() => setShowPassword(false)}>
                    Cancel
                </button>

            </div>

        </div>

    </div>
)}
    </div>
  );
}