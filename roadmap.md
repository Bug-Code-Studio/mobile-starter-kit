# @bugcodestudio/create-app — Mobile Starter Kit Roadmap

## 1. Projenin amacı

`@bugcodestudio/create-app` Expo + TypeScript tabanlı React Native uygulamalarını hızlı ve tutarlı biçimde başlatan opinionated bir starter CLI olacaktır.

Temel hedef:

```bash
npx @bugcodestudio/create-app MyApp
```

komutundan sonra geliştiricinin authentication, onboarding, navigation shell, form altyapısı, server-state altyapısı, client-state altyapısı, UI foundation ve deep linking gibi tekrar tekrar kurduğu konularla uğraşmadan uygulamanın asıl feature'larına geçebilmesidir.

Starter kit aşağıdaki prensipleri taşımalıdır:

- Feature-based architecture
- React Navigation
- Expo + TypeScript
- Gluestack UI
- Supabase
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Reanimated
- Deep linking
- Email OTP authentication
- OTP doğrulama ekranı
- Password reset + OTP doğrulama akışı
- Onboarding
- Bottom tab navigation
- Boş Home ekranı
- Environment/config yönetimi
- Test edilebilir servis sınırları
- İleride logging, analytics, crash reporting ve feature flag eklenebilecek yapı

Bu proje bir UI template'ten ziyade tekrar kullanılabilir bir "mobile application foundation" olarak ele alınmalıdır.

---

# 2. Hedef kullanıcı deneyimi

İdeal kullanım:

```bash
npx @bugcodestudio/create-app MyApp
```

CLI:

1. Proje adını alır.
2. Expo TypeScript projesini oluşturur.
3. Starter architecture dosyalarını kopyalar.
4. Gerekli dependency'leri kurar.
5. Navigation shell'i kurar.
6. Supabase client'ı kurar.
7. Auth provider/store katmanını kurar.
8. Login / Register / OTP verification / Forgot Password / Reset Password ekranlarını ekler.
9. Onboarding shell'i ekler.
10. Bottom tabs + boş Home ekranını ekler.
11. Deep linking configuration'ını ekler.
12. Environment örneklerini oluşturur.
13. İlk çalıştırma komutlarını gösterir.

Sonuçta geliştirici mümkün olduğunca şu seviyeye gelmelidir:

```text
MyApp/
├── src/
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── services/
│   ├── store/
│   ├── theme/
│   ├── types/
│   └── utils/
├── App.tsx
├── app.config.ts
├── package.json
└── .env.example
```

---

# 3. Mimari prensipler

## 3.1 Feature-based architecture

Feature'lar birbirinden mümkün olduğunca bağımsız tutulmalıdır.

Örnek:

```text
src/features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── screens/
│   ├── services/
│   ├── schemas/
│   ├── types/
│   └── index.ts
├── onboarding/
│   ├── components/
│   ├── screens/
│   ├── services/
│   └── index.ts
└── home/
    ├── components/
    ├── screens/
    └── index.ts
```

Bir feature'ın dışarı açtığı API mümkün olduğunca `index.ts` üzerinden olmalıdır.

Örneğin:

```ts
export { LoginScreen } from './screens/login-screen';
export { useAuth } from './hooks/use-auth';
```

Bu yaklaşım feature içindeki implementation detaylarının uygulamanın diğer bölümlerine yayılmasını engeller.

## 3.2 App layer

`src/app/` uygulamanın composition layer'ıdır.

Burada:

- Root provider composition
- Navigation container
- Navigation linking configuration
- Auth-aware navigation
- App bootstrap
- Global error boundary
- Initial loading state

gibi uygulama seviyesindeki sorumluluklar bulunmalıdır.

## 3.3 Core katmanları

Feature'lardan bağımsız tekrar kullanılabilir altyapı:

```text
src/
├── components/    # Shared UI
├── config/        # Environment and app configuration
├── hooks/         # Generic hooks
├── lib/           # External library setup
├── providers/     # Context providers
├── services/      # Cross-feature infrastructure
├── store/         # Global client state
├── theme/         # Design system / UI configuration
├── types/         # Global types
└── utils/         # Pure utility functions
```

Core katmanda feature-spesifik iş mantığı bulunmamalıdır.

---

# 4. Dependency stratejisi

Starter kit'in dependency listesi kontrollü ve opinionated olmalıdır.

## Core dependencies

