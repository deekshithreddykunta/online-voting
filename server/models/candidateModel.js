const pool = require("../config/db");
const getDashboard = async (userId) => {
    const query = `
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE status='PENDING') AS pending,
            COUNT(*) FILTER (WHERE status='APPROVED') AS approved,
            COUNT(*) FILTER (WHERE status='REJECTED') AS rejected
        FROM candidate_applications
        WHERE user_id=$1
    `;

    const result = await db.query(query,[userId]);

    return result.rows[0];
};
const getProfile = async (userId)=>{

    const query=`
        SELECT
            user_id,
            full_name,
            username,
            email,
            phone,
            voter_id,
            profile_photo
        FROM users
        WHERE user_id=$1
    `;

    const result=await db.query(query,[userId]);

    return result.rows[0];
};
const getAvailableElections = async () => {

    const query = `
        SELECT
            election_id,
            election_name,
            election_year,
            start_date,
            end_date,
            status
        FROM elections
        WHERE status='ACTIVE'
        ORDER BY start_date ASC
    `;

    const result = await db.query(query);

    return result.rows;
};
const getPositions = async (electionId)=>{

    const query=`
        SELECT
            position_id,
            position_name
        FROM positions
        WHERE election_id=$1
        AND status='ACTIVE'
    `;

    const result=await db.query(query,[electionId]);

    return result.rows;
};
const getMyNominations = async(userId)=>{

const query=`

SELECT

ca.application_id,

e.election_name,

p.position_name,

ca.status,

ca.submitted_at

FROM candidate_applications ca

JOIN elections e

ON e.election_id=ca.election_id

JOIN positions p

ON p.position_id=ca.position_id

WHERE ca.user_id=$1

ORDER BY ca.submitted_at DESC

`;

const result=await db.query(query,[userId]);

return result.rows;

};
module.exports = {

getDashboard,

getProfile,

getAvailableElections,

getPositions,

getMyNominations

};