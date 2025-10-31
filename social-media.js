/**
 * Copyright 2025 DavidEydelman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `social-media`
 * 
 * @demo index.html
 * @element social-media
 */
export class SocialMedia extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "social-media";
  }

  constructor() {
    super();
    this.foxes = [];
    this.currentIndex = 0;
  }

  static get properties() {
    return {
      ...super.properties,
      foxes: { type: Array },
      currentIndex: { type: Number },
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-default-coalyGray);
        background-color: var(--ddd-theme-default-roarLight);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-0);
      }
      .controls {
        display: flex;
        justify-content: center;
        gap: var(--ddd-spacing-2);
        margin-top: var(--ddd-spacing-4);
      }
      .controls button {
        background-color: var(--ddd-theme-primary);
        color: var(--ddd-theme-on-primary);
        border: none;
        border-radius: var(--ddd-spacing-4);
        padding: var(--ddd-spacing-4);
        font-size: var(--ddd-font-size-m);
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .controls button:hover {
        cursor: pointer;
        background-color: var(--ddd-theme-default-shrineTan);
      }
      h3 span {
        font-size: var(--social-media-label-font-size, var(--ddd-font-size-s));
      }
      .fox-container {
        display: flex;
        flex-direction: row;
        gap: var(--ddd-spacing-8);
        overflow-x: auto;
        scroll-behavior: smooth;
        padding: var(--ddd-spacing-10);
      }
      .fox-container::-webkit-scrollbar {
        display: none;
      }
      .fox-container img {
        width: 400px;
        height: 400px;
        object-fit: cover;
        border-radius: var(--ddd-spacing-6);
        flex-shrink: 0;
        scroll-snap-align: center;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .fox-container img.selected {
        transform: scale(1.15);
      }
      @media (prefers-color-scheme: dark) {
        :host {
          color: var(--ddd-theme-default-coalyGray);
          background-color: var(--ddd-theme-default-shrineTan);
        }
        .controls button:hover {
          background-color: var(--ddd-theme-default-roarLight);
        }
      }
    `];
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="fox-container">
          ${this.foxes?.map((fox, index) => html`
            <img 
              src="${fox}" 
              class="${index === this.currentIndex ? 'selected' : ''}" />`)}
        </div>
        <div class="controls">
          <div class="ShareLabel">
            <button @click="${this.ShareCopyLink}">Share</button>
          </div>
          <button @click="${this.back}"><</button>
          <button @click="${this.like}">👍</button>
          <button @click="${this.dislike}">👎</button>
          <button @click="${this.next}">></button>
        </div>
      </div>
    `;
  }

  getFox() {
    fetch("https://randomfox.ca/floof/").then((resp) => {
      if (resp.ok) {
        return resp.json();
      }
    }).then((data) => {
      this.foxes = [...this.foxes, data.image];
    });
  }

  next() {
    if (this.currentIndex < this.foxes.length - 1) {
      this.currentIndex++;
      this.scrollToIndex(this.currentIndex);
    }
  }
  
  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.scrollToIndex(this.currentIndex);
    }
  }

  scrollToIndex(index) {
    const container = this.shadowRoot.querySelector('.fox-container');
    const images = container.querySelectorAll('img');
    
    if (images[index]) {
      images[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  connectedCallback() {
    super.connectedCallback();
    for (let i = 0; i < 15; i++) {
      this.getFox();
    };
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(SocialMedia.tag, SocialMedia);
