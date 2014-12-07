function SimulationViewModel () {
	var intervalId = -1;
	this.canvasWidth = ko.observable(500);
	this.canvasHeight = ko.observable(500);
	this.rmin = ko.observable(2);
	this.rmax = ko.observable(4);
	this.x0 = ko.observable(0.1);
	this.rsubdiv = ko.observable(1000);
	this.iterations = ko.observable(500);
	
	this.draw = function() {
		var map = logistic_map(parseFloat(this.rmin()), parseFloat(this.rmax()), parseFloat(this.rsubdiv()), parseFloat(this.x0()), parseFloat(this.iterations()))
		paint( map , "canvasSimulation", this.canvasWidth(), this.canvasHeight());
	};
};

ko.applyBindings(new SimulationViewModel());
