//Ajax global configuration
$.ajaxSetup({
	timeout:28000
}) 

var systemParams={
	webServicesPath:'http://restauranttickets.cloudfoundry.com/service'
	//webServicesPath:'http://192.168.0.192:8080/restaurantTickets/service'
}

var model={
	
}

function getModel(){
	var data=localStorage['model'];
	if (data != null){
		model=JSON.parse(data);
	}
	console.log('getModel:'+JSON.stringify(model));
}

function saveModel(){
	localStorage['model']=JSON.stringify(model);
}

document.addEventListener('deviceready',function(){
	console.log('!!!!!!!!!!!!!!!!!Phonegap framework initialized.........');
	document.addEventListener('pause',function(){
		console.log("Saving the model");
		saveModel();
	});
	document.addEventListener('backbutton',function(){
		console.log("Saving the model");
		saveModel();
		localStorage.clear();
		navigator.app.exitApp();
	});
	getModel();
	//alert(model.username);
	if (model.username){
		$.mobile.changePage('home.html');
	}
	else{
		$.mobile.changePage('login.html');
	}
});


function blockUI(){
	$.blockUI({
		message:'<img src="./images/ajax-loader.gif" />',
		css:{
			border:'0px solid black',
			width:'0px',
			height:'0px',
			left:'45%',
			opacity:1
		}
	})
	
}

function unblockUI(){
	$.unblockUI();
}

function alert(message){
	navigator.notification.alert(message,function(){},'MENSAJE DEL SISTEMA','ACEPTAR');
}

function launchExecution(params,saveCredentials){
	$.ajax({
		url:systemParams.webServicesPath+"/launchExecution",
		data:params,
		type:'POST',
		cache:false,
		success:function(data){
			console.log("launchExecution:"+JSON.stringify(data,null,5));
			setTimeout(function(){
				checkFinishedExecution(data['execution_id'],saveCredentials, params);
			},1000);
			
		},
		error:function(jqxhr,status,errorMsg){
			console.log(status+":"+errorMsg);
			alert(errorMsg);
			unblockUI(); 
		},
		complete:function(){
			
		}
	})
}

function checkFinishedExecution(executionId,saveCredentials, params){
	$.ajax({
		url:systemParams.webServicesPath+"/getData",
		data:"executionId="+executionId,
		type:'POST',
		dataType:'json',
		cache:false,
		success:function(data){
			console.log("getData:"+JSON.stringify(data,null,5));
			if (data['status_code'] == 200){
				if (saveCredentials) {
					model.username=params['username'];
					model.password=params['password'];
					$.mobile.changePage('home.html');
				}
				unblockUI(); 
			}
			else if (data['status_code'] == 201){
				alert('Los credenciales no son válidos');
				unblockUI(); 
			}
			
			else if (data['status_code'] == 202){
				setTimeout(function(){
					checkFinishedExecution(executionId, saveCredentials, params)
				},5000);
			}
			
		}
	})
}