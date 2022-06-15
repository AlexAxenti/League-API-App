const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();

var User = require('../models/users');
const axiosFunctions = require('./axiosFunctions.js');

/* GET home page. */
router.get('/', (req, res) => {
    res.send("Hello world!");
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
            if (!users) {
                // Query from riot
                const getSummonerDataIDs = axiosFunctions.getSummonerDataIDs(username);
                getSummonerDataIDs.then((responseIDs) => {
                    const summonerDataIDs = responseIDs;
                    const getSummonerDataRankedSoloDuo = axiosFunctions.getSummonerDataRankedSoloDuo(summonerDataIDs.summonerID);

                    getSummonerDataRankedSoloDuo.then((responseRankedSoloDuo) => {
                        const summonerDataRankedSoloDuo = responseRankedSoloDuo;

                        //merge both JSON responses for the current summoner into one summoner object
                        let summoner = new User;
                        let key;

                        for (key in summonerDataIDs) {
                            if(summonerDataIDs._doc.hasOwnProperty(key)){
                                summoner[key] = summonerDataIDs._doc[key];
                            }
                        }

                        for (key in summonerDataRankedSoloDuo) {
                            if(summonerDataRankedSoloDuo._doc.hasOwnProperty(key)){
                                summoner[key] = summonerDataRankedSoloDuo._doc[key];
                            }
                        }

                        summoner.save(function (err) {
                            if (err) console.log(err);
                        });

                        res.send(summoner);
                    });
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
