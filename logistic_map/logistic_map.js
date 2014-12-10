function linspace(start, end, length) {
	var dx = (end - start) / (length - 1);

	var array = new Float32Array(length);
	var i = length;
	while(i--)
		array[i] = start + dx * i;

	return array;
}

function logistic(x,r) {
	return r*x*(1-x);
}

function logistic_equation(r, x, iters) {
	var ys = new Float32Array(iters);
	var i = iters;
	while (i--)
		x = logistic(x,r);

	i = iters;
	while (i--) {
		x = logistic(x,r);
		ys[i] = x;
	}
	
	return ys;
}

function logistic_map(start, end, length, x, iters) {
	var xs = linspace(start, end, length);

	var ys = [];
	var i = xs.length;
	while (i--) {
		var r = xs[i];
		ys.push(logistic_equation(r, x, iters));
	}
	ys.reverse();

	return { x: xs, y:ys, length:length, start:start, end:end};
}


	