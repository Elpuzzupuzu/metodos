const express = require("express");
const router = express.Router();

const gaussCtrl = require("../controllers/gaussController");
const lagrangeCtrl = require("../controllers/lagrangeController");
const trapecioCtrl = require("../controllers/trapecioController");

router.post("/gauss", gaussCtrl.gauss);
router.post("/lagrange", lagrangeCtrl.lagrange);
router.post("/trapecio", trapecioCtrl.trapecio);

module.exports = router;