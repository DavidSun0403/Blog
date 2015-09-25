
var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
	fs = require("fs");
	var Url = require("url");	
module.exports = function(app){	
	app.post('/', checkLogin);
    app.post('/', function(req, res){
	req.session.flash='';
        var currentUser = req.session.user;
		var reply = req.body.username+":"+req.body.reply+';';
		var id=req.body.id;
		 post = new Post(id,reply);
		  post.updatereply(id,reply,function(err){
			if(err){
                req.flash('error', err); 
				return res.redirect('/');  
            }
			res.redirect('/'); 
			}
			
        );
           
		});
  
	
　　app.get('/', function(req,res){
	req.session.flash='';
    var page = req.query.p;
    if(!page){
        page = 1;
    } else {
        page = parseInt(page);
    }
    Post.get(null,function(err, posts){
        if(err){
            posts = [];
        };
		var display=[];
		var replys=[]
		var replyall=[];
		if(posts.length>page*8){
		for(var n=8*page-8;n<8*page;n++){
		display[n]=posts[n];
		if(display[n].reply){
		reply=display[n].reply.split(";");
		display[n].replynum=reply.length-1;
		}
		
		}}
		else{
		for(var n=8*page-8;n<=posts.length-1;n++){
		display[n]=posts[n];
		if(display[n].reply){
		reply=display[n].reply.split(";");
		display[n].replynum=reply.length-1;
		}
		}
		}
	if(req.session.user&&req.session.user.name!=''){
    User.get(req.session.user.name, function(err, user){
        res.render('index',{
            title: '主页',
            user: req.session.user,
            posts: display,
			postsall:posts,
            page: page,
			friends:user.friend,
			pagenum: Math.ceil(posts.length/8),
			pagenum2: Math.ceil(posts.length/8),
			start:1,
		});
	});
	}else{
	 res.render('index',{
            title: '主页',
            posts: display,
			postsall:posts,
            page: page,
			user:'未登陆',
			pagenum: Math.ceil(posts.length/8),
			pagenum2: Math.ceil(posts.length/8),
			start:1,
        });
		}
});
});	
　　app.get('/regCheck', checkNotLogin);
    app.get('/regCheck', function(req,res){
	var pathname = Url.parse(req.url).pathname;
	var param = Url.parse(req.url, true).query;
	var username = param.username;
	var data;
   User.get(username, function(err, user){
            if(user){
			    res.send({data: '<font color="red">用户名已存在，请重新输入</font>'});			
            }else{		 
			    res.send({data: '<font color="green">可以创建</font>'});
			}
	    }); 
    });
	 
	 app.get('/reg', checkNotLogin);
    app.get('/reg', function(req,res){
	req.session.flash='';
        res.render('reg',{
            title:'注册',
            user:req.session.user,

        }); 
    });
	app.post('/reg', checkNotLogin);
　　app.post('/reg', function(req,res){
		req.session.flash='';
        if(req.body['password-repeat'] != req.body['password']){
            return res.redirect('/reg');
        }
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
		var friend=[];
        var newUser = new User({
            name: req.body.username,
            password: password,
			friend:friend,
        });
        User.get(newUser.name, function(err, user){
            if(user){
			console.log("注册失败");
                err = '用户已存在';
            }
            if(err){
                req.flash('error', err);
                return res.redirect('/reg');
            }
            newUser.save(function(err){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.flash('success','注册成功');
                res.redirect('/');
            });
        });
    });
      
	  
 app.get('/delete', checkLogin);
 app.get('/delete', function(req, res){
	 var Url = require("url");
	 var pathname = Url.parse(req.url).pathname;
	 var param = Url.parse(req.url, true).query;
	 var username1 = param.user1;
	 var username2 = param.user2;
	 var error = false;
	 if(username1!=username2){
	 error=true;
	 console.log(error);
	 }
        res.render('delete',{
            title: '删除',
			user:req.session.user,
			errorcode: error
        }); 
		
    });
 app.post('/delete', checkLogin);
　　    app.post('/delete', function(req, res){
       var newPost = new Post({
			user:req.body.username,
			title: req.body.title,
            post: req.body.post,	
			time: req.body.time,
        });
		
	var Url = require("url");
	 var pathname = Url.parse(req.url).pathname;
	 var param = Url.parse(req.url, true).query;
	 var id = param.id;
	 var username1 = param.user1;
	 var username2 = param.user2;
		if(username1==username2){
         newPost.remove(id,function(err){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                req.flash('success','删除成功！');
                res.redirect('/');
            });
			}
		 if(username1!=username2){
         
                req.flash('success','您没有权限删除！');
                res.redirect('/');
          
			}
        }); 
	app.post('/addfriend', function(req, res){	
		var addname=req.body.friend;
		var username=req.body.user;
		var newuser=new User({
            name: username,
        });;
		
		newuser.addfriend(username,addname,function(err){
		req.flash('success','好友添加成功！');
		res.redirect('/searchuser?user='+addname);
		});
	});
	app.get('/searchuser', function(req, res){
	var pathname = Url.parse(req.url).pathname;
	var param = Url.parse(req.url, true).query;
	var keyword = param.user;
	

	Post.get(null, function(err, posts){
	var haskey;
	if(keyword){
	haskey=1;
	if (Array.isArray(keyword)) {
    	keyword = keyword.join(' ');
  	}
	
  	keyword = keyword.trim();
  	keyword = keyword.replace(/[\*\^\&\(\)\[\]\+\?\\]/g, '');
		console.log("keyword:"+keyword);
		if(err){
			posts = [];
		} 	
		var result=[];
		var resultlengthl=0;
		for(var i=0; i<posts.length; i++){
		if(keyword.length<=posts[i].user.length)	{	
		var n=0;	
		var time =posts[i].user.length;
		while(n<=time)	{
		var struser='';
		if(n+keyword.length<=posts[i].user.length){var struser=posts[i].user.substring(n,n+keyword.length);}
		if(keyword == struser){
		result[i]=posts[i];
		if(result[i].reply){
		reply=result[i].reply.split(";");
		result[i].replynum=reply.length-1;
	
		}
		n=n+1;
		break;
		}
		else{
		n=n+1;}
		}
		}}}
		else{
		haskey=0;
		}
		if(req.session.user){
		var usernow=req.session.user.name;
        User.get(usernow, function(err, user){
        res.render('searchuser',{
            title: '用户搜索',
            user: req.session.user,
			result:keyword,
            posts: result,
			haskey: haskey,
			friends:user.friend,
			});
		    }); 
			}	
		else{
		 res.render('searchuser',{
            title: '用户搜索',
            user: '未登陆',
			result:keyword,
            posts: result,
			haskey: haskey,
        });
		}
	 });
		});
	app.post('/searchuser', checkLogin);
    app.post('/searchuser', function(req, res){
        var currentUser = req.session.user;
		var reply = req.body.username+":"+req.body.reply+';';
		var id=req.body.id;
		 post = new Post(id,reply);
		  post.updatereply(id,reply,function(err){
			if(err){
				return res.redirect('/searchuser');  
            }
			res.redirect('/searchuser'); 
			}
			
        );
           
		});
		
　　app.post('/searchall', function(req, res){
	var keyword = req.body.search || '';
	
	Post.get(null, function(err, posts){
		if (Array.isArray(keyword)) {
    	keyword = keyword.join(' ');
  	}
  	keyword = keyword.trim();
  	keyword = keyword.replace(/[\*\^\&\(\)\[\]\+\?\\]/g, '');
		console.log("keyword:"+keyword);
		if(err){
			posts = [];
		} 	
		var result=[];
		var resultlengthl=0;
		var isfind = false
		for(var i=0; i<posts.length; i++){
		if(keyword.length<=posts[i].title.length||keyword.length<=posts[i].post.length||keyword.length<=posts[i].user.length)	{	
		var n=0;	
		var time =posts[i].title.length+posts[i].post.length+posts[i].user.length;
		while(n<=time)	{
		var strtitle='';
		var struser='';
		var strpost='';
		if(n+keyword.length<=posts[i].title.length){var strtitle=posts[i].title.substring(n,n+keyword.length);}
		if(n+keyword.length<=posts[i].post.length){var strpost=posts[i].post.substring(n,n+keyword.length);}
		if(n+keyword.length<=posts[i].user.length){var struser=posts[i].user.substring(n,n+keyword.length);}
		if(keyword == strtitle||keyword == strpost||keyword == struser){
		result[i]=posts[i];
		resultlengthl=resultlengthl+1;
		n=n+1;
		break;
		}
		else{
		n=n+1;
		}}}
		}
            res.render('searchall',{
                title:'搜索',
                user: req.session.user,
                posts:result,
                success:req.flash('success').toString(),
				contents: keyword,
				num: resultlengthl,
            });
			
        });
		
        });
	  
　　app.get('/searchall', function(req, res){
        res.render('searchall',{
            title:'搜索2',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        }); 
    });
	
   
	  
	  
	  
	  
    app.get('/login', checkNotLogin);
　　app.get('/login', function(req, res){
        res.render('login',{
            title:'登录',
            user:req.session.user,
			flash:req.session.flash,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        }); 
    });
	
	
    app.post('/login', checkNotLogin);
　　app.post('/login', function(req, res){
	
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('base64');
        User.get(req.body.username, function(err, user){
            if(!user){
                req.session.flash='用户不存在'; 
                return res.redirect('/login'); 
            }
            if(user.password != password){
               req.session.flash='用户或密码错误'; 
                return res.redirect('/login');
            }
            req.session.user = user;
			var username=req.body.username;
            res.redirect('/');
        });
    });
	
	app.get('/changepassword',checkLogin);
	   app.get('/changepassword', function(req, res) {
	    res.render('changepassword',{
			user:req.session.user,
			password1:req.body.password1,
			password2:req.body.password2,
			title:'修改密码',
			errorcode:'',
        }); 
      });

        app.post('/changepassword',checkLogin);
         app.post('/changepassword', function(req, res) {
	      var password1=req.body.password1;
		  var password2=req.body.password2;
		  var md5 = crypto.createHash('md5');
          var password = md5.update(password1).digest('base64');
		  if(password1!=password2)
		  {
		  res.render('changepassword', {
		  errorcode: '两次密码不一致！',
          user:req.session.user,
		  title:'修改密码失败！',
		  action: 'changepassword'});
		 return;
		  }
		  var name=req.session.user.name;
		 var newUser = new User({
            name: name,
            password: password,
        });
		newUser.changepassword(name,password,function(){
		   console.log('修改成功');
		   res.redirect('/');
		});
      });

    app.get('/logout', checkLogin);
　　app.get('/logout', function(req, res){
        req.session.user = null;
        req.flash('success','登出成功');
        res.redirect('/');
	});
	app.get('/upload', checkLogin);
    app.get('/upload', function(req, res){
        res.render('upload',{
            title:'上传图片',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        }); 
    });
	 app.post('/upload', checkLogin);
    app.post('/upload', function(req, res) {
    var tmp_path = req.files.thumbnail.path;
	var currentUser = req.session.user;
		var title = req.body.title;
	var name = GetRandomNum(1,10000)+req.files.thumbnail.name;
    var target_path = 'C:/Users/13071474/Desktop/12345/public/shangchuan/' + name;
	var imgurl ='/shangchuan/'+name;
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
       fs.unlink(tmp_path, function() {
         if (err) throw err;
      });
    });
        post = new Post(currentUser.name,'图片分享', req.body.pic,imgurl);
		  post.save(function(err){
			if(err){
                req.flash('error', err); 
				return res.redirect('/');  
            }
			req.flash('sucess','图片上传成功！' ); 
			res.redirect('/'); 
			}
			
        );
   

  });
	app.get('/task', checkLogin);
    app.get('/task', function(req, res){
        res.render('task',{
            title:'任务中心',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        }); 
    });
	
	app.get('/upload2', checkLogin);
    app.get('/upload2', function(req, res){
        res.render('upload2',{
            title:'上传音乐',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        }); 
    });
	 app.post('/upload2', checkLogin);
    app.post('/upload2', function(req, res) {
    var tmp_path = req.files.thumbnail.path;
	var currentUser = req.session.user;
		var title = req.body.title;
	var name = GetRandomNum(1,10000)+req.files.thumbnail.name;
    var target_path = 'C:/Users/13071474/Desktop/12345/public/music/' + name;
	var url ='/music/'+name;
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
       fs.unlink(tmp_path, function() {
         if (err) throw err;
      });
    });
        post = new Post(currentUser.name,'音乐分享', req.body.pic,url);
		  post.save(function(err){
			if(err){
                req.flash('error', err); 
				return res.redirect('/');  
            }
			req.flash('sucess','音乐上传成功！' ); 
			res.redirect('/'); 
			}
			
        );
   

  });  
  
	app.get('/detail', checkLogin);
