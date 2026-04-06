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

/***********************
 * Build inventory management view
 * *********************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    })
}

/***********************
 * Build add classification view
 * *********************** */
invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/***********************
 * Process the add classification form
 * *********************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body
    const data = await invModel.addClassification(classification_name)
    if (data) {
        req.flash("success", "Classification added successfully.")
        res.redirect("/inv/")
    } else {
        req.flash("error", "Failed to add classification")
        res.redirect("/inv/add-classification")
    }
}

/***********************
 * Build add inventory view
 * *********************** */
invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        ...req.body,
        errors: null,
    })
}

/***********************
 * Process the add inventory form
 * *********************** */
invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const data = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (data) {
        req.flash("success", "Inventory added successfully.")
        res.redirect("/inv/")
    }
    else {
        const classificationList = await utilities.buildClassificationList(data.classification_id)
        req.flash("error", "Failed to add inventory")
        res.render("/inv/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null,
        })
    }
}



module.exports = invCont