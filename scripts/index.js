$(function() {
	$("#play-button").click(function() {
		Tone.Transport.start();
		$(this).toggleClass("hidden");
		$(".coveringCanvas").removeClass("hidden");
		// $("#stop-button").toggleClass("hidden");
	});

	// $("#stop-button").click(function() {
	// 	Tone.Transport.stop();
	// 	$(this).toggleClass("hidden");
	// 	$(".coveringCanvas").addClass("hidden");
	// 	$("#play-button").toggleClass("hidden");
	// });

	$(".coveringCanvas, .album-text").click(function() {
		 window.open('http://www.flumemusic.com/skin', '_new');
	});
});

var maskContext;
var mask;
var maskVisible = false;
var animationCanvas;
var animationContext;

var masks = [];
var maskLoader = 0;

var glowOutlines = [];
var stage = new PIXI.Container();

function NoRedFilter() {
  var vertexShader = null;
  var fragmentShader = [
    'precision mediump float;',
    '',
    'varying vec2 vTextureCoord;',
    'uniform sampler2D uSampler;',
    '',
    'void main(void)',
    '{',
    '    vec4 pixel = texture2D(uSampler, vTextureCoord);',
    '    float distance = pow(pow((vTextureCoord.x - 0.5), 2.0) + pow((vTextureCoord.y - 0.5), 2.0), 0.5);',
    '    pixel = pixel - (distance * 1.0 * vec4(1.0, 1.0, 1.0, 1.0));',
    // '    pixel.r = 0.0;',
    '    gl_FragColor = pixel;',
    
    '}'
  ].join('\n');
  var uniforms = {};

  PIXI.AbstractFilter.call(this,
    vertexShader,
    fragmentShader,
    uniforms
  );
}

NoRedFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
NoRedFilter.prototype.constructor = NoRedFilter;

var filter = new NoRedFilter();


// var fragmentSrc = [
//     "precision mediump float;",
//     "varying vec2 vTextureCoord;",
//     // "uniform sampler2D uSampler;",
//     "void main(void)",
//     "{",
//     "    vec4 pixel = texture2D(uSampler, vTextureCoord);",
//     // "    float distance = pow(pow((vTextureCoord.x - 0.5), 2.0) + pow((vTextureCoord.y - 0.5), 2.0)), 0.5);",
//     // "    pixel = pixel - (distance * 5.0 * vec4(1.0, 1.0, 1.0, 1.0));",
//     "pixel.r = 1.0",
//     "gl_FragColor = pixel;",
//     "}"
// ].join('\n');

// var vertexSrc =[
// 	"attribute vec4 aPosition;",
// 	"varying   vec3 vPosition;",
// 	"void main() {",
// 		"gl_Position = aPosition;",
// 		"vPosition = aPosition.xyz;",
// 	"}"
// ].join('\n');

// var uniforms = {
//   iMouse: {
//     type: "2f",
//     value: {
//       x: 0,
//       y: 0
//     }
//   }
// };
// var shader = new PIXI.AbstractFilter(vertexSrc, fragmentSrc, uniforms);


var glowOutline = function(num){
	this.texture = new PIXI.Texture.fromImage('images/masks/' + (num + 1) + '.png');
	this.sprite = new PIXI.Sprite(this.texture);
	this.sprite.width = animationCanvas.width;
	this.sprite.height = animationCanvas.height;
	this.sprite.alpha = 0;
	this.sprite.filters = [filter];
	stage.addChild(this.sprite);
	this.isFadingIn = false;
	this.isFadingOut = false;
};

glowOutline.prototype.fadeIn = function(){
	this.isFadingIn = true;
	this.isFadingOut = false;
};

glowOutline.prototype.fadeOut = function(){
	this.isFadingOut = true;
	this.isFadingIn = false;
};

