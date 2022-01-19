import { gameFacade } from '@marcbuils/puissance4-game/domain';
import '@marcbuils/puissance4-game/ui-buttons';
import '@marcbuils/puissance4-game/ui-pawns';
import '@marcbuils/puissance4-game/ui-player';
import '@marcbuils/puissance4-game/ui-puissance4';
import '@marcbuils/puissance4-game/ui-reset';
import { observe } from '@metapins/lit-observe';
import {
  AfterEnterObserver,
  BeforeEnterObserver,
  PreventAndRedirectCommands,
  Router,
  RouterLocation,
} from '@vaadin/router';
import 'aframe';
import 'aframe-blink-controls';
import 'aframe-environment-component';
import 'aframe-extras';
import { html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import 'networked-aframe';
import { BehaviorSubject } from 'rxjs';
import { routes } from './puissance4-game-feature-game.routes';

declare const NAF: any;
declare const AFRAME: any; // @todo: replace it by import { AFrame } from 'aframe';

@customElement('p4g-game')
export class GameElement
  extends LitElement
  implements BeforeEnterObserver, AfterEnterObserver
{
  @query('[data-router-outlet]') outlet!: Node;
  private isOwner$ = new BehaviorSubject(false);
  private isVRMode$ = new BehaviorSubject(false);

  protected override createRenderRoot() {
    return this;
  }

  public onBeforeEnter(
    _location: RouterLocation,
    commands: PreventAndRedirectCommands,
    router: Router
  ) {
    if ((router.getOutlet() as Element).querySelector(':scope > p4g-game')) {
      return commands.prevent();
    }

    return undefined;
  }

  public onAfterEnter() {
    this.initializeNAF();
    this.initPuissance4();
  }

  protected override firstUpdated(): void {
    const router = new Router(this.outlet);
    router.setRoutes(routes);
  }

  private initializeNAF() {
    NAF.schemas.getComponentsOriginal = NAF.schemas.getComponents;

    NAF.schemas.getComponents = (template: unknown) => {
      if (!NAF.schemas.hasTemplate('#head-template')) {
        NAF.schemas.add({
          template: '#head-template',
          components: [
            'position',
            'rotation',

            // NOTICE THAT WE SYNC PLAYER INFO! this is where color and username are stored
            'p4g-game-player',
          ],
        });
      }

      if (!NAF.schemas.hasTemplate('#p4g-game-puissance4-template')) {
        NAF.schemas.add({
          template: '#p4g-game-puissance4-template',
          components: ['p4g-game-puissance4'],
        });
      }

      const components = NAF.schemas.getComponentsOriginal(template);
      return components;
    };
  }

  initPuissance4() {
    console.log('Waiting players...');

    setTimeout(() => {
      // Now it’s safe to change the scene components...
      if (!document.querySelector('[p4g-game-puissance4]')) {
        console.log('You are owner');
        gameFacade.setPawnsPlayer('yellow');
        this.isOwner$.next(true);
      } else {
        console.log('You are guest');
        gameFacade.setPawnsPlayer('red');
      }
    }, 5000);
  }

  private updateName(name: string) {
    // @todo: replace any by Entity
    (document?.querySelector('#local-avatar') as any).setAttribute(
      'p4g-game-player',
      'name',
      name
    );
  }

  // Render the UI as a function of component state
  override render() {
    return html`
      <input
        id="username-overlay"
        style="z-index: 100; bottom: 24px; left: 24px; position:fixed;"
        @input=${(event: any) => this.updateName(event.target.value)}
      />
      <a-scene
        cursor="rayOrigin: mouse; fuse: false;"
        networked-scene="
      serverURL: /;
      room: puissance4;
      debug: true;
      audio: false;
      adapter: wseasyrtc;
    "
        @enter-vr=${() => this.isVRMode$.next(true)}
        @exit-vr=${() => this.isVRMode$.next(false)}
      >
        <a-assets>
          <a-asset-item
            id="left-hand-model"
            src="./assets/leftHandHigh.glb"
          ></a-asset-item>
          <a-asset-item
            id="right-hand-model"
            src="./assets/rightHandHigh.glb"
          ></a-asset-item>
          <a-asset-item
            id="puissance4-grid"
            src="./assets/grid.obj"
          ></a-asset-item>
          <a-asset-item
            id="puissance4-pawn"
            src="./assets/pawn.obj"
          ></a-asset-item>
          <a-asset-item
            id="puissance4-forest"
            src="./assets/forest.obj"
          ></a-asset-item>
          <a-asset-item
            id="puissance4-arches"
            src="./assets/arches.obj"
          ></a-asset-item>

          <!-- Camera Rig / Player -->
          <template id="camera-rig-template">
            <a-entity></a-entity>
          </template>

          <!-- Head / Avatar -->
          <template id="head-template">
            <a-entity
              p4g-game-player
              class="avatar"
              networked-audio-source
            ></a-entity>
          </template>

          <!-- Hands -->
          <template id="left-hand-template">
            <a-entity>
              <a-gltf-model
                class="tracked-left-hand"
                rotation="0 0 90"
                src="#left-hand-model"
              ></a-gltf-model>
            </a-entity>
          </template>

          <template id="right-hand-template">
            <a-entity>
              <a-gltf-model
                class="tracked-right-hand"
                rotation="0 0 -90"
                src="#right-hand-model"
              ></a-gltf-model>
            </a-entity>
          </template>

          <template id="p4g-game-puissance4-template">
            <a-entity p4g-game-puissance4></a-entity>
          </template>
        </a-assets>

        <a-entity data-router-outlet></a-entity>

        <a-entity
          id="camera-rig"
          networked="template: #camera-rig-template;"
          position="0 0 7"
        >
          <a-entity
            id="local-avatar"
            camera
            position="0 1.6 0"
            wasd-controls
            look-controls="touchEnabled: false; magicWindowTrackingEnabled: false;"
            networked="template: #head-template;"
          >
          </a-entity>

          ${observe(this.isVRMode$, (isVRMode) =>
            isVRMode && !AFRAME.utils.device.isMobile()
              ? html`
                  <a-entity
                    shadow
                    laser-controls="hand: left"
                    blink-controls="cameraRig: #camera-rig; teleportOrigin: #local-avatar; collisionEntities: .environmentGround"
                    networked="template: #left-hand-template; attachTemplateToLocal: false;"
                    raycaster="objects: .clickable;"
                  ></a-entity>
                  <a-entity
                    shadow
                    laser-controls="hand: right"
                    blink-controls="cameraRig: #camera-rig; teleportOrigin: #local-avatar; collisionEntities: .environmentGround"
                    networked="template: #right-hand-template; attachTemplateToLocal: false;"
                    raycaster="objects: .clickable;"
                  ></a-entity>
                `
              : html``
          )}
        </a-entity>

        <a-entity
          light="type: directional; color: #FFF; intensity: 0.5"
          position="-1.75012 -0.73073 -27.93221"
        ></a-entity>
        <a-entity
          light="type: directional; color: #FFF; intensity: 0.5"
          position="-1.75012 -0.73073 27.93221"
        ></a-entity>
        <a-entity
          light="type: directional; color: #FFF; intensity: 1"
          position="0 1 0"
        ></a-entity>

        <a-p4g-game-buttons></a-p4g-game-buttons>

        <a-p4g-game-reset></a-p4g-game-reset>

        <a-entity
          shadow
          obj-model="obj: #puissance4-grid"
          material="color: blue;"
          rotation="-90 0 0"
          scale="0.05 0.05 0.05"
          position="0 0 0"
        ></a-entity>

        <a-p4g-game-pawns></a-p4g-game-pawns>

        ${observe(this.isOwner$, (isOwner) =>
          isOwner
            ? html`
                <a-entity
                  networked="template: #p4g-game-puissance4-template"
                ></a-entity>
              `
            : html``
        )}
      </a-scene>
    `;
  }
}