　　app.get('/detail', function(req, res){
		var param = Url.parse(req.url, true).query;
		var id = param.id;
		var uname=param.user;
		var newPost = new Post({
			id:req.body.id,
        });
        newPost.detail(id,function(err,posts){
            if(err){       
                return res.redirect('/reg');
            }	
			var title=posts[0].title;
			var post=posts[0].post;
			var url=posts[0].url;
			console.log('url:'+url);
			var mindcode='';
			if(req.session.user.name!=uname)
				{ 
				   mindcode='n';
				}
			res.render('detail',{
			title:title,
			post:post,
			url:url,
			user:req.session.user,
			id:id,
			mindcode:mindcode,
			}); 
        });	
		
    });
	
    app.post('/detail', checkLogin);
　　app.post('/detail', function(req, res){
			var title=req.body.title;
			var post=req.body.post;
			var id=req.body.id;		
			var newPost = new Post({
					title:req.body.title,
					post:req.body.post,
					_id:req.body.id,
			});
			newPost.update(id,title,post,function() {
				req.flash('success','修改成功！');
				res.redirect('/reg');
			});
	});
	
   
	
	app.get('/post', checkLogin);
    app.get('/post', function(req, res){
        res.render('post',{
            title:'发表',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        }); 
    });
    
	app.post('/post', checkLogin);
    app.post('/post', function(req, res){
        var currentUser = req.session.user;
		var title = req.body.title;
		 if(title!=""){
        post = new Post(currentUser.name, req.body.title, req.body.post);
			console.log('不为空');
		   post.save(function(err){
			if(err){
                req.flash('error', err); 
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/');
			
        });
           }
		else{ 
			console.log("空了");
			if(title==""){
            req.flash('error', '标题不能为空!');
            res.redirect('/posterror');
			}
		}
    });
	app.get('/posterror', checkLogin);
    app.get('/posterror', function(req, res){
        res.render('posterror',{
            title:'错误',
            user:req.session.user,
        }); 
		
    });
};

function GetRandomNum(Min,Max)
{   
var Range = Max - Min;   
var Rand = Math.random();   
return(Min + Math.round(Rand * Range));   
} 
function checkLogin(req, res, next){
    if(!req.session.user){
        req.flash('error','未登录'); 
        return res.redirect('/login');
    }
    next();
}


function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('error','已登录'); 
        return res.redirect('/');
    }
    next();
}
