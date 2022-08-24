import User from "../models/User";
import bcrypt from "bcrypt";
const ERROR = 400;
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { email, username, name, password, cpw } = req.body;
  const user = await User.findOne({ username });
  const pageTitle = "Join";
  if (user) {
    return res.render("join", {
      pageTitle,
      errorMessage: "Username is already exists.",
    });
  }
  if (password !== cpw) {
    return res.render("join", {
      pageTitle,
      errorMessage: "Password is fail to pass the confirm.",
    });
  }
  await User.create({
    email,
    username,
    name,
    password,
  });
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(ERROR).render("login", {
      pageTitle: "Login",
      errorMessage: `That username is not exist.`,
    });
  }
  const hashCheck = await bcrypt.compare(password, user.password);
  if (!hashCheck) {
    return res.status(ERROR).render("login", {
      pageTitle: "Login",
      errorMessage: `Password is wrong.`,
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect(`/`);
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
