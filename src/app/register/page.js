'use client'

import { useState } from 'react'
import axios from 'axios'

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type_user: 1
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await axios.post('/api/register', formData)
      
      setMessage('Usuario registrado exitosamente!')
      setMessageType('success')
      
      // Limpiar el formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        type_user: 1
      })
      
    } catch (error) {
      console.error('Error:', error)
      
      // Manejo optimizado de errores con axios
      if (error.response) {
        // El servidor respondió con un código de error
        setMessage(error.response.data.error || 'Error al registrar el usuario')
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        setMessage('Error de conexión. Verifica tu internet.')
      } else {
        // Algo más pasó
        setMessage('Error inesperado. Intenta nuevamente.')
      }
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center mb-0">Registro de Usuario</h3>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert alert-${messageType === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                  {message}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setMessage('')}
                  ></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Mínimo 6 caracteres"
                    minLength="6"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="type_user" className="form-label">Tipo de Usuario</label>
                  <select
                    className="form-select"
                    id="type_user"
                    name="type_user"
                    value={formData.type_user}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">Usuario Regular</option>
                    <option value="2">Administrador</option>
                    <option value="3">Moderador</option>
                  </select>
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : (
                      'Registrar Usuario'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
