function SimulationViewModel () {
	var intervalId = -1;
	this.canvasWidth = ko.observable(800);
	this.canvasHeight = ko.observable(500);
	this.rmin = ko.observable(2.75);
	this.rmax = ko.observable(4);
	this.x0 = ko.observable(0.1);
	this.rsubdiv = ko.observable(1000);
	this.iterations = ko.observable(500);
	
	function paint(logistic_map, id, width, height) {
		var canvas = document.getElementById(id);
		canvas.width = width;
		canvas.height = height;

		var ctx = canvas.getContext('2d');
		var imageData = ctx.getImageData(0, 0, width, height);
		var data = imageData.data;

		var i = logistic_map.length;
		while (i--) {
			var x = Math.round((logistic_map.x[i] - logistic_map.start) / (logistic_map.end- logistic_map.start) * width) - 1;
			var ys = logistic_map.y[i];
			var j = ys.length;
			while (j--) {
				var y = Math.round((1 - ys[j]) * height);
				var index = (y * width + x) * 4;
				data[index]   = 0;	// red
			    data[++index] = 0;	// green
			    data[++index] = 0;	// blue
			    data[++index] = 255;	// alpha
			}
		}

		ctx.putImageData(imageData, 0, 0);
	}

	this.draw = function() {
		var map = logistic_map(parseFloat(this.rmin()), parseFloat(this.rmax()), parseFloat(this.rsubdiv()), parseFloat(this.x0()), parseFloat(this.iterations()))
		paint( map , "canvasSimulation", this.canvasWidth(), this.canvasHeight());
	};
};

ko.applyBindings(new SimulationViewModel());
