import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setAuthError(error.message)
    } else {
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-10">
      {/* Logo */}
      <div className="w-10 h-10 bg-sage-deep rounded-[12px] flex items-center justify-center mb-6">
        <span className="text-xl">🌿</span>
      </div>

      <h1 className="font-serif text-center text-2xl text-plant-dark mb-1">Welcome back</h1>
      <p className="text-xs text-center text-plant-light mb-8">Sign in to your TreeScan account</p>

      <div className="w-full md:max-w-sm space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-sage-dark underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {authError && (
            <p className="text-xs text-[#D95555] text-center font-medium bg-[#FCE8E8] rounded-[10px] p-2.5">{authError}</p>
          )}

          <Button type="submit" isLoading={isSubmitting} fullWidth>
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-plant-light">
          Don't have an account?{' '}
          <Link to="/signup" className="text-sage-dark underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
