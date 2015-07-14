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
 * State 'didLike' is true or false. Local state of the like for this
 * 'Thing' hash prevents additional likes from POST-ing to the API.
 */
var setLocalState = function(didLike) {
  var state = didLike ? true : false;
  localStorage.setItem('liked_' + hash, state);
  icon.id = state ? 'instalike--icon-liked' : 'instalike--icon';
  // console.log('setLocalState(): state %s, icon.id %s', state, icon.id);
  return state;
};

/**
 * Integer count for the 'thing' at this hash. This local count enables the
 * browser to render the last known count for this 'Thing' hash, until it
 * is replaced by any API calls.
 */
var setLocalCount = function(i) {
  i = parseInt(i || 0);
  if (i < 1) {
    count = i;
    label.id = 'instalike--label-empty';
    return 0;
  }
  localStorage.setItem('count_' + hash, i);
  counter.innerHTML = i;
  count = i;
  label.id = 'instalike--label';
  return i;
};

/**
 * Elements and state vars.
 */
var button  = document.getElementById('instalike');
var icon    = document.getElementById('instalike--icon');
var label   = document.getElementById('instalike--label-empty');
var counter = document.getElementById('instalike--label-counter');
var hash = (params.thing || '0000').toString();
var count = 0;

/**
 * Use localStorage to load the state and cached like count so that they
 * can be rendered on the page before API operations complete.
 */
if(localStorage.getItem('liked_' + hash) === 'true') {
  setLocalState(localStorage.getItem('liked_' + hash));
  if(count != 0) {
    label.id = 'instalike--label';
  }
}
setLocalCount(localStorage.getItem('count_' + hash) || 0);

/**
 * Update like count via the API.
 */
fetch('/' + hash)
  .then(function(response) { return response.json(); })
  .then(function(json)     { setLocalCount(json['count']); })
  .catch(function(e)       { console.log('parsing failed', e); });

/**
 * Handle a 'like' button press:
 *   - Send like/unlike to API.
 *   - Update local count.
 *   - Update local state press.
 *   - Trigger animations.
 */
var handleClick = function(el) {
  if (localStorage.getItem('liked_' + hash) === 'true') {
    setLocalState(false);
    setLocalCount(count = count - 1);
    fetch('/' + hash, { method: 'patch' });
  } else {
    icon.style.transform = 'scale(1.2)';
    icon.style.color = 'tomato';
    setLocalState(true);
    setLocalCount(count = count + 1);
    fetch('/' + hash, { method: 'post' });
    setTimeout(function() {
      icon.removeAttribute('style');
    }, 150);
  }
};
button.addEventListener('click', handleClick.bind(this));
