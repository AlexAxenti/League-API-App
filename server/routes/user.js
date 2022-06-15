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

router.get('/update/:summonerName', (req, res) => {
    let summonerName = req.params.summonerName;
    let timestamp = new Date();

    var query = User.findOne({ summonerName: new RegExp(`^${summonerName}$`, 'i') });
    query.exec(function (err, user) {
        if (!err) {
            if (!user) {
                res.status(404);
                res.send({error: "No user found"})
            } else {
                let timeSinceUpdate = getDifferenceInSeconds(timestamp, user.updatedAt)
                if (timeSinceUpdate < 90) {
                    res.status(429);
                    res.send({error: "Updated too recently", timeSinceUpdate: timeSinceUpdate})
                } else {
                    const getSummonerDataIDs = axiosFunctions.getSummonerDataIDs(summonerName);
                    getSummonerDataIDs.then((responseIDs) => {
                        const summonerDataIDs = responseIDs;

                        const getSummonerDataRankedSoloDuo = axiosFunctions.getSummonerDataRankedSoloDuo(summonerDataIDs.summonerID);

                        getSummonerDataRankedSoloDuo.then((responseRankedSoloDuo) => {
                            const summonerDataRankedSoloDuo = responseRankedSoloDuo;

                            //merge both JSON responses for the current summoner into one summoner object
                            let key;
                            let objectID = user._id;

                            for (key in summonerDataIDs) {
                                if (summonerDataIDs._doc.hasOwnProperty(key)) {
                                    user[key] = summonerDataIDs._doc[key];
                                }
                            }

                            for (key in summonerDataRankedSoloDuo) {
                                if (summonerDataRankedSoloDuo._doc.hasOwnProperty(key)) {
                                    user[key] = summonerDataRankedSoloDuo._doc[key];
                                }
                            }
                            
                            user._id = objectID;
                            user.save(function (err) {
                                if (err) console.log(err);
                            });

                            res.send(user);
                        });
                    });
                }
            }
        }
    })
});

router.get('/:summonerName', (req, res) => {
    let summonerName = req.params.summonerName;

    var query = User.findOne({ summonerName: new RegExp(`^${summonerName}$`, 'i') }).select('-_id');
    query.exec(function (err, user) {
        if (!err) {
            if (!user) {
                // Query from riot
                const getSummonerDataIDs = axiosFunctions.getSummonerDataIDs(summonerName);
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
                res.send(user);
            }
        } else {
            console.log(err)
        }
    });
})

module.exports = router;
