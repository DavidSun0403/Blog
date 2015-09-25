var mongodb = require('./db');
var mongo = require('mongodb');
var BSON = mongo.BSONPure;

function Post(username, title, post, url, time, id, reply, pv) {
    this.user = username;
    this.title= title;
    this.post = post;
	this.url = url;
	this.reply= reply;
	this.id = id;
	
    if (time) {
        this.time = time;
    } else {
        this.time = new Date();
    }
}
module.exports = Post;

Post.prototype.detail = function detail(id, callback) {
 var posts = {
        user: this.user,
        title:this.title,
        post: this.post,
		imgUrl:this.imgUrl,
        type:this.type,
        time: this.time,
    };
        mongodb.collection('posts', function(err, collection) {        
			var o_id = new BSON.ObjectID(id);
			collection.update({_id:o_id},{$inc:{pv:1}});
            collection.find({_id:o_id}).toArray(function (err, posts) {
				   //每访问1次，pv 值增加1
                callback(null, posts);
				   
            });
        });	
};

Post.prototype.remove=function remove(id,callback){
    var post = { 
        user: this.user,
        title:this.title,
        post: this.post,
        time: this.time,
    };
        mongodb.collection('posts', function (err, collection) {
			var o_id = new BSON.ObjectID(id);
			collection.remove({_id:o_id}, {safe:true}, function(err, post){
             callback(err,post);
                  });
			});
        };
Post.prototype.update=function update(id,title,post,callback){
        mongodb.collection('posts', function (err, collection) {
		var o_id = new BSON.ObjectID(id);
			 collection.update({_id:o_id},{$set:{title:title,post:post}},function(err){		 	
				 callback();
			 });
        });
}
		
Post.prototype.updatereply=function updatereply(id,reply2,callback){
   var post = { 
      user: this.user,
        title:this.title,
        post: this.post,
        time: this.time,
		reply: this.reply
    };
        mongodb.collection('posts', function (err, collection) {
		var o_id = new BSON.ObjectID(id);
			collection.find({_id:o_id}).sort({
                time: -1
            }).toArray(function (err, docs) {
                var posts = [];
				
                docs.forEach(function (doc, index) {
                    var post = new Post(doc.user, doc.title, doc.post, doc.url, doc.time, doc._id,doc.reply, doc.pv);
                    posts.push(post);
                });
				if(posts[0].reply!=null){
				var reply3=posts[0].reply+reply2;
				}
				if(posts[0].reply==null){
				var reply3=reply2;
				}
				collection.update({_id:o_id},{$set:{reply:reply3}},function(err){		 		
				 callback();
			 });
                callback(null, posts);
            });
			});
		
}

Post.prototype.save = function save(callback) {
    var post = {
        user: this.user,
        title:this.title,
        post: this.post,
		url:  this.url,
		reply: this.reply,
		pv:0,
        time: this.time,
	
		
		
    };
        mongodb.collection('posts', function (err, collection) {
            if (err) {
                return callback(err);
            }

            collection.ensureIndex('user');
            collection.insert(post, {
                safe: true
            }, function (err,post) {
                callback(err,post);
            });
        });
};
Post.find = function get(username, callback) {
        mongodb.collection('posts', function(err, collection) {
            if (err) {
                return callback(err);
            }

            var query = {};
            if (username) {
                query.user = username;
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                if (err) {
                    callback(err, null);
                }

                var posts = [];

                docs.forEach(function (doc, index) {
                    var post = new Post(doc.user, doc.title, doc.post, doc.url, doc.time, doc._id);
					//post.time=doc.time;
                    var now = post.time;
                    post.time = now.getFullYear() + "-" + (now.getUTCMonth()+1) + "-" + now.getUTCDate()+ " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
};
Post.getEight = function get(username,page,callback) {
        mongodb.collection('posts', function(err, collection) {
            if (err) {
                return callback(err);
            }

            var query = {};
            if (username) {
                query.user = username;
            }
            collection.find(query,{skip:(page-1)*8, limit:8}).sort({
                time: -1
            }).toArray(function (err, docs) {
                if (err) {
                    callback(err, null);
                }

                var posts = [];
                docs.forEach(function (doc, index) {
                    var post = new Post(doc.user, doc.title, doc.post, doc.url, doc.time, doc._id);
					//post.time=doc.time;
                    var now = post.time;
                    post.time = now.getFullYear() + "-" + (now.getUTCMonth()+1) + "-" + now.getUTCDate()+ " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
};
Post.get = function get(username, callback) {
        mongodb.collection('posts', function(err, collection) {
            if (err) {
                return callback(err);
            }

            var query = {};
            if (username) {
                query.user = username;
            }
			
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                if (err) {
                    callback(err, null);
                }
	
                var posts = [];
				
                docs.forEach(function (doc, index) {
                    var post = new Post(doc.user, doc.title, doc.post, doc.url, doc.time, doc._id,doc.reply,doc.pv);
					//post.time=doc.time;
					post.pv=doc.pv;
                    var now = post.time;
                    post.time = now.getFullYear() + "-" + (now.getUTCMonth()+1) + "-" + now.getUTCDate()+ " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
};