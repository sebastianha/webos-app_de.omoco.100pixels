function EditAssistant(params) {
	this.which = params.which;
}

EditAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible: true,
		items: [
			{ label: $L("About"), command: 'about' },
			{ label: $L("Help"), command: 'tutorial' },
			{ label: $L("Clear Pixels"), command: 'clear' }
		]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	this.pixelColors = new Array();
	this.pixelColors[0] = new Array();
	this.pixelColors[1] = new Array();
	this.pixelColors[2] = new Array();
	for (var i = 0; i < 100; i++) {
		this.pixelColors[0][i] = "255";
		this.pixelColors[1][i] = "255";
		this.pixelColors[2][i] = "255";
	}
	
	this.pixelsdiv =            this.controller.document.getElementsByName("pixel");
	this.pixelsdivtopleft =     this.controller.document.getElementsByName("topleftpixel");
	this.pixelsdivtop =         this.controller.document.getElementsByName("toppixel");
	this.pixelsdivtopright =    this.controller.document.getElementsByName("toprightpixel");
	this.pixelsdivleft =        this.controller.document.getElementsByName("leftpixel");
	this.pixelsdivright =       this.controller.document.getElementsByName("rightpixel");
	this.pixelsdivbottomleft =  this.controller.document.getElementsByName("bottomleftpixel");
	this.pixelsdivbottom =      this.controller.document.getElementsByName("bottompixel");
	this.pixelsdivbottomright = this.controller.document.getElementsByName("bottomrightpixel");
	
	this.lastPixel = 0;
	this.pixelsdiv[this.lastPixel].style.borderColor = "#ff0000";
	this.currentRed = 255;
	this.currentGreen = 255;
	this.currentBlue = 255;
	
	this.spinnerAttrs = {spinnerSize: 'large'};
	this.spinnerModel = {spinning: true};
	this.controller.setupWidget('waiting_spinner2', this.spinnerAttrs, this.spinnerModel);
	
	this.spinnerAttrs2 = {spinnerSize: 'large'};
	this.spinnerModel2 = {spinning: true};
	this.controller.setupWidget('waiting_spinner4', this.spinnerAttrs2, this.spinnerModel2);
	
	this.slider_red_attributes = {
		modelProperty:	'value'
		,minValue:		0
		,maxValue:		255
		,round:			true
		,updateInterval: 0.1
	    };
	this.slider_red_model = {
		value : 255
		,width: 0
	}
	this.controller.setupWidget('slider-red', this.slider_red_attributes, this.slider_red_model);
	this.slider_red_propertyChanged = this.slider_red_propertyChanged.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('slider-red'),Mojo.Event.propertyChange,this.slider_red_propertyChanged);
	
	this.slider_green_attributes = {
		modelProperty:	'value'
		,minValue:		0
		,maxValue:		255
		,round:			true
		,updateInterval: 0.1
	    };
	this.slider_green_model = {
		value : 255
		,width: 0
	}
	this.controller.setupWidget('slider-green', this.slider_green_attributes, this.slider_green_model);
	this.slider_green_propertyChanged = this.slider_green_propertyChanged.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('slider-green'),Mojo.Event.propertyChange,this.slider_green_propertyChanged);
	
	this.slider_blue_attributes = {
		modelProperty:	'value'
		,minValue:		0
		,maxValue:		255
		,round:			true
		,updateInterval: 0.1
	    };
	this.slider_blue_model = {
		value : 255
		,width: 0
	}
	this.controller.setupWidget('slider-blue', this.slider_blue_attributes, this.slider_blue_model);
	this.slider_blue_propertyChanged = this.slider_blue_propertyChanged.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('slider-blue'),Mojo.Event.propertyChange,this.slider_blue_propertyChanged);
	
	for (var i = 0; i < this.pixelsdiv.length; i++) {
		this.controller.listen(this.pixelsdiv[i], Mojo.Event.tap, this.handlePixelButtonPressed.bind(this, i));
	}
	
	this.controller.listen("save", Mojo.Event.tap, this.handleSaveButtonPressed.bind(this));
	this.controller.listen("toggle", Mojo.Event.tap, this.handleToggleButtonPressed.bind(this));
	
	Mojo.Event.listen(this.controller.sceneElement, Mojo.Event.keydown, this.keypress.bind(this));
	
	var url = "http://100ps.omoco.de/100pixels/getmy.php?nduid=" + MYNDUID + this.which + "&premium=1";
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.Request2Success.bind(this),
		onFailure: this.Request2Failure.bind(this)
	});
}

