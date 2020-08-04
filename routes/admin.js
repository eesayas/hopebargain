const express = require('express');
const router = express.Router();
const Slot = require('../models/slot');
const e = require('express');

/*
@route  /admin
@desc   Displays all slots
@access Private
*/
router.get('/', async (req, res) => {
  try{
    const slots = await Slot.find({});
    if(!slots) throw Error('Slots do not exists');

    res.render('admin', {slots, title: "Hope Bargain Shoppe - Slots"});
  } catch(e){
    res.status(400).json({msg: e.message});
  }
});

module.exports = router;
