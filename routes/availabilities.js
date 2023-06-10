var express = require('express');
var router = express.Router();
var { verifyToken } = require('../middlewares/jwt');
var { 
    insertAvailability,
    getAvailabilities
 } = require('../controllers/availabilitiesController');

router.post('/', verifyToken, insertAvailability);
router.get('/', getAvailabilities);

module.exports = router;