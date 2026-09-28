import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { submitNomination } from "../../../services/candidateService";
import "./Preview.css";

export default function Preview() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(null);

    useEffect(() => {

        const nomination = JSON.parse(
            sessionStorage.getItem("nomination")
        );

        if (!nomination) {

            navigate("/candidate/elections");

            return;

        }

        setData(nomination);

    }, [navigate]);

    const previous = () => {

        navigate("/candidate/nomination/declaration");

    };

    const submit = async () => {

        try {

            setLoading(true);

            await submitNomination(data);

sessionStorage.setItem(
    "submittedNomination",
    JSON.stringify({
        ...data,
        application_id: "NOM" + Date.now()
    })
);

sessionStorage.removeItem("nomination");

navigate("/candidate/nomination/success");

        }

        catch (err) {

            console.log(err);

            toast.error(

                err.response?.data?.message ||

                "Unable to submit nomination."

            );

        }

        finally {

            setLoading(false);

        }

    };

    if (!data) return null;

    return (

        <div className="preview-page">

            <div className="preview-card">

                <div className="preview-header">

                    <h1>Candidate Nomination Form</h1>

                    <p>

                        Review all information before submitting.

                    </p>

                </div>

                {/* Personal Details */}

                <section>

                    <h2>Personal Details</h2>

                    <table>

                        <tbody>

                            <tr>

                                <td>Full Name</td>

                                <td>{data.full_name}</td>

                            </tr>

                            <tr>

                                <td>Username</td>

                                <td>{data.username}</td>

                            </tr>

                            <tr>

                                <td>Email</td>

                                <td>{data.email}</td>

                            </tr>

                            <tr>

                                <td>Phone</td>

                                <td>{data.phone}</td>

                            </tr>

                            <tr>

                                <td>Father Name</td>

                                <td>{data.father_name}</td>

                            </tr>

                            <tr>

                                <td>Mother Name</td>

                                <td>{data.mother_name}</td>

                            </tr>

                            <tr>

                                <td>Date of Birth</td>

                                <td>{data.dob}</td>

                            </tr>

                            <tr>

                                <td>Gender</td>

                                <td>{data.gender}</td>

                            </tr>

                            <tr>

                                <td>Address</td>

                                <td>{data.address}</td>

                            </tr>

                        </tbody>

                    </table>

                </section>

                {/* Election */}

                <section>

                    <h2>Election Details</h2>

                    <table>

                        <tbody>

                            <tr>

                                <td>Election</td>

                                <td>{data.election_name}</td>

                            </tr>

                            <tr>

                                <td>Position</td>

                                <td>{data.position_name}</td>

                            </tr>

                            <tr>

                                <td>Constituency</td>

                                <td>{data.constituency}</td>

                            </tr>

                            <tr>

                                <td>Political Party</td>

                                <td>{data.party_name}</td>

                            </tr>

                            <tr>

                                <td>Previous Experience</td>

                                <td>{data.experience}</td>

                            </tr>

                            <tr>

                                <td>Criminal Cases</td>

                                <td>{data.criminal_cases}</td>

                            </tr>

                        </tbody>

                    </table>

                </section>

                {/* Qualification */}

                <section>

                    <h2>Qualification</h2>

                    <table>

                        <tbody>

                            <tr>

                                <td>Qualification</td>

                                <td>{data.qualification}</td>

                            </tr>

                            <tr>

                                <td>Occupation</td>

                                <td>{data.occupation}</td>

                            </tr>

                            <tr>

                                <td>Annual Income</td>

                                <td>{data.annual_income}</td>

                            </tr>

                            <tr>

                                <td>Leadership Experience</td>

                                <td>{data.experience}</td>

                            </tr>

                        </tbody>

                    </table>

                </section>

                {/* Manifesto */}

                <section>

                    <h2>Election Manifesto</h2>

                    <p>{data.manifesto}</p>

                </section>

                {/* Documents */}

                <section>

                    <h2>Uploaded Documents</h2>

                    <ul>

                        <li>📷 {data.photo}</li>

                        <li>🪪 {data.aadhaar}</li>

                        <li>🎓 {data.nomination_form}</li>

                        <li>📄 {data.symbol}</li>

                    </ul>

                </section>

                {/* Declaration */}

                <section>

                    <h2>Declaration</h2>

                    <p>

                        I hereby declare that the above information is true and correct.

                    </p>

                    <table>

                        <tbody>

                            <tr>

                                <td>Candidate</td>

                                <td>{data.candidate_name}</td>

                            </tr>

                            <tr>

                                <td>Place</td>

                                <td>{data.place}</td>

                            </tr>

                            <tr>

                                <td>Date</td>

                                <td>{data.date}</td>

                            </tr>

                        </tbody>

                    </table>

                </section>

                <div className="preview-buttons">

                    <button

                        className="back-btn"

                        onClick={previous}

                    >

                        ← Edit

                    </button>

                    <button

                        className="submit-btn"

                        onClick={submit}

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Submitting..."

                                : "Submit Nomination"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}