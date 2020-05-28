import { translateVerticality } from './utils';

/** List of layers name of the landscape. */
const layers = [
  'foreground',
  'background',
  'layer1',
  'layer2',
  'layer4',
  'stars',
];
/** List of layers source svg */
const layersData = { svg: {}, png: {} };
/** Duration (ms) of the initial landscape animation */
const LAYER_TRANSITION_DURATION = 2000;
/** Landscape's main node. */
const landscape = document.querySelector('.js-landscape');
/** Layers nodes. */
let layerNodes = document.querySelectorAll("[data-type='parallax']");
/** Parallax effect onscroll */
const parallaxListener = () => {
  let topDistance = window.pageYOffset || window.scrollY;
  if (topDistance < landscape.offsetHeight || landscape.offsetHeight === 0) {
    for (let layer of layerNodes) {
      let layerName = layer.getAttribute('data-layer');
      if (layerName === 'foreground-r') continue;
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
  const stars = document.querySelector("[data-layer='stars']");
  const starsPNG = document.querySelector("[data-layer='stars-r']");
  if (stars) {
    stars.parentNode.removeChild(stars);
  }
  if (starsPNG) {
    starsPNG.style.visibility = 'visible';
    starsPNG.classList.add('visible');
  }

  for (let layer of layerNodes) {
    layer.parentNode.removeChild(layer);
  }
  layerNodes = document.querySelectorAll("[data-type='parallax']");
  for (let layer of layerNodes) {
    layer.style.visibility = 'visible';
    layer.style.transform = 'translateY(0)';
    layer.style.transition = '';
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
      layerNode.style.backgroundImage = `url("${layersData.svg[layerName]}")`;
      layerNode.style.transform = `translateY(0)`;
    }
  }
};

/**
 * Deletes SVGs to only display PNGs fallbacks.
 */
const replaceLandscape = () => {
  setTimeout(() => {
    setParallax();
  }, LAYER_TRANSITION_DURATION);
};

/**
 * Prepares PNGs fallback of layers.
 */
const preparePNG = (layerName) => {
  const originalLayerNode = document.querySelector(`[data-layer="${layerName}"]`);
  if (originalLayerNode) {
    const layerNode = originalLayerNode.cloneNode();
    layerNode.setAttribute('data-layer', `${layerNode.getAttribute('data-layer')}-r`);
    layerNode.style.backgroundImage = `url(${layersData.png[layerName]})`;
    layerNode.style.visibility = 'hidden';
    originalLayerNode.parentNode.insertBefore(layerNode, originalLayerNode);
  }
};

/**
 * Fetches the landscape layers and toggles the landscape
 * when all layers are loaded.
 */
export default () => {
  const logo = document.querySelector('[data-layer="logo"]')
  const disableParallaxBtn = document.querySelector('.js-disable-parallax');
  const layerCount = layers.length;
  let loadedLayerCount = { svg: 0, png: 0 };

  if (logo) logo.classList.add('visible');

  const onLoadedLayer = (type, layerName, data) => {
    layersData[type][layerName] = data;
    ++loadedLayerCount[type];
    if (type === 'png') {
      preparePNG(layerName);
    }
    if (loadedLayerCount[type] === layerCount) {
      return type === 'svg'
        ? toggleLandscape()
        : replaceLandscape();
    }
  };

  for (let layer in layers) {
    fetch(`assets/images/landscape/svgs/${layers[layer]}.svg`, { cache: 'force-cache' })
      .then(response => response.text())
      .then(data => {
        onLoadedLayer('svg', layers[layer], `data:image/svg+xml;utf8,${encodeURIComponent(data)}`);
      });
  }

  for (let layer in layers) {
    fetch(`assets/images/landscape/${layers[layer]}.png`, { cache: 'force-cache' })
      .then(response => response.blob())
      .then(blob => {
        onLoadedLayer('png', layers[layer], URL.createObjectURL(blob));
      });
  }

  if (disableParallaxBtn) {
    disableParallaxBtn.onclick = () => {
      unsetParallax();
      disableParallaxBtn.parentNode.removeChild(disableParallaxBtn);
    }
  }
};