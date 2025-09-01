import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { name, email, password, type_user } = await request.json()

    // Validar que todos los campos requeridos estén presentes
    if (!name || !email || !password || !type_user) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
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

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await query({
      query: 'SELECT id FROM tbl_users WHERE email = ?',
      values: [email]
    })

    if (existingUser.error) {
      console.error('Error al verificar usuario existente:', existingUser.error)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    // Encriptar la contraseña
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insertar el nuevo usuario en la base de datos
    const result = await query({
      query: 'INSERT INTO tbl_users (name, email, password, type_user) VALUES (?, ?, ?, ?)',
      values: [name, email, hashedPassword, parseInt(type_user)]
    })

    if (result.error) {
      console.error('Error al insertar usuario:', result.error)
      return NextResponse.json(
        { error: 'Error al registrar el usuario' },
        { status: 500 }
      )
    }

    // Retornar respuesta exitosa (sin incluir la contraseña)
    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente',
        user: {
          id: result.insertId,
          name,
          email,
          type_user: parseInt(type_user)
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en el registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
