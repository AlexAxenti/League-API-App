const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();

var Summoner = require('../models/summoners');
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

    var query = Summoner.findOne({ summonerName: new RegExp(`^${summonerName}$`, 'i') });
    query.exec(function (err, summoner) {
        if (!err) {
            if (!summoner) {
                res.status(404);
                res.send({error: "No summoner found"})
            } else {
                let timeSinceUpdate = getDifferenceInSeconds(timestamp, summoner.updatedAt)
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
                            let objectID = summoner._id;

                            for (key in summonerDataIDs) {
                                if (summonerDataIDs._doc.hasOwnProperty(key)) {
                                    summoner[key] = summonerDataIDs._doc[key];
                                }
                            }

                            for (key in summonerDataRankedSoloDuo) {
                                if (summonerDataRankedSoloDuo._doc.hasOwnProperty(key)) {
                                    summoner[key] = summonerDataRankedSoloDuo._doc[key];
                                }
                            }
                            
                            summoner._id = objectID;
                            summoner.save(function (err) {
                                if (err) console.log(err);
                            });

                            res.send(summoner);
                        });
                    });
                }
            }
        }
    })
});

router.get('/:summonerName', (req, res) => {
    let summonerName = req.params.summonerName;

    var query = Summoner.findOne({ summonerName: new RegExp(`^${summonerName}$`, 'i') }).select('-_id');
    query.exec(function (err, summoner) {
        if (!err) {
            if (!summoner) {
                // Query from riot
                const getSummonerDataIDs = axiosFunctions.getSummonerDataIDs(summonerName);
                getSummonerDataIDs.then((responseIDs) => {
                    const summonerDataIDs = responseIDs;
                    const getSummonerDataRankedSoloDuo = axiosFunctions.getSummonerDataRankedSoloDuo(summonerDataIDs.summonerID);

                    getSummonerDataRankedSoloDuo.then((responseRankedSoloDuo) => {
                        const summonerDataRankedSoloDuo = responseRankedSoloDuo;

                        //merge both JSON responses for the current summoner into one summoner object
                        let newSummoner = new Summoner;
                        let key;

                        for (key in summonerDataIDs) {
                            if(summonerDataIDs._doc.hasOwnProperty(key)){
                                newSummoner[key] = summonerDataIDs._doc[key];
                            }
                        }

                        for (key in summonerDataRankedSoloDuo) {
                            if(summonerDataRankedSoloDuo._doc.hasOwnProperty(key)){
                                newSummoner[key] = summonerDataRankedSoloDuo._doc[key];
                            }
                        }

                        newSummoner.save(function (err) {
                            if (err) console.log(err);
                        });

                        res.send(newSummoner);
                    });
                });
                
            } else {
                res.send(summoner);
            }
        } else {
            console.log(err)
        }
    });
})

module.exports = router;
