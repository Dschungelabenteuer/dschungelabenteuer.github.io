/**
 * Creates an accessible modal Custom Element.
 */
import closeIcon from '../../_includes/images/icons/close.svg';

let activeModal = '';

const openModal = (targetModal) => {
  activeModal = targetModal.getAttribute('id');
  targetModal.classList.add('visible');
  document.querySelector('body').style.overflow = 'hidden';
  targetModal.shadowRoot.querySelector('.modal__closeBtn').focus();
}

const closeModal = (element) => {
  const id = element.getAttribute('id');
  const toggler = document.querySelector(`[aria-controls="${id}"]`);
  activeModal = '';
  element.classList.remove('visible');
  document.querySelector('body').style.overflow = 'auto';
  if (toggler) {
    toggler.focus();
  }
};

const keyboardSupport = (element, event) => {
  if (event.keyCode === 27 && element.getAttribute('id') === activeModal) {
    closeModal(element);
  }
};

export const initModals = () => {
  const modalTogglers = document.querySelectorAll('[aria-controls^=modal]');
  for (let modalToggler of modalTogglers) {
    let targetModal = document.getElementById(modalToggler.getAttribute('aria-controls'));
    if (targetModal) {
      modalToggler.onclick = () => openModal(targetModal);
      modalToggler.onkeydown = (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
          openModal(targetModal);
        }
      };
    }
  }
};

export default class Modal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this._render();
    const me = this;
    const id = this.getAttribute('id');
    const closeBtn = this.shadowRoot.querySelector('.modal__closeBtn');
    const backdrop = this.shadowRoot.querySelector('.modal__backdrop');
    // Close listeners
    if (closeBtn) closeBtn.onclick = () => closeModal(me);
    if (backdrop) backdrop.onclick = () => closeModal(me);
    // Accessibility support
    if (!this.hasAttribute('role')) this.setAttribute('role', 'dialog');
    if (!this.hasAttribute('aria-modal')) this.setAttribute('aria-modal', 'true');
    window.addEventListener('keyup', keyboardSupport.bind(null, me));
  }

  disconnectedCallback() {
    window.removeEventListener('keyup', keyboardSupport.bind(null, this));
  }

  _render() {
    const id = this.getAttribute('id');
    const title = this.getAttribute('title');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 13;
          opacity: 0;
          pointer-events: none;
          transition: all 300ms ease;
        }

        :host(.visible) {
          transition: all 300ms ease;
          opacity: 1 !important;
          pointer-events: all;
        }

        .modal__backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--background-dark);
          opacity: 0.5;
          z-index: -1;
        }

        .modal__container {
          position: relative;
          width: 80vw;
          height: 80vh;
          margin: 1rem;
          padding: 3rem 1rem 1rem;
          border-radius: 1rem;
          background: var(--background-light);
          transition: transform cubic-bezier(0.09, 0.9, 0.54, 1.01) 200ms;
          transform: scale(0.8);
          box-shadow: 0 19px 38px rgba(var(--background-dark), 0.10), 0 15px 12px rgba(var(--background-dark), 0.12);
          overflow-y: scroll;
        }

        :host(.visible)  .modal__container {
          transform: scale(1);
        }

        .modal__closeBtn {
          position: fixed;
          top: 1rem;
          right: 1rem;
          height: 1.5rem;
          width: 1.5rem;
          margin: 0;
          padding: 0;
          background: transparent;
          border: none;
          opacity: 0.75;
          cursor: pointer;
          transition: opacity 200ms ease;
        }

        .modal__closeBtn:hover {
          opacity: 1;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap; /* added line */
          border: 0;
        }
      </style>
      <div class="modal_wrapper">
        <div class="modal__backdrop"></div>
        <div class="modal__container">
          <button class="modal__closeBtn" type="button" title="Close window">
            ${closeIcon}
          </button>
          <slot></slot>
        </div>
      </div>
    `;
  }
}