import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check, AtSign, UserCheck, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface SignupFormProps {
  onSwitchToLogin: () => void
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        nickname: formData.nickname,
        username: formData.username
      })
      
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strength = passwordStrength(formData.password)
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400']
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Account Created!</h2>
          <p className="text-gray-600 mb-4">
            Welcome! Your account has been successfully created. You can now sign in with your credentials.
          </p>
        </div>
        <button
          onClick={onSwitchToLogin}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Continue to Sign In
          <ArrowRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-600">Join us and start your journey today</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/50 backdrop-blur-sm border border-red-200/50 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        {/* Nickname and Username Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium text-gray-700">
              Nickname
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserCheck className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nickname"
                type="text"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                placeholder="Johnny"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <AtSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                placeholder="johndoe"
                required
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                Password strength: {strength > 0 ? strengthLabels[strength - 1] : 'Too weak'}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start gap-3">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-5 h-5 rounded border-white/30 bg-white/20 backdrop-blur-sm text-emerald-500 focus:ring-emerald-400/20 focus:ring-2"
              required
            />
            {agreeToTerms && (
              <Check className="absolute w-3 h-3 text-emerald-600 pointer-events-none" />
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            I agree to the{' '}
            <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !agreeToTerms}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Create Account
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-4 border-t border-white/20">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignupForm
