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

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(acctController.loginAccount)
)

// Route for account management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(acctController.buildManagement)
)

// Route for account update view
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(acctController.buildUpdate)
)

// Route to process account update
router.post(
    "/update",
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.checkLogin,
    utilities.handleErrors(acctController.updateAccount)
)

// route for password update 
router.post(
    "/update-password",
    regValidate.passwordUpdateRules(),
    regValidate.checkPasswordUpdateData,
    utilities.checkLogin,
    utilities.handleErrors(acctController.updatePassword)
)

// Route for logging out
router.get("/logout",
    utilities.handleErrors(acctController.logoutAccount)
)


module.exports = router;


