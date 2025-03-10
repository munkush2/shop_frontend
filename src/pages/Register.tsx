import { useForm } from 'react-hook-form';
import { Iregistration } from '../Interfaces/Iregistration';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRegister } from '../actions/useRegister';
import { useAlert } from '../actions/useAlert';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router';
import CONFIG from '../config/config';

export default function Register() { 
    const navigate = useNavigate();
    const { login } = useAuth();
    const {
        schema
    } = useRegister()
    const {
        showSwal
    } = useAlert()
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState :{errors},
    } = useForm<Iregistration>({
        mode: 'onChange', 
        resolver :yupResolver(schema)
    });
    
    const submitForm = () => {
        const data = {
            email: getValues().email,
            password: getValues().password,
            password_confirmation: getValues().passwordConfirmation,
        }
        mutation.mutate(data);
    };

    const mutation = useMutation({
        mutationFn: async (newUser: { email: string; password: string; password_confirmation: string }) => {
            console.log('Sending data to API:', newUser);
            const response = await axios.post(`${CONFIG.API_BASE_URL}/register/registration`, newUser);
            return response;
        },
        onSuccess: (data) => {
            console.log('Registration successful:', data);
            showSwal('Registration successful!', 'success');
            login(data.data.data.access_token, data.data.data.user_status); 
            reset();
            navigate("/shop")
        },
        onError: (error) => {
            console.error('Registration failed:', error);
            showSwal('Registration failed. Please try again.', 'error');
        },
    });

    return (
        <>
            <div className='register-container'>
                <form className="login-form" onSubmit={handleSubmit(submitForm)} method='POST'>
                    <h1>Register</h1>
                    <div className="form-input-material">
                        <label htmlFor="email">Email</label>
                        <input {...register('email')} onChange={(e) => setValue('email', e.target.value)}
                            type="email" name="email" id="email" placeholder=" " autoComplete="off" className="form-control-material" 
                        />        
                        <label className='error-reg'>{errors.email?.message}</label>       
                    </div>
                    <div className="form-input-material">
                        <label htmlFor="password">Password</label>
                        <input {...register('password')} 
                            type="password" name="password" id="password" placeholder=" " autoComplete="off" className="form-control-material" 
                        />
                        <label className='error-reg'>{errors.password?.message}</label>
                    </div>
                    <div className="form-input-material">
                        <label htmlFor="password_confirmation">Password confirmation</label>
                        <input {...register('passwordConfirmation')}
                            type="password" name="passwordConfirmation" id="passwordConfirmation" placeholder=" " autoComplete="off" className="form-control-material" 
                            />
                        <label className='error-reg'>{errors.passwordConfirmation?.message}</label>
                    </div>
                    <button type="submit" className="btn btn-primary btn-ghost">Register</button>
                    {mutation.isError && <p style={{ color: 'red' }}>Registration failed. Please try again.</p>}
                </form>
            </div>
        </>
    )
}
