const pool = require("../config/db");
const bcrypt = require("bcryptjs");
/* ===========================================
   Change Password
=========================================== */

exports.changePassword = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        const user = await pool.query(
            `
            SELECT password
            FROM users
            WHERE user_id = $1
            `,
            [userId]
        );

        if (user.rows.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const match = await bcrypt.compare(
            currentPassword,
            user.rows[0].password
        );

        if (!match) {

            return res.status(400).json({
                message: "Current password is incorrect"
            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await pool.query(
            `
            UPDATE users
            SET password = $1
            WHERE user_id = $2
            `,
            [
                hashedPassword,
                userId
            ]
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
   Candidate Dashboard
=========================================== */
exports.getDashboard = async (req, res) => {

    try {

const userId = req.user.user_id;

const candidate = await pool.query(
    `
    SELECT candidate_id
    FROM candidates
    WHERE user_id = $1
    `,
    [userId]
);

if (candidate.rows.length === 0) {
    return res.status(404).json({
        message: "Candidate record not found"
    });
}

const candidateId = candidate.rows[0].candidate_id;
        const total = await pool.query(
            `SELECT COUNT(*) FROM candidate_applications
             WHERE candidate_id=$1`,
            [candidateId]
        );

        const pending = await pool.query(
            `SELECT COUNT(*) FROM candidate_applications
             WHERE candidate_id=$1
             AND application_status='PENDING'`,
            [candidateId]
        );

        const approved = await pool.query(
            `SELECT COUNT(*) FROM candidate_applications
             WHERE candidate_id=$1
             AND application_status='APPROVED'`,
            [candidateId]
        );

        const rejected = await pool.query(
            `SELECT COUNT(*) FROM candidate_applications
             WHERE candidate_id=$1
             AND application_status='REJECTED'`,
            [candidateId]
        );

        res.json({
            total: Number(total.rows[0].count),
            pending: Number(pending.rows[0].count),
            approved: Number(approved.rows[0].count),
            rejected: Number(rejected.rows[0].count)
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};

/* ===========================================
   Candidate Profile
=========================================== */
exports.getProfile = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT
                user_id,
                voter_id,
                full_name,
                username,
                email,
                phone,
                profile_photo
            FROM users
            WHERE user_id=$1
            `,
            [userId]
        );

        res.json(result.rows[0]);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};

/* ===========================================
   Available Elections
=========================================== */
exports.getAvailableElections = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT
                election_id,
                election_name,
                description,
                election_category,
                election_type,
                election_year,
                start_date,
                end_date,
                status
            FROM elections
            WHERE status='Active'
            ORDER BY start_date ASC
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

/* ===========================================
   Election Positions
=========================================== */
exports.getPositions = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                position_id,
                position_name
            FROM positions
            WHERE election_id=$1
            AND status='Active'
            ORDER BY position_name
            `,
            [id]
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
   My Nominations
=========================================== */
exports.getMyNominations = async (req, res) => {

    try {

const userId = req.user.user_id;

const candidate = await pool.query(
    `
    SELECT candidate_id
    FROM candidates
    WHERE user_id = $1
    `,
    [userId]
);

if (candidate.rows.length === 0) {
    return res.status(404).json({
        message: "Candidate record not found"
    });
}

const candidateId = candidate.rows[0].candidate_id;
        const result = await pool.query(
`
SELECT
    ca.application_id,
    e.election_name,
    p.position_name,
    ca.constituency,
    ca.application_status AS status,
    ca.remarks,
    ca.applied_at,
    TO_CHAR(ca.applied_at,'DD Mon YYYY HH24:MI') AS applied_date
FROM candidate_applications ca
JOIN elections e
    ON e.election_id = ca.election_id
JOIN positions p
    ON p.position_id = ca.position_id
WHERE ca.candidate_id = $1
ORDER BY ca.applied_at DESC
`,
[candidateId]
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
   Apply For Election
=========================================== */

// ======================================
// APPLY FOR ELECTION
// ======================================

exports.applyElection = async (req, res) => {

    try {

        const userId = req.user.user_id;

        // Get candidate_id from candidates table
        const candidateResult = await pool.query(
            `
            SELECT candidate_id
            FROM candidates
            WHERE user_id = $1
            `,
            [userId]
        );

        if (candidateResult.rows.length === 0) {
            return res.status(404).json({
                message: "Candidate record not found."
            });
        }

        const candidateId = candidateResult.rows[0].candidate_id;

        const {
            election_id,
            position_id,
            constituency,
            qualification,
            manifesto
        } = req.body;

        // Check duplicate application
        const existing = await pool.query(
`
SELECT application_id
FROM candidate_applications
WHERE candidate_id = $1
AND election_id = $2
AND position_id = $3
`,
[
    candidateId,
    election_id,
    position_id
]
);

if (existing.rows.length > 0) {
    return res.status(400).json({
        success: false,
        message: "You have already applied for this position in this election."
    });
}

        // Insert application
        await pool.query(
            `
            INSERT INTO candidate_applications
            (
                candidate_id,
                election_id,
                position_id,
                constituency,
                qualification,
                manifesto,
                application_status,
                applied_at
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,
                'Pending',
                NOW()
            )
            `,
            [
                candidateId,
                election_id,
                position_id,
                constituency,
                qualification,
                manifesto
            ]
        );

        res.json({
            success: true,
            message: "Nomination submitted successfully."
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
/* ===========================================
   Update Candidate Profile
=========================================== */

exports.updateProfile = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            full_name,
            email,
            phone
        } = req.body;

        await pool.query(
            `
            UPDATE users
            SET
                full_name = $1,
                email = $2,
                phone = $3
            WHERE user_id = $4
            `,
            [
                full_name,
                email,
                phone,
                userId
            ]
        );

        res.json({
            message: "Profile updated successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};
/* ===========================================
   Candidate Results
=========================================== */

exports.getResults = async (req, res) => {

    try {

const userId = req.user.user_id;

const candidate = await pool.query(
    `
    SELECT candidate_id
    FROM candidates
    WHERE user_id = $1
    `,
    [userId]
);

if (candidate.rows.length === 0) {
    return res.status(404).json({
        message: "Candidate record not found"
    });
}

const candidateId = candidate.rows[0].candidate_id;
        const result = await pool.query(

            `
            SELECT

                r.result_id,

                e.election_name,

                p.position_name,

                r.total_votes,

                r.vote_percentage,

                r.rank,

                r.is_winner

            FROM results r

            JOIN elections e
                ON e.election_id = r.election_id

            JOIN positions p
                ON p.position_id = r.position_id

            WHERE r.candidate_id = $1

            ORDER BY e.start_date DESC
            `,

            [candidateId]

        );

        res.json(result.rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};
/* ===========================================
   Submit Nomination
=========================================== */
/* ===========================================
   Submit Nomination
=========================================== */

/* ===========================================
   Submit Nomination
=========================================== */

exports.submitNomination = async (req, res) => {

    try {

        const userId = req.user.user_id;

        // Get Candidate ID
        const candidate = await pool.query(
            `
            SELECT candidate_id
            FROM candidates
            WHERE user_id = $1
            `,
            [userId]
        );

        if (candidate.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Candidate record not found."
            });

        }

        const candidateId = candidate.rows[0].candidate_id;

        const {

            election_id,
            position_id,
            constituency,

            gender,
            dob,
            address,

            qualification,
            experience,

            party_name,
            manifesto,

            photo,
            id_proof,
            nomination_form,
            symbol

        } = req.body;

        /* ----------------------------------
           Duplicate Check
        ----------------------------------- */

        const existing = await pool.query(
            `
            SELECT application_id
            FROM candidate_applications
            WHERE candidate_id=$1
            AND election_id=$2
            AND position_id=$3
            `,
            [
                candidateId,
                election_id,
                position_id
            ]
        );

        if (existing.rows.length > 0) {

            return res.status(400).json({

                success: false,

                message:
                    "You have already applied for this position."

            });

        }

        /* ----------------------------------
           Save Candidate Profile
        ----------------------------------- */

        await pool.query(
            `
            UPDATE candidates
            SET

                election_id=$1,
                position_id=$2,

                gender=$3,
                dob=$4,
                address=$5,

                qualification=$6,
                experience=$7,

                party_name=$8,
                manifesto=$9,

                photo=$10,
                id_proof=$11,
                nomination_form=$12,
                symbol=$13,

                profile_completed=TRUE,
                updated_at=NOW()

            WHERE candidate_id=$14
            `,
            [

                election_id,
                position_id,

                gender,
                dob,
                address,

                qualification,
                experience,

                party_name || "Independent",
                manifesto,

                photo,
                id_proof,
                nomination_form,
                symbol,

                candidateId

            ]
        );

        /* ----------------------------------
           Save Application
        ----------------------------------- */

        await pool.query(
            `
            INSERT INTO candidate_applications
            (
                candidate_id,
                election_id,
                position_id,
                constituency,
                application_status,
                applied_at
            )
            VALUES
            (
                $1,$2,$3,$4,
                'Pending',
                NOW()
            )
            `,
            [
                candidateId,
                election_id,
                position_id,
                constituency
            ]
        );

        res.status(201).json({

            success: true,

            message: "Nomination submitted successfully."

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
exports.checkExistingNomination = async (req, res) => {
    try {

        const userId = req.user.user_id;

        const candidate = await pool.query(
            `
            SELECT candidate_id
            FROM candidates
            WHERE user_id = $1
            `,
            [userId]
        );

        if (candidate.rows.length === 0) {
            return res.status(404).json({
                message: "Candidate record not found"
            });
        }

        const candidateId = candidate.rows[0].candidate_id;

        const { election_id, position_id } = req.query;

        const existing = await pool.query(
            `
            SELECT application_id
            FROM candidate_applications
            WHERE candidate_id = $1
              AND election_id = $2
              AND position_id = $3
            `,
            [
                candidateId,
                election_id,
                position_id
            ]
        );

        res.json({
            exists: existing.rows.length > 0
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }
};

console.log(Object.keys(module.exports));