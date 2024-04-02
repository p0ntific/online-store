const ApiError = require("../error/ApiError");
const { User, Basket } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, role) => {
  const token = jwt.sign({ id, email, role }, process.env.SEKRET_KEY, {
    expiresIn: "24h",
  });
  return token;
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password)
      return next(ApiError.badRequest("no provided email or password"));
    const candidate = await User.findOne({ where: { email } });
    if (candidate) return next(ApiError.badRequest("user already exists"));
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    // создаём корзину новому пользователю
    await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role);
    const basket = await Basket.create({ userId: user.id });

    return res.json({ token });
  }
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(ApiError.internal("user not found"));
    let checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) return next(ApiError.internal("incorrect password"));
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }
  async check(req, res, next) {
    return res.json({ message: "successful" });
  }
}

module.exports = new UserController();
