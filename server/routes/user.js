const express = require('express');
const router = express.Router();
const axios = require('axios').default;

var User = require('../models/users');

/* GET home page. */
router.get('/', (req, res) => {
    res.send("Hello word!");
})

function getDifferenceInSeconds(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / 1000;
}

router.get('/update/:summonerID', (req, res) => {
    let summonerID = req.params.summonerID;
    let timestamp = new Date();

    var query = User.findOne({ summonerID: summonerID });
    query.exec(function (err, users) {
        if (!err) {
            if (!users) {
                res.send({error: "No user found"})
            } else {
                let timeSinceUpdate = getDifferenceInSeconds(timestamp, users.updatedAt)
                if (timeSinceUpdate < 20) {
                    res.status(400);
                    res.send({error: "Updated too recently", timeSinceUpdate: timeSinceUpdate})
                } else {
                    axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=` + process.env.RIOT_API_KEY)
                        .then(function (response) {
                            // console.log(response.data);

                            for (let i = 0; i < response.data.length; i++) {
                                if (response.data[i].queueType == "RANKED_SOLO_5x5") {
                                    users.tier = response.data[i].tier;
                                    users.rank = response.data[i].rank;
                                    users.leaguePoints = response.data[i].leaguePoints;
                                    users.wins = response.data[i].wins;
                                    users.losses = response.data[i].losses;
                                    users.updatedAt = timestamp;
                                    // console.log(users);
                                    console.log("updating")
                                    users.save(function (err) {
                                        if (err) console.log(err);
                                    });
                                    res.send(users);
                                    break;
                                }
                            }
                        })
                        .catch(function (error) {
                            console.log("second error: " + error);
                        });
                }
            }
        }
    })
});

router.get('/:username', (req, res) => {
    let username = req.params.username;

    var query = User.findOne({ summonerName: username }).select('-_id');
    query.exec(function (err, users) {
        if (!err) {
            console.log(users);
            if (!users) {
                // Query from riot
                let summonerID = null;
                let puuid = null;
                let level = 0;

                axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=` + process.env.RIOT_API_KEY)
                    .then(function (response) {
                        console.log(response.data);
                        summonerID = response.data.id;
                        puuid = response.data.puuid;
                        level = response.data.summonerLevel;

                        axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=` + process.env.RIOT_API_KEY)
                            .then(function (response) {
                                console.log(response.data);

                                for (let i = 0; i < response.data.length; i++) {
                                    if (response.data[i].queueType == "RANKED_SOLO_5x5") {
                                        let user = new User({
                                            summonerName: username,
                                            summonerID: summonerID,
                                            puuid: puuid,
                                            summonerLevel: level,
                                            tier: response.data[i].tier,
                                            rank: response.data[i].rank,
                                            leaguePoints: response.data[i].leaguePoints,
                                            wins: response.data[i].wins,
                                            losses: response.data[i].losses,
                                        });
                                        console.log(user);
                                        user.save(function (err) {
                                            if (err) console.log(err);
                                        });
                                        res.send(user);
                                        break;
                                    }
                                }
                            })
                            .catch(function (error) {
                                console.log("second error: " + error);
                            });

                    })
                    .catch(function (error) {
                        console.log("first error: " + error);
                    });
            } else {
                res.send(users);
            }
        } else {
            console.log(err)
        }
    });
})

module.exports = router;
