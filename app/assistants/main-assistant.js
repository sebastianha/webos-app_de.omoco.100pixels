function MainAssistant() {
}

var UPDATEMYPIXEL = 0;

MainAssistant.prototype.setup = function() {
	var cookie = new Mojo.Model.Cookie("Prefs");
	var prefs = cookie.get();
	if(prefs != null) {
	} else {
		cookie.put({
			firsttime: true
		});
		
		this.controller.showAlertDialog({
			onChoose: function(value) {},
			title:"First Start",
			message:"This is the first use of this app. At the main screen will load all the pixels other users have created.<br><br>If you click \"Edit my Pixels\" you will get your own pixels to fill. Try to work together with you neighbors to create a large image.",
			allowHTMLMessage: true,
			choices:[ {label:'OK', value:'OK', type:'color'} ]
		});
	}
	
	this.loadingImages = false;
	
	this.appMenuModel = {
		visible: true,
		items: [
			{ label: $L("About"), command: 'about' },
			{ label: $L("Help"), command: 'tutorial' },
			{ label: $L("Highlight My Pixels"), command: 'showmy', disabled: true },
			{ label: $L("Reload All Pixels"), command: 'reload', disabled: true },
			{ label: $L("Request New Pixels"), command: 'requestnew' },
			{ label: $L("History Of Pixels"), command: 'history' }
		]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	this.commandMenuAttributes = {};
	this.commandMenuModel = {
		items: [
		{
			label: 'Edit my Pixels',
			//command: 'edit',
			//disabled: false
			submenu:'category-menu'
		}, {
			items: [
				{
					label: 'Reset',
					command: 'zoom_reset',
					disabled: true
				}, {
					label: 'Zoom In',
					command: 'zoom_in',
					disabled: true
				}
			]
		}
		]
	};
	this.controller.setupWidget(
		Mojo.Menu.commandMenu, 
		this.commandMenuAttributes,
		this.commandMenuModel
	);	
	
	this.categoryMenuModel = { 
		label: $L('Category'), 
		items: [
			{label: $L('Standard Pixels'), command:'standard'}, 
			{label: $L('Pro Pixels 1'), command:'propixels1' }, 
			{label: $L('Pro Pixels 2'), command:'propixels2'} 
		]};
	
	this.controller.setupWidget('category-menu', undefined, this.categoryMenuModel);	
			  
	this.imageCounter = 0;
	this.zoomValue = 1;
	
	this.controller.setupWidget("scrollerId",
		this.attributes = {
			mode: 'horizontal'
		},
		this.model = {
			snapElements: {}
        }
    ); 
	
	this.progressattr = {
		title: 'bob',
		image: 'stuff'
	};
	this.progressmodel = {
		value: 0,
		disabled : false
	};
	this.controller.setupWidget('progressbarId', this.progressattr, this.progressmodel);
	
	var url = "http://100ps.omoco.de/100pixels/get.php";
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.RequestSuccess.bind(this),
		onFailure: this.RequestFailure.bind(this)
	});
	
	//this.controller.listen("proversion", Mojo.Event.tap, this.proClicked.bind(this));
}

/*MainAssistant.prototype.proClicked = function(event){
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
		method: "open",
		parameters: {
			id: "com.palm.app.findapps",
			params: {
				target: "http://developer.palm.com/webChannel/index.php?packageid=de.omoco.100pixels.pro"
			}
		}
	})
}*/

MainAssistant.prototype.RequestSuccess = function(resp) {
	this.imageCounter = parseInt(resp.responseText);
	
	this.reload();
}

MainAssistant.prototype.loadImage = function(imageNumber, refresh) {
	var tenorless = 32;
	
	for(var i = 0; i < 32; i++) {
		if (imageNumber + i <= this.imageCounter) {
			var el = document.createElement('img');
			if(refresh)
				el.src = "http://100ps.omoco.de/100pixels/pixels/" + (imageNumber + i) + ".png#" + Math.random();
			else
				el.src = "http://100ps.omoco.de/100pixels/pixels/" + (imageNumber + i) + ".png";
			el.id = "pixels_" + (imageNumber + i);
			el.width = this.zoomValue * 10;
			el.height = this.zoomValue * 10;
			$('drawarea').appendChild(el);
		} else {
			tenorless = i;
			break;
		}
	}

	//Mojo.Event.listen(this.controller.get("pixels_" + (imageNumber+tenorless-1)),"load",this.imageLoaded.bind(this, (imageNumber+32), refresh));
	Mojo.Event.listen(this.controller.get("pixels_" + (imageNumber+tenorless-1)),"load",this.imageLoadedAssistant.bind(this, (imageNumber+32), refresh));
}

MainAssistant.prototype.imageLoadedAssistant = function(event){
	this.imageLoaded.bind(this, ($A(arguments)[0]), $A(arguments)[1]).delay(0.1);
}

