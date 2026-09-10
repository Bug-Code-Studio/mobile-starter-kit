export type RootStackParamList = {
    Onboarding: undefined;
    Auth: undefined;
    Main: undefined; 
};


export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    OtpScreen: {
        email: string;
        purpose: 'email' | 'password-reset';
    },
    ResetPassword: undefined;
    AuthResult: {
        result: 'email-verified' | 'password-reset';
    };
};

export type MainTabParamList = {
    Home: undefined;
};