EditAssistant.prototype.keypress = function(event) {
	//Mojo.Log.error(event.originalEvent.keyCode);
	// REGFBV
	if (event.originalEvent.keyCode == 82) {
		this.slider_red_model.value++;
	} else if (event.originalEvent.keyCode == 69) {
		this.slider_red_model.value--;
	} else if (event.originalEvent.keyCode == 71) {
		this.slider_green_model.value++;
	} else if (event.originalEvent.keyCode == 70) {
		this.slider_green_model.value--;
	} else if (event.originalEvent.keyCode == 66) {
		this.slider_blue_model.value++;
	} else if (event.originalEvent.keyCode == 86) {
		this.slider_blue_model.value--;
	
	} else if (event.originalEvent.keyCode == 87) {
		this.slider_red_model.value-=10;
	} else if (event.originalEvent.keyCode == 84) {
		this.slider_red_model.value+=10;
	} else if (event.originalEvent.keyCode == 68) {
		this.slider_green_model.value-=10;
	} else if (event.originalEvent.keyCode == 72) {
		this.slider_green_model.value+=10;
	} else if (event.originalEvent.keyCode == 67) {
		this.slider_blue_model.value-=10;
	} else if (event.originalEvent.keyCode == 78) {
		this.slider_blue_model.value+=10;
	
	} else if (event.originalEvent.keyCode == 81) {
		this.slider_red_model.value=0;
	} else if (event.originalEvent.keyCode == 89) {
		this.slider_red_model.value=255;
	} else if (event.originalEvent.keyCode == 83) {
		this.slider_green_model.value=0;
	} else if (event.originalEvent.keyCode == 74) {
		this.slider_green_model.value=255;
	} else if (event.originalEvent.keyCode == 88) {
		this.slider_blue_model.value=0;
	} else if (event.originalEvent.keyCode == 77) {
		this.slider_blue_model.value=255;
	}

	this.controller.modelChanged(this.slider_red_model);
	this.currentRed = this.slider_red_model.value;
	$('slider-red-text').innerText = this.slider_red_model.value + " / " + this.slider_red_model.value.toString(16).toUpperCase();
	this.controller.modelChanged(this.slider_green_model);
	this.currentGreen = this.slider_green_model.value;
	$('slider-green-text').innerText = this.slider_green_model.value + " / " + this.slider_green_model.value.toString(16).toUpperCase();
	this.controller.modelChanged(this.slider_blue_model);
	this.currentBlue = this.slider_blue_model.value;
	$('slider-blue-text').innerText = this.slider_blue_model.value + " / " + this.slider_blue_model.value.toString(16).toUpperCase();

	
	this.refreshPixelColor();
}

EditAssistant.prototype.handleSaveButtonPressed = function(event){
	$('waiting_spinner3').style.display = "block";
	
	var data = "";
	for(var i = 0; i<100; i++) {
		data += this.createColor(this.pixelColors[0][i], this.pixelColors[1][i], this.pixelColors[2][i]) + ";";
	}

	var url = "http://100ps.omoco.de/100pixels/put.php?nduid=" + MYNDUID + this.which + "&data=" + data + "&premium=1";
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.RequestSuccess.bind(this),
		onFailure: this.RequestFailure.bind(this)
	});
}

EditAssistant.prototype.handleToggleButtonPressed = function(event){
	var newopacity = 0.4;
	if(this.pixelsdivtopleft[0].style.opacity == "" || this.pixelsdivtopleft[0].style.opacity == 0.4)
		newopacity = 1.0;
	else if(this.pixelsdivtopleft[0].style.opacity == 1.0)
		newopacity = 0.0;
	else
		newopacity = 0.4;

	for (var i = 0; i < 6; i++) {
		this.pixelsdivtopleft[i].style.opacity = newopacity;
	}
	for (var i = 0; i < 20; i++) {
		this.pixelsdivtop[i].style.opacity = newopacity;
	}
	for (var i = 0; i < 6; i++) {
		this.pixelsdivtopright[i].style.opacity = newopacity;
	}
	for (var i = 0; i < 30; i++) {
		this.pixelsdivleft[i].style.opacity = newopacity;
	}
	for (var i = 0; i < 30; i++) {
		this.pixelsdivright[i].style.opacity = newopacity;
	}
	for (var i = 0; i < 6; i++) {
		this.pixelsdivbottomleft[i].style.opacity = newopacity;
	}
	for (var i = 0; i < 20; i++) {
		this.pixelsdivbottom[i].style.opacity = newopacity;
	}
	for (var i = 0; i < 6; i++) {
		this.pixelsdivbottomright[i].style.opacity = newopacity;
	}
}

