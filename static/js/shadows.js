window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// in-browser tweaking stuff
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
  // grab items, cache offsets up front to avoid reflow costs when calculating shadows, since they never move anyway
  var panels = $('.shadow-div').get().map(function(item) { 
    return {
      $el: $(item),
      offsetX: $(item).offset().left + $(item).width()/2,
      offsetY: $(item).offset().top + $(item).height()/2,
    }
  });
  var texts = $('.shadow-text').get().map(function(item) { 
    return {
      $el: $(item),
      offsetX: $(item).offset().left + $(item).width()/2,
      offsetY: $(item).offset().top + $(item).height()/2,
    }
  });
  // EXPERIMENTAL: split up texts into words so they each have their own shadow
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
  $('html').mousemove(function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  });

  // constantly recalculate shadows as mouse moves around screen
  var magnitude = function(vector) { return Math.sqrt(vector.x*vector.x + vector.y*vector.y); };
  var magnitude2 = function(vector) { return vector.x*vector.x + vector.y*vector.y; };
  var recalculateShadows = function() {
    requestAnimFrame(recalculateShadows);
    if (mouseX > 0 && mouseY > 0) { // don't do mouse shadowing until there's a mouse event
      for (var i = 0; i < panels.length; i++) {
        var panel = panels[i];
        var mouseToItemVector = { x: panel.offsetX - mouseX, y: panel.offsetY - mouseY };
        var shadowX = mouseToItemVector.x / 390;
        var shadowY = mouseToItemVector.y / 150;
        var shadowBlur = Math.max(8.5 - magnitude(mouseToItemVector) / 100, 2);
        var shadowSize = magnitude(mouseToItemVector) / 740;
        var shadowAlpha = Math.max(0.75 - magnitude2(mouseToItemVector) / 1000000, 0.5);
        panel.$el.css('box-shadow', shadowX + 'px ' + shadowY + 'px ' + shadowBlur + 'px ' + shadowSize + 'px rgba(0,0,0,' + shadowAlpha + ')')
        panel.$el.css('-webkit-box-shadow', shadowX + 'px ' + shadowY + 'px ' + shadowBlur + 'px ' + shadowSize + 'px rgba(0,0,0,' + shadowAlpha + ')')
      };
      for (var i = 0; i < texts.length; i++) {
        var text = texts[i]
        var mouseToItemVector = { x: text.offsetX - mouseX, y: text.offsetY - mouseY };
        var shadowX = Math.sign(mouseToItemVector.x) * Math.sqrt(Math.abs(mouseToItemVector.x)) / 10;
        var shadowY = Math.sign(mouseToItemVector.y) * Math.sqrt(Math.abs(mouseToItemVector.y)) / 10;
        var shadowBlur = Math.max(4 - magnitude(mouseToItemVector) / 20, 0);
        var shadowAlpha = Math.max(0.75 - magnitude2(mouseToItemVector) / 1000000, 0.5);
        text.$el.css('text-shadow', shadowX + 'px ' + shadowY + 'px ' + shadowBlur + 'px rgba(0,0,0,' + shadowAlpha + ')')
      };
    }   
  }
  requestAnimFrame(recalculateShadows);
})