MainAssistant.prototype.imageLoaded = function(event){
	//$('debug').innerText = "Loaded " + $A(arguments)[0] + " / " + this.imageCounter;
	
	this.progressmodel.value = $A(arguments)[0] / this.imageCounter;
	this.controller.modelChanged(this.progressmodel);
	
	if ($A(arguments)[0] <= this.imageCounter && this.loadingImages) 
		this.loadImage($A(arguments)[0], $A(arguments)[1]);
	else {
		//$('debug').innerText = "Loading done";
		$('progressbarId').style.display = "none";
		this.loadingImages = false;
		this.commandMenuModel.items[1].items[0].disabled = false;
		this.commandMenuModel.items[1].items[1].disabled = false;
		this.controller.modelChanged(this.commandMenuModel);
		this.appMenuModel.items[2].disabled = false;
		this.appMenuModel.items[3].disabled = false;
		this.controller.modelChanged(this.appMenuModel);
	}
}

MainAssistant.prototype.reload = function() {
	if (!this.loadingImages) {
		$('drawarea').style.width = (this.zoomValue * 320) + "px";
		
		$('drawarea').innerHTML = "";
		
		this.progressmodel.value = 0.0;
		this.controller.modelChanged(this.progressmodel);
		$('progressbarId').style.display = "block";
		
		this.loadingImages = true;
		this.commandMenuModel.items[1].items[0].disabled = true;
		this.commandMenuModel.items[1].items[1].disabled = true;
		this.controller.modelChanged(this.commandMenuModel);
		this.appMenuModel.items[2].disabled = true;
		this.appMenuModel.items[3].disabled = true;
		this.controller.modelChanged(this.appMenuModel);
		
		this.loadImage(1, true);
	}
}

MainAssistant.prototype.showmy = function(){
	var url = "http://100ps.omoco.de/100pixels/getmyid.php?nduid=" + MYNDUID;
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.RequestSuccess2.bind(this),
		onFailure: this.RequestFailure2.bind(this)
	});
}

MainAssistant.prototype.RequestSuccess2 = function(resp) {
	this.myid = parseInt(resp.responseText.split(";")[0]);
	this.myid1 = parseInt(resp.responseText.split(";")[1]);
	this.myid2 = parseInt(resp.responseText.split(";")[2]);
	
	if (this.myid != -1 || this.myid1 != -1 || this.myid2 != -1) {
		this.blinkCounter = 1;
		
		if(this.myid != -1)
			$('pixels_' + this.myid).src = "images/blink.png";
		if(this.myid1 != -1)
			$('pixels_' + this.myid1).src = "images/blink.png";
		if(this.myid2 != -1)
			$('pixels_' + this.myid2).src = "images/blink.png";
		
		this.blinkMyPixels.bind(this).delay(0.5);
	} else {
		this.controller.showAlertDialog({
			onChoose: function(value) {},
			title:"You Have No Pixels Yet",
			message:"At the moment you do not own any pixels. Click \"Edit my Pixels\" to get your pixels.",
			allowHTMLMessage: true,
			choices:[ {label:'OK', value:'OK', type:'color'} ]
		});
	}
}

MainAssistant.prototype.blinkMyPixels = function(resp){
	if (this.blinkCounter % 2 == 0) {
		if(this.myid != -1)
			$('pixels_' + this.myid).src = "images/blink.png";
		if(this.myid1 != -1)
			$('pixels_' + this.myid1).src = "images/blink.png";
		if(this.myid2 != -1)
			$('pixels_' + this.myid2).src = "images/blink.png";
	}
	else {
		if(this.myid != -1)
			$('pixels_' + this.myid).src = "http://100ps.omoco.de/100pixels/pixels/" + this.myid + ".png";
		if(this.myid1 != -1)
			$('pixels_' + this.myid1).src = "http://100ps.omoco.de/100pixels/pixels/" + this.myid1 + ".png";
		if(this.myid2 != -1)
			$('pixels_' + this.myid2).src = "http://100ps.omoco.de/100pixels/pixels/" + this.myid2 + ".png";
	}
	
	this.blinkCounter++;
	
	if(this.blinkCounter < 20)
		this.blinkMyPixels.bind(this).delay(0.5);
}

MainAssistant.prototype.RequestFailure2 = function(resp) {
	Mojo.Controller.errorDialog("Error");
}

MainAssistant.prototype.requestnew = function() {
	var answer = this.controller.showAlertDialog({
		onChoose: this.requestnewanswer.bind(this),
		title:"Request new Pixels",
		message:"If you think your pixels are perfect and you want to get a new place to paint you can request new pixels.<br><br>Please note that you will not be able to edit your old pixels again and I will decide on my own if you will get them.",
		allowHTMLMessage: true,
		choices:[ {label:'Request New Pixels', value:true, type:'affirmative'}, {label:'Cancel', value:false, type:'negative'} ]
	});
}

MainAssistant.prototype.requestnewanswer = function(value) {
	if (value) {
		var answer = this.controller.showAlertDialog({
			onChoose: this.requestnewanswer2.bind(this),
			title:"Which Pixels",
			message:"Which Pixels do you want to request for?",
			allowHTMLMessage: true,
			choices:[ {label:'Standard', value:""}, {label:'Pro Pixels 1', value:"_1"}, {label:'Pro Pixels 2', value:"_2"}, {label:'Cancel', value:"cancel", type:'negative'} ]
		});
	}
}

