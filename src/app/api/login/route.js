import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    // Validar Content-Type (más flexible)
    const contentType = request.headers.get('content-type');
    
    if (contentType && !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 400 }
      );
    }

    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      return NextResponse.json(
        { error: 'Formato JSON inválido' },
        { status: 400 }
      );
    }

    const { email, password } = requestData;

    // Validar que todos los campos requeridos estén presentes
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Convertir a string si no lo son y validar longitud
    const emailStr = String(email || '').trim();
    const passwordStr = String(password || '').trim();
    
    if (emailStr.length === 0 || passwordStr.length === 0) {
      return NextResponse.json(
        { error: 'Email y contraseña no pueden estar vacíos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Buscar el usuario en la base de datos
    let user;
    try {
      user = await query({
        query: 'SELECT id, name, email, password, type_user FROM tbl_users WHERE email = ?',
        values: [emailStr.toLowerCase()]
      });
    } catch (dbError) {
      console.error('Error de base de datos:', dbError);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    if (!Array.isArray(user) || user.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const userData = user[0];

    // Validar que userData tenga las propiedades necesarias
    if (!userData || !userData.password || !userData.id) {
      console.error('Datos de usuario incompletos:', userData);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    // Verificar la contraseña
    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(passwordStr, userData.password);
    } catch (bcryptError) {
      console.error('Error al verificar contraseña:', bcryptError);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Crear el token JWT
    let token;
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET no está configurado');
        return NextResponse.json(
          { error: 'Error de configuración del servidor' },
          { status: 500 }
        );
      }

      token = jwt.sign(
        { 
          id: userData.id, 
          email: userData.email,
          type_user: userData.type_user
        },
        jwtSecret,
        { expiresIn: '24h' }
      );
    } catch (jwtError) {
      console.error('Error al crear JWT:', jwtError);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    // Validar datos antes de enviar respuesta
    if (!token) {
      console.error('Token no generado correctamente');
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    // Preparar datos del usuario para la respuesta
    const userResponse = {
      id: userData.id,
      name: userData.name || '',
      email: userData.email,
      type_user: userData.type_user || 'user'
    };

    // Retornar respuesta exitosa con el token
    return NextResponse.json(
      { 
        token,
        user: userResponse,
        message: 'Login exitoso'
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error inesperado en el login:', error);
    
    // Determinar el tipo de error para logging
    let errorType = 'unknown';
    if (error.name === 'ValidationError') errorType = 'validation';
    else if (error.name === 'DatabaseError') errorType = 'database';
    else if (error.name === 'JsonWebTokenError') errorType = 'jwt';
    
    console.error(`Error tipo: ${errorType}, Mensaje: ${error.message}`);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: 'Ha ocurrido un error inesperado. Por favor intenta más tarde.'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