- Expo
- React Native
- TypeScript
- React Navigation
- Gluestack UI
- Supabase client
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Reanimated

## Navigation için önerilen sınırlar

React Navigation kullanıldığı için route isimleri string olarak tüm uygulamaya dağılmamalıdır.

Merkezi route type'ları oluşturulmalıdır:

```ts
export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
  AccountVerify: {
    email: string;
    purpose: 'signup' | 'password-reset';
  };
};
```

Route parametreleri typed olmalı ve navigation çağrıları type-safe hale getirilmelidir.

---

# 5. Navigation mimarisi

Starter kit için önerilen navigation tree:

```text
NavigationContainer
└── RootNavigator
    ├── OnboardingStack
    │   └── Onboarding
    │
    ├── AuthStack
    │   ├── Login
    │   ├── Register
    │   ├── AccountVerify
    │   ├── ForgotPassword
    │   └── ResetPassword
    │
    └── MainStack
        └── BottomTabNavigator
            ├── Home
            └── Profile / Placeholder
```

İlk sürümde yalnızca Home tab'ı bırakılabilir. Navigation shell hazır olmalı ancak yeni feature eklemek kolay olmalıdır.

## Auth-aware routing

Navigation state aşağıdaki uygulama durumlarından biri olarak modellenmelidir:

```text
BOOTSTRAPPING
ONBOARDING_REQUIRED
UNAUTHENTICATED
AUTHENTICATED
```

Onboarding authentication'dan önce gelir. Starter kit'in varsayılan ürün akışı:

```text
App start
   |
   v
Restore local app state + Supabase session
   |
   v
Check onboarding completion
   |
   +-- incomplete ---------------------> OnboardingStack
   |                                      |
   |                                      v
   |                              Onboarding complete
   |                                      |
   |                                      v
   +-- complete ----------------------> Session check
                                          |
                                          +-- no session ------> AuthStack
                                          |
                                          +-- session exists --> MainStack
```

Bu modelde kullanıcı ilk açılışta doğrudan login/register ekranıyla karşılaşmaz. Onboarding tamamlandıktan sonra auth aşamasına geçilir. Kullanıcı daha önce onboarding'i tamamladıysa açılışta onboarding atlanır.

Onboarding completion bilgisi auth session'dan bağımsız düşünülmelidir. Bu bilgi uygulamanın ilk kullanım deneyimini kontrol eder; kullanıcı giriş yapmış olmasa bile onboarding tamamlanabilir.

Bu kontrol tek bir yerde yapılmalıdır. Ekranların her birinde ayrı ayrı auth veya onboarding redirect logic yazılmamalıdır. Root navigator tek bir navigation decision point olmalıdır.

---

# 6. Supabase katmanı

Supabase client tek bir abstraction üzerinden oluşturulmalıdır.

```text
src/lib/supabase/
├── client.ts
├── types.ts
└── index.ts
```

Örnek sorumluluklar:

- Client initialization
- Session persistence
- Auth configuration
- Database typing
- Storage access

Supabase çağrılarının her feature içinde doğrudan dağılmaması tercih edilmelidir.

Daha temiz sınır:

```text
features/auth/services/auth-service.ts
```

ve bu service'in altında:

```text
src/lib/supabase/client.ts
```

bulunmalıdır.

Bu sayede ileride auth sağlayıcısı veya backend katmanı değişse bile ekranlar minimum etkilenir.

---

# 7. Authentication mimarisi

Starter kit'in en önemli hazır modülü authentication olmalıdır.

## Ekranlar

```text
Login
Register
AccountVerify
ForgotPassword
ResetPassword
```

Opsiyonel gelecekte:

```text
ChangePassword
UpdateEmail
ConfirmEmail
SessionExpired
```

## 7.1 Register

Kullanıcı email + password ile kayıt olur.

Kayıt sonrası:

```text
Register
   ↓
Supabase signUp
   ↓
OTP / email verification gerekiyorsa
   ↓
AccountVerify
   ↓
Session restore / login state
```

## 7.2 AccountVerify

`AccountVerify` reusable bir ekran olarak tasarlanmalıdır.

Parametre:

```ts
{
  email: string;
  purpose: 'signup' | 'password-reset';
}
```

Böylece aynı OTP UI hem signup doğrulamasında hem password reset akışında kullanılabilir.

Ekranın sorumlulukları:

