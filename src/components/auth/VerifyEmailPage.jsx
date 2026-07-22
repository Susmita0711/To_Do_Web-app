import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MailCheck, RefreshCw, LogOut, Zap } from 'lucide-react';

export default function VerifyEmailPage() {
  const [sending, setSending] = useState(false);
  const { user, resendVerification, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      addToast('Verification email sent', 'success');
    } catch {
      addToast('Failed to send email', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="fixed inset-0 -z-10 animated-gradient-bg opacity-[0.03]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10 text-center">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="w-14 h-14 rounded-2xl animated-gradient-bg flex items-center justify-center mb-4 shadow-lg"
              whileHover={{ rotate: 10, scale: 1.05 }}
            >
              <Zap className="w-7 h-7 text-white" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mb-2"
            >
              <MailCheck className="w-8 h-8 text-warning" />
            </motion.div>
            <h1 className="text-2xl font-bold text-text-primary">Verify your email</h1>
            <p className="text-sm text-text-secondary mt-1">
              We&apos;ve sent a verification link to
            </p>
            <p className="text-sm font-medium text-text-primary">{user?.email}</p>
          </div>

          <p className="text-xs text-text-muted mb-6">
            Click the link in your email to verify your account. You may need to check your spam folder.
          </p>

          <div className="space-y-3">
            <motion.button
              onClick={handleResend}
              disabled={sending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </motion.button>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-ghost w-full justify-center py-3"
            >
              <LogOut className="w-4 h-4" />
              Use a different account
            </motion.button>
          </div>

          <p className="text-xs text-text-muted mt-6">
            Already verified?{' '}
            <Link to="/" className="font-medium text-primary hover:underline">
              Go to Dashboard
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
