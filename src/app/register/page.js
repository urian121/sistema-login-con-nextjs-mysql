'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { showToast } from 'nextjs-toast-notify';
import FormLayout from '../components/FormLayout';
import FormHeader from '../components/FormHeader';
import SubmitButton from '../components/SubmitButton';

export default function RegisterUser() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      type_user: 1,
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/register", data);
      
      showToast.success('¡Cuenta creada con éxito! Redirigiendo al login...', {
        duration: 2000,
        progress: true,
        position: 'bottom-center',
        transition: 'bounceIn',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="m17 11 2 2 4-4"/></svg>',
        sound: true
      });
      
      // Limpiar el formulario
      reset();
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      console.error("Error:", error);
      
      let errorMessage = 'Error inesperado. Intenta nuevamente.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response) {
        errorMessage = 'Error al crear la cuenta. Verifica los datos.';
      } else if (error.request) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      }
      
      showToast.error(errorMessage, {
        duration: 5000,
        progress: true,
        position: 'bottom-center',
        transition: 'bounceIn',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-x"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="m17 11 6 6"/><path d="m17 17 6-6"/></svg>',
        sound: true
      });
    }
  };

  const registerIcon = (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      className="mx-auto text-primary"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  return (
    <FormLayout>
      <FormHeader 
        icon={registerIcon}
        title="Registro de Usuario"
        description="Crea una nueva cuenta para acceder al sistema"
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-medium">
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "El nombre es obligatorio",
              minLength: {
                value: 2,
                message: "El nombre debe tener al menos 2 caracteres"
              }
            })}
            className={`form-control form-control-lg ${
              errors.name ? 'is-invalid' : ''
            }`}
            placeholder="Ingresa tu nombre completo"
          />
          {errors.name && (
            <div className="invalid-feedback">
              {errors.name.message}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-medium">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Ingresa un correo electrónico válido"
              }
            })}
            className={`form-control form-control-lg ${
              errors.email ? 'is-invalid' : ''
            }`}
            placeholder="ejemplo@correo.com"
          />
          {errors.email && (
            <div className="invalid-feedback">
              {errors.email.message}
            </div>
          )}
              </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-medium">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 5,
                message: "La contraseña debe tener al menos 5 caracteres"
              }
            })}
            className={`form-control ${
              errors.password ? 'is-invalid' : ''
            }`}
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && (
            <div className="invalid-feedback">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="type_user" className="form-label fw-medium">
            Tipo de Usuario
          </label>
          <select
            id="type_user"
            {...register("type_user", {
              required: "Selecciona un tipo de usuario"
            })}
            className={`form-select ${
              errors.type_user ? 'is-invalid' : ''
            }`}
          >
            <option value="1">Usuario Regular</option>
            <option value="2">Administrador</option>
            <option value="3">Moderador</option>
          </select>
          {errors.type_user && (
            <div className="invalid-feedback">
              {errors.type_user.message}
            </div>
          )}
              </div>

        <SubmitButton
           isSubmitting={isSubmitting}
           loadingText="Registrando..."
         >
           Registrar Usuario
         </SubmitButton>
      </form>

      <div className="text-center">
        <p className="text-muted mb-0">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-decoration-none fw-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </FormLayout>
  );
}
