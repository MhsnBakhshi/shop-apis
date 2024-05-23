const express = require("express");
const cors = require("cors");
const session = require("express-session");
const CookieParser = require("cookie-parser");
const { setHeaders } = require("./middlewares/setHeaders");
const { errResponses } = require("./utils/responses");
const authRouther = require("./modules/auth/auth.routes");
const userRouther = require("./modules/user/user.routes");
const productRouther = require("./modules/product/product.routes");
const menuRouther = require("./modules/menu/menu.routes");
const notificationRouther = require("./modules/notification/notification.routes");
const commentRouther = require("./modules/comment/comment.routes");
const contactRouther = require("./modules/contact/contact.routes");
const categoryRouther = require("./modules/category/category.routes");
const newsletterRouther = require("./modules/newsletter/newsletter.routes");
const discountRouther = require("./modules/discount/discount.routes");
const ticketRouther = require("./modules/ticket/ticket.routes");
const departmentRouther = require("./modules/department/department.routes");
const searchRouther = require("./modules/search/search.routes");
const apiRouther = require("./modules/apis/swagger.routes");

const app = express();

//* BodyParser and CookieParser
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(CookieParser());

//* Cors Policy
app.use(setHeaders);
app.use(cors());

//* For express-flash If You Want Show Msg
app.use(
  session({
    secret: "ksjsowun,xjpaowie7ur7fgcjnskla;q-p",
    saveUninitialized: false,
    resave: false,
  })
);

//* Routes
app.use("/api-document", apiRouther);
app.use("/auth", authRouther);
app.use("/user", userRouther);
app.use("/newsletter", newsletterRouther);
app.use("/ticket", ticketRouther);
app.use("/notification", notificationRouther);
app.use("/menu", menuRouther);
app.use("/product", productRouther);
app.use("/category", categoryRouther);
app.use("/comment", commentRouther);
app.use("/contact", contactRouther);
app.use("/discount", discountRouther);
app.use("/department", departmentRouther);
app.use("/search", searchRouther);

//* / Handler

app.get("/", async (req, res) => {
  return res.json({
    message: "For Use This Api Should Send Request To /api-document",
  });
});

//* 404 Err Handler
app.use((req, res) => {
  return res.status(404).json({
    message: `404! This ${req.path} Path Not Found!! Please Check The Path/Method...`,
  });
});

//* Internal Server Err
app.use((err, res, next) => {
  if (err) {
    return errResponses(
      res,
      err.statusCode,
      `Internal Server Eror: name => ${err.name} message => ${err.message}`
    );
  }
  next();
});
module.exports = app;
