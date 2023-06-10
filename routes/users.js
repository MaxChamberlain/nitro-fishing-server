var express = require('express');
var router = express.Router();
var { verifyToken } = require('../middlewares/jwt');
var {
  loginUser,
  getUserDetails
} = require('../controllers/usersController');

router.post('/login', loginUser);
router.get('/user', verifyToken, getUserDetails);

module.exports = router;