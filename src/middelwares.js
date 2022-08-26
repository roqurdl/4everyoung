export const localMiddle = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  next();
};
