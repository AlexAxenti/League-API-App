const { default: axios } = require('axios');
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