EditAssistant.prototype.RequestSuccess = function(resp) {
	if (resp.responseText == "spam_detection") {
		this.controller.showAlertDialog({
			onChoose: function(value){
				Mojo.Controller.stageController.popScene()
			},
			title: "Spam Detection",
			message: "Your request has been detected as spam. Please wait some minutes then try again.",
			allowHTMLMessage: true,
			choices: [{ label: 'OK', value: 'OK', type: 'color'	}]
		});
	} else {
		UPDATEMYPIXEL = this.tmpupdatemypixel;
		Mojo.Controller.stageController.popScene();
	}
	
}

EditAssistant.prototype.RequestFailure = function(resp) {
	Mojo.Controller.errorDialog("Error");
}

EditAssistant.prototype.Request2Success = function(resp) {
	if (resp.responseText == "spam_detection") {
		this.controller.showAlertDialog({
			onChoose: function(value) {
				Mojo.Controller.stageController.popScene()
			},
			title:"Spam Detection",
			message:"Your request has been detected as spam. Please wait some minutes then try again.",
			allowHTMLMessage: true,
			choices:[ {label:'OK', value:'OK', type:'color'} ]
		});
	} else {
		var url = "http://100ps.omoco.de/100pixels/getaround.php?nduid=" + MYNDUID + this.which;
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'false',
			onSuccess: this.Request3Success.bind(this),
			onFailure: this.Request3Failure.bind(this)
		});
		
		var colors = resp.responseText.split(";");
		for(var i = 0; i < 100; i++) {
			this.pixelColors[0][i] = parseInt((colors[i][0] + colors[i][1]), 16);
			this.pixelColors[1][i] = parseInt((colors[i][2] + colors[i][3]), 16);
			this.pixelColors[2][i] = parseInt((colors[i][4] + colors[i][5]), 16);
			
			this.pixelsdiv[i].style.borderColor = "#" + this.createColor(this.pixelColors[0][i], this.pixelColors[1][i], this.pixelColors[2][i]); 
			this.pixelsdiv[i].style.backgroundColor = "#" + this.createColor(this.pixelColors[0][i], this.pixelColors[1][i], this.pixelColors[2][i]);
		}
		
		this.tmpupdatemypixel = colors[100];
		
		if(colors[101] == "1") {
			this.controller.showAlertDialog({
				onChoose: function(value) {},
				title:"First Time",
				message:"This is the first time you edit your pixels. You got your individual space on the large image which you can edit as often you want.<br><br>If you do not edit your pixels for a longer time they will be deleted and you have to create new pixels. If you want to keep your pixels just edit them from time to time.",
				allowHTMLMessage: true,
				choices:[ {label:'OK', value:'OK', type:'color'} ]
			});
		}
		
		this.lastPixel = 0;
		this.pixelsdiv[this.lastPixel].style.borderColor = "#ff0000";
		this.currentRed = this.pixelColors[0][this.lastPixel];
		this.currentGreen = this.pixelColors[1][this.lastPixel];
		this.currentBlue = this.pixelColors[2][this.lastPixel];
		
		this.slider_red_model.value = this.pixelColors[0][this.lastPixel];
		this.controller.modelChanged(this.slider_red_model);
		this.slider_green_model.value = this.pixelColors[1][this.lastPixel];
		this.controller.modelChanged(this.slider_green_model);
		this.slider_blue_model.value = this.pixelColors[2][this.lastPixel];
		this.controller.modelChanged(this.slider_blue_model);
		
		$('slider-red-text').innerText = this.pixelColors[0][this.lastPixel] + " / " + this.pixelColors[0][this.lastPixel].toString(16).toUpperCase();
		$('slider-green-text').innerText = this.pixelColors[1][this.lastPixel] + " / " + this.pixelColors[1][this.lastPixel].toString(16).toUpperCase();
		$('slider-blue-text').innerText = this.pixelColors[2][this.lastPixel] + " / " + this.pixelColors[2][this.lastPixel].toString(16).toUpperCase();
	}
}

