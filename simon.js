
document.addEventListener('DOMContentLoaded', function Simon(){
			//maps a color name to each button
			var buttons = {'red':document.getElementById('redButton'),
										 'blue':document.getElementById('blueButton'),
										 'green':document.getElementById('greenButton'),
	    				       'yellow':document.getElementById('yellowButton')};
			//maps a number to each color 
			var colors = {0:'red',
									  1:'blue',
										2:'green',
										3:'yellow'};
			//maps a color to each audio object
			var sounds = {'red' : document.getElementById('redSound'),
										'green' : document.getElementById('greenSound'),
										'blue' : document.getElementById('blueSound'),
										'yellow' : document.getElementById('yellowSound')};

			var pattern = []; //stores the pattern of lights
			var defaultTimeOut = 500; //time between lights in ms
			var guess; //holds the current guess
			var turn = 0; //the current guess 'position' 

			var score = document.getElementById('score');

			score.addEventListener('click', function() {
				score.style.top = '0';
				score.style['pointer-events'] = 'none';
				//give the bar time to float up before playing the pattern
				window.setTimeout(playNextRound, defaultTimeOut); 
			});
			
			function initButton(element, soundElement, number) {
				element.addEventListener('click', function(){
					soundElement.currentTime = 0;
					soundElement.play();
					guess = number;
					allowMouse(false);
					testGuess();
				});
			}

			function greet(message) { //give an intro message and wait for user click to start
				allowMouse(false); //user shouldn't push any buttons yet
				score.style['pointer-events'] = 'auto';
				score.style.top = '49vh';
				changeText(score, (message || "Click here to begin!"));	
			}

			function testGuess() {
				if (guess == pattern[turn]) {
					turn++;
					if (turn == pattern.length) {
						turn = 0;
						window.setTimeout(playNextRound, defaultTimeOut );
					}
					//turn mouse back on ONLY when there is more to guess
					else allowMouse(true); 
		    }
				else lose();
			}

			function allowMouse(bool) { //pass a bool to enable or disable clicks
				var arr = document.getElementsByClassName('button');
				for (var i = 0; i < arr.length; i++)
					arr[i].style['pointer-events'] = (bool) ? 'auto' : 'none';
			}
			
			function lose() {
				turn = 0;
				pattern = [];
				window.setTimeout(greet.bind(null, 'Click here for more'), defaultTimeOut );
			}

			function playSequence(timeOut, seq) {
				allowMouse(false);
				changeText(score, 'Watch the pattern...');
				window.setTimeout(function() {
					allowMouse(true);
					changeText(score, 'Your turn...');
				}, timeOut * (seq.length +1));

				for (var i =0; i < seq.length; i++)
				{
					var target = buttons[colors[seq[i]]];
					var sound = sounds[colors[seq[i]]];
					window.setTimeout(function(target, sound, i){
						target.classList.add(colors[seq[i]] + 'On');
						sound.currentTime=0;
						sound.play()
					}, timeOut * i, target, sound, i);


					window.setTimeout(function(target, i){
						target.classList.remove(colors[seq[i]] + 'On');
					}, timeOut * (i+.5) , target, i);
				}
			}

			function playNextRound() {
				pattern.push(Math.floor(Math.random()*4));
				playSequence(defaultTimeOut, pattern);
			}

			function changeText(elem, text){
				if (elem.innerText) elem.innerText = text
				else elem.textContent = text;
			}
			
			function begin() {
				initButton(buttons['red'], document.getElementById('redSound'), 0);
				initButton(buttons['blue'], document.getElementById('blueSound'), 1);
				initButton(buttons['yellow'], document.getElementById('yellowSound'), 3);
				initButton(buttons['green'], document.getElementById('greenSound'), 2);
				greet();
			}

		begin();
	});



