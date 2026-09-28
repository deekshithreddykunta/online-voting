import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCandidateProfile } from "../../../services/candidateService";
import NominationLayout from "../../../components/NominationLayout";

export default function Step2Personal() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        full_name: "",
        username: "",
        email: "",
        phone: "",
        father_name: "",
        mother_name: "",
        dob: "",
        gender: "",
        address: ""

    });

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const nomination = JSON.parse(
                sessionStorage.getItem("nomination")
            );

            if (!nomination) {

                navigate("/candidate/elections");
                return;

            }

            const res = await getCandidateProfile();

            setForm({

                full_name: res.data.full_name || "",
                username: res.data.username || "",
                email: res.data.email || "",
                phone: res.data.phone || "",
                father_name: "",
                mother_name: "",
                dob: "",
                gender: "",
                address: ""

            });

        }

        catch {

            toast.error("Unable to load profile.");

        }

    };

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const previous = () => {

        navigate(-1);

    };

    const next = () => {

        if (

            !form.full_name ||
            !form.email ||
            !form.phone ||
            !form.father_name ||
            !form.mother_name ||
            !form.dob ||
            !form.gender ||
            !form.address

        ) {

            toast.error("Please complete all fields.");

            return;

        }

        const nomination = JSON.parse(

            sessionStorage.getItem("nomination")

        );

        sessionStorage.setItem(

            "nomination",

            JSON.stringify({

                ...nomination,

                ...form

            })

        );

        navigate("/candidate/nomination/election");

    };

    return (

        <NominationLayout

            title="Personal Details"

            subtitle="Step 2 of 7"

            step={2}

            totalSteps={7}

            onPrevious={previous}

            onNext={next}

        >

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

                    <label>Username</label>

                    <input
                        type="text"
                        value={form.username}
                        readOnly
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

                <div className="form-group">

                    <label>Father's Name</label>

                    <input
                        type="text"
                        name="father_name"
                        value={form.father_name}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Mother's Name</label>

                    <input
                        type="text"
                        name="mother_name"
                        value={form.mother_name}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Date of Birth</label>

                    <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Gender</label>

                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Gender
                        </option>

                        <option value="Male">
                            Male
                        </option>

                        <option value="Female">
                            Female
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                </div>

                <div className="form-group full">

                    <label>Address</label>

                    <textarea
                        rows="5"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                    />

                </div>

            </div>

        </NominationLayout>

    );

}