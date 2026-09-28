const pool = require("../config/db");

async function generateVoterId() {

    const year = new Date().getFullYear();

    const result = await pool.query(`
        SELECT voter_id
        FROM users
        WHERE voter_id LIKE $1
        ORDER BY voter_id DESC
        LIMIT 1
    `, [`VOT${year}%`]);

    let nextNumber = 1;

    if (result.rows.length > 0) {

        const lastId = result.rows[0].voter_id;

        const lastNumber = parseInt(lastId.slice(-5), 10);

        nextNumber = lastNumber + 1;
    }

    return `VOT${year}${String(nextNumber).padStart(5, "0")}`;
}

module.exports = generateVoterId;