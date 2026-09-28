import { useEffect, useState } from "react";
import { getMyVotes } from "../../services/voteService";
import "./MyVotes.css";

export default function MyVotes() {

    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVotes();
    }, []);

    const loadVotes = async () => {

        try {

            const res = await getMyVotes();

            setVotes(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <div className="myvotes-page">

            <h1>My Votes</h1>

            {
                votes.length === 0 ?

                <div className="empty-box">
                    You haven't voted in any election.
                </div>

                :

                <table className="votes-table">

                    <thead>

                        <tr>

                            <th>Election</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Receipt No</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            votes.map((vote,index)=>(

                                <tr key={index}>

                                    <td>{vote.election_name}</td>

                                   <td>
    {new Date(vote.voted_at).toLocaleDateString()}
</td>

<td>
    {new Date(vote.voted_at).toLocaleTimeString()}
</td>

                                    <td>

                                        <span className="status-badge">

                                            Voted

                                        </span>

                                    </td>

                                    <td>{vote.receipt_no}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            }

        </div>

    );

}