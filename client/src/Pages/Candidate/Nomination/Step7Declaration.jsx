import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NominationLayout from "../../../components/NominationLayout";

export default function Step7Declaration() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        agree: false,
        candidate_name: "",
        place: "",
        date: new Date().toISOString().split("T")[0]

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

        const { name, value, type, checked } = e.target;

        setForm({

            ...form,

            [name]: type === "checkbox"
                ? checked
                : value

        });

    };

    const previous = () => {

        navigate("/candidate/nomination/documents");

    };

    const next = () => {

        if (!form.agree) {

            toast.error("Please accept the declaration.");

            return;

        }

        if (!form.candidate_name.trim()) {

            toast.error("Enter your full name.");

            return;

        }

        if (!form.place.trim()) {

            toast.error("Enter place.");

            return;

        }

        const nomination = JSON.parse(

            sessionStorage.getItem("nomination")

        );

        sessionStorage.setItem(

            "nomination",

            JSON.stringify({

                ...nomination,

                declaration: true,

                candidate_name: form.candidate_name,

                place: form.place,

                date: form.date

            })

        );

        navigate("/candidate/nomination/preview");

    };

    return (

        <NominationLayout

            title="Declaration"

            subtitle="Step 7 of 7"

            step={7}

            totalSteps={7}

            onPrevious={previous}

            nextText="Preview"

            onNext={next}

        >

            <div className="form-grid">

                <div className="form-group full">

                    <div
                        style={{
                            background: "#f8fafc",
                            padding: "20px",
                            borderRadius: "10px",
                            lineHeight: "1.8"
                        }}
                    >

                        I hereby declare that all the information
                        furnished in this nomination form is true,
                        complete and correct to the best of my
                        knowledge and belief. I understand that any
                        false information may result in rejection of
                        my nomination or cancellation of my
                        candidature.

                    </div>

                </div>

                <div className="form-group full">

                    <label>

                        <input
                            type="checkbox"
                            name="agree"
                            checked={form.agree}
                            onChange={handleChange}
                            style={{ marginRight: "10px" }}
                        />

                        I Agree with the above declaration.

                    </label>

                </div>

                <div className="form-group">

                    <label>Candidate Name</label>

                    <input

                        type="text"

                        name="candidate_name"

                        value={form.candidate_name}

                        onChange={handleChange}

                    />

                </div>

                <div className="form-group">

                    <label>Place</label>

                    <input

                        type="text"

                        name="place"

                        value={form.place}

                        onChange={handleChange}

                    />

                </div>

                <div className="form-group">

                    <label>Date</label>

                    <input

                        type="date"

                        name="date"

                        value={form.date}

                        onChange={handleChange}

                    />

                </div>

            </div>

        </NominationLayout>

    );

}