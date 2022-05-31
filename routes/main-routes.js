const express = require("express");

const mainController = require("../controllers/main-controller");

const router = express.Router();

router.get("/:nid", mainController.getNewsById); //nid: news id

module.exports = router;
