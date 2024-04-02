const { Brand, Device } = require("../models/models");

class BrandController {
  async create(req, res) {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    return res.json(brand);
  }
  async getAll(req, res) {
    const brand = await Brand.findAll();
    return res.json(brand);
  }
  async deleteBrand(req, res) {
    const { id } = req.params;
    await Brand.destroy({
      where: { id },
    });
    return res.json({ message: "deleted successfully" });
  }
}

module.exports = new BrandController();