window.onload = function(){
	var maskCanvas = document.getElementById('myCanvas');
	animationCanvas = document.getElementById('animationCanvas');
	// animationContext = animationCanvas.getContext('2d');
	var renderer = new PIXI.autoDetectRenderer(640, 640, {
		view: animationCanvas,
		transparent: true
	});

	// var counter = 0;
	var fadeInc = 0.1;
	function animate() {
		renderer.render(stage);
		for(var i = 0; i < 14; i ++){
			if(glowOutlines[i].isFadingIn){
				glowOutlines[i].sprite.alpha += fadeInc;
				if(glowOutlines[i].sprite.alpha > 1){
					glowOutlines[i].sprite.alpha = 1;
					glowOutlines[i].isFadingIn = false;
				}
			}
			if(glowOutlines[i].isFadingOut){
				glowOutlines[i].sprite.alpha -= fadeInc;
				if(glowOutlines[i].sprite.alpha < 0){
					glowOutlines[i].sprite.alpha = 0;
					glowOutlines[i].isFadingOut = false;
				}
			}
		}
		requestAnimationFrame(animate);
	}

	for(var i = 0; i < 14; i ++) {
		glowOutlines[i] = new glowOutline(i);
	}

	animate();

	var maskContext = maskCanvas.getContext('2d');
	maskContext.globalAlpha = 0.01;
	// maskContext.globalAlpha = 0.3;
	var mask = new Image();
	mask.src = "images/mask.png";
	mask.onload = function() {
		maskContext.drawImage(mask, 0, 0, 640, 640);
	};

	maskCanvas.onmousemove=function(e){
		handleMouseover(maskContext.getImageData(e.offsetX, e.offsetY, 1, 1).data);
	};

};
var currentMouse = 0;

function handleMouseover(color){
	color = color[0].toString() + color[1].toString() + color[2].toString();
	switch(color) {
		case "000":
			if(currentMouse !== 0) {
				for(var i = 0; i < 14; i ++){
					if(i != currentMouse) glowOutlines[i].fadeOut();
				}
				sampler.triggerRelease(Tone.context.currentTime);
			}
			currentMouse = 0;
			break;
		case "255255255":
			schedulePlay(1);
			currentMouse = 1;
			break;
		case "2552550":
			schedulePlay(2);
			currentMouse = 2;
			break;
		case "2550255":
			schedulePlay(3);
			currentMouse = 3;
			break;
		case "0255255":
			schedulePlay(4);
			currentMouse = 4;
			break;
		case "25500":
			schedulePlay(5);
			currentMouse = 5;
			break;
		case "02550":
			schedulePlay(6);
			currentMouse = 6;
			break;
		case "00255":
			schedulePlay(7);
			currentMouse = 7;
			break;
		case "858585":
			schedulePlay(8);
			currentMouse = 8;
			break;
		case "85850":
			schedulePlay(9);
			currentMouse = 9;
			break;
		case "08585":
			schedulePlay(10);
			currentMouse = 10;
			break;
		case "85085":
			schedulePlay(11);
			currentMouse = 11;
			break;
		case "8500":
			schedulePlay(12);
			currentMouse = 12;
			break;
		case "0085":
			schedulePlay(13);
			currentMouse = 13;
			break;
		case "0850":
			schedulePlay(14);
			currentMouse = 14;
			break;
	}
}

function schedulePlay(num){
	console.log(num);
	console.log("currentmouse " + currentMouse)
	if((num + 1) !== 0 && currentMouse !== 0 && currentMouse !== null){
		console.log("fading stuff");
		for(var i = 0; i < 14; i ++){
			if(i != (num - 1)) glowOutlines[i].fadeOut();
		}
		glowOutlines[num - 1].fadeIn();
	}
	if(currentMouse != num){
		var nextNote = Math.floor(Tone.context.currentTime / 0.125);
		nextNote = nextNote * 0.125 + 0.125;
		sampler.triggerRelease(nextNote);
		sampler.triggerAttack("A." + num, nextNote);
	}
}

var sampler = new Tone.Sampler({
	A : {
		1 : "sounds/vocals/1.mp3",
		2 : "sounds/vocals/2.mp3",
		3 : "sounds/vocals/3.mp3",
		4 : "sounds/vocals/4.mp3",
		5 : "sounds/vocals/5.mp3",
		6 : "sounds/vocals/6.mp3",
		7 : "sounds/vocals/7.mp3",
		8 : "sounds/vocals/8.mp3",
		9 : "sounds/vocals/9.mp3",
		10 : "sounds/vocals/10.mp3",
		11 : "sounds/vocals/11.mp3",
		12 : "sounds/vocals/12.mp3",
		13 : "sounds/vocals/13.mp3",
		14 : "sounds/vocals/14.mp3"
	}
}).toMaster();

