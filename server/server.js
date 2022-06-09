const express = require('express')
const app = express()
const port = 7000
var indexRouter = require('./routes/index');

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})