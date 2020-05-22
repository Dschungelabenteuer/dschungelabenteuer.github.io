import { translateVerticality } from './utils';

/** List of layers name of the landscape. */
const layers = [
  'foreground',
  'background',
  'layer1',
  'layer2',
  'layer3',
  'layer4',
  'stars',
];
/** Landscape's main node. */
const landscape = document.querySelector('.js-landscape');
/** Layers nodes. */
const layerNodes = document.querySelectorAll("[data-type='parallax']");

const parallaxListener = () => {
  let topDistance = window.pageYOffset || window.scrollY;
  if (topDistance < landscape.offsetHeight || landscape.offsetHeight === 0) {
    for (let layer of layerNodes) {
      layer.style.transition = '';
      let layerName = layer.getAttribute('data-layer')
      if (layerName === 'overflow') {
        topDistance = topDistance - window.innerHeight;
      }
      translateVerticality(layer, -(topDistance * layer.getAttribute('data-depth')));
    }
  }
};

/**
 * Adds parallax effect on scroll.
 */
const setParallax = () => {
  for (let layer of layerNodes) {
    layer.classList.add('notransition');
  }
  window.addEventListener('scroll', parallaxListener);
};

/**
 * Removes parallax effect on scroll.
 */
const unsetParallax = () => {
  window.removeEventListener('scroll', parallaxListener);
};
/**
 * Smoothly slides in the landscape when all images are loaded.
 */
const toggleLandscape = () => {
  const overflow = document.querySelector('[data-layer="overflow"]');
  const logo = document.querySelector('[data-layer="logo"]')

  if (logo) logo.classList.add('visible');
  if (overflow) overflow.style.transform = `translateY(100vh)`;

  for (let layer in layers) {
    let layerName = layers[layer];
    let layerNode = document.querySelector(`[data-layer="${layerName}"]`);
    if (layerNode) {
      layerNode.style.backgroundImage = `url("assets/images/landscape/${layerName}.svg")`;
      layerNode.style.transform = `translateY(0)`;
    }
  }

  setTimeout(() => {
    setParallax();
  }, 2000);
};

/**
 * Fetches the landscape layers and toggles the landscape
 * when all layers are loaded.
 */
export default () => {
  const layerCount = layers.length;
  let loadedLayerCount = 0;

  const onLoadedLayer = (layerName) => {
    ++loadedLayerCount;
    if (loadedLayerCount === layerCount) {
      toggleLandscape();
    }
  };

  for (let layer in layers) {
    fetch(`assets/images/landscape/${layers[layer]}.svg`, { cache: 'force-cache' })
      .then(response => {
        if (response.status !== 404) {
          onLoadedLayer(layers[layer]);
        }
      });
  }
};