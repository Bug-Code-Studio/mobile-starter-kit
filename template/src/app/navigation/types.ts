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
        purpose: 'signup' | 'password-reset';
    },
    ResetPassword: undefined
};

export type MainTabParamList = {
    Home: undefined;
};