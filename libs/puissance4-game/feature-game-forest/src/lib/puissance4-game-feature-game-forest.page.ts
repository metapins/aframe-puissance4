import { AFrameElement, customElement } from '@metapins/aframe-element';
import { observe } from '@metapins/lit-observe';
import { Router } from '@vaadin/router';
import { html } from 'lit';
import { BehaviorSubject } from 'rxjs';

@customElement('p4g-game-forest')
export class GameForestElement extends AFrameElement {
  private colorLink$ = new BehaviorSubject('white');

  override render() {
    return html`
      <a-entity
        environment="preset: forest; shadow: true; skyType: atmosphere;"
      ></a-entity>

      <a-entity
        shadow
        class="clickable"
        obj-model="obj: #puissance4-arches"
        position="-3.6 -0.1 0.6"
        scale="0.002 0.002 0.002"
        rotation="-90 0 0"
        material="color: ${observe(this.colorLink$)};"
        @mouseenter=${() => this.colorLink$.next('grey')}
        @mouseleave=${() => this.colorLink$.next('white')}
        @click=${() => Router.go('/game/arches')}
      ></a-entity>
    `;
  }
}
