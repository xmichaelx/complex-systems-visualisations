function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function cellular1d(n, num_iters, density, rules) {
	var positive = Math.floor(n*density);
	var negative = n - positive;
	var initial = [];
	while(positive--) {
		initial.push(1);
	}
	while(negative--) {
		initial.push(0);
	}
	initial = shuffle(initial);

	var matrix = new Uint8Array(n * num_iters);
	for (var i = 0;i<n;i++) {
		matrix[i] = initial[i];
	}

	for (var i = 1;i<num_iters;i++) {
		var prevOffset = (i-1) * n, currentOffset = i * n;
		
		// left-most item
		var str = "" + matrix[currentOffset-1] + matrix[prevOffset] + matrix[prevOffset + 1];

		matrix[currentOffset] = rules[str]

		for (var j = 1;j<n-1;j++) {
			var str = "" + matrix[prevOffset + j-1] + matrix[prevOffset + j] +matrix[prevOffset + j+1];
			matrix[currentOffset + j] = rules[str]
		}

		// right-most item
		var str = "" + matrix[currentOffset-2] + matrix[currentOffset-1] + matrix[prevOffset];

		matrix[parseInt(currentOffset) + parseInt(n)-1] = rules[str];
	}

	return matrix;
}