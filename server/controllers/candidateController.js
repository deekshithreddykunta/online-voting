const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ===============================
// GET ALL CANDIDATES
// ===============================
exports.getAllCandidates = async (req, res) => {
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
            WHERE role_id = 3
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

// ===============================
// ADD CANDIDATE
// ===============================
exports.addCandidate = async (req,res)=>{

    try{

        const{
            full_name,
            username,
            email,
            phone,
            password
        }=req.body;

        if(
            !full_name||
            !username||
            !email||
            !password
        ){

            return res.status(400).json({
                message:"Please fill all required fields"
            });

        }

        const existingUser=await pool.query(
        `
        SELECT user_id
        FROM users
        WHERE username=$1
        OR email=$2
        `,
        [
            username,
            email
        ]
        );

        if(existingUser.rows.length>0){

            return res.status(400).json({
                message:"Username or Email already exists."
            });

        }

        const last=await pool.query(
        `
        SELECT voter_id
        FROM users
        ORDER BY voter_id DESC
        LIMIT 1
        `
        );

        let candidateId="VOT202600001";

        if(last.rows.length>0){

            const number=parseInt(
                last.rows[0].voter_id.substring(7)
            );

            candidateId=
            "VOT2026"+
            String(number+1).padStart(5,"0");

        }

        const hashedPassword=
        await bcrypt.hash(password,10);

        await pool.query(
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
        `,
        [
            candidateId,
            3,
            full_name,
            username,
            email,
            phone,
            hashedPassword
        ]
        );

        res.status(201).json({
            message:"Candidate added successfully"
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

};
// ===============================
// UPDATE CANDIDATE
// ===============================
// ===============================
// UPDATE CANDIDATE
// ===============================
exports.updateCandidate = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            full_name,
            username,
            email,
            phone
        } = req.body;

        // Check duplicate username/email except current candidate
        const existing = await pool.query(
            `
            SELECT user_id
            FROM users
            WHERE (username = $1 OR email = $2)
            AND user_id <> $3
            `,
            [username, email, id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                message: "Username or Email already exists."
            });
        }

        const result = await pool.query(
            `
            UPDATE users
            SET
                full_name = $1,
                username = $2,
                email = $3,
                phone = $4
            WHERE
                user_id = $5
                AND role_id = 3
            RETURNING *
            `,
            [
                full_name,
                username,
                email,
                phone,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        res.json({
            message: "Candidate updated successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};
// ===============================
// DELETE CANDIDATE
// ===============================
exports.deleteCandidate=async(req,res)=>{

    try{

        const{id}=req.params;

        await pool.query(
            "DELETE FROM activities WHERE user_id=$1",
            [id]
        );

        const result=await pool.query(
            `
            DELETE FROM users
            WHERE user_id=$1
            AND role_id=3
            RETURNING *
            `,
            [id]
        );

        if(result.rowCount===0){

            return res.status(404).json({
                message:"Candidate not found"
            });

        }

        res.json({
            message:"Candidate deleted successfully"
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

};

// ===============================
// ACTIVATE / DEACTIVATE
// ===============================
exports.toggleCandidateStatus=async(req,res)=>{

    try{

        const{id}=req.params;

        const candidate=await pool.query(
            `
            SELECT is_active
            FROM users
            WHERE user_id=$1
            AND role_id=3
            `,
            [id]
        );

        if(candidate.rows.length===0){

            return res.status(404).json({
                message:"Candidate not found"
            });

        }

        const status=!candidate.rows[0].is_active;

        await pool.query(
            `
            UPDATE users
            SET is_active=$1
            WHERE user_id=$2
            `,
            [status,id]
        );

        res.json({
            message:`Candidate ${status?"activated":"deactivated"} successfully`
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

};

// ===============================
// RESET PASSWORD
// ===============================
exports.resetCandidatePassword=async(req,res)=>{

    try{

        const{id}=req.params;

        const{password}=req.body;

        if(!password){

            return res.status(400).json({
                message:"Password is required"
            });

        }

        const hashedPassword=await bcrypt.hash(password,10);

        const result=await pool.query(
            `
            UPDATE users
            SET password=$1
            WHERE user_id=$2
            AND role_id=3
            RETURNING user_id
            `,
            [hashedPassword,id]
        );

        if(result.rows.length===0){

            return res.status(404).json({
                message:"Candidate not found"
            });

        }

        res.json({
            message:"Password reset successfully"
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

};