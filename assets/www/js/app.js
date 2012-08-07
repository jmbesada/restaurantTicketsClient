//Ajax global configuration
$.ajaxSetup({
	contentType:'application/json',
	timeout:28000
}) 

var systemParams={
	webServicesPath:'http://restauranttickets.cloudfoundry.com/service'
}

var model={
	
}

function getModel(){
	var data=localStorage['model'];
	if (data != null){
		model=JSON.parse(data);
	}
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