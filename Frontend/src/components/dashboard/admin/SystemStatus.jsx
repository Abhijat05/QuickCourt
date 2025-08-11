import { Card } from '../../ui/Card';
import { Server, CheckCircle } from 'lucide-react';

export function SystemStatus() {
  const services = [
    { name: 'Authentication Service', status: 'Operational' },
    { name: 'Booking Engine', status: 'Operational' },
    { name: 'Payment Processing', status: 'Operational' },
    { name: 'Email Service', status: 'Operational' }
  ];
  
  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          System Status
        </Card.Title>
        <Card.Description>Current status of all services</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-3">
          {services.map(service => (
            <div key={service.name} className="flex items-center justify-between pb-2 border-b border-border/50 last:border-0 last:pb-0">
              <span className="text-sm">{service.name}</span>
              <span className="flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle className="h-3 w-3" />
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}