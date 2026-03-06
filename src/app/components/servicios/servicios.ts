import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: any[] = [];
  mensaje = '';
  mensajeError = '';
  mostrarForm = false;

  nuevoServicio: any = {
    nombre: '',
    precio: null,
    duracion_minutos: null,
    activo: true
  };

  constructor(private supabase: SupabaseService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.cargarServicios();
  }

  async cargarServicios() {
    this.servicios = await this.supabase.getServicios();
    this.cdr.detectChanges();
  }

  async guardarServicio(servicio: any) {
    try {
      await this.supabase.updateServicio(servicio.id, {
        nombre: servicio.nombre,
        precio: servicio.precio,
        duracion_minutos: servicio.duracion_minutos,
        activo: servicio.activo
      });
      this.mostrarMensaje('✅ Servicio actualizado.');
    } catch (e) {
      this.mostrarError('❌ Error al actualizar el servicio.');
    }
  }

  async toggleServicio(servicio: any) {
    servicio.activo = !servicio.activo;
    await this.supabase.updateServicio(servicio.id, { activo: servicio.activo });
    this.cdr.detectChanges();
  }

  async agregarServicio() {
    if (!this.nuevoServicio.nombre || !this.nuevoServicio.precio || !this.nuevoServicio.duracion_minutos) {
      this.mostrarError('❌ Completá todos los campos.');
      return;
    }
    try {
      const nuevo = await this.supabase.createServicio(this.nuevoServicio);
      this.servicios.push(nuevo);
      this.mostrarForm = false;
      this.nuevoServicio = { nombre: '', precio: null, duracion_minutos: null, activo: true };
      this.mostrarMensaje('✅ Servicio agregado.');
    } catch (e) {
      this.mostrarError('❌ Error al agregar el servicio.');
    }
  }

  async eliminarServicio(id: number) {
    if (!confirm('¿Eliminar este servicio? Esta acción no se puede deshacer.')) return;
    try {
      await this.supabase.deleteServicio(id);
      this.servicios = this.servicios.filter(s => s.id !== id);
      this.mostrarMensaje('✅ Servicio eliminado.');
    } catch (e) {
      this.mostrarError('❌ Error al eliminar. Puede tener turnos asociados.');
    }
  }

  mostrarMensaje(msg: string) {
    this.mensaje = msg;
    this.mensajeError = '';
    this.cdr.detectChanges();
    setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 3000);
  }

  mostrarError(msg: string) {
    this.mensajeError = msg;
    this.mensaje = '';
    this.cdr.detectChanges();
    setTimeout(() => { this.mensajeError = ''; this.cdr.detectChanges(); }, 3000);
  }
}
