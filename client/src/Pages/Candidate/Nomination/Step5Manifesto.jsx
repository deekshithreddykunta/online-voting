import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NominationLayout from "../../../components/NominationLayout";

export default function Step5Manifesto() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        vision: "",
        mission: "",
        manifesto: "",
        promises: ""

    });

    useEffect(() => {

        const nomination = JSON.parse(
            sessionStorage.getItem("nomination")
        );

        if (!nomination) {

            navigate("/candidate/elections");

        }

    }, [navigate]);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const previous = () => {

        navigate("/candidate/nomination/qualification");

    };

    const next = () => {

        if (

            !form.vision.trim() ||
            !form.mission.trim() ||
            !form.manifesto.trim()

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

        navigate("/candidate/nomination/documents");

    };

    return (

        <NominationLayout

            title="Election Manifesto"

            subtitle="Step 5 of 7"

            step={5}

            totalSteps={7}

            onPrevious={previous}

            onNext={next}

        >

            <div className="form-grid">

                <div className="form-group full">

                    <label>Vision</label>

                    <textarea
                        rows="4"
                        name="vision"
                        value={form.vision}
                        onChange={handleChange}
                        placeholder="Describe your vision..."
                    />

                </div>

                <div className="form-group full">

                    <label>Mission</label>

                    <textarea
                        rows="4"
                        name="mission"
                        value={form.mission}
                        onChange={handleChange}
                        placeholder="Describe your mission..."
                    />

                </div>

                <div className="form-group full">

                    <label>Election Manifesto</label>

                    <textarea
                        rows="6"
                        name="manifesto"
                        value={form.manifesto}
                        onChange={handleChange}
                        placeholder="Write your election manifesto..."
                    />

                </div>

                <div className="form-group full">

                    <label>Key Promises (Optional)</label>

                    <textarea
                        rows="5"
                        name="promises"
                        value={form.promises}
                        onChange={handleChange}
                        placeholder="List your important promises..."
                    />

                </div>

            </div>

        </NominationLayout>

    );

}