import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "./Candidates.css";

import AddCandidateModal from "./AddCandidateModal";
import EditCandidateModal from "../../components/Admin/EditCandidateModal";
import ViewCandidateModal from "../../components/Admin/ViewCandidateModal";
import ResetCandidatePasswordModal from "../../components/Admin/ResetCandidatePasswordModal";
import * as XLSX from "xlsx";
export default function Candidate() {

    const [candidates, setCandidates] = useState([]);

    const [showAdd, setShowAdd] = useState(false);

    const [showEdit, setShowEdit] = useState(false);

    const [showView, setShowView] = useState(false);

    const [showReset, setShowReset] = useState(false);

    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const candidatePerPage = 5;
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

const [deleteId, setDeleteId] = useState(null);
    useEffect(() => {

        loadCandidates();

    }, []);

    const loadCandidates = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "https://online-voting-qss7.onrender.com/api/admin/candidates",
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );

            setCandidates(res.data);

        } catch(err){

            console.log(err);

        }

    };

  

    const toggleStatus = async(id)=>{

        try{

            const token=localStorage.getItem("token");

            const candidate=candidates.find(
                c=>c.user_id===id
            );

            await axios.patch(

                `https://online-voting-qss7.onrender.com/api/admin/candidates/${id}/status`,

                {},

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );

            if(candidate.status==="Active"){

                toast.success(
                    "Candidate deactivated successfully."
                );

            }else{

                toast.success(
                    "Candidate activated successfully."
                );

            }

            loadCandidates();

        }catch(err){

            toast.error("Status update failed");

        }

    };

    const filtered=candidates.filter(candidate=>

        candidate.full_name
        .toLowerCase()
        .includes(search.toLowerCase())

        ||

        candidate.email
        .toLowerCase()
        .includes(search.toLowerCase())

        ||

        candidate.username
        .toLowerCase()
        .includes(search.toLowerCase())

    );

    const last=currentPage*candidatePerPage;

    const first=last-candidatePerPage;

    const currentCandidates=
        filtered.slice(first,last);

    const totalPages=
        Math.ceil(filtered.length/candidatePerPage);

const confirmDelete = async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await axios.delete(
            `https://online-voting-qss7.onrender.com/api/admin/candidates/${deleteId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        toast.success(res.data.message);

        setShowDeleteConfirm(false);

        loadCandidates();

    } catch (err) {

        toast.error(
            err.response?.data?.message || "Delete failed"
        );

    }
};
const exportCSV = () => {

    const csvData = candidates.map((candidate) => ({
        ID: candidate.user_id,
        Name: candidate.full_name,
        Email: candidate.email,
        Username: candidate.username,
        Status: candidate.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Candidates"
    );

    XLSX.writeFile(
        workbook,
        "Candidates_Report.csv",
        {
            bookType: "csv"
        }
    );

    toast.success("Candidates exported successfully!");

};
    return(

<div className="candidate-page">

<div className="candidate-header">

    <h2>Candidates</h2>

    <div className="header-buttons">

        <button
            className="csv-btn"
            onClick={exportCSV}
        >
            Export CSV
        </button>

        <button
            className="add-btn"
            onClick={() => setShowAdd(true)}
        >
            + Add Candidate
        </button>

    </div>

</div>
<div className="search-box">

<input

placeholder="Search Candidate"

value={search}

onChange={(e)=>{

setSearch(e.target.value);

setCurrentPage(1);

}}

 />

</div>

<table className="candidate-table">

<thead>

<tr>

<th>ID</th>

<th>Name</th>

<th>Email</th>

<th>Username</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{currentCandidates.map(candidate=>(

<tr key={candidate.user_id}>

<td>{candidate.user_id}</td>

<td>{candidate.full_name}</td>

<td>{candidate.email}</td>

<td>{candidate.username}</td>

  
                             <td>
    {candidate.status === "Active"
        ? "🟢 Active"
        : "🔴 Inactive"}
</td>


<td>
  <div className="action-buttons">
    <div className="action-row">
      <button
    className="view-btn"
    onClick={() => {
        setSelectedCandidate(candidate);
        setShowView(true);
    }}
>
    View
</button>
    <button
    className="edit-btn"
    onClick={() => {
        setSelectedCandidate(candidate);
        setShowEdit(true);
    }}
>
    Edit
</button>
    </div>

    <div className="action-row">
      <button className="status-btn" onClick={() => toggleStatus(candidate.user_id)}>
        {candidate.status === "Active" ? "Deactivate" : "Activate"}
      </button>

      <button
    className="reset-btn"
    onClick={() => {
        setSelectedCandidate(candidate);
        setShowReset(true);
    }}
>
    Reset Password
</button>
    </div>

    <div className="action-row">
    <button
    className="delete-btn"
    onClick={() => {
        setDeleteId(candidate.user_id);
        setShowDeleteConfirm(true);
    }}
>
    Delete
</button>
    </div>
  </div>
</td>
</tr>

))}

</tbody>

</table>

<div className="pagination">

<button

disabled={currentPage===1}

onClick={()=>setCurrentPage(currentPage-1)}

>

Previous

</button>

{

Array.from(

{length:totalPages},

(_,index)=>(

<button

key={index}

className={
currentPage===index+1
?
"active-page"
:
""
}

onClick={()=>setCurrentPage(index+1)}

>

{index+1}

</button>

)

)

}

<button

disabled={currentPage===totalPages}

onClick={()=>setCurrentPage(currentPage+1)}

>

Next

</button>

</div>
{showAdd && (
    <AddCandidateModal
        onClose={() => setShowAdd(false)}
        refreshCandidates={loadCandidates}
    />
)}
{showView && (
    <ViewCandidateModal
        candidate={selectedCandidate}
        close={() => setShowView(false)}
    />
)}

{showEdit && (
    <EditCandidateModal
        candidate={selectedCandidate}
        close={() => setShowEdit(false)}
        refresh={loadCandidates}
    />
)}
{showReset && (
    <ResetCandidatePasswordModal
        candidate={selectedCandidate}
        onClose={() => setShowReset(false)}
    />
)}
{showDeleteConfirm && (
    <div className="modal-overlay">
        <div className="delete-modal">

            <h3>Delete Candidate</h3>

            <p>
                Are you sure you want to delete this candidate?
            </p>

            <div className="delete-buttons">

                <button
                    className="delete-btn"
                    onClick={confirmDelete}
                >
                    Yes, Delete
                </button>

                <button
                    className="cancel-btn"
                    onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteId(null);
                    }}
                >
                    Cancel
                </button>

            </div>

        </div>
    </div>
)}
</div>

);

}
