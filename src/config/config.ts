export const config = {
  jwtSecret: process.env.JWT_SECRET || 'jwt_secret',
  jwtExpiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600 * 1000, // 1 hour
}
