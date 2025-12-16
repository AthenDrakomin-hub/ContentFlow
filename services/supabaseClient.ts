
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

  // Mock user and session data
  const mockUser = {
    id: "mock-user-id",
    aud: "authenticated",
    role: "authenticated",
    email: 'demo@example.com',
    app_metadata: { provider: "email" },
    user_metadata: {},
    created_at: new Date().toISOString(),
  };

  const mockSession = {
    access_token: "mock_token",
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "mock_refresh",
    user: mockUser
  };

  // Internal state for mock auth
  // Initialize as null to show Login Page first
  let currentSession: any = null; 
  const authListeners: Function[] = [];

  const notifyListeners = (event: string, session: any) => {
    authListeners.forEach(l => l(event, session));
  };

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
    from: () => mockChain,
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'mock_path' }, error: null }),
        createSignedUrl: () => Promise.resolve({ data: { signedUrl: '#' }, error: null }),
        remove: () => Promise.resolve({ data: {}, error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '#' } }),
      })
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: currentSession?.user || null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: currentSession }, error: null }),
      signInWithPassword: (credentials: any) => {
        // Mock successful login
        currentSession = mockSession;
        notifyListeners('SIGNED_IN', currentSession);
        return Promise.resolve({ data: { user: mockUser, session: mockSession }, error: null });
      },
      signOut: () => {
        currentSession = null;
        notifyListeners('SIGNED_OUT', null);
        return Promise.resolve({ error: null });
      },
      onAuthStateChange: (callback: any) => {
        authListeners.push(callback);
        // Immediately invoke with current state so App.tsx can react on load
        callback(currentSession ? 'SIGNED_IN' : 'SIGNED_OUT', currentSession);
        return { data: { subscription: { unsubscribe: () => {
            const idx = authListeners.indexOf(callback);
            if(idx > -1) authListeners.splice(idx, 1);
        } } } };
      }
    }
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createMockClient();
