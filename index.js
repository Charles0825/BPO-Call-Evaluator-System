const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const path = require("path");
const connectToDatabase = require("./db");
const sha256 = require("js-sha256");
const app = express();
const port = 5500;

app.use(express.static(path.join(__dirname, "public")));

const loggedInUsers = [];

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const requireAuth = (req, res, next) => {
  if (
    req.session &&
    req.session.username &&
    loggedInUsers.includes(req.session.username)
  ) {
    next();
  } else {
    res.redirect("/");
  }
};

app.get("/dashboard", requireAuth, (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(__dirname, "/private/dashboard.html"));
});

app.get("/", (req, res) => {
  res.redirect("index.html");
});

app.get("/forgot", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/forgot.html"));
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("accounts");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).send("Email not found");
    }

    const newPassword = Math.random().toString(36).slice(-8);
    console.log(newPassword);

    user.password = sha256(newPassword);
    await usersCollection.updateOne(
      { email },
      { $set: { password: user.password } }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "lim.charlesaldrin@ue.edu.ph",
        pass: "mmmy vbwp jmwf jiyb",
      },
    });

    const mailOptions = {
      from: {
        name: "BPO System Evaluator",
        address: "lim.charlesaldrin@ue.edu.ph",
      },
      to: email,
      subject: "New Password",
      text: `Your new password is: ${newPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Error sending email");
      }
      console.log("Email sent: " + info.response);
      res.send("New password sent to your email");
    });
  } catch (error) {
    console.error("Error handling forgot password:", error);
    res.status(500).send("Internal server error");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = sha256(password);
  console.log(hashedPassword);
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("accounts");

    const user = await usersCollection.findOne({
      username,
      password: hashedPassword,
    });

    if (user) {
      loggedInUsers.push(username);
      req.session.username = username;
      res.redirect("/dashboard");
    } else {
      res.send(
        '<script>alert("Invalid username or password"); window.location.href = "/";</script>'
      );
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/logout", (req, res) => {
  if (req.session && req.session.username) {
    const index = loggedInUsers.indexOf(req.session.username);
    if (index !== -1) {
      loggedInUsers.splice(index, 1);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
