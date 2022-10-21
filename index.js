const express = require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");

dotEnv.config();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })

app.use("/api/user", require("./routes/auth"));
app.use("/api/user", require("./routes/dashboard"));

app.listen(process.env.PORT, () => console.log("Server is up and running"));