- 6 haneli OTP input
- Auto focus
- Paste handling
- OTP validation
- Resend code
- Countdown
- Loading state
- Error state
- Başarılı doğrulamada uygun flow'a yönlendirme

## 7.3 Forgot Password

Akış:

```text
ForgotPassword
   ↓
Enter email
   ↓
Request reset code
   ↓
AccountVerify(purpose=password-reset)
   ↓
ResetPassword
   ↓
Success
   ↓
Login
```

## 7.4 OTP state machine

OTP logic tekrar kullanılabilir bir hook/utility olarak çıkarılmalıdır.

Örnek:

```ts
useOtpVerification({
  email,
  purpose,
  onVerified,
});
```

Bu yapı UI ile Supabase logic'ini birbirinden ayırır.

OTP lifecycle:

```text
IDLE
SENDING
CODE_SENT
VERIFYING
VERIFIED
RESENDING
ERROR
EXPIRED
```

---

# 8. Form mimarisi

Tüm auth formları React Hook Form + Zod kullanmalıdır.

Örnek:

```text
features/auth/
├── schemas/
│   ├── login-schema.ts
│   ├── register-schema.ts
│   ├── forgot-password-schema.ts
│   └── reset-password-schema.ts
```

Validation component içinde inline yapılmamalıdır.

Örnek:

```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Form layer'ın avantajları:

- Consistent validation
- Type inference
- Error message standardizasyonu
- Test kolaylığı
- Reusable form controls

---

# 9. UI foundation

Gluestack UI proje genelindeki ortak componentlerin temelini oluşturmalıdır.

Starter kit aşağıdakileri hazır sağlamalıdır:

```text
src/components/ui/
├── button/
├── input/
├── text-field/
├── password-input/
├── otp-input/
├── screen/
├── keyboard-aware-screen/
├── loading-view/
├── empty-state/
├── error-state/
└── index.ts
```

Özellikle form componentleri React Hook Form ile kolay entegre olmalıdır.

Örneğin:

```tsx
<FormInput
  control={control}
  name="email"
  label="Email"
/>
```

Bu yaklaşım her projede aynı form boilerplate'inin tekrar yazılmasını azaltır.

---

# 10. TanStack Query stratejisi

TanStack Query server state için kullanılmalıdır.

Kural:

- Server data → TanStack Query
- UI/client preferences → Zustand veya local state
- Form state → React Hook Form

Feature örneği:

```text
features/profile/
├── api/
│   ├── get-profile.ts
│   ├── update-profile.ts
│   └── query-keys.ts
├── hooks/
│   ├── use-profile.ts
│   └── use-update-profile.ts
└── screens/
```

Query key'leri merkezi/feature scoped tutulmalıdır.

Örnek:

```ts
export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};
```

Bu standart yeni feature'ların hızlı eklenmesini sağlar.

---

# 11. Zustand stratejisi

Zustand her veriyi tuttuğumuz global store olmamalıdır.

Sadece gerçekten client-side global state olan alanlar kullanılmalıdır.

Örnekler:

- UI preferences
- Temporary navigation-related state
- Feature flags cache
- Local onboarding progress (gerektiğinde)
- Global app settings

Server'dan gelen profile/tasks/etc. verisi Zustand'a kopyalanmamalıdır.

Önerilen yapı:

```text
src/store/
├── app-store.ts
└── index.ts
```

İleride feature scoped stores da kullanılabilir:

```text
features/example/store/example-store.ts
```

---

# 12. Onboarding

Onboarding tek bir dev route yerine state-aware bir feature olmalıdır.

Önerilen yapı:

```text
features/onboarding/
├── components/
│   ├── onboarding-card.tsx
│   └── onboarding-progress.tsx
├── screens/
│   └── onboarding-screen.tsx
├── data/
│   └── onboarding-steps.ts
└── services/
    └── onboarding-service.ts
```

Starter kit içinde onboarding görsel açıdan minimal ama production-ready olmalıdır.

Örneğin:

```text
Step 1
Welcome

Step 2
Tell us about your app/use case

