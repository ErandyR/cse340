// Needed resources
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
    const { account_email, account_password } = req.body
    const accountData = await accountModel.loginAccount(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    console.log("Password ingresado:", account_password)
    console.log("Password en DB:", accountData.account_password)
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign({
                account_id: accountData.account_id,
                account_firstname: accountData.account_firstname,
                account_lastname: accountData.account_lastname,
                account_email: accountData.account_email,
                account_type: accountData.account_type
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        return res.status(500).send(error.message)
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
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* * ***********************
* Deliver account management view
* *********************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    const account = res.locals.accountData
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
        account_firstname: account.account_firstname,
        account_lastname: account.account_lastname,
        account_email: account.account_email,
        account_type: account.account_type,
        account_id: account.account_id,
    })
}

/* * ***********************
* Build update view
* *********************** */
async function buildUpdate(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = req.params.account_id
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account: accountData.rows[0],
    })
}

/* * ***********************
* Process account update form
* *********************** */
async function updateAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const updateResult = await accountModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email
    )
    if (updateResult) {
        req.flash("notice", "Account updated successfully.")
        res.status(200).render("account/account-management", {
            title: "Account Management",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_type: res.locals.accountData.account_type,
            account_id,
        })
    }
    else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id,
            account_firstname,
            account_lastname,
            account_email,
        })
    }
}

/* * ***********************
* Process update password form
* *********************** */
async function updatePassword(req, res, next) {
    let nav = await utilities.getNav()
    const { account_id, account_password } = req.body
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the password update.')
        res.status(500).render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id,
        })
    }
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
    if (updateResult) {
        req.flash("notice", "Password updated successfully.")
        res.status(200).render("account/account-management", {
            title: "Account Management",
            nav,
            errors: null,
            account_firstname: res.locals.accountData.account_firstname,
            account_lastname: res.locals.accountData.account_lastname,
            account_email: res.locals.accountData.account_email,
            account_type: res.locals.accountData.account_type,
            account_id,
        })
    }
    else {
        req.flash("notice", "Sorry, the password update failed.")
        res.status(501).render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id,
        })
    }
}



/* * ***********************
* log out user
* *********************** */
async function logoutAccount(req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            console.log("Error destroying session during logout.", err)
        }
        res.clearCookie("jwt")
        res.redirect("/account/login")
    })
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, buildManagement, buildUpdate, updateAccount, updatePassword, logoutAccount }