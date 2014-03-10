Contents = {};
MainModel = null;
$(function() { // have to wait for DOM to load to get templates
    Contents.github = new Content({
        id: "github",
        title: "Github",
        description: "The full source code for all of my non-work projects is hosted on my GitHub!",
        color: [0, 0, 190]
    });
    Contents.flappypuzzle = new Content({
        id: "flappypuzzle",
        title: "Flappy Puzzle",
        description: "A touch-based game made for the <a href='http://itch.io/jam/flappyjam' target='_blank'>Flappy Jam</a>.<br />Graphics inspired by Tetris, difficulty and controls inspired by Flappy Bird.",
        color: [202, 206, 80]
    });
    Contents.princesstina = new Content({
        id: "princesstina",
        title: "Princess Tina",
        description: "My game for <a href='http://globalgamejam.org' target='_blank'>Global Game Jam 2014</a>.<br />Developed for the Unity web player with a team of 7.",
        color: [255, 100, 255]
    });
    Contents.retroverse = new Content({
        id: "retroverse",
        title: "Retroverse",
        description: "My first big, complete game! A 1P/2P roguelike with lots of powerups and levels.<br />Made at the UVA SGD with a team of 7ish.",
        color: [0, 192, 255]
    });
    Contents.cityquake = new Content({
        id: "cityquake",
        title: "City Quake",
        description: "My first touch-based web game. An action-puzzle game where you destroy a city with earthquakes.<br />Made in Construct 2 for the Newgrounds <a href='http://www.newgrounds.com/collection/construct2touchjam' target='_blank'>Construct 2 Jam</a>.",
        color: [110, 70, 0]
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
    MainModel = new Backbone.Model({
        colorString: "rgb(255, 140, 0)",
        subtitle: "",
        test: "Testy Test",

        randomizeSubtitle: function() {
            var weightTotal = POSSIBLE_SUBTITLES.reduce(function(acc, subtitle) { return acc + subtitle.weight; }, 0);
            var weightedRandom = Math.random() * weightTotal;   
            var weightSum = 0;
            for (var i = 0; i < POSSIBLE_SUBTITLES.length; i++) {
                weightSum += POSSIBLE_SUBTITLES[i].weight;
                if (weightedRandom < weightSum) {
                    this.set('subtitle', POSSIBLE_SUBTITLES[i].text);
                    break;
                }
            }
        }
    });
});