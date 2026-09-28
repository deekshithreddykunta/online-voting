console.log("OFFICER CONTROLLER FILE LOADED");
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ===============================
// GET ALL OFFICERS
// ===============================
exports.getAllOfficers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        eo.officer_id,
        u.user_id,
        u.full_name,
        u.username,
        u.email,
        u.phone,
        eo.employee_id,
        eo.department,
        u.is_active,
        u.created_at,
        CASE
          WHEN u.is_active THEN 'Active'
          ELSE 'Inactive'
        END AS status
      FROM users u
      JOIN election_officers eo
        ON u.user_id = eo.user_id
      WHERE u.role_id = 2
      ORDER BY eo.officer_id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// ADD OFFICER
// ===============================
exports.addOfficer = async (req, res) => {
  try {
    const {
      full_name,
      username,
      email,
      phone,
      password,
      employee_id,
      department,
      
    } = req.body;

    if (
      !full_name ||
      !username ||
      !email ||
      !password ||
      !employee_id
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check Email
    const check = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
// Generate next voter ID
// Get last voter ID
const voterResult = await pool.query(`
    SELECT voter_id
    FROM users
    ORDER BY voter_id DESC
    LIMIT 1
`);

let voterId = "VOT202600001";

if (voterResult.rows.length > 0) {
    const lastId = voterResult.rows[0].voter_id;

    // Extract numeric part
    const number = parseInt(lastId.substring(7));

    voterId = "VOT2026" + String(number + 1).padStart(5, "0");
}
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert User
    const user = await pool.query(
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
    2,
    full_name,
    username,
    email,
    phone,
    hashedPassword,

      ]
    );

    const userId = user.rows[0].user_id;

    // Insert Officer
   await pool.query(
  `
  INSERT INTO election_officers
  (
      user_id,
      employee_id,
      department
  )
  VALUES
  ($1, $2, $3)
  `,
  [
      userId,
      employee_id,
      department
  ]
);

    res.status(201).json({
      message: "Officer added successfully",
    });

  } catch (err) {

    if (err.code === "23505") {
if (err.constraint === "election_officers_employee_id_key") {
        return res.status(400).json({
            message: "Employee ID already exists"
        });
    }

        if (err.constraint.includes("email")) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        if (err.constraint.includes("username")) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        if (err.constraint.includes("employee")) {
            return res.status(400).json({
                message: "Employee ID already exists"
            });
        }

        if (
            err.constraint.includes("phone") ||
            err.constraint.includes("mobile")
        ) {
            return res.status(400).json({
                message: "Mobile number already exists"
            });
        }
    }

    console.log(err);
    await pool.query(
    `
    INSERT INTO activities(user_id, activity)
    VALUES($1,$2)
    `,
    [
        userId,
        `Added Officer : ${full_name}`
    ]
);

    return res.status(500).json({
        message: "Something went wrong"
    });
}
};
exports.updateOfficer = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            full_name,
            username,
            email,
            phone,
            employee_id,
            department
        } = req.body;

        await pool.query(
            `
            UPDATE users
            SET
                full_name=$1,
                username=$2,
                email=$3,
                phone=$4
            WHERE user_id=$5
            `,
            [
                full_name,
                username,
                email,
                phone,
                id
            ]
        );

        await pool.query(
            `
            UPDATE election_officers
            SET
                employee_id=$1,
                department=$2
            WHERE user_id=$3
            `,
            [
                employee_id,
                department,
                id
            ]
        );
await pool.query(
    `
    INSERT INTO activities(user_id, activity)
    VALUES($1,$2)
    `,
    [
        id,
        `Updated Officer : ${full_name}`
    ]
);
        res.json({
            message: "Officer updated successfully"
        });

    } catch (err) {

        if (err.code === "23505") {
if (err.constraint === "election_officers_employee_id_key") {
        return res.status(400).json({
            message: "Employee ID already exists"
        });
    }

            if (err.constraint.includes("email")) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            if (err.constraint.includes("username")) {
                return res.status(400).json({
                    message: "Username already exists"
                });
            }

            if (err.constraint.includes("phone")) {
                return res.status(400).json({
                    message: "Phone number already exists"
                });
            }

            if (err.constraint.includes("employee")) {
                return res.status(400).json({
                    message: "Employee ID already exists"
                });
            }
        }

        res.status(500).json({
            message: err.message
        });

    }
};
exports.deleteOfficer = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete activity records first
        await pool.query(
            "DELETE FROM activities WHERE user_id = $1",
            [id]
        );

        // Delete officer
        await pool.query(
            "DELETE FROM users WHERE user_id = $1 AND role_id = 2",
            [id]
        );

        res.json({
            message: "Officer deleted successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
};
exports.toggleOfficerStatus = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            `
            UPDATE users
            SET is_active = NOT is_active
            WHERE user_id = $1
            `,
            [id]
        );
        const officer = await pool.query(
    "SELECT full_name, is_active FROM users WHERE user_id=$1",
    [id]
);

const status = officer.rows[0].is_active
    ? "Activated"
    : "Deactivated";

await pool.query(
    `
    INSERT INTO activities(user_id, activity)
    VALUES($1,$2)
    `,
    [
        id,
        `${status} Officer : ${officer.rows[0].full_name}`
    ]
);

        res.json({
            message: "Officer status updated successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};