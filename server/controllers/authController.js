import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { localStore } from '../utils/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-hackathon-key';

const authSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const register = async (req, res) => {
  try {
    const validation = authSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors[0].message });
    }

    const { email, password } = validation.data;

    if (isSupabaseConfigured) {
      // Supabase Registration
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ email, password_hash: passwordHash }])
        .select()
        .single();

      if (error) throw error;

      const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: { id: newUser.id, email: newUser.email }
      });
    } else {
      // Local Store Registration
      const existingUser = localStore.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = localStore.createUser({ email, password_hash: passwordHash });

      const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: { id: newUser.id, email: newUser.email }
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: 'Server error during user registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const validation = authSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors[0].message });
    }

    const { email, password } = validation.data;

    if (isSupabaseConfigured) {
      // Supabase Login
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email }
      });
    } else {
      // Local Store Login
      const user = localStore.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email }
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Server error during user login.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    if (isSupabaseConfigured) {
      const { data: user } = await supabase
        .from('users')
        .select('id, email, created_at')
        .eq('id', userId)
        .single();
      if (!user) return res.status(404).json({ error: 'User profile not found.' });
      return res.status(200).json({ user });
    } else {
      const user = localStore.findUserById(userId);
      if (!user) {
        return res.status(200).json({ user: { id: userId, email: req.user.email || 'guest@insightmesh.ai' } });
      }
      return res.status(200).json({ user: { id: user.id, email: user.email, created_at: user.created_at } });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
};
