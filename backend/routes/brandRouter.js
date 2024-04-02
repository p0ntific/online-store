const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brandController");
const checkRoleMiddleware = require("../middlewares/checkRoleMiddleware");

router.post("/", checkRoleMiddleware("ADMIN"), brandController.create);
router.get("/", checkRoleMiddleware("ADMIN"), brandController.getAll);

module.exports = router;
