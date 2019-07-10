/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */

let registered = 0;

function stopAndPrevent(e) {
  // eslint-disable-next-line no-unused-expressions
  e.cancelable !== false && e.preventDefault();
  e.stopPropagation();
}

// eslint-disable-next-line consistent-return
function getEventPath(e) {
  if (e.path) {
    return e.path;
  }
  if (e.composedPath) {
    return e.composedPath();
  }

  const path = [];
  let el = e.target;

  while (el) {
    path.push(el);

    if (el.tagName === 'HTML') {
      path.push(document);
      path.push(window);
      return path;
    }

    el = el.parentElement;
  }
}

function hasScrollbar(el, onY = true) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  return onY
    ? el.scrollHeight > el.clientHeight &&
        (el.classList.contains('scroll') ||
          el.classList.contains('overflow-auto') ||
          ['auto', 'scroll'].includes(window.getComputedStyle(el)['overflow-y']))
    : el.scrollWidth > el.clientWidth &&
        (el.classList.contains('scroll') ||
          el.classList.contains('overflow-auto') ||
          ['auto', 'scroll'].includes(window.getComputedStyle(el)['overflow-x']));
}

function shouldPreventScroll(e) {
  if (e.target === document.body || e.target.classList.contains('q-layout__backdrop')) {
    return true;
  }

  const path = getEventPath(e);
  const shift = e.shiftKey && !e.deltaX;
  const scrollY = !shift && Math.abs(e.deltaX) <= Math.abs(e.deltaY);
  const delta = shift || scrollY ? e.deltaY : e.deltaX;

  for (let index = 0; index < path.length; index++) {
    const el = path[index];

    if (hasScrollbar(el, scrollY)) {
      return scrollY
        ? delta < 0 && el.scrollTop === 0
          ? true
          : delta > 0 && el.scrollTop + el.clientHeight === el.scrollHeight
        : delta < 0 && el.scrollLeft === 0
          ? true
          : delta > 0 && el.scrollLeft + el.clientWidth === el.scrollWidth;
    }
  }

  return true;
}

// eslint-disable-next-line no-unused-vars
function onWheel(e) {
  if (shouldPreventScroll(e)) {
    stopAndPrevent(e);
  }
}

function prevent(register) {
  registered += register ? 1 : -1;
  if (registered > 1) {
    return;
  }

  const action = register ? 'add' : 'remove';
  window[`${action}EventListener`]('wheel', stopAndPrevent, { passive: false });
}

export default {
  methods: {
    preventScroll(state) {
      prevent(state);
    },
  },
};
