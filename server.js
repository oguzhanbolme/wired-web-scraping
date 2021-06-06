const express = require("express")
const cors = require("cors")
const categoryRouter = require("./routes/category")

const port = 1999 || process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/category", categoryRouter)

app.listen(port, function () {
    console.log(`App running on port: ${port}`)
})