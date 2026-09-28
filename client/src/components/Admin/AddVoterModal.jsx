import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddVoterModal.css";

export default function AddVoterModal({
    show,
    onClose,
    onSuccess
}) {
if (!show) return null;
    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: "",
        password: ""
    });

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

            await axios.post(
                "http://localhost:5000/api/admin/voters",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
           

toast.success("Voter added successfully!");
      

           onSuccess();
           onClose();
        } catch (err) {

            toast.error(
    err.response?.data?.message ||
    "Error adding voter"
);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="modal-box">

                <h2>Add Voter</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        name="full_name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="phone"
                        placeholder="Phone"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    <div className="modal-buttons">

                        <button type="submit">
                            Save
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