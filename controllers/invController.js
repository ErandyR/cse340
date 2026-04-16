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
    const error = new Error("Error triggered for testing purposes.")
    error.status = 500
    next(error)
}

/***********************
 * Build inventory management view
 * *********************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationList,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/***********************
 * Build edit inventory view
 * *********************** */
invCont.buildEditInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId)
    const data = await invModel.getInventoryByInvId(inv_id)
    const item = data[0]
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(data[0].classification_id)
    const itemName = item.inv_make + " " + item.inv_model
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id: item.inv_id,
        inv_make: item.inv_make,
        inv_model: item.inv_model,
        inv_year: item.inv_year,
        inv_description: item.inv_description,
        inv_image: item.inv_image,
        inv_thumbnail: item.inv_thumbnail,
        inv_price: item.inv_price,
        inv_miles: item.inv_miles,
        inv_color: item.inv_color,
        classification_id: item.classification_id,
    })
}

/***********************
 * Process the edit inventory form
 * *********************** */
invCont.editInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const data = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (data) {
        const itemName = data.inv_make + " " + data.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    }
    else {
        const classificationList = await utilities.buildClassificationList(data.classification_id)
        const itemName = inv_make + " " + inv_model
        req.flash("error", `Failed to update ${itemName}`)
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationList: classificationList,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

/***********************
 * Delete inventory view
 * *********************** */
invCont.buildDeleteInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const data = await invModel.getInventoryByInvId(inv_id)
    const item = data[0]
    const itemName = item.inv_make + " " + item.inv_model
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: item.inv_id,
        inv_make: item.inv_make,
        inv_model: item.inv_model,
        inv_year: item.inv_year,
        inv_price: item.inv_price,
        classification_id: item.classification_id,
    })
}

/***********************
 * Process the delete inventory form
 * *********************** */
invCont.deleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id)
    let nav = await utilities.getNav()
    const data = await invModel.deleteInventory(inv_id)
    if (data) {
        const itemName = `${data.inv_make} ${data.inv_model}`
        req.flash("notice", `The ${itemName} was successfully deleted.`)
        res.redirect("/inv/")
    }
    else {
        req.flash("error", `Failed to delete item`)
        res.status(501).render("inventory/delete-confirm", {
            title: "Delete ",
            nav,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            classification_id,
        })
    }
}






module.exports = invCont