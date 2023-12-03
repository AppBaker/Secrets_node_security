import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";



const app = express();
const port = 3000;
console.log(typeof(process.env.S3_BUCKET));
// s3.getBucketCors({Bucket: process.env.S3_BUCKET}, function(err, data) {
//     console.log("HELLO");
// });

// new pg.Query("CREATE DATABASE papa OWNER = postgres ENCODING = 'UTF8' CONNECTION LIMIT = -1 IS_TEMPLATE = False");

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "secretsDB",
    port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// GET router
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// POST router
app.post("/register", async (req, res) => {
    console.log(req.body);
    const email = req.body.username;
    const password = req.body.password;
    try {
        const user = await db.query("INSERT INTO usersdb(email, password) VALUES($1, $2) RETURNING (email, password)", [email, password]);
        res.render("secrets.ejs");
    } catch(err) {
        console.log(err)
        res.render("register.ejs", {error: err});
    }
});

app.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        const result = await db.query("SELECT * FROM usersdb WHERE email = $1 AND password = $2", [email, password]);
        console.log(result.rows);
        if (result.rows[0]) {
            res.render("secrets.ejs");
        } else {
            res.render("login.ejs", {error: "Неверное имя пользователя или пароль"});
        }
    } catch(err) {
        console.log(err);
        res.render("login.ejs", {error: err});
    }
});

app.listen(port, () => {
    console.log(`Server runing on port ${port}`);
});