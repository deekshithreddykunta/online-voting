const pool = require("../config/db");

// ===============================
// GET BALLOT
// ===============================
exports.getBallot = async (req, res) => {
    try {
        const election = await pool.query(
            `
            SELECT
                election_id,
                election_name
            FROM elections
            WHERE status = 'Active'
            ORDER BY election_id DESC
            LIMIT 1
            `
        );

        if (election.rows.length === 0) {
            return res.json([]);
        }

        const electionId = election.rows[0].election_id;
        const electionName = election.rows[0].election_name;

        const positions = await pool.query(
            `
            SELECT
                position_id,
                position_name
            FROM positions
            WHERE election_id = $1
            ORDER BY position_id
            `,
            [electionId]
        );

        const ballot = [];

        for (const position of positions.rows) {
            const candidates = await pool.query(
                `
                SELECT
                    c.candidate_id,
                    c.party_name,
                    c.photo,
                    c.symbol,
                    c.manifesto,
                    u.full_name
                FROM candidate_applications ca
                JOIN candidates c
                    ON c.candidate_id = ca.candidate_id
                JOIN users u
                    ON u.user_id = c.user_id
                WHERE
                    ca.election_id = $1
                    AND ca.position_id = $2
                    AND ca.application_status = 'Approved'
                    AND u.is_active = true
                ORDER BY u.full_name
                `,
                [electionId, position.position_id]
            );

            ballot.push({
                position_id: position.position_id,
                position_name: position.position_name,
                candidates: candidates.rows
            });
        }

        res.json({
            election_id: electionId,
            election_name: electionName,
            positions: ballot
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
exports.castVote = async (req, res) => {
        console.log("✅ castVote API called");
    try {
      const userId = req.user.user_id;
console.log("Logged in user_id:", userId);
const voterResult = await pool.query(
    `
    SELECT voter_pk
    FROM voters
    WHERE user_id = $1
    `,
    [userId]
);
console.log("Voter Query Result:", voterResult.rows);
if (voterResult.rows.length === 0) {
    return res.status(404).json({
        message: "Voter record not found."
    });
}

const voterId = voterResult.rows[0].voter_pk;
        const {
            election_id,
            votes
        } = req.body;

        // Check if voter already voted
        const alreadyVoted = await pool.query(
            `SELECT * FROM votes
             WHERE voter_id = $1
             AND election_id = $2`,
            [voterId, election_id]
        );

        if (alreadyVoted.rows.length > 0) {
            return res.status(400).json({
                message: "You have already voted."
            });
        }

        // Save votes
        for (const vote of votes) {
            await pool.query(
                `INSERT INTO votes
                (
                    election_id,
                    position_id,
                    voter_id,
                    candidate_id
                )
                VALUES($1,$2,$3,$4)`,
                [
                    election_id,
                    vote.position_id,
                    voterId,
                    vote.candidate_id
                ]
            );
        }

        res.json({
            message: "Vote Cast Successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
// ===============================
// CHECK IF VOTER HAS VOTED
// ===============================
exports.hasVoted = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const voter = await pool.query(
            `
            SELECT voter_pk
            FROM voters
            WHERE user_id = $1
            `,
            [userId]
        );

        if (voter.rows.length === 0) {

            return res.json({
                voted: false
            });

        }

        const voterId = voter.rows[0].voter_pk;

        const election = await pool.query(
            `
            SELECT election_id
            FROM elections
            WHERE status='Active'
            LIMIT 1
            `
        );

        if (election.rows.length === 0) {

            return res.json({
                voted: false
            });

        }

        const electionId = election.rows[0].election_id;

        const vote = await pool.query(
            `
            SELECT vote_id
            FROM votes
            WHERE voter_id=$1
            AND election_id=$2
            LIMIT 1
            `,
            [
                voterId,
                electionId
            ]
        );

        res.json({
            voted: vote.rows.length > 0
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
// ===============================
// GET VOTING STATUS
// ===============================
// ===============================
// GET VOTING STATUS
// ===============================
exports.getVotingStatus = async (req, res) => {

    try {

        const userId = req.user.user_id;

        // Find voter
        const voter = await pool.query(
            `
            SELECT voter_pk
            FROM voters
            WHERE user_id = $1
            `,
            [userId]
        );

        if (voter.rows.length === 0) {
            return res.status(404).json({
                message: "Voter not found"
            });
        }

        const voterId = voter.rows[0].voter_pk;

        // Find current active election
        const election = await pool.query(
            `
            SELECT election_id
            FROM elections
            WHERE status = 'Active'
            LIMIT 1
            `
        );

        if (election.rows.length === 0) {
            return res.json({
                voted: false
            });
        }

        const electionId = election.rows[0].election_id;

        // Check vote only for current election
        const voted = await pool.query(
            `
            SELECT vote_id
            FROM votes
            WHERE voter_id = $1
              AND election_id = $2
            LIMIT 1
            `,
            [voterId, electionId]
        );

        res.json({
            voted: voted.rows.length > 0
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
// ===============================
// MY VOTES
// ===============================

// ===============================
// MY VOTES
// ===============================
exports.getMyVotes = async (req, res) => {
    console.log("🔥 getMyVotes Controller Executed");

    try {

        const userId = req.user.user_id;

        const voter = await pool.query(
            `
            SELECT voter_pk
            FROM voters
            WHERE user_id=$1
            `,
            [userId]
        );

        if (voter.rows.length === 0) {

            return res.status(404).json({
                message: "Voter not found"
            });

        }

        const voterId = voter.rows[0].voter_pk;

        const result = await pool.query(
            `
            SELECT
                e.election_name,
                MIN(v.voted_at) AS voted_at,
                e.status,
                CONCAT(
                    'VT-',
                    LPAD(v.election_id::text,4,'0'),
                    LPAD(v.voter_id::text,5,'0')
                ) AS receipt_no
            FROM votes v
            JOIN elections e
                ON e.election_id = v.election_id
            WHERE v.voter_id = $1
            GROUP BY
                e.election_name,
                e.status,
                v.election_id,
                v.voter_id
            ORDER BY voted_at DESC
            `,
            [voterId]
        );

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};