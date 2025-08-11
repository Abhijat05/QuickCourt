import { Card } from '../../ui/Card';
import { Trophy } from 'lucide-react';

export function FavoriteSports({ sports = [] }) {
  const sportIcons = {
    "Tennis": "🎾",
    "Badminton": "🏸",
    "Cricket": "🏏",
    "Football": "⚽",
    "Basketball": "🏀",
    "Swimming": "🏊‍♂️",
    "Volleyball": "🏐"
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Your Favorite Sports
        </Card.Title>
        <Card.Description>Based on your booking history</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-3 gap-2">
          {sports.map((sport, index) => (
            <div 
              key={index}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-accent/5"
            >
              <span className="text-2xl mb-1">{sportIcons[sport] || '🏆'}</span>
              <span className="text-xs font-medium">{sport}</span>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}