import { Alert, AlertTitle, AlertDescription } from '../ui/Alert';
import { Shield } from 'lucide-react';

export function TwoFactorAlert() {
  return (
    <Alert variant="success" className="mb-6 animate-fade-in-up">
      <Shield className="h-4 w-4" />
      <AlertTitle>Account Secured</AlertTitle>
      <AlertDescription>
        Two-factor authentication is enabled on your account, providing an extra layer of security.
      </AlertDescription>
    </Alert>
  );
}