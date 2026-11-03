import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { PageHeadComponent } from '../../shared/components/page-head/page-head';
import { DataTableComponent } from '../../shared/components/data-table/data-table';
import { PillComponent } from '../../shared/components/pill/pill';
import { ToastService } from '../../shared/components/toast/toast';
import { Pill } from '../../shared/utils/formato';

const ROLES: Record<string, string> = { ROLE_ADMIN: 'Administrador', ROLE_MANAGER: 'Gerente', ROLE_ASESOR: 'Asesor' };

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeadComponent, DataTableComponent, PillComponent],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  private toast = inject(ToastService);

  // La app no usa zone.js: el estado que cambia tras una llamada HTTP va en signals para que la vista se refresque.
  usuarios = signal<Usuario[]>([]);
  cargando = signal(false);
  guardando = signal(false);
  error = signal('');

  // Control de vistas: true muestra el formulario (crear/editar), false muestra la tabla completa
  modoFormulario = signal(false);
  esEdicion = signal(false);
  usuarioIdSeleccionado?: number;

  usuarioForm!: FormGroup;

  columnas = ['ID', 'Usuario', 'Apellidos y nombres', 'Documento', 'Rol', 'Estado', ''];
  activo: Pill = { cls: 'ok', icon: 'check', label: 'Activo' };
  inactivo: Pill = { cls: 'crit', icon: 'x', label: 'Inactivo' };

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  rolTexto(role: string) {
    return ROLES[role] || role;
  }

  invalido(campo: string) {
    const c = this.usuarioForm.get(campo);
    return !!c && c.invalid && c.touched;
  }

  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: [''], // Opcional en edición, obligatorio en creación
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      tipoDocumento: ['DNI', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern(/^[0-9]{8,11}$/)]],
      role: ['ROLE_ASESOR', Validators.required],
      activo: [true]
    });

    // Si es nuevo usuario, la contraseña es obligatoria
    this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.error.set('');
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.error.set('No se pudieron cargar los usuarios. Verifica que el backend esté en marcha.');
        this.cargando.set(false);
      }
    });
  }

  // Abrir vista para crear un usuario nuevo
  abrirNuevoUsuario(): void {
    this.esEdicion.set(false);
    this.error.set('');
    this.usuarioIdSeleccionado = undefined;
    this.usuarioForm.reset({
      tipoDocumento: 'DNI',
      role: 'ROLE_ASESOR',
      activo: true
    });
    this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('password')?.updateValueAndValidity();
    this.modoFormulario.set(true);
  }

  // Seleccionar un usuario de la tabla para editarlo
  seleccionarUsuarioParaEditar(u: Usuario): void {
    this.esEdicion.set(true);
    this.error.set('');
    this.usuarioIdSeleccionado = u.id;

    // En edición, la contraseña no es obligatoria (si se deja en blanco no se cambia)
    this.usuarioForm.get('password')?.clearValidators();
    this.usuarioForm.get('password')?.updateValueAndValidity();

    this.usuarioForm.reset({
      username: u.username,
      nombres: u.nombres,
      apellidos: u.apellidos,
      tipoDocumento: u.tipoDocumento,
      numeroDocumento: u.numeroDocumento,
      role: u.role,
      activo: u.activo,
      password: ''
    });

    this.modoFormulario.set(true);
  }

  volverATabla(): void {
    this.modoFormulario.set(false);
  }

  // Guardar (Crear o Actualizar) mediante botón explícito
  guardarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.error.set('Completa correctamente los campos marcados antes de guardar.');
      return;
    }

    this.error.set('');
    this.guardando.set(true);
    const formData: Usuario = this.usuarioForm.value;
    const editar = this.esEdicion() && this.usuarioIdSeleccionado !== undefined;
    const obs = editar
      ? this.usuarioService.actualizarUsuario(this.usuarioIdSeleccionado!, formData)
      : this.usuarioService.crearUsuario(formData);

    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.toast.show(editar ? 'Usuario actualizado.' : 'Usuario creado.');
        this.cargarUsuarios();
        this.volverATabla();
      },
      error: (err) => {
        console.error(editar ? 'Error al actualizar' : 'Error al crear', err);
        this.guardando.set(false);
        this.error.set(editar
          ? 'Hubo un error al actualizar el usuario.'
          : 'Hubo un error al registrar el usuario (verifica que el usuario o el documento no existan).');
      }
    });
  }

  // Borrado lógico rápido desde la tabla
  toggleEstado(usuario: Usuario, event: Event): void {
    event.stopPropagation(); // Evita que se abra la edición al hacer clic en el botón de estado
    if (usuario.id !== undefined) {
      // Llamamos al servicio de cambio de estado
      const obs = usuario.activo
        ? this.usuarioService.deshabilitarUsuario(usuario.id)
        : this.usuarioService.activarUsuario(usuario.id);

      obs.subscribe({
        next: () => {
          this.usuarios.update(l => l.map(u => u.id === usuario.id ? { ...u, activo: !u.activo } : u));
        },
        error: (err:any) => {
          console.error('Error al cambiar estado', err);
          this.toast.show('No se pudo cambiar el estado del usuario.', true);
        }
      });
    }
  }
}
