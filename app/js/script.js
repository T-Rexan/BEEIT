console.log("Load script.js");

// Instantiating the global app object
var app = {};
document.getElementById("background").style.background =
  'url("./images/slides/slide1.png")';

//slider function

function next() {
  var src1 = 'url("./images/slides/slide';
  var src2 = '.png")';
  var src_original = document.getElementById("background").style
    .backgroundImage;
  var number = parseInt(src_original.charAt(26));

  if (number == 3) {
    number = 1;
    var src = src1 + number.toString() + src2;
  } else {
    var src = src1 + (number + 1).toString() + src2;
  }

  document.getElementById("background").style.background = src;
}

function prev() {
  var src1 = 'url("./images/slides/slide';
  var src2 = '.png")';
  var src_original = document.getElementById("background").style
    .backgroundImage;
  var number = parseInt(src_original.charAt(26));

  if (number == 1) {
    number = 3;
    var src = src1 + number.toString() + src2;
  } else {
    var src = src1 + (number - 1).toString() + src2;
  }

  document.getElementById("background").style.background = src;
}

function tab(element) {
  var active = document.querySelector(".active");
  active.classList.remove("active");
  //console.log(active)
  element.classList.add("active");
  var now_active=document.querySelector('.active');
  var type=now_active.textContent;


  if (type=='Plus'){
    var premium_elems=document.querySelectorAll('.premium');
    premium_elems.forEach(function(element){
      element.classList.remove('option-primary');
    });
    var plus_elems=document.querySelectorAll('.plus');
    plus_elems.forEach(function(element){
      element.classList.add('option-primary');
    });
    var img_premium=document.querySelectorAll('.img-premium');
    img_premium.forEach(function(element){
      element.src='./images/x.png';
      element.classList.remove('img-padding');
    });

    var img_plus=document.querySelectorAll('.img-plus');
    img_plus.forEach(function(element){
      element.src='./images/v.png';
      element.classList.add('img-padding');
    });
  }

  if (type=='Premium'){
    
    var premium_elems=document.querySelectorAll('.premium');
    premium_elems.forEach(function(element){
      element.classList.add('option-primary');
    });

    var img_premium=document.querySelectorAll('.img-premium');
    img_premium.forEach(function(element){
      element.src='./images/v.png';
      element.classList.add('img-padding');
    });
  }

  if (type=='Regular'){
    var regular_elems=document.querySelectorAll('.premium');
    regular_elems.forEach(function(element){
      element.classList.remove('option-primary');
    });

    var img_premium=document.querySelectorAll('.img-premium');
    img_premium.forEach(function(element){
      element.src='./images/x.png';
      element.classList.remove('img-padding');
    });
  }


}

var triggerElementID = "null"; // this variable is used to identity the triggering element
var fingerCount = 0;
var startX = 0;
var startY = 0;
var curX = 0;
var curY = 0;
var deltaX = 0;
var deltaY = 0;
var horzDiff = 0;
var vertDiff = 0;
var minLength = 72; // the shortest distance the user may swipe
var swipeLength = 0;
var swipeAngle = null;
var swipeDirection = null;

// The 4 Touch Event Handlers

// NOTE: the touchStart handler should also receive the ID of the triggering element
// make sure its ID is passed in the event call placed in the element declaration, like:
// <div id="picture-frame" ontouchstart="touchStart(event,'picture-frame');"  ontouchend="touchEnd(event);" ontouchmove="touchMove(event);" ontouchcancel="touchCancel(event);">

function touchStart(event) {
  console.log('start');
  // disable the standard ability to select the touched object
  event.preventDefault();
  // get the total number of fingers touching the screen
  fingerCount = event.touches.length;
  // since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
  // check that only one finger was used
  if (fingerCount == 1) {
    // get the coordinates of the touch
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
    // store the triggering element ID
    triggerElementID = "background";
  } else {
    // more than one finger touched so cancel
    touchCancel(event);
  }
}

function touchMove(event) {
  console.log('move');
  event.preventDefault();
  if (event.touches.length == 1) {
    curX = event.touches[0].pageX;
    curY = event.touches[0].pageY;
  } else {
    touchCancel(event);
  }
}

function touchEnd(event) {
  console.log('end');
  event.preventDefault();
  // check to see if more than one finger was used and that there is an ending coordinate
  if (fingerCount == 1 && curX != 0) {
    // use the Distance Formula to determine the length of the swipe
    swipeLength = Math.round(
      Math.sqrt(Math.pow(curX - startX, 2) + Math.pow(curY - startY, 2))
    );
    // if the user swiped more than the minimum length, perform the appropriate action
    if (swipeLength >= minLength) {
      caluculateAngle();
      determineSwipeDirection();
      processingRoutine();
      touchCancel(event); // reset the variables
    } else {
      touchCancel(event);
    }
  } else {
    touchCancel(event);
  }
}

function touchCancel(event) {
  console.log('cancel');
  // reset the variables back to default values
  fingerCount = 0;
  startX = 0;
  startY = 0;
  curX = 0;
  curY = 0;
  deltaX = 0;
  deltaY = 0;
  horzDiff = 0;
  vertDiff = 0;
  swipeLength = 0;
  swipeAngle = null;
  swipeDirection = null;
  triggerElementID = null;
}

function caluculateAngle() {
  var X = startX - curX;
  var Y = curY - startY;
  var Z = Math.round(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))); //the distance - rounded - in pixels
  var r = Math.atan2(Y, X); //angle in radians (Cartesian system)
  swipeAngle = Math.round((r * 180) / Math.PI); //angle in degrees
  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
}

function determineSwipeDirection() {
  if (swipeAngle <= 45 && swipeAngle >= 0) {
    swipeDirection = "left";
  } else if (swipeAngle <= 360 && swipeAngle >= 315) {
    swipeDirection = "left";
  } else if (swipeAngle >= 135 && swipeAngle <= 225) {
    swipeDirection = "right";
  } else if (swipeAngle > 45 && swipeAngle < 135) {
    swipeDirection = "down";
  } else {
    swipeDirection = "up";
  }
}

function processingRoutine() {
  var swipedElement = document.getElementById(triggerElementID);
  if (swipeDirection == "left") {
    prev();
  } else if (swipeDirection == "right") {
   next();
  } 
}

function startup(){
var hero_bg=document.getElementById('background');
hero_bg.addEventListener('touchstart',touchStart,false);
hero_bg.addEventListener('touchend',touchEnd,false);
hero_bg.addEventListener('touchmove',touchMove,false);
hero_bg.addEventListener('touchcancel',touchCancel,false);

}


document.addEventListener("DOMContentLoaded", startup);