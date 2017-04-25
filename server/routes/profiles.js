var db = require('../db/connection.js');
var dbName="TestDB";
var collectionName="User_Profile";
var respHandler = require('../utils/responseHandler.js');
var profiles = {
	update: function(req,res){
		var profile=req.body;
		if(typeof profile.accountId == 'undefined')
		{
			var body = "";
			req.on('data', function (dataChunk) {
				body += dataChunk;
			});
			req.on('end', function () {

				// Done pulling data from the POST body.
				// Turn it into JSON and proceed to store.
				profile = JSON.parse(body);
			})
	
		}
		db.update(dbName,collectionName,{accountId: profile.accountId},{$set:profile},function(err,document){
            if(err)
            {
            	respHandler(res, 403, null, 'Error in updating profile', 'Error in updating profile');
            	return;
            }
            else
            {
            	//db.update(dbName,"Accounts",)
            	respHandler(res, 200, "Your password has been chagned correctly!", 'Success', null);
            }
        });
	},
	getProfile:function(req,res){
		console.log("aa");
		respHandler(res, 403, null, 'Error in getting profile', 'Error in getting profile');
		var profileId=req.params.id;
		if(profileId=='' || profileId=='undefined')
		{
			var url = require('url');
			var parsedUrl=url.parse(req.url,true)
			profileId=parsedUrl.query.id
		}
		profileId+="abc";
		db.find(dbName,collectionName,{accountId: profileId},function(err,resource){

			if(err)
			{
				respHandler(res, 403, null, 'Error in getting profile', 'Error in getting profile');
            	return;
			}
			else
			{
				respHandler(res, 200, resource, 'Success', null);
			}
		})
	}
}
module.exports = profiles;