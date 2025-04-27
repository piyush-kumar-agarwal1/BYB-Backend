import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  const token = jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
  return token;
};