const pool = require("../database/")

async function addToGarage(account_id, inv_id) {
    return await pool.query(
        "INSERT INTO garage (account_id, inv_id) VALUES ($1, $2)",
        [account_id, inv_id]
    )
}

async function getGarage(account_id) {
    return await pool.query(
        `SELECT inventory.*
     FROM garage
     JOIN inventory ON garage.inv_id = inventory.inv_id
     WHERE garage.account_id = $1`,
        [account_id]
    )
}

async function removeFromGarage(account_id, inv_id) {
    return await pool.query(
        "DELETE FROM garage WHERE account_id=$1 AND inv_id=$2",
        [account_id, inv_id]
    )
}

module.exports = { addToGarage, getGarage, removeFromGarage }