MainAssistant.prototype.requestnewanswer2 = function(value) {
	if (value != "cancel") {
		var url = "http://100ps.omoco.de/100pixels/requestnew.php?nduid=" + MYNDUID + value;
		var request = new Ajax.Request(url, {
			method: 'get',
			evalJSON: 'false',
			onSuccess: this.RequestSuccess3.bind(this),
			onFailure: this.RequestFailure3.bind(this)
		});
	}
}

MainAssistant.prototype.RequestSuccess3 = function(resp){
	this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:"New Pixels Requested",
		message:"Request for new pixels sent. It can take some days/weeks until your request is beeing processed. Your can check it by editing your pixels. If you see new ones you had success. Good luck.",
		allowHTMLMessage: true,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}

MainAssistant.prototype.RequestFailure3 = function(resp) {
	Mojo.Controller.errorDialog("Error");
}

MainAssistant.prototype.zoomIn = function() {
	this.zoomValue++;
	
	$('drawarea').style.width = (this.zoomValue * 320) + "px";
	
	for(var i = 1; i <= this.imageCounter; i++) {
		$("pixels_" + i).height = this.zoomValue * 10;
		$("pixels_" + i).width = this.zoomValue * 10;
	}
}

MainAssistant.prototype.zoomReset = function() {
	this.zoomValue = 1;
	
	$('drawarea').style.width = (this.zoomValue * 320) + "px";
	
	$('scrollerId').mojo.scrollTo(0, 0);
	
	this.controller.getSceneScroller().mojo.scrollTo(0,0);
	
	for(var i = 1; i <= this.imageCounter; i++) {
		$("pixels_" + i).height = this.zoomValue * 10;
		$("pixels_" + i).width = this.zoomValue * 10;
	}
}

MainAssistant.prototype.zoomOut = function() {
	if(this.zoomValue > 1)
		this.zoomValue--;
	
	$('drawarea').style.width = (this.zoomValue * 320) + "px";
	
	$('scrollerId').mojo.scrollTo(0, 0);
	
	for(var i = 1; i <= this.imageCounter; i++) {
		$("pixels_" + i).height = this.zoomValue * 10;
		$("pixels_" + i).width = this.zoomValue * 10;
	}
}

MainAssistant.prototype.RequestFailure = function(resp) {
	Mojo.Controller.errorDialog("Error");
}

MainAssistant.prototype.activate = function(event) {
	if (UPDATEMYPIXEL > this.imageCounter) {
		this.imageCounter++;
		var el = document.createElement('img');
		el.src = "http://100ps.omoco.de/100pixels/pixels/" + (this.imageCounter) + ".png#" + Math.random();
		el.id = "pixels_" + (this.imageCounter);
		el.width = this.zoomValue * 10;
		el.height = this.zoomValue * 10;
		$('drawarea').appendChild(el);
	} else if (UPDATEMYPIXEL != 0) {
		$('pixels_' + UPDATEMYPIXEL).src = "http://100ps.omoco.de/100pixels/pixels/" + UPDATEMYPIXEL + ".png#" + Math.random();
	}
}

MainAssistant.prototype.deactivate = function(event) {
}

MainAssistant.prototype.cleanup = function(event) {
}

MainAssistant.prototype.handleCommand = function(event){
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'edit':
				//Mojo.Controller.stageController.pushScene("edit");
				break;
			case 'zoom_in':
				this.zoomIn();
				break;
			case 'zoom_reset':
				this.zoomReset();
				break;
			case 'zoom_out':
				this.zoomOut();
				break;
		}
	}
	
	if(event.type == Mojo.Event.command) {	
		switch (event.command) {
			case 'about':
				Mojo.Controller.stageController.pushScene("about");
				break;
			case 'tutorial':
				this.controller.showAlertDialog({
					onChoose: function(value) {},
					title:"Help",
					message:"This is the main screen. At the top you see all pixelblocks ever created by users. To add or edit you own 100 pixels click \"Edit my Pixels\".<br><br>Use the buttons on the right to zoom in or to reset. Choose \"Highlight My Pixels\" from the menu to highlight your 100 pixels.",
					allowHTMLMessage: true,
					choices:[ {label:'OK', value:'OK', type:'color'} ]
				});
				break;
			case 'showmy':
				this.showmy();
				break;
			case 'reload':
				this.reload();
				break;
			case 'requestnew':
				this.requestnew();
				break;
			case 'history':
				Mojo.Controller.stageController.pushScene("history");
				break;
		}
	}
	
	if(event.type == Mojo.Event.command) {
		switch(event.command)
		{
			case 'standard':
				Mojo.Controller.stageController.pushScene("edit", {which: ""});
				break;
			case 'propixels1':
				Mojo.Controller.stageController.pushScene("edit", {which: "_1"});
				break;
			case 'propixels2':
				Mojo.Controller.stageController.pushScene("edit", {which: "_2"});
				break;
		}
	}
}
