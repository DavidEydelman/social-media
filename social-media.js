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
    this.currentIndex = 2;
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
        margin-top: var(--ddd-spacing-1);
      }
      .controls button {
        background-color: var(--ddd-theme-primary);
        color: var(--ddd-theme-on-primary);
        border: none;
        border-radius: var(--ddd-spacing-3);
        padding: var(--ddd-spacing-2);
        font-size: var(--ddd-font-size-s);
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
      .post-container {
        display: flex;
        flex-direction: row;
        gap: var(--ddd-spacing-8);
        overflow-x: auto;
        scroll-behavior: smooth;
        margin-top: var(--ddd-spacing-4);
        padding: var(--ddd-spacing-8);
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
      .info-wrapper {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-1);
        max-width: 400px;
        margin: 0 auto;
      }
      .author-info {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-2);
        flex-shrink: 0;
      }
      .author-info img {
        border-radius: 50%;
      }
      .author-details {
        display: flex;
        flex-direction: column;
        gap: var(--ddd-spacing-0);
        line-height: var(--ddd-lh-120);
      }
      .author-name {
        font-family: var(--ddd-font-primary);
        font-weight: var(--ddd-font-weight-bold);
        font-size: 16px;
      }
      .author-username {
        font-size: 14px;
      }
      .post-info {
        display: flex;
        flex-direction: column;
        text-align: right;
        flex-grow: 1;
      }
      .post-info h2 {
        margin: 0;
        font-size: 18px;
      }
      .post-info p {
        margin: 0;
        font-size: 14px;
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
              id="${index}" @click="${() => { this.currentIndex = index; this.scrollToIndex(index); this.getPosts(); }}"
              class="${index === this.currentIndex ? 'selected' : ''}" />`)} //
        </div>
        <div class="info-wrapper">
          <div class="author-info">
            <img src="${currentPost ? currentPost.author.pfp : ''}" width="50" height="50" />
            <div class="author-details">
              <span class="author-name">${currentPost ? currentPost.author.name || currentPost.author.username : ''}</span>
              <span class="author-username">${currentPost ? currentPost.author.username : ''}</span>
            </div>
          </div>
          <div class="post-info">
            <h2>${currentPost ? html`${currentPost.image.title}` : 'Loading...'}</h2>
            <p>${currentPost ? html`${currentPost.image.date}` : ''}</p>
          </div>
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
    const response = await fetch ('/api/images');
    if (response.ok) {
      const data = await response.json();
      if (data.length > 0 && this.posts.length < data.length) {
        const nextPost = data[this.posts.length];
        this.posts = [...this.posts, nextPost];
        this.loadLikesDislikes();
        this.requestUpdate();
      }
      if (this.currentIndex >= this.posts.length - 3) {
        this.getPosts();
      }
    }
  }

  loadLikesDislikes() {
    const storedData = JSON.parse(localStorage.getItem('socialMediaReactions')) || {};
    this.posts = this.posts.map((post, index) => {
      const reaction = storedData[index] || {};
      return {
        ...post,
        like: reaction.like || false,
        dislike: reaction.dislike || false
      };
    });
    this.requestUpdate();
  }

  saveLikesDislikes() {
    const storedData = {};
    this.posts.forEach((post, index) => {
      storedData[index] = {
        like: post.like || false,
        dislike: post.dislike || false
      };
    });
    localStorage.setItem('socialMediaReactions', JSON.stringify(storedData));
  }

  ShareCopyLink() {
    const currentPost = this.posts ? this.posts[this.currentIndex] : null;
    if (currentPost) {
      const baseUrl = window.location.origin + window.location.pathname;
      const params = new URLSearchParams({ postId: currentPost.id }).toString();
      const url = `${baseUrl}?${params}`;
      
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
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
      this.saveLikesDislikes();
    }
  }

  dislike() {
    if (this.posts[this.currentIndex]) {
      this.posts[this.currentIndex].dislike = true;
      this.posts[this.currentIndex].like = false;
      this.requestUpdate();
      this.saveLikesDislikes();
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

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    
    if (postId) {
      this.currentIndex = postId - 1;
    }
  }

  async connectedCallback() {
    super.connectedCallback();

    this.getPosts();
    this.loadFromURL(); 

    await this.updateComplete;

    setTimeout(() => {
      this.scrollToIndex(this.currentIndex);
    }, 700);
  }

    static get haxProperties() {
      return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
    }
  }

globalThis.customElements.define(SocialMedia.tag, SocialMedia);
