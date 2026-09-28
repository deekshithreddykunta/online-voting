import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NominationLayout from "../../../components/NominationLayout";

export default function Step6Documents() {

    const navigate = useNavigate();

    const [files, setFiles] = useState({

        photo: null,
        aadhaar: null,
        qualification: null,
        affidavit: null

    });

    useEffect(() => {

        const nomination = JSON.parse(
            sessionStorage.getItem("nomination")
        );

        if (!nomination) {

            navigate("/candidate/elections");

        }

    }, [navigate]);

    const handleFile = (e) => {

        setFiles({

            ...files,

            [e.target.name]: e.target.files[0]

        });

    };

    const previous = () => {

        navigate("/candidate/nomination/manifesto");

    };

    const next = () => {

        if (

            !files.photo ||
            !files.aadhaar ||
            !files.qualification ||
            !files.affidavit

        ) {

            toast.error("Please upload all required documents.");

            return;

        }

        const nomination = JSON.parse(
            sessionStorage.getItem("nomination")
        );

        sessionStorage.setItem(
    "nomination",
    JSON.stringify({
        ...nomination,

        photo: files.photo.name,
        id_proof: files.aadhaar.name,
        nomination_form: files.qualification.name,
        symbol: files.affidavit.name
    })
);
        navigate("/candidate/nomination/declaration");

    };

    return (

        <NominationLayout

            title="Upload Documents"

            subtitle="Step 6 of 7"

            step={6}

            totalSteps={7}

            onPrevious={previous}

            onNext={next}

        >

            <div className="form-grid">

                <div className="form-group">

                    <label>Passport Size Photograph</label>

                    <input

                        type="file"

                        accept="image/*"

                        name="photo"

                        onChange={handleFile}

                    />

                </div>

                <div className="form-group">

                    <label>Aadhaar Card</label>

                    <input

                        type="file"

                        accept=".pdf,.jpg,.jpeg,.png"

                        name="aadhaar"

                        onChange={handleFile}

                    />

                </div>

                <div className="form-group">

                    <label>Qualification Certificate</label>

                    <input

                        type="file"

                        accept=".pdf,.jpg,.jpeg,.png"

                        name="qualification"

                        onChange={handleFile}

                    />

                </div>

                <div className="form-group">

                    <label>Self Affidavit</label>

                    <input

                        type="file"

                        accept=".pdf"

                        name="affidavit"

                        onChange={handleFile}

                    />

                </div>

            </div>

        </NominationLayout>

    );

}