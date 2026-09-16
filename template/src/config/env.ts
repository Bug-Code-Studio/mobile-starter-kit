export const env = {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
     supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
    // Optional: analytics/crash/feature-flags stay no-op when the key is absent.
    posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
} as const;

if(!env.supabaseUrl) {
    throw new Error("SUPABASE_URL is not defined");
}

if(!env.supabaseKey) {
    throw new Error("SUPABASE_KEY is not defined");
}