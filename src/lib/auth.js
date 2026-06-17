import { supabase } from './supabase';

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

export const signUp = (email, password, name, extra = {}) =>
  supabase.auth.signUp({ email, password, options: { data: { full_name: name, ...extra } } });

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({ provider: 'google' });

export const signOut = () =>
  supabase.auth.signOut();

export const getSession = () =>
  supabase.auth.getSession();
