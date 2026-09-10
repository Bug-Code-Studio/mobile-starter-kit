export type Locale = {
  common: {
    continue: string;
    cancel: string;
    save: string;
    delete: string;
    retry: string;
    loading: string;
  };
  errors: {
    unknown: string;
    network: string;
    validation: string;
    database: string;
    api: string;
    auth: {
      invalidCredentials: string;
      emailNotConfirmed: string;
      userAlreadyExists: string;
      invalidOtp: string;
      otpExpired: string;
    };
  };
  auth: {
    common: {
      email: string;
      password: string;
      confirmPassword: string;
      newPassword: string;
      name: string;
      surname: string;
      error: {
        min_name_length: string;
        min_surname_length: string;
        enter_valid_email: string;
        min_password_length: string;
        max_password_length: string;
        passwords_do_not_match: string;
        enter_valid_otp: string;
        password_must_contain_uppercase_letter: string;
        password_must_contain_lowercase_letter: string;
        password_must_contain_number: string;
        password_must_contain_special_character: string;
      };
    };
    login: {
      title: string;
      subtitle: string;
      forgotPassword: string;
      noAccount: string;
      signUp: string;
      signingIn: string;
      signIn: string;
    };
    register: {
      title: string;
      subtitle: string;
      creating: string;
      createAccount: string;
      signIn: string;
      alreadyHaveAccount: string;
    };
    forgotPassword: {
      title: string;
      subtitle: string;
      sendResetOtp: string;
      rememberPassword: string;
      sending: string;
      signIn: string;
    };
    resetPassword: {
      title: string;
      subtitle: string;
      updating: string;
      updatePassword: string;
      signIn: string;
    };
    verifyAccount: {
      accountVerifyTitle: string;
      accountVerifySubtitle: string;
      didNotReceiveCode: string;
      resend: string;
      newCodeSent: string;
      verifying: string;
      passwordResetTitle: string;
      passwordResetSubtitle: string;
      verify: string;
    };
  };
};