/*var mongojs = require('mongojs');
//var db = mongojs('mongodb://admin:admin123@ds031962.mongolab.com:31962/ionicbookstoreapp', ['users', 'books']);
var db = mongojs('ionicbookstoreapp', ['users', 'books']);

// Add a unique index
db.users.ensureIndex({
    email: 1
}, {
    unique: true
});

module.exports = db;*/
// Our primary interface for the MongoDB instance
var MongoClient = require('mongodb').MongoClient;

// Used in order verify correct return values
var assert = require('assert');

/**
 *
 * @param databaseName - name of the database we are connecting to
 * @param callBack - callback to execute when connection finishes
 */
var connect = function (databaseName, callBack) {

    // URL to the MongoDB instance we are connecting to
    var url = 'mongodb://127.0.0.1:27017/' + databaseName;

    // Connect to our MongoDB instance, retrieve the selected
    // database, and execute a callback on it.
    MongoClient.connect(url,
        // Callback method
        function (error, database) {

            // Make sure that no error was thrown
            assert.equal(null, error);

            console.log("Successfully connected to MongoDB instance!");
			callBack(database);
        });
};

/**
 * Executes the find() method of the target collection in the
 * target database, optionally with a query.
 * @param databaseName - name of the database
 * @param collectionName - name of the collection
 * @param query - optional query parameters for find()
 */
exports.find = function (databaseName, collectionName, query, callback) {
    connect(databaseName, function (database) {

        // The collection we want to find documents from
        var collection = database.collection(collectionName);

        // Search the given collection in the given database for
        // all documents which match the criteria, convert them to
        // an array, and finally execute a callback on them.
        collection.find(query).toArray(
            // Callback method
            function (err, documents) {

                // Make sure nothing went wrong
                assert.equal(err, null);

                // Print all the documents which we found, if any
                console.log("MongoDB returned the following documents:");
                console.dir(documents);
				callback(err, documents);

                // Close the database connection to free resources
                database.close();
            })
    })
};

exports.update = function (databaseName, collectionName, query1,query2, callback) {
    connect(databaseName, function (database) {
        var collection = database.collection(collectionName);
        collection.update(query1,query2, function (err, documents) {
            console.log("Update a document correctly!");
			console.log(documents);
			callback(err, documents);
        });
    })
};

exports.insert = function (databaseName, collectionName, object, callback) {
	connect(databaseName, function (database) {
        var collection = database.collection(collectionName);
        collection.insert(object, {w: 1}, function (err, documents) {
            console.log("Added a new document");
			console.log(documents);
			callback(err, documents);
        });
    })
};

exports.remove = function (databaseName, collectionName, object, callback) {
    connect(databaseName, function (database) {
    	var collection = database.collection(collectionName);
        collection.remove(object, function (err, result) {
            callback(err, result);
            database.close();
        });
    })
};

