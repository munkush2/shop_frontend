import * as yup from 'yup';

export function useLogin() {
    const schema = yup.object().shape({
        email: yup
        .string()
        .trim()
        .email("Invalid email format")
        .required("Email is required"),
        password: yup
        .string()
        .trim()
        .required("Password is required")
        .min(6, "The password is too small"),
    });
    return {schema, }
}