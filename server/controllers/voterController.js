console.log("✅ voterController loaded");
const pool = require("../config/db");

// ===============================
// GET ALL VOTERS
// ===============================
exports.getAllVoters = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                user_id,
                voter_id,
                full_name,
                username,
                email,
                phone,
                created_at,
                CASE
                    WHEN is_active THEN 'Active'
                    ELSE 'Inactive'
                END AS status
                
            FROM users
            WHERE role_id = 4
            ORDER BY user_id DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }
};
const bcrypt = require("bcryptjs");

// ===============================
// ADD VOTER
// ===============================
exports.addVoter = async (req, res) => {

    try {

        const {
            full_name,
            username,
            email,
            phone,
            password
        } = req.body;

        if (
            !full_name ||
            !username ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // Check Email
        const checkEmail = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (checkEmail.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
const checkUsername = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
);

if (checkUsername.rows.length > 0) {
    return res.status(400).json({
        message: "Username already exists"
    });
}
        // Generate Voter ID
        const voterResult = await pool.query(`
            SELECT voter_id
            FROM users
            ORDER BY voter_id DESC
            LIMIT 1
        `);

        let voterId = "VOT202600001";

        if (voterResult.rows.length > 0) {

            const lastId = voterResult.rows[0].voter_id;

            const number = parseInt(lastId.substring(7));

            voterId =
                "VOT2026" +
                String(number + 1).padStart(5, "0");
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert Voter
 const newUser = await pool.query(
`
INSERT INTO users
(
    voter_id,
    role_id,
    full_name,
    username,
    email,
    phone,
    password,
    is_active
)
VALUES
($1,$2,$3,$4,$5,$6,$7,true)
RETURNING user_id
`,
[
    voterId,
    4,
    full_name,
    username,
    email,
    phone,
    hashedPassword
]
);

// Create corresponding voter record
await pool.query(
`
INSERT INTO voters
(
    user_id
)
VALUES($1)
`,
[
    newUser.rows[0].user_id
]
);

        res.status(201).json({
            message: "Voter added successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
exports.updateVoter = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            full_name,
            username,
            email,
            phone
        } = req.body;

        const checkEmail = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            AND user_id <> $2
            `,
            [email, id]
        );

        if (checkEmail.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        await pool.query(
            `
            UPDATE users
            SET
                full_name = $1,
                username = $2,
                email = $3,
                phone = $4
            WHERE
                user_id = $5
                AND role_id = 4
            `,
            [
                full_name,
                username,
                email,
                phone,
                id
            ]
        );

        res.json({
            message: "Voter updated successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }
};
exports.deleteVoter = async (req, res) => {

    try {

        const { id } = req.params;

        // Delete activities first (if any)
        await pool.query(
            "DELETE FROM activities WHERE user_id = $1",
            [id]
        );

        // Delete voter
        const result = await pool.query(
            `
            DELETE FROM users
            WHERE user_id = $1
            AND role_id = 4
            RETURNING *
            `,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Voter not found"
            });
        }

        res.json({
            message: "Voter deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
exports.toggleVoterStatus = async (req, res) => {
    try {

        const { id } = req.params;

        const voter = await pool.query(
            "SELECT is_active FROM users WHERE user_id=$1 AND role_id=4",
            [id]
        );

        if (voter.rows.length === 0) {
            return res.status(404).json({
                message: "Voter not found"
            });
        }

        const newStatus = !voter.rows[0].is_active;

        await pool.query(
            "UPDATE users SET is_active=$1 WHERE user_id=$2",
            [newStatus, id]
        );

        res.json({
            message: `Voter ${newStatus ? "activated" : "deactivated"} successfully`
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }
};
exports.exportVoters = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                voter_id,
                full_name,
                username,
                email,
                phone,
                CASE
                    WHEN is_active THEN 'Active'
                    ELSE 'Inactive'
                END AS status
            FROM users
            WHERE role_id = 4
            ORDER BY voter_id
        `);

        const voters = result.rows;

        let csv =
            "Voter ID,Full Name,Username,Email,Phone,Status\n";

        voters.forEach((voter) => {

            csv +=
                `"${voter.voter_id}",` +
                `"${voter.full_name}",` +
                `"${voter.username}",` +
                `"${voter.email}",` +
                `"${voter.phone || ""}",` +
                `"${voter.status}"\n`;

        });

        res.header("Content-Type", "text/csv");
        res.attachment("voters.csv");

        return res.send(csv);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Export failed"
        });

    }
};


exports.resetVoterPassword = async (req, res) => {

    try {

        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            UPDATE users
            SET password = $1
            WHERE user_id = $2
            AND role_id = 4
            RETURNING user_id
            `,
            [hashedPassword, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Voter not found"
            });
        }

        res.json({
            message: "Password reset successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};