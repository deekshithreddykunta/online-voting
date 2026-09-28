const pool = require("../config/db");

async function findUserByEmail(email) {

    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );

    return result.rows[0];
}

async function findUserByUsername(username) {

    const result = await pool.query(
        "SELECT * FROM users WHERE username=$1",
        [username]
    );

    return result.rows[0];
}

async function createUser(user) {

    const {
        role_id,
        full_name,
        username,
        email,
        phone,
        password,
        voter_id
    } = user;

    const result = await pool.query(
        `INSERT INTO users
        (role_id, full_name, username, email, phone, password, voter_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
        [
            role_id,
            full_name,
            username,
            email,
            phone,
            password,
            voter_id
        ]
    );

    return result.rows[0];
}

async function findUserByEmailOrUsername(login) {

    const result = await pool.query(
        `
        SELECT *
        FROM users
        WHERE LOWER(email) = LOWER($1)
           OR LOWER(username) = LOWER($1)
        `,
        [login]
    );

    return result.rows[0];
}

async function findUserById(id) {

    const result = await pool.query(
        "SELECT * FROM users WHERE user_id=$1",
        [id]
    );

    return result.rows[0];
}

async function updatePassword(user_id, password) {

    await pool.query(
        `UPDATE users
         SET password = $1
         WHERE user_id = $2`,
        [password, user_id]
    );

}
async function findUserByPhone(phone) {
    const result = await pool.query(
        "SELECT * FROM users WHERE phone = $1",
        [phone]
    );

    return result.rows[0];
}
async function updateProfile(user_id, user) {

    const {
        full_name,
        username,
        email,
        phone
    } = user;

    const result = await pool.query(
        `UPDATE users
         SET full_name=$1,
             username=$2,
             email=$3,
             phone=$4
         WHERE user_id=$5
         RETURNING *`,
        [
            full_name,
            username,
            email,
            phone,
            user_id
        ]
    );

    return result.rows[0];
}
async function updateProfileImage(user_id, image) {

    const result = await pool.query(

        `UPDATE users
         SET profile_image=$1
         WHERE user_id=$2
         RETURNING *`,

        [image, user_id]

    );

    return result.rows[0];

}
module.exports = {
    findUserByEmail,
    findUserByUsername,
    findUserByEmailOrUsername,
    findUserById,
    createUser,
    updatePassword,
    updateProfile,
    updateProfileImage,
    findUserByPhone

};