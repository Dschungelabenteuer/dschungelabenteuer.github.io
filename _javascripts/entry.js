// Custom Elements
import Modal, { initModals } from './custom-elements/modal';
// Modules
import initLandscape from './landscape';

document.addEventListener('DOMContentLoaded', () => {
  initLandscape();
  initModals();
});

// Register Custom Elements
window.customElements.define('custom-modal', Modal);
