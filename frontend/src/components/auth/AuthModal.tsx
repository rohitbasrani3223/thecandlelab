import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../design-system';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { VerifyEmailForm } from './VerifyEmailForm';
import { OtpVerificationForm } from './OtpVerificationForm';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authViewMode } = useAuth();

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      size="md"
    >
      <div className="py-2 px-1 sm:px-4">
        {authViewMode === 'login' && <LoginForm />}
        {authViewMode === 'register' && <RegisterForm />}
        {authViewMode === 'forgot-password' && <ForgotPasswordForm />}
        {authViewMode === 'reset-password' && <ResetPasswordForm />}
        {authViewMode === 'verify-email' && <VerifyEmailForm />}
        {authViewMode === 'verify-otp' && <OtpVerificationForm />}
      </div>
    </Modal>
  );
};