Step 3
Ready
```

Asıl önemli nokta ekranın kolay değiştirilebilmesidir.

Onboarding tamamlandığında backend profile kaydı veya metadata güncellemesi için abstraction bulunmalıdır.

---

# 13. Deep linking

Deep linking starter kit'in birinci sınıf özelliği olmalıdır.

Desteklenecek örnek scheme:

```text
myapp://
```

Prod tarafında Universal Links / Android App Links için genişletilebilir yapı hazırlanmalıdır.

Örnek route'lar:

```text
myapp://auth/verify
myapp://auth/reset-password
myapp://home
```

Link handling merkezi bir yerde yapılmalıdır.

Örnek yapı:

```text
src/app/navigation/
├── linking.ts
├── root-navigator.tsx
├── route-types.ts
└── navigation-ref.ts
```

## Deep link + auth birleşimi

Önemli edge case:

```text
Deep Link
   ↓
Auth kontrolü
   ↓
Gerekirse session restore
   ↓
OTP / protected route
   ↓
Target screen
```

Örneğin kullanıcı logout durumda `myapp://home` açarsa doğrudan Home'a gitmemelidir.

Deep link parser ile auth guard birlikte çalışmalıdır.

---

# 14. Environment yönetimi

Template hiçbir gerçek secret içermemelidir.

Başlangıç:

```text
.env.example
```

örneğin:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Environment parsing merkezi olmalıdır:

```text
src/config/env.ts
```

Uygulama içerisinde rastgele:

```ts
process.env.X
```

kullanmak yerine:

```ts
config.supabase.url
```

gibi typed access tercih edilmelidir.

Eksik required environment varsa uygulama mümkün olduğunca erken ve anlaşılır hata vermelidir.

---

# 15. App configuration

Expo config merkezi tutulmalıdır.

Önerilen:

```text
app.config.ts
```

Buradan ileride şu alanlar yönetilebilir:

- App name
- Slug
- Scheme
- Bundle identifier
- Android package
- Expo plugins
- Environment-specific values
- Version
- Deep linking

Starter kit CLI oluştururken uygulama adından slug gibi değerleri üretmelidir.

---

# 16. Reanimated stratejisi

Reanimated template'e dependency olarak dahil edilebilir ancak starter kit içinde yalnızca gerçek bir animation abstraction gerektiğinde kullanılmalıdır.

Örnek reusable motion primitives:

```text
src/components/motion/
├── fade-in.tsx
├── slide-in.tsx
└── press-scale.tsx
```

Amaç bütün projeyi Reanimated implementation detayına bağımlı yapmak değildir.

UI componentleri doğrudan `useSharedValue` / `useAnimatedStyle` kullanımını mümkün olduğunca kendi içinde kapsamalıdır.

---

# 17. Error handling

Starter kit ortak hata modeline sahip olmalıdır.

Örnek:

```ts
export type AppError = {
  code: string;
  message: string;
  cause?: unknown;
};
```

Auth, API ve validation hataları farklı kategorilerde ele alınmalıdır.

UI tarafında:

```text
Loading
Success
Error
Empty
```

state pattern'i standardize edilmelidir.

Global error boundary bulunmalıdır.

---

# 18. Logging için gelecekteki altyapı

Logging ilk release'te zorunlu olmak zorunda değildir fakat mimari olarak eklenmesi kolay olmalıdır.

Önerilen abstraction:

```text
src/services/logger/
├── logger.ts
├── console-logger.ts
└── index.ts
```

API:

```ts
logger.debug(...)
logger.info(...)
logger.warn(...)
logger.error(...)
```

İleride implementation:

```text
ConsoleLogger
SentryLogger
DatadogLogger
CustomLogger
```

olarak değiştirilebilir.

Feature'ların doğrudan `console.log` bağımlılığı azaltılmalıdır.

Production build'de debug log seviyeleri kontrol edilebilir hale getirilmelidir.

---

# 19. Analytics ve telemetry extension point'leri

İleride aşağıdaki servisler aynı abstraction modeline oturtulabilir:

```text
analytics.track()
analytics.identify()
analytics.reset()
```

Örnek:

```text
src/services/analytics/
├── analytics.ts
├── noop-analytics.ts
└── index.ts
```

Aynı yaklaşım:

- Crash reporting
- Performance monitoring
- Push notifications
- Feature flags
- Remote config

için kullanılabilir.

---

# 20. CLI architecture

Starter kit'in uzun vadeli başarısı CLI tasarımına bağlıdır.

Önerilen yapı:

```text
packages/
├── create-app/
│   ├── src/
│   │   ├── index.ts
│   │   ├── cli.ts
│   │   ├── prompts.ts
│   │   ├── project-generator.ts
│   │   ├── package-manager.ts
│   │   ├── template-engine.ts
│   │   ├── validation.ts
│   │   └── utils/
│   └── package.json
│
└── starter-template/
    ├── template/
    └── package.json
```

