var mongodb = require('./db');

function User(user){
    this.name = user.name;
    this.password = user.password;
	this.friend = user.friend;
};
module.exports = User;
User.prototype.save = function save(callback) {
    var user = {
        name: this.name,
        password: this.password,
		friend:this.friend,
    };
        mongodb.collection('users', function(err, collection){
            if(err){
                return callback(err);
            }

            collection.ensureIndex('name',{
                unique:true
            });

            collection.insert(user,{safe: true}, function(err, user){
                callback(err, user);
            });
        });

};
User.prototype.changepassword = function changepassword(name,password,callback) {
        mongodb.collection('users', function(err, collection){
            if(err){
                return callback(err);
            }
            collection.ensureIndex('name',{
                unique:true
            });
			 collection.update({name:name},{$set:{password:password}},function(err){		 		
				 callback();
			 });
        });

};
User.prototype.addfriend = function addfriend(name,friend,callback) {
        mongodb.collection('users', function(err, collection){
             collection.findAndModify({"name":name}
			, [['time',-1]]
			, {$push:{"friend":friend}}
			, {new: true}
			, function (err,friend) {
				callback(null);
			}); 
        });

};

User.get = function get(username, callback){
        mongodb.collection('users', function(err, collection){
            collection.findOne({
                name: username
            },function(err, doc){
                if(doc){
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
};