EditAssistant.prototype.Request2Failure = function(resp) {
	Mojo.Controller.errorDialog("Error");
}

EditAssistant.prototype.Request3Success = function(resp) {
	var colors = resp.responseText.split(";");
	//Mojo.Log.error(colors);
	
	for (var i = 0; i < 6; i++) {
		this.pixelsdivtopleft[i].style.backgroundColor = "#" + colors[i];
	}
	for (var i = 0; i < 20; i++) {
		this.pixelsdivtop[i].style.backgroundColor = "#" + colors[i+6];
	}
	for (var i = 0; i < 6; i++) {
		this.pixelsdivtopright[i].style.backgroundColor = "#" + colors[i+26];
	}
	for (var i = 0; i < 30; i++) {
		this.pixelsdivleft[i].style.backgroundColor = "#" + colors[i+32];
	}
	for (var i = 0; i < 30; i++) {
		this.pixelsdivright[i].style.backgroundColor = "#" + colors[i+62];
	}
	for (var i = 0; i < 6; i++) {
		this.pixelsdivbottomleft[i].style.backgroundColor = "#" + colors[i+92];
	}
	for (var i = 0; i < 20; i++) {
		this.pixelsdivbottom[i].style.backgroundColor = "#" + colors[i+98];
	}
	for (var i = 0; i < 6; i++) {
		this.pixelsdivbottomright[i].style.backgroundColor = "#" + colors[i+118];
	}
	
	$('waiting_spinner').style.display = "none";
}

EditAssistant.prototype.Request3Failure = function(resp) {
	Mojo.Controller.errorDialog("Error");
}

EditAssistant.prototype.handlePixelButtonPressed = function(event) {
	this.pixelsdiv[this.lastPixel].style.borderColor = "#" + this.createColor(this.currentRed, this.currentGreen, this.currentBlue);
	
	this.pixelColors[0][this.lastPixel] = this.currentRed;
	this.pixelColors[1][this.lastPixel] = this.currentGreen;
	this.pixelColors[2][this.lastPixel] = this.currentBlue;
	
	this.lastPixel = $A(arguments)[0];
	
	this.pixelsdiv[this.lastPixel].style.borderColor = "#ff0000";
	
	this.slider_red_model.value = this.pixelColors[0][this.lastPixel];
	this.controller.modelChanged(this.slider_red_model);
	this.slider_green_model.value = this.pixelColors[1][this.lastPixel];
	this.controller.modelChanged(this.slider_green_model);
	this.slider_blue_model.value = this.pixelColors[2][this.lastPixel];
	this.controller.modelChanged(this.slider_blue_model);
	
	$('slider-red-text').innerText = this.pixelColors[0][this.lastPixel] + " / " + this.pixelColors[0][this.lastPixel].toString(16).toUpperCase();
	$('slider-green-text').innerText = this.pixelColors[1][this.lastPixel] + " / " + this.pixelColors[1][this.lastPixel].toString(16).toUpperCase();
	$('slider-blue-text').innerText = this.pixelColors[2][this.lastPixel] + " / " + this.pixelColors[2][this.lastPixel].toString(16).toUpperCase();
	
	this.currentRed = this.pixelColors[0][this.lastPixel];
	this.currentGreen = this.pixelColors[1][this.lastPixel];
	this.currentBlue = this.pixelColors[2][this.lastPixel];
}

EditAssistant.prototype.slider_red_propertyChanged = function(event) {
	this.currentRed = event.value;
	$('slider-red-text').innerText = event.value + " / " + event.value.toString(16).toUpperCase();
	this.refreshPixelColor();
}

EditAssistant.prototype.slider_green_propertyChanged = function(event) {
	this.currentGreen = event.value;
	$('slider-green-text').innerText = event.value + " / " + event.value.toString(16).toUpperCase();
	this.refreshPixelColor();
}

