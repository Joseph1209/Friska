/** http://stackoverflow.com/a/14015883/1015046 **/
//var bcrypt = require('bcrypt');
var authenticator = require('../db/authentication');
module.exports.cryptPassword = function(password, callback) {

    return callback(null,password);
    /*bcrypt.genSalt(10, function(err, salt) {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });

    });*/
};

module.exports.comparePassword = function(password, userPassword, callback) {

    if (password == userPassword) {
            // Create a new token for the user
            /*this.generateToken(user, function (err, res) {
                cb(null, res);
            })*/
            return callback(null,1);
    } else {
        return callback({error: 'Authentication error', message: 'Incorrect username or password'}, null);
    }
    /*bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
        if (err)
            return callback(err);
        return callback(null, isPasswordMatch);
    });*/
};
