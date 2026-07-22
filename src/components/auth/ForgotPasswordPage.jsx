import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft, Zap, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword, parseAuthError } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      addToast('Reset email sent', 'success');
    } catch (err) {
      addToast(parseAuthError(err.code), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
        <div className="fixed inset-0 -z-10 animated-gradient-bg opacity-[0.03]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 md:p-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-success" />
            </motion.div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Check your email</h2>
            <p className="text-sm text-text-secondary mb-1">
              We&apos;ve sent a password reset link to
            </p>
            <p className="text-sm font-medium text-text-primary mb-6">{email}</p>
            <p className="text-xs text-text-muted mb-6">
              Didn&apos;t get the email? Check your spam folder or{' '}
              <button onClick={() => setSent(false)} className="text-primary font-medium hover:underline">
                try again
              </button>
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="fixed inset-0 -z-10 animated-gradient-bg opacity-[0.03]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="w-14 h-14 rounded-2xl animated-gradient-bg flex items-center justify-center mb-4 shadow-lg"
              whileHover={{ rotate: 10, scale: 1.05 }}
            >
              <Zap className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-text-primary">Reset password</h1>
            <p className="text-sm text-text-secondary mt-1">Enter your email to get a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            <Link to="/login" className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary-dark transition">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
