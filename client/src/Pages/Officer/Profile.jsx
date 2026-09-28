import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getProfile,
    updateProfile,
    changePassword
} from "../../services/officerService";
import "./Profile.css";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);

    const [profile, setProfile] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: ""
    });

    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [editMode, setEditMode] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
console.log("PROFILE RESPONSE:", data);
            setProfile({
                full_name: data.full_name || "",
                username: data.username || "",
                email: data.email || "",
                phone: data.phone || ""
            });
            setForm({
                full_name: data.full_name || "",
                username: data.username || "",
                email: data.email || "",
                phone: data.phone || ""
            });
        } catch (err) {
            console.log(err);
            toast.error("Unable to load profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const res = await updateProfile({
                full_name: form.full_name,
                email: form.email,
                phone: form.phone
            });

            toast.success("Profile updated successfully.");

            const updatedUser = res?.user || {};

            setProfile({
                full_name: updatedUser.full_name || form.full_name,
                username: updatedUser.username || form.username,
                email: updatedUser.email || form.email,
                phone: updatedUser.phone || form.phone
            });

            const user = JSON.parse(localStorage.getItem("user")) || {};
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...user,
                    ...updatedUser
                })
            );

            setEditMode(false);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Unable to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            setPasswordSaving(true);

            await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            toast.success("Password changed successfully.");
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setShowPasswordForm(false);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Unable to change password.");
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="officer-profile-page">
                <h2>Loading profile...</h2>
            </div>
        );
    }

    return (
        <div className="officer-profile-page">
            <div className="page-header">
                <div>
                    <h1>Profile</h1>
                    <p>View, edit your details, and change password.</p>
                </div>

                <div className="header-actions">
                    <button
                        className="action-btn"
                        onClick={() => {
                            setEditMode((prev) => !prev);
                            setShowPasswordForm(false);
                        }}
                    >
                        {editMode ? "Close Edit" : "Edit Profile"}
                    </button>

                    <button
                        className="action-btn secondary"
                        onClick={() => {
                            setShowPasswordForm((prev) => !prev);
                            setEditMode(false);
                        }}
                    >
                        {showPasswordForm ? "Close Password" : "Change Password"}
                    </button>
                </div>
            </div>

            <div className="profile-layout">
                <div className="profile-card">
                    <div className="profile-info">
                        <div>
                            <label>Full Name</label>
                            <p>{profile.full_name || "-"}</p>
                        </div>

                        <div>
                            <label>Username</label>
                            <p>{profile.username || "-"}</p>
                        </div>

                        <div>
                            <label>Email</label>
                            <p>{profile.email || "-"}</p>
                        </div>

                        <div>
                            <label>Phone</label>
                            <p>{profile.phone || "-"}</p>
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    {editMode && (
                        <form className="form-card" onSubmit={handleProfileSave}>
                            <h2>Edit Profile</h2>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={form.full_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="button-row">
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {showPasswordForm && (
                        <form className="form-card" onSubmit={handlePasswordSave}>
                            <h2>Change Password</h2>

                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                            </div>

                            <div className="button-row">
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={passwordSaving}
                                >
                                    {passwordSaving ? "Updating..." : "Update Password"}
                                </button>

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowPasswordForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {!editMode && !showPasswordForm && (
                        <div className="form-card empty-card">
                            <h2>Profile Actions</h2>
                            <p>Select Edit Profile or Change Password to update your account.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}