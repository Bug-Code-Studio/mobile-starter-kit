# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Data Layer

## Server state vs. client state

- **Server state → TanStack Query.** Anything fetched from Supabase or an API (reads and writes) goes through Query. Never store fetched server data in Zustand.
- **UI / global client state → Zustand.** Theme, onboarding, auth flow, cooldowns, and other device-local UI state.

## Repository pattern (per feature)

All Supabase / API access lives in a feature's `services/` layer. Components and screens only consume `hooks/`; they must never import `@/lib/supabase/client` directly.

```
features/<name>/
  services/<name>Service.ts   # pure async fns, throw normalizeError(error)
  hooks/use<Thing>.ts         # useQuery / useMutation wrappers
  queryKeys.ts                # createQueryKeys('<name>', { ... })
  types/<name>.ts
  index.ts                    # public API barrel
```

See `features/profile/` for a reference read implementation and `features/auth/` for mutations.

## TanStack Query conventions

- **Query keys:** define with `createQueryKeys` in the feature's `queryKeys.ts`. Never inline string keys. Example: `profileKeys.me()` → `['profile', 'me']`.
- **Mutations:** wrap a service call with `useMutation`; on success invalidate affected keys via `queryClient.invalidateQueries({ queryKey })`.
- **Defaults** live in `lib/query/queryClient.ts` (`QUERY_STALE_TIME` = 1m, `QUERY_GC_TIME` = 5m).
- **Retry** is error-aware (`shouldRetryQuery`): only `retryable` errors retry, up to `QUERY_MAX_RETRIES`. Mutations never retry.
- **Error handling** is centralized — services throw `normalizeError(error)` and the query/mutation caches log reportable errors.

## Zustand conventions

Stores in `src/stores/` use `persist` + `createJSONStorage(AsyncStorage)` and expose a `hasHydrated` flag (set in `onRehydrateStorage`) to avoid UI flashing before rehydration.

## Network state

`setupNetworkManagers()` (in `lib/network/`) bridges `@react-native-community/netinfo` into Query's `onlineManager` (pause while offline, refetch on reconnect) and `focusManager` (refetch on foreground). It is called once in `AppProviders`. `OfflineBanner` shows an app-wide banner while offline; use the `useNetworkStatus()` hook for custom offline UI.
