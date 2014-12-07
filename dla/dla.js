// create field of given width and height
// field is a boolean array, since we can't have we used the smallest available typed array
function createField(width, height) {
	var field = new Uint8Array(width * height);

	return { field: field, width:width, height:height};
}

// different points to which our particles will stick
var condensation = {
	center : function(field) {
		var fcenterX = Math.floor(field.width / 2);
		var fcenterY = Math.floor(field.width / 2);

		// center occupied
		field.field[fcenterX + fcenterY * field.width] = 1;
	},
	bottom : function(field) {
		var fcenterX = Math.floor(field.width / 2);
		var fcenterY = Math.floor(field.height / 2);

		// bottom line  occupied
		for (var i=0;i<field.width;i++) {
			field.field[i + (field.height-1) * field.width] = 1;
		}
	},
	corner : function(field) {
		// top left occuppied
		field.field[1 + 1 * field.width] = 1;
	}
};

// create data structure for storing particles
function createParticles(field, particleCount) {
	var particlesX = new Uint16Array(particleCount);
	var particlesY = new Uint16Array(particleCount);
	var particlesStuck = new Uint8Array(particleCount);

	return { x: particlesX, y:particlesY, stuck: particlesStuck, count: particleCount};
}

// changing postion of a single particle to a random spot on map
function resetSingleParticle(particles, field, i) {
	var x = Math.floor(Math.random() * field.width);
	var y = Math.floor(Math.random() * field.height);

	while(field[y*field.width+x]) {
		x = Math.floor(Math.random() * field.width);
		y = Math.floor(Math.random() * field.height);
	}

	particles.x[i] = x;
	particles.y[i] = y;
}

// changing postion of a all particles to a random spot on map
function resetAllParticles(particles, field) {
	for (var i=0;i<particles.count;i++) {
		resetSingleParticle(particles, field, i);
	}
}

// check if particle is now neighbour with stuck particle
function alone(particles, field, i) {
	var cx = particles.x[i];
	var cy = particles.y[i];

	var lx = cx - 1;
	var rx = cx + 1;
	var ty = cy - 1;
	var by = cy + 1;

	if (cx <= 0 || cx >= field.width || 
		lx <= 0 || lx >= field.width || 
		rx <= 0 || rx >= field.width || 
		cy <= 0 || cy >= field.height || 
		ty <= 0 || ty >= field.height || 
		by <= 0 || by >= field.height) {
		return true;
	}
		
	cy *= field.width;     
	by *= field.width;     
	ty *= field.width;

	if (field.field[cx + ty] ||         
		field.field[lx + cy] ||         
		field.field[rx + cy] ||         
		field.field[cx + by]) {
		return false;
	}

	if (field.field[lx + ty] ||         
		field.field[lx + by] ||         
		field.field[rx + ty] ||         
		field.field[rx + by]) {
		return false;
	}

	return true;
}

// random walk step for a single particle
function updateSingleParticle(particles,field, i) {
	if (particles.stuck[i] == 0) {
		var x = particles.x[i];
		var y = particles.y[i];

		x += Math.random() > 0.5 ? 1 : -1;
		y += Math.random() > 0.5 ? 1 : -1;

		if ( (x < 0) || (y < 0) || (x >= field.width) || (y >= field.height)) {
			resetSingleParticle(particles, field, i);
		}

        particles.x[i] = x;
        particles.y[i] = y;
        
		if (!alone(particles, field, i)) {
			particles.stuck[i] = 1;
			field.field[y*field.width + x] = 1;
		}
	}
}

// random walk step for all particles
function updateAllParticles(particles, field) {
	for (var i = 0;i<particles.count;i++) {
		updateSingleParticle(particles, field, i);
	}
}

// set canvas width and height
function resizeCanvas(width, height) {
	var canvas = document.getElementById("canvasSimulation");
	canvas.width = width;
	canvas.height = height;

	return canvas;
}

// paint particle positions on a canvas
function paint(field, canvas, particles, stuckColor, activeColor) {
	var ctx = canvas.getContext('2d');
	ctx.clearRect ( 0 , 0 , field.width, field.height );
	var imageData = ctx.getImageData(0, 0, field.width, field.height);

	var data = imageData.data;
	var activeR = parseInt(activeColor.substring(0,2),16);
	var activeG = parseInt(activeColor.substring(2,4),16);
	var activeB = parseInt(activeColor.substring(4,6),16);

	var stuckR = parseInt(stuckColor.substring(0,2),16);
	var stuckG = parseInt(stuckColor.substring(2,4),16);
	var stuckB = parseInt(stuckColor.substring(4,6),16);


	var i = particles.count;
	while (i--) {
		var x = particles.x[i];
		var y = particles.y[i];
		var stuck = particles.stuck[i];

    	var index = (y * field.width + x) * 4;
    	var value = stuck ? 0 : 127;
    	if (stuck) {
    		data[index]   = stuckR;	// red
	        data[++index] = stuckG;	// green
	        data[++index] = stuckB;	// blue
    	}
    	else {
			data[index]   = activeR;	// red
	        data[++index] = activeG;	// green
	        data[++index] = activeB;	// blue
    	}	
    	
        data[++index] = 255;	// alpha
	}

	ctx.putImageData(imageData, 0, 0);
}
