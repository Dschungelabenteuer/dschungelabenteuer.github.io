// Main easing timing equations
export const EASINGS_MAP = {
 "linear":       t => t,
 "ease-in":      t => t * t,
 "ease-out":     t => t * ( 2 - t ),
 "ease-in-out":  t => ( t < .5 ? 2 * t * t : -1 + ( 4 - 2 * t ) * t )
};

/**
 * Translates ${element} by ${value}px on the Y axis.
 * @param {Element} element - DOM element to translate.
 * @param {number} value - Amount of pixels for the translation.
 * @return void
 */
export const translateVerticality = (element, value) => {
   let translate3d = 'translate3d(0, ' + parseInt(value, 10) + 'px, 0)';
   element.style['-webkit-transform'] = translate3d;
   element.style['-moz-transform'] = translate3d;
   element.style['-ms-transform'] = translate3d;
   element.style['-o-transform'] = translate3d;
   element.style.transform = translate3d;
};