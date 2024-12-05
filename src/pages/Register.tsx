import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password2: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data);
      toast.success('Successfully registered!');
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 
        Object.values(error.response?.data || {}).flat()[0] ||
        'Registration failed';
      toast.error(errorMessage);
    },
  });

  const password = watch('password');

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join KazTourism today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register('first_name', { 
                required: 'First name is required' 
              })}
              error={errors.first_name?.message}
            />

            <Input
              label="Last Name"
              {...register('last_name', { 
                required: 'Last name is required' 
              })}
              error={errors.last_name?.message}
            />
          </div>

          <Input
            label="Username"
            {...register('username', { 
              required: 'Username is required',
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers and underscore'
              }
            })}
            error={errors.username?.message}
          />

          <Input
            type="email"
            label="Email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />

          <Input
            type="password"
            label="Password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            error={errors.password?.message}
          />

          <Input
            type="password"
            label="Confirm Password"
            {...register('password2', { 
              required: 'Please confirm your password',
              validate: value => 
                value === password || 'The passwords do not match'
            })}
            error={errors.password2?.message}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting || registerMutation.isPending}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};