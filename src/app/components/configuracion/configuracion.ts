import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.scss']
})
export class ConfiguracionComponent implements OnInit {
  nombreNegocio = '';
  descripcion = '';
  horarios: any[] = [];
  guardando = false;
  mensaje = '';
  mensajeError = '';
  diasSemana = DIAS_SEMANA;

  nuevoHorario = {
    dia_semana: 1,
    hora_inicio: '08:00',
    hora_fin: '12:00',
    activo: true
  };

  mostrarFormHorario = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    const config = await this.supabase.getConfiguracion();
    this.nombreNegocio = config.find((c: any) => c.clave === 'nombre_negocio')?.valor || '';
    this.descripcion = config.find((c: any) => c.clave === 'descripcion')?.valor || '';
    this.horarios = await this.supabase.getHorarios();
    this.horarios = await this.supabase.getHorarios();
    console.log('horarios:', this.horarios);
  }

  async guardarConfiguracion() {
    this.guardando = true;
    this.mensaje = '';
    this.mensajeError = '';
    try {
      await this.supabase.upsertConfiguracion('nombre_negocio', this.nombreNegocio);
      await this.supabase.upsertConfiguracion('descripcion', this.descripcion);
      this.mensaje = '✅ Configuración guardada correctamente.';
    } catch (e) {
      console.error(e);
      this.mensajeError = '❌ Error al guardar la configuración.';
    } finally {
      this.guardando = false;
    }
  }

  async toggleHorario(horario: any) {
    horario.activo = !horario.activo;
    await this.supabase.updateHorario(horario.id, { activo: horario.activo });
  }

  async guardarHorario(horario: any) {
    await this.supabase.updateHorario(horario.id, {
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      activo: horario.activo
    });
    this.mensaje = '✅ Horario actualizado.';
  }

  async eliminarHorario(id: number) {
    if (!confirm('¿Eliminar este horario?')) return;
    await this.supabase.deleteHorario(id);
    this.horarios = this.horarios.filter(h => h.id !== id);
  }

  async agregarHorario() {
    const nuevo = await this.supabase.createHorario(this.nuevoHorario);
    this.horarios.push(nuevo);
    this.mostrarFormHorario = false;
    this.nuevoHorario = { dia_semana: 1, hora_inicio: '08:00', hora_fin: '12:00', activo: true };
    this.mensaje = '✅ Horario agregado.';
  }

  getNombreDia(num: number): string {
    return DIAS_SEMANA[num] || '';
  }
}
