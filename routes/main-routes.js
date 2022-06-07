const express = require("express");
const { check } = require("express-validator");

const mainController = require("../controllers/main-controller");

const router = express.Router();

router.get("/:nid", mainController.getNewsById); //nid: news id

router.post(
  "/",
  check("date").not().isEmpty(),
  check("time").not().isEmpty(),
  check("newsText").not().isEmpty(),
  mainController.createNews
);

module.exports = router;
