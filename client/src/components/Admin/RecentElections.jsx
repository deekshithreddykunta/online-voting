import "./RecentElections.css";

export default function RecentElections({ elections }) {

    return (

        <div className="recent-card">

            <h2>Recent Elections</h2>

            <table>

                <thead>

                    <tr>
                        <th>Election</th>
                        <th>Status</th>
                        <th>Start</th>
                    </tr>

                </thead>

                <tbody>

                    {elections.length === 0 ? (

                        <tr>
                            <td colSpan="3">
                                No Elections Found
                            </td>
                        </tr>

                    ) : (

                        elections.map((e) => (

                            <tr key={e.election_id}>

                                <td>{e.election_name}</td>

                                <td>{e.status}</td>

                                <td>
                                    {new Date(e.start_date)
                                        .toLocaleDateString()}
                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}