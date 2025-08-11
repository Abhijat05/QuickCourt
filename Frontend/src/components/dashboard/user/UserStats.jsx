import { Card } from '../../ui/Card';
import { Check, Calendar, DollarSign, Clock, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export function UserStats({ data }) {
  if (!data) return null;
  
  const statItems = [
    { 
      title: 'Active Bookings', 
      value: data.activeBookings || 0,
      icon: Check,
      color: 'text-success',
      bgColor: 'bg-success/10' 
    },
    { 
      title: 'Total Bookings', 
      value: data.totalBookings || 0,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10' 
    },
    { 
      title: 'Total Spent', 
      value: `$${data.totalSpend || 0}`,
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10' 
    },
    { 
      title: 'Past Bookings', 
      value: data.pastBookings || 0,
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted' 
    }
  ];
  
  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Your Stats
        </Card.Title>
        <Card.Description>Overview of your bookings and activity</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item, index) => (
            <motion.div 
              key={item.title}
              className="p-4 rounded-lg border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}