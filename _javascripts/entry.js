// Custom Elements
import Modal, { initModals } from './custom-elements/modal';
// Modules
import initLandscape from './landscape';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}

document.addEventListener('DOMContentLoaded', () => {
  initLandscape();
  initModals();
});

// Register Custom Elements
window.customElements.define('custom-modal', Modal);
