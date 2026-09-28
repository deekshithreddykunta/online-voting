console.log("Result Controller Loaded");
const db = require("../config/db");

exports.getResults = async (req, res) => {
    try {
        const result = await db.query(`
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
            ORDER BY r.election_id DESC, p.position_name, r.rank;
        `);

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to fetch results"
        });
    }
};
exports.getWinners = async (req, res) => {

    try {

        const result = await db.query(`
            SELECT DISTINCT ON (p.position_id)

                p.position_name,

                u.full_name AS winner,

                COUNT(v.vote_id) AS vote_count

            FROM candidates c

            JOIN users u
                ON u.user_id = c.user_id

            JOIN positions p
                ON p.position_id = c.position_id

            LEFT JOIN votes v
                ON v.candidate_id = c.candidate_id

            GROUP BY
                p.position_id,
                p.position_name,
                u.full_name

            ORDER BY
                p.position_id,
                vote_count DESC;
        `);

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Failed to fetch winners"
        });

    }

};
exports.getVoterResults = async (req, res) => {

    try {

        // Get active election
        const election = await db.query(`
            SELECT
                election_name,
                end_date,
                end_time
            FROM elections
            WHERE status='Active'
            LIMIT 1
        `);

        if (election.rows.length === 0) {

            return res.json({
                finished: false,
                message: "No active election found"
            });

        }

        const e = election.rows[0];

        // Convert DD-MM-YYYY + 12-hour time
        const [day, month, year] = e.end_date.split("-");

        let [time, period] = e.end_time.split(" ");

        let [hour, minute] = time.split(":");

        hour = parseInt(hour);

        if (period === "PM" && hour !== 12) hour += 12;

        if (period === "AM" && hour === 12) hour = 0;

        const endDate = new Date(
            `${year}-${month}-${day}T${String(hour).padStart(2, "0")}:${minute}:00`
        );

        if (new Date() < endDate) {

            return res.json({

                finished: false

            });

        }

        const results = await db.query(`

SELECT

p.position_name,

u.full_name AS candidate_name,

c.party_name,

COUNT(v.vote_id)::int AS vote_count,

ROUND(

COUNT(v.vote_id)*100.0/

SUM(COUNT(v.vote_id))
OVER(PARTITION BY p.position_name),

2

) AS percentage

FROM candidates c

JOIN users u
ON u.user_id=c.user_id

JOIN positions p
ON p.position_id=c.position_id

LEFT JOIN votes v
ON v.candidate_id=c.candidate_id

GROUP BY

p.position_name,
u.full_name,
c.party_name

ORDER BY

p.position_name,
vote_count DESC

`);

const winners = await db.query(`

SELECT DISTINCT ON (p.position_id)

p.position_name,

u.full_name AS winner,

c.party_name,

COUNT(v.vote_id)::int AS vote_count

FROM candidates c

JOIN users u
ON u.user_id=c.user_id

JOIN positions p
ON p.position_id=c.position_id

LEFT JOIN votes v
ON v.candidate_id=c.candidate_id

GROUP BY

p.position_id,
p.position_name,
u.full_name,
c.party_name

ORDER BY

p.position_id,
vote_count DESC

`);
        res.json({

    finished: true,

    election: e.election_name,

    winners: winners.rows,

    results: results.rows

});

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Server Error"

        });

    }

};
console.log("Controller exports:", Object.keys(module.exports));