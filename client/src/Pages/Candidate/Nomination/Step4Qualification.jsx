import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NominationLayout from "../../../components/NominationLayout";

export default function Step4Qualification() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        qualification: "",
        occupation: "",
        annual_income: "",
        experience: ""

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

        navigate("/candidate/nomination/election");

    };

    const next = () => {

        if (
            !form.qualification ||
            !form.occupation ||
            !form.annual_income
        ) {

            toast.error("Please complete all required fields.");

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

        navigate("/candidate/nomination/manifesto");

    };

    return (

        <NominationLayout

            title="Qualification Details"

            subtitle="Step 4 of 7"

            step={4}

            totalSteps={7}

            onPrevious={previous}

            onNext={next}

        >

            <div className="form-grid">

                <div className="form-group">

                    <label>Highest Qualification</label>

                    <input
                        type="text"
                        name="qualification"
                        value={form.qualification}
                        onChange={handleChange}
                        placeholder="B.Tech / MBA / M.Sc ..."
                    />

                </div>

                <div className="form-group">

                    <label>Occupation</label>

                    <input
                        type="text"
                        name="occupation"
                        value={form.occupation}
                        onChange={handleChange}
                        placeholder="Business, Engineer..."
                    />

                </div>

                <div className="form-group">

                    <label>Annual Income</label>

                    <input
                        type="number"
                        name="annual_income"
                        value={form.annual_income}
                        onChange={handleChange}
                        placeholder="Annual Income"
                    />

                </div>

                <div className="form-group full">

                    <label>Leadership / Political Experience</label>

                    <textarea
                        rows="5"
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        placeholder="Describe your experience..."
                    />

                </div>

            </div>

        </NominationLayout>

    );

}