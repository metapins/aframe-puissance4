import { gameFacade, IPawn } from '@marcbuils/puissance4-game/domain';
import { AFrameElement, customElement } from '@metapins/aframe-element';
import { observe } from '@metapins/lit-observe';
import { html } from 'lit';

@customElement('p4g-game-pawns')
export class PawnsElement extends AFrameElement {
  override render() {
    return html`
      ${observe(gameFacade.pawns$, (pawns: IPawn[]) =>
        pawns.map(
          (pawn: IPawn) => html`
            <a-entity
              obj-model="obj: #puissance4-pawn"
              scale="0.05 0.05 0.05"
              position="${-2.92 + pawn.column * 0.73} ${-0.15 +
              0.6 * pawn.line} 0"
              material="color: ${pawn.player};"
              shadow
              rotation="90 ${pawn.winner ? 90 : 0} 0"
            ></a-entity>
          `
        )
      )}
    `;
  }
}
