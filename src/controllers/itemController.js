import Item from "../models/Item";

export const home = async (req, res) => {
  const items = await Item.find({});
  return res.render("home", { pageTitle: "Home", items });
};

export const detail = async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  return res.render("item/detail.pug", { pageTitle: `${item.title}`, item });
};
export const search = async (req, res) => {
  const { word } = req.query;
  let items = [];
  if (word) {
    items = await Item.find({
      title: {
        $regex: new RegExp(`${word}$`, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", items });
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Items" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description, cost },
  } = req;
  await Item.create({ title, description, cost });
  return res.redirect("/");
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  return res.render("item/edit.pug", { pageTitle: `Edit ${item.title}`, item });
};
export const postEdit = async (req, res) => {
  const {
    body: { title, description, cost },
    params: { id },
  } = req;
  await Item.findByIdAndUpdate(id, {
    title,
    description,
    cost,
  });
  return res.redirect(`/items/${id}`);
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (item) {
    await Item.findByIdAndDelete(id);
  } else {
    return res.render("item/edit.pug", {
      pageTitle: `Edit ${item.title}`,
      item,
      errorMessage: "There is an Error.",
    });
  }
  return res.redirect(`/`);
};
