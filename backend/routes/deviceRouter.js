const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkRoleMiddleware = require("../middlewares/checkRoleMiddleware");

router.post("/", checkRoleMiddleware("ADMIN"), deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);
router.delete("/:id", deviceController.delete);
router.post("/rate", authMiddleware, deviceController.setRating);

module.exports = router;
