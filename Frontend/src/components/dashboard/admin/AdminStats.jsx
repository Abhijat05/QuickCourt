import { Card } from '../../ui/Card';
import { Users, Building, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminStats({ adminData }) {
  const statItems = [
    { 
      title: 'Total Users', 
      value: adminData.totalUsers || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10' 
    },
    { 
      title: 'Pending Venues', 
      value: adminData.pendingVenues || 0,
      icon: Building,
      color: 'text-warning',
      bgColor: 'bg-warning/10' 
    },
    { 
      title: 'Active Today', 
      value: '23',
      icon: Activity,
      color: 'text-success',
      bgColor: 'bg-success/10' 
    }
  ];
  
  return (
    <Card>
      <Card.Header>
        <Card.Title>Dashboard Overview</Card.Title>
        <Card.Description>Key metrics and system status</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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