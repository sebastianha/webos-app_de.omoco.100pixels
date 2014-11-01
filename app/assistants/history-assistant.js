function HistoryAssistant() {
}

HistoryAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible: true,
		items: [
			{ label: $L("About"), command: 'about' },
			{ label: $L("Help"), command: 'tutorial' },
		]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	var attributes = {};
	this.model = {
		//backgroundImage : 'images/glacier.png',
		background: 'black',
		onLeftFunction : this.wentLeft.bind(this),
		onRightFunction : this.wentRight.bind(this)
	}
	this.controller.setupWidget('historydiv', attributes, this.model);
	this.myPhotoDivElement = $('historydiv');
	
	this.timestamp = new Date().getTime();
	
	var env = Mojo.Environment.DeviceInfo;
	if (env.screenHeight <= 400)
		this.myPhotoDivElement.style.height = "372px";
}

HistoryAssistant.prototype.wentLeft = function(event){
	this.timestamp = this.timestamp - (1000*60*60*24);
	var timenow = new Date(this.timestamp);
	var timenowstring = "";
	var Ayear = timenow.getUTCFullYear();
	var Amonth = timenow.getUTCMonth()+1;
	if(Amonth.toString().length < 2)
		Amonth = "0" + Amonth;
	var Aday = timenow.getUTCDate();
	if(Aday.toString().length < 2)
		Aday = "0" + Aday;
	/*var Ahours = timenow.getUTCHours();
	if(Ahours.toString().length < 2)
		Ahours = "0" + Ahours;*/
	Ahours = "00";

	if (this.timestamp > 1276146000000) {
		if (this.timestamp > 1276146000000 + (1000 * 60 * 60 * 24)) {
			this.myPhotoDivElement.mojo.leftUrlProvided("http://100ps.omoco.de/100pixels/history/" + Ayear + Amonth + (Aday - 1) + Ahours + ".png");
		}
		this.myPhotoDivElement.mojo.centerUrlProvided("http://100ps.omoco.de/100pixels/history/" + Ayear + Amonth + (Aday) + Ahours + ".png");
		this.myPhotoDivElement.mojo.rightUrlProvided("http://100ps.omoco.de/100pixels/history/" + Ayear + Amonth + (Aday + 1) + Ahours + ".png");
	}
	$('text').innerHTML = "<center>Histoy Of Pixels&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;" + Ayear + " / " + Amonth + " / " + Aday + "</center>";
}

HistoryAssistant.prototype.wentRight = function(event){
	this.timestamp = this.timestamp + (1000*60*60*24);
	var timenow = new Date(this.timestamp);
	var timenowstring = "";
	var Ayear = timenow.getUTCFullYear();
	var Amonth = timenow.getUTCMonth()+1;
	if(Amonth.toString().length < 2)
		Amonth = "0" + Amonth;
	var Aday = timenow.getUTCDate();
	if(Aday.toString().length < 2)
		Aday = "0" + Aday;
	/*var Ahours = timenow.getUTCHours();
	if(Ahours.toString().length < 2)
		Ahours = "0" + Ahours;*/
	Ahours = "00";

	if (this.timestamp < new Date().getTime()) {
		this.myPhotoDivElement.mojo.leftUrlProvided("http://100ps.omoco.de/100pixels/history/" + Ayear + Amonth + (Aday - 1) + Ahours + ".png");
		this.myPhotoDivElement.mojo.centerUrlProvided("http://100ps.omoco.de/100pixels/history/" + Ayear + Amonth + (Aday) + Ahours + ".png");
		if (this.timestamp + (1000*60*60*24) < new Date().getTime()) {
			this.myPhotoDivElement.mojo.rightUrlProvided("http://100ps.omoco.de/100pixels/history/" + Ayear + Amonth + (Aday + 1) + Ahours + ".png");
		}
	}
	$('text').innerHTML = "<center>Histoy Of Pixels&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;" + Ayear + " / " + Amonth + " / " + Aday + "</center>";
}

HistoryAssistant.prototype.activate = function(event) {
	var timenow = new Date(this.timestamp);
	var timenowstring = "";
	var Ayear = timenow.getUTCFullYear();
	var Amonth = timenow.getUTCMonth()+1;
	if(Amonth.toString().length < 2)
		Amonth = "0" + Amonth;
	var Aday = timenow.getUTCDate();
	if(Aday.toString().length < 2)
		Aday = "0" + Aday;
	/*var Ahours = timenow.getUTCHours();
	if(Ahours.toString().length < 2)
		Ahours = "0" + Ahours;*/
	Ahours = "00";

	this.myPhotoDivElement.mojo.leftUrlProvided("http://100ps.omoco.de/100pixels/history/" + Ayear + Amonth + (Aday-1) + Ahours + ".png");
	this.myPhotoDivElement.mojo.centerUrlProvided("http://100ps.omoco.de/100pixels/history/" + Ayear + Amonth + (Aday) + Ahours + ".png");
	//this.myPhotoDivElement.mojo.rightUrlProvided("http://100ps.omoco.de/100pixels/history/" + Ayear + Amonth + (Aday+1) + Ahours + ".png");
	
	$('text').innerHTML = "<center>Histoy Of Pixels&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;" + Ayear + " / " + Amonth + " / " + Aday + "</center>";
}

HistoryAssistant.prototype.deactivate = function(event) {
}

HistoryAssistant.prototype.cleanup = function(event) {
}

HistoryAssistant.prototype.handleCommand = function(event){
    if(event.type == Mojo.Event.command) {	
		switch (event.command) {
			case 'about':
				Mojo.Controller.stageController.pushScene("about");
				break;
			case 'tutorial':
				this.controller.showAlertDialog({
					onChoose: function(value) {},
					title:"Help",
					message:"This is the history of all pixels user have every created. Every night there is made a new snapshot.<br><br>Flip the image left or right to go through the history. Zoom into the image for more details.",
					allowHTMLMessage: true,
					choices:[ {label:'OK', value:'OK', type:'color'} ]
				});
				break;
		}
	}
}