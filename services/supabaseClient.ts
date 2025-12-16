import { createClient } from '@supabase/supabase-js';

// Safely get environment variables supporting both Vite (import.meta.env) and standard process.env
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || '';
    }
  } catch (e) {
    // ignore
  }
  
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
  } catch (e) {
    // ignore
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Mock client implementation to prevent crash if credentials are missing
const createMockClient = () => {
  console.warn('⚠️ Supabase URL or Key is missing. Using mock client to prevent crash. Data will not be persisted.');
  
  const mockResponse = Promise.resolve({ 
    data: [], 
    error: null 
  });

  // A generic chainable object that returns promises at the end to mimic Supabase Query Builder
  const mockChain: any = {
    select: () => mockChain,
    order: () => mockResponse,
    eq: () => mockChain,
    single: () => Promise.resolve({ data: null, error: null }),
    insert: () => mockChain,
    update: () => mockChain,
    delete: () => mockChain,
    // Allow awaiting the chain directly
    then: (resolve: any) => resolve({ data: [], error: null })
  };

  return {
    from: () => mockChain
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createMockClient();