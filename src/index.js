import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import './config/passport.js'
import passport from 'passport'
import session from 'express-session'
import mongoose from 'mongoose'
import { User } from './models/user.model.js'
import MongoStore from 'connect-mongo'

import authRouter from './routes/auth.routes.js'
import emailRouter from './routes/email.routes.js'
import userRouter from './routes/user.routes.js'

dotenv.config({
    path: './.env'
})

const app = express()
const PORT = process.env.PORT;

( async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
       app.on("error", (error) => {
            console.log("ERROR: ", error)
            throw error
       })
       
       app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${PORT}`)
       })

    } catch (error) {
        console.error("ERROR",error)
        throw error
    }
})()

const allowedOrigins = [
    "http://localhost:3000",  
    "http://localhost:5173",   
    "http://localhost:5174",
    "https://gen-ai-cold-email-frontend.vercel.app/*"   
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));


app.use(express.json())


app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: true,
        sameSite: "none"
    }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
    console.log("Serializing user:", user);  // Debugging
    done(null, user._id.toString());
});

passport.deserializeUser((id, done) => {
    console.log("Deserializing user with id:", id);  // Debugging
    User.findById(id).then(user => {
        console.log("User found:", user);  // Debugging
        done(null, user);
    }).catch(err => {
        console.log("Error in deserialize:", err);
        done(err);
    });
});

app.use('/auth', authRouter)
app.use('/email', emailRouter)
app.use('/user', userRouter)

app.get("/set-cookie", (req, res) => {
    res.cookie("connect.sid", "s%3AJG4hQPirb8h7zIJCmLAKovLjNmv6Har-.xuEz9u1nF7URWU%2BTeRhXu6KU%2FUwBJzZ6KjzQtOwf93M", {
        httpOnly: true,
        secure: false,
        sameSite: "none"
    });
    res.send("Cookie Set!");
});