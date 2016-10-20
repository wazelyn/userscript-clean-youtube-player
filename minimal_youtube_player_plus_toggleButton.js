// ==UserScript==
// @name       Actually edit the in-frame Youtube player
// @include    https://www.youtube.com/watch*
// @include    http://www.youtube.com/watch*
// @grant      GM_getValue
// @grant      GM_setValue
// @require    http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @run-at     document-start
// @priority   9001
// ==/UserScript==

$( document ).ready(function() {

function addBackground()
{
	document.body.style.background="#2F2F2F";
	//alternative: copy and paste the url for the desired background image here
	//var mybackgroundimage == "http://i.imgur.com/[YOURURLHERE].png";
	//document.body.style.backgroundImage="url("+mybackgroundimage+")";
}

function toggletopbar()
{
	//hide the top search bar on video pages since I never use it on video pages but do use it on search result pages and adblock can't block one without blocking both
	var pageurl = location.href.replace("http://","");
	if (pageurl.indexOf("/watch") !== -1)
	{
		$("#yt-masthead-container").toggle();
		$("#masthead-positioner-height-offset").toggle();
		$('#placeholder-player').css({'opacity' : 0});
		$('#placeholder-player').css('pointer-events', 'none'); //this makes the button clickable from beneath the transparent placeholder div
		//these placeholder tweaks also break savetube. Hmm.
		//Find this line in SaveTube and change "placeholder-player" to "player-api". Done.
	}
	return;
}

//2015-05-12 player-playlist is misalligned
function tweakPlayer()
{
	document.getElementById("player").className = "      watch-medium  ";
	document.getElementById("watch7-container").className = "      watch-wide  ";
	document.getElementById("player-api").style['boxShadow'] = "0px 0px 15px #000000";
	//default player size, 1.6745 width to height ratio
	//document.getElementById("player-api").style['width'] = "640px";
	document.getElementById("player-api").style['width'] = window.innerWidth*0.67;
	//document.getElementById("player-api").style['height'] = "360px";
	document.getElementById("player-api").style['height'] = window.innerWidth / 1.6745;
	//2015-04-29 edits: center the new player-api, and make its background transparent without making the show button and SaveTube transparent.
	$('#player-api').css('backgroundColor', "transparent");
	//$('#player-api').css('left', "16%"); //ok for recentering half-screen page.
	$('#player-api').css('left', window.innerWidth*0.16); //ok for recentering half-screen page.
	if (document.getElementById('player-playlist') !== null) //2015-05-12 player-playlist is misalligned
	{
		//$('#player-playlist').css('left', "16%");
		$('#player-playlist').css('left', window.innerWidth*0.16);
		//$('#player-playlist').hide();
	}
	//$('#player-api').css('top', window.innerHeight*0.26); //ok for recentering half-screen page.
	//$('#player-api').css('margin-bottom', window.innerHeight*0.34); //ok for recentering half-screen page.
	//add padding so the player is centered, and the description title appears just at the bottom when unhidden
	//createPlayerPadding();
	$('#placeholder-player').css({'opacity' : 0});
	$('#placeholder-player').css('pointer-events', 'none'); //this makes the button clickable from beneath the transparent placeholder div
	//toggletopbar();
	//$('#yt-masthead-container').css('background-color', 'black');
	//$('#yt-masthead-container').css('border-color', 'black');
	//$('#masthead-search-terms').css('background-color', 'black');
}
function createPlayerPadding()
{
	var elmFoo = document.getElementById('player-api');
	var elmNewContent = document.createElement('div');
	//elmNewContent.id = 'elmNewContent';
	//$('#elmNewContent').css('top', window.innerHeight*0.26);
	var paddingAbovePlayer = (window.innerHeight*0.26);
	elmNewContent.style.padding = paddingAbovePlayer + "px 0px 0px 0px";
	elmFoo.parentNode.insertBefore(elmNewContent, elmFoo);
	
	var elmNewContent2 = document.createElement('div');
	var paddingBelowPlayer = (window.innerHeight*0.18);
	elmNewContent2.style.padding = paddingBelowPlayer + "px 0px 0px 0px";
	elmFoo.parentNode.insertBefore(elmNewContent2, elmFoo.next);
	return;
}

function addInvisibleToggleCommentsButton()
{
	var togb = document.createElement('input');
	togb.setAttribute('id','excludeme');
	togb.setAttribute('type','button');
	togb.setAttribute('value',"\u00A0");
	togb.setAttribute('style','margin-left:34%;margin-right:auto');
	togb.setAttribute('pointer-events','none');
	togb.setAttribute('class', 'yt-uix-button yt-uix-button-text yt-uix-button-size-default');
	togb.style.paddingLeft = "16%";
	togb.style.paddingRight = "16%";
	//var place = document.getElementById("page"); //[][][]2015-04-29 try something else to get the button below the video
	//place.insertBefore(togb, place.childNodes[4]); //this is the old, broken line
	//[][][]2015-04-29 Youtube removed the element that I insert the toggle button before, so let's change it.
	var place = document.getElementById("player-api");
	place.insertBefore(togb, place.childNodes[99]); //Changed this from childNodes[0].nextSibling to childNodes[99], which works to put it below the SaveTube header.
	togb.addEventListener('click', function() { toggle(); }, false);
}

function toggle()
{
	var arr = ["content"]; // Array of elements
	var length = arr.length,
		element = null;
	for (var i = 0; i < length; i++)
	{
		element = arr[i];
		if (((GM_getValue(element, true)) == true) && (document.getElementById(element) && element !== "excludeme" && element !== "movie_player" && element !== "player-api"))
		{
			var div = document.getElementById(element);
			if (div.style.display == "none") { div.style.display = ""; } else {(div.style.display = "none") };
		}
		//2015-05-12 player-playlist is misalligned. Also it won't hide for some reason
		if (document.getElementById('player-playlist') !== null)
		{
			playlistdiv = document.getElementById('player-playlist');
			if (playlistdiv.style.display == "none") { playlistdiv.style.display = ""; } else {(playlistdiv.style.display = "none") };
		}
	}
	//toggletopbar();
}

addBackground();
toggle();
toggletopbar();
createPlayerPadding();
tweakPlayer();
var addbuttoninterval = setInterval (function(){
	addInvisibleToggleCommentsButton();
	clearInterval(addbuttoninterval); //wait to add the button, then only add it once
},1000);
var retweakplayer = setInterval (function(){
	tweakPlayer();
	//clearInterval(addbuttoninterval);
},1000);
//2016-10-20-1000-19 How to stop autoplay?
	//in firefox, go to about:config and set media.autoplay.enabled to false. Instead of annoying autoplay, you now have annoying click several times to play video. Take that, youtube!
	//you really want it, don't you, you really want it? so you click the video twice, instead of letting youtube force-feed it to you like you're a fucking zoo animal. Right? take some independent action to get what you want.
		//also, that autoplay feature is disgusting. turn it off! I mean, the one for unrelated videos. Like I hit "next video" and it's not even a playlist, but something completely different. what the fuck?

//how to stop related video recommendations? in the youtube HTML5 player, adblock can block

//debug. this is one way to check where the element I'm selecting is on the current page.
/*
//toggle();
//document.body.innerHTML = document.getElementById("watch7-container").className+"<br>"+"hi"+document.body.innerHTML;
//document.body.innerHTML = document.getElementById("watch7-main").id+"<br>"+"hi"+document.body.innerHTML;
//document.body.innerHTML = document.getElementById("placeholder-player").id+"<br>"+"hi"+document.body.innerHTML;
//document.body.innerHTML = document.getElementById("player-api").childNodes[0].childNodes[0].id+"<br>"+"hi"+document.body.innerHTML;
//document.body.innerHTML = newvidurl + "<br>" + "hi" + document.body.innerHTML;
*/
});
