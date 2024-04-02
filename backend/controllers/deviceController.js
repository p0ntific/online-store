const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo, Rating, User } = require("../models/models");
const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      if (!img) return;
      img.mv(path.resolve(__dirname, "..", "static", fileName), function (err) {
        if (err) {
          res.send(err);
        } else {
          console.log("file uploaded successfully");
        }
      });
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((el) =>
          DeviceInfo.create({
            title: el.title,
            description: el.description,
            deviceId: device.id,
          }),
        );
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e, e.message));
    }
  }
  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    const offset = (page - 1) * limit;
    let devices;
    if (!brandId && !typeId)
      devices = await Device.findAndCountAll({ limit, offset });
    if (brandId && !typeId)
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    if (!brandId && typeId)
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    if (brandId && typeId)
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      });
    return res.json(devices);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });
    return res.json(device);
  }
  async delete(req, res) {
    const { id } = req.params;
    await Device.destroy({
      where: { id },
    });
    return res.json({ message: "deleted successfully" });
  }
  async setRating(req, res, next) {
    const { id, rate } = req.body;
    if (rate < 0 || rate > 5)
      return next(ApiError.badRequest("bad value for rating"));

    const token = req.headers.authorization.split(" ")[1];
    const userInfo = jwt.decode(token);

    const device = await Device.findOne({ where: { id } });
    const rates = await Rating.findAll({ where: { userId: userInfo.id } });
    const summary = rates.reduce((sum, el) => sum + el.dataValues.rate, 0);

    device.rating = (+rate + +summary) / (+rates.length + 1);
    device.save();

    const rating = await Rating.create({ userId: user.id, deviceId: id, rate });

    return res.json(rating);
  }
}

module.exports = new DeviceController();
