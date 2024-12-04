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

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data);
      toast.success('Successfully logged in!');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to login');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="Username"
            {...register('username', { 
              required: 'Username is required' 
            })}
            error={errors.username?.message}
          />

          <Input
            type="password"
            label="Password"
            {...register('password', { 
              required: 'Password is required'
            })}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting || loginMutation.isPending}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};