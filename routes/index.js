const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Slot = require('../models/slot');
const passport = require('passport');
const User = require('../models/user');
const e = require('express');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hope Bargain Shoppe - Schedule' });
});

/*
@route  GET /register
@desc   Has the calendar the slot selections for booking also the form for contact info (in order)
@access Public
*/
router.get('/register', (req, res) => {
  res.render('register', { title: 'Hope Bargain Shoppe - Register' });
});

/*
@route  POST /register
@desc   Register time slot
@access Public
*/
router.post('/register', async (req, res) => {
  const data = JSON.parse(req.body.data);
  try{
    const slots = await Slot.find({date: data.date, firstName: { $regex : new RegExp(data.firstName, "i")} , lastName: { $regex : new RegExp(data.lastName, "i")} });;
    if(slots.length) throw Error("You can't book multiple slots on the same day");
    
    const slot = await Slot.create(data);
    if(!slot) throw Error('Something went wrong. Please try again.');

    res.status(200).json({success: true, slot});
  } catch(e){
    // console.log(e);
    res.status(400).json({success: false, msg: e.message});
  }
})

/*
@route  GET /available/:date
@desc   Get all available slots given a time, date is in milliseconds
@access Public
*/
router.get('/available/:date', async (req, res) => {
  try{
    const slots = await Slot.find({date: req.params.date}); //get all slots with the same date
    if(!slots) throw Error('Slot objects do not exist');

    //group all slots via timeIndex
    const timeSlots = _.mapValues(_.groupBy(slots, 'timeIndex'), slotlist => 
      5 - slotlist.map(people => people.companions.length + 1).reduce((accumulator, currentValue) => accumulator + currentValue)); //take note that companions should count
    
    for(let i = 0; i < 5; i++){
      if(!timeSlots[`${i}`] && timeSlots[`${i}`] !== 0) timeSlots[`${i}`] = 5;
    }
    // console.log(timeSlots);
    res.status(200).json(timeSlots);
  } catch(e){
    res.status(400).json({msg: e.message});
  }
  
});

/*
@route  POST /adduser
@desc   Register a user (MUST BE COMMENTED OUT AFTER USER CREATION)
@access Public

router.post('/adduser', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
  });

  await User.register(newUser, req.body.password);
  res.send(`${req.body.username} successfully registered`);
});
*/

/*
@route  GET /login
@desc   This is the login form for admin
@access Public
*/
router.get('/login', (req, res) => {
  res.render('login', { title: 'Hope Bargain Shoppe - Login' })
});

/*
@route  POST /login
@desc   This log ins a user
@access Public
*/
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login'
  }) (req, res, next);
});

/*
@route  GET /logout
@desc   Logouts a user
@access Public
*/
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