EditAssistant.prototype.slider_blue_propertyChanged = function(event) {
	this.currentBlue = event.value;
	$('slider-blue-text').innerText = event.value + " / " + event.value.toString(16).toUpperCase();
	this.refreshPixelColor();
}

EditAssistant.prototype.refreshPixelColor = function() {
	this.pixelColors[0][this.lastPixel] = this.currentRed;
	this.pixelColors[1][this.lastPixel] = this.currentGreen;
	this.pixelColors[2][this.lastPixel] = this.currentBlue;
	this.pixelsdiv[this.lastPixel].style.backgroundColor = "#" + this.createColor(this.currentRed, this.currentGreen, this.currentBlue);
	
}

EditAssistant.prototype.createColor = function(r, g, b){
	var red = parseInt(r).toString(16).toUpperCase();
	if(red.length < 2)
		red = "0" + red;
	var green = parseInt(g).toString(16).toUpperCase();
	if(green.length < 2)
		green = "0" + green;
	var blue = parseInt(b).toString(16).toUpperCase();
	if(blue.length < 2)
		blue = "0" + blue;

	return red + green + blue;
}

EditAssistant.prototype.activate = function(event) {
}

EditAssistant.prototype.deactivate = function(event) {
}

EditAssistant.prototype.cleanup = function(event) {
}

EditAssistant.prototype.clearPixels = function(value){
	if (value) {
		for(var i = 0; i < 100; i++) {
			this.pixelColors[0][i] = 255;
			this.pixelColors[1][i] = 255;
			this.pixelColors[2][i] = 255;
			
			this.pixelsdiv[i].style.borderColor = "#" + this.createColor(this.pixelColors[0][i], this.pixelColors[1][i], this.pixelColors[2][i]); 
			this.pixelsdiv[i].style.backgroundColor = "#" + this.createColor(this.pixelColors[0][i], this.pixelColors[1][i], this.pixelColors[2][i]);
		}
		
		this.lastPixel = 0;
		this.pixelsdiv[this.lastPixel].style.borderColor = "#ff0000";
		this.currentRed = this.pixelColors[0][this.lastPixel];
		this.currentGreen = this.pixelColors[1][this.lastPixel];
		this.currentBlue = this.pixelColors[2][this.lastPixel];
		
		this.slider_red_model.value = this.pixelColors[0][this.lastPixel];
		this.controller.modelChanged(this.slider_red_model);
		this.slider_green_model.value = this.pixelColors[1][this.lastPixel];
		this.controller.modelChanged(this.slider_green_model);
		this.slider_blue_model.value = this.pixelColors[2][this.lastPixel];
		this.controller.modelChanged(this.slider_blue_model);
		
		$('slider-red-text').innerText = this.pixelColors[0][this.lastPixel] + " / " + this.pixelColors[0][this.lastPixel].toString(16).toUpperCase();
		$('slider-green-text').innerText = this.pixelColors[1][this.lastPixel] + " / " + this.pixelColors[1][this.lastPixel].toString(16).toUpperCase();
		$('slider-blue-text').innerText = this.pixelColors[2][this.lastPixel] + " / " + this.pixelColors[2][this.lastPixel].toString(16).toUpperCase();
	}
}

EditAssistant.prototype.handleCommand = function(event){
    if(event.type == Mojo.Event.command) {	
		switch (event.command) {
			case 'about':
				Mojo.Controller.stageController.pushScene("about");
				break;
			case 'tutorial':
				this.controller.showAlertDialog({
					onChoose: function(value) {},
					title:"Help",
					message:"Here are your 100 pixels. Click a pixel to select it and then use the sliders to change the color.<br><br>Click \"Save Pixels\" to save your 100 pixels. Use the Back-Gesture to cancel.<br><br>You can use the keyboard to adjust the color. Additional to the displayed keys try to push \"q,w,t,y,s,d,h,j,x,c,n,m\".",
					allowHTMLMessage: true,
					choices:[ {label:'OK', value:'OK', type:'color'} ]
				});
				break;
			case 'clear':
				var answer = this.controller.showAlertDialog({
					onChoose: this.clearPixels.bind(this),
					title:"Clear Pixels",
					message:"Really clear all Pixels?",
					allowHTMLMessage: true,
					choices:[ {label:'Yes', value:true, type:'negative'}, {label:'Cancel', value:false, type:'color'} ]
				});
				break;
		}
	}
}