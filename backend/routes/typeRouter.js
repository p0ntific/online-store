const Router = require("express");
const router = new Router();
const typeController = require("../controllers/typeController");
const checkRoleMiddleware = require("../middlewares/checkRoleMiddleware");
router.post("/", checkRoleMiddleware("ADMIN"), typeController.create);
router.get("/", checkRoleMiddleware("ADMIN"), typeController.getAll);

module.exports = router;
