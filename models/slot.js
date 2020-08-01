const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
    date: { type: String, required: true},
    time: { type: String, required: true },
    timeIndex: { type: Number, required: true}, // '9:00am-10:30am' => 0 '10:30am-12:00pm' => 1
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: String,
    emailAddress: String,
    companions: [
        {
            firstName: String,
            lastName: String,
        }
    ]
},{
    timestamps: true
});

module.exports = mongoose.model('Slot', SlotSchema)