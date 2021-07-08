const navMenuDiv = document.getElementById('nav-content');
const navMenu = document.getElementById('nav-toggle');
document.onclick = check;
/**
 * @typedef {object} MouseEvent
 * @typedef {object} HTMLElement
 */
/**
 * @param {MouseEvent} e
 */
function check(e) {
  const target = (e && e.target) || (event && event.srcElement);
  // Nav Menu
  if (!checkParent(target, navMenuDiv)) {
    // click NOT on the menu
    if (checkParent(target, navMenu)) {
      // click on the link
      if (navMenuDiv.classList.contains('hidden')) {
        navMenuDiv.classList.remove('hidden');
      } else {
        navMenuDiv.classList.add('hidden');
      }
    } else {
      // click both outside link and outside menu, hide menu
      navMenuDiv.classList.add('hidden');
    }
  }
}

// /**
//  * @param { number } t The sum of the two numbers.
//  * @param { number } elm The sum of the two numbers.
//  * @return {boolean} The sum of the two numbers.
//  */
function checkParent(t, elm) {
  while (t.parentNode) {
    if (t == elm) {
      return true;
    }
    t = t.parentNode;
  }
  return false;
}
