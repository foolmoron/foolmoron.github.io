---
layout: post
title: Timelapses for game and web development
color: '#007755'
tags:
- Web Dev
- Game Dev
---

<p style="text-align: center;">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/PROcYS08Lfs" frameborder="0" allowfullscreen></iframe>
	<br>
	<i>A 20x timelapse of one of my <span class="label tag-Variety_MEGAJAM_2016"><a href="/projects/VarietyMegajam">Variety MEGAJAM 2016</a></span> games, from my <a href="https://www.youtube.com/user/foolmoron/videos">Youtube page</a>.</i>
</p>

## Why?

Recently I've found myself doing some web and game development speed challenges. I'm not a huge fan of speed coding challenges, but thanks to the <span class="label tag-Variety_MEGAJAM_2016"><a href="/projects/VarietyMegajam">Variety MEGAJAM 2016</a></span> game jam, I had a real reason to do some rushed development. The idea is to make 10 games in 10 different genres in 10 days, so I knew if I was to succeed, I would have to work very fast. With a full time dayjob, and other daily responsibilities, I knew I had to finish a game in around 2 hours.

Timelapses have been the key to my progress so far. I have currently made 7 games in the last 7 days for this game jam, and with the weekend coming up, I have no doubt that I will be able to complete the challenge. The games have taken between 1.5 and 4.5 hours to complete each day, but I have gotten very close to my desired 2 hours average. Knowing that the timelapse is constantly running really put me in a focused and productive mindset. I wanted to finish the game as quickly as possible, but also do good and clean work that other people could actually follow. It also greatly helped to avoid distractions like chat and Twitter. You can't take a "quick" break when your screen is being recorded!

## How?

I use 2 tools: [Chronolapse](https://www.chronolapse.com/) and [ffmpeg](https://www.ffmpeg.org/download.html)

1. Download and run Chronolapse
2. Set the Time Between Captures to however many seconds you want (I like 1 second intervals)
3. Click Configure for Screenshots and set your save folder and set the file format to png
4. Just click Start Capture when you're ready, and Stop Capture when you're done

When you're done with capturing you should have a folder full of raw screenshots. This is where things get tricky.

You can use Chronolapse's default video encoding system, but it outputs really poor quality videos. Instead we will use ffmpeg directly using a trick that this [random Ludum Dare post](http://ludumdare.com/compo/2013/05/01/higher-quality-video-workaround-for-chronolapse/) explains.

1. Download and extract ffmpeg
2. Open your screenshot folder
3. Select the very first image (this is important!)
4. Press ctrl + A to select all the images
5. Press F2 and rename the first image to "img"
6. You should now have a folder full of images that are named in order
7. Open a command line in this folder and run the following command to call ffmpeg and process the screenshots into a video

{% highlight text %}
ffmpeg.exe -r 20 -i "img (%d).png" -q:v 1 -b:v 1500k timelapse.mp4
{% endhighlight %}

You should change the "ffmpeg.exe" part to wherever ffmpeg.exe resides on your computer, and you can also change the -r parameter to a framerate other than 20 depending on how fast you want the timelapse to go.

## Bonus 

I've also done a web development speed challenge!  

<p style="text-align: center;">
	<iframe width="560" height="315" src="https://www.youtube.com/embed/Th3hRAeCIcM" frameborder="0" allowfullscreen></iframe>
	<br>
	<i>A simple .NET MVC app speed development.</i>
</p>

As you can see, the quality is really bad since this was made using Chronolapse's default video encoding. I think I'll try to do more random web timelapses like this! It certainly makes some of grunt work more exciting and interesting.