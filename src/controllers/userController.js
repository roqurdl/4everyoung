import User from "../models/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { email, username, name, pw, cpw } = req.body;
  const user = await User.findOne({ username });
  const pageTitle = "Join";
  if (user) {
    return res.render("join", {
      pageTitle,
      errorMessage: "Username is already exists.",
    });
  }
  if (pw !== cpw) {
    return res.render("join", {
      pageTitle,
      errorMessage: "Password is fail to pass the confirm.",
    });
  }
  await User.create({
    email,
    username,
    name,
    password: pw,
  });
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
