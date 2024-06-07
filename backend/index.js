const express = require('express')
const app = express()
const catsData = []

app.use(express.json())
app.get("/cats", (_req, res) => {
    console.log('You are in cats page');
    res.json(catsData)
})
app.post("/cats", (req, res) => {
    if (typeof (req.body.name) == "string" && req.body.name.length>0){
        catsData.push({name: req.body.name})
        res.json(catsData)
    } else{
        res.status(400).json({error: "Cat informations are not valid !"})
    }
})
app.listen(3000, () => { console.log('Server is ready') })