'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      // Si no hay token o datos de usuario, redirigir al login
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error al parsear datos de usuario:', error);
      router.push('/login');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-lg">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar de Bootstrap */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </a>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle d-flex align-items-center text-white" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2 fs-4"></i>
                  <span className="d-none d-md-inline">{user?.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <h6 className="dropdown-header">
                      <i className="bi bi-person me-1"></i>
                      {user?.name}
                    </h6>
                  </li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-person me-2"></i>Mi Perfil
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-gear me-2"></i>Configuración
                    </a>
                  </li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="shadcn-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="h2 mb-1">Bienvenido, {user?.name}</h1>
                  <p className="text-muted mb-0">
                    <i className="bi bi-calendar-check me-1"></i>
                    Último acceso: {new Date().toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-6 col-lg-4">
                  <div className="shadcn-card p-4 h-100">
                    <h3 className="h5 mb-3">
                      <i className="bi bi-person-circle me-2 text-primary"></i>
                      Información del Usuario
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nombre:</strong> {user?.name}</p>
                      <p><strong>Email:</strong> {user?.email}</p>
                      <p><strong>Tipo de Usuario:</strong> {
                        user?.type_user === 1 ? 'Usuario Regular' :
                        user?.type_user === 2 ? 'Administrador' :
                        user?.type_user === 3 ? 'Moderador' : 'Desconocido'
                      }</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="shadcn-card p-4 h-100">
                    <h3 className="h5 mb-3">
                      <i className="bi bi-graph-up me-2 text-success"></i>
                      Estadísticas
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><i className="bi bi-check-circle text-success me-2"></i>Sesión iniciada correctamente</p>
                      <p><i className="bi bi-shield-check text-success me-2"></i>Token de autenticación activo</p>
                      <p><i className="bi bi-unlock text-success me-2"></i>Acceso autorizado al dashboard</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
