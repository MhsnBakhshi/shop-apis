module.exports = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    if (isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "This Route Only Admin Can Use ;)" });
    }
  } catch (err) {
    next(err);
  }
};
