import { AFrameElement, customElement } from '@metapins/aframe-element';
import { html } from 'lit';

@customElement('p4g-game-arches')
export class GameForestElement extends AFrameElement {
  override render() {
    return html`
      <a-entity
        hide-in-ar-mode
        environment="preset: arches; shadow: false; skyType: atmosphere;"
      ></a-entity>
    `;
  }
}
