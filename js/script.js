/*
	Author: Olaf J. Horstmann
*/

var slide, numSlides, currentSlide;

// INIT CALL
	$(document).ready(function() {
		$.address.strict(false);
		currentSlide = getSlideFromURL();
		numSlides = $('#slidesContainer .innerSlide').length;

		slide = $('#slidesContainer').cycle({
			fx: 'fadeHorizontal',
			speed: 1000,
			slideResize: 0,
			containerResize: 0,
			startingSlide: currentSlide,
    		timeout: 0 
		});

		$('#main').css('margin-top', $(window).height() * 0.08);
		$('#slidesContainer').width($(window).width() * 0.45);
		$('#slidesContainer').height($(window).height() * 0.9);

		addListeners();
	});
//\INIT CALL

function addListeners() {
	$.address.externalChange(function(event) {
		$('#slidesContainer').cycle(getSlideFromURL());
	});

	$(window).resize(function(){
		$('#main').css('margin-top', $(window).height() * 0.08);
		$('#slidesContainer').width($(window).width() * 0.45);
		$('#slidesContainer').height($(window).height() * 0.9);
	});

	$('body').keyup(function(e) {
		if ( e.which == 39 ) {
			$('#slidesContainer').cycle(getSlideFromURL(1));
		} else if ( e.which == 37 ) {
			$('#slidesContainer').cycle(getSlideFromURL(-1));
		}
	});

	$('body').mousedown(function(e) {
		if ( e.which == 1 ) {
			$('#slidesContainer').cycle(getSlideFromURL(1));
		} else if ( e.which == 3 ) {
			$('#slidesContainer').cycle(getSlideFromURL(-1));
		}
	});

	$(document).bind("contextmenu",function(e){
		return false;
	});
}

function getSlideFromURL(incr) {
	incr = incr || 0;
	var slideIdInURL = parseInt($.address.value() || $.address.value(1).value());

	if (incr) {
		if ( (slideIdInURL+incr) <= numSlides && (slideIdInURL+incr) >= 1 ) {
			slideIdInURL += incr;
			$.address.value(slideIdInURL);
		}
	}


	return slideIdInURL-1;
}