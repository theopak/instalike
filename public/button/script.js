'use strict';

/**
 * Read a page's GET URL variables and return them as an associative array.
 * Source: http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
 */
var params = (function () {
  var vars = [],
      hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}());

/**
 * State is true or false.
 */
var setState = function(liked) {
  var state = liked ? true : false;
  localStorage.setItem('liked_' + hash, state);
  icon.id = 'instalike--icon-liked';
  return state;
};

/**
 * Local count for the 'thing' at this hash.
 */
var setCount = function(i) {
  if (i < 1) {
    return 0;
  };
  localStorage.setItem('count_' + hash, i);
  counter.innerHTML = i;
  count = i;
  label.id = 'instalike--label';
  return i;
};

/**
 * Elements and state.
 */
var button  = document.getElementById('instalike');
var icon    = document.getElementById('instalike--icon');
var label   = document.getElementById('instalike--label-empty');
var counter = document.getElementById('instalike--label-counter');
var hash = (params.thing || '0000').toString();
var count = 0;

/**
 * Load state from localStorage.
 */
if(localStorage.getItem('liked_' + hash)) {
  setState(localStorage.getItem('liked_' + hash));
  if(count != 0) {
    label.id = 'instalike--label';
  }
}
// if(localStorage.getItem('count_' + hash)) {
//   setCount(localStorage.getItem('count_' + hash));
// }

/**
 * Load count from API.
 */
fetch('/' + hash)
  .then(function(response) { return response.json(); })
  .then(function(json)     { setCount(json['count']); })
  .catch(function(e)       { console.log('parsing failed', e); });

/**
 * Handle a 'like' button press:
 *   - Send like to API.
 *   - Update local count.
 *   - Update local state press.
 *   - Trigger animations.
 */
var handleLike = function(el) {
  icon.style.transform = 'scale(1.2)';
  icon.style.color = 'tomato';
  icon.id = 'instalike--icon-liked';
  fetch('/' + hash, { method: 'post' });
  setCount(++count);
  setState(true);
  setTimeout(function() {
    icon.removeAttribute('style');
  }, 150);
};
button.addEventListener('click', handleLike.bind(this));
