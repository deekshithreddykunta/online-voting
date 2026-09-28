import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyNominations } from "../../services/candidateService";
import "./MyNominations.css";

export default function MyNominations() {

    const [nominations, setNominations] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("All");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadData();

    }, []);

    useEffect(() => {

        filterData();

    }, [search, status, nominations]);

    const loadData = async () => {

        try {

            const res = await getMyNominations();

            setNominations(res.data);

            setFiltered(res.data);

        }

        catch {

            toast.error("Unable to load nominations.");

        }

        finally {

            setLoading(false);

        }

    };

    const filterData = () => {

        let data = [...nominations];

        if (status !== "All") {

            data = data.filter(

                n => n.status === status

            );

        }

        if (search) {

            data = data.filter(

                n =>

                    n.election_name
                        .toLowerCase()
                        .includes(search.toLowerCase())

                    ||

                    n.position_name
                        .toLowerCase()
                        .includes(search.toLowerCase())

            );

        }

        setFiltered(data);

    };

    if (loading) {

        return <div className="loading">Loading...</div>;

    }

    return (

        <div className="my-nominations">

            <div className="page-header">

                <div>

                    <h1>My Nominations</h1>

                    <p>

                        Track all your submitted nominations.

                    </p>

                </div>

            </div>

            <div className="filters">

                <input

                    type="text"

                    placeholder="Search Election..."

                    value={search}

                    onChange={(e) =>

                        setSearch(e.target.value)

                    }

                />

                <select

                    value={status}

                    onChange={(e) =>

                        setStatus(e.target.value)

                    }

                >

                    <option>All</option>

                    <option>Pending</option>

                    <option>Approved</option>

                    <option>Rejected</option>

                </select>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Application ID</th>

                        <th>Election</th>

                        <th>Position</th>

                        <th>Constituency</th>

                        <th>Status</th>

                        <th>Date</th>


                    </tr>

                </thead>

                <tbody>

                    {

                        filtered.length === 0

                        ?

                        <tr>

                            <td

                                colSpan="7"

                                className="empty"

                            >

                                No nominations found.

                            </td>

                        </tr>

                        :

                        filtered.map(item => (

                            <tr

                                key={item.application_id}

                            >

                                <td>

                                    {item.application_id}

                                </td>

                                <td>

                                    {item.election_name}

                                </td>

                                <td>

                                    {item.position_name}

                                </td>

                                <td>

                                    {item.constituency}

                                </td>

                                <td>

                                    <span

                                        className={`badge ${item.status.toLowerCase()}`}

                                    >

                                        {item.status}

                                    </span>

                                </td>

                                <td>
    {item.applied_at
        ? new Date(item.applied_at).toLocaleDateString()
        : "-"}
</td>
                               
                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}