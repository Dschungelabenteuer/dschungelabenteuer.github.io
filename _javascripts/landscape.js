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
/** List of layers source svg */
const layersData = {};
/** Duration (ms) of the initial landscape animation */
const LAYER_TRANSITION_DURATION = 2000;
/** Landscape's main node. */
const landscape = document.querySelector('.js-landscape');
/** Layers nodes. */
const layerNodes = document.querySelectorAll("[data-type='parallax']");
/** Parallax effect onscroll */
const parallaxListener = () => {
  let topDistance = window.pageYOffset || window.scrollY;
  if (topDistance < landscape.offsetHeight || landscape.offsetHeight === 0) {
    for (let layer of layerNodes) {
      layer.style.transition = '';
      let layerName = layer.getAttribute('data-layer');
      if (layerName === 'foreground') continue;
      let depth = layer.getAttribute('data-depth');
      let movement = -(topDistance * depth);
      translateVerticality(layer, movement);
    }
  }
};

/**
 * Adds parallax effect on scroll.
 */
const setParallax = () => {
  for (let layer of layerNodes) {
    // Overflow layer is now pointless
    if (layer.getAttribute('data-layer') === 'overflow') {
      layer.parentNode.removeChild(layer);
    }
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
  if (overflow) overflow.style.transform = `translateY(100vh)`;

  for (let layer in layers) {
    let layerName = layers[layer];
    let layerNode = document.querySelector(`[data-layer="${layerName}"]`);
    if (layerNode) {
      layerNode.style.backgroundImage = `url("${layersData[layerName]}")`;
      layerNode.style.transform = `translateY(0)`;
    }
  }

  setTimeout(() => {
    setParallax();
  }, LAYER_TRANSITION_DURATION);
};

/**
 * Fetches the landscape layers and toggles the landscape
 * when all layers are loaded.
 */
export default () => {
  const logo = document.querySelector('[data-layer="logo"]')
  const disableParallaxBtn = document.querySelector('.js-disable-parallax');
  const layerCount = layers.length;
  let loadedLayerCount = 0;

  if (logo) logo.classList.add('visible');

  const onLoadedLayer = (layerName, data) => {
    layersData[layerName] = `data:image/svg+xml;utf8,${encodeURIComponent(data)}`;
    ++loadedLayerCount;
    if (loadedLayerCount === layerCount) {
      toggleLandscape();
    }
  };

  for (let layer in layers) {
    fetch(`assets/images/landscape/${layers[layer]}.svg`, { cache: 'force-cache' })
      .then(response => response.text())
      .then(data => {
        onLoadedLayer(layers[layer], data);
      });
  }

  if (disableParallaxBtn) {
    disableParallaxBtn.onclick = () => {
      unsetParallax();
      disableParallaxBtn.parentNode.removeChild(disableParallaxBtn);
    }
  }
};