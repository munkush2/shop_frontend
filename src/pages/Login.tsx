import { Ilogin } from '../Interfaces/Ilogin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLogin } from '../actions/useLogin';
import * as yup from 'yup';
import { useAlert } from '../actions/useAlert';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../components/AuthContext';
import { redirect } from "react-router";
import { useNavigate } from 'react-router';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const {
        schema
    } = useLogin()
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
        watch,
    } = useForm<Ilogin>({
        mode: 'onChange', 
        resolver :yupResolver(schema)
    });
    const submitForm = () => {
        const data = {
            email: getValues().email,
            password: getValues().password,
        }
        mutation.mutate(data);
    };
    const mutation = useMutation({
        mutationFn: async (user: { email: string; password: string}) => {
          console.log('Sending data to API:', user);
          const response = await axios.post('http://localhost:8000/api/login/authentification', user);
          return response.data;
        },
        onSuccess: (data) => {
          console.log('Logination successful:', data);
          showSwal('Logination successful!', 'success');
          login(data.data.access_token, data.user_status);
          //reset();
          navigate("/shop")
        },
        onError: (error) => {
          console.error('Logination failed:', error);
          showSwal('Logination failed. Please try again.', 'error');
        },
    });

    return (
        <>
            <div className='register-container'>
                <form className="login-form" onSubmit={handleSubmit(submitForm)} method='POST'>
                    <h1>Login</h1>
                    <div className="form-input-material">
                        <label htmlFor="email">Email</label>
                        <input {...register('email')} onChange={(e) => setValue('email', e.target.value)}
                            type="email" name="email" id="email" placeholder=" " autoComplete="off" className="form-control-material" required />          
                    </div>

                    <div className="form-input-material">
                        <label htmlFor="password">Password</label>
                        <input {...register('password')} onChange={(e) => setValue('password', e.target.value)}
                            type="password1" name="password" id="password" placeholder=" " autoComplete="off" className="form-control-material" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-ghost">Login</button>
                </form>
            </div>
        </>
    )
}
