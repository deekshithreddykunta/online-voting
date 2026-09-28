import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddVoterModal.css";

export default function EditVoterModal({
    voter,
    show,
    onClose,
    onSuccess
}) {

    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: ""
    });

    useEffect(() => {
        if (voter) {
            setForm({
                full_name: voter.full_name || "",
                username: voter.username || "",
                email: voter.email || "",
                phone: voter.phone || ""
            });
        }
    }, [voter]);

    if (!show || !voter) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `https://online-voting-qss7.onrender.com/api/admin/voters/${voter.user_id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);

            onSuccess();
            onClose();

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Update failed"
            );
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">

                <h2>Edit Voter</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <div className="modal-buttons">
                        <button type="submit">
                            Update
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}