# 🔐 Sistema de Autenticación con Next.js y MySQL

Un sistema completo de autenticación desarrollado con **Next.js 14**, **MySQL** y **Bootstrap 5**. Incluye registro de usuarios, login seguro con JWT, dashboard protegido y notificaciones modernas.

![Demo](https://raw.githubusercontent.com/urian121/imagenes-proyectos-github/refs/heads/master/sistema-login-con-nextjs-y-mysql.gif)

## ✨ Características

- 🔒 **Autenticación segura** con JWT y bcrypt
- 📱 **Diseño responsive** con Bootstrap 5
- 🎨 **UI moderna** con componentes reutilizables
- 🔔 **Notificaciones toast** con iconos SVG
- ✅ **Validación de formularios** con react-hook-form
- 🛡️ **Rutas protegidas** y manejo de sesiones
- 🗄️ **Base de datos MySQL** con consultas optimizadas

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 14, React, Bootstrap 5, Bootstrap Icons
- **Backend:** Next.js API Routes, MySQL2
- **Autenticación:** JWT, bcryptjs
- **Formularios:** React Hook Form
- **Notificaciones:** nextjs-toast-notify
- **HTTP Client:** Axios

## 📋 Prerrequisitos

- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd sistema-login-con-nextjs-mysql
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar la base de datos
1. Crear la base de datos MySQL:
```sql
CREATE DATABASE bd_login_nextjs;
```

2. Importar el esquema desde `bd/bd_login_nextjs.sql`:
```bash
mysql -u root -p bd_login_nextjs < bd/bd_login_nextjs.sql
```

### 4. Configurar variables de entorno
Crear archivo `.env.local` en la raíz del proyecto:
```env
JWT_SECRET=tu_clave_secreta_super_segura_aqui
```

### 5. Ejecutar el proyecto
```bash
npm run dev
# o
yarn dev
```

Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Dependencias Principales

```bash
npm i bootstrap@5.3.8
npm i bootstrap-icons
npm install mysql2
npm install bcryptjs
npm install jsonwebtoken
npm install axios
npm install nextjs-toast-notify
npm install react-hook-form
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/           # API Routes (login, register)
│   ├── components/    # Componentes reutilizables
│   ├── dashboard/     # Página protegida del dashboard
│   ├── lib/          # Configuración de BD y utilidades
│   ├── login/        # Página de inicio de sesión
│   ├── register/     # Página de registro
│   └── styles/       # Estilos globales
bd/
└── bd_login_nextjs.sql # Esquema de la base de datos
```

## 🔧 Configuración de Base de Datos

Modificar la configuración en `src/app/lib/db.js` según tu entorno:

```javascript
const dbconnection = await mysql.createConnection({
  host: "localhost",
  database: "bd_login_nextjs", 
  user: "root",
  password: "tu_password",
  port: "3306"
});
```

## 🎯 Funcionalidades

- **Registro de usuarios** con validación de email único
- **Login seguro** con verificación de credenciales
- **Dashboard protegido** con información del usuario
- **Logout** con limpieza de sesión
- **Notificaciones toast** para feedback del usuario
- **Validación de formularios** en tiempo real
- **Manejo robusto de errores** del servidor y cliente

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

⭐ **¡No olvides dar una estrella si te gustó el proyecto!**

