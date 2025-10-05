import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import pool from './config';
import type { User, DbUser } from '@/types/User.types';

type DbUserRow = mysql.RowDataPacket & DbUser;

export class UserService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = pool;
  }

  createUser = async (
    email: string,
    password: string,
    role: 'admin' | 'user' = 'user',
  ): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      `INSERT INTO users (email, password, name, role, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [email, hashedPassword, email.split('@')[0], role, true],
    );

    const user = await this.getUserById(result.insertId);
    if (!user) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
    return user;
  };

  getUserById = async (id: number): Promise<User | null> => {
    const [rows] = await this.pool.execute<DbUserRow[]>('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  };

  getUserByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await this.pool.execute<DbUserRow[]>('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    return rows.length > 0 ? rows[0] : null;
  };

  verifyCredentials = async (email: string, password: string): Promise<User | null> => {
    const [rows] = await this.pool.execute<DbUserRow[]>(
      'SELECT id, email, name, role, password, is_active, last_login, created_at, updated_at FROM users WHERE email = ?',
      [email],
    );

    const user = rows[0];
    if (!user || !user.is_active) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  };
}

export const userService = new UserService();
