function linspace(start, end, length) {
	var dx = (end - start) / (length - 1);

	var array = new Float32Array(length);
	var i = length;
	while(i--)
		array[i] = start + dx * i;

	return array;
}

function logistic_equation(r, x, iters) {
	var ys = new Float32Array(iters);
	var i = iters;
	while (i--)
		x = r*x*(1-x);

	i = iters;
	while (i--) {
		x = r*x*(1-x);
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

function paint(logistic_map, id, width, height) {
	var canvas = document.getElementById(id);
	canvas.width = width;
	canvas.height = height;

	var ctx = canvas.getContext('2d');
	var imageData = ctx.getImageData(0, 0, width, height);
	var data = imageData.data;

	var i = logistic_map.length;
	while (i--) {
		var x = Math.round((logistic_map.x[i] - logistic_map.start) / (logistic_map.end- logistic_map.start) * width) - 1;
		var ys = logistic_map.y[i];
		var j = ys.length;
		while (j--) {
			var y = Math.round((1 - ys[j]) * height);
			var index = (y * width + x) * 4;
			data[index]   = 0;	// red
		    data[++index] = 0;	// green
		    data[++index] = 0;	// blue
		    data[++index] = 255;	// alpha
		}
	}

	ctx.putImageData(imageData, 0, 0);

}


	