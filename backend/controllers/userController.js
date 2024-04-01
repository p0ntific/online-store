const ApiError = require("../error/ApiError");
class UserController {
  async registration(req, res) {
    res.status(201).json("Создан пользователь");
  }
  async login(req, res) {}
  async check(req, res, next) {
    const { id } = req.query;
    if (!id) {
      return next(ApiError.badRequest("No provided id"));
    }
    res.status(201).json({ message: "user created successful" });
  }
}

module.exports = new UserController();
