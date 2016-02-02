
document.addEventListener('DOMContentLoaded', function Simon(){
			//handles to the interface elements
			var gameBody = document.getElementById('container');
			var score = document.getElementById('score');
			var lcd = document.getElementById('lcd');
			var strictButton = document.getElementById('strictButton');
			var restartButton = document.getElementById('restartButton');
			var strictLabel = document.getElementById('strictLabel');

			//solve this length pattern to win
			var winNumber = 20;

			//position the gameBody
			gameBody.style.top = ((window.innerHeight - gameBody.offsetHeight +
				score.offsetHeight)/2).toString() + 'px';
			gameBody.style.left = ((window.innerWidth - gameBody.offsetWidth)/2).toString() + 'px';

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
			var isStrict = false; //whether or not the game is in 'strict' mode

			//resets the game
			restartButton.addEventListener('click', function() {
				pattern = [];
				playNextRound();
			});

			//toggle strict mode and style button to show state
			strictButton.addEventListener('click', function() {
				isStrict = !isStrict;
				strictButton.style['background-color'] = 
					(isStrict) ? '#ffc733' : 'orange'; 
				strictLabel.style.color = 
					(isStrict) ? 'yellow' : 'black';
			});

			//used when the message bar pauses the action -
			//at the beginning of a new game
			score.addEventListener('click', function() {
				score.style.top = '0';
				score.style['pointer-events'] = 'none';
				//give the bar time to float up before playing the pattern
				window.setTimeout(playNextRound, defaultTimeOut); 
			});
			
			//builds the functions of the 4 main buttons
			function initButton(element, soundElement, number) {
				element.addEventListener('click', function(){
					soundElement.currentTime = 0;
					soundElement.play();
					guess = number;
					allowMouse(false);
					testGuess();
				});
			}

			//give a message and wait for user click to start
			function greet(message) { 
				allowMouse(false); 
				gameBody.className = '';
				score.style['pointer-events'] = 'auto';
				score.style.top = '49vh';
				changeText(score, (message || "Click here to begin!"));	
			}

			//tests the user's guess after each turn
			function testGuess() {
				//the player has guessed correctly
				if (guess == pattern[turn]) { 
						turn++;

						//the player has completed this pattern
						if (turn == pattern.length) {

							//the player has won
							if (pattern.length === winNumber) { 
								turn = 0;
								pattern = [];
								window.setTimeout(greet.bind(null, 'VICTORY! Click to start again.'),
										defaultTimeOut );
							}

							//the player hasn't won, build on the pattern
							else {
								turn = 0;
								window.setTimeout(playNextRound, defaultTimeOut );
							}

						}
						//the current pattern isn't complete yet
						else allowMouse(true); 
				}
				//the player guessed incorrectly
				else lose();
			}

			//enables or disables user clicks
			function allowMouse(bool) { 
				var arr = document.getElementsByClassName('pushable');
				for (var i = 0; i < arr.length; i++)
					arr[i].style['pointer-events'] = (bool) ? 'auto' : 'none';
			}
			
			//shakes the gameBody and starts either replays the pattern
			//or starts over, depending on strict state
			function lose() {
				gameBody.className += ' animated shake';	
				turn = 0;

				//in strict mode
				if (isStrict) {
					pattern = [];
					window.setTimeout(greet.bind(null, 'Click here to start over.'), defaultTimeOut );
				}

				//not in strict mode
				else {
					window.setTimeout(playSequence, defaultTimeOut * 2.5, defaultTimeOut, pattern);
				}
			}

			//fires off a chain of setTimeouts to the buttons
			//based on seq to play a pattern
			function playSequence(timeOut, seq) {
				gameBody.className = '';
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

			//adds a random color to the pattern and plays it
			//also updates the lcd
			function playNextRound() {
				pattern.push(Math.floor(Math.random()*4));
				lcd.textContent = pattern.length;
				playSequence(defaultTimeOut, pattern);
			}

			//helper function to change innerText
			function changeText(elem, text){
				if (elem.innerText) elem.innerText = text
				else elem.textContent = text;
			}
			
			//sets up and starts the game running
			function begin() {
				initButton(buttons['red'], document.getElementById('redSound'), 0);
				initButton(buttons['blue'], document.getElementById('blueSound'), 1);
				initButton(buttons['yellow'], document.getElementById('yellowSound'), 3);
				initButton(buttons['green'], document.getElementById('greenSound'), 2);
				greet();
			}

		begin();
	});



