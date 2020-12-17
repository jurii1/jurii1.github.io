	var IE = document.all?true:false;
	if (!IE) {document.captureEvents(Event.MOUSEMOVE); document.captureEvents(Event.touch}
  	document.onmousemove = position; 
	document.touch = position;

	var noise_active = false;
	
	function array_contains(a, obj) {
	    for (var i = 0; i < a.length; i++) {
	        if (a[i] == obj) {
	            return true;
	        }
	    }
	    return false;
	}

	//Creating the audioContext instance and the oscillator
	var audioContext = new AudioContext();
    var oscillator = audioContext.createOscillator();
	oscillator.start();

  	function position(e){
  		//USER PARAMETERS
		var real_square = 4;						//cellule size
		var square_size = 4;						//square size
		var colors_detected = ["(255;255;255)"];	//colors detected
		var nb_before_noise = 8;					//number of color detected before playing the noise
		
		
		

		//END USER PARAMETERS
		
		var image = document.getElementById("image");
		var detected = 0;
		
		
		
		//current mouse position
		var x = 0;
		var y = 0;
		
		if (IE) { // grab the x-y pos.s if browser is IE
			x = event.clientX + document.body.scrollLeft;
			y = event.clientY + document.body.scrollTop;
		  } else {  // grab the x-y pos.s if browser is NS
			x = e.pageX;
			y = e.pageY;
		  }
		 
		function handleTouchmove(event){
		event.preventDefault(); // we don't want to scroll
		var touch = event.touches[0];

		if(IE){
			var x = touch.clientX + document.body.scrollLeft;
			var y = touch.clientY + document.body.scrollTop;
		}
		else{
			x = event.pageX;
			y = event.pageY;
		}

		
		//draw(x, y);
		}

		//detection square size
		var square_x_min = x - (square_size/2) - image.offsetLeft;
		var square_x_max = x + (square_size/2) - image.offsetLeft;
		var square_y_min = y - (square_size/2) - image.offsetTop;
		var square_y_max = y + (square_size/2) - image.offsetTop;
		 
		if(square_x_min < 0) square_x_min = 0;
		if(square_y_min < 0) square_y_min = 0;
		
		var square_width = square_x_max - square_x_min;
		var square_height = square_y_max - square_y_min;
		
    	//test mouse position
		let mousePos = "(X = " + x + "; Y = " + y+")";
		//document.getElementById("pos").innerHTML = texte;		//for debug
		
		
		
		//image on the mouse
		if(x > image.offsetLeft  && x < image.offsetLeft+image.width && y > image.offsetTop && y < image.offsetTop+image.height){
			document.getElementById("square_border").style.left = (x-3)+'px';
			document.getElementById("square_border").style.top  = (y-3)+'px';
		}
		
		//convert image to canvas for color detection
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.getContext('2d').drawImage(image, 0, 0);
		var color_array = canvas.getContext('2d').getImageData(square_x_min, square_y_min, square_width, square_height).data;
		
		//convert color_array to an string color array
		var str_color_array = new Array();
			// Loop over each pixel and invert the color.
		for (var i = 0, j=0, n = color_array.length; i < n; i += 4,j++) {
			var red 	= 255 - color_array[i  ]; // red
			var green 	= 255 - color_array[i+1]; // green
			var blue 	= 255 - color_array[i+2]; // blue
			// i+3 is alpha (the fourth element)
			str_color_array[j] = "("+red+";"+green+";"+blue+")";
		}
		

		for(var i = 0; i < real_square*real_square; i++){
			//for a square size of 8x8
			/*
			if(	array_contains(colors_detected,str_color_array[i*2]) &&
				array_contains(colors_detected,str_color_array[i*2+1]) &&
				array_contains(colors_detected,str_color_array[i*2+square_size]) &&
				array_contains(colors_detected,str_color_array[i*2+square_size+1])){*/

			//square size of 4x4
			if(array_contains(colors_detected,str_color_array[i])){	
				detected++;
			} 
		}
		
		
		//sound 
		if(detected >= nb_before_noise && detected < 16 && noise_active==false){
			noise_active = true;
			oscillator.connect(audioContext.destination);

		}
		if(detected < nb_before_noise && noise_active){
			noise_active= false;
			oscillator.disconnect(audioContext.destination);
		}

		// debug
		document.getElementById("detected_info").value = mousePos+" detect: "+detected;
		
	}