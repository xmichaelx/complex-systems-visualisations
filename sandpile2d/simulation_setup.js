function SimulationViewModel () {
	var intervalId = -1;
	this.condensationType = ko.observable("bottom");
	this.pixelSize = ko.observable(5);
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
	function paint(matrix, data, width, height, pixelSize) {
		var x = matrix.width;
		while (x--) {
			var y = matrix.height;
			while (y--) {
				var point = (4 - matrix.field[y * matrix.width + x]) / 4;

				for (var dy=0;dy<pixelSize;dy++) {
					for (var dx=0;dx<pixelSize;dx++) {
						var index = ((pixelSize*y + dy) * width + (pixelSize*x + dx)) * 4;
				
						data[index]   = point*255;	// red
					    data[++index] = point*255;	// green
					    data[++index] = point*255;	// blue
					    data[++index] = 255;	// alpha
					}
				}
			}
		}
	}


	this.startSimulation = function() {
		var pixelSize = this.pixelSize();

		var width = this.canvasWidth();
		var height = this.canvasHeight();
		var canvasWidth = width * pixelSize;
		var canvasHeight = height * pixelSize;

		var iterations = this.iterations();

		var canvas = document.getElementById("canvasSimulation");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		var ctx = canvas.getContext('2d');
		
		var field = createField(width, height);

		var imageData = ctx.getImageData(0, 0, canvasWidth,canvasHeight);
		if (intervalId > -1) {
			clearInterval(intervalId);
		}
		var sizes = {};
		function step() {
			var substeps = 10;
			while(substeps--) {
				updateAllParticles(field,sizes);
			}
			
			paint(field, imageData.data, canvasWidth, canvasHeight, pixelSize);
			
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