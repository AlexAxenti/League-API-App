const axios = require('axios').default;
var User = require('../models/users');

const getSummonerDataIDs = async(summonerName) => {
    try {
        const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_API_KEY}`);

        //response status 200 == valid response
        if (response.status === 200) {
            let user = new User({
                summonerName: response.data.name,
                summonerID: response.data.id,
                puuid: response.data.puuid,
                summonerLevel: response.data.summonerLevel
            });
            
            return user;
        } else {
            return false;
        }
    } catch(error) {
        console.error("getSummonerDataRankedSoloDuo error: " + error)
        return false;
    }
}

const getSummonerDataRankedSoloDuo = async(summonerID) => {
    try {
        const response = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${process.env.RIOT_API_KEY}`);
    
        if (response.status === 200) {
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].queueType == "RANKED_SOLO_5x5") {
                    let user = new User({
                        tier: response.data[i].tier,
                        rank: response.data[i].rank,
                        leaguePoints: response.data[i].leaguePoints,
                        wins: response.data[i].wins,
                        losses: response.data[i].losses,
                    });
                    
                    return user;
                }
            }    
        } else {
            return false;
        }    
    } catch(error) {
        console.log("getSummonerDataRankedSoloDuo error: " + error);
        return false;
    }
}

module.exports = {
    getSummonerDataIDs,
    getSummonerDataRankedSoloDuo
}