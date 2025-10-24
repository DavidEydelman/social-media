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
  }

  static get properties() {
    return {
      ...super.properties,
      foxes: { type: Array },
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--social-media-label-font-size, var(--ddd-font-size-s));
      }
      .fox-container {
        display: flex;
        flex-direction: row;
        gap: 10px;
        overflow-x: auto;
        scroll-behavior: smooth;
        padding: 10px 0;
      }
      .fox-container img {
        width: 150px;
        height: 150px;
        object-fit: cover;
        border-radius: 8px;
        flex-shrink: 0; 
      }
    `];
  }

  render() {
    return html`
      <div class="wrapper">
        <button @click="${this.getFox}">Generate Random Fox</button>

        <div class="fox-container">
          ${this.foxes?.map(fox => html`<img src="${fox}" alt="Random Fox" />`)}
        </div>
        <div class="controls">
          <button @click="${this.next}">next</button>
          <button @click="${this.back}">back</button>
          <button @click="${this.like}">like</button>
          <button @click="${this.dislike}">dislike</button>
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

connectedCallback() {
  super.connectedCallback();
  for (let i = 0; i < 5; i++) {
    this.getFox();
  }
}

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(SocialMedia.tag, SocialMedia);
