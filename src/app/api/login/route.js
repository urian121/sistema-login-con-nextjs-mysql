import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validar que todos los campos requeridos estén presentes
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Buscar el usuario en la base de datos
    const user = await query({
      query: 'SELECT id, name, email, password, type_user FROM tbl_users WHERE email = ?',
      values: [email]
    })

    if (user.error) {
      console.error('Error al buscar usuario:', user.error)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    const userData = user[0]

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, userData.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Crear el token JWT
    const token = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email,
        type_user: userData.type_user
      },
      process.env.JWT_SECRET || 'tu-secreto-jwt-muy-seguro',
      { expiresIn: '24h' }
    )

    // Retornar respuesta exitosa con el token
    return NextResponse.json(
      { 
        token,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          type_user: userData.type_user
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en el login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
