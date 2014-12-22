function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


function SimulationViewModel () {
	var intervalId = -1;
	this.n = ko.observable(10);
	this.num_iters = ko.observable(2);
	this.density = ko.observable(0.5);
	this.vmax = ko.observable(2);
	this.p = ko.observable(0.2);

	

	function paint(matrix, id, width, height) {
		var canvas = document.getElementById(id);

		canvas.width = width;
		canvas.height = height;

		var ctx = canvas.getContext('2d');

		var imageData = ctx.getImageData(0, 0, width, height);
		var data = imageData.data;

		var i = width;
		while (i--) {
			var j = height;
			while (j--) {
				var index = (j * width + i) * 4;
				var point = matrix[j * width + i] < 0 ? 0 : 1;
				data[index]   = point*255;	// red
			    data[++index] = point*255;	// green
			    data[++index] = point*255;	// blue
			    data[++index] = 255;	// alpha
			}
		}
		ctx.putImageData(imageData, 0, 0);

	}

	this.draw = function() {
		var n = this.n(),
			num_iters = this.num_iters(),
			density = this.density(),
			vmax = this.vmax(),
			p = this.p();
		

		var matrix = nagel(n, num_iters, density, vmax, p);
		paint(matrix, "canvasSimulation", n, num_iters);

	};
	


};

ko.applyBindings(new SimulationViewModel());