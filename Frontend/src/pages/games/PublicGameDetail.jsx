import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gameService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Calendar, MapPin, Users, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function PublicGameDetail() {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await gameService.getGameDetails(gameId);
      setGameData(res.data);
    } catch (e) {
      toast.error('Failed to load game');
      navigate('/games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [gameId]);

  const join = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await gameService.joinPublicGame(gameId);
      toast.success('Joined');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Join failed');
    }
  };

  const leave = async () => {
    try {
      await gameService.leavePublicGame(gameId);
      toast.success('Left');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Leave failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] pt-16">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!gameData) return null;

  const g = gameData.game || gameData;
  const booking = gameData.booking;
  const venue = gameData.venue;
  const court = gameData.court;
  const participants = gameData.participants || [];
  const isHost = g.hostId === user?.id;
  const alreadyIn = participants.some(p => p.id === user?.id) || isHost;
  const full = g.status === 'full';

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-3xl">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/games">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Link>
      </Button>

      <Card className="mb-8">
        <Card.Content className="p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{g.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{court?.sportType || 'Sport'}</Badge>
                <Badge variant={full ? 'destructive' : 'secondary'}>{g.status}</Badge>
                <Badge variant="secondary">{g.skillLevel || 'intermediate'}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {!isHost && !alreadyIn && !full && (
                <Button onClick={join}>Join Game</Button>
              )}
              {!isHost && alreadyIn && (
                <Button variant="destructive" onClick={leave}>Leave</Button>
              )}
              {isHost && (
                <Button variant="outline" disabled>Host</Button>
              )}
            </div>
          </div>

            <p className="text-muted-foreground">
              {g.description || 'Community match'}
            </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <Calendar className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {booking?.date ? format(new Date(booking.date), 'MMM d, yyyy') : '—'}
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <Clock className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">
                {booking ? `${booking.startTime} - ${booking.endTime}` : '—'}
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <Users className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Players</p>
              <p className="font-medium">
                {g.currentPlayers}/{g.maxPlayers}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Venue</h2>
            </div>
            <p className="text-sm">{venue?.name}</p>
            <p className="text-xs text-muted-foreground">{venue?.address}</p>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" /> Participants ({participants.length})
          </h2>
          {participants.length === 0 ? (
            <p className="text-sm text-muted-foreground">No participants yet.</p>
          ) : (
            <div className="space-y-3">
              {participants.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-md border bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                      {p.fullName?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {p.joinedAt ? format(new Date(p.joinedAt), 'MMM d, HH:mm') : ''}
                      </p>
                    </div>
                  </div>
                  {p.id === g.hostId && (
                    <Badge variant="outline">Host</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}