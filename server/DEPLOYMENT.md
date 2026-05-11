# Production Deployment Checklist

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon or self-hosted)
- Environment variables configured (.env file)
- Cloudinary account for image uploads
- Resend API key for email notifications
- Wompi credentials for payment processing
- Google OAuth credentials

## Environment Setup

### Server (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=<64-byte-hex-random-string>
PORT=3001
FRONTEND_URL=https://your-domain.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
WOMPI_PUBLIC_KEY=...
WOMPI_PRIVATE_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Client (.env)
```
VITE_WOMPI_CHECKOUT_URL=https://checkout.wompi.co/l/prod_VPOS_XXX
```

## Deployment Steps

### 1. Backend Setup
```bash
cd server
npm install
npm run lint        # Verify no TypeScript errors
npm run migrate     # Run database migrations
npm run build       # Compile TypeScript
npm start           # Start production server
```

### 2. Health Check
```bash
npm run health-check
# Expected: {"message":"Conexión exitosa","time":{...}}
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run type-check  # Verify TypeScript
npm run build       # Build for production
npm run preview     # Preview production build
```

## Key Security Features

✅ **JWT Security**
- Centralized secret management in `config/jwt.ts`
- No fallback secrets in production
- 15-minute token expiration

✅ **Input Validation**
- Zod schema validation on all endpoints
- Request body, params, and query validation
- Prevents injection attacks

✅ **CORS Protection**
- Restricted to FRONTEND_URL only
- No wildcard origins
- Credentials-enabled for auth tokens

✅ **Rate Limiting**
- Global: 100 requests/15 min per IP
- Auth endpoints: 5 attempts/15 min
- Password reset: 3 attempts/1 hour

✅ **Database Optimization**
- Transaction-safe token deductions
- Indexed password reset tokens
- Connection pool management

✅ **Admin Security**
- Role caching (5-min TTL) for performance
- Mandatory admin verification on protected routes
- Clear error messages for security

## Database Migrations

Migrations run separately from server startup:
```bash
npm run migrate
```

Benefits:
- Controlled schema evolution
- Easier rollback on issues
- Separated concerns (app vs schema)
- Better for CI/CD pipelines

## Monitoring

### Logs to Watch
- JWT secret validation on startup
- Migration completion status
- CORS origin validation
- Rate limit hits
- Database connection pool health

### Health Endpoints
- `GET /test-db` - Database connectivity
- `GET /api/tokens/paquetes` - API availability (public)

## Common Issues

### JWT_SECRET not set
```
Error: Falta JWT_SECRET en variables de entorno...
Solution: Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Migration fails
- Verify DATABASE_URL connectivity
- Check schema exists in Neon
- Review migration logs for specific errors

### Rate limit blocking
- Check CORS_ALLOWED_ORIGINS config
- Verify rate limit settings match production load
- Monitor 429 responses

## Performance Optimization

- ✅ Admin role caching (5-min TTL)
- ✅ Password reset indexed queries
- ✅ Connection pooling configured
- ✅ CORS max-age: 24 hours
- ✅ Rate limit use Redis-compatible store (recommended)

## Backup & Recovery

Before production deployment:
1. Backup PostgreSQL database
2. Test migrations on staging first
3. Have rollback plan for schema changes
4. Document any manual schema modifications

## Continuous Integration

Suggested pipeline:
1. Run `npm run type-check` on server and client
2. Run `npm run lint` for code quality
3. Run `npm run build` to verify compilation
4. Run test suite (if available)
5. Deploy migrations with `npm run migrate`
6. Deploy application code
7. Run `npm run health-check` to verify