Monorepo tercih edilirse CLI ve template lifecycle bağımsız yönetilebilir.

İlk aşamada template aynı repository içinde bulunabilir.

---

# 21. CLI komutları

Minimum:

```bash
npx @bugcodestudio/create-app MyApp
```

Gelecekte:

```bash
npx @bugcodestudio/create-app MyApp --package-manager pnpm
npx @bugcodestudio/create-app MyApp --skip-install
npx @bugcodestudio/create-app MyApp --example auth
```

Daha sonra:

```bash
npx @bugcodestudio/create-app add feature profile
npx @bugcodestudio/create-app doctor
npx @bugcodestudio/create-app update
```

gibi command'lar düşünülebilir.

Ancak ilk versiyonda CLI çok büyütülmemelidir.

---

# 22. Template versioning

Starter kit'in en kritik konularından biri template versioning olacaktır.

Bir uygulama şu şekilde başlamalıdır:

```text
Starter Kit v1.0.0
```

Sonradan starter kit güncellendiğinde mevcut projelerin otomatik olarak değiştirilmesi beklenmemelidir.

Bunun yerine:

```text
New project → latest template
Existing project → stays independent
```

kuralı uygulanmalıdır.

CLI çıktısında kullanılan template version gösterilebilir:

```text
✔ Created project
✔ Template version: 1.2.0
```

Gelecekte ayrıca migration system oluşturulabilir.

---

# 23. Code quality

Starter kit'in kendi kalitesi yüksek olmalıdır.

Minimum tooling:

- ESLint
- Prettier
- TypeScript strict mode
- Husky
- lint-staged
- Jest
- React Native Testing Library

CI:

```text
install
→ typecheck
→ lint
→ test
→ template generation test
```

olmalıdır.

---

# 24. Template generation test'i

CLI için özel olarak aşağıdaki test çok önemlidir:

```text
run create-app
   ↓
create temporary project
   ↓
install dependencies
   ↓
typecheck
   ↓
run tests
```

Her release öncesi gerçekten sıfırdan oluşturulan bir projenin boot edip etmediği doğrulanmalıdır.

Bu test starter kit'in en önemli regression testlerinden biridir.

---

# 25. Dokümantasyon

Starter kit repository'sinde en az:

```text
README.md
ROADMAP.md
CONTRIBUTING.md
CHANGELOG.md
```

bulunmalıdır.

Generated app içerisinde ise daha sade bir README bulunabilir:

```text
Getting Started
Environment Variables
Authentication
Navigation
Project Structure
Adding a Feature
```

Özellikle `Adding a Feature` dokümanı önemli olacaktır.

Örnek:

```text
1. src/features/example oluştur
2. screen ekle
3. service ekle
4. query hook ekle
5. navigation route ekle
6. test yaz
```

---

# 26. Önerilen generated project yapısı

```text
MyApp/
├── src/
│   ├── app/
│   │   ├── app.tsx
│   │   ├── bootstrap.ts
│   │   └── navigation/
│   │       ├── linking.ts
│   │       ├── navigation-ref.ts
│   │       ├── root-navigator.tsx
│   │       ├── route-types.ts
│   │       ├── auth-navigator.tsx
│   │       ├── onboarding-navigator.tsx
│   │       └── main-navigator.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── motion/
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── app-config.ts
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── schemas/
│   │   │   ├── screens/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── onboarding/
│   │   │   └── ...
│   │   │
│   │   └── home/
│   │       └── ...
│   │
│   ├── hooks/
│   ├── lib/
│   │   ├── query-client.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── index.ts
│   │
│   ├── providers/
│   │   ├── app-provider.tsx
│   │   ├── auth-provider.tsx
│   │   └── query-provider.tsx
│   │
│   ├── services/
│   │   ├── logger/
│   │   ├── analytics/
│   │   └── storage/
│   │
│   ├── store/
│   │   ├── app-store.ts
│   │   └── index.ts
│   │
│   ├── theme/
│   ├── types/
│   └── utils/
│
├── assets/
├── app.config.ts
├── babel.config.js
├── metro.config.js
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

# 27. Auth provider tasarımı

Auth provider sadece session ve kullanıcı state'ini expose etmelidir.

Örneğin:

```ts
const {
  session,
  user,
  isLoading,
  isAuthenticated,
} = useAuth();
```

Navigation decision logic ayrı bir layer'da olmalıdır.

Kötü yaklaşım:

```text
AuthProvider
  └── navigation.navigate(...)
