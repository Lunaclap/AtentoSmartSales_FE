import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { ToastComponent } from '../../shared/components/toast/toast';
import { SesionExpiradaComponent } from '../../shared/components/sesion-expirada/sesion-expirada';
import { SesionService } from '../../core/services/sesion.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent, SesionExpiradaComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  sesion = inject(SesionService);

  ngOnInit() { this.sesion.iniciar(); }
  ngOnDestroy() { this.sesion.detener(); }
}
