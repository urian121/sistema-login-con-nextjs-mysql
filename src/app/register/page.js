'use client'

import { useState } from 'react'
import axios from 'axios'
import Link from "next/link";

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type_user: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/register", formData);

      setMessage("Usuario registrado exitosamente!");
      setMessageType("success");

      // Limpiar el formulario
      setFormData({
        name: "",
        email: "",
        password: "",
        type_user: 1,
      });
    } catch (error) {
      console.error("Error:", error);

      // Manejo optimizado de errores con axios
      if (error.response) {
        // El servidor respondió con un código de error
        setMessage(
          error.response.data.error || "Error al registrar el usuario"
        );
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        setMessage("Error de conexión. Verifica tu internet.");
      } else {
        // Algo más pasó
        setMessage("Error inesperado. Intenta nuevamente.");
      }
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md">
        <div className="shadcn-card p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Registro de Usuario
            </h1>
            <p className="text-sm text-muted-foreground">
              Crea una nueva cuenta para acceder al sistema
            </p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                messageType === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="shadcn-label">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadcn-input"
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="shadcn-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadcn-input"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="shadcn-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadcn-input"
                placeholder="Mínimo 6 caracteres"
                minLength="6"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type_user" className="shadcn-label">
                Tipo de Usuario
              </label>
              <select
                id="type_user"
                name="type_user"
                value={formData.type_user}
                onChange={handleChange}
                className="shadcn-input"
                required
              >
                <option value="1">Usuario Regular</option>
                <option value="2">Administrador</option>
                <option value="3">Moderador</option>
              </select>
            </div>

            <button
              type="submit"
              className="shadcn-button shadcn-button-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrar Usuario"}
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
