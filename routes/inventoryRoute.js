//Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require('../utilities/inv-validation');

//Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build inventory detail view
router.get("/detail/:invId", invController.buildByInvId);

//Route to trigger a 500 error for testing
router.get("/trigger-error", invController.triggerError)

//Route to build inventory management view
router.get("/", invController.buildManagementView);

//Route to build add classification view
router.get("/add-classification", invController.buildAddClassificationView);

//Process the add classification form
router.post("/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

//Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventoryView);

//Process the add inventory form
router.post("/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;