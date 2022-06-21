const express = require('express');
const router = express.Router();

var controller = require('../controllers/summoner');

/*  /api/summoner   */
router.get('/', (req, res) => {
    res.send("Hello world!");
})

router.get('/:summonerName', controller.getSummoner);

router.get('/:summonerName/update', controller.updateSummoner);

router.get('/:summonerName/ingame', controller.getSummonerInGame);

module.exports = router;
