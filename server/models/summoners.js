var mongoose = require('mongoose');

var summonerSchema = new mongoose.Schema({
    summonerName: String,
    summonerID: String,
    puuid: String,
    summonerLevel: Number,
    tier: String,
    rank: String,
    leaguePoints: Number,
    wins: Number,
    losses: Number,
}, { timestamps: true });

module.exports = mongoose.model("Summoner", summonerSchema)