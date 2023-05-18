"use strict";
(function () {

// Global variables
const userAgent = navigator.userAgent.toLowerCase();
const initialDate = new Date();

const $document = $(document);
const $window = $(window);
const $html = $("html");
const $body = $("body");

const isDesktop = $html.hasClass("desktop");
const isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let windowReady = false;
let isNoviBuilder = false;
const pageTransitionAnimationDuration = 500;
let loaderTimeoutId;

// Plugins
const plugins = {
  bootstrapTooltip: $("[data-toggle='tooltip']"),
  bootstrapModalDialog: $('.modal'),
  bootstrapTabs: $(".tabs-custom"),
  rdNavbar: $(".rd-navbar"),
  maps: $(".google-map-container"),
  rdMailForm: $(".rd-mailform"),
  rdInputLabel: $(".form-label"),
  regula: $("[data-constraints]"),
  wow: $(".wow"),
  owl: $(".owl-carousel"),
  swiper: $(".swiper-slider"),
  counter: $(".counter"),
  preloader: $(".preloader"),
  captcha: $('.recaptcha'),
  lightGallery: $("[data-lightgallery='group']"),
  lightGalleryItem: $("[data-lightgallery='item']"),
  lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
  mailchimp: $('.mailchimp-mailform'),
  campaignMonitor: $('.campaign-mailform'),
  copyrightYear: $(".copyright-year"),
  buttonWinona: $('.button-winona')
};


	/**
 * @desc Verifica si el elemento se ha desplazado dentro de la vista
 * @param {object} elem - Objeto jQuery
 * @return {boolean}
 */
function isScrolledIntoView(elem) {
	if (isNoviBuilder) return true;
	return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
  }
  
  /**
   * @desc Llama a una función cuando el elemento se ha desplazado dentro de la vista
   * @param {object} element - Objeto jQuery
   * @param {function} func - Función de inicialización
   */
  function lazyInit(element, func) {
	const scrollHandler = function() {
	  if (!element.hasClass('lazy-loaded') && isScrolledIntoView(element)) {
		func.call();
		element.addClass('lazy-loaded');
	  }
	};
  
	scrollHandler();
	$window.on('scroll', scrollHandler);
  }
  
  // Inicializa los scripts que requieren una página cargada
  $window.on('load', function() {
	// Cargador de página y transición de página
	if (plugins.preloader.length && !isNoviBuilder) {
	  pageTransition({
		target: document.querySelector('.page'),
		delay: 0,
		duration: pageTransitionAnimationDuration,
		classActive: 'animated',
		conditions: function(event, link) {
		  return !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link) &&
			!event.currentTarget.hasAttribute('data-lightgallery') &&
			event.currentTarget.getAttribute('href') !== 'javascript:void(0);';
		},
		onTransitionStart: function(options) {
		  setTimeout(function() {
			plugins.preloader.removeClass('loaded');
		  }, options.duration * 0.75);
		},
		onReady: function() {
		  plugins.preloader.addClass('loaded');
		  windowReady = true;
		}
	  });
	}
  });
  

  $(function() {
	isNoviBuilder = window.xMode;
  
	function toggleSwiperInnerVideos(swiper) {
	  var prevSlide = $(swiper.slides[swiper.previousIndex]),
		nextSlide = $(swiper.slides[swiper.activeIndex]),
		videoItems = prevSlide.find("video");
  
	  videoItems.each(function() {
		this.pause();
	  });
  
	  var videos = nextSlide.find("video");
	  if (videos.length) {
		videos.get(0).play();
	  }
	}
  
	function toggleSwiperCaptionAnimation(swiper) {
	  var prevSlide = $(swiper.container).find("[data-caption-animate]"),
		nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]");
  
	  prevSlide.each(function() {
		var prevSlideItem = $(this);
		prevSlideItem.removeClass("animated")
		  .removeClass(prevSlideItem.attr("data-caption-animate"))
		  .addClass("not-animated");
	  });
  
	  var tempFunction = function(nextSlideItem, duration) {
		return function() {
		  nextSlideItem
			.removeClass("not-animated")
			.addClass(nextSlideItem.attr("data-caption-animate"))
			.addClass("animated");
		  if (duration) {
			nextSlideItem.css('animation-duration', duration + 'ms');
		  }
		};
	  };
  
	  nextSlide.each(function() {
		var nextSlideItem = $(this),
		  delay = nextSlideItem.attr("data-caption-delay"),
		  duration = nextSlideItem.attr('data-caption-duration');
  
		if (!isNoviBuilder) {
		  if (delay) {
			setTimeout(tempFunction(nextSlideItem, duration), parseInt(delay, 10));
		  } else {
			tempFunction(nextSlideItem, duration)();
		  }
		} else {
		  nextSlideItem.removeClass("not-animated");
		}
	  });
	}

/**
 * @desc Inicializa el complemento Owl Carousel
 * @param {object} c - objeto jQuery del carrusel
 */
function initOwlCarousel(c) {
	var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
	  values = [0, 576, 768, 992, 1200, 1600],
	  responsive = {};
  
	for (var j = 0; j < values.length; j++) {
	  responsive[values[j]] = {};
	  for (var k = j; k >= -1; k--) {
		var dataKey = "data" + aliaces[k];
  
		if (!responsive[values[j]]["items"] && c.attr(dataKey + "items")) {
		  responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr(dataKey + "items"), 10);
		}
		if (!responsive[values[j]]["slideBy"] && c.attr(dataKey + "slideBy")) {
		  responsive[values[j]]["slideBy"] = k < 0 ? 1 : parseInt(c.attr(dataKey + "slide-by"), 10);
		}
		if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr(dataKey + "stage-padding")) {
		  responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr(dataKey + "stage-padding"), 10);
		}
		if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr(dataKey + "margin")) {
		  responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr(dataKey + "margin"), 10);
		}
	  }
	}
  
	// Habilitar paginación personalizada
	if (c.attr('data-dots-custom')) {
	  c.on("initialized.owl.carousel", function (event) {
		var carousel = $(event.currentTarget),
		  customPag = $(carousel.attr("data-dots-custom")),
		  active = carousel.attr('data-active') ? parseInt(carousel.attr('data-active'), 10) : 0;
  
		carousel.trigger('to.owl.carousel', [active, 300, true]);
		customPag.find("[data-owl-item='" + active + "']").addClass("active");
  
		customPag.find("[data-owl-item]").on('click', function (e) {
		  e.preventDefault();
		  carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
		});
  
		carousel.on("translate.owl.carousel", function (event) {
		  customPag.find(".active").removeClass("active");
		  customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active");
		});
	  });
	}
  
	c.on("initialized.owl.carousel", function () {
	  initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
	});
  
	c.owlCarousel({
	  autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
	  autoplayTimeout: c.attr("data-autoplay-timeout") ? parseInt(c.attr("data-autoplay-timeout"), 10) : 100,
	  autoplaySpeed: c.attr("data-autoplay-speed") ? parseInt(c.attr("data-autoplay-speed"), 10) : 2800,
	  autoplayHoverPause: true,
	  loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
	  items: 1,
	  lazyLoad: true,
	  center: c.attr("data-center") === "true",
	  navContainer: c.attr("data-navigation-class") || false,
	  mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
	  nav: c.attr("data-nav") === "true",
	  dots: c.attr("data-dots") === "true",
	  dotsContainer: c.attr("data-pagination-class") || false,
	  dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
	  dotsSpeed: c.attr("data-dots-speed") ? parseInt(c.attr("data-dots-speed"), 10) : false,
	  animateIn: c.attr('data-animation-in') || false,
	  animateOut: c.attr('data-animation-out') || false,
	  responsive: responsive,
	  navText: function () {
		try {
		  return JSON.parse(c.attr("data-nav-text"));
		} catch (e) {
		  return [];
		}
	  }(),
	  navClass: function () {
		try {
		  return JSON.parse(c.attr("data-nav-class"));
		} catch (e) {
		  return ['owl-prev', 'owl-next'];
		}
	  }()
	});
  }
  

		/**
		 * @desc Check if all elements pass validation
		 * @param {object} elements - object of items for validation
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function isValidated(elements, captcha) {
			var results, errors = 0;

			if (elements.length) {
				for (var j = 0; j < elements.length; j++) {

					var $input = $(elements[j]);
					if ((results = $input.regula('validate')).length) {
						for (k = 0; k < results.length; k++) {
							errors++;
							$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
						}
					} else {
						$input.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (captcha) {
					if (captcha.length) {
						return validateReCaptcha(captcha) && errors === 0
					}
				}

				return errors === 0;
			}
			return true;
		}


		function initBootstrapTooltip(tooltipPlacement) {
			plugins.bootstrapTooltip.tooltip('dispose');
			const placement = window.innerWidth < 576 ? 'bottom' : tooltipPlacement;
			plugins.bootstrapTooltip.tooltip({ placement });
		}
		

		function initLightGallery(itemsToInit, addClass) {
			if (isNoviBuilder) return;
		  
			$(itemsToInit).lightGallery({
			  thumbnail: $(itemsToInit).data("lg-thumbnail") !== false,
			  selector: "[data-lightgallery='item']",
			  autoplay: $(itemsToInit).data("lg-autoplay") === true,
			  pause: parseInt($(itemsToInit).data("lg-autoplay-delay"), 10) || 5000,
			  addClass: addClass,
			  mode: $(itemsToInit).data("lg-animation") || "lg-slide",
			  loop: $(itemsToInit).data("lg-loop") !== false,
			});
		  }
		  

		  function initDynamicLightGallery(itemsToInit, addClass) {
			if (isNoviBuilder) return;
		  
			$(itemsToInit).on("click", function () {
			  $(this).lightGallery({
				thumbnail: $(this).data("lg-thumbnail") !== false,
				selector: "[data-lightgallery='item']",
				autoplay: $(this).data("lg-autoplay") === true,
				pause: parseInt($(this).data("lg-autoplay-delay"), 10) || 5000,
				addClass: addClass,
				mode: $(this).data("lg-animation") || "lg-slide",
				loop: $(this).data("lg-loop") !== false,
				dynamic: true,
				dynamicEl: JSON.parse($(this).data("lg-dynamic-elements")) || [],
			  });
			});
		  }
		  
		  function initLightGalleryItem(itemToInit, addClass) {
			if (isNoviBuilder) return;
		  
			$(itemToInit).lightGallery({
			  selector: "this",
			  addClass: addClass,
			  counter: false,
			  youtubePlayerParams: {
				modestbranding: 1,
				showinfo: 0,
				rel: 0,
				controls: 0,
			  },
			  vimeoPlayerParams: {
				byline: 0,
				portrait: 0,
			  },
			});
		  }
		  

		  function initWinonaButtons(buttons) {
			for (var i = 0; i < buttons.length; i++) {
			  var $button = $(buttons[i]);
			  var innerContent = $button.html();
		  
			  $button.empty().append(
				$('<div>', { class: 'content-original', html: innerContent }),
				$('<div>', { class: 'content-dubbed', html: innerContent })
			  );
			}
		  }
		  

		  if (navigator.platform.match(/Mac/i)) {
			$html.addClass("mac-os");
		  }
		  
		// Bootstrap Tooltips
		if (plugins.bootstrapTooltip.length) {
			var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
			initBootstrapTooltip(tooltipPlacement);

			$window.on('resize orientationchange', function () {
				initBootstrapTooltip(tooltipPlacement);
			})
		}

		// Stop video in bootstrapModalDialog
		if (plugins.bootstrapModalDialog.length) {
			plugins.bootstrapModalDialog.on('hidden.bs.modal', function() {
			var activeModal = $(this),
				rdVideoInside = activeModal.find('video'),
				youTubeVideoInside = activeModal.find('iframe');
		
			if (rdVideoInside.length) {
				rdVideoInside[0].pause();
			}
		
			if (youTubeVideoInside.length) {
				var videoUrl = youTubeVideoInside.attr('src');
		
				youTubeVideoInside.attr('src', '').attr('src', videoUrl);
			}
			});
		}
  

		// Copyright Year (Evaluates correct copyright year)
if (plugins.copyrightYear.length) {
	plugins.copyrightYear.text(initialDate.getFullYear());
  }
  
  // UI To Top
  if (isDesktop && !isNoviBuilder) {
	$().UItoTop({
	  easingType: 'easeOutQuad',
	  containerClass: 'ui-to-top'
	});
  }
  
  // RD Navbar
  if (plugins.rdNavbar.length) {
	var responsiveNavbar = {};
  
	for (var i = 0; i < plugins.rdNavbar.length; i++) {
	  var $rdNavbar = $(plugins.rdNavbar[i]);
  
	  var layout = $rdNavbar.attr('data-layout');
	  var deviceLayout = $rdNavbar.attr('data-device-layout');
	  var focusOnHover = $rdNavbar.attr('data-hover-on') === 'true';
	  var autoHeight = $rdNavbar.attr('data-auto-height') === 'true';
	  var stickUp = false;
	  var stickUpOffset = $rdNavbar.attr('data-stick-up-offset');
  
	  if (!isNoviBuilder) {
		stickUp = $rdNavbar.attr('data-stick-up') === 'true' && !$rdNavbar.parents('.layout-navbar-demo').length;
	  }
  
	  responsiveNavbar[0] = {
		layout: layout,
		deviceLayout: deviceLayout,
		focusOnHover: focusOnHover,
		autoHeight: autoHeight,
		stickUp: stickUp,
		stickUpOffset: stickUpOffset
	  };
  
	  $rdNavbar.RDNavbar({
		anchorNav: !isNoviBuilder,
		stickUpClone: ($rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $rdNavbar.attr("data-stick-up-clone") === 'true' : false,
		responsive: responsiveNavbar
	  });
  
	  if ($rdNavbar.attr("data-body-class")) {
		document.body.className += ' ' + $rdNavbar.attr("data-body-class");
	  }
	}
  }
  

		// RD Input Label
if (plugins.rdInputLabel.length) {
	plugins.rdInputLabel.RDInputLabel();
  }
  
  // Swiper
  if (plugins.swiper.length) {
	for (var i = 0; i < plugins.swiper.length; i++) {
	  var s = $(plugins.swiper[i]);
	  var swiperSlide = s.find(".swiper-slide");
  
	  swiperSlide.each(function() {
		var $this = $(this);
		var url = $this.attr("data-slide-bg");
  
		if (url) {
		  $this.css({
			"background-image": "url(" + url + ")",
			"background-size": "cover"
		  });
		}
	  });
  
	  s.swiper({
		autoplay: !isNoviBuilder && $.isNumeric(s.attr('data-autoplay')) ? s.attr('data-autoplay') : false,
		direction: s.attr('data-direction') || "horizontal",
		effect: s.attr('data-slide-effect') || "slide",
		speed: s.attr('data-slide-speed') || 600,
		keyboardControl: s.attr('data-keyboard') === "true",
		mousewheelControl: s.attr('data-mousewheel') === "true",
		mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
		nextButton: s.find(".swiper-button-next").get(0),
		prevButton: s.find(".swiper-button-prev").get(0),
		pagination: s.find(".swiper-pagination").get(0),
		paginationClickable: s.find(".swiper-pagination").attr("data-clickable") !== "false",
		paginationBulletRender: s.find(".swiper-pagination").attr("data-index-bullet") === "true" ? function (swiper, index, className) {
		  return '<span class="' + className + '">' + (index + 1) + '</span>';
		} : null,
		scrollbar: s.find(".swiper-scrollbar").get(0),
		scrollbarDraggable: s.find(".swiper-scrollbar").attr("data-draggable") !== "false",
		scrollbarHide: s.find(".swiper-scrollbar").attr("data-draggable") === "false",
		loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
		simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
		onTransitionStart: function (swiper) {
		  toggleSwiperInnerVideos(swiper);
		},
		onTransitionEnd: function (swiper) {
		  toggleSwiperCaptionAnimation(swiper);
		},
		onInit: function (swiper) {
		  toggleSwiperInnerVideos(swiper);
		  toggleSwiperCaptionAnimation(swiper);
		  initLightGalleryItem(s.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
		}
	  });
	}
  }

// lightGallery
if (plugins.lightGallery.length) {
	plugins.lightGallery.forEach(function (element) {
	  initLightGallery(element);
	});
  }
  
  // lightGallery item
  if (plugins.lightGalleryItem.length) {
	var notCarouselItems = plugins.lightGalleryItem.filter(function (element) {
	  return (
		!$(element).parents(".owl-carousel").length &&
		!$(element).parents(".swiper-slider").length
	  );
	});
  
	notCarouselItems.forEach(function (element) {
	  initLightGalleryItem(element);
	});
  }
  
  // Dynamic lightGallery
  if (plugins.lightDynamicGalleryItem.length) {
	plugins.lightDynamicGalleryItem.forEach(function (element) {
	  initDynamicLightGallery(element);
	});
  }
  
  // jQuery Count To
  if (plugins.counter.length) {
	plugins.counter
	  .not(".animated")
	  .each(function () {
		var $counter = $(this);
		$document.on("scroll", function () {
		  if (!$counter.hasClass("animated") && isScrolledIntoView($counter)) {
			$counter.countTo({
			  refreshInterval: 40,
			  from: 0,
			  to: parseInt($counter.text(), 10),
			  speed: $counter.attr("data-speed") || 1000,
			  formatter: function (value, options) {
				value = value.toFixed(options.decimals);
				if (value > 10000) {
				  var newValue = "",
					stringValue = value.toString();
  
				  for (var k = stringValue.length; k >= 0; k -= 3) {
					if (k <= 3) {
					  newValue = " " + stringValue.slice(0, k) + newValue;
					} else {
					  newValue = " " + stringValue.slice(k - 3, k) + newValue;
					}
				  }
  
				  return newValue;
				} else {
				  return value;
				}
			  },
			});
			$counter.addClass("animated");
		  }
		});
	  })
	  .trigger("scroll");
  }
  
  // Winona buttons
  if (plugins.buttonWinona.length && !isNoviBuilder) {
	initWinonaButtons(plugins.buttonWinona);
  }
  
  // Google maps
  if (plugins.maps.length) {
	lazyInit(plugins.maps, initMaps);
  }
  

	});
}());
