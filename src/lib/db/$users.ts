import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import pool from './config';
import type { User, CreateUserData, UpdateUserData } from '@/types';

type DbUserRow = mysql.RowDataPacket & User;

export class UserService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = pool;
  }

  createUser = async (userData: CreateUserData): Promise<User> => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      `INSERT INTO users (email, password, name, role, is_active) 
       VALUES (?, ?, ?, ?, ?)`,
      [userData.email, hashedPassword, userData.name, userData.role, true],
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

  getAllUsers = async (): Promise<User[]> => {
    const [rows] = await this.pool.execute<DbUserRow[]>(
      'SELECT * FROM users ORDER BY created_at DESC',
    );
    return rows;
  };

  updateUser = async (id: number, userData: UpdateUserData): Promise<User | null> => {
    const updates: string[] = [];
    const values: (string | number | boolean)[] = [];

    if (userData.email !== undefined) {
      updates.push('email = ?');
      values.push(userData.email);
    }

    if (userData.password !== undefined && userData.password !== '') {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (userData.name !== undefined) {
      updates.push('name = ?');
      values.push(userData.name);
    }

    if (userData.role !== undefined) {
      updates.push('role = ?');
      values.push(userData.role);
    }

    if (userData.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(userData.is_active);
    }

    if (updates.length === 0) {
      return this.getUserById(id);
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await this.pool.execute<mysql.ResultSetHeader>(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values,
    );

    return this.getUserById(id);
  };

  deleteUser = async (id: number): Promise<boolean> => {
    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  };

  verifyCredentials = async (email: string, password: string): Promise<User | null> => {
    const user = await this.getUserByEmail(email);

    if (!user || !user.is_active) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  };

  updateLastLogin = async (id: number): Promise<void> => {
    await this.pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
  };

  close = async (): Promise<void> => {
    await this.pool.end();
  };
}

export const userService = new UserService();
