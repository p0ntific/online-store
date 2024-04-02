const ApiError = require("../error/ApiError");
const { Basket, BasketDevice, User, Device } = require("../models/models");
const jwt = require("jsonwebtoken");
class BasketController {
  async addDevice(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    const { deviceId } = req.body;
    const device = Device.findOne({ where: { id: deviceId } });
    if (!device) {
      return next(ApiError.badRequest("no device with this id"));
    }
    const userInfo = jwt.decode(token);
    const basket = await Basket.findOne({ where: { userId: userInfo.id } });
    const basketId = basket.id;
    const basketDevice = await BasketDevice.create({ deviceId, basketId });
    return res.json(basketDevice);
  }
  async getAll(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    const userInfo = jwt.decode(token);
    const basket = await Basket.findOne({ where: { userId: userInfo.id } });
    const basketDevices = await BasketDevice.findAndCountAll({
      where: { basketId: basket.id },
    });
    return res.json(basketDevices);
  }
  async delete(req, res, next) {
    const { id } = req.params;
    const device = await BasketDevice.findOne({ where: { id } });
    if (!device)
      return next(ApiError.badRequest("no device in basket with this id"));
    await BasketDevice.destroy({
      where: { id },
    });
    return res.json({ message: "deleted successfully" });
  }
}

module.exports = new BasketController();
