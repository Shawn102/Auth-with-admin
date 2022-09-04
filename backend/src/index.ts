import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportLocal from "passport-local";
import session from "express-session";
import bcrypt from "bcryptjs";
import User from "./User";
import dotenv from "dotenv";
import {
  DatabaseUserInterface,
  UserInterface,
} from "./Interfaces/UserInterface";
dotenv.config();

const LocalStrategy = passportLocal.Strategy;
//Creating the express app
const app = express();
//Connecting mongodb to my app
mongoose.connect("mongodb://localhost:27017/typebcryptauthDB", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully connected to mongodb server!");
  }
});

// using required packages to my express app
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: "shawnsecret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
// Passport
passport.use(
  new LocalStrategy((username: string, password: string, done) => {
    User.findOne({ username: username }, (err: Error, user: any) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result: boolean) => {
        if (err) throw err;
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  })
);

passport.serializeUser((user: DatabaseUserInterface, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: Error, user: DatabaseUserInterface) => {
    const userInformation = {
      username: user.username,
      isAdmin: user.isAdmin,
      id: user._id,
    };
    cb(err, userInformation);
  });
});

app.get("/", (req, res) => {
  User.find({}, (err: any, foundUser: any) => {
    if (err) {
      res.send(err);
    } else {
      if (foundUser) {
        res.send(foundUser);
      }
    }
  });
});

// Routes for register
app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req?.body;
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    res.send("Improper values");
    return;
  }
  User.findOne({ username }, async (err: Error, doc: DatabaseUserInterface) => {
    if (err) {
      throw err;
    } else {
      if (doc) {
        res.send("User already exist");
      }
      if (!doc) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
          username,
          password: hashedPassword,
        });
        await newUser.save();
        res.send("success");
      }
    }
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const logUser = new User({ username, password });
  req.login(logUser, (err) => {
    if (!err) {
      passport.authenticate("local")(req, res, () => {
        res.send("Successfully authenticated");
      });
    } else {
      res.send(err);
    }
  });
});
app.get("/logout", async function (req: any, res: any, next: any) {
  try {
    req.logOut(req.user, function (err: Error) {
      if (err) {
        console.log("error", err);
        return next(err);
      } else {
        res.send("Successfully logout");
      }
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/user", (req, res) => {
  res.send(req.user);
});

// admin route
// Securing admin routes
const isAdministratorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user }: any = req;
  if (user) {
    User.findOne({ username: user.username }, (err: Error, doc: any) => {
      if (err) {
        console.log(err);
      } else {
        if (doc?.isAdmin) {
          next();
        } else {
          res.send("Sorry, only admin can perform on this action.");
        }
      }
    });
  } else {
    res.send("Sorry, you arn't logged in! Please log in and try again.");
  }
};

app.get("/getAllUsers", isAdministratorMiddleware, async (req, res) => {
  User.find({}, (err: Error, AllUser: any) => {
    if (err) {
      res.send(err);
    } else {
      if (AllUser) {
        const filterUsers: any = [];
        AllUser.map((user: any) => {
          const userInformation = {
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
          };
          filterUsers.push(userInformation);
        });
        res.send(filterUsers);
      }
    }
  });
});

app.post("/deleteUser", isAdministratorMiddleware, (req, res) => {
  const { id } = req.body;
  User.findByIdAndDelete(id, (err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send("successfully deleted the user");
    }
  });
});

//creating a port to listen my app
const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`Your app started on port ${port}`);
});
