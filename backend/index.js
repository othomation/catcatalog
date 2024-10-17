const express = require("express");
const app = express();
const orm = require("sequelize");
const database = new orm.Sequelize({
  dialect: "sqlite",
  storage: "./data/catsDatabase.sqlite",
});

const Cat = database.define("Cat", {
  name: {
    type: orm.DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: orm.DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: orm.DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: orm.DataTypes.STRING,
  },
  available: {
    type: orm.DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

async function createCatsHandler(req, res) {
  if (
    typeof req.body.name === "string" &&
    req.body.name.length > 0 &&
    typeof req.body.imageUrl === "string" &&
    req.body.imageUrl.length > 0 &&
    typeof req.body.age === "number" &&
    req.body.age > 0 &&
    typeof req.body.description !== "undefined"
  ) {
    const newCat = await Cat.create(req.body);
    res.json(newCat.toJSON());
  } else {
    res.status(400).json({ error: "Cat informations are not valid !" });
  }
}

async function getCatsHandler(req, res) {
  console.log("You are in cats page");
  const cats = await Cat.findAndCountAll({ where: { available: true } });
  res.json(cats);
}

async function getOneCatHandler(req, res) {
  const cat = await Cat.findOne({
    where: { id: req.params.catId, available: true },
  });
  if (cat) {
    res.status(200).json(cat);
  } else {
    res.status(404).json({ error: "Cat was not found :D" });
  }
}

async function deleteCatsHandler(req, res) {
  if (req.params.catId !== undefined) {
    const catToDelete = await Cat.findOne({ where: { id: req.params.catId } });
    if (catToDelete) {
      if (req.query.archive) {
        await catToDelete.update({ available: false });
      } else {
        await catToDelete.destroy();
      }
      res.json(catToDelete.toJSON());
    } else {
      res.status(404).json({ error: "Cat with given id was not found !" });
    }
  } else {
    res.status(400).json({ error: "Cat id is not valid !" });
  }
}

async function updateCatsHandler(req, res) {
  if (req.query.id) {
    await Cat.update(req.body, { where: { id: req.query.id } });
    res.status(204);
  }
}

app.use(express.json());
app.get("/cats", getCatsHandler);
app.get("/cats/:catId", getOneCatHandler);
app.post("/cats", createCatsHandler);
app.patch("/cats", updateCatsHandler);
app.delete("/cats/:catId", deleteCatsHandler);
app.listen(3000, async () => {
  await Cat.sync({ alter: true });
  console.log("Server is ready");
});
