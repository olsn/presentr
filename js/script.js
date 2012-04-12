/*
	Author: Olaf J. Horstmann
*/

var slide, numSlides, currentSlide, dw=1200, dh=900;

// INIT CALL
	$(document).ready(function() {
		if ( !checkForPresentr() ) {
			initialize();
		}

		onResize();
		addListeners();
	});
//\INIT CALL

function initialize() {
	$.address.strict(false).history(false);
	currentSlide = localStorage["currentSlide"] || getSlideFromURL();
	numSlides = $('#slidesContainer .innerSlide').length;

	$('.subSlide').each(function(i, value) {
		$(this).css('visibility','hidden');
	});

	$('.innerSlide').each(function(i, value) {
		var noteElement = $(this).find('.note');
		var note = noteElement.html() ? noteElement.html() : $(this).html();
		localStorage['note:'+i] = note;
		localStorage['slide:'+i] = $(this).html();
	});
	localStorage['numSlides'] = numSlides;

	slide = $('#slidesContainer').cycle({
		fx: 'fadeHorizontal',
		speed: 1000,
		slideResize: 0,
		containerResize: 0,
		startingSlide: currentSlide,
		timeout: 0 
	});

	localStorage['initRequest'] = '0';
}

function addListeners() {
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
	if ( localStorage['presentrMode'] != '1') {
		var incr = (e.which == 39 || e.which == 1) ? 1 : (e.which == 37 || e.which == 3) ? -1 : 0;

		incr && updateSlide(currentSlide+incr);
	}
}

function updateSlide(index) {
	currentSlide = index;
	$('#slidesContainer').cycle(currentSlide);
	setURLIndex(currentSlide);
}

function checkForPresentr() {
	if ( localStorage['initRequest'] == '1' ) {
		localStorage['presentrMode'] = '1';
		initialize();
		return true;
	}

	return false;
}

function onStorageChange(e) {
	checkForPresentr();

	if ( localStorage["currentSlide"] != undefined && currentSlide != parseInt(localStorage["currentSlide"]) ) {
		updateSlide(parseInt(localStorage["currentSlide"]));
	} else if ( localStorage['presentrMode'] != '1' ) {
		var urlIndex = getSlideFromURL();
		if ( urlIndex != currentSlide ) {
			updateSlide(urlIndex);
		}
	}

	if ( localStorage['step:'+currentSlide] > 0 ) {
		$('#slidesContainer').children().each(function(i, value) {
			if ( i == currentSlide ) {
				$(this).find('.subSlide').each(function(i, value) {
					if ( i < localStorage['step:'+currentSlide] && $(this).css('visibility') == 'hidden') {
						$(this).fadeOut(0);
						$(this).fadeIn();
						$(this).css('visibility', 'visible');
					}
				});
			}
		});
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
	var nh = $(window).height();
	var nw = $(window).width();
	var s = Math.min(nh/dh,nw/dw);


	$('#main').css('margin-top', $(window).height() * 0.08);
	$('#slidesContainer').width($(window).width() * 0.60);
	$('#slidesContainer').height($(window).height() * 0.9);

	$('h1').each(function(i, value) {
		$(this).css('font-size', (14*s) + 'mm');
	});

	$('li').each(function(i, value) {
		$(this).css('font-size', (10*s) + 'mm');
		$(this).css('line-height', (24*s) + 'mm');
	});
}