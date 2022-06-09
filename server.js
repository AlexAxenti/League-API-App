const express = require('express')
const app = express()
const port = 7000

app.get('/', (req, res) => {
    res.send({user: 'Zethyos', rank: 'Challenger 2500LP'});
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})