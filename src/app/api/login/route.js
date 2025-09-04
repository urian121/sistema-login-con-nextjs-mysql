import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    const user = await query({
      query: 'SELECT id, name, email, password, type_user FROM tbl_users WHERE email = ?',
      values: [email.toLowerCase()]
    });

    if (!user.length) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const userData = user[0];
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: userData.id, email: userData.email, type_user: userData.type_user },
      'mi_clave_secreta_login_2024',
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      token,
      user: {
        id: userData.id,
        name: userData.name || '',
        email: userData.email,
        type_user: userData.type_user || 'user'
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
