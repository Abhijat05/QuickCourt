import { Card } from '../../ui/Card';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';

export function RecentUsers({ recentUsers = [] }) {
  return (
    <Card>
      <Card.Header className="flex flex-row items-center justify-between">
        <div>
          <Card.Title className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Recent Users
          </Card.Title>
          <Card.Description>Latest user registrations</Card.Description>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to="/admin/users">View All</Link>
        </Button>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {recentUsers.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No recent users to display
            </div>
          ) : (
            recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                    {user.role || 'user'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card.Content>
    </Card>
  );
}