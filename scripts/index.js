var instrumental = new Tone.Player({
	"url" : "sounds/nblu_instr.mp3"
}).toMaster();

$(function() {
	$("#play-button").click(function() {
		Tone.Transport.start();
		instrumental.start();
		$(this).toggleClass("hidden");
		$("#stop-button").toggleClass("hidden");
	});

	$("#stop-button").click(function() {
		instrumental.stop();
		Tone.Transport.stop();
		$(this).toggleClass("hidden");
		$("#play-button").toggleClass("hidden");
	});
});