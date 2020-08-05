const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    //username and password already added by passport local mongoose
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);