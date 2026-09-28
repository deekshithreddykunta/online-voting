const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
    console.log("Dashboard Controller Running");

    try {

        const officers = await pool.query(`
            SELECT COUNT(*) AS count
            FROM users u
            INNER JOIN election_officers eo
                ON u.user_id = eo.user_id
            WHERE u.role_id = 2
        `);

        const voters = await pool.query(`
            SELECT COUNT(*) AS count
            FROM users
            WHERE role_id = 4
        `);

        const candidates = await pool.query(`
            SELECT COUNT(*) AS count
            FROM users
            WHERE role_id = 3
        `);

        const activeElections = await pool.query(`
            SELECT COUNT(*) AS count
            FROM elections
            WHERE status='Active'
        `);

        const recentElections = await pool.query(`
            SELECT
                election_id,
                election_name,
                status,
                start_date,
                end_date
            FROM elections
            ORDER BY created_at DESC
            LIMIT 5
        `);

      
        console.log(recentElections.rows);

        res.json({
            officers: Number(officers.rows[0].count),
            voters: Number(voters.rows[0].count),
            candidates: Number(candidates.rows[0].count),
            activeElections: Number(activeElections.rows[0].count),

            voteChart: [],
            monthly: [],

            recentElections: recentElections.rows,
        
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }
};