const pool = require("../config/db");

// Get All Positions
exports.getAllPositions = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                p.position_id,
                p.position_name,
                p.description,
                p.max_candidates,
                p.eligibility,
                p.status,
                p.election_id,
                e.election_name
            FROM positions p
            LEFT JOIN elections e
                ON p.election_id = e.election_id
            ORDER BY p.position_id DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

// Get One Position
exports.getPosition = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                p.position_id,
                p.position_name,
                p.description,
                p.max_candidates,
                p.eligibility,
                p.status,
                p.election_id,
                e.election_name
            FROM positions p
            LEFT JOIN elections e
                ON p.election_id = e.election_id
            WHERE p.position_id=$1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Position not found"
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

// Add Position
exports.addPosition = async (req, res) => {

    try {

        const {
            election_id,
            position_name,
            description,
            max_candidates,
            eligibility,
            status
        } = req.body;
        if (
    !election_id ||
    !position_name ||
    !max_candidates
) {

    return res.status(400).json({
        message: "Please fill all required fields."
    });

}
const checkPosition = await pool.query(
    `
    SELECT position_id
    FROM positions
    WHERE election_id = $1
      AND LOWER(position_name) = LOWER($2)
    `,
    [election_id, position_name]
);

if (checkPosition.rows.length > 0) {
    return res.status(400).json({
        message: "Position already exists for this election."
    });
}
        await pool.query(
            `
            INSERT INTO positions
            (
                election_id,
                position_name,
                description,
                max_candidates,
                eligibility,
                status
            )
            VALUES($1,$2,$3,$4,$5,$6)
            `,
            [
                election_id,
                position_name,
                description,
                max_candidates,
                eligibility,
                status
            ]
        );

        res.json({
            message: "Position added successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Update Position
exports.updatePosition = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            election_id,
            position_name,
            description,
            max_candidates,
            eligibility,
            status
        } = req.body;
        if (
    !election_id ||
    !position_name ||
    !max_candidates
) {

    return res.status(400).json({
        message: "Please fill all required fields."
    });

}
        const position = await pool.query(
    `
    SELECT position_id
    FROM positions
    WHERE position_id = $1
    `,
    [id]
);

if (position.rows.length === 0) {

    return res.status(404).json({
        message: "Position not found."
    });

}
const checkPosition = await pool.query(
    `
    SELECT position_id
    FROM positions
    WHERE election_id = $1
      AND LOWER(position_name) = LOWER($2)
      AND position_id <> $3
    `,
    [
        election_id,
        position_name,
        id
    ]
);

if (checkPosition.rows.length > 0) {

    return res.status(400).json({
        message: "Position already exists for this election."
    });

}
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
                id
            ]
        );

        res.json({
            message: "Position updated successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Delete Position
exports.deletePosition = async (req, res) => {

    try {

        const { id } = req.params;
        const position = await pool.query(
    `
    SELECT position_id
    FROM positions
    WHERE position_id = $1
    `,
    [id]
);

if (position.rows.length === 0) {

    return res.status(404).json({
        message: "Position not found."
    });

}
const assigned = await pool.query(
    `
    SELECT candidate_id
    FROM candidates
    WHERE position_id = $1
    `,
    [id]
);

if (assigned.rows.length > 0) {

    return res.status(400).json({
        message: "Cannot delete. Candidates are assigned to this position."
    });

}
        await pool.query(
            "DELETE FROM positions WHERE position_id=$1",
            [id]
        );

        res.json({
            message: "Position deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};