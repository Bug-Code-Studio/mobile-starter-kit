import type { Locale } from "@/i18n/locales/types";

export const tr = {
  common: {
    continue: "Devam Et",
    cancel: "İptal",
    save: "Kaydet",
    delete: "Sil",
    retry: "Tekrar Dene",
    loading: "Yükleniyor...",
  },
  errors: {
    unknown: "Bir şeyler yanlış gitti. Lütfen tekrar deneyin.",
    network: "İnternet bağlantınızı kontrol edip tekrar deneyin.",
    timeout: "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.",
    validation: "Lütfen girilen bilgileri kontrol edin.",
    database: "Bir veritabanı hatası oluştu. Lütfen tekrar deneyin.",
    api: "Sunucuyla iletişim sırasında bir hata oluştu.",
    unauthorized: "Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.",
    forbidden: "Bu işlemi gerçekleştirme yetkiniz yok.",
    notFound: "İstenen kaynak bulunamadı.",
    rateLimited:
      "Çok fazla istek gönderildi. Lütfen biraz bekleyip tekrar deneyin.",
    auth: {
      invalidCredentials: "E-posta veya şifre hatalı.",
      emailNotConfirmed:
        "Lütfen giriş yapmadan önce e-posta adresinizi doğrulayın.",
      userAlreadyExists: "Bu e-posta adresiyle zaten bir hesap bulunuyor.",
      invalidOtp: "Doğrulama kodu geçersiz.",
      otpExpired:
        "Doğrulama kodunun süresi doldu. Lütfen yeni bir kod isteyin.",
    },
    errorState: {
      title: "Bir şeyler yanlış gitti",
      message: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
      retry: "Tekrar Dene",
    },
  },
  auth: {
    common: {
      email: "E-posta",
      password: "Şifre",
      newPassword: "Yeni Şifre",
      confirmPassword: "Şifreyi Onayla",
      name: "İsim",
      surname: "Soyisim",
      error: {
        min_name_length: "İsim en az {{min}} karakter olmalıdır.",
        min_surname_length: "Soyisim en az {{min}} karakter olmalıdır.",
        enter_valid_email: "Lütfen geçerli bir e-posta adresi girin.",
        min_password_length: "Şifre en az {{min}} karakter olmalıdır.",
        max_password_length: "Şifre en fazla {{max}} karakter olmalıdır.",
        passwords_do_not_match: "Şifreler eşleşmiyor.",
        enter_valid_otp: "Lütfen geçerli bir doğrulama kodu girin.",
        password_must_contain_uppercase_letter: "Şifre en az bir büyük harf içermelidir.",
        password_must_contain_lowercase_letter: "Şifre en az bir küçük harf içermelidir.",
        password_must_contain_number: "Şifre en az bir rakam içermelidir.",
        password_must_contain_special_character: "Şifre en az bir özel karakter içermelidir."
      }
    },
    login: {
      title: "Tekrar Hoş geldin",
      subtitle: "Lütfen bilgilerinizi girerek giriş yapın.",
      forgotPassword: "Şifremi Unuttum",
      noAccount: "Hesabınız yok mu?",
      signUp: "Kayıt Ol",
      signingIn: "Giriş yapılıyor...",
      signIn: "Giriş Yap",
    },
    register: {
      title: "Hesap Oluştur",
      subtitle: "Lütfen bilgilerinizi girerek kayıt olun.",
      creating: "Hesap oluşturuluyor...",
      createAccount: "Hesap Oluştur",
      signIn: "Giriş Yap",
      alreadyHaveAccount: "Zaten bir hesabınız var mı?"
    },
    forgotPassword: {
      title: "Şifremi Unuttum",
      subtitle: "Lütfen e-posta adresinizi girin ve şifre sıfırlama bağlantısını alın.",
      sendResetOtp: "Sıfırlama Kodu Gönder",
      rememberPassword: "Şifrenizi hatırlıyor musunuz?",
      sending: "Gönderiliyor...",
      signIn: "Giriş Yap"
    },
    resetPassword: {
      title: "Şifreyi Güncelle",
      subtitle: "Lütfen yeni şifrenizi girin.",
      updating: "Güncelleniyor...",
      updatePassword: "Şifreyi Güncelle",
      signIn: "Giriş Yap"
    },
    result: {
      emailVerifiedTitle: "Hesabınız aktif edildi",
      emailVerifiedMessage: "E-posta adresiniz doğrulandı. Artık hesabınıza giriş yapabilirsiniz.",
      passwordResetTitle: "Şifreniz güncellendi",
      passwordResetMessage: "Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.",
      signIn: "Giriş Yap"
    },
    verifyAccount: {
      accountVerifyTitle: "Hesabı Doğrula",
      accountVerifySubtitle: "Lütfen {{email}} e-posta adresinize gönderilen doğrulama kodunu girin.",
      passwordResetTitle: "Şifrenizi Sıfırlayın",
      passwordResetSubtitle: "Lütfen {{email}} e-posta adresinize gönderilen 6 haneli kodu girin.",
      didNotReceiveCode: "Kodu almadınız mı?",
      resend: "Yeniden Gönder",
      newCodeSent: "Yeni kod gönderildi.",
      verifying: "Doğrulanıyor...",
      verify: "Doğrula"
    }
  },
} satisfies Locale;
