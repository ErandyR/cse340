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
router.get("/",
    utilities.checkAdminOrEmployee,
    invController.buildManagementView);

//Route to build add classification view
router.get("/add-classification",
    utilities.checkAdminOrEmployee,
    invController.buildAddClassificationView);

//Process the add classification form
router.post("/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.checkAdminOrEmployee,
    utilities.handleErrors(invController.addClassification)
)

//Route to build add inventory view
router.get("/add-inventory",
    utilities.checkAdminOrEmployee,
    invController.buildAddInventoryView);

//Process the add inventory form
router.post("/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.checkAdminOrEmployee,
    utilities.handleErrors(invController.addInventory)
)

//Route to build edit inventory view
router.get("/getInventory/:classification_id", invController.getInventoryJSON)

// Route to build edit inventory view
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventoryView));

// Process the edit inventory form
router.post("/edit/",
    invValidate.inventoryRules(),
    invValidate.checkEditedData,
    utilities.checkAdminOrEmployee,
    utilities.handleErrors(invController.editInventory)
)

// Route to delete inventory item
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteInventoryView))

// Process the delete inventory form
router.post("/delete/",
    utilities.checkAdminOrEmployee,
    utilities.handleErrors(invController.deleteInventory))

module.exports = router;