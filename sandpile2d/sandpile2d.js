
function createField(width, height) {
	var field = { field: new Uint8Array(width * height), width:width, height:height};

	var total = field.width * field.height;
	// while(total--) {
	// 	field.field[total] = Math.floor(Math.random() * 5);
	// }

	return field;
}

function updateAllParticles(particles, sizes) {
	// random selection
	var x = Math.floor(Math.random() * particles.width ),
		y = Math.floor(Math.random() * particles.height);
	// adding particle
	var size = add(particles,x,y);
	
	if (sizes.hasOwnProperty(size)) {
		sizes[size] += 1
	} else{
		sizes[size] = 1
	}
}


function add(particles, x, y) {
	// position
	var position = x + y * particles.width;
	particles.field[position] += 1;

	if (particles.field[position] >= 4) {
		var avalancheSize = 1;
		particles.field[position] -= 4;
		if (x - 1  > 0) {
			avalancheSize += add(particles, x-1, y);
		}
		if (y - 1  > 0) {
			avalancheSize += 	add(particles, x, y - 1);
		}
		if (x + 1  < particles.width) {
			avalancheSize += 	add(particles, x+1, y);
		}
		if (y + 1  < particles.height) {
			avalancheSize += 	add(particles, x, y+1);
		}
		return avalancheSize;
	}
	else {
		return 0;
	}

}