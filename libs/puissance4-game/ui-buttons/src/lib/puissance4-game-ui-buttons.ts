import { AFrameElement, customElement } from '@metapins/aframe-element';
import '@marcbuils/puissance4-game/ui-button';
import { html } from 'lit';

@customElement('p4g-game-buttons')
export class GameButtonsElement extends AFrameElement {
  override render() {
    return html` ${[...Array(7).keys()].map(
      (columnKey) => html`
        <a-entity p4g-game-button="column: ${columnKey + 1};"></a-entity>
      `
    )}`;
  }
}
