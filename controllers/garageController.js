const garageModel = require("../models/garage-model")
const utilities = require("../utilities/")

/* **********************************
* Add a vehicle to the user's garage
* ********************************* */
async function addVehicle(req, res) {
    const { inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    await garageModel.addToGarage(account_id, inv_id)

    req.flash("notice", "Vehicle added to your garage successfully!")
    res.redirect("/account/garage")
}

/* **********************************
* View the user's garage
* ********************************* */
async function viewGarage(req, res) {
    let nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id
    const result = await garageModel.getGarage(account_id)

    res.render("account/garage", {
        title: "My Garage",
        vehicles: result.rows,
        nav,
        errors: null,
    })
}

/* **********************************
* Remove a vehicle from the user's garage
* ********************************* */
async function removeVehicle(req, res) {
    const { inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    await garageModel.removeFromGarage(account_id, inv_id)

    req.flash("notice", "Vehicle removed")
    res.redirect("/account/garage")
}

module.exports = { addVehicle, viewGarage, removeVehicle }