const users = require("./users");

const auth = async (req, res, next) => {
  try {
    const userId = req.query.id;
    const find = await users.findById(userId);
    if (!find) {
      return res.json({ msg: "not_found" });
    }
    next();
  } catch (error) {
    res.status(500).json({ msg: "Internal_Server_Error" });
  }
};

module.exports = auth;
