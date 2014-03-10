Contents = {};
MainModel = null;
$(function() { // have to wait for DOM to load to get templates
	Contents.test = new Content({
		id: "test",
		title: "Test",
		extraContent: "<img src='http://img.imgcake.com/foolmoron/Twilightclapeb.gif' />"
	});
	Contents.one = new Content({
		id: "one",
		title: "Test1",
		description: "Description1",
		color: [100, 200, 50]
	});
	Contents.two = new Content({
		id: "two",
		title: "Test2",
		description: "Description2",
		color: [20, 80, 255]
	});
	Contents.three = new Content({
		id: "three",
		title: "Test3",
		description: "Description3",
		color: [0, 255, 255]
	});

	var POSSIBLE_SUBTITLES = [
		{text: "The .io is ironic", weight: 3},
		{text: "Game Developer, etc.", weight: 3},
		{text: "Ask about my username", weight: 2},
		{text: "My games are better than my web design", weight: 1},
		{text: "Donate to 1GfseRZYS6pebUscxv2kYpviwBMY1E8Hdb", weight: 1},
		{text: "Can you solve the secret puzzle?", weight: 1}, // hint: there is no secret puzzle
		{text: "Congratulations, you are the 1st visitor!", weight: 1},
		{text: "Achievement Unlocked: Rare and Pointless Random Message", weight: 0.1}
	];
	var randomSubtitle = "";
	var weightTotal = POSSIBLE_SUBTITLES.reduce(function(acc, subtitle) { return acc + subtitle.weight; }, 0);
	var weightedRandom = Math.random() * weightTotal;	
	var weightSum = 0;
	for (var i = 0; i < POSSIBLE_SUBTITLES.length; i++) {
		weightSum += POSSIBLE_SUBTITLES[i].weight;
		if (weightedRandom < weightSum) {
			randomSubtitle = POSSIBLE_SUBTITLES[i].text;
			break;
		}
	}
	MainModel = {
		colorString: "rgb(255, 0, 100)",
		subtitle: randomSubtitle,
		test: "Testy Test"
	};
});