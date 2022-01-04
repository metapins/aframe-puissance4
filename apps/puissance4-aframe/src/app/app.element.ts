import { Router } from '@vaadin/router';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { routes } from './app.routes';

@customElement('puissance4-root')
export class GameElement extends LitElement {
  @query('[data-router-outlet]') outlet: Element;

  override createRenderRoot() {
    return this;
  }

  override render(): TemplateResult {
    return html`<div data-router-outlet></div>`;
  }

  override firstUpdated(): void {
    const router = new Router(this.outlet);
    router.setRoutes(routes);
  }
}
