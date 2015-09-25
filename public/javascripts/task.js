
$(document).ready(function(){
  $(window).keydown(function(e){
  
	if(e.keyCode == 13){
      $("#confirm").click();
    }
  });
  var socket = io.connect();
  var from=$('#p_from').html(); 
	socket.emit('online',{user:from});
 
  socket.on('task',function(data){   
  if(data.from!=from){
      $("#linesall").prepend('<div class="RoundedCorner2" style="margin-top:10px;margin-bottom:10px;margin-right:10px"> <c class="rtop"><c class="r1"></c><c class="r2"></c><c class="r3"></c><c class="r4"></c></c>  ' + data.from+ '(' + now() + ')发布了任务：<br/>' + data.content + '</br >'+'任务开始时间：'+data.startday+' '+data.starttime+'</br>'+'任务结束时间：'+data.endday+' '+data.endtime+'</br>'+'任务地点：'+data.place+'</br><c class="rbottom"><c class="r4"></c><c class="r3"></c><c class="r2"></c><c class="r1"></c></c> </div> ');
 }
 if(data.old=='yes'){
	if(data.from==from){
 $('#lines').prepend('<div class="RoundedCorner" style="margin-top:10px;margin-bottom:10px;margin-right:10px"> <b class="rtop"><b class="r1"></b><b class="r2"></b><b class="r3"></b><b class="r4"></b></b>  ' + '您在' + '(' + data.time + ')发布了任务：<br/>' + data.content + '</br >'+'任务开始时间：'+data.startday+' '+data.starttime+'</br>'+'任务结束时间：'+data.endday+' '+data.endtime+'</br>'+'任务地点：'+data.place+'</br><b class="rbottom"><b class="r4"></b><b class="r3"></b><b class="r2"></b><b class="r1"></b></b> </div> ');
 }}

  });

  // 显示在线列表
	var showonline = function(n){
		var html = '';
		n.forEach(function(v){
			html += '<div class="line" onclick="private_message(\'' + v + '\')">' + v + '</div>';
		});
		$('#nicknames').html(html);
	}
	// 刷新在线列表
  socket.on('online', function(ns){
	showonline(ns.userlist);
	
   });

  socket.on('offline', function(ns){
	showonline(ns.userlist);
   });
  //服务器关闭
  socket.on('disconnect',function(){
  showonline(ns);
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
	var mysec = (NowHour*3600)+(NowMinute*60)+NowSecond;
	timenext=mysec;
	if(timenext-time>10){
	time=mysec;
  //获取要发送的信息
	var content = $("#content").val();
	var place= $("#place").val();
    var startday = $("#startday").val();
	var starttime = $("#starttime").val();
	var endday = $("#endday").val();
	var endtime = $("#endtime").val();
	var start=startday+' '+starttime;
	var end=endday+' '+endtime;
	if(content==''){
	alert('请输入任务内容！');
	return;
	}
	if(place==''){
	alert('请输入任务地点！');
	return;
	}
	if(startday==''){
	alert('请输入任务开始日期！');
	return;
	}
	if(starttime==''){
	alert('请输入任务开始时间！');
	return;
	}
	if(endday==''){
	alert('请输入任务结束日期！');
	return;
	}
	if(endtime==''){
	alert('请输入任务结束时间！');
	return;
	}
	else{
	$('#lines').prepend('<div class="RoundedCorner" style="margin-top:10px;margin-bottom:10px;margin-right:10px"> <b class="rtop"><b class="r1"></b><b class="r2"></b><b class="r3"></b><b class="r4"></b></b>  ' + '您在' + '(' + now() + ')发布了任务：<br/>' + content + '</br >'+'任务开始时间：'+startday+' '+starttime+'</br>'+'任务结束时间：'+endday+' '+endtime+'</br>'+'任务地点：'+place+'</br><b class="rbottom"><b class="r4"></b><b class="r3"></b><b class="r2"></b><b class="r1"></b></b> </div> ');
     socket.emit('task',{from:from,content:content,place:place,starttime:starttime,startday:startday,endtime:endtime,endday:endday,old:'no'});
    //清空输入框并获得焦点
    $("#content").val("").focus();
	}}
	else{
	alert('两次发布时间必须大于5秒！！');
	}

  });

	

});
