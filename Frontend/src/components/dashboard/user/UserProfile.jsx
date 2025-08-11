import { Card } from '../../ui/Card';
import { Shield, Check } from 'lucide-react';
import Button from '../../ui/Button';

export function UserProfile({ twoFactorEnabled, onToggle2FA }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security Settings
        </Card.Title>
        <Card.Description>Manage your account security</Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">
              Adds an extra layer of security to your account
            </p>
          </div>
          <Button 
            variant={twoFactorEnabled ? "outline" : "default"}
            size="sm"
            className="flex items-center gap-1"
            onClick={onToggle2FA}
          >
            {twoFactorEnabled ? (
              <>
                <Check className="h-4 w-4" />
                <span>Enabled</span>
              </>
            ) : (
              <span>Enable</span>
            )}
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}