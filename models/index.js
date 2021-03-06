const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const db = new Sequelize("postgres://localhost:5432/wikistack", {
  logging: false,
});

function generateSlug(title) {
  // Removes all non-alphanumeric characters from title
  // And make whitespace underscore
  return title.replace(/\s+/g, "_").replace(/\W/g, "");
}

const Page = db.define("page", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM("open", "closed"),
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING),
  },
});

Page.beforeValidate((pageInstance) => {
  pageInstance.slug = generateSlug(pageInstance.title);
});

Page.beforeCreate((pageInstance) => {
  pageInstance.tags = pageInstance.tags.split(" ");
});

Page.findByTag = function (tag) {
  return Page.findAll({
    // Op.overlap matches a set of possibilities
    where: {
      tags: {
        [Op.overlap]: [tag],
      },
    },
  });
};

Page.prototype.findSimilar = function (tags) {
  return Page.findAll({ where: { tags: { [Op.overlap]: [...tags] } } });
};

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

Page.belongsTo(User, { as: "author" });
User.hasMany(Page, { foreignKey: "authorId" });

module.exports = {
  db,
  Page,
  User,
};
