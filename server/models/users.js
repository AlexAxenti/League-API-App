var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    summonerName: String,
    summonerID: String,
    puuid: String,
    summonerLevel: Number,
    rank: String,
    leaguePoints: Number,
    wins: Number,
    losses: Number,
});

module.exports = mongoose.model("User", userSchema)