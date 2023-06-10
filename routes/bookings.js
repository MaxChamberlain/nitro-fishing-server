var express = require('express');
var router = express.Router();
var { verifyToken } = require('../middlewares/jwt');
var { 
    insertBooking, 
    getBookings,
    getBooking
} = require('../controllers/bookingController');

router.post('/', insertBooking);
router.get('/', getBookings);
router.get('/:booking_id', getBooking);

module.exports = router;