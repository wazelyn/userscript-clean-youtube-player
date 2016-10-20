// ==UserScript==
// @name          Toggle Youtube Comments
// @author	      Jamie Hyde
// @description   Allows Toggling of Youtube Comments and more!
// @match         http://*.youtube.com/watch?*
// @match         http://youtube.com/watch?*
// @match         https://*.youtube.com/watch?*
// @match         https://youtube.com/watch?*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_addStyle
// @version		  0.43
// ==/UserScript==

//youtube updated their layout. put button on line with:  watch8-action-buttons

GM_addStyle("#settingdiv { border-radius: 5px; border: 1px solid #000000; background-color: #FFFFFF; position:fixed; z-index: 200; top: 5px; left: 5px; width:150px; padding: 5px; text-align: center;} \
#TYCMI { width: 120px; height: 20px; line-height: 20px; text-align: left; margin-left: 17px;} #TYCT { font-weight: bold; font-size: 16px; text-decoration: underline; margin-bottom: 10px; }\
#watch7-secondary-actions .yt-uix-button { margin-right: -10px !important; }");

//VARIABLES
GM_registerMenuCommand("TYC Settings", pref);
var seen = false;
var arr = ["watch7-sidebar-contents","watch-discussion","footer-container"]; // Array of elements
var arr2 = ["Sidebar","Comments","Footer"]; // Array of Names
var loaded = false;

// Autohide function
function autohide() {
if (loaded == false) {
var length = arr.length,
	element = null;
for (var i = 0; i < length; i++) {
	element = arr[i];
if ((GM_getValue(element, false)) == true) {
	if (document.getElementById(element)) {
		var div = document.getElementById(element);
		div.style.display = "none";
				}
			}
		}
	}
}

function pref() { //Pref Dialog
if (seen == false) {
	seen = true;
var holder = document.createElement('div');
	holder.setAttribute('ID','settingdiv');
var title = document.createElement('p');
	title.innerHTML = "TYC Settings";
	title.setAttribute('ID','TYCT');
//Make Pref Dialog
	holder.appendChild(title);
	document.body.appendChild(holder);
	menu()
	}
}

function menu() { //Dynamicly make the menu
var holder = document.getElementById("settingdiv");
var length = arr.length,
    element = null;
for (var i = 0; i < length; i++) {
	element = arr[i];	
var text = document.createElement('p');
	text.innerHTML = arr2[i];
	text.setAttribute("id","TYCMI");
var check = document.createElement('input');
	check.type = "checkbox";
	check.name = arr[i];
	check.style.cssFloat = "right";

// Tick if hidden
var setting = (GM_getValue(element, false));
if (setting == true) { (check.checked = true); }
check.addEventListener("click", function () { if (this.checked == true) { (GM_setValue(this.name, true));} else { (GM_setValue(this.name, false));}}, false);
text.appendChild(check);
holder.appendChild(text);
}
var refresh = document.createElement('a');
	refresh.innerHTML = "Refresh";
	refresh.setAttribute('class', 'yt-uix-button yt-uix-button-default');
	refresh.style.marginTop = "5px";
	refresh.setAttribute("onClick","javascript: window.location.reload()");
	holder.appendChild(refresh);
var close = document.createElement('a');
	close.innerHTML = "Close";
	close.style.margin = "5px 0 0 5px";
	close.setAttribute('class', 'yt-uix-button yt-uix-button-default');
	close.addEventListener('click', function() { document.body.removeChild(holder); seen = false;}, false);
	holder.appendChild(close);
}

function addButton() { //Add the button
var togb = document.createElement('input');
	togb.setAttribute('type','button');
	togb.setAttribute('value','Comments');
	togb.style.margin = "2px 0px 0px 264px"; //added this after installing a video downloader that adds a button to the exact same place
	togb.setAttribute('class', 'yt-uix-button yt-uix-button-text yt-uix-button-size-default ');
	//var place = document.getElementById("watch7-secondary-actions");
	var place = document.getElementById("watch8-action-buttons");
	place.insertBefore(togb, place.firstChild);
	togb.addEventListener('click', function() { toggle(); }, false);
}

function toggle() {
var length = arr.length,
	element = null;
for (var i = 0; i < length; i++) {
	element = arr[i];
if (((GM_getValue(element, true)) == true) && (document.getElementById(element))) {
	var div = document.getElementById(element);
	if (div.style.display == "none") { div.style.display = ""; } else {(div.style.display = "none") };
		}
	}
}

//onLoad Page
document.addEventListener('load', function() { autohide(); loaded = true;}, true);
addButton()
toggle()
//[] the above toggle hides comments and related videos by default. Comment it out if you want to see them by default.
