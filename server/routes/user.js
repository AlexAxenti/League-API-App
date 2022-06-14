var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.send({message: "test"});
})

router.get('/:username', (req, res) => {
    let username = req.query.username;
    res.send({ user: username, rank: 'Challenger 2500LP' });
})

module.exports = router;
