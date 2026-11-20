import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
    @if (novaVersao()) {
      <div class="aviso-atualizacao" role="status">
        <span>Nova versão disponível.</span>
        <button type="button" (click)="atualizar()">Atualizar</button>
      </div>
    }
  `,
  styles: `
    .aviso-atualizacao {
      position: fixed;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px 10px 16px;
      max-width: calc(100% - 32px);
      background: var(--sidebar);
      color: var(--sidebar-text);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgb(0 0 0 / 0.25);
      z-index: 1000;
    }
  `,
})
export class App {
  protected readonly novaVersao = signal(false);

  constructor() {
    const swUpdate = inject(SwUpdate);
    if (swUpdate.isEnabled) {
      swUpdate.versionUpdates.subscribe((evento) => {
        if (evento.type === 'VERSION_READY') this.novaVersao.set(true);
      });
    }
  }

  protected atualizar(): void {
    document.location.reload();
  }
}
