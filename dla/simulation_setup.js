function SimulationViewModel () {
	var intervalId = -1;
	this.condensationType = ko.observable("bottom");
	this.canvasWidth = ko.observable(800);
	this.canvasHeight = ko.observable(500);
	this.density = ko.observable(0.15);
	this.stoppingfraction = ko.observable(0.25);
	this.workingSimulation = ko.observable(false);
	var activeColor = [52, 152, 219];
	var stuckColor = [231, 76, 60];

	this.stopSimulation = function () {	
		this.workingSimulation(false);	
	};

	// paint particle positions on a canvas
	function paint(field, canvas, particles, stuckColor, activeColor) {
		
		var i = particles.count;
		while (i--) {
	    	var index = (particles.y[i] * field.width + particles.x[i]) * 4;
	    	if (particles.stuck[i]) {
	    		canvas[index]   = stuckColor[0];	// red
		        canvas[++index] = stuckColor[1];	// green
		        canvas[++index] = stuckColor[2];	// blue
	    	}
	    	else {
				canvas[index]   = activeColor[0];	// red
		        canvas[++index] = activeColor[1];	// green
		        canvas[++index] = activeColor[2];	// blue
	    	}	

	        canvas[++index] = 255;	// alpha
		}
	}


	this.startSimulation = function() {
		var width = this.canvasWidth(), height = this.canvasHeight(),
			particleCount = Math.floor(width * height * this.density()),
			stoppingFraction = this.stoppingfraction(),
			condensationType = this.condensationType(),
			that = this;

		var canvas = document.getElementById("canvasSimulation");
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext('2d');
		
		var field = createField(width, height);
		condensation[condensationType](field);

		var particles = createParticles(field, particleCount);
		resetAllParticles(particles,field);
		var imageData = ctx.getImageData(0, 0, field.width, field.height);
		var clearCanvas = new Uint8Array(4*field.width * field.height)
		if (intervalId > -1) {
			clearInterval(intervalId);
		}

		function step() {
			updateAllParticles(particles, field);
			
			imageData.data.set(clearCanvas);
			paint(field, imageData.data, particles, activeColor, stuckColor);
			ctx.putImageData(imageData, 0, 0);
			
			var idle = 0;
			var i = particles.count;
			while (i--) 
				idle += particles.stuck[i];

			if ((idle < stoppingFraction * particles.count) && that.workingSimulation()) {
				requestAnimationFrame(step);
			}
			else {
				imageData.data.set(clearCanvas);
				paint(field, imageData.data, particles, activeColor, stuckColor);
				ctx.putImageData(imageData, 0, 0);
				this.workingSimulation(false);
			}
		}

		this.workingSimulation(true);
		requestAnimationFrame(step);
	};
};

ko.applyBindings(new SimulationViewModel());