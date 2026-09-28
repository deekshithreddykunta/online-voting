import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NominationLayout from "../../../components/NominationLayout";

export default function Step3Election() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        political_party: "",
        previous_experience: "",
        criminal_cases: "No"

    });

    useEffect(() => {

        const nomination = JSON.parse(
            sessionStorage.getItem("nomination")
        );

        if (!nomination) {

            navigate("/candidate/elections");

        }

    }, []);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const previous = () => {

        navigate("/candidate/nomination/personal");

    };

    const next = () => {

        if (!form.political_party.trim()) {

            toast.error("Enter political party.");

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

        navigate("/candidate/nomination/qualification");

    };

    return (

        <NominationLayout

            title="Election Details"

            subtitle="Step 3 of 7"

            step={3}

            totalSteps={7}

            onPrevious={previous}

            onNext={next}

        >

            <div className="form-grid">

                <div className="form-group">

                    <label>Political Party</label>

                    <input

                        type="text"

                        name="political_party"

                        value={form.political_party}

                        onChange={handleChange}

                    />

                </div>

                <div className="form-group">

                    <label>Previous Election Experience</label>

                    <input

                        type="text"

                        name="previous_experience"

                        value={form.previous_experience}

                        onChange={handleChange}

                    />

                </div>

                <div className="form-group full">

                    <label>Any Criminal Cases?</label>

                    <select

                        name="criminal_cases"

                        value={form.criminal_cases}

                        onChange={handleChange}

                    >

                        <option>No</option>

                        <option>Yes</option>

                    </select>

                </div>

            </div>

        </NominationLayout>

    );

}