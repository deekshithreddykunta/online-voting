import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // Added for rendering layout globally
import { getProfile, updateProfile, changePassword} from "../../services/authService";
import { toast } from "react-toastify";
import "./Profile.css";
export default function Profile() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [profile, setProfile] = useState({});
    const [editing, setEditing] = useState(false);
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await getProfile();
            setProfile(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            const res = await updateProfile({
                full_name: profile.full_name,
                email: profile.email,
                phone: profile.phone
            });
            toast.success(res.data.message);
            setEditing(false);
            loadProfile();
        } catch (err) {
            toast.error(err.response?.data?.message || "Update Failed");
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            const res = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success(res.data.message);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setShowPasswordModal(false); // Close modal on success
        } catch (err) {
            toast.error(err.response?.data?.message || "Password Change Failed");
        }
    };

    return (
        <div className="profile-page">
            <h1>My Profile</h1>

            <div className="profile-card">
      

                <div className="profile-details">
                    <div className="profile-row">
                        <strong>Full Name</strong>
                        {editing ? (
                            <input
                                name="full_name"
                                value={profile.full_name || ""}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{profile.full_name}</span>
                        )}
                    </div>

                    <div className="profile-row">
                        <strong>Username</strong>
                        <span>{profile.username}</span>
                    </div>

                    <div className="profile-row">
                        <strong>Email</strong>
                        {editing ? (
                            <input
                                name="email"
                                value={profile.email || ""}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{profile.email}</span>
                        )}
                    </div>

                    <div className="profile-row">
                        <strong>Phone</strong>
                        {editing ? (
                            <input
                                name="phone"
                                value={profile.phone || ""}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{profile.phone}</span>
                        )}
                    </div>

                    <div className="profile-row">
                        <strong>Voter ID</strong>
                        <span>{profile.voter_id}</span>
                    </div>

                    <div className="profile-row">
                        <strong>Joined</strong>
                        <span>
                            {profile.created_at &&
                                new Date(profile.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    {editing ? (
                        <button className="edit-btn" onClick={handleSave}>
                            Save Changes
                        </button>
                    ) : (
                        <button className="edit-btn" onClick={() => setEditing(true)}>
                            Edit Profile
                        </button>
                    )}
                    
                    <button
                        className="password-btn"
                        onClick={() => setShowPasswordModal(true)}
                    >
                        Change Password
                    </button>
                </div>
            </div>
            
            {/* React Portal rendering the overlay layout directly under the document body */}
            {showPasswordModal && createPortal(
                <div className="modal-overlay">
                    <div className="password-modal">
                        <h2>Change Password</h2>

                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>

                        <div className="modal-buttons">
                            <button className="save-btn" onClick={handleChangePassword}>
                                Save
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordData({
                                        currentPassword: "",
                                        newPassword: "",
                                        confirmPassword: ""
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
