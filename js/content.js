Contents = {};
MainModel = null;
$(function() { // have to wait for DOM to load to get templates
    Contents.github = new Content({
        id: "github",
        title: "GitHub",
        description: "The full source code for all of my non-work projects is hosted on my GitHub!",
        color: [0, 0, 190]
    });
    Contents.interball = new Content({
        id: "interball",
        title: "interball",
        bannerURL: "img/interballbanner.png",
        description: "A fast-action rotating pinball game with a constantly warping board, made during <a href='http://www.ludumdare.com/compo/ludum-dare-30/?action=preview&uid=36186' target='_blank'>Ludum Dare 30</a>.<br />Click logo to play!",
        color: [159, 104, 232]
    });
    Contents.nsn = new Content({
        id: "nsn",
        title: "Night Shift Ninja",
        description: "A 2D stealth-action-puzzle game made during <a href='http://www.srrngames.com/srrn-seventy-two-the-second-jam/' target='_blank'>SRRN Game Jam #2</a>.<br />Inspired by the randomly-chosen past Ludum Dare themes 'sneaking', 'bouncy'.<br />Click logo to play!",
        color: [255, 8, 50]
    });
    Contents.kawa = new Content({
        id: "kawa",
        title: "Kawaii Aishiteru Wormhole Adventure",
        bannerURL: "img/kawabanner.png",
        description: "A dating sim made for <a href='http://fuckthisjam.com/' target='_blank'>Fuck This Jame 2014</a>.<br />The goal was to make a game in a genre that you hate and/or know nothing about.",
        color: [17, 0, 88]
    });
    Contents.uncivilize = new Content({
        id: "uncivilize",
        title: "Uncivilize",
        description: "A 2D action-strategy game made during <a href='http://www.srrngames.com/were-jammin/' target='_blank'>SRRN Game Jam #1</a>.<br />Inspired by the randomly-chosen past Ludum Dare themes 'classic roles reversed', 'atmosphere', and 'all natural'.<br />Click logo to play!",
        color: [221, 168, 91]
    });
    Contents.honeybundles = new Content({
        id: "honeybundles",
        title: "Honey Bundles",
        description: "A stop-and-go endless runner for <a href='http://www.ludumdare.com/compo/ludum-dare-29/?action=preview&uid=36186'>Ludum Dare 29</a>'s theme: \"Beneath the Surface\".<br />Developed for the Unity web player entirely by myself.",
        color: [255, 255, 80]
    });
    Contents.srrn1 = new Content({
        id: "srrn1",
        title: "2D Vita Platformer",
        description: "A yet-to-be-revealed platformer I worked on at SRRN Games using the Unity Vita plugin.",
        color: [0, 200, 50]
    });
    Contents.sws = new Content({
        id: "sws",
        title: "Stormwater Sentries",
        description: "An HTML5 educational resource management browser game about reducing stormwater runoff on your property.<br />Developed at SRRN Games in collaboration with local Virginia organizations.<br />Click logo to play!",
        color: [0, 180, 255]
    });
    Contents.retroverse = new Content({
        id: "retroverse",
        title: "Retroverse",
        bannerURL: "img/retroversebanner.png",
        description: "My first complete, shipped game! A 1P/2P roguelike with lots of powerups and levels.<br />Made at the UVA SGD with a team of 7ish.",
        color: [50, 50, 50]
    });
    Contents.princesstina = new Content({
        id: "princesstina",
        title: "Princess Tina",
        bannerURL: "img/princesstinabanner.png",
        description: "A cute, Nintendo-hard platformer for <a href='http://globalgamejam.org/2014/games/princess-tina' target='_blank'>Global Game Jam 2014</a>.<br />Developed for the Unity web player with a team of 7.",
        color: [255, 100, 255]
    });
    Contents.flappypuzzle = new Content({
        id: "flappypuzzle",
        title: "Flappy Puzzle",
        bannerURL: "img/flappypuzzlebanner.png",
        description: "A touch-based game made for the <a href='http://itch.io/jam/flappyjam' target='_blank'>Flappy Jam</a>.<br />Graphics inspired by Tetris, difficulty and controls inspired by Flappy Bird.",
        color: [202, 206, 80]
    });
    Contents.skylize = new Content({
        id: "skylize",
        title: "Skylize",
        bannerURL: "img/skylizebanner.png",
        description: "An experiment with a velocity-based touch control system, made for the <a href='http://itch.io/jam/cyberpunk-jam' target='_blank'>Cyberpunk Jam</a>.<br />Paint the black sky with neon lights and share your creation.",
        color: [0, 255, 255]
    });
    Contents.cityquake = new Content({
        id: "cityquake",
        title: "City Quake",
        bannerURL: "img/cityquakebanner.png",
        description: "My first touch-based web game. An action-puzzle game where you destroy a city with earthquakes.<br />Made in Construct 2 for the Newgrounds <a href='http://www.newgrounds.com/collection/construct2touchjam' target='_blank'>Construct 2 Jam</a>.",
        color: [110, 70, 0]
    });

    POSSIBLE_SUBTITLES = [
        {text: "Game Developer, etc.", weight: 3},
        {text: "The .io is ironic", weight: 3},
        {text: "Ask about my username", weight: 2},
        {text: "My games are better than my web design", weight: 1},
        {text: "Donate to 1GfseRZYS6pebUscxv2kYpviwBMY1E8Hdb", weight: 1},
        {text: "Can you solve the secret puzzle?", weight: 1}, // hint: there is no secret puzzle
        {text: "Congratulations, you are the 1st visitor!", weight: 1},
        {text: "Achievement Unlocked: Rare and Pointless Random Message", weight: 0.1}
    ];
    MainModel = new Backbone.Model({
    	secretAntiRobotEmail: "foolmoron@gmail.com",
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
