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
      const response = await axios.post('/api/login', data);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      showToast.success('¡Login exitoso!');
      setTimeout(() => router.push('/dashboard'), 1000);
      
    } catch (error) {
      const message = error.response?.status === 401 
        ? 'Email o contraseña incorrectos' 
        : 'Error de conexión. Intenta nuevamente';
      
      showToast.error(message);
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
