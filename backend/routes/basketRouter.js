const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basketController");

router.post("/", basketController.addDevice);
router.get("/", basketController.getAll);
router.delete("/:id", basketController.delete);

module.exports = router;