```

Daha iyi yaklaşım:

```text
AuthProvider
  └── exposes state

RootNavigator
  └── reacts to state
```

Bu separation test edilebilirliği ciddi şekilde artırır.

---

# 28. Bootstrap lifecycle

Uygulama açıldığında merkezi bootstrap süreci olmalıdır.

```text
App start
  ↓
Load environment
  ↓
Initialize Supabase
  ↓
Initialize Query Client
  ↓
Restore auth session
  ↓
Resolve onboarding state
  ↓
Render navigator
```

Bootstrap tamamlanmadan auth-aware navigation render edilmemelidir.

Bu sayede splash screen → auth → onboarding → main geçişlerinde flicker azaltılır.

---

# 29. Security prensipleri

Starter kit güvenli varsayımlarla gelmelidir.

- Secret key'ler repository'ye girmemeli.
- Supabase service-role key mobile client'a konmamalı.
- Form input'ları validate edilmeli.
- Auth state merkezi yönetilmeli.
- Deep link input'ları güvenilmez kabul edilmeli.
- Protected route guard uygulanmalı.
- Local persistent state mümkün olduğunca minimum tutulmalı.

Client'a açık olan public configuration ile secret backend credentials birbirinden net biçimde ayrılmalıdır.

---

# 30. İlk release kapsamı

İlk public release'i küçük ama sağlam tutmak daha doğru olacaktır.

## v0.1 — Internal foundation

- Expo TypeScript base
- React Navigation
- Gluestack UI
- Supabase
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Reanimated
- Feature-based structure
- Environment system
- Basic lint/typecheck

## v0.2 — Authentication

- Login
- Register
- AccountVerify
- Forgot Password
- Reset Password
- OTP resend
- OTP countdown
- Auth state management

## v0.3 — App shell

- Onboarding
- Main navigation
- Bottom tabs
- Empty Home
- Profile placeholder
- Splash/bootstrap handling

## v0.4 — Deep linking

- Custom scheme
- Typed route configuration
- Auth-aware deep links
- OTP deep link handling
- Protected routes

## v0.5 — DX hardening

- CLI package
- Template generation
- Package manager detection
- Template generation tests
- Better README
- `.env.example`
- Error messages

## v1.0 — Public stable

- Stable project structure
- Versioned template
- Automated release
- CI
- Changelog
- Documentation
- Smoke test for generated projects
- Known migration/documentation strategy

---

# 31. Post-v1 roadmap

## v1.1 — Observability

- Logger abstraction
- Error reporting adapter
- Analytics abstraction
- Performance monitoring hooks

## v1.2 — Product infrastructure

- Push notification abstraction
- Feature flags
- Remote config
- Secure storage helpers
- Network state handling

## v1.3 — CLI improvements

```bash
create-app add feature
create-app add auth-provider
create-app doctor
create-app update
```

## v1.4 — Templates

CLI üzerinden varyant seçimi:

```text
Blank
Auth
SaaS
Marketplace
Content
```

Ama bu aşamaya kadar tek ve güçlü bir default template oluşturulmalıdır.

---

# 32. Feature generation geleceği

En değerli uzun vadeli özelliklerden biri feature generator olabilir.

Örneğin:

```bash
npx @bugcodestudio/create-app add feature profile
```

çıktısı:

```text
src/features/profile/
├── api/
├── components/
├── hooks/
├── screens/
├── schemas/
├── services/
├── types/
└── index.ts
```

Ardından navigation route'u otomatik eklenebilir.

Bu özellik template'in asıl geliştirici deneyimini ciddi şekilde güçlendirebilir ancak ilk release'te yapılması zorunlu değildir.

---

# 33. Standardizasyon kuralları

Starter kit'in değeri sadece dependency'lerden gelmemelidir. Asıl değer coding conventions oluşturmaktır.

Belirlenmesi gereken kurallar:

- Dosya naming convention
- Component naming convention
- Hook naming convention
- Feature exports
- API function naming
- Query key convention
- Error code convention
- Navigation route naming
- Environment naming
- Async function error handling
- Loading / empty / error UI pattern
- Form validation pattern
- Store naming

Bunların tümü README ve contribution guide içinde belgelenmelidir.

---

# 34. Başlangıçta özellikle yapılmaması gerekenler

İlk sürüm aşağıdakilerle gereksiz şekilde şişirilmemelidir:

- Çok fazla hazır feature
- Karmaşık design system
- Ağır abstraction katmanları
- Otomatik CRUD generator
- Çok sayıda üçüncü parti servis
- Zorunlu analytics provider
- Zorunlu crash reporting
- Her proje için aynı business logic

Starter kit'in amacı her şeyi yapmak değil, her projede tekrar edilen foundation'ı sağlamaktır.

---

# 35. Başarı kriterleri

Starter kit başarılı sayılabilmek için yeni bir projede şu süreyi ciddi biçimde azaltmalıdır:

```text
create project
→ install dependencies
→ configure navigation
→ configure Supabase
→ create auth screens
→ create auth state
→ create onboarding
→ create tabs
→ configure deep linking
→ configure forms
→ configure query client
→ configure state
```

Geliştirici proje oluşturduktan sonra doğrudan ilk gerçek feature'ına başlayabilmelidir.

İdeal hedef:

```text
create-app
   ↓
