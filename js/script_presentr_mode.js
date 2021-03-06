/*
	Author: Olaf J. Horstmann
*/

var slideContents, slide, numSlides, currentSlide=0, isHttp;
var refreshRate=33, ms=0;

// INIT CALL
	$(document).ready(function() {
		localStorage.clear();
		currentSlide = 0;

		addListeners();
		localStorage['step'] = 0;
		localStorage['initRequest'] = '1';
		//updateSlide(0);
	});
//\INIT CALL

function addListeners() {
	window.onunload = function() {
		localStorage.clear();
		return true;
	};

	$('#open').mouseup(function(e) {window.open('index.html'); $(this).remove();});
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
	//$('#startRow').hide();
	$('#next').removeAttr("disabled");
	$('#prev').removeAttr("disabled");

	$('#next').mousedown(function() {step(1);});
	$('#prev').mousedown(function() {step(-1);});
	$('html').keyup(onUserInput);
	//$('html').mousedown(onUserInput);
}

function onUserInput(e) {
	var incr = (e.which == 39 || e.which == 1) ? 1 : (e.which == 37 || e.which == 3) ? -1 : 0;

	incr && step(incr);
}

function step(incr) {
	var elementStillHidden = false;
	if ( incr > 0 ) {
		$(slideContents).find('.innerSlide').each(function(i, value) {
			if ( i == currentSlide ) {
				$(this).find('.subSlide').each(function(i, value) {
					if ( !elementStillHidden && $(this).css('visibility') != 'visible') {
						$(this).css('visibility', 'visible');
						localStorage['step:'+currentSlide]++;
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
		var slidesHtml = '';
		for (var c = 0; c < numSlides; c++ ) {
			html += ["<div class='innerSlide'>",
						localStorage['note:'+c],
					"</div>"].join('');

			slidesHtml += ["<div class='innerSlide'>",
						localStorage['slide:'+c],
					"</div>"].join('');

			localStorage['step:'+c] = 0;
		}

		slideContents = $('<div>'+slidesHtml+'</div>');
		$('#slidesContainer').html(html);
		currentSlide = 0;

		$('.innerSlide').animate({left: '15%', opacity: 0}, 0);
		$('.innerSlide').hide();

		updateSlide(0, true);
	}
}

function updateSlide(index, init) {
	if (index < numSlides && index >= 0) {
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
		localStorage['currentSlide'] = currentSlide;
	}
}