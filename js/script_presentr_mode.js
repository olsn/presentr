/*
	Author: Olaf J. Horstmann
*/

var slide, numSlides, currentSlide;

// INIT CALL
	$(document).ready(function() {
		localStorage.clear();
		$.address.strict(false);
		currentSlide = getSlideFromURL();

		onResize();
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
	$(window).resize(onResize);

	$('body').keyup(onUserInput);
	$('body').mousedown(onUserInput);

	$(document).bind("contextmenu",function(e){
		return false;
	});

	if ( document.location.href.toLowerCase().indexOf('http') >= 0 ) {
		$(window).bind("storage",onStorageChange);
	} else {
		setInterval(onStorageChange, 33);
	}
}

function onUserInput(e) {
	var incr = (e.which == 39 || e.which == 1) ? 1 : (e.which == 37 || e.which == 3) ? -1 : 0;

	incr && updateSlide(currentSlide+incr);
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

function onResize(e) {
	$('#main').css('margin-top', $(window).height() * 0.08);
	$('#slidesContainer').width($(window).width() * 0.45);
	$('#slidesContainer').height($(window).height() * 0.9);
}