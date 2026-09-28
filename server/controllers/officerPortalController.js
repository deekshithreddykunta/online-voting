const pool = require("../config/db");

/* ===========================================
   Officer Dashboard
=========================================== */

exports.getDashboard = async (req, res) => {

    try {

        // Summary Cards

        const activeElections = await pool.query(`
            SELECT COUNT(*) count
            FROM elections
            WHERE status='Active'
        `);

        const totalVoters = await pool.query(`
            SELECT COUNT(*) count
            FROM users
            WHERE role_id = 4
        `);

        const votesCast = await pool.query(`
            SELECT COUNT(*) count
            FROM votes
        `);

        const pendingApplications = await pool.query(`
            SELECT COUNT(*) count
            FROM candidate_applications
            WHERE application_status='Pending'
        `);

        // Active Elections Table

        const activeElectionList = await pool.query(`
            SELECT
    election_id,
    election_name,
    election_category,

    TO_CHAR(start_date,'DD Mon YYYY') || '  ' ||
    TO_CHAR(start_time,'HH12:MI AM') AS starts,

    TO_CHAR(end_date,'DD Mon YYYY') || '  ' ||
    TO_CHAR(end_time,'HH12:MI AM') AS ends,

    status

FROM elections
WHERE status='Active'
ORDER BY start_date,start_time;
        `);

        // Recent Candidate Applications

        const recentApplications = await pool.query(`
            SELECT
                ca.application_id,
                u.full_name,
                e.election_name,
                p.position_name,
                ca.application_status
            FROM candidate_applications ca
            JOIN candidates c
                ON c.candidate_id = ca.candidate_id
            JOIN users u
                ON u.user_id = c.user_id
            JOIN elections e
                ON e.election_id = ca.election_id
            JOIN positions p
                ON p.position_id = ca.position_id
            ORDER BY ca.applied_at DESC
            LIMIT 5
        `);

        // Statistics

        const totalCandidates = await pool.query(`
            SELECT COUNT(*) count
            FROM candidate_applications
        `);

        const approvedCandidates = await pool.query(`
            SELECT COUNT(*) count
            FROM candidate_applications
            WHERE application_status='Approved'
        `);

        const rejectedCandidates = await pool.query(`
            SELECT COUNT(*) count
            FROM candidate_applications
            WHERE application_status='Rejected'
        `);

        const turnout = await pool.query(`
            SELECT
                CASE
                    WHEN
                    (
                        SELECT COUNT(*)
                        FROM users
                        WHERE role_id=4
                    ) = 0
                    THEN 0
                    ELSE ROUND(
                        (
                            SELECT COUNT(*)::decimal
                            FROM votes
                        ) * 100 /
                        (
                            SELECT COUNT(*)
                            FROM users
                            WHERE role_id=4
                        ),
                        2
                    )
                END AS turnout
        `);

        res.json({

            activeElections: Number(activeElections.rows[0].count),

            totalVoters: Number(totalVoters.rows[0].count),

            votesCast: Number(votesCast.rows[0].count),

            pendingApplications: Number(pendingApplications.rows[0].count),

            activeElectionList: activeElectionList.rows,

            recentApplications: recentApplications.rows,

            totalCandidates: Number(totalCandidates.rows[0].count),

            approvedCandidates: Number(approvedCandidates.rows[0].count),

            rejectedCandidates: Number(rejectedCandidates.rows[0].count),

            turnout: Number(turnout.rows[0].turnout)

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};
/* ===========================================
   Get All Elections
=========================================== */

exports.getElections = async (req, res) => {

    try {

        const elections = await pool.query(`

            SELECT

                e.election_id,

                e.election_name,

                TO_CHAR(e.start_date,'DD Mon YYYY') || ' ' ||
                TO_CHAR(e.start_time,'HH12:MI AM')
                || '  →  ' ||
                TO_CHAR(e.end_date,'DD Mon YYYY') || ' ' ||
                TO_CHAR(e.end_time,'HH12:MI AM')
                AS schedule,

                e.status,

                (
                    SELECT COUNT(*)
                    FROM candidate_applications ca
                    WHERE ca.election_id = e.election_id
                    AND ca.application_status='Approved'
                ) AS candidates,

                (
                    SELECT COUNT(*)
                    FROM votes v
                    WHERE v.election_id = e.election_id
                ) AS votes

            FROM elections e

            ORDER BY e.created_at DESC

        `);

        res.json(elections.rows);

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:err.message

        });

    }

};
exports.createElection = async (req, res) => {

    try {

        let {

            election_name,
            description,
            start_date,
            start_time,
            end_date,
            end_time,
            status

        } = req.body;

        if (!status) {

            const now = new Date();

            const start = new Date(`${start_date}T${start_time}`);

            const end = new Date(`${end_date}T${end_time}`);

            if (now < start) {

                status = "Upcoming";

            }

            else if (now >= start && now <= end) {

                status = "Active";

            }

            else {

                status = "Completed";

            }

        }

        await pool.query(

            `INSERT INTO elections
            (
                election_name,
                description,
                start_date,
                start_time,
                end_date,
                end_time,
                status
            )

            VALUES($1,$2,$3,$4,$5,$6,$7)`,

            [

                election_name,
                description,
                start_date,
                start_time,
                end_date,
                end_time,
                status

            ]

        );

        res.status(201).json({

            message: "Election Created Successfully"

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
exports.activateElection = async (req, res) => {

    try {

        await pool.query(

            `UPDATE elections
             SET status='Active'
             WHERE election_id=$1`,

            [req.params.id]

        );

        res.json({

            message: "Election Activated"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

exports.closeElection = async (req, res) => {

    try {

        await pool.query(

            `UPDATE elections
             SET status='Completed'
             WHERE election_id=$1`,

            [req.params.id]

        );

        res.json({

            message: "Election Closed"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
/* ===========================================
   Get Election By ID
=========================================== */

exports.getElectionById = async (req, res) => {

    try {

        const election = await pool.query(

            `SELECT

                election_id,
                election_name,
                description,

                TO_CHAR(start_date,'DD Mon YYYY') AS start_date,
                TO_CHAR(start_time,'HH12:MI AM') AS start_time,

                TO_CHAR(end_date,'DD Mon YYYY') AS end_date,
                TO_CHAR(end_time,'HH12:MI AM') AS end_time,

                status

            FROM elections

            WHERE election_id=$1`,

            [req.params.id]

        );

        if (election.rows.length === 0) {

            return res.status(404).json({

                message: "Election not found"

            });

        }

        res.json(election.rows[0]);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
exports.updateElection = async (req, res) => {

    try {

        const {

            election_name,
            description,
            start_date,
            start_time,
            end_date,
            end_time,
            status

        } = req.body;

        await pool.query(

            `UPDATE elections

            SET

            election_name=$1,
            description=$2,
            start_date=$3,
            start_time=$4,
            end_date=$5,
            end_time=$6,
            status=$7

            WHERE election_id=$8`,

            [

                election_name,
                description,
                start_date,
                start_time,
                end_date,
                end_time,
                status,
                req.params.id

            ]

        );

        res.json({

            message: "Election Updated"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
/* ===========================================
   Delete Election
=========================================== */

exports.deleteElection = async (req, res) => {

    try {

        await pool.query(
            "DELETE FROM elections WHERE election_id = $1",
            [req.params.id]
        );

        res.json({
            message: "Election Deleted Successfully"
        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};
/* ===========================================
   Get Candidate Applications
=========================================== */

exports.getApplications = async (req, res) => {

    try {

        const applications = await pool.query(

            `SELECT

                ca.application_id,

                u.full_name,

                u.email,

                u.phone,

                e.election_name,

                p.position_name,

                TO_CHAR(ca.applied_at,'DD Mon YYYY HH12:MI AM') AS applied_at,

                ca.application_status,

                ca.remarks

            FROM candidate_applications ca

            JOIN candidates c
                ON c.candidate_id = ca.candidate_id

            JOIN users u
                ON u.user_id = c.user_id

            JOIN elections e
                ON e.election_id = ca.election_id

            JOIN positions p
                ON p.position_id = ca.position_id

            ORDER BY ca.applied_at DESC`

        );

        res.json(applications.rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
exports.getApplications = async (req, res) => {

    try {

        const applications = await pool.query(`

            SELECT

                ca.application_id,

                ca.application_status,

                ca.applied_at,

                ca.constituency,

                ca.remarks,

                c.candidate_id,

                c.party_name,

                c.photo,

                c.symbol,

                u.user_id,

                u.full_name,

                u.email,

                u.phone,

                u.voter_id,

                e.election_name,

                p.position_name

            FROM candidate_applications ca

            JOIN candidates c
                ON ca.candidate_id = c.candidate_id

            JOIN users u
                ON c.user_id = u.user_id

            JOIN elections e
                ON ca.election_id = e.election_id

            JOIN positions p
                ON ca.position_id = p.position_id

            ORDER BY ca.applied_at DESC

        `);

        res.json(applications.rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
/* ===========================================
   Get Application By ID
=========================================== */

exports.getApplicationById = async (req, res) => {

    try {

        const application = await pool.query(

            `SELECT

                ca.application_id,
                ca.application_status,
                ca.constituency,
                ca.remarks,
                ca.applied_at,

                c.candidate_id,
                c.party_name,
                c.manifesto,
                c.biography,
                c.qualification,
                c.experience,
                c.gender,
                c.dob,
                c.address,
                c.photo,
                c.profile_photo,
                c.signature,
                c.id_proof,
                c.nomination_form,
                c.symbol,
                c.verification_status,
                c.profile_completed,

                u.full_name,
                u.username,
                u.email,
                u.phone,
                u.voter_id,

                e.election_name,
                e.election_category,
                e.election_type,
                e.election_year,
                e.start_date,
                e.end_date,
                e.start_time,
                e.end_time,

                p.position_name,
                p.eligibility

            FROM candidate_applications ca

            JOIN candidates c
                ON ca.candidate_id = c.candidate_id

            JOIN users u
                ON c.user_id = u.user_id

            JOIN elections e
                ON ca.election_id = e.election_id

            JOIN positions p
                ON ca.position_id = p.position_id

            WHERE ca.application_id = $1`,

            [req.params.id]

        );

        if (application.rows.length === 0) {

            return res.status(404).json({

                message: "Application not found"

            });

        }

        res.json(application.rows[0]);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
/* ===========================================
   Approve Candidate Application
=========================================== */

exports.approveApplication = async (req, res) => {

    try {

        const { remarks } = req.body;

        // Check application exists
        const application = await pool.query(

            `SELECT
                application_id,
                application_status
             FROM candidate_applications
             WHERE application_id = $1`,

            [req.params.id]

        );

        if (application.rows.length === 0) {

            return res.status(404).json({

                message: "Application not found"

            });

        }

        // Already approved
        if (application.rows[0].application_status === "Approved") {

            return res.status(400).json({

                message: "Application already approved"

            });

        }

        await pool.query(

            `UPDATE candidate_applications

             SET
                application_status = 'Approved',
                remarks = $1

             WHERE application_id = $2`,

            [

                remarks || "Approved by Election Officer",

                req.params.id

            ]

        );

        res.json({

            success: true,

            message: "Candidate application approved successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ===========================================
   Reject Candidate Application
=========================================== */

exports.rejectApplication = async (req, res) => {

    try {

        const { remarks } = req.body;

        // Check application exists
        const application = await pool.query(

            `SELECT
                application_id,
                application_status
             FROM candidate_applications
             WHERE application_id = $1`,

            [req.params.id]

        );

        if (application.rows.length === 0) {

            return res.status(404).json({

                message: "Application not found"

            });

        }

        // Already rejected
        if (application.rows[0].application_status === "Rejected") {

            return res.status(400).json({

                message: "Application already rejected"

            });

        }

        await pool.query(

            `UPDATE candidate_applications

             SET
                application_status = 'Rejected',
                remarks = $1

             WHERE application_id = $2`,

            [

                remarks || "Rejected by Election Officer",

                req.params.id

            ]

        );

        res.json({

            success: true,

            message: "Candidate application rejected successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
/* ===========================================
   Get Candidate Application By ID
=========================================== */

exports.getApplicationById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT

                ca.application_id,
                ca.application_status,
                ca.remarks,
                ca.applied_at,
                ca.constituency,

                u.user_id,
                u.full_name,
                u.username,
                u.email,
                u.phone,
                u.voter_id,

                c.gender,
                c.dob,
                c.address,
                c.qualification,
                c.experience,
                c.party_name,
                c.manifesto,
                c.photo,
                c.id_proof,
                c.nomination_form,
                c.symbol,

                e.election_name,

                p.position_name

            FROM candidate_applications ca

            JOIN candidates c
                ON c.candidate_id = ca.candidate_id

            JOIN users u
                ON u.user_id = c.user_id

            JOIN elections e
                ON e.election_id = ca.election_id

            JOIN positions p
                ON p.position_id = ca.position_id

            WHERE ca.application_id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Application not found"
            });

        }

        res.json(result.rows[0]);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};
/* ===========================================
   Get All Positions
=========================================== */

exports.getPositions = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                p.position_id,
                p.position_name,
                e.election_name,
                p.description,
                p.max_candidates,
                p.eligibility,
                p.status
            FROM positions p
            JOIN elections e
                ON e.election_id = p.election_id
            ORDER BY p.position_id DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};
/* ===========================================
   Get Position By ID
=========================================== */

exports.getPositionById = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM positions
            WHERE position_id=$1
        `,
        [req.params.id]);

        if(result.rows.length===0){

            return res.status(404).json({
                message:"Position not found"
            });

        }

        res.json(result.rows[0]);

    } catch(err){

        console.log(err);

        res.status(500).json({
            message:err.message
        });

    }

};
/* ===========================================
   Create Position
=========================================== */

exports.createPosition = async (req,res)=>{

    try{

        const{

            election_id,
            position_name,
            description,
            max_candidates,
            eligibility,
            status

        }=req.body;

        await pool.query(

            `INSERT INTO positions
            (
                election_id,
                position_name,
                description,
                max_candidates,
                eligibility,
                status
            )
            VALUES($1,$2,$3,$4,$5,$6)`,

            [
                election_id,
                position_name,
                description,
                max_candidates,
                eligibility,
                status
            ]

        );

        res.status(201).json({
            message:"Position created successfully"
        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({
            message:err.message
        });

    }

};
/* ===========================================
   Update Position
=========================================== */

exports.updatePosition = async (req, res) => {

    try {

        const {

            election_id,
            position_name,
            description,
            max_candidates,
            eligibility,
            status

        } = req.body;

        await pool.query(

            `
            UPDATE positions
            SET

                election_id=$1,
                position_name=$2,
                description=$3,
                max_candidates=$4,
                eligibility=$5,
                status=$6

            WHERE position_id=$7
            `,

            [

                election_id,
                position_name,
                description,
                max_candidates,
                eligibility,
                status,
                req.params.id

            ]

        );

        res.json({

            message: "Position updated successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
/* ===========================================
   Delete Position
=========================================== */

exports.deletePosition = async (req, res) => {

    try {

        await pool.query(

            `
            DELETE FROM positions
            WHERE position_id=$1
            `,

            [req.params.id]

        );

        res.json({

            message: "Position deleted successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
/* ===========================================
   Get All Voters
=========================================== */

exports.getVoters = async (req, res) => {
    try {
        const { search = "" } = req.query;

        const result = await pool.query(
            `
            SELECT
                user_id,
                voter_id,
                full_name,
                username,
                email,
                phone,
                is_verified,
                is_active,
                TO_CHAR(created_at, 'DD Mon YYYY') AS created_at
            FROM users
            WHERE role_id = 4
              AND (
                    full_name ILIKE $1
                 OR username ILIKE $1
                 OR email ILIKE $1
                 OR voter_id ILIKE $1
              )
            ORDER BY user_id DESC
            `,
            [`%${search}%`]
        );

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getVoterById = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                user_id,
                voter_id,
                full_name,
                username,
                email,
                phone,
                is_verified,
                is_active,
                TO_CHAR(created_at, 'DD Mon YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD Mon YYYY') AS updated_at
            FROM users
            WHERE user_id = $1 AND role_id = 4
            `,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Voter not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
exports.verifyVoter = async (req, res) => {
    try {
        await pool.query(
            `UPDATE users
             SET is_verified = true
             WHERE user_id = $1 AND role_id = 4`,
            [req.params.id]
        );

        res.json({ message: "Voter verified successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
exports.verifyVoter = async (req, res) => {
    try {
        await pool.query(
            `
            UPDATE users
            SET is_verified = true
            WHERE user_id = $1 AND role_id = 4
            `,
            [req.params.id]
        );

        res.json({
            message: "Voter verified successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getVotingStatus = async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await pool.query(
            `
            SELECT
                e.election_name,
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM votes v
                        WHERE v.election_id = e.election_id
                          AND v.voter_id = $1
                    )
                    THEN 'Voted'
                    ELSE 'Not Voted'
                END AS voting_status
            FROM elections e
            ORDER BY e.election_name
            `,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};
/* ===========================================
   Get All Results
=========================================== */



exports.getResults = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                r.result_id,
                r.election_id,
                e.election_name,
                r.position_id,
                p.position_name,
                r.candidate_id,
                u.full_name,
                c.party_name,
                r.total_votes,
                r.vote_percentage,
                r.rank,
                r.is_winner
            FROM results r
            LEFT JOIN elections e
                ON e.election_id = r.election_id
            LEFT JOIN positions p
                ON p.position_id = r.position_id
            LEFT JOIN candidates c
                ON c.candidate_id = r.candidate_id
            LEFT JOIN users u
                ON u.user_id = c.user_id
            ORDER BY r.result_id DESC
            `
        );

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};
exports.generateResults = async (req, res) => {
    try {
        const { election_id } = req.body;

        if (!election_id) {
            return res.status(400).json({
                message: "Election ID is required"
            });
        }

        await pool.query(
            `
            DELETE FROM results
            WHERE election_id = $1
            `,
            [election_id]
        );

        const candidates = await pool.query(
            `
            SELECT
                c.candidate_id,
                c.position_id,
                c.party_name,
                u.full_name,
                COUNT(v.vote_id) AS total_votes
            FROM candidates c
            JOIN users u
                ON u.user_id = c.user_id
            LEFT JOIN votes v
                ON v.candidate_id = c.candidate_id
               AND v.election_id = c.election_id
               AND v.position_id = c.position_id
            WHERE c.election_id = $1
            GROUP BY
                c.candidate_id,
                c.position_id,
                c.party_name,
                u.full_name
            ORDER BY COUNT(v.vote_id) DESC, c.candidate_id ASC
            `,
            [election_id]
        );

        let totalElectionVotes = 0;
        candidates.rows.forEach((row) => {
            totalElectionVotes += Number(row.total_votes);
        });

        const maxVotes =
            candidates.rows.length > 0
                ? Math.max(...candidates.rows.map((c) => Number(c.total_votes)))
                : 0;

        let rank = 1;

        for (const row of candidates.rows) {
            const totalVotes = Number(row.total_votes);

            const votePercentage =
                totalElectionVotes > 0
                    ? ((totalVotes / totalElectionVotes) * 100).toFixed(2)
                    : 0;

            const isWinner = totalVotes === maxVotes && maxVotes > 0;

            await pool.query(
                `
                INSERT INTO results
                (
                    election_id,
                    position_id,
                    candidate_id,
                    total_votes,
                    vote_percentage,
                    rank,
                    is_winner
                )
                VALUES
                (
                    $1, $2, $3, $4, $5, $6, $7
                )
                `,
                [
                    election_id,
                    row.position_id,
                    row.candidate_id,
                    totalVotes,
                    votePercentage,
                    rank,
                    isWinner
                ]
            );

            rank++;
        }

        res.json({
            message: "Results generated successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getResultByElection = async (req, res) => {
    try {
        const { election_id } = req.params;

        const result = await pool.query(
            `
            SELECT
                r.result_id,
                r.election_id,
                e.election_name,
                r.position_id,
                p.position_name,
                r.candidate_id,
                u.full_name,
                c.party_name,
                r.total_votes,
                r.vote_percentage,
                r.rank,
                r.is_winner
            FROM results r
            JOIN elections e
                ON e.election_id = r.election_id
            JOIN positions p
                ON p.position_id = r.position_id
            JOIN candidates c
                ON c.candidate_id = r.candidate_id
            JOIN users u
                ON u.user_id = c.user_id
            WHERE r.election_id = $1
            ORDER BY p.position_name, r.rank
            `,
            [election_id]
        );

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};
exports.publishResults = async (req, res) => {
    try {
        const { election_id } = req.body;

        if (!election_id) {
            return res.status(400).json({
                message: "Election ID is required"
            });
        }

        const electionCheck = await pool.query(
            `
            SELECT election_id, election_name, status
            FROM elections
            WHERE election_id = $1
            `,
            [election_id]
        );

        if (electionCheck.rows.length === 0) {
            return res.status(404).json({
                message: "Election not found"
            });
        }

        await pool.query(
            `
            UPDATE elections
            SET status = 'Completed'
            WHERE election_id = $1
            `,
            [election_id]
        );

        res.json({
            message: "Results published successfully"
        });
    } catch (err) {
        console.log("publishResults error:", err);
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getVoterResults = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                r.election_id,
                e.election_name,
                p.position_name,
                u.full_name AS candidate_name,
                c.party_name,
                r.total_votes AS vote_count,
                r.vote_percentage AS percentage,
                r.rank,
                r.is_winner
            FROM results r
            LEFT JOIN elections e
                ON e.election_id = r.election_id
            LEFT JOIN positions p
                ON p.position_id = r.position_id
            LEFT JOIN candidates c
                ON c.candidate_id = r.candidate_id
            LEFT JOIN users u
                ON u.user_id = c.user_id
            ORDER BY r.election_id DESC, p.position_name, r.rank
            `
        );

        if (result.rows.length === 0) {
            return res.json({
                finished: false,
                elections: []
            });
        }

        const grouped = {};

        for (const row of result.rows) {
            const electionId = row.election_id;

            if (!grouped[electionId]) {
                grouped[electionId] = {
                    election_id: electionId,
                    election_name: row.election_name || "Unknown Election",
                    election: row.election_name || "Unknown Election",
                    results: [],
                    winners: []
                };
            }

            const isWinner =
                row.is_winner === true ||
                row.is_winner === "true" ||
                row.is_winner === 1;

            grouped[electionId].results.push({
                position_name: row.position_name,
                candidate_name: row.candidate_name,
                party_name: row.party_name,
                vote_count: row.vote_count,
                percentage: row.percentage,
                rank: row.rank,
                is_winner: isWinner
            });

            if (isWinner) {
                grouped[electionId].winners.push({
                    position_name: row.position_name,
                    candidate_name: row.candidate_name,
                    party_name: row.party_name,
                    vote_count: row.vote_count
                });
            }
        }

        return res.json({
            finished: true,
            elections: Object.values(grouped)
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getLiveVoting = async (req, res) => {
    try {
        const electionResult = await pool.query(
            `
            SELECT
                election_id,
                election_name,
                description,
                status,
                start_date,
                end_date,
                start_time,
                end_time
            FROM elections
            WHERE status = 'Active'
            ORDER BY election_id DESC
            LIMIT 1
            `
        );

        // Total voters
        const totalVotersResult = await pool.query(`
            SELECT COUNT(*)::int AS total_voters
            FROM users
            WHERE role_id = 4
        `);

        const totalVoters = totalVotersResult.rows[0]?.total_voters || 0;

        if (electionResult.rows.length === 0) {
            return res.json({
                hasElection: false,
                election: null,
                positions: [],
                stats: {
                    total_voters: totalVoters,
                    votes_cast: 0,
                    turnout: 0,
                    votes_remaining: totalVoters
                }
            });
        }

        const election = electionResult.rows[0];

        // Votes cast for the active election
        // If your votes table uses `user_id` instead of `voter_id`, change voter_id -> user_id
        const votesCastResult = await pool.query(
            `
            SELECT COUNT(DISTINCT voter_id)::int AS votes_cast
            FROM votes
            WHERE election_id = $1
            `,
            [election.election_id]
        );

        const votesCast = votesCastResult.rows[0]?.votes_cast || 0;
        const turnout =
            totalVoters > 0 ? Number(((votesCast / totalVoters) * 100).toFixed(2)) : 0;
        const votesRemaining = Math.max(totalVoters - votesCast, 0);

        const positionsResult = await pool.query(
            `
            SELECT
                p.position_id,
                p.position_name,
                p.description,
                p.max_candidates,
                p.eligibility,
                p.status,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'candidate_id', c.candidate_id,
                            'full_name', u.full_name,
                            'party_name', c.party_name,
                            'photo', u.profile_image,
                            'symbol', c.symbol,
                            'manifesto', c.manifesto,
                            'vote_count', COALESCE(v.vote_count, 0)
                        )
                    ) FILTER (WHERE c.candidate_id IS NOT NULL),
                    '[]'
                ) AS candidates
            FROM positions p
            LEFT JOIN candidates c
                ON c.position_id = p.position_id
               AND c.election_id = p.election_id
            LEFT JOIN users u
                ON u.user_id = c.user_id
            LEFT JOIN (
                SELECT
                    candidate_id,
                    COUNT(*) AS vote_count
                FROM votes
                WHERE election_id = $1
                GROUP BY candidate_id
            ) v
                ON v.candidate_id = c.candidate_id
            WHERE p.election_id = $1
              AND p.status = 'Active'
            GROUP BY
                p.position_id,
                p.position_name,
                p.description,
                p.max_candidates,
                p.eligibility,
                p.status
            ORDER BY p.position_id ASC
            `,
            [election.election_id]
        );

        res.json({
            hasElection: true,
            election,
            positions: positionsResult.rows,
            stats: {
                total_voters: totalVoters,
                votes_cast: votesCast,
                turnout,
                votes_remaining: votesRemaining
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};


/* ===========================================
   View Profile
=========================================== */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT
                user_id,
                full_name,
                username,
                email,
                phone
            FROM users
            WHERE user_id = $1
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/* ===========================================
   Edit Profile
=========================================== */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { full_name, email, phone } = req.body;

        const result = await pool.query(
            `
            UPDATE users
            SET
                full_name = $1,
                email = $2,
                phone = $3,
                updated_at = NOW()
            WHERE user_id = $4
            RETURNING
                user_id,
                full_name,
                username,
                email,
                phone
            `,
            [full_name, email, phone, userId]
        );

        res.json({
            message: "Profile updated successfully",
            user: result.rows[0]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};

/* ===========================================
   Change Password
=========================================== */
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { currentPassword, newPassword } = req.body;

        const userResult = await pool.query(
            `
            SELECT password
            FROM users
            WHERE user_id = $1
            `,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `
            UPDATE users
            SET password = $1, updated_at = NOW()
            WHERE user_id = $2
            `,
            [hashedPassword, userId]
        );

        res.json({
            message: "Password changed successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};

/* ===========================================
   Get Candidate Applications
=========================================== */
exports.getApplications = async (req, res) => {
    try {
        const applications = await pool.query(
            `
            SELECT
                ca.application_id,
                ca.application_status,
                ca.remarks,
                ca.applied_at,
                ca.constituency,

                ca.candidate_id,
                c.party_name,
                c.photo,
                c.symbol,

                u.user_id,
                u.full_name,
                u.username,
                u.email,
                u.phone,
                u.voter_id,

                e.election_name,
                p.position_name
            FROM candidate_applications ca
            LEFT JOIN candidates c
                ON c.candidate_id = ca.candidate_id
            LEFT JOIN users u
                ON u.user_id = c.user_id
            LEFT JOIN elections e
                ON e.election_id = ca.election_id
            LEFT JOIN positions p
                ON p.position_id = ca.position_id
            ORDER BY ca.applied_at DESC
            `
        );
console.log("APPLICATIONS ROWS:", applications.rows);
        res.json(applications.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/* ===========================================
   Get Candidate Application By ID
=========================================== */
exports.getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                ca.application_id,
                ca.application_status,
                ca.remarks,
                ca.applied_at,
                ca.constituency,

                c.candidate_id,
                c.party_name,
                c.manifesto,
                c.biography,
                c.qualification,
                c.experience,
                c.gender,
                c.dob,
                c.address,
                c.photo,
                c.profile_photo,
                c.signature,
                c.id_proof,
                c.nomination_form,
                c.symbol,
                c.verification_status,
                c.profile_completed,

                u.user_id,
                u.full_name,
                u.username,
                u.email,
                u.phone,
                u.voter_id,

                e.election_name,
                e.election_category,
                e.election_type,
                e.election_year,
                e.start_date,
                e.end_date,
                e.start_time,
                e.end_time,

                p.position_name,
                p.eligibility
            FROM candidate_applications ca
            JOIN candidates c
                ON ca.candidate_id = c.candidate_id
            JOIN users u
                ON c.user_id = u.user_id
            JOIN elections e
                ON ca.election_id = e.election_id
            JOIN positions p
                ON ca.position_id = p.position_id
            WHERE ca.application_id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/* ===========================================
   Approve Candidate Application
=========================================== */
exports.approveApplication = async (req, res) => {
    try {
        const { remarks } = req.body;

        const application = await pool.query(
            `
            SELECT application_id, application_status
            FROM candidate_applications
            WHERE application_id = $1
            `,
            [req.params.id]
        );

        if (application.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.rows[0].application_status === "Approved") {
            return res.status(400).json({ message: "Application already approved" });
        }

        await pool.query(
            `
            UPDATE candidate_applications
            SET
                application_status = 'Approved',
                remarks = $1
            WHERE application_id = $2
            `,
            [remarks || "Approved by Election Officer", req.params.id]
        );

        res.json({
            success: true,
            message: "Candidate application approved successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* ===========================================
   Reject Candidate Application
=========================================== */
exports.rejectApplication = async (req, res) => {
    try {
        const { remarks } = req.body;

        const application = await pool.query(
            `
            SELECT application_id, application_status
            FROM candidate_applications
            WHERE application_id = $1
            `,
            [req.params.id]
        );

        if (application.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.rows[0].application_status === "Rejected") {
            return res.status(400).json({ message: "Application already rejected" });
        }

        await pool.query(
            `
            UPDATE candidate_applications
            SET
                application_status = 'Rejected',
                remarks = $1
            WHERE application_id = $2
            `,
            [remarks || "Rejected by Election Officer", req.params.id]
        );

        res.json({
            success: true,
            message: "Candidate application rejected successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* ===========================================
   Assign Symbol To Candidate
=========================================== */
exports.assignSymbol = async (req, res) => {
    try {
        const { symbol } = req.body;

        if (!symbol || !symbol.trim()) {
            return res.status(400).json({ message: "Symbol is required" });
        }

        const application = await pool.query(
            `
            SELECT ca.application_id, ca.application_status, ca.candidate_id
            FROM candidate_applications ca
            WHERE ca.application_id = $1
            `,
            [req.params.id]
        );

        if (application.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        const app = application.rows[0];

        if (app.application_status !== "Approved") {
            return res.status(400).json({
                message: "Symbol can be assigned only after approval"
            });
        }

        await pool.query(
            `
            UPDATE candidates
            SET symbol = $1
            WHERE candidate_id = $2
            `,
            [symbol.trim(), app.candidate_id]
        );

        res.json({
            message: "Symbol assigned successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
