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

/*
@route  /admin/:slot_id
@desc   Update a slot via slot id
@access Private
*/
router.post('/:slot_id', async(req, res) => {
  const data = JSON.parse(req.body.data);

  try{
    const slot = await Slot.findById(req.params.slot_id);
    if(!slot) throw Error('Slot does not exist');

    slot.firstName = data.firstName;
    slot.lastName = data.lastName;
    slot.phoneNumber = data.phoneNumber;
    slot.emailAddress = data.emailAddress;
    slot.companions = data.companions;

    const update = await slot.save();
    if(!update) throw Error('Something went wrong while updating slot');

    res.status(200).json({success: true});
  } catch(e){
    res.status(400).json({msg: e.message});
  }
});

module.exports = router;
