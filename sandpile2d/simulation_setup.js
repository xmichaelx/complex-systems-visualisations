function SimulationViewModel () {
	var intervalId = -1;
	this.condensationType = ko.observable("bottom");
	this.canvasWidth = ko.observable(80);
	this.canvasHeight = ko.observable(80);
	this.iterationsLeft = ko.observable(1000);
	this.iterations = ko.observable(1000);

	var that = this;
	var activeColor = [52, 152, 219];
	var stuckColor = [231, 76, 60];

	this.stopSimulation = function () {	
		this.workingSimulation(false);	
	};

	// paint particle positions on a canvas
	function paint(matrix, data) {

		var x = matrix.width;
		while (x--) {
			var y = matrix.height;
			while (y--) {
				var index = (y * matrix.width + x) * 4;
				var point = (4 - matrix.field[y * matrix.width + x]) / 4;
				data[index]   = point*255;	// red
			    data[++index] = point*255;	// green
			    data[++index] = point*255;	// blue
			    data[++index] = 255;	// alpha
			}
		}
	}


	this.startSimulation = function() {
		var width = this.canvasWidth(), height = this.canvasHeight(), iterations = this.iterations();

		var canvas = document.getElementById("canvasSimulation");
		canvas.width = width;
		canvas.height =height;
		var ctx = canvas.getContext('2d');
		
		var field = createField(width, height);

		var imageData = ctx.getImageData(0, 0, field.width, field.height);
		var clearCanvas = new Uint8Array(4*field.width * field.height)
		if (intervalId > -1) {
			clearInterval(intervalId);
		}
		var sizes = {};
		function step() {
			var substeps = 10;
			while(substeps--) {
				updateAllParticles(field,sizes);
			}
			
			paint(field, imageData.data);
			
			ctx.putImageData(imageData, 0, 0);

			that.iterationsLeft(iterations--);
			
			if (iterations > 0) {
				requestAnimationFrame(step);
			}
			else {
				console.log(sizes);
			}
		}

		requestAnimationFrame(step);
	};
};

ko.applyBindings(new SimulationViewModel());