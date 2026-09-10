import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, { message: "min_password_length" })
  .refine((val) => /[A-Z]/.test(val), {
    message: "password_must_contain_uppercase_letter",
  })
  .refine((val) => val.toLowerCase() !== val || /[a-z]/.test(val), {
    message: "password_must_contain_lowercase_letter",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "password_must_contain_number",
  })
  .refine((val) => /[^A-Za-z0-9]/.test(val), {
    message: "password_must_contain_special_character",
  });

export const loginSchema = z.object({
  email: z.email("enter_valid_email"),
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "min_name_length"),
    surname: z.string().min(2, "min_surname_length"),
    email: z.email("enter_valid_email"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords_do_not_match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("enter_valid_email"),
});

export const otpSchema = z.object({
  token: z.string().regex(/^\d{6}$/, "enter_valid_otp"),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords_do_not_match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type OtpFormValues = z.infer<typeof otpSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
