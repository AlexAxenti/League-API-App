const express = require('express');
const router = express.Router();
const axios = require('axios').default;
var User = require('../models/users');

/* GET home page. */
router.get('/', (req, res) => {
    res.send("Hello word!");
})

router.get('/user/:username', (req, res) => {
    let username = req.params.username;

    // let user = new User({
    //     summonerName: username,
    //     summonerID: 'test',
    //     summonerLevel: 20,
    //     rank: 'd4',
    //     leaguePoints: 54,
    //     wins: 12,
    //     losses: 4,
    // });
    // console.log(user);
    // user.save(function (err) {
    //     if (err) console.log(err);
    // });

    var query = User.findOne({summonerName: username}).select('-_id');
    query.exec(function (err, users) {
        if (!err) {
            console.log(users);
            if (!users) {
                // Query from riot
                res.send({});
            } else {
                res.send(users);
            }
        } else {
            console.log(err)
        }
    });
})

module.exports = router;
