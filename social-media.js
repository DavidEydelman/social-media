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
    const response = {
      "data": [
        {
          "source": "https://github.com/btopro.png",
          "title": "Inventor"
        },
        {
          "source": "https://github.com/haxtheweb.png",
          "title": "Invention"
        }
      ]
    };

    // step into the data property of this response, then loop over the array
    response.data.forEach((i) => {
      // each array item passed in is going to be an object.
      // so i.{propertyName} is how we access things here
      // you can also do i['title'] and it's the same as i.title
      // this syntax allows for making the object key variable
      const div = document.createElement('div');
      div.innerHTML = i.title;
      const image = document.createElement('img');
      image.src = i.source;
      div.appendChild(image);
      document.querySelector('p').appendChild(div);
    });


    document.querySelector('button').addEventListener('click', (e) => {
      getFoxes();
    });
    // now let's get data via fetch
    // fetch returns a Promise. Meaning we need to have statements executed by
    // chaining together then() statements. This means when the first thing
    // happens, THEN do this next thing. There's always data available from
    // what was resolved in the Promise. In a fetch this information is
    // a response from the request and includes header data about the cal
    // as well as the data itself
    function getFoxes() {
      fetch("https://randomfox.ca/floof/").then((resp) => {
        // headers indicating the request was good, then process it
        if (resp.ok) {
          // return the response as JSON. .text() is another valid response
          // though that's more useful for HTML / non data object responses
          return resp.json();
        }
      }).then((data) => {
        // THEN after the 2nd promise resolves, do this
        // the data being passed in, whill be the response object as json()
        // from the previous Promise resolving
        // here we can see that data.image allows us to access the image
        // attribute in the response
        let image = document.createElement('img');
        image.src = data.image;
        document.querySelector('p').appendChild(image);
        document.body.appendChild(document.createTextNode(data.link));
      });
    }
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
    };
  }

  // Lit scoped styles
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
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <h3><span>${this.t.title}:</span> ${this.title}</h3>
  <slot></slot>
</div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(SocialMedia.tag, SocialMedia);