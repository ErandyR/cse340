// Needed resources
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* * ***********************
* Deliver login view
* *********************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* * ***********************
* Process login attempt
* *********************** */
async function loginAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_email } = req.body
    const loginResult = await accountModel.loginAccount(account_email)
    console.log("loginResult:", loginResult)
    if (loginResult) {
        req.flash(
            "notice",
            `Welcome back ${loginResult.account_firstname}. You are now logged in.`
        )
        return res.status(200).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the login failed. Please check your email and password and try again.")
        res.status(501).render("account/login", {
            title: "Login",
            nav,
        })
    }
}

/* * ***********************    
* Deliver registration view
* *********************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* * ***********************
* Process registration form
* *********************** */
async function registerAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost factor of 10 for hashing
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount }