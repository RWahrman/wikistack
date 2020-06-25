const router = require("express").Router();
const { Page, User } = require("../models");
const { addPage, wikiPage, main, editPage } = require("../views");

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
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

router.get("/add", (req, res, next) => {
  res.send(addPage());
});

// router.get("/query", (req, res, next) => {
//   res.send(req.query.array.split(","));
// });

router.get("/:slug", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    });

    if (!page) {
      res.status(404).send(`<h4 style="color: blue">Not Found!!!</h4>`);
    }
    const author = await page.getAuthor();
    res.send(wikiPage(page, author));
  } catch (error) {
    next(error);
  }
});

router.get("/:slug/edit", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    });

    if (!page) {
      res.status(404).send(`<h4 style="color: blue">Not Found!!!</h4>`);
    }
    const author = await page.getAuthor();
    res.send(editPage(page, author));
  } catch (error) {
    next(error);
  }
});

router.post("/:slug", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    });

    if (!page) {
      res.status(404).send(`<h4 style="color: blue">Not Found!!!</h4>`);
    }
    let updatedPage = await page.update(req.body);
    updatedPage = await page.save();
    console.log("PAGE.SLUG", page.slug);
    console.log("UPDATEDPAGE.SLUG", updatedPage.slug);
    res.redirect(`/wiki/${updatedPage.slug}`);
  } catch (error) {
    next(error);
  }
});

router.get("/:slug/delete", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    });
    await page.destroy();
    res.redirect(`/wiki`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
