import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getBallot, castVote } from "../../services/voteService";
import "./Vote.css";

export default function Vote() {

    const [ballot, setBallot] = useState([]);
    const [electionName, setElectionName] = useState("");
    const [electionId, setElectionId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [selectedVotes, setSelectedVotes] = useState({});

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showManifesto, setShowManifesto] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
const [showReceipt, setShowReceipt] = useState(false);
const [receiptNo, setReceiptNo] = useState("");
const [voteDate, setVoteDate] = useState("");
    useEffect(() => {
        loadBallot();
    }, []);
const loadBallot = async () => {
    try {

        const res = await getBallot();

        console.log("========== BALLOT RESPONSE ==========");
        console.log(res.data);

        setElectionName(res.data.election_name || "");
        setElectionId(res.data.election_id || null);
        setBallot(res.data.positions || []);

    } catch (err) {

        console.log("BALLOT ERROR");

        console.log(err);

        toast.error(
            err.response?.data?.message || "Unable to load ballot."
        );

    } finally {

        setLoading(false);

    }
};

    const handleSelect = (positionId, candidateId) => {

        setSelectedVotes({

            ...selectedVotes,

            [positionId]: candidateId

        });

    };

    const submitVote = async () => {

        const votes = ballot.map((position) => ({

            position_id: position.position_id,

            candidate_id: selectedVotes[position.position_id]

        }));

        try {

            setSubmitting(true);

            const res = await castVote({

                election_id: electionId,

                votes

            });

            toast.success(res.data.message);

const receipt =
    "VT-" +
    new Date().getFullYear() +
    "-" +
    Math.floor(100000 + Math.random() * 900000);

setReceiptNo(receipt);

setVoteDate(new Date().toLocaleString());

setShowReceipt(true);

        } catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Voting Failed"

            );

        } finally {

            setSubmitting(false);

            setShowConfirm(false);

        }

    };

    const handleSubmit = () => {

        if (Object.keys(selectedVotes).length !== ballot.length) {

            toast.warning("Please vote for every position.");

            return;

        }

        setShowConfirm(true);

    };

    if (loading) return <h2>Loading Ballot...</h2>;

    if (ballot.length === 0)

        return <h2>No Active Election</h2>;

  return (

<div className="vote-page">

    <h2 className="election-title">

        Election : {electionName}

    </h2>

    <h1 className="page-title">

        Cast Your Vote

    </h1>

    {

        ballot.map((position)=>(

        <div
            key={position.position_id}
            className="position-card"
        >

            <h2>

                {position.position_name}

            </h2>

            {

                position.candidates.length===0 ?

                <p>No Candidates</p>

                :

                position.candidates.map((candidate)=>(

                <div
                    key={candidate.candidate_id}
                    className={
                        selectedVotes[position.position_id]===candidate.candidate_id
                        ?
                        "candidate-card selected"
                        :
                        "candidate-card"
                    }
                >

                    <div className="candidate-left">

                        <img

                            src={
                                candidate.photo
                                ?
                                `https://online-voting-qss7.onrender.com/uploads/${candidate.photo}`
                                :
                                "/default-user.png"
                            }

                            className="candidate-photo"

                            alt=""
                        />

                        <div className="candidate-details">

                            <h3>

                                {candidate.full_name}

                            </h3>

                            <p>

                                {candidate.party_name || "Independent"}

                            </p>

                            {

                                candidate.symbol &&

                                <img

                                    src={`https://online-voting-qss7.onrender.com/uploads/${candidate.symbol}`}

                                    className="party-symbol"

                                    alt=""

                                />

                            }

                        </div>

                    </div>

                    <div className="candidate-right">

                        <button

                            type="button"

                            className="manifesto-btn"

                            onClick={()=>{

                                setSelectedCandidate(candidate);

                                setShowManifesto(true);

                            }}

                        >

                            Manifesto

                        </button>

                        <input

                            type="radio"

                            checked={
                                selectedVotes[position.position_id]===candidate.candidate_id
                            }

                            onChange={()=>handleSelect(

                                position.position_id,

                                candidate.candidate_id

                            )}

                        />

                    </div>

                </div>

                ))

            }

        </div>

        ))

    }

    <button

        className="submit-btn"

        disabled={submitting}

        onClick={handleSubmit}

    >

        {

            submitting

            ?

            "Submitting..."

            :

            "Submit Vote"

        }

    </button>

    {

        showManifesto &&

        <div className="popup-overlay">

            <div className="popup">

                <h2>

                    {selectedCandidate.full_name}

                </h2>

                <h4>

                    {selectedCandidate.party_name}

                </h4>

                <p>

                    {

                        selectedCandidate.manifesto ||

                        "No manifesto available."

                    }

                </p>

                <button

                    onClick={()=>setShowManifesto(false)}

                >

                    Close

                </button>

            </div>

        </div>

    }

    {

        showConfirm &&

        <div className="popup-overlay">

            <div className="popup">

                <h2>

                    Confirm Vote

                </h2>

                <p>

                    Once submitted you cannot vote again.

                </p>

                <div className="popup-buttons">

                    <button

                        onClick={()=>setShowConfirm(false)}

                    >

                        Cancel

                    </button>

                    <button

                        onClick={submitVote}

                    >

                        Submit Vote

                    </button>

                </div>

            </div>

        </div>

    }
{
showReceipt &&

<div className="popup-overlay">

    <div className="receipt-popup">

        <h1>✅ Vote Submitted Successfully</h1>

        <hr/>

        <div className="receipt-row">
            <strong>Receipt No</strong>
            <span>{receiptNo}</span>
        </div>

        <div className="receipt-row">
            <strong>Election</strong>
            <span>{electionName}</span>
        </div>

        <div className="receipt-row">
            <strong>Date & Time</strong>
            <span>{voteDate}</span>
        </div>

        <div className="receipt-row">
            <strong>Status</strong>
            <span className="success-text">
                Vote Recorded Successfully
            </span>
        </div>

        <div className="receipt-buttons">

            <button
                onClick={() => window.print()}
            >
                Print Receipt
            </button>

            <button
                onClick={() => {
                    window.location.href = "/voter";
                }}
            >
                Back to Dashboard
            </button>

        </div>

    </div>

</div>

}
</div>

);

}