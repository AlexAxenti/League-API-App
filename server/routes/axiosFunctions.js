const axios = require('axios').default;
var User = require('../models/users');

function getSummonerDataIDs(username) {
    axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${process.env.RIOT_API_KEY}`)
        .then(function (response) {
            let user = new User({
                summonerName: username,
                summonerID: response.data.id,
                puuid: response.data.puuid,
                summonerLevel: response.data.summonerLevel
            });
            
            return user;
        })
        .catch(function (error) {
            console.log("getSummonerDataIDs error: " + error);
        });
}

const getSummonerDataRankedSoloDuo = async(res, summonerID) => {
    let user = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${process.env.RIOT_API_KEY}`)
        .then(function (response) {

            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].queueType == "RANKED_SOLO_5x5"){
                    user = new User({
                        tier: response.data[i].tier,
                        rank: response.data[i].rank,
                        leaguePoints: response.data[i].leaguePoints,
                        wins: response.data[i].wins,
                        losses: response.data[i].losses,
                    });

                    user.save(function (err) {
                        if (err) console.log(err);
                    });
                    
                    return user;
                }
            }                            
        })
        .catch(function (error){
            console.log("getSummonerDataRankedSoloDuo error: " + error);
        });
}

module.exports = {
    getSummonerDataIDs,
    getSummonerDataRankedSoloDuo
}