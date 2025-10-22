import { html, fixture, expect } from '@open-wc/testing';
import "../social-media.js";

describe("SocialMedia test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <social-media
        title="title"
      ></social-media>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
