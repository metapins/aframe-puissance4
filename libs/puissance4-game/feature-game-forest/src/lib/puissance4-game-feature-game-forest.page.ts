import { AFrameElement, customElement } from '@metapins/aframe-element';
import { html } from 'lit';

@customElement('p4g-game-forest')
export class GameForestElement extends AFrameElement {
  override render() {
    return html`
      <a-entity
        hide-in-ar-mode
        environment="preset: forest; shadow: true; fog: 0.01; skyType: atmosphere;"
      ></a-entity>
    `;
  }
}
