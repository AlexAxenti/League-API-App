const express = require('express');
const router = express.Router();

var User = require('../models/users');
const axiosFunctions = require('./axiosFunctions.js');

/* GET home page. */
router.get('/', (req, res) => {
    res.send("Hello world!");
})

router.get('/:username', (req, res) => {
    let username = req.params.username;

    var query = User.findOne({summonerName: username}).select('-_id');
    query.exec(function (err, users) {
        if (!err) {
            console.log(users);
            if (!users) {
                // Query from riot
                let summonerDataIDs = axiosFunctions.getSummonerDataIDs(username);
                //let summonerDataRankedSoloDuo = axiosFunctions.getSummonerDataRankedSoloDuo(res, summonerDataIDs.id);
            } else {
                res.send(users);
            }
        } else {
            console.log(err)
        }
    });
})

module.exports = router;
