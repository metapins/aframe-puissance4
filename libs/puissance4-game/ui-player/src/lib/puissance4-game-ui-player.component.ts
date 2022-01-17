import { AFrameElement, customElement } from '@metapins/aframe-element';
import { html } from 'lit';

declare const AFRAME: any;
const { Color } = AFRAME.THREE;

@customElement('p4g-game-player')
export class GamePlayerElement extends AFrameElement {
  static override schema = {
    name: {
      type: 'string',
      default: 'user-' + Math.round(Math.random() * 10000),
    },
    color: {
      type: 'string',
      default:
        '#' +
        new Color(Math.random(), Math.random(), Math.random()).getHexString(),
    },
  };

  override init() {
    if (this.el.id === 'local-avatar') {
      const nametagInput = document.getElementById(
        'username-overlay'
      ) as HTMLInputElement;
      nametagInput.value = this.data.name;
    }
  }

  override render() {
    return html`
      <a-sphere
        class="head"
        shadow
        position="0 0 .25"
        scale="0.2 0.22 0.2"
        material="color: ${this.data.color};"
      ></a-sphere>
      <a-entity class="face" position="0 0.05 .25">
        <a-sphere
          class="eye"
          shadow
          color="white"
          position="0.06 0.05 -0.16"
          scale="0.04 0.04 0.04"
        >
          <a-sphere
            class="pupil"
            color="black"
            position="0 0 -1"
            scale="0.2 0.2 0.2"
          ></a-sphere>
        </a-sphere>
        <a-sphere
          class="eye"
          shadow
          color="white"
          position="-0.06 0.05 -0.16"
          scale="0.04 0.04 0.04"
        >
          <a-sphere
            class="pupil"
            color="black"
            position="0 0 -1"
            scale="0.2 0.2 0.2"
          ></a-sphere>
        </a-sphere>
      </a-entity>
      <a-text
        class="nametag"
        value="${this.data.name}"
        rotation="0 180 0"
        position=".25 -.35 .25"
        side="double"
        scale=".5 .5 .5"
      ></a-text>
    `;
  }
}
