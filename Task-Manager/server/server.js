
//const dns = require("dns");
//dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const authRoutes = require("./routes/authRoute")
const projectRoutes = require("./routes/projectRoutes")
const taskRoutes = require("./routes/taskRoutes")

const app = express()



app.use(cors({

    origin: ["http://localhost:5173",
        "http://localhost:5174",

        "https://task-manager-production-d2e2.up.railway.app"]
}
))

app.use(express.json())
app.use("/api/tasks", taskRoutes)



mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected")
    })
    .catch((err) => {
        console.log(err)
    })



app.get("/", (req, res) => {

    res.send("API Running")

})



app.use("/api/auth", authRoutes)

app.use("/api/projects", projectRoutes)



const PORT = process.env.PORT || 5000



app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`)

})