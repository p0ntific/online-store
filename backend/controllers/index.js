const Router = require("express");
const router = new Router();
const deviceRouter = require("./deviceController");
const userRouter = require("./userController");
const typeRouter = require("./typeController");
const brandRouter = require("./brandController");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", deviceRouter);

module.exports = router;
