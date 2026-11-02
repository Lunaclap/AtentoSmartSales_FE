import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  
  usuarios: Usuario[] = [];
  cargando: boolean = false;
  
  // Control de vistas: true muestra el formulario (crear/editar), false muestra la tabla completa
  modoFormulario: boolean = false;
  esEdicion: boolean = false;
  usuarioIdSeleccionado?: number;

  usuarioForm!: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
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
    this.cargando = true;
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.cargando = false;
      }
    });
  }

  // Abrir vista para crear un usuario nuevo
  abrirNuevoUsuario(): void {
    this.esEdicion = false;
    this.usuarioIdSeleccionado = undefined;
    this.usuarioForm.reset({
      tipoDocumento: 'DNI',
      role: 'ROLE_ASESOR',
      activo: true
    });
    this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('password')?.updateValueAndValidity();
    this.modoFormulario = true;
  }

  // Seleccionar un usuario de la tabla para editarlo
  seleccionarUsuarioParaEditar(u: Usuario): void {
    this.esEdicion = true;
    this.usuarioIdSeleccionado = u.id;
    
    // En edición, la contraseña no es obligatoria (si se deja en blanco no se cambia)
    this.usuarioForm.get('password')?.clearValidators();
    this.usuarioForm.get('password')?.updateValueAndValidity();

    this.usuarioForm.patchValue({
      username: u.username,
      nombres: u.nombres,
      apellidos: u.apellidos,
      tipoDocumento: u.tipoDocumento,
      numeroDocumento: u.numeroDocumento,
      role: u.role,
      activo: u.activo,
      password: ''
    });

    this.modoFormulario = true;
  }

  volverATabla(): void {
    this.modoFormulario = false;
  }

  // Guardar (Crear o Actualizar) mediante botón explícito
  guardarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      alert('Por favor complete correctamente todos los campos obligatorios antes de guardar.');
      return;
    }

    const formData: Usuario = this.usuarioForm.value;

    if (this.esEdicion && this.usuarioIdSeleccionado !== undefined) {
      this.usuarioService.actualizarUsuario(this.usuarioIdSeleccionado, formData).subscribe({
        next: () => {
          alert('¡Usuario actualizado con éxito!');
          this.cargarUsuarios();
          this.volverATabla();
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          alert('Hubo un error al actualizar el usuario.');
        }
      });
    } else {
      this.usuarioService.crearUsuario(formData).subscribe({
        next: () => {
          alert('¡Usuario creado con éxito!');
          this.cargarUsuarios();
          this.volverATabla();
        },
        error: (err) => {
          console.error('Error al crear', err);
          alert('Hubo un error al registrar el usuario (verifique que el username o documento no existan).');
        }
      });
    }
  }

  // Borrado lógico rápido desde la tabla
  toggleEstado(usuario: Usuario, event: Event): void {
    event.stopPropagation(); // Evita que se abra la edición al hacer clic en el botón de estado
    if (usuario.id !== undefined) {
      const endpoint = usuario.activo ? 'deshabilitar' : 'activar';
      // Llamamos al servicio de cambio de estado
      const obs = usuario.activo 
        ? this.usuarioService.deshabilitarUsuario(usuario.id) 
        : this.usuarioService.activarUsuario(usuario.id);

      obs.subscribe({
        next: () => {
          usuario.activo = !usuario.activo;
        },
        error: (err:any) => {
          console.error('Error al cambiar estado', err);
        }
      });
    }
  }
}