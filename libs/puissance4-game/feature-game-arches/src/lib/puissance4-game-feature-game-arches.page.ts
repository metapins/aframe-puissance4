import { AFrameElement, customElement } from '@metapins/aframe-element';
import { observe } from '@metapins/lit-observe';
import { Router } from '@vaadin/router';
import { html } from 'lit';
import { BehaviorSubject } from 'rxjs';

@customElement('p4g-game-arches')
export class GameForestElement extends AFrameElement {
  private colorLink$ = new BehaviorSubject('green');

  override render() {
    return html`
      <a-entity
        environment="preset: arches; shadow: true; skyType: atmosphere;"
      ></a-entity>

      <a-entity
        shadow
        class="clickable"
        obj-model="obj: #puissance4-forest"
        position="-3.4 -1.18 0.19"
        scale="0.05 0.05 0.05"
        rotation="-90 0 0"
        material="color: ${observe(this.colorLink$)};"
        @mouseenter=${() => this.colorLink$.next('grey')}
        @mouseleave=${() => this.colorLink$.next('green')}
        @click=${() => Router.go('/game/forest')}
      ></a-entity>
    `;
  }
}
