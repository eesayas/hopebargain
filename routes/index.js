const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Slot = require('../models/slot');

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

/*
@route  /register
@desc   Register time slot
@access Public
*/
router.post('/register', async (req, res) => {
  const data = JSON.parse(req.body.data);
  try{
    const slots = await Slot.find({date: data.date, firstName: data.firstName, lastName: data.lastName, phoneNumber: data.phoneNumber});
    if(slots.length) throw Error("You can't book multiple slots");
    
    const slot = await Slot.create(data);
    if(!slot) throw Error('Something went wrong while creating slot');

    res.status(200).json({success: true});
  } catch(e){
    res.status(400).json({msg: e.message});
  }
})

/*
@route  /available/:date
@desc   Get all available slots given a time, date is in milliseconds
@access Public
*/
router.get('/available/:date', async (req, res) => {
  try{
    const slots = await Slot.find({date: req.params.date}); //get all slots with the same date
    if(!slots) throw Error('Slot objects do not exist');

    //group all slots via timeIndex
    const timeSlots = _.mapValues(_.groupBy(slots, 'timeIndex'), slotlist => 
      6 - slotlist.map(people => people.companions.length + 1).reduce((accumulator, currentValue) => accumulator + currentValue)); //take note that companions should count
    
    for(let i = 0; i < 5; i++){
      if(!timeSlots[`${i}`] && timeSlots[`${i}`] !== 0) timeSlots[`${i}`] = 6;
    }

    res.status(200).json(timeSlots);
  } catch(e){
    res.status(400).json({msg: e.message});
  }
  
});


module.exports = router;
