# UsersApi

Projeto FULL-STACK com ASP.NET Core (.NET 8) + React/Vite + SQL Server.

## Requisitos
- .NET SDK 8
- Node.js 18+
- Docker (opcional)

---

## Estrutura de pastas
```
UsersApi_2/
├─ backend/
│  └─ UsersApi.Api/
│     ├─ Controllers/
│     ├─ Data/
│     ├─ DTOs/
│     ├─ Exceptions/
│     ├─ Middleware/
│     ├─ Models/
│     ├─ Profiles/
│     ├─ Repositories/
│     ├─ Services/
│     ├─ Program.cs
│     └─ UsersApi.Api.csproj
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ pages/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  ├─ index.html
│  └─ package.json
└─ docker-compose.yml
```

---

## ⚙️ Backend (ASP.NET Core)
### Recursos principais
- JWT + Refresh Token
- Roles: `ADMIN`, `MANAGER`, `USER`
- Autorização via `[Authorize]` e `[Authorize(Roles = ...)]`
- EF Core + Migrations
- AutoMapper + DTOs
- Validação via DataAnnotations
- Middleware global de erros
- Logs básicos
- Swagger apenas em DEV
- Seed automático

### Contas seed
- ADMIN: `admin@usersapi.com` / `Admin@123`
- MANAGER: `manager@usersapi.com` / `Manager@123`
- USER: `user@usersapi.com` / `User@123`

### Instalação local (sem Docker)
```bash
cd backend/UsersApi.Api
# atualize a connection string no appsettings.json

dotnet restore
# cria banco + aplica migrações automaticamente no startup
# (Program.cs executa Database.Migrate)

dotnet run
```

### Migrations (guia)
```bash
cd backend/UsersApi.Api
# adicionar
dotnet ef migrations add InitialCreate
# aplicar
dotnet ef database update
```

### Endpoints principais
**AUTH**
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/refresh`
- POST `/api/auth/logout`
- GET `/api/auth/me`

**USERS**
- GET `/api/users`
- GET `/api/users/{id}`
- POST `/api/users`
- PATCH `/api/users/{id}`
- PATCH `/api/users/{id}/status`
- DELETE `/api/users/{id}`

---

## Frontend (React + Vite + TypeScript)
### Scripts
```bash
cd frontend
npm install
npm run dev
```

### Interceptors / Tokens
- `accessToken` e `refreshToken` são armazenados em `localStorage`.
- **Nota de segurança**: em produção, use refresh token em cookie `httpOnly` para mitigar XSS.

---

## Docker Compose
```bash
docker compose up --build
```
Serviços:
- `api` (porta 5000)
- `sqlserver` (porta 1433)
- `front` (porta 5173)

---

## Variáveis de ambiente (exemplos)
Backend:
- `ConnectionStrings__DefaultConnection`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__Key`
- `Jwt__AccessTokenMinutes`
- `Jwt__RefreshTokenDays`

Frontend:
- `VITE_API_URL` (ex: `http://localhost:5000/api`)

---

## Instalação de pacotes principais
Backend:
```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package Swashbuckle.AspNetCore
```

Frontend:
```bash
npm install react react-dom react-router-dom axios
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom
```
