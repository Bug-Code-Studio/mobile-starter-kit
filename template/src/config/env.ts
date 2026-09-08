export const env = {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY
} as const;

if(!env.supabaseUrl) {
    throw new Error("SUPABASE_URL is not defined");
}

if(!env.supabaseKey) {
    throw new Error("SUPABASE_KEY is not defined");
}