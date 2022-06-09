const express = require('express')
const path = require('path');
const app = express()
const port = 7000

var indexRouter = require('./routes/index');
var cors = require("cors");

app.use(express.static(path.resolve(__dirname, '../client/build')));

//app.use(cors());
app.use('/api', indexRouter);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})