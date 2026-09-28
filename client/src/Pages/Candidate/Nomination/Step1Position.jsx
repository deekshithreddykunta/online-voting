import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getAvailableElections,
    getPositions,
    checkNomination
} from "../../../services/candidateService";

import NominationLayout from "../../../components/NominationLayout";

export default function Step1Position() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [election, setElection] = useState(null);
    const [positions, setPositions] = useState([]);

    const [form, setForm] = useState({
        position_id: "",
        constituency: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            const electionRes = await getAvailableElections();

            const selectedElection = electionRes.data.find(
                e => e.election_id == id
            );

            setElection(selectedElection);

            const positionRes = await getPositions(id);

            setPositions(positionRes.data);

        } catch (err) {

            console.log(err);

            toast.error("Unable to load election.");

        }

    };

    const handleChange = async (e) => {

        const { name, value } = e.target;

        // Constituency
        if (name === "constituency") {

            setForm({
                ...form,
                constituency: value
            });

            return;
        }

        // Position Selected
        if (name === "position_id") {

            try {

                const res = await checkNomination(id, value);

                if (res.exists) {

                    toast.error(
                        "You have already submitted a nomination for this position."
                    );

                    navigate("/candidate/my-nominations");

                    return;
                }

                setForm({
                    ...form,
                    position_id: value
                });

            } catch (err) {

                console.log(err);

                toast.error("Unable to verify nomination.");

            }

        }

    };

    const next = () => {

        if (!form.position_id) {

            toast.error("Please select a position.");

            return;

        }

        if (!form.constituency.trim()) {

            toast.error("Please enter constituency.");

            return;

        }

        sessionStorage.setItem(
            "nomination",
            JSON.stringify({
                election_id: id,
                election_name: election.election_name,
                ...form
            })
        );

        navigate("/candidate/nomination/personal");

    };

    return (

        <NominationLayout
            title="Select Position"
            subtitle="Step 1 of 7"
            step={1}
            totalSteps={7}
            hidePrevious={true}
            onNext={next}
        >

            <div className="form-grid">

                <div className="form-group">

                    <label>Election</label>

                    <input
                        type="text"
                        value={election?.election_name || ""}
                        readOnly
                    />

                </div>

                <div className="form-group">

                    <label>Position</label>

                    <select
                        name="position_id"
                        value={form.position_id}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Position
                        </option>

                        {positions.map(position => (

                            <option
                                key={position.position_id}
                                value={position.position_id}
                            >
                                {position.position_name}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="form-group full">

                    <label>Constituency</label>

                    <input
                        type="text"
                        name="constituency"
                        value={form.constituency}
                        onChange={handleChange}
                        placeholder="Enter Constituency"
                    />

                </div>

            </div>

        </NominationLayout>

    );

}