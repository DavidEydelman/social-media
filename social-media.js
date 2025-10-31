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
    this.posts = [];
    this.currentIndex = 0;
  }

  static get properties() {
    return {
      ...super.properties,
      posts: { type: Array },
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
      .controls button.active {
        background-color: var(--ddd-theme-default-shrineTan);
      }
      h3 span {
        font-size: var(--social-media-label-font-size, var(--ddd-font-size-s));
      }
      .post-container {
        display: flex;
        flex-direction: row;
        gap: var(--ddd-spacing-8);
        overflow-x: auto;
        scroll-behavior: smooth;
        padding: var(--ddd-spacing-10);
      }
      .post-container::-webkit-scrollbar {
        display: none;
      }
      .post-container img {
        width: 400px;
        height: 400px;
        object-fit: cover;
        border-radius: var(--ddd-spacing-6);
        flex-shrink: 0;
        scroll-snap-align: center;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .post-container img.selected {
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
        .controls button.active {
        background-color: var(--ddd-theme-default-roarLight);
        }
      }
    `];
  }

  render() {
    const currentPost = this.posts ? this.posts[this.currentIndex] : null;

    return html`
      <div class="wrapper">
        <div class="post-container">
          ${this.posts?.map((post, index) => html`
            <img 
              src="${post.image.src}" 
              alt="${post.image.title}"
              class="${index === this.currentIndex ? 'selected' : ''}" />`)}
        </div>
        <div class="controls">
          <div class="ShareLabel">
            <button @click="${this.ShareCopyLink}">Share</button>
          </div>
          <button @click="${this.back}"><</button>
          <button @click="${this.like}" class="${currentPost?.like ? 'active' : ''}">👍</button>
          <button @click="${this.dislike}" class="${currentPost?.dislike ? 'active' : ''}">👎</button>
          <button @click="${this.next}">></button>
        </div>
      </div>
    `;
  }

  async getPosts() {
    const response = await fetch('./images.json');
    if (response.ok) {
      const data = await response.json();
      this.posts = data;
    }
  }

  next() {
    if (this.currentIndex < this.posts.length - 1) {
      this.currentIndex++;
      this.scrollToIndex(this.currentIndex);
    }
    if (this.currentIndex >= this.posts.length - 3) {
      this.getPosts();
    }
  }
  
  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.scrollToIndex(this.currentIndex);
    }
  }

  like() {
    if (this.posts[this.currentIndex]) {
      this.posts[this.currentIndex].like = true;
      this.posts[this.currentIndex].dislike = false;
      this.requestUpdate();
    }
  }

  dislike() {
    if (this.posts[this.currentIndex]) {
      this.posts[this.currentIndex].dislike = true;
      this.posts[this.currentIndex].like = false;
      this.requestUpdate();
    }
  }

  scrollToIndex(index) {
    const container = this.shadowRoot.querySelector('.post-container');
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
    for (let i = 0; i < 5; i++) {
      this.getPosts();
    };
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(SocialMedia.tag, SocialMedia);
