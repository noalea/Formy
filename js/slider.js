var inputCtrl = (function () {

  var marginTop = 0;
  var maxMargin = 0;
  var MIN_MARGIN = 0;


  function nextSection(slideNum) {
    marginTop = 0;
    maxMargin = 0;
    slider.nextSection(slideNum);
  }

  function nextInput(e) {
    var boxHeight, firstContainer, marginSelector;
    var inputCondition = e.target.className === "inputArea" || e.target.className === "input-group" || e.target.className === "input-label" || e.target.id === "up" || e.target.id === "down";
    if (inputCondition) {
      if (e.type == "mousewheel") {
        marginSelector = e.currentTarget;
      }
      else if (e.type == "keyup") {
        marginSelector = e.currentTarget.offsetParent.offsetParent;
      }
      else if (e.type == "click") {
        marginSelector = e.currentTarget.offsetParent.offsetParent.offsetParent;
      }
      // Get current section margin-top
      marginTop = $(marginSelector.firstElementChild).css('marginTop');
      marginTop = parseInt(marginTop.replace(/[^0-9]/g, ''));
      boxHeight = $('.box')[0].clientHeight;
      maxMargin = (marginSelector.children.length - 1) * boxHeight;

      if (marginTop < maxMargin) {
        marginTop += boxHeight;
        firstContainer = marginSelector.firstElementChild;
        $(firstContainer).css('margin-top', '-' + marginTop + 'px');
      }
    }
  }

  function prevInput(e) {
    var boxHeight, firstContainer, marginSelector;
    var inputCondition = e.target.className === "inputArea" || e.target.className === "input-group" || e.target.className === "input-label" || e.target.id === "up" || e.target.id === "down";
    if (inputCondition) {
      if (e.type == "mousewheel") {
        marginSelector = e.currentTarget;
      }
      else if (e.type == "click") {
        marginSelector = e.currentTarget.offsetParent.offsetParent.offsetParent;
      }
      // Get current section margin-top
      marginTop = $(marginSelector.firstElementChild).css('marginTop');
      marginTop = parseInt(marginTop.replace(/[^0-9]/g, ''));
      if (marginTop <= maxMargin) {
        boxHeight = $('.box')[0].clientHeight;

        if (marginTop > MIN_MARGIN) {
          marginTop -= boxHeight;
          firstContainer = marginSelector.firstElementChild;
          $(firstContainer).css('margin-top', '-' + marginTop + 'px');
        }
      }
    }
  }

  function checkNext(e) {
    var boxParent, numOfInputs, currInputNum, inputID, slideNum, boxParentID;
    boxParent = e.currentTarget.offsetParent.offsetParent;
    numOfInputs = $(boxParent).children().length;
    inputID = e.currentTarget.id;
    currInputNum = inputID.split('-')[1];
    boxParentID = $(boxParent)[0].id;
    slideNum = boxParentID.split('_')[1];

    console.log(e);

    if (currInputNum == numOfInputs) {
      nextSection(slideNum);
    }
    else if (currInputNum < numOfInputs) {
      nextInput(e);
    }
  }

  function toInput(e, direction) {
    if (direction === "down") {
      nextInput(e);
    }
    else if (direction === "up") {
      prevInput(e);
    }
  }

  return {
    next: checkNext,
    toDesiredInput: toInput
  };

})();


