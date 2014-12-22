function pad(num, size) {
    var s = num+"";
    while (s.length < size) 
    	s = "0" + s;
    return s;
}

function SimulationViewModel (canvasId) {
	var intervalId = -1;
	this.n = ko.observable(500);
	this.num_iters = ko.observable(500);
	this.density = ko.observable(0.5);
	this.rules = ko.observable(184);

	function paint(matrix, id, width, height) {
		var canvas = document.getElementById(id);

		canvas.width = width;
		canvas.height = height;
		canvas.style.width = 2*width + 'px';
		canvas.style.height = 2*height +'px';

		var ctx = canvas.getContext('2d');

		var imageData = ctx.getImageData(0, 0, width, height);
		var data = imageData.data;

		var i = width;
		while (i--) {
			var j = height;
			while (j--) {
				var index = (j * width + i) * 4;
				var point = (1-matrix[j * width + i]);
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
			density = this.density();
		
		var num = pad(parseInt(this.rules()).toString(2),8);
		var rules = {"111" : parseInt(num[0]), "110" : parseInt(num[1]), "101" : parseInt(num[2]), "100" : parseInt(num[3]), 
			"011" : parseInt(num[4]), "010" : parseInt(num[5]), "001" : parseInt(num[6]), "000" : parseInt(num[7])};
	
		var matrix = cellular1d(n, num_iters, density, rules);
		paint(matrix, canvasId, n, num_iters);
	};
};

ko.applyBindings(new SimulationViewModel("canvasSimulation"));