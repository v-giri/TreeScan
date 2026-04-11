import { SignupForm } from '@/components/auth/SignupForm'
import { motion } from 'framer-motion'

export function Signup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <SignupForm />
    </motion.div>
  )
}