configure .env
   ↓
start coding product features
```

---

# 36. Önerilen geliştirme sırası

Uygulama geliştirilirken aşağıdaki sırayı takip etmek teknik riski azaltır:

```text
1. Repository / monorepo structure
2. Starter Expo template
3. Dependency setup
4. Folder architecture
5. Theme + Gluestack foundation
6. Supabase client
7. Query client
8. Zustand foundation
9. Root bootstrap
10. React Navigation
11. Auth provider
12. Login / Register
13. OTP verification
14. Forgot password
15. Reset password
16. Onboarding
17. Main tabs
18. Deep linking
19. Environment validation
20. Error boundary
21. Logging abstraction
22. Tests
23. CLI generator
24. Generated-project smoke tests
25. Documentation
26. v1.0 release
```

---

# 37. Final architecture vision

Bu projenin uzun vadeli hedefi yalnızca:

```text
create-app
```

komutu değildir.

Asıl hedef:

```text
@bugcodestudio/create-app
        │
        ├── starter template
        ├── project generator
        ├── feature generator
        ├── shared conventions
        ├── optional integrations
        └── migration/update tooling
```

şeklinde küçük bir React Native platformuna dönüşmesidir.

Bunun sonucunda yeni bir mobil uygulama başlatmak:

```bash
npx @bugcodestudio/create-app MyApp
```

ile foundation problemini çözmek ve sonrasında yalnızca ürün problemlerine odaklanmak anlamına gelmelidir.

---

# 38. Definition of Done — v1.0

Bir release `v1.0` olarak işaretlenmeden önce:

- [ ] CLI sıfırdan Expo projesi oluşturabiliyor.
- [ ] Generated project TypeScript strict mode ile derleniyor.
- [ ] Generated project lint'ten geçiyor.
- [ ] Generated project testlerden geçiyor.
- [ ] React Navigation çalışıyor.
- [ ] Bottom tabs çalışıyor.
- [ ] Supabase session restore çalışıyor.
- [ ] Login çalışıyor.
- [ ] Register çalışıyor.
- [ ] OTP verification çalışıyor.
- [ ] OTP resend çalışıyor.
- [ ] Forgot password çalışıyor.
- [ ] Reset password çalışıyor.
- [ ] Onboarding completion state çalışıyor.
- [ ] Auth-aware navigation çalışıyor.
- [ ] Deep linking çalışıyor.
- [ ] Environment validation çalışıyor.
- [ ] Empty Home ekranı hazır.
- [ ] README hazır.
- [ ] CHANGELOG hazır.
- [ ] Template version görünür.
- [ ] CI generated project smoke test'i çalıştırıyor.
- [ ] No secrets are committed.

---

# 39. En önemli tasarım kararı

Bu starter kit'te dependency'ler kadar önemli olan şey sınırların net olmasıdır:

```text
UI
 ↓
Feature
 ↓
Service / API
 ↓
Supabase / external infrastructure
```

ve:

```text
Server state → TanStack Query
Client state → Zustand
Form state → React Hook Form
Validation → Zod
Navigation state → React Navigation
Authentication state → Auth Provider / service
UI → Gluestack UI
Animations → Reanimated
```

Bu ayrım korunursa starter kit büyüdükçe karmaşıklaşmak yerine daha kullanışlı hale gelir.
