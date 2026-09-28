import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCandidateProfile,
    updateCandidateProfile
} from "../../services/candidateService";
import { toast } from "react-toastify";
import "./Profile.css";

export default function Profile() {

    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);

    const [profile, setProfile] = useState({
        voter_id: "",
        full_name: "",
        username: "",
        email: "",
        phone: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const res = await getCandidateProfile();

            setProfile(res.data);

        } catch (err) {

            console.log(err);

            toast.error("Unable to load profile.");

        }

    };

    const handleChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

    };

    const saveProfile = async () => {

        try {

            await updateCandidateProfile({

                full_name: profile.full_name,
                username: profile.username,
                email: profile.email,
                phone: profile.phone

            });

            toast.success("Profile updated successfully!");

            setEditing(false);

            loadProfile();

        } catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Unable to update profile."
            );

        }

    };

    return (

        <div className="candidate-profile">

            <h1>My Profile</h1>

            <div className="profile-card">

                <div className="profile-details">

                    <div className="row">

                        <label>Candidate ID</label>

                        <input
                            type="text"
                            value={profile.voter_id}
                            readOnly
                        />

                    </div>

                    <div className="row">

                        <label>Full Name</label>

                        <input
                            type="text"
                            name="full_name"
                            value={profile.full_name}
                            onChange={handleChange}
                            readOnly={!editing}
                        />

                    </div>

                    <div className="row">

                        <label>Username</label>

                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            readOnly={!editing}
                        />

                    </div>

                    <div className="row">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            readOnly={!editing}
                        />

                    </div>

                    <div className="row">

                        <label>Phone</label>

                        <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            readOnly={!editing}
                        />

                    </div>

                    <div className="button-group">

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
                                onClick={saveProfile}
                            >
                                Save Changes
                            </button>

                        )}

                        <button
                            className="password-btn"
                            onClick={() => navigate("/candidate/change-password")}
                        >
                            Change Password
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}