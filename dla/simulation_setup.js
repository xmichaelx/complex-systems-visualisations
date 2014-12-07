var intervalId = -1;

function stopSimulation() {
	if (intervalId > -1) {
		clearInterval(intervalId);
	}
}

function startSimulation() {
	var cond = document.querySelector('input[name="optradio"]:checked').value;


    var density = parseFloat(document.getElementById("particleDensity").value);
    var width = parseInt(document.getElementById("canvasWidth").value);
    var height = parseInt(document.getElementById("canvasHeight").value);
    var particleCount = Math.floor(width * height * density);
    var stoppingFraction = parseFloat(document.getElementById("stoppingFraction").value);



	var canvas = resizeCanvas(width, height);
	var field = createField(width, height);
	var particles = createParticles(field, particleCount);

	condensation[cond](field);
	resetAllParticles(particles,field);


	if (intervalId > -1) {
		clearInterval(intervalId);
	}

	intervalId = setInterval(function() {
		for (var i = 0;i < 4;i++) {
			updateAllParticles(particles, field);
		}
		
		paint(field, canvas, particles, "FF0000","00FF00");

		var idle = 0;
		for (var i =0;i<particles.count;i++) {
			idle += particles.stuck[i];
		}

		if (idle > stoppingFraction * particles.count) {
			stopSimulation();
			paint(field, canvas, particles, "FF000FF","00FFFF");

		}

	} , 33);
}


document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("start_simulation").onclick = startSimulation;
    document.getElementById("stop_simulation").onclick = stopSimulation;
});