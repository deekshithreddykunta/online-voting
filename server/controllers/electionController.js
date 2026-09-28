const pool = require("../config/db");

// ============================
// Get All Elections
// ============================
exports.getAllElections = async (req, res) => {

    try {

        // Automatically complete expired elections
        await pool.query(`
            UPDATE elections
            SET status = 'Completed'
            WHERE status <> 'Completed'
              AND (end_date + end_time) <= NOW();
        `);

        // Automatically activate elections whose start time has arrived
        await pool.query(`
            UPDATE elections
            SET status = 'Active'
            WHERE status = 'Upcoming'
              AND (start_date + start_time) <= NOW()
              AND (end_date + end_time) > NOW();
        `);

        const result = await pool.query(`
            SELECT
                election_id,
                election_name,
                description,
                TO_CHAR(start_date, 'DD-MM-YYYY') AS start_date,
                TO_CHAR(end_date, 'DD-MM-YYYY') AS end_date,
                TO_CHAR(start_time, 'HH24:MI') AS start_time,
                TO_CHAR(end_time, 'HH24:MI') AS end_time,
                status
            FROM elections
            ORDER BY election_id DESC;
        `);

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ============================
// Get Single Election
// ============================
exports.getElection = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                election_id,
                election_name,
                description,
                start_date,
                end_date,
                start_time,
                end_time,
                status
            FROM elections
            WHERE election_id=$1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Election not found"
            });

        }

        res.json(result.rows[0]);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ============================
// Add Election
// ============================
exports.addElection = async (req, res) => {

    try {

        const {
            election_name,
            description,
            start_date,
            end_date,
            start_time,
            end_time,
            status
        } = req.body;

        await pool.query(
            `
            INSERT INTO elections
            (
                election_name,
                description,
                start_date,
                end_date,
                start_time,
                end_time,
                status
            )
            VALUES($1,$2,$3,$4,$5,$6,$7)
            `,
            [
                election_name,
                description,
                start_date,
                end_date,
                start_time,
                end_time,
                status
            ]
        );

        res.json({
            message: "Election created successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ============================
// Update Election
// ============================
exports.updateElection = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            election_name,
            description,
            start_date,
            end_date,
            start_time,
            end_time,
            status
        } = req.body;

        await pool.query(
            `
            UPDATE elections
            SET
                election_name=$1,
                description=$2,
                start_date=$3,
                end_date=$4,
                start_time=$5,
                end_time=$6,
                status=$7
            WHERE election_id=$8
            `,
            [
                election_name,
                description,
                start_date,
                end_date,
                start_time,
                end_time,
                status,
                id
            ]
        );

        res.json({
            message: "Election updated successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ============================
// Delete Election
// ============================
exports.deleteElection = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM elections WHERE election_id=$1",
            [id]
        );

        res.json({
            message: "Election deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
exports.getActiveElections = async (req, res) => {
    try {

        await pool.query(`
            UPDATE elections
            SET status='Completed'
            WHERE status <> 'Completed'
            AND (end_date + end_time) <= NOW();
        `);

        await pool.query(`
            UPDATE elections
            SET status='Active'
            WHERE status='Upcoming'
            AND (start_date + start_time) <= NOW()
            AND (end_date + end_time) > NOW();
        `);

        const result = await pool.query(`
            SELECT
                election_id,
                election_name,
                description,
                TO_CHAR(start_date,'DD-MM-YYYY') AS start_date,
                TO_CHAR(end_date,'DD-MM-YYYY') AS end_date,
                TO_CHAR(start_time,'HH12:MI AM') AS start_time,
                TO_CHAR(end_time,'HH12:MI AM') AS end_time,
                status
            FROM elections
            WHERE status='Active'
            ORDER BY election_id DESC;
        `);

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }
};
// ===============================
// AVAILABLE ELECTIONS FOR VOTER
// ===============================
exports.getAvailableElections = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                election_id,
                election_name,
                description,
                start_date,
                start_time,
                end_date,
                end_time,
                status
            FROM elections
            ORDER BY start_date DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};