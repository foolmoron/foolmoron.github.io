window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

//// in-browser tweaking stuff
// window.xxx = 100;
// window.yyy = 100;
// $(window).keypress(function(e) {
//   switch (e.which) {
//     case 113: xxx -= 0.5; break; //q
//     case 81: xxx -= 10; break; //Q
//     case 101: xxx += 0.5; break; //e
//     case 69: xxx += 10; break; //E
//     case 97: yyy -= 0.5; break; //a
//     case 65: yyy -= 10; break; //A
//     case 100: yyy += 0.5; break; //d
//     case 68: yyy += 10; break; //D
//   }
//   console.log('xxx=', xxx, 'yyy=', yyy);
// });

// fire on load, after items are all rendered and positioned
$(window).load(function() {
  /* * * * * * * * * * * * *\
  * Disabling this for now  *
  \* * * * * * * * * * * * */
  return;

  // check luminosity of page color to decide between white and black shadows
  var regex = /\((.*?), (.*?), (.*?)\)+/g;
  var result = regex.exec($('body').css('background-color'));
  var lum = 0.2126*parseInt(result[1]) + 0.7152*parseInt(result[2]) + 0.0722*parseInt(result[3])
  var shadowColor = lum > 45 ? '0,0,0,' : '185,185,185,';

  // grab shadow-sensitive elemtns in a nice structure and cache offsets up front to avoid reflow costs when calculating shadows
  var panels = [];
  var text = []
  var cacheOffsets = function() {
    panels = $('.shadow-div').get().map(function(item) { 
      return {
        $el: $(item),
        offsetX: $(item).offset().left + $(item).width()/2,
        offsetY: $(item).offset().top + $(item).height()/2,
      }
    });
    texts = $('.shadow-text').get().map(function(item) { 
      return {
        $el: $(item),
        offsetX: $(item).offset().left + $(item).width()/2,
        offsetY: $(item).offset().top + $(item).height()/2,
      }
    });
  }
  cacheOffsets();

  // store screen size for shadow calculations
  var screenW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var screenH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  $(window).resize(function() { 
    // recache offsets when window resizes
    cacheOffsets();
    // refresh screen size as well
    screenW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    screenH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;    
  });
  
  //// EXPERIMENTAL: split up texts into words so they each have their own shadow
  // var originalTexts = $('.shadow-text');
  // var texts = [];
  // for (var i = originalTexts.length - 1; i >= 0; i--) {
  //   var contents = originalTexts.eq(i).contents()
  //   for (var j = contents.length - 1; j >= 0; j--) {
  //     var content = contents[j];
  //     if (content.nodeName == '#text') {
  //       var newHTML = content.nodeValue.replace(/[^\s]+/g, "<span>$&</span>");
  //       $(newHTML).insertBefore(content);
  //       content.remove();
  //     } else {
  //       content.innerHTML = content.innerHTML.replace(/[^\s]+/g, "<span>$&</span>");
  //     }
  //   };
  //   texts = texts.concat(originalTexts.eq(i).find('span').get().map(function(item) { 
  //     return {
  //       $el: $(item),
  //       offsetX: $(item).offset().left + $(item).width()/2,
  //       offsetY: $(item).offset().top + $(item).height()/2,
  //     }
  //   }));
  // };

  // on-demand mouse position
  var mouseX = -1;
  var mouseY = -1;
  var lastMouseTime = 0;
  $('html').mousemove(function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    lastMouseTime = new Date().getTime();
  });
  // gyro for mobile
  var gyroB = null;
  var gyroG = null;
  var lastGyroTime = 0;
  if (gyro.hasFeature('devicemotion')) {
    gyro.frequency = 1000/16; // 60fps
    gyro.startTracking(function(orientation) {
      if (gyroB !== orientation.beta || gyroG !== orientation.gamma) {
        gyroB = orientation.beta || gyroB;
        gyroG = orientation.gamma || gyroG;
        lastGyroTime = new Date().getTime();
      }
    });
  }

  // constantly recalculate shadows as mouse moves around screen
  var magnitude = function(vector) { return Math.sqrt(vector.x*vector.x + vector.y*vector.y); };
  var magnitude2 = function(vector) { return vector.x*vector.x + vector.y*vector.y; };
  var getNormalizedShadowVector = function(item) { // normalizes gyro/mouse to [-1, 1]ish
    if (lastGyroTime > lastMouseTime) {
      return { x: gyroG * 3 / 90, y: gyroB * 1.5 / 90 }; // actually we're gonna cheat and make the gyro feel stronger than it really is
    } else {
      return { x: (item.offsetX - mouseX)/(screenW/2), y: (item.offsetY - mouseY)/(screenH/2) };
    }
  };
  var recalculateShadows = function() {
    requestAnimFrame(recalculateShadows);
    //console.log(mouseX, mouseY, gyroB, gyroG);
    if (lastMouseTime || lastGyroTime) { // don't do mouse shadowing until there's a mouse/gyro event
      for (var i = 0; i < panels.length; i++) {
        var panel = panels[i];
        var shadowVector = getNormalizedShadowVector(panel);
        var shadowX = Math.min(shadowVector.x / 0.2, 10);
        var shadowY = Math.min(shadowVector.y / 0.3, 10);
        var shadowBlur = Math.max(10 - magnitude(shadowVector) * 8, 1);
        var shadowSize = Math.min(magnitude(shadowVector) / 0.74, 1.25);
        var shadowAlpha = Math.max(0.75 - magnitude2(shadowVector), 0.5);
        panel.$el.css('box-shadow', shadowX + 'px ' + shadowY + 'px ' + shadowBlur + 'px ' + shadowSize + 'px rgba(' + shadowColor + shadowAlpha + ')')
        panel.$el.css('-webkit-box-shadow', shadowX + 'px ' + shadowY + 'px ' + shadowBlur + 'px ' + shadowSize + 'px rgba(' + shadowColor + shadowAlpha + ')')
      };
      for (var i = 0; i < texts.length; i++) {
        var text = texts[i]
        var shadowVector = getNormalizedShadowVector(text);
        var shadowX = Math.sign(shadowVector.x) * Math.sqrt(Math.abs(shadowVector.x)) * 3.5;
        var shadowY = Math.sign(shadowVector.y) * Math.sqrt(Math.abs(shadowVector.y)) * 2.5;
        var shadowBlur = Math.max(4 - magnitude(shadowVector) / 0.2, 0);
        var shadowAlpha = Math.max(0.75 - magnitude2(shadowVector), 0.5);
        text.$el.css('text-shadow', shadowX + 'px ' + shadowY + 'px ' + shadowBlur + 'px rgba(' + shadowColor + shadowAlpha + ')')
      };
    }   
  }
  requestAnimFrame(recalculateShadows);
})