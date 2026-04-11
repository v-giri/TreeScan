import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

export function SignupForm() {
  const [authError, setAuthError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setAuthError(null)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: window.location.origin + '/home',
      },
    })
    if (error) {
      setAuthError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
        <div className="w-full md:max-w-sm bg-white rounded-[20px] shadow-card p-6 text-center space-y-3">
          <span className="text-4xl">✅</span>
          <h2 className="font-serif text-xl text-plant-dark">Check your email</h2>
          <p className="text-xs text-plant-mid">We sent a verification link. Click it to activate your account.</p>
          <Link to="/login" className="block text-xs text-sage-dark underline font-medium mt-4">Back to sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-10">
      <div className="w-10 h-10 bg-sage-deep rounded-[12px] flex items-center justify-center mb-6">
        <span className="text-xl">🌿</span>
      </div>

      <h1 className="font-serif text-center text-2xl text-plant-dark mb-1">Create account</h1>
      <p className="text-xs text-center text-plant-light mb-8">Join TreeScan to analyse your plants</p>

      <div className="w-full md:max-w-sm space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Your name"
            error={errors.full_name?.message}
            {...register('full_name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            error={errors.confirm_password?.message}
            {...register('confirm_password')}
          />

          {authError && (
            <p className="text-xs text-[#D95555] text-center font-medium bg-[#FCE8E8] rounded-[10px] p-2.5">{authError}</p>
          )}

          <Button type="submit" isLoading={isSubmitting} fullWidth>
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-plant-light">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-dark underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
