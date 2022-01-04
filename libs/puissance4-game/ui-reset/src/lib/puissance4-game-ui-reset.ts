import { gameFacade } from '@marcbuils/puissance4-game/domain';
import { AFrameElement, customElement } from '@metapins/aframe-element';
import { observe } from '@metapins/lit-observe';
import { html } from 'lit';
import { BehaviorSubject } from 'rxjs';

@customElement('p4g-game-reset')
export class ResetElement extends AFrameElement {
  private color$ = new BehaviorSubject<string>('white');

  private reset() {
    gameFacade.reset();
    this.color$.next('white');
  }

  override render() {
    return html`
      <a-sphere
        class="clickable"
        @click=${() => this.reset()}
        @mouseenter=${() => this.color$.next('red')}
        @mouseleave=${() => this.color$.next('white')}
        shadow
        position="3 0.25 0"
        material="color: ${observe(this.color$)};"
        scale="0.2 0.22 0.2"
      ></a-sphere>
    `;
  }
}
