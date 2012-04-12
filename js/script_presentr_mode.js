/*
	Author: Olaf J. Horstmann
*/

var slide, numSlides, currentSlide, isHttp;
var refreshRate=33, ms=0;


// INIT CALL
	$(document).ready(function() {
		localStorage.clear();
		$.address.strict(false);
		currentSlide = getSlideFromURL();

		addListeners();
		localStorage['initRequest'] = '1';
		//updateSlide(0);
	});
//\INIT CALL

function addListeners() {
	window.onunload = function() {
		localStorage.clear();
		return true;
	};
	$('#start').mouseup(onStart);

	$(document).bind("contextmenu",function(e){
		return false;
	});

	if ( document.location.href.toLowerCase().indexOf('http') >= 0 ) {
		$(window).bind("storage",onStorageChange);
	} else {
		isHttp = false;
	}

	setInterval(onEnterFrame, refreshRate);
}

function onStart(e) {
	ms++;
	$('#navigation').show();
	$('#next').removeAttr("disabled");
	$('#prev').removeAttr("disabled");

	$('#next').mousedown(function() {updateSlide(currentSlide+1);});
	$('#prev').mousedown(function() {updateSlide(currentSlide-1);});
	$('html').keyup(onUserInput);
	//$('html').mousedown(onUserInput);
}

function onUserInput(e) {
	var incr = (e.which == 39 || e.which == 1) ? 1 : (e.which == 37 || e.which == 3) ? -1 : 0;

	incr && updateSlide(currentSlide+incr);
}

function onEnterFrame(e) {
	!isHttp && onStorageChange();
	ms && (ms += refreshRate);

	var minutes = (ms/60000)>>0;
	minutes = (minutes<10)?'0' + minutes : minutes;
	var seconds = ((ms%60000)/1000)>>0;
	seconds = (seconds<10)?'0' + seconds : seconds;
	$('#counter').html('time: ' + minutes + ':' + seconds);
}

function onStorageChange(e) {
	if ( localStorage['numSlides'] != numSlides ) {
		numSlides = localStorage['numSlides'];

		var html = '';
		for (var c = 0; c < numSlides; c++ ) {
			html += ["<div class='innerSlide'>",
						localStorage['note:'+c],
					"</div>"].join('')
		}

		$('#slidesContainer').html(html);
		currentSlide = 0;
		slide = $('#slidesContainer').cycle({
			fx: 'fadeHorizontal',
			speed: 1000,
			slideResize: 0,
			containerResize: 0,
			startingSlide: currentSlide,
			timeout: 0 
		});

		updateSlide(0);
	}
}

function updateSlide(index) {
	if (index < numSlides && index >= 0) {
		currentSlide = index;
		$('#slidesContainer').cycle(currentSlide);
		localStorage['currentSlide'] = currentSlide;
		setURLIndex(currentSlide);
	}
}

function getSlideFromURL(incr) {
	incr = incr || 0;
	var slideIdInURL = parseInt($.address.value()) || setURLIndex(0);

	if (incr) {
		if ( (slideIdInURL+incr) <= numSlides && (slideIdInURL+incr) >= 1 ) {
			slideIdInURL += incr;
			setURLIndex(slideIdInURL);
		}
	}

	return slideIdInURL-1;
}

function setURLIndex(index) {
	$.address.value(index+1);

	return index+1;
}