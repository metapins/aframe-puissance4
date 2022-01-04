import { AFrameElement, customElement } from '@metapins/aframe-element';
import { gameFacade } from '@marcbuils/puissance4-game/domain';

@customElement('p4g-game-puissance4')
export class Puissance4Element extends AFrameElement {
  static override schema = {
    winner: {
      type: 'string',
      default: null,
    },
    nextPlayer: {
      type: 'string',
      default: null,
    },
    pawns: {
      type: 'string',
      default: '[]',
    },
  };

  override update() {
    gameFacade.refreshPawns(
      JSON.parse(this.data.pawns),
      JSON.parse(this.data.nextPlayer),
      JSON.parse(this.data.winner)
    );
  }
}
