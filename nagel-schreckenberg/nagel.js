function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function nagel(n, num_iters, density, vmax, p) {
	var positive = Math.floor(n*density);
	var negative = n - positive;
	var initial = [];
	while(positive--) {
		initial.push(0);
	}
	while(negative--) {
		initial.push(-1);
	}
	initial = shuffle(initial);

	var matrix = new Int8Array(n * num_iters);
	for (var i = 0;i<n;i++) {
		matrix[i] = initial[i];
	}

	for (var i = 1;i<num_iters;i++) {
		var prevOffset = (i-1) * n, currentOffset = i * n;
		
		for (var j = 0;j<n;j++) {
			matrix[currentOffset + j] = -1;	
		}
		console.log(matrix.subarray(prevOffset, currentOffset));
		for (var j = 0;j<n;j++) {
			if (matrix[prevOffset + j] > -1) {
				var vi = matrix[prevOffset + j];
				var d = 1;
				while (matrix[prevOffset + ((j + d) % n)] < 0) 
					d++;

				var vtemp = Math.min(vi+1, d-1, vmax);
				var v = Math.random() < p ? Math.max(vtemp - 1, 0) : vtemp;
				matrix[currentOffset + ((j+v)%n)] = v;
			}
		}
	}

	return matrix;
}