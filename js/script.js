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
	if (window==window.top) {
		$.address.strict(false).history(false);
	}
	currentSlide = localStorage["currentSlide"] || getSlideFromURL();
	numSlides = $('#slidesContainer .innerSlide').length;

	$('.subSlide').css('visibility','hidden');

	$('.innerSlide').each(function(i, value) {
		var noteElement = $(this).find('.note');
		var note = noteElement.html() ? noteElement.html() : 'No notes for slide: ' + i;
		localStorage['note:'+i] = note;
		localStorage['slide:'+i] = $(this).html();
		if ( localStorage['presentrMode'] != '1') {
			localStorage['step:'+currentSlide] = 0;
		}
	});
	localStorage['numSlides'] = numSlides;


	//$('.innerSlide').fadeOut(0);
	$('.innerSlide').animate({left: '15%', opacity: 0}, 0);
	$('.innerSlide').hide();

	/*slide = $('#slidesContainer').cycle({
		fx: 'fadeHorizontal',
		speed: 1000,
		slideResize: 0,
		containerResize: 0,
		startingSlide: currentSlide,
		timeout: 0 
	});*/

	localStorage['initRequest'] = '0';

	var percent = ((currentSlide) / numSlides);
	percent = ((currentSlide+(percent)) / numSlides);
	percent = Math.max(1,Math.min(99,Math.round(percent*100)));
	$('.progresspointer').css('left', percent + "%");
	updateSlide(currentSlide, true);
}

function addListeners() {
	$(window).resize(onResize);

	$('body').keyup(onUserInput);
	if ( $('#slidesContainer').attr('data-ignoreMouse') != 'true' ) {
		$('body').mousedown(onMouseInput);
	}

	$(document).bind("contextmenu",function(e){
		return false;
	});

	if ( document.location.href.toLowerCase().indexOf('http') >= 0 ) {
		$(window).bind("storage",onStorageChange);
	} else {
		setInterval(onStorageChange, 33);
	}
}

function onMouseInput(e) {
	if ( localStorage['presentrMode'] != '1') {
		var incr = $('#slidesContainer').find('.innerSlide:eq('+currentSlide+')').attr('data-ignoreMouse') != 'true';

		if ( incr ){
			incr = e.which == 1 ? 1 : e.which == 3 ? -1 : 0;
		}
		incr && step(incr);
	}
}

function onUserInput(e) {
	if ( localStorage['presentrMode'] != '1') {
		var incr = e.which == 39 ? 1 : e.which == 37 ? -1 : 0;

		incr && step(incr);
	}
}

function step(incr) {
	var elementStillHidden = false;
	if ( incr > 0 ) {
		$('#slidesContainer').find('.innerSlide').each(function(i, value) {
			if ( i == currentSlide ) {
				$(this).find('.subSlide').each(function(i, value) {
					if ( !elementStillHidden && $(this).css('visibility') != 'visible') {
						$(this).fadeOut(0);
						$(this).fadeIn();
						$(this).css('visibility', 'visible');
						elementStillHidden = true;
					}
				});
			}
		});
	}

	if ( !elementStillHidden ) {
		updateSlide(currentSlide+incr);
	}
}

function updateSlide(index, init) {

	if ( !localStorage['presentrMode'] && (index >= numSlides || index < 0) ) {
		return;
	}

	var dir = (index > currentSlide)? 0 : 15;
	var adir = (index > currentSlide)? 15 : 0;

	if ( !init ) {
		$('.innerSlide').eq(currentSlide).stop(true, true).animate({left: dir + '%', opacity: 0}, 800, function() {$(this).hide()});
	}
	currentSlide = index;

	var $cslide = $('.innerSlide').eq(currentSlide);

	if ( dir == 0 ) {
		$cslide.find('.subSlide').each(function(i, value) {
			$(this).fadeOut(0);
			$(this).css('visibility', 'hidden');
		});
	} else {
		$cslide.find('.subSlide').each(function(i, value) {
			$(this).fadeIn(0);
			$(this).css('visibility', 'visible');
		});
	}

	$cslide.animate({left: adir + '%', opacity: 0}, 0);
	$cslide.stop(true, true).animate({left: '10%', opacity: 1}, 800);
	$cslide.show();

	//$('#slidesContainer').cycle(currentSlide);
	setURLIndex(currentSlide);
	var percent = ((currentSlide) / numSlides);
	percent = ((currentSlide+(percent)) / numSlides);
	$('.progresspointer').stop(true, true).animate({left: Math.max(1,Math.min(99,Math.round(percent*100))) + "%"}, 900);
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
	if (window!=window.top) {
		return currentSlide;
	}
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
	if (window==window.top) {
		$.address.value(index+1);
	}

	return index+1;
}

function onResize(e) {
	var nh = $(window).height();
	var nw = $(window).width();
	var s = Math.min(nh/dh,nw/dw);


	$('#main').css('margin-top', $(window).height() * 0.08);
	$('#slidesContainer').width($(window).width() * 0.80);
	$('#slidesContainer').height($(window).height() * 0.9);

	$('h1').each(function(i, value) {
		$(this).css('font-size', (46*s) + 'px');
	});

	$('li').each(function(i, value) {
		$(this).css('font-size', (36*s) + 'px');
		$(this).css('line-height', (98*s) + 'px');
	});

	$('p').each(function(i, value) {
		$(this).css('font-size', 20*s + 'px');
		$(this).css('line-height', 26*s + 'px');
	});

	$('.size1').each(function(i, value) {
		$(this).css('font-size', 22*s + 'px');
		$(this).css('line-height', 26*s + 'px');
	});

	$('.size1-2').each(function(i, value) {
		$(this).css('font-size', 22*s + 'px');
		$(this).css('line-height', 32*s + 'px');
	});

	$('.size2').each(function(i, value) {
		$(this).css('font-size', 26*s + 'px');
		$(this).css('line-height', 36*s + 'px');
	});

	$('.size2-4').each(function(i, value) {
		$(this).css('font-size', 26*s + 'px');
		$(this).css('line-height', 50*s + 'px');
	});

	$('.size3').each(function(i, value) {
		$(this).css('font-size', 30*s + 'px');
		$(this).css('line-height', 36*s + 'px');
	});

	$('#agenda li').each(function(i, value) {
		$(this).css('font-size', (38*s) + 'px');
		$(this).css('line-height', (75*s) + 'px');
	});
}