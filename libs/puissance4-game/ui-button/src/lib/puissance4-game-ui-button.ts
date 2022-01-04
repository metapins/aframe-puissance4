import { gameFacade } from '@marcbuils/puissance4-game/domain';
import { AFrameElement, customElement } from '@metapins/aframe-element';
import { observe } from '@metapins/lit-observe';
import { html } from 'lit';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@customElement('p4g-game-button')
export class GameButtonsElement extends AFrameElement {
  static override schema = {
    column: { type: 'int' },
  };

  private color$ = new BehaviorSubject<string>('white');

  private async click(column: number) {
    const player = await firstValueFrom(gameFacade.player$);
    const nextPlayer = await firstValueFrom(gameFacade.nextPlayer$);

    if (nextPlayer !== player) return;
    gameFacade.addPawn(player, column);
    this.color$.next('white');
  }

  private async onMouseEnter(): Promise<void> {
    const nextPlayer = await firstValueFrom(gameFacade.nextPlayer$);
    const player = await firstValueFrom(gameFacade.player$);

    this.color$.next(nextPlayer === player ? player : 'white');
  }

  private onMouseLeave(): void {
    this.color$.next('white');
  }

  override render() {
    return html`
      <a-entity
        class="clickable"
        @click=${() => this.click(this.data.column)}
        @mouseenter=${() => this.onMouseEnter()}
        @mouseleave=${() => this.onMouseLeave()}
        obj-model="obj: #puissance4-pawn"
        material="color: ${observe(this.color$)};"
        rotation="-90 0 0"
        scale="0.05 0.05 0.05"
        position="${-2.1 + (this.data.column - 1) * 0.7} 4.5 0"
      ></a-entity>
    `;
  }
}
