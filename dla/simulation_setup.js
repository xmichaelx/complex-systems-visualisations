function SimulationViewModel () {
	var intervalId = -1;
	this.condensationType = ko.observable("bottom");
	this.canvasWidth = ko.observable(500);
	this.canvasHeight = ko.observable(500);
	this.density = ko.observable(0.15);
	this.stoppingfraction = ko.observable(0.25);

	this.stopSimulation = function () {
		clearInterval(intervalId);
	};

	this.startSimulation = function() {
		var ctx = resizeCanvas(this.canvasWidth(), this.canvasHeight()).getContext('2d');
		var field = createField(this.canvasWidth(), this.canvasHeight());

		var particleCount = Math.floor(this.canvasWidth() * this.canvasHeight() * this.density());
		var particles = createParticles(field, particleCount);

		condensation[this.condensationType()](field);
		resetAllParticles(particles,field);

		if (intervalId > -1) {
			clearInterval(intervalId);
		}

		var stopSimulation = this.stopSimulation;
		var stoppingFraction = this.stoppingfraction();

		intervalId = setInterval(function() {
			for (var i = 0;i < 4;i++) {
				updateAllParticles(particles, field);
			}
			
			paint(field, ctx, particles, "FF0000","00FF00");

			var idle = 0;
			var i = particles.count;
			while (i--) {
				idle += particles.stuck[i];
			}

			if (idle > stoppingFraction * particles.count) {
				stopSimulation();
				paint(field, ctx, particles, "FF000FF","00FFFF");

			}

		} , 1000 / 30); // 30 FPS
	};
};

ko.applyBindings(new SimulationViewModel());