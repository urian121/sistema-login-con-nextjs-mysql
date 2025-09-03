'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { showToast } from 'nextjs-toast-notify';
import FormHeader from '../components/FormHeader';
import SubmitButton from '../components/SubmitButton';
import FormLayout from '../components/FormLayout';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });


  
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      // Validación adicional antes del envío
      if (!data.email || !data.password) {
        showToast.error('Por favor completa todos los campos', {
          duration: 3000,
          progress: true,
          position: 'bottom-center',
          transition: 'bounceIn',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
          sound: true
        });
        return;
      }

      const response = await axios.post('/api/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Validar estructura de respuesta
      if (!response?.data) {
        throw new Error('Respuesta inválida del servidor');
      }

      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Datos de autenticación incompletos');
      }
      
      // Guardar el token en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      showToast.success('¡Login exitoso! Redirigiendo...', {
        duration: 1500,
        progress: true,
        position: 'bottom-center',
        transition: 'bounceIn',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
        sound: true
      });
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error en login:', error);
      
      let errorMessage = 'Error inesperado. Intenta nuevamente.';
      
      // Manejo robusto de errores
      if (error.response) {
        // Error de respuesta del servidor (4xx, 5xx)
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (status === 400) {
          errorMessage = data?.error || 'Datos inválidos. Revisa la información ingresada.';
        } else if (status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde.';
        } else {
          errorMessage = data?.error || `Error ${status}. Intenta nuevamente.`;
        }
      } else if (error.request) {
        // Error de red/conexión
        errorMessage = 'Sin conexión al servidor. Verifica tu internet.';
      } else if (error.message) {
        // Error de validación o procesamiento
        errorMessage = error.message;
      }
      
      showToast.error(errorMessage, {
        duration: 5000,
        progress: true,
        position: 'bottom-center',
        transition: 'bounceIn',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
        sound: true
      });
    }
  };

  return (
    <FormLayout>
      <FormHeader 
        title="Iniciar Sesión"
        description="Ingresa tus credenciales para acceder a tu cuenta"
      />
          
          <form onSubmit={handleSubmit(onSubmit)}>
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
                placeholder="tu@email.com"
              />
              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email.message}
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres"
                  }
                })}
                className={`form-control form-control-lg ${
                  errors.password ? 'is-invalid' : ''
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
            
            <SubmitButton 
              isSubmitting={isSubmitting}
              loadingText="Iniciando sesión..."
            >
              Iniciar Sesión
            </SubmitButton>
          </form>
          
      <div className="text-center">
        <p className="text-muted mb-0">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-decoration-none fw-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </FormLayout>
  );
}
