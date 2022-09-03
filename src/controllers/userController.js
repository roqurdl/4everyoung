import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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

//Using Social Account
//-----Github
export const startGithub = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_ID,
    allow_signup: "false",
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithub = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_ID,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenBox = await (
    await fetch(finalUrl, {
      method: "post",
      headers: { Accept: "application/json" },
    })
  ).json();
  //user information
  if ("access_token" in tokenBox) {
    const { access_token } = tokenBox;
    const userData = await (
      await fetch(`https://api.github.com/user`, {
        headers: { Authorization: `token ${access_token}` },
      })
    ).json();
    //email
    const emailBox = await (
      await fetch(`https://api.github.com/user/emails`, {
        headers: { Authorization: `token ${access_token}` },
      })
    ).json();
    const emailData = emailBox.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailData) {
      return res.redirect("/login");
    }
    let existUser = await User.findOne({ email: emailData.email });
    if (existUser) {
      req.session.loggedIn = true;
      req.session.user = existUser;
      return res.redirect(`/`);
    }
    if (!existUser) {
      const user = await User.create({
        email: emailData.email,
        name: userData.name,
        username: userData.login,
        password: "",
        useSocial: true,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect(`/`);
    } else {
      return res.redirect("/login");
    }
  }
};
//-----kakao
const REDIRECT_URL_KA = `http://localhost:7000/users/kakao/finish`;

export const startKakao = (req, res) => {
  const baseUrl = `https://kauth.kakao.com/oauth/authorize`;
  const config = {
    client_id: process.env.KAKAO_ID,
    redirect_uri: REDIRECT_URL_KA,
    response_type: `code`,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishKakao = async (req, res) => {
  const baseUrl = `https://kauth.kakao.com/oauth/token`;
  const config = {
    client_id: process.env.KAKAO_ID,
    client_secret: process.env.KAKAO_SECRET,
    grant_type: `authorization_code`,
    redirect_uri: REDIRECT_URL_KA,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenBox = await (
    await fetch(finalUrl, {
      method: "POST",
    })
  ).json();
  const apiUrl = `https://kapi.kakao.com`;
  const { access_token } = tokenBox;
  const userToken = await (
    await fetch(`${apiUrl}/v1/user/access_token_info`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();
  if (userToken.msg === "no authentication key!") {
    console.log(userToken.msg);
    return res.redirect("/login");
  }
  const userData = await (
    await fetch(`${apiUrl}/v2/user/me`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();
  const kakaoAccount = userData.kakao_account;
  const userProfile = kakaoAccount.profile; // nickname=>name, profile_image_url
  const userEmail = kakaoAccount.email; // =>email
  console.log(typeof userToken.id.toString(), userProfile.nickname, userEmail);

  let existUser = await User.findOne({ email: userEmail });
  if (existUser) {
    req.session.loggedIn = true;
    req.session.user = existUser;
    return res.redirect(`/`);
  }
  if (!existUser) {
    const user = await User.create({
      email: userEmail,
      name: userProfile.nickname,
      username: userToken.id.toString(),
      password: "",
      useSocial: true,
    });
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect(`/`);
  } else {
    return res.redirect("/login");
  }
};

//-----Naver
const REDIRECT_URL_NA = `http://localhost:7000/users/naver/finish`;

export const startNaver = (req, res) => {
  const baseUrl = `https://nid.naver.com/oauth2.0/authorize`;
  const config = {
    response_type: `code`,
    client_id: process.env.NAVER_ID,
    redirect_uri: REDIRECT_URL_NA,
    state: `sdfgsdfd19sdg`,
  };
  // Naver는 위 순서를 제대로 지켜야 찾아간다.
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishNaver = async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  const baseUrl = `https://nid.naver.com/oauth2.0/token`;
  const config = {
    grant_type: `authorization_code`,
    client_id: process.env.NAVER_ID,
    client_secret: process.env.NAVER_SECRET,
    redirect_uri: REDIRECT_URL_NA,
    code,
    state,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const userToken = await (
    await fetch(`${finalUrl}`, {
      method: `POST`,
      headers: {
        client_id: process.env.NAVER_ID,
        client_secret: process.env.NAVER_SECRET,
      },
    })
  ).json();
  const { access_token } = userToken;
  const userBox = await (
    await fetch(`https://openapi.naver.com/v1/nid/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
  ).json();
  const userData = userBox.response;
  const exits = await User.findOne({ email: userData.email });
  if (!exits) {
    const newUser = await User.create({
      email: userData.email,
      useSocial: true,
      username: userData.id,
      name: userData.name,
      password: "",
    });
    req.session.loggedIn = true;
    req.session.user = newUser;
    return res.redirect(`/`);
  } else {
    return res.redirect("/login");
  }
};
//-----Google

export const startGoogle = (req, res) => {
  const baseUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  const config = {
    client_id: process.env.GOOGLE_ID,
    redirect_uri: `http://localhost:7000/users/google/finish`,
    response_type: `code`,
    scope: `https://www.googleapis.com/auth/cloud-platform`,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGoogle = async (req, res) => {
  const baseUrl = `https://oauth2.googleapis.com/token`;
  const config = {
    client_id: process.env.GOOGLE_ID,
    client_secret: process.env.GOOGLE_SECRET,
    grant_type: `authorization_code`,
    code: req.query.code,
    redirect_uri: `http://localhost:7000/users/google/finish`,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenBox = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: { Accept: "application/json" },
    })
  ).json();
  if (`access_token` in tokenBox) {
    const { access_token } = tokenBox;
    const userData = await (
      await fetch(
        `https://www.googleapis.com/drive/v2/files?access_token=${access_token}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
    ).json();
    console.log(userData);
  }
};

const getLoginUser = async (req) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(_id);
  return user;
};

export const profile = async (req, res) => {
  const user = await getLoginUser(req);
  return res.render("user/profile", { pageTitle: `${user.name}'s Profile` });
};

export const getEdit = async (req, res) => {
  const user = await getLoginUser(req);
  return res.render("user/edit", { pageTitle: `Edit Profile`, user });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { email, username, name },
  } = req;
  const updateUser = await User.findByIdAndUpdate(_id, {
    email,
    username,
    name,
  });
  req.session.user = updateUser;
  return res.redirect("/users/profile");
};

export const getPassword = async (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
  }
  return res.render("user/edit-password", { pageTitle: `Edit Password` });
};
export const postPassword = async (req, res) => {
  const {
    body: { password: oldPw, newPw, newcpw },
  } = req;
  const user = await getLoginUser(req);
  const hashCheck = await bcrypt.compare(oldPw, user.password);
  if (!hashCheck) {
    return res.status(ERROR).render("user/edit-password", {
      pageTitle: "Edit Password",
      errorMessage: `Password is wrong.`,
    });
  }
  if (newPw !== newcpw) {
    return res.status(ERROR).render("user/edit-password", {
      pageTitle: "Edit Password",
      errorMessage: `Password is fail to pass the confirm.`,
    });
  }
  if (oldPw === newPw) {
    return res.status(ERROR).render("user/edit-password", {
      pageTitle: "Edit Password",
      errorMessage: "The old password equals new password",
    });
  }
  user.password = newPw;
  await user.save();
  req.session.destroy();
  return res.redirect(`/login`);
};

export const delUser = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(_id);
  if (user) {
    await User.findByIdAndDelete(_id);
  } else {
    return res.status(ERROR).render("user/edit-password", {
      pageTitle: "Edit Password",
      errorMessage: "There is an error.",
    });
  }
  req.session.destroy();
  return res.redirect(`/`);
};
