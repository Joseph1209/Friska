//var jwt = require('../angular-jwt/dist/angular-jwt');
var db = require('../db/connection.js');
var pwdMgr = require('../utils/managePassword.js');
var respHandler = require('../utils/responseHandler.js');
var dbName="TestDB";
var collectionName;
var auth = { 
    register: function(req, res) {
		var user = req.body;
		/*if(typeof user.name == 'undefined')
		{
			var body = "";
			req.on('data', function (dataChunk) {
				body += dataChunk;
			});
			req.on('end', function () {

				// Done pulling data from the POST body.
				// Turn it into JSON and proceed to store.
				user = JSON.parse(body);
			})
	
		}*/
		var name = user.name || '';
		var phoneNumber = user.phonenumber || '';
        var email = user.email || '';
        var password = user.password || '';
		console.log('name is', user.name)
		console.log('password is',user.password)
		// name is optional
        /*if (name.trim() == '' || phoneNumber.trim() == '' || email.trim() == '' || password.trim() == '') {
            // res, status, data, message, err
            respHandler(res, 401, null, 'Invalid Credentials', 'Invalid Credentials');
            return;
        }*/
		 pwdMgr.cryptPassword(user.password, function(err, hash) {
            user.password = hash;
            collectionName="Accounts";
            db.find(dbName,collectionName,{phonenumber:phoneNumber},function(err,resource){
                if(resource=='')
                {
                    db.insert(dbName,collectionName,user,function(err,dbUser){
                        if(err)
                        {
                            if (err.code == 11000) {
                                // duplicate key error
                                 // res, status, data, message, err
                                respHandler(res, 400, null, 'A user with this phonenumber already exists', 'A user with this phonenumber already exists');
                                return;
                            } else {
                                // res, status, data, message, err
                                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                                return;
                            }
                        }
                        else
                        {
                            delete dbUser.password;
                            console.log(dbUser)
                            respHandler(res, 200, genToken(dbUser[0]), 'Success', null);
                        }
                    });
                }
                else
                {
                    respHandler(res, 400, null, 'A user with this phonenumber already exists', 'A user with this phonenumber already exists');
                    return;
                }
            });
            
            /*db.users.insert(user, function(err, dbUser) {
                if (err) {
                    // http://www.mongodb.org/about/contributors/error-codes/ 
                    if (err.code == 11000) {
                        // duplicate key error
                        // res, status, data, message, err
                        respHandler(res, 400, null, 'A user with this email already exists', 'A user with this email already exists');
                        return;
                    } else {
                        // res, status, data, message, err
                        respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                        return;
                    }
                } else {
                    delete dbUser.password;

                    // res, status, data, message, err
                    respHandler(res, 200, genToken(dbUser), 'Success', null);
                }

            });*/
        });
    },

    verifyCode:function(req,res){
        var user=req. body;
        var phoneNumber=user.phonenumber;
        var verifyString=user.verifystring;
        collectionName="Accounts";
        db.find(dbName,collectionName,{phonenumber: phoneNumber},function(err, dbUser) {
            if(verifyString==dbUser[0]._id)
            {

                collectionName = 'User_Profile';
                var idString=new String();
                var dateObj = new Date()
                var userProfile={
                    "email" : dbUser[0].email,
                    "name" : dbUser[0].name,
                    "phonenumber" : dbUser[0].phonenumber,
                    "birthday" : dateObj,
                    "addresses" : [
                    {
                        "address" : "84 Thiel Wall Apt. 329",
                        "streetName" : "Ghambir Street",
                        "city" : {
                        "name" : "Gunter",
                        },
                        "district" : {
                        "name" : "Gunter",
                        },
                        "state" : {
                        "name" : "Andhra Pradesh",
                        },
                        "country" : {
                        "name" : "India"
                        },
                        "zipcode" : 123
                    }
                    ],
                    "accountId" : dbUser[0]._id+"abc"
                }

                db.insert(dbName,collectionName,userProfile,function(err,resource){
                    if (err) {
                        respHandler(res, 403, null, 'Error in making Profile', 'Error in making Profile');
                        return;
                        //cb(err, null);
                    } 
                });
                


                var tokenO={userID:dbUser[0]._id};
                collectionName="AccessToken";
                db.insert(dbName, collectionName, tokenO, function (err, res1) {
                    if (err) {
                        respHandler(res, 403, null, 'Error in making AccessToken collection', 'Error in making AccessToken collection');
                        return;
                        //cb(err, null);
                    } else {
                        //cb(null, res);
                        respHandler(res, 200, "Your account is activated now! Please log in!", 'Success', null);
                    }
                });
            }
            else
            {
                db.remove(dbName,collectionName,dbUser[0],function(err,result){
                    respHandler(res, 403, null, 'Incorrect verifycode!', 'Incorrect verifycode!');
                    return;    
                });
                return;
            }
        });
    },

    login: function(req, res) {
        var user = req.body;
		if(typeof user.phonenumber == 'undefined')
		{
			var body = "";
			req.on('data', function (dataChunk) {
				body += dataChunk;
			});
			req.on('end', function () {

				// Done pulling data from the POST body.
				// Turn it into JSON and proceed to store.
				user = JSON.parse(body);
			})
	
		}
        var phoneNumber = user.phonenumber || '';
        var password = user.password || '';
        collectionName="Accounts";    
        db.find(dbName,collectionName,{phonenumber: phoneNumber}, function(err, dbUser) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            } else if (dbUser=='') {
                // res, status, data, message, err
                respHandler(res, 403, null, 'Invalid User credentials', 'Invalid User credentials');
                return;
            }
            // we found one user, let's validate the password now
            pwdMgr.comparePassword(password, dbUser[0].password, function(err, isPasswordMatch) {
                if (isPasswordMatch) {
                    delete dbUser.password;
                    // res, status, data, message, err
                    respHandler(res, 200, genToken(dbUser[0]), 'Success', null);
                } else {
                    // res, status, data, message, err
                    respHandler(res, 403, null, 'Invalid User credentials', 'Invalid User credentials');
                    return;
                }         
            });

        });
    },

    forgotPasswordRequest: function(req,res) {
        var user = req.body;
		if(typeof user.phonenumber == 'undefined')
		{
			var body = "";
			req.on('data', function (dataChunk) {
				body += dataChunk;
			});
			req.on('end', function () {

				// Done pulling data from the POST body.
				// Turn it into JSON and proceed to store.
				user = JSON.parse(body);
			})
	
		}
        var phoneNumber = user.phonenumber || '';
        collectionName="Accounts";
        
        db.find(dbName,collectionName,{phonenumber: phoneNumber}, function(err, dbUser) {

            if(dbUser!='')
            {
                respHandler(res, 200, genToken(dbUser[0]), 'Success', null);
            }
            else
            {
                respHandler(res, 403, null, 'Incorrect Phonenumber!', 'Incorrect Phonenumber!');
                return;
            }
        });
    },

    forgotPassword: function(req,res) {
        var user = req.body;
		if(typeof user.verifystring == 'undefined')
		{
			var body = "";
			req.on('data', function (dataChunk) {
				body += dataChunk;
			});
			req.on('end', function () {

				// Done pulling data from the POST body.
				// Turn it into JSON and proceed to store.
				user = JSON.parse(body);
			})
	
		}
        var verifyString = user.verifystring || '';
        var phoneNumber = user.phonenumber || '';
        var passwordPara = user.password || '';
        collectionName="Accounts";
        db.find(dbName,collectionName,{phonenumber: phoneNumber}, function(err, dbUser) {
            if(dbUser!='')
            {
                
                if(verifyString==dbUser[0]._id)
                {
                    db.update(dbName,collectionName,{phonenumber: phoneNumber},{$set:{password:passwordPara}},function(err,document){
                        respHandler(res, 200, "Your password has been chagned correctly!", 'Success', null);
                    });
                }
                else
                {
                    respHandler(res, 403, null, 'Incorrect verifycode!', 'Incorrect verifycode!');
                    return;
                }
            }
            else
            {
                respHandler(res, 403, null, 'Incorrect Phonenumber!', 'Incorrect Phonenumber!');
                return;
            }
        });
    },

    validate: function(id, callback) {

        db.users.findOne({
			_id: id
            //_id: require('mongojs').ObjectId(id)
        }, callback);

    }

}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    /*var token = jwt.encode({
        exp: expires,
        user: user,
    }, require('../utils/secret'));*/
    var token = user._id;
    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
