var mongodb = require('./db');
var mongo = require('mongodb');
var BSON = mongo.BSONPure;

function Task(to, from, content,place,startday,starttime,endday,endtime, time, id) {
    this.to = to;
    this.from= from;
	this.content = content;
	this.place = place;
	this.startday = startday;
	this.starttime = starttime;
	this.endday = endday;
	this.endtime = endtime;
    this.time = time;
	this.id = id;
	
    if (time) {
        this.time = time;
    } else {
        this.time = new Date();
    }
}

module.exports = Task;

Task.prototype.remove=function remove(id,callback){
    var post = { 
        user: this.user,
        title:this.title,
        post: this.post,
        time: this.time,
    };
   //===============

        mongodb.collection('posts', function (err, collection) {
			var o_id = new BSON.ObjectID(id);
			collection.remove({_id:o_id}, {safe:true}, function(err, post){
             callback(err,post);
                  });
			});
        };

Task.prototype.save = function save(callback) {
    var task = {
    to:this.to,
    from:this.from,
	content:this.content ,
	place:this.place ,
	startday:this.startday,
	starttime:this.starttime ,
	endday:this.endday ,
	endtime:this.endtime ,
    time: new Date(),
		
    };

        mongodb.collection('tasks', function (err, collection) {
            collection.ensureIndex('to');
            collection.insert(task, {
                safe: true
            }, function (err,task) {
                callback(err,task);
            });
        });
};

Task.get = function get(username, callback) {

        mongodb.collection('tasks', function(err, collection) {
            var query = {};
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                if (err) {
                    callback(err, null);
                }
	
                var tasks = [];
				
                docs.forEach(function (doc, index) {
                    var task = new Task(doc.to,doc.from, doc.content,doc.place,doc.startday,doc.starttime,doc.endday,doc.endtime,doc.time);
                    var now = task.time;
                    task.time = now.getFullYear() + "-" + (now.getUTCMonth()+1) + "-" + now.getUTCDate()+ " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                    tasks.push(task);
                });
                callback(null, tasks);
            });
        });
};
