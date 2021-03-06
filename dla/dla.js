// create field of given width and height
// field is a boolean array, since we can't have we used the smallest available typed array
function createField(width, height) {
	return { field: new Uint8Array(width * height), width:width, height:height};
}

// different points to which our particles will stick
var condensation = {
	center : function(field) {// center occupied
		field.field[Math.floor(field.width / 2) + Math.floor(field.height / 2) * field.width] = 1;
	},
	bottom : function(field) { // bottom line  occupied
		var i = field.width;
		while (i--) {
			field.field[i + (field.height-1) * field.width] = 1;
		}
	},
	corner : function(field) {// top left occuppied
		field.field[1 + 1 * field.width] = 1;
	}
};

// create data structure for storing particles
function createParticles(field, particleCount) {
	return { 
		x: new Uint16Array(particleCount), 
		y: new Uint16Array(particleCount), 
		stuck: new Uint8Array(particleCount), 
		count: particleCount
	};
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
	var i = particles.count;
	while (i--) 
		resetSingleParticle(particles, field, i);
}

// check if particle is now neighbour with stuck particle
function alone(particles, field, i) {
	var cx = particles.x[i], cy = particles.y[i];
	var lx = cx - 1, rx = cx + 1;
	var ty = cy - 1, by = cy + 1;

	if (cx <= 0 || cx >= field.width ||  lx <= 0 || lx >= field.width || 
		rx <= 0 || rx >= field.width ||  cy <= 0 || cy >= field.height || 
		ty <= 0 || ty >= field.height || by <= 0 || by >= field.height) {
		return true;
	}
		
	cy *= field.width;     
	by *= field.width;     
	ty *= field.width;

	if (field.field[cx + ty] || field.field[lx + cy] || field.field[rx + cy] || field.field[cx + by]) {
		return false;
	}

	if (field.field[lx + ty] || field.field[lx + by] ||  field.field[rx + ty] || field.field[rx + by]) {
		return false;
	}

	return true;
}

// random walk step for a single particle
function updateSingleParticle(particles,field, i) {
	var x = particles.x[i] + (Math.random() > 0.5 ? 1 : -1);
	var y = particles.y[i] + (Math.random() > 0.5 ? 1 : -1);

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

// random walk step for all particles
function updateAllParticles(particles, field) {
	var i = particles.count;
	while (i--) {
		if (particles.stuck[i] == 0) {
			updateSingleParticle(particles, field, i);
		}
	}	
}