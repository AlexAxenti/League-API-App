const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express()
const port = 7000

var userRouter = require('./routes/user');

mongoose.connect(process.env.MONGO_DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(path.resolve(__dirname, '../client/build')));

//app.use(cors());
app.use('/api/user', userRouter);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
});

app.listen(process.env.PORT || 7000, () => {
    console.log(`Example app listening on port ${port}`)
})