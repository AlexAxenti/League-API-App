const axios = require('axios').default;
var Summoner = require('../models/summoners');

var apiLimit = require('./apiLimit');
let limit = apiLimit.apiLimit;

const getSummonerDataIDs = async(summonerName) => {
    if (limit.addRequest()) {
        console.log("Current request limit value: " + limit.minuteCount);
        try {
            const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_API_KEY}`);

            //response status 200 == valid response
            if (response.status === 200) {
                let summoner = new Summoner({
                    summonerName: response.data.name,
                    summonerID: response.data.id,
                    puuid: response.data.puuid,
                    summonerLevel: response.data.summonerLevel
                });

                return summoner;
            } else {
                return false;
            }
        } catch (error) {
            console.error("getSummonerDataRankedSoloDuo error: " + error)
            if (error.response.status == 404) {
                throw new Error('404')
            } else {
                throw new Error(error);
            }
        }
    } else {
        console.log("Api limit reached");
        throw new Error('503')
    }
    
}

const getSummonerDataRankedSoloDuo = async(summonerID) => {
    if (limit.addRequest()) {
        console.log("Current request limit value: " + limit.minuteCount);
        try {
            const response = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${process.env.RIOT_API_KEY}`);
        
            if (response.status === 200) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].queueType == "RANKED_SOLO_5x5") {
                        let summoner = new Summoner({
                            tier: response.data[i].tier,
                            rank: response.data[i].rank,
                            leaguePoints: response.data[i].leaguePoints,
                            wins: response.data[i].wins,
                            losses: response.data[i].losses,
                        });
                        
                        return summoner;
                    }
                }    
            } else {
                return false;
            }    
        } catch(error) {
            console.log("getSummonerDataRankedSoloDuo error: " + error);
            if (error.response.status == 404) {
                throw new Error('404')
            } else {
                throw new Error(error);
            }
        }
    } else {
        console.log("Api limit reached");
        throw new Error('503')
    }
}

const getLiveGameData = async(summonerID) => {
    if (limit.addRequest()) {
        console.log("Current request limit value: " + limit.minuteCount);
        try {
            const response = await axios.get(`https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerID}?api_key=${process.env.RIOT_API_KEY}`);
        
            if (response.status === 200) {
                let liveGame = {
                    bluePlayers: [],
                    redPlayers: []
                };

                blueSideCode = "100"; //if teamId == "100" this player is blue side

                for(let i = 0; i < response.data.participants.length; i++) {
                    if(response.data.participants[i].teamId == blueSideCode) {
                        liveGame.bluePlayers[i] = {};
                        liveGame.bluePlayers[i].summonerName = response.data.participants[i].summonerName;
                        liveGame.bluePlayers[i].championId = response.data.participants[i].championId
                    } else {
                        liveGame.redPlayers[i % 5] = {};
                        liveGame.redPlayers[i % 5].summonerName = response.data.participants[i].summonerName;
                        liveGame.redPlayers[i % 5].championId = response.data.participants[i].championId
                    }
                }
                
                return liveGame;   
            } else {
                return false;
            }    
        } catch(error) {
            console.log("getLiveGameData error: " + error);
            if(error.response.status == 404) {
                throw new Error('404')
            } else {
                throw new Error(error);
            }
        }
    } else {
        console.log("Api limit reached");
        throw new Error('503')
    }
}

module.exports = {
    getSummonerDataIDs,
    getSummonerDataRankedSoloDuo,
    getLiveGameData
}