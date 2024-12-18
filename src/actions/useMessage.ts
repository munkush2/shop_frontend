import * as yup from 'yup';

export function useMessage() {
    const schema = yup.object().shape({
        id: yup
        .number(),
        userName: yup
        .string()
        .trim()
        .required("Name is required"),
        text: yup
        .string()
        .trim()
        .required("Comment is required"),
    });
    return {schema, }
}