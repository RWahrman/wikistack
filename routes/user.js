const router = require("express").Router();
const { User, Page } = require("../models");
const { userList, userPages } = require("../views");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(userList(users));
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, { include: [Page] });

    console.log(user.pages);

    res.send(userPages(user, user.pages));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
