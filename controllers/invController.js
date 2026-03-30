const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/***********************
 * Build inventory by classification view
 * *********************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/***********************
 * Build inventory detail view
 * *********************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
        title: data[0].inv_model + " " + data[0].inv_year,
        nav,
        data: await utilities.buildInventoryDetail(data[0])
    })
}

/***********************
 * Route to trigger a 500 error for testing
 * *********************** */
invCont.triggerError = async function (req, res, next) {
    console.log("EN LA RUTA DE ERROR")
    const error = new Error("Error triggered for testing purposes.")
    error.status = 500
    next(error)
}


module.exports = invCont