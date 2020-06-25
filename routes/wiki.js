const router = require("express").Router();
const { Page, User } = require("../models");
const { addPage, wikiPage, main } = require("../views");

router.get("/", async (req, res, next) => {
  try {
    const allPages = await Page.findAll();

    res.send(main(allPages));
  } catch (error) {
    next(error);
  }
  // res.send("retrieve all wiki pages");
});

router.post("/", async (req, res, next) => {
  try {
    const page = await Page.create(req.body);
    const [user, wasCreated] = await User.findOrCreate({
      where: { name: req.body.author, email: req.body.email },
    });
    page.setAuthor(user);
    console.log(page, user);
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

router.get("/add", (req, res, next) => {
  res.send(addPage());
});

router.get("/query", (req, res, next) => {
  res.send(req.query.array.split(","));
});

router.get("/:slug", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    });
    const author = await User.findOne({
      where: {
        id: page.authorId,
      },
    });
    res.send(wikiPage(page, author));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
