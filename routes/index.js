var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hope Bargain Shoppe - Schedule' });
});

/*
@route  /register
@desc   Has the calendar the slot selections for booking also the form for contact info (in order)
@access Public
*/
router.get('/register', (req, res) => {
  res.render('register', { title: 'Hope Bargain Shoppe - Register' });
});


module.exports = router;
