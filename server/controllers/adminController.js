const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {

    // Cards
    const officers = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role_id = 2"
    );

    const voters = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role_id = 4"
    );

    const candidates = await pool.query(
      "SELECT COUNT(*) FROM candidates"
    );

    const active = await pool.query(
      "SELECT COUNT(*) FROM elections WHERE status='Active'"
    );

    // Election Wise Votes
    const voteChart = await pool.query(`
      SELECT
        e.election_name,
        COUNT(v.vote_id)::int AS votes
      FROM elections e
      LEFT JOIN votes v
        ON e.election_id = v.election_id
      GROUP BY e.election_id, e.election_name
      ORDER BY e.election_id
    `);

    // Monthly Registrations
    const monthly = await pool.query(`
      SELECT
        TO_CHAR(created_at,'Mon') AS month,
        COUNT(*)::int AS users
      FROM users
      GROUP BY
        DATE_TRUNC('month', created_at),
        TO_CHAR(created_at,'Mon')
      ORDER BY
        DATE_TRUNC('month', created_at)
    `);
// Recent Elections
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

// Recent Activities
const recentActivities = await pool.query(`
    SELECT
        activity_id,
        activity,
        created_at
    FROM activities
    ORDER BY created_at DESC
    LIMIT 5
`);
    res.json({
  officers: Number(officers.rows[0].count),
  voters: Number(voters.rows[0].count),
  candidates: Number(candidates.rows[0].count),
  activeElections: Number(active.rows[0].count),

  voteChart: voteChart.rows,
  monthly: monthly.rows,

  recentElections: recentElections.rows,
  recentActivities: recentActivities.rows,
});

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
