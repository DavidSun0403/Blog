  var from=''; 
  var to='';
  var group=[];
  var room='';
  var message=[];
  var groupmessage=[];
  var talking=[];
  var grouptalking=[];
  //区分点击历史记录按钮所要执行的动作
  var a=0;
  var b=0;
  //IE不支持IndexOf方法，需要在开始前加载以下代码
  Array.prototype.indexOf=function(substr,start){
	  var ta,rt,d='\0';
      if(start!=null){ta=this.slice(start);rt=start;}else{ta=this;rt=0;}
      var str=d+ta.join(d)+d,t=str.indexOf(d+substr+d);
      if(t==-1)return -1;rt+=str.slice(0,t).replace(/[^\0]/g,'').length;
      return rt;
  };
//
function talkTo(to){
	if(to=="group1"){
		$("#groupTalkWinow").show();
		if(grouptalking.indexOf(to)==-1){
			grouptalking.unshift(to);
		}
		$("#groupshow").html(to+':'+'123、'+'234、'+'15900、'+'15964');
	    group.unshift({"name":'123',"type":'new'});
	    group.unshift({"name":'234',"type":'new'});
	    group.unshift({"name":'15900',"type":'new'});
	    group.unshift({"name":'15964',"type":'new'});
	    room='group1';
	}else if(talking.indexOf(to)==-1){
    	 talking.unshift(to);
    	 $("#talkWinow").show();
    	 $("#usertalk").append('<div id=\''+'usertalk_'+to+'\' style=\'height:350px;width:300px; margin-top:20px;position: absolute;overflow:scroll;overflow-x:hidden; border:1px solid #F00;\'></div>');
    	 $("#targets").append('<div id=\''+'targets_'+to+'\' style="margin-top:10px;margin-left:10px;" onclick="changediv(\''+to+'\')">' + to +'</div>');
		 $("#deletes").append('<div id=\''+'deletes_'+to+'\' style="margin-top:10px" onclick="deletediv(\''+to+'\')">x</div>');
		changediv(to);
	}

}
function changediv(a)
{
	$("#"+'usertalk_'+a).show();
	for(var i=0;i<talking.length;i++){
		if(talking[i]!=a){
		$("#"+'usertalk_'+talking[i]).hide();
		}
	}
	to=a;
	$("#to").val(a);
	$("#show").html(a); 
}
function deletediv(to){ 
	var usertalk=document.getElementById('usertalk');
	var targets=document.getElementById('targets'); 
	var deletes=document.getElementById('deletes'); 
	var d1=document.getElementById('usertalk_'+to); 
	var d2=document.getElementById('targets_'+to); 
	var d3=document.getElementById('deletes_'+to);
	usertalk.removeChild(d1); 
	targets.removeChild(d2); 
	deletes.removeChild(d3); 
	for(var i=0;i<talking.length;i++){
	if(talking[i]==to){
	talking.splice(i,1);
	}
	}
	if(talking[0]){
	changediv(talking[0]);
	}else{
		$("#show").html('');
		$("#talkWinow").hide();
	}
	
} 
$(document).ready(function(){

  $(window).keydown(function(e){
  
	if(e.keyCode == 13){
      $("#confirm").click();
    }
  });
  var socket = io.connect('http://10.22.7.171:3002');
  	from=$("#from").val();
  	socket.emit('online',{from:from});
  	socket.emit('subscribe',{from:from,room:'group1'});

  	$("#member").blur(function(){
		group.unshift({"name":$("#member").val(),"type":'new'});
		$("#groupshow").append($("#member").val()+'、'); 
  });

	$("#all").click(function(){
		 Today = new Date(); 
		 var NowHour = Today.getHours(); 
		 var NowMinute = Today.getMinutes();
	     if(message.length>0){	 
	    	 for(i=0;i<message.length;i++){
	 	    	if(talking.indexOf(message[i].from) ==-1){
	 	    		talking.unshift(message[i].from);
	 	    		 $("#usertalk").append('<div id=\''+'usertalk_'+message[i].from+'\' style=\'height:350px;width:300px; margin-top:20px;position: absolute;overflow:scroll;overflow-x:hidden; border:1px solid #F00;\'></div>');
	 	    		 $("#targets").append('<div id=\''+'targets_'+message[i].from+'\' style="margin-top:10px;margin-left:10px;" onclick="changediv(\''+message[i].from+'\')">' + message[i].from +'</div>');
	 	    		 $("#deletes").append('<div id=\''+'deletes_'+message[i].from+'\' style="margin-top:10px" onclick="deletediv(\''+message[i].from+'\')">x</div>');
	 	    	}
	 	     $("#"+'usertalk_'+message[i].from).append('<div align="right"><div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+message[i].time+'</br>'+message[i].content+'</div> </div>');
	 	     }
				$("#talkWinow").show();//显示聊天框 
				changediv(message[0].from);
			 }
		 if(groupmessage.length>0){
			   for(var n=0;n<groupmessage.length;n++){
		    		if(grouptalking.indexOf('group1')==-1){
		    			grouptalking.unshift('group1');	 
		    		}
		    	 $("#lines").append('<div align="right"><div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+groupmessage[n].time+'</br>'+groupmessage[n].content+'</div> </div>');
			   }
			 	room='group1';
			    $("#groupTalkWinow").show();//显示群聊天框  
			    $("#groupshow").html(room+':'+'123、'+'234、'+'15900、'+'15964');
			    group.unshift({"name":'123',"type":'new'});
			    group.unshift({"name":'234',"type":'new'});
			    group.unshift({"name":'15900',"type":'new'});
			    group.unshift({"name":'15964',"type":'new'});
			 }
		//如果点击，清除数组
		message.splice(0,message.length);
		groupmessage.splice(0,groupmessage.length);
		$("#showInfo").hide();
		$("#show2").hide();
		$("#showgroup").hide();
	 });
	socket.on('logout',function(data){
		alert('您的账号在别处登录，请重新登录！');
		window.location.href="/logout";
	});
	socket.on('message',function(data){
		Today = new Date(); 
		var NowHour = Today.getHours(); 
		var NowMinute = Today.getMinutes(); 
		//如果是上线推送提醒消息
		if(data.alert){
			for(var i=0;i<data.alert.length;i++){
			if(data.alert[i].to&&data.alert[i].to!=''){
			message.unshift(data.alert[i]);
			}
			if(data.alert[i].groupid&&data.alert[i].groupid!=''){
			groupmessage.unshift(data.alert[i]);
			}
			}
			if(message.length>0){
				$('#showInfo').show();
				$("#title").show();
				$("#show2").html('共有'+message.length+'条私聊消息').show();		
			}
			if(groupmessage.length>0){
				$('#showInfo').show();
				$("#title").show();
				$("#showgroup").html('共有'+groupmessage.length+'条群消息').show();
			}
	    }
		//判断是私聊消息
		if(data.to&&data.to!=''){
		if(talking.indexOf(data.from)==-1){
			message.unshift(data);
			if(message.length>0){
			$('#showInfo').show();
			$("#title").show();
			$("#show2").html('共有'+message.length+'条私聊消息').show();
			}
		}
		if(talking.indexOf(data.from)!=-1){
		  $("#"+'usertalk_'+to).append('<div align="right"><div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+NowHour+':'+NowMinute+'</br>'+data.content+'</div> </div>');
		}
		var e=document.getElementById('usertalk_'+to);
		e.scrollTop=e.scrollHeight; 
		}
		//判断是群聊消息
		if(data.room&&data.room!=''){
		if(grouptalking.indexOf(data.room)==-1){
			groupmessage.unshift(data);
			if(groupmessage.length>0){
				$('#showInfo').show();
				$("#title").show();
				$("#showgroup").html('共有'+groupmessage.length+'条群消息').show();
		}
		}
		if(grouptalking.indexOf(data.room)!=-1){
		 $("#lines").append('<div align="right"><div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+'<div align="left">'+data.from+':'+'</div>'+NowHour+':'+NowMinute+'</br>'+data.content+'</div> </div>');
		}
		var e=document.getElementById("lines");
		e.scrollTop=e.scrollHeight;  
		}
		//私聊历史消息
		if(data.history){
		if(a%2==1){
		$("#"+'usertalk_'+to).html('');
		for(var i=0;i<data.history.length;i++){
			if(data.history[i].from!=from){
			$("#"+'usertalk_'+to).prepend('<div align="right"><div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+data.history[i].time+'</br>'+data.history[i].content+'</div> </div>');
			}
			if(data.history[i].from==from){
			$('#'+'usertalk_'+to).prepend('<div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+data.history[i].time+'</br>'+data.history[i].content+'</div> ');
		}}
		var e=document.getElementById('usertalk_'+to);
		e.scrollTop=e.scrollHeight; 
		}
		if(a%2==0){
			$("#"+'usertalk_'+to).html('');
		}}
		//群聊历史消息
		if(data.grouphistory){
		if(b%2==1){
		$("#lines").html('');
		for(var i=0;i<data.grouphistory.length;i++){
			if(data.grouphistory[i].from!=from){
			 $("#lines").prepend('<div align="right"><div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+'<div align="left">'+data.grouphistory[i].from+':'+'</div>'+data.grouphistory[i].time+'</br>'+data.grouphistory[i].content+'</div> </div>');
			}
			if(data.grouphistory[i].from==from){
			$('#lines').prepend('<div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+data.grouphistory[i].time+'</br>'+data.grouphistory[i].content+'</div> ');
		}}
		var e=document.getElementById("lines");
		e.scrollTop=e.scrollHeight;  
		}
		if(b%2==0){
			$("#lines").html('');
		}
		}
	  });
 
  //获取当前时间
  function now(){
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    return time;
  }
  var time=0;
  var timenext=0;
  

  //发话
  $("#confirm").click(function(){
	Today = new Date(); 
	var NowHour = Today.getHours(); 
	var NowMinute = Today.getMinutes(); 
	var NowSecond = Today.getSeconds(); 
	var now=NowHour+':'+NowMinute;
	var mysec = (NowHour*3600)+(NowMinute*60)+NowSecond;
	timenext=mysec;
	if(timenext-time>1){
	time=mysec;
    //获取要发送的信息
	var content = $("#content").val();
	if(content==''){
	alert('发送内容不能为空！');
	return;
	}
	else{
	var to=$('#to').val();
	$('#'+'usertalk_'+to).append('<div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+now+'</br>'+content+'</div> ');
    socket.emit('message',{to:to,from:from,room:room,time:now,content:content,type:'new'});
    //清空输入框并获得焦点
	}}
	else{
	alert('两次发布时间必须大于1秒！！');
	}
  $("#content").val("").focus();
  var e=document.getElementById('usertalk_'+to);
	e.scrollTop=e.scrollHeight;
  });
  //群组发话
  $("#groupconfirm").click(function(){
		Today = new Date(); 
		var NowHour = Today.getHours(); 
		var NowMinute = Today.getMinutes(); 
		var NowSecond = Today.getSeconds(); 
		var now=NowHour+':'+NowMinute;
		var mysec = (NowHour*3600)+(NowMinute*60)+NowSecond;
		timenext=mysec;
		if(timenext-time>1){
		time=mysec;
	  //获取要发送的信息
		var content = $("#groupcontent").val();
		if(content==''){
		alert('请输入任务内容！');
		return;
		}
		else{
		$('#lines').append('<div style="border-style:outset;margin-top:20px;margin-bottom:20px;margin-right:5px;width:150px;word-wrap:break-word;">'+now+'</br>'+content+'</div> ');
	    socket.emit('group',{room:room,from:from,time:now,group:group,room:room,content:content});
	    //清空输入框并获得焦点

		}
		}
		else{
		alert('两次发布时间必须大于1秒！！');
		}
	  $("#groupcontent").val("").focus();
	  var e=document.getElementById("lines");
		e.scrollTop=e.scrollHeight;
	  });
  
    //查看历史记录
  $("#history").click(function(){
	a=a+1;
    socket.emit('history',{to:to,from:from});	
  });
  $("#grouphistory").click(function(){
		b=b+1;
	    socket.emit('history',{room:room});	
   });

	

});
