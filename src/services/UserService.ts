import { BaseService } from "./BaseService";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from "../config/config";

export class UserService extends BaseService {
  // Register a new user
  async register(email: string, password: string) {
    console.log(email, password)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return user;
  }

  // Login a user
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('Invalid password');

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    // Create a new session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
      },
    });

    return { user, token };
  }

  // Logout a user
  async logout(userId: number, sessionId: number) {
    await this.prisma.session.delete({
      where: { id: sessionId, userId },
    });
  }
}