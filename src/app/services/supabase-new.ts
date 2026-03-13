import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getTurnos() {
    const { data, error } = await this.supabase
      .from('turnos')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });
    if (error) throw error;
    return data;
  }

  async getTurnosHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from('turnos')
      .select('*')
      .eq('fecha', hoy)
      .order('hora', { ascending: true });
    if (error) throw error;
    return data;
  }

  async updateEstadoTurno(id: number, estado: string) {
    const { error } = await this.supabase
      .from('turnos')
      .update({ estado })
      .eq('id', id);
    if (error) throw error;
  }

  async getEstadisticas() {
    const { data, error } = await this.supabase
      .from('turnos')
      .select('precio, estado, fecha');
    if (error) throw error;
    return data;
  }

  // CONFIGURACION
  async getConfiguracion() {
    const { data, error } = await this.supabase
      .from('configuracion')
      .select('*');
    if (error) throw error;
    return data;
  }

  async updateConfiguracion(clave: string, valor: string) {
    const { error } = await this.supabase
      .from('configuracion')
      .update({ valor })
      .eq('clave', clave);
    if (error) throw error;
  }

  async upsertConfiguracion(clave: string, valor: string) {
    const { error } = await this.supabase
      .from('configuracion')
      .upsert({ clave, valor }, { onConflict: 'clave' });
    if (error) throw error;
  }

  // HORARIOS
  async getHorarios() {
    const { data, error } = await this.supabase
      .from('horarios_atencion')
      .select('*')
      .order('dia_semana', { ascending: true })
      .order('hora_inicio', { ascending: true });
    if (error) throw error;
    return data;
  }

  async updateHorario(id: number, horario: any) {
    const { error } = await this.supabase
      .from('horarios_atencion')
      .update(horario)
      .eq('id', id);
    if (error) throw error;
  }

  async createHorario(horario: any) {
    const { data, error } = await this.supabase
      .from('horarios_atencion')
      .insert(horario)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteHorario(id: number) {
    const { error } = await this.supabase
      .from('horarios_atencion')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async cambiarPassword(usuario: string, nuevoHash: string): Promise<void> {
    const { error } = await this.supabase
      .from('usuarios')
      .update({ password_hash: nuevoHash })
      .eq('usuario', usuario);
    if (error) throw error;
  }

  async verificarUsuario(usuario: string, passwordHash: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('id')
      .eq('usuario', usuario)
      .eq('password_hash', passwordHash)
      .single();
    if (error) return false;
    return !!data;
  }

  async getPuestosXTurno(): Promise<number> {
    const { data, error } = await this.supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', 'puestos_por_turno')
      .single();
    if (error) return 1;
    return parseInt(data?.valor) || 1;
  }
}