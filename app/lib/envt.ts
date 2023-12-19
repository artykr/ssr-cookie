declare global {
  interface Window {
    env: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    }
  }
}

export const isBrowser =
  typeof document !== "undefined" && typeof process === "undefined";

export const getEnv = (name: string): string => {
  const source = (isBrowser ? window.env : process.env) ?? {};
  const value = source[name as keyof typeof source];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
};

export const getBrowserEnv = () => {
  return {
    SUPABASE_URL: getEnv("SUPABASE_URL"),
    SUPABASE_ANON_KEY: getEnv("SUPABASE_ANON_KEY"),
  };
};
