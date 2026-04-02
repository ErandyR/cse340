//Needed resources
const express = require('express');
const router = new express.Router();
const utilities = require("../utilities/");
const acctController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

//Route for my account view
router.get("/login", utilities.handleErrors(acctController.buildLogin));

//Route for account registration view
router.get("/register", utilities.handleErrors(acctController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(acctController.registerAccount)
)

module.exports = router;


