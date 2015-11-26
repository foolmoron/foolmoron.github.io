---
layout: post
title: Inspecting ArcGIS Javascript raster pixels with the mouse
color: '#007755'
tags:
- Timmons Group
- Web Dev
---

*This is a cross-post from the Timmons Group [Innovate Blog](http://www.timmons.com/news/blog). The original post can be found [here](http://www.timmons.com/news/blog/inspecting-arcgis-javascript-raster-pixels-with-the-mouse).*

One of the primary purposes of our Wildfire Risk Assessment Portal (WRAP) web app is to let users view and analyze various raster data layers on a map. With so many colors on these raster layers, sometimes upwards of 40, it's important to provide a legend to give the user a quick and easy way to make sense of the data.

The typical legend solution is an additional page or panel next to the map that lists various shapes and colors describing the data on the map. These are very useful in printed maps, but they can be cumbersome, unintuitive, and boring in a fully interactive javascript app on a computer or phone browser.

<p style="text-align: center;">
  <img alt="" class="align-none" onmouseout="this.style.width='550px'" onmouseover="this.style.width='100%'" src="http://www.timmons.com/uploads/legendold.png" style="width: 100%; height: auto; transition: all 0.25s;">
</p>
<p style="text-align: center;">
  <i>Map with a legend from one of ESRI's ArcGIS Javascript samples. Source: </i><a href="http://developers.arcgis.com/javascript/samples/widget_legend/" target="_blank"><i>developers.arcgis.com/javascript/samples/widget_legend</i></a>
</p>

It's difficult to discern between similar shapes and colors on the legend, and the user constantly has to look back and forth between the important data on the map, and the legend off to the side. There is also often no context to the legend, and no particular order in which items are displayed. It's just not a great use of valuable space on the screen, especially on small mobile screens.

For AZWRAP (our WRAP application designed for the Arizona Forestry Service), we tried to come up with a more modern style of legend that took advantage of the dynamic and interactive nature of the web. The result is a very minimal horizontal legend that uses the user's mouse (or touch) input to display the relevant legend information immediately as the user needs it.

<p style="text-align: center;">
  <img alt="" class="align-none" onmouseout="this.style.width='550px'" onmouseover="this.style.width='100%'" src="http://www.timmons.com/uploads/2015-10-22_10-23-17.gif" style="width: 550px; height: auto; transition: all 0.25s;">
</p>
<p style="text-align: center;">
  <img alt="" class="align-none" onmouseout="this.style.width='550px'" onmouseover="this.style.width='100%'" src="http://www.timmons.com/uploads/2015-10-22_12-22-03.gif" style="width: 550px; height: auto; transition: all 0.25s;">
</p>
<p style="text-align: center;">
  <i>Examples of the Wildfire Risk Assessment Portal dynamic legend in action. There can be over 40 legend items, and it even works with the layer swipe widget!</i>
</p>

As the user moves the mouse around the map, the legend automatically inspects the raster pixel data that is under the mouse and highlights the relevant legend item. This is based on the simple principle that when the user moves their mouse to a location, it's a strong signal that they are interested in whatever is at that location. That signal is all we need to display the information the user wants. No other input is required - it's like mind reading!

This way, much more of the screen can be used for map data and other valuable information, and the user only sees the legend information that is immediately relevant at that moment. Subtle differences in raster colors can be easily distinguished with the mouse, and even layers with over 40 items can be read pretty easily. Best of all, the user automatically learns the functionality of this legend right when they interact with the map for the first time, with no additional instructions or tutorials. Panning, zooming, or even just accidentally dragging the mouse over the map is enough to trigger the dynamic legend popup, and the immediate feedback ensures the user makes the connection between the mouse input and the legend. We maximize the responsiveness and efficiency of reading the map and eliminate the confusion of the traditional style of legend.

## The Code
AZWRAP uses the ArcGIS Javascript 3.14 API to display raster data layers, so this code is specifically for use with [WebTiledLayer](https://developers.arcgis.com/javascript/jsapi/webtiledlayer.html). However, this method should basically work the same with any javascript mapping API, and it could even be applied to vector layers that are rendered with SVG with a bit of work. Also, this code is written in [CoffeeScript](http://coffeescript.org), which I highly recommend as a much nicer way to write javascript!

At a high level, our goal is to read the RGB color of the pixel directly under the mouse, match the color with the corresponding legend item, and display the legend popup.

We listen for mouse-move events on the ArcGIS map div to kick off all our pixel inspection logic. First, we need to figure out which ArcGIS layer we're actually interested in. Generally it is just the current layer that is displayed on the map, but in the case of swiped layers, there is some additional logic required to figure out which layer the mouse is hovering over.

<div onmouseout="this.style.width='auto'" onmouseover="this.style.width='1000px'" style="background: rgb(255, 255, 255); border-width: 0.1em 0.1em 0.1em 0.8em; border-style: solid; border-color: gray; padding: 0.2em 0.6em; border-image: none; width: auto; overflow: auto;">
  <pre style="margin: 0px; line-height: 125%; overflow: hidden; word-wrap: normal;">
      inspectPixelUnderMouse: (e) -&gt;
      <span style="color: rgb(0, 128, 0);"># grab the mouse position relative to the map div, using cross-browser convenience functions</span>
      mousePos = x: getOffsetX(e), y: getOffsetY(e)

      <span style="color: rgb(0, 128, 0);"># by default, the layer under the mouse is the currently displayed raster layer</span>
      themeLayerUnderMouse = @currentThemeLayer

      <span style="color: rgb(0, 128, 0);"># if we're swiping, figure out whether to use the swiped layer depending on mouse position and swipe type/position</span>
      <span style="color: rgb(0, 0, 255);">if</span> @swipe? <span style="color: rgb(0, 128, 0);"># @swipe is an ArcGIS LayerSwipe object we have activated elsewhere</span>
        layerSwipeDiv = @$(<span style="color: rgb(163, 21, 21);">'.LayerSwipe &gt; div'</span>)
        useSwipedLayer = <span style="color: rgb(0, 0, 255);">switch</span> @swipe.type
          <span style="color: rgb(0, 0, 255);">when</span> <span style="color: rgb(163, 21, 21);">'vertical'</span> <span style="color: rgb(0, 0, 255);">then</span> mousePos.x &lt; parseInt layerSwipeDiv.css <span style="color: rgb(163, 21, 21);">'left'</span>
          <span style="color: rgb(0, 0, 255);">when</span> <span style="color: rgb(163, 21, 21);">'horizontal'</span> <span style="color: rgb(0, 0, 255);">then</span> mousePos.y &lt; parseInt layerSwipeDiv.css <span style="color: rgb(163, 21, 21);">'top'</span>
          <span style="color: rgb(0, 0, 255);">when</span> <span style="color: rgb(163, 21, 21);">'scope'</span>
            swipeHandleDiv = $(@swipe._moveableNode)
            swipeHandleWidth = swipeHandleDiv.width()
            swipeHandleHeight = swipeHandleDiv.height()
            scopeCenterX = parseInt(swipeHandleDiv.css <span style="color: rgb(163, 21, 21);">'left'</span>) + swipeHandleWidth/2
            scopeCenterY = parseInt(swipeHandleDiv.css <span style="color: rgb(163, 21, 21);">'top'</span>) + swipeHandleHeight/2
            <span style="color: rgb(0, 128, 0);"># assume scope is a circle inside in the swipeHandleDiv... in reality there's a border, but it's small</span>
            scopeRadius = swipeHandleWidth/2
            distance2ToScopeCenter = (scopeCenterX - mousePos.x)**2 + (scopeCenterY - mousePos.y)**2
            <span style="color: rgb(0, 128, 0);"># finally return the distance check</span>
            distance2ToScopeCenter &lt; (scopeRadius*scopeRadius)

      <span style="color: rgb(0, 0, 255);">if</span> useSwipedLayer
        themeLayerUnderMouse = @swipedThemeLayer
  </pre>
</div>

Once we have determined the layer that is under the mouse, we have to figure out which individual image tile the mouse is hovering over. In ArcGIS, each layer on the map has its own coordinate space that is determined by a CSS translate transformation. This transformation is adjusted as the user pans around the map to achieve the scrolling effect. Each image inside the layer is further translated into a grid formation.

The mouse position we get from the mouse-move event is relative to the map div, so we need to project the mouse coordinate from *div space* into *layer space* and then further into *image space*. In linear 2D space, this is as easy as subtracting the layer and image translations from our *div space* mouse coordinate.

<div onmouseout="this.style.width='auto'" onmouseover="this.style.width='1000px'" style="background: rgb(255, 255, 255); border-width: 0.1em 0.1em 0.1em 0.8em; border-style: solid; border-color: gray; padding: 0.2em 0.6em; border-image: none; width: auto; overflow: auto;">
  <pre style="margin: 0px; line-height: 125%; overflow: hidden; word-wrap: normal;">
      <span style="color: rgb(0, 128, 0);"># get the div of the current layer based on the unique id given to each layer</span>
      currentLayerDiv = @$(<span style="color: rgb(163, 21, 21);">'#map_'</span> + themeLayerUnderMouse.id)
      layerTranslate = getTranslate(currentLayerDiv[0]) <span style="color: rgb(0, 128, 0);"># parse the transform property of the map to get its XY translation</span>

      <span style="color: rgb(0, 128, 0);"># check each image to see if the mouse is contained within its bounds</span>
      currentLayerImages = $(<span style="color: rgb(163, 21, 21);">'img'</span>, currentLayerDiv)
      <span style="color: rgb(0, 0, 255);">for</span> img <span style="color: rgb(0, 0, 255);">in</span> currentLayerImages
        imgTranslate = getTranslate img <span style="color: rgb(0, 128, 0);"># parse the transform property of the image to get its XY translation within the layer's space</span>
        <span style="color: rgb(0, 128, 0);"># project the mouse position into the invididual image's space by shifting it by the layer and image translation amounts</span>
        mouseInImageSpaceX = mousePos.x - (layerTranslate.x + imgTranslate.x)
        mouseInImageSpaceY = mousePos.y - (layerTranslate.y + imgTranslate.y)
        <span style="color: rgb(0, 0, 255);">if</span> 0 &lt;= mouseInImageSpaceX &lt; img.width &amp;&amp; 0 &lt;= mouseInImageSpaceY &lt; img.height
          <span style="color: rgb(0, 128, 0);"># the mouse position, projected into this image's space, is within the bounds of the image</span>
  </pre>
</div>

Now that we know the image that the mouse is hovering over, and the exact pixel within that image, we can read the RGB pixel data from that image. The only way we can do this in the browser is to use the HTML5 [Canvas2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) API, by first drawing the HTML image object on the canvas, then reading back the pixel data to get the individual RGB components.

We need to add a hidden canvas element to the HTML. It seems silly to have a 1x1 canvas, but we are only going to draw and read exactly 1 pixel at a time, so that's all we need!

<div onmouseout="this.style.width='auto'" onmouseover="this.style.width='1000px'" style="background: rgb(255, 255, 255); border-width: 0.1em 0.1em 0.1em 0.8em; border-style: solid; border-color: gray; padding: 0.2em 0.6em; border-image: none; width: auto; overflow: auto;">
  <pre style="margin: 0px; line-height: 125%; overflow: hidden; word-wrap: normal;">
  <span style="color: rgb(0, 0, 128); font-weight: bold;">&lt;canvas</span> <span style="color: rgb(255, 0, 0);">class=</span><span style="color: rgb(0, 0, 255);">"map-canvas"</span> <span style="color: rgb(255, 0, 0);">width=</span><span style="color: rgb(0, 0, 255);">1</span> <span style="color: rgb(255, 0, 0);">height=</span><span style="color: rgb(0, 0, 255);">1</span><span style="color: rgb(0, 0, 128); font-weight: bold;">&gt;&lt;/canvas&gt;</span>
  </pre>
</div>

And now the coffeescript:

<div onmouseout="this.style.width='auto'" onmouseover="this.style.width='1000px'" style="background: rgb(255, 255, 255); border-width: 0.1em 0.1em 0.1em 0.8em; border-style: solid; border-color: gray; padding: 0.2em 0.6em; border-image: none; width: auto; overflow: auto;">
  <pre style="margin: 0px; line-height: 125%; overflow: hidden; word-wrap: normal;">
        <span style="color: rgb(0, 128, 0);"># grab the canvas HTML object and get a 2D context from it</span>
        mapCanvas = $(<span style="color: rgb(163, 21, 21);">'.map-canvas'</span>)[0]
        mapCtx = mapCanvas.getContext(<span style="color: rgb(163, 21, 21);">'2d'</span>)

        <span style="color: rgb(0, 128, 0);"># this tells the canvas to read from the image at coordinate (mouseInImageSpaceX, mouseInImageSpaceY) a square of 1x1 pixels</span>
        <span style="color: rgb(0, 128, 0);"># and draw that square onto the canvas at coordinate (0, 0), providing us a 1x1 canvas with exactly the pixel we want from the image</span>
        mapCtx.drawImage img, mouseInImageSpaceX, mouseInImageSpaceY, 1, 1, 0, 0, 1, 1

        <span style="color: rgb(0, 128, 0);"># this reads from coordinate (0, 0) a 1x1 square of data, w</span><span style="color: rgb(0, 128, 0);">hich ends up being an array of just 4 numbers: [R, G, B, A]</span>
        pixelData = mapCtx.getImageData(0, 0, 1, 1).data
  </pre>
</div>

Finally, with the raw RGB values, we can figure out which legend item to pop up to the user. In our WRAP code, we have JSON (although I suppose it's CSON for coffeescript) objects that define the legend values for each raster layer. We use that data to map the inspected RGB value to a legend item.

<div onmouseout="this.style.width='auto'" onmouseover="this.style.width='1000px'" style="background: rgb(255, 255, 255); border-width: 0.1em 0.1em 0.1em 0.8em; border-style: solid; border-color: gray; padding: 0.2em 0.6em; border-image: none; width: auto; overflow: auto;">
  <pre style="margin: 0px; line-height: 125%; overflow: hidden; word-wrap: normal;">
    wildfirethreat:
      name: <span style="color: rgb(163, 21, 21);">'Wildfire Threat'</span>
      inspectableLayerLegend: [
        {label: <span style="color: rgb(163, 21, 21);">'Non-Burnable'</span>, rgb: [255, 255, 255]}
        {label: <span style="color: rgb(163, 21, 21);">'Very Very Low'</span>, rgb: [150, 173, 127]}
        {label: <span style="color: rgb(163, 21, 21);">'Very Low'</span>, rgb: [185, 215, 168]}
        {label: <span style="color: rgb(163, 21, 21);">'Low'</span>, rgb: [215, 207, 158]}
        {label: <span style="color: rgb(163, 21, 21);">'Low - Moderate'</span>, rgb: [255, 255, 190]}
        {label: <span style="color: rgb(163, 21, 21);">'Moderate'</span>, rgb: [255, 211, 127]}
        {label: <span style="color: rgb(163, 21, 21);">'Moderate - High'</span>, rgb: [255, 170, 0]}
        {label: <span style="color: rgb(163, 21, 21);">'High'</span>, rgb: [255, 85, 0]}
        {label: <span style="color: rgb(163, 21, 21);">'Very High'</span>, rgb: [207, 0, 0]}
        {label: <span style="color: rgb(163, 21, 21);">'Extreme'</span>, rgb: [115, 0, 0]}
      ]
  </pre>
</div>

All kinds of effects can be triggered after matching the RGB value to a legend item. In our code we simply set a CSS class on the appropriate legend item div, and let the CSS animations do the rest. The possibilities are endless! Try to come up with a presentation of the legend that best fits your app's layout and gives the user the most relevant information.

## CORS and IE10
Of course, this method is not without its issues. In particular, there are several small quirks with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) across Canvas2D, ArcGIS Javascript, and Internet Explorer 10 that create a perfect storm of trouble when trying to read pixel data from raster tile images.

You will likely get this error about "cross-origin data" when trying to read from the canvas with getImageData: *<span style="color: red;">Unable to get image data from canvas because the canvas has been tainted by cross-origin data.</span>*

This is because Canvas2D does not allow reading data after a cross-origin image (one that has been obtained from an external source) has been drawn onto the canvas. This includes map tiles, which are likely served from a separate server (a MapProxy server in our case) than the web server that the app is running on. However, if the server is configured to allow CORS and you obtain the images with the proper headers, then the app knows the images are safe and allows you to read their pixels using the canvas. There's a nice website dedicated to instructions for enabling CORS on servers [here](http://enable-cors.org/index.html).

On the front-end, when fetching images, you set a flag on the HTML object to tell the browser to use CORS headers:

<div onmouseout="this.style.width='auto'" onmouseover="this.style.width='1000px'" style="background: rgb(255, 255, 255); border-width: 0.1em 0.1em 0.1em 0.8em; border-style: solid; border-color: gray; padding: 0.2em 0.6em; border-image: none; width: auto; overflow: auto;">
  <pre style="margin: 0px; line-height: 125%; overflow: hidden; word-wrap: normal;">
      Javascript:   
      corsImage = <span style="color: rgb(0, 0, 255);">new</span> Image()
      corsImage.crossOrigin = <span style="color: rgb(163, 21, 21);">'Anonymous'</span>
      corsImage.src = <span style="color: rgb(163, 21, 21);">'example.com/maptile.png'</span>
      
      HTML:
      &lt;img crossorigin=<span style="color: rgb(163, 21, 21);">"anonymous"</span> src=<span style="color: rgb(163, 21, 21);">"example.com/maptile.png"</span> /&gt;
  </pre>
</div>

ArcGIS Javascript has an [option](https://developers.arcgis.com/javascript/jshelp/inside_defaults.html) to enable CORS for certain servers, **but** it applies it incorrectly on images. If you notice in the example code, the *crossOrigin* property is set before the *src* property. This is required for the image request to have the proper CORS headers. Unfortunately, ArcGIS Javascript 3.14 sets *crossOrigin* after *src*. More details about this bug can be found in [this discussion](https://github.com/Esri/esri-leaflet/issues/563) about a similar bug in the ESRI Leaflet plugin.

So we can't trust our mapping API to obtain CORS images properly, but we can easily re-download the image ourselves:

<div onmouseout="this.style.width='auto'" onmouseover="this.style.width='1000px'" style="background: rgb(255, 255, 255); border-width: 0.1em 0.1em 0.1em 0.8em; border-style: solid; border-color: gray; padding: 0.2em 0.6em; border-image: none; width: auto; overflow: auto;">
  <pre style="margin: 0px; line-height: 125%; overflow: hidden; word-wrap: normal;">
    inspectPixelUnderMouse: (e) -&gt;
      inspectImage = <span style="color: rgb(0, 0, 255);">new</span> Image()
      inspectImage.crossOrigin = <span style="color: rgb(163, 21, 21);">'Anonymous'</span>
      inspectImage.src = <span style="color: rgb(163, 21, 21);">'example.com/maptile.png'</span>
      inspectImage.onload = () =&gt;
        <span style="color: rgb(0, 128, 0);"># do all the image inspection logic in this callback</span>
  </pre>
</div>

A callback-within-a-callback like this is a bit uglier than before, but it's not so bad. The big trouble comes when you discover that [IE10 does not support CORS for images drawn on the canvas](https://connect.microsoft.com/IE/feedback/details/789809/ie10-cors-headers-not-being-honoured-with-canvas-drawimage-and-getimagedata). If you only need to support IE11 or higher, consider yourself lucky and ignore the rest of this post! Sadly, AZWRAP required IE10 support, but fortunately there is a (very ugly) work around.

Instead of setting the *src* URL of our CORS image directly, we have to request the image as a blob and use the blob URL on the image. This is such an outdated method of making AJAX requests that jQuery's ajax() doesn't even have an option to request a blob, so we have to manually construct an XHR request the long way:

<div onmouseout="this.style.width='auto'" onmouseover="this.style.width='1000px'" style="background: rgb(255, 255, 255); border-width: 0.1em 0.1em 0.1em 0.8em; border-style: solid; border-color: gray; padding: 0.2em 0.6em; border-image: none; width: auto; overflow: auto;">
  <pre style="margin: 0px; line-height: 125%; overflow: hidden; word-wrap: normal;">
      xhr = <span style="color: rgb(0, 0, 255);">new</span> XMLHttpRequest()
      xhr.onload = (e) =&gt;
        inspectBlobURL = URL.createObjectURL(e.target.response)
        <span style="color: rgb(0, 128, 0);"># set the image URL, which will trigger the image's onload function</span>
        inspectImage.src = inspectBlobURL
        <span style="color: rgb(0, 128, 0);"># and we have to manually release the object memory here</span>
        URL.revokeObjectURL(inspectBlobURL)
      xhr.open(<span style="color: rgb(163, 21, 21);">'GET'</span>, img.src, <span style="color: rgb(0, 0, 255);">true</span>) <span style="color: rgb(0, 128, 0);"># use the src URL of the map tile to obtain the blob</span>
      xhr.responseType = <span style="color: rgb(163, 21, 21);">'blob'</span>
      xhr.send()
  </pre>
</div>

And with that, we can finally read pixel data of images even on browsers that don't support CORS!

If you have any questions, comments or feedback on my writing/blogging skills, feel free to email me at [momin.khan@timmons.com](mailto:momin.khan@timmons.com) or tweet me [@foolmoron](https://twitter.com/foolmoron)!