var slider = (function (inputCtrl) {

  var lefts = [];

  function boxes() {
    var boxes, boxItems;
    boxes = document.querySelectorAll('.box');
    boxItems = [].slice.call(boxes);
    return boxItems;
  }

  function nextSection(currSlideNum) {
    updateSliderPosition(currSlideNum);
    updateCurrentSlideButton(parseInt(currSlideNum) + 1);
  }

  function currentSlide(n) {
    return n;
  }

  function updateSliderPosition(currSlideNum) {
    width = $('.box')[0].clientWidth;
    space = ((window.innerWidth / 2) + (width / 3) - width);
    minus = (space + (width / 6)); // - (space + quarter of box width)
    translate = 'translateX(-' + (lefts[currSlideNum] - minus) + 'px)';

    $('.slider').css({
      '-webkit-transform' : translate,
      '-moz-transform'    : translate,
      '-ms-transform'     : translate,
      '-o-transform'      : translate,
      'transform'         : translate
    });
  }

  function updateCurrentSlideButton(slideBtnToActive, e) {
    var slideButtons, slideNum;
    slideButtons = $('.slide');
    $.each(slideButtons , function (i, val) {
      slideNum = val.id.split('_')[1];
      if (slideNum == slideBtnToActive) {
        $(val).addClass('activeBox');
      } else {
        $(val).removeClass('activeBox');
      }
    });
  }

  function setupBoxes() {
    var boxItems, width, px, translate, active, i, currBox, w;
    boxItems = boxes();
    w = $('#' + boxItems[0].id).attr('class');
    if (~w.indexOf('expand')) {
      width = document.querySelectorAll('.box')[1].clientWidth;
    } else {
      width = document.querySelectorAll('.box')[0].clientWidth;
    }
    px = (window.innerWidth / 2) - (width / 2);
    // translate;
    active = document.querySelector('.active');
    lefts = [];
    for (i = 0; i < boxItems.length; i++) {

      translate = px + 'px';
      document.getElementById(boxItems[i].id).style.left = translate;
      lefts.push(px);
      if (window.innerWidth > 480) {
        px += (window.innerWidth / 2) + (width / 3);
      } else {
        px += (window.innerWidth / 2) + (width);
      }

      currBox = $('#' + boxItems[i].id).attr('class');
      if (~currBox.indexOf('expand')) {
        left = lefts[i] - ((window.innerWidth - width) / 2);
        id = '#' + boxItems[i].id;
        $(id).css('left', left);
      }
    }

  }

  function setupSlideButtons() {
    var slideNum, count = 1;
    slideNum = $('.box').length;

    for (var i = 0; i < slideNum; i++) {
      if (count === 1) {
        $('.slide-numbers').append("<li id='slide_" + count + "' class='slide activeBox'></li>");
      } else {
        $('.slide-numbers').append("<li id='slide_" + count + "' class='slide'></li>");
      }
      count++;
    }

  }

  function setupEventListeners() {
    window.addEventListener('resize', setupBoxes);
    $(document).on('click', '.slide', function (e) {
      var slideID, slideNum;
      slideID = e.target.id;
      slideNum = slideID.split('_')[1];
      updateCurrentSlideButton(slideNum);
      updateSliderPosition(parseInt(slideNum) - 1);
    });

    $('.menu-toggle').click(function () {
      $('.close').toggleClass('invisible');
      $('.menu').toggleClass('menu-show');
      $('.line-one').toggleClass('line-one_transform');
      $('.line-two').toggleClass('line-two_transform');
      $('.line-three').toggleClass('none');
    });

    $('.inputArea').keyup(function(e){
        if(e.keyCode == 13)
        {
            inputCtrl.next(e);
        }
    });

    $('.box').bind('scroll mousewheel', function(e) {
       if (e.originalEvent.wheelDelta >= 0) {
         // scrolled up
         inputCtrl.toDesiredInput(e, 'up');
       }
       else {
         // scrolled down
         inputCtrl.toDesiredInput(e, 'down');
       }
    });

    $('.verticalDirection i').click(function (e) {
      var direction;
      direction = e.currentTarget.id;
      inputCtrl.toDesiredInput(e, direction);
    });

  }

  function getLeftPosition(i) {
    var theBoxes, left;
    theBoxes = boxes();
    left = document.getElementById(theBoxes[i].id).offsetLeft;
    return left;
  }

  return {
    init: function() {
      console.log("App has started.");
      setupBoxes();
      setupEventListeners();
      setupSlideButtons();

    },
    nextSection: function (currSlideNum) {
      nextSection(currSlideNum);
    }
  };

})(inputCtrl);

slider.init();
