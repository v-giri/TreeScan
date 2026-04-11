import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setAuthError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: window.location.origin + '/reset-password',
    })
    if (error) setAuthError(error.message)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
        <div className="w-full md:max-w-sm bg-white rounded-[20px] shadow-card p-6 text-center space-y-3">
          <span className="text-4xl">📧</span>
          <h2 className="font-serif text-xl text-plant-dark">Check your inbox</h2>
          <p className="text-xs text-plant-mid">We sent you a password reset link.</p>
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

      <h1 className="font-serif text-center text-2xl text-plant-dark mb-1">Reset password</h1>
      <p className="text-xs text-center text-plant-light mb-8">Enter your email to receive a reset link</p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full md:max-w-sm space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {authError && (
          <p className="text-xs text-[#D95555] font-medium bg-[#FCE8E8] rounded-[10px] p-2.5 text-center">{authError}</p>
        )}

        <Button type="submit" isLoading={isSubmitting} fullWidth>
          Send Reset Link
        </Button>

        <p className="text-center text-xs text-plant-light">
          <Link to="/login" className="text-sage-dark underline font-medium">Back to sign in</Link>
        </p>
      </form>
    </div>
  )
}
