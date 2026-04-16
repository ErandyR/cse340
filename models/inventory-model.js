const pool = require("../database/")

/* ******************************************
* Get all classification data
*******************************************/
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ******************************************
* Get inventory items and classification_name by classification_id
*******************************************/
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getInventoryByClassificationId error: " + error)
    }
}

/* ******************************************
* Get inventory item by inv_id
*******************************************/
async function getInventoryByInvId(inv_id) {
    try {
        const data = await
            pool.query(
                `SELECT * FROM public.inventory AS i
                JOIN public.classification AS c 
                ON i.classification_id = c.classification_id
                WHERE i.inv_id = $1`,
                [inv_id]
            )
        return data.rows
    } catch (error) {
        console.error("getInventoryByInvId error: " + error)
    }
}

/* ******************************************
* Add a classification to the database
*******************************************/
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        const data = await pool.query(sql, [classification_name])
        return data.rows[0]
    } catch (error) {
        console.error("addClassification error: " + error)
        throw error.message
    }
}

/* ******************************************
* Add inventory item to the database
*******************************************/
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const sql = `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
        const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
        return data.rows[0]
    } catch (error) {
        console.error("addInventory error: " + error)
        throw error.message
    }
}

/* ******************************************
* Update inventory item in the database
*******************************************/
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const sql = `UPDATE public.inventory 
        SET inv_make = $2, inv_model = $3, inv_year = $4, inv_description = $5, inv_image = $6, inv_thumbnail = $7, inv_price = $8, inv_miles = $9, inv_color = $10, classification_id = $11 
        WHERE inv_id = $1 
        RETURNING *`
        const data = await pool.query(sql, [inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
        return data.rows[0]
    } catch (error) {
        console.error("updateInventory error: " + error)
        throw error.message
    }
}

/* ******************************************
* Delete inventory item from the database
*******************************************/
async function deleteInventory(inv_id) {
    try {
        const sql = `DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *`
        const data = await pool.query(sql, [inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("deleteInventory error: " + error)
        throw error.message
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByInvId, addClassification, addInventory, updateInventory, deleteInventory };