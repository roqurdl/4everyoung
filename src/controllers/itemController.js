import Item from "../models/Item";

export const home = (req, res) => {
  Item.find({}, (error, items) => {
    console.log(items);
  });

  return res.render("home");
};
export const search = (req, res) => {
  return res.render("home");
};

export const getUpload = (req, res) => {
  return res.render("upload");
};
export const postUpload = async (req, res) => {
  const { itemUrl, title, infoUrl, description, cost } = req.body;
  console.log(itemUrl, title, infoUrl, description, cost);
};
