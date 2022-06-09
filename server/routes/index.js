var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.send("Hello word!");
})

router.get('/test', (req, res) => {
    res.send("Hello word 3!!!");
})


router.get('/user', (req, res) => {
    res.send({ user: 'Zethyos', rank: 'Challenger 2500LP' });
})


module.exports = router;
