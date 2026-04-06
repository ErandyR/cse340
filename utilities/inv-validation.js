const utilities = require(".");

const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
    return [
        // classification name is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
}

/* ******************************
* Check data and return errors or continue to add classification
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Vehicle Management",
            nav,
        })
        return
    }
    next()
}

/* ******************************
*  Inventory Data Validation Rules
* ***************************** */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a make."), // on error this message is sent.

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a model."), // on error this message is sent.
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
            .withMessage("Please provide a valid year."), // on error this message is sent.
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."), // on error this message is sent.

        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide valid miles."), // on error this message is sent.

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2, max: 100 })
            .withMessage("Please provide a valid color."), // on error this message is sent.
    ]
}

/* ******************************
* Check inventory data and return errors or continue to add inventory
* ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const classificationList = await utilities.buildClassificationList(req.body.classification_id)
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Vehicle Management",
            nav,
            classificationList,
            ...req.body,
        })
        return
    }
    next()
}


module.exports = validate