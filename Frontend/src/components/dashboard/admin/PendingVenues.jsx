import { Card } from '../../ui/Card';
import { Building, CheckCircle } from 'lucide-react';
import Button from '../../ui/Button';
import { Link } from 'react-router-dom';

export function PendingVenues({ pendingCount = 0 }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Pending Venue Approvals
        </Card.Title>
        <Card.Description>Venues waiting for your review</Card.Description>
      </Card.Header>
      <Card.Content>
        {pendingCount > 0 ? (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-lg">{pendingCount} venue{pendingCount !== 1 ? 's' : ''} pending approval</p>
              <p className="text-sm text-muted-foreground">Review these venues to make them available to users</p>
            </div>
            <Button className="flex items-center gap-1" asChild>
              <Link to="/admin/venues/pending">
                <CheckCircle className="h-4 w-4" />
                Review
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <p className="font-medium">No pending venue approvals</p>
            <p className="text-sm text-muted-foreground">All venue requests have been processed</p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}