import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gameService } from '../../services/api';
import { userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Calendar, Users, MapPin, Plus, Filter, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function PublicGames() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filters, setFilters] = useState({ sportType: '', skillLevel: '', date: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [newGame, setNewGame] = useState({
    bookingId: '',
    title: '',
    description: '',
    maxPlayers: 8,
    skillLevel: 'intermediate'
  });
  const [sort, setSort] = useState('soon');           // new
  const [showMine, setShowMine] = useState(false);    // new
  const [page, setPage] = useState(1);                // simple pagination
  const [closingId, setClosingId] = useState(null);
  const PAGE_SIZE = 9;

  const loadGames = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.sportType) params.sportType = filters.sportType;
      if (filters.skillLevel) params.skillLevel = filters.skillLevel;
      if (filters.date) params.date = filters.date;
      const res = await gameService.getPublicGames({ params });
      setGames(res.data || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGames(); }, []); // initial
  useEffect(() => { loadGames(); }, [filters]);

  const loadUserBookings = async () => {
    if (!user) return;
    try {
      const res = await userService.getUserBookings();
      // upcoming confirmed only
      const upcoming = (res.data || []).filter(b => {
        const d = new Date(b.date);
        return d >= new Date() && b.status === 'confirmed';
      });
      setBookings(upcoming);
    } catch (e) {
      console.warn('Bookings load failed', e);
    }
  };

  const openCreate = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserBookings();
    setShowCreate(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newGame.bookingId) {
      toast.error('Select a booking');
      return;
    }
    try {
      setCreating(true);
      await gameService.createPublicGame({
        bookingId: Number(newGame.bookingId),
        title: newGame.title || 'Friendly Match',
        description: newGame.description,
        maxPlayers: Number(newGame.maxPlayers),
        skillLevel: newGame.skillLevel
      });
      toast.success('Game created');
      setShowCreate(false);
      setNewGame({ bookingId: '', title: '', description: '', maxPlayers: 8, skillLevel: 'intermediate' });
      loadGames();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  const mutateGame = (id, updater) => {
    setGames(gs => gs.map(g => ((g.game || g).id === id ? updater(g) : g)));
  };

  const handleJoin = async (gameId) => {
    if (!user) { navigate('/login'); return; }
    mutateGame(gameId, g => {
      const game = g.game || g;
      return {
        ...g,
        participants: [...(g.participants || []), { id: user.id, fullName: user.name || 'You', joinedAt: new Date().toISOString() }],
        game: { ...game, currentPlayers: (game.currentPlayers || 0) + 1 }
      };
    });
    try {
      await gameService.joinPublicGame(gameId);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Join failed');
      loadGames();
    }
  };

  const handleLeave = async (gameId) => {
    mutateGame(gameId, g => {
      const game = g.game || g;
      return {
        ...g,
        participants: (g.participants || []).filter(p => p.id !== user.id),
        game: { ...game, currentPlayers: Math.max((game.currentPlayers || 1) - 1, 0) }
      };
    });
    try {
      await gameService.leavePublicGame(gameId);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Leave failed');
      loadGames();
    }
  };

  const isParticipant = (g) =>
    g.participants?.some(p => p.id === user?.id) || g.game?.hostId === user?.id;

  // derive displayed games client-side
  const decorate = (list) => {
    let arr = [...list];
    if (showMine && user) {
      arr = arr.filter(g =>
        g.game?.hostId === user.id ||
        g.participants?.some(p => p.id === user.id)
      );
    }
    // sorting
    arr.sort((a,b) => {
      const ga = a.game || a, gb = b.game || b;
      if (sort === 'soon') {
        return new Date(a.booking?.date || a.date || 0) - new Date(b.booking?.date || b.date || 0);
      }
      if (sort === 'fill') {
        const ra = (ga.currentPlayers || 0) / (ga.maxPlayers || 1);
        const rb = (gb.currentPlayers || 0) / (gb.maxPlayers || 1);
        return rb - ra;
      }
      if (sort === 'new') {
        return new Date(gb.createdAt || 0) - new Date(ga.createdAt || 0);
      }
      return 0;
    });
    return arr;
  };
  const visibleGames = decorate(games).slice(0, page * PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Public Games</h1>
          <p className="text-muted-foreground">Join community games or host your own</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadGames}>Refresh</Button>
          <Button onClick={openCreate} disabled={!user}>
            <Plus className="h-4 w-4 mr-1" /> Create Game
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          value={filters.date}
          onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
          className="px-3 py-2 rounded-md border border-input text-sm"
        />
        <select
          value={filters.sportType}
            onChange={e => setFilters(f => ({ ...f, sportType: e.target.value }))}
          className="px-3 py-2 rounded-md border border-input text-sm"
        >
          <option value="">All Sports</option>
          <option>Tennis</option>
          <option>Badminton</option>
          <option>Football</option>
          <option>Basketball</option>
        </select>
        <select
          value={filters.skillLevel}
          onChange={e => setFilters(f => ({ ...f, skillLevel: e.target.value }))}
          className="px-3 py-2 rounded-md border border-input text-sm"
        >
          <option value="">All Skill</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">Sort</label>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="px-2 py-1 rounded-md border border-input text-xs"
          >
            <option value="soon">Soonest Date</option>
            <option value="fill">Filling Fast</option>
            <option value="new">Newest</option>
          </select>
        </div>
        {user && (
          <button
            onClick={() => { setShowMine(v => !v); setPage(1); }}
            className={`px-3 py-1 rounded-full text-xs border transition ${
              showMine ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-muted'
            }`}
          >
            My Games
          </button>
        )}
        <div className="flex gap-1">
          {['Tennis','Badminton','Football','Basketball'].map(s => (
            <button
              key={s}
              onClick={() => setFilters(f => ({ ...f, sportType: f.sportType === s ? '' : s }))}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                filters.sportType === s ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-primary" />
        </div>
      ) : games.length === 0 ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <h3 className="font-semibold text-xl mb-2">No open games</h3>
            <p className="text-muted-foreground mb-6">Be the first to host a public game.</p>
            <Button onClick={openCreate} disabled={!user}>
              <Plus className="h-4 w-4 mr-1" /> Create Game
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {visibleGames.map(g => {
            const game = g.game || g; // support shape
            const booking = g.booking || g.bookingId;
            const court = g.court;
            const venue = g.venue;
            const participants = g.participants || g.currentPlayers;
            const dateStr = booking?.date ? format(new Date(booking.date), 'MMM d, yyyy') : '';
            const timeStr = booking?.startTime ? `${booking.startTime} - ${booking.endTime}` : '';
            const currentPlayers = game?.currentPlayers ?? g?.currentPlayers ?? participants?.length ?? 1;
            // FIX: remove invalid mixing of ?? and || and redundant repeats
            const maxPlayers = game?.maxPlayers ?? g?.maxPlayers ?? 0;
            const full = game?.status === 'full' || currentPlayers >= (maxPlayers || 0);

            return (
              <Card
                key={game.id}
                // Increased vertical space so all metadata & buttons fit comfortably
                // Added consistent internal spacing control (pb-4)
                className="border hover:shadow-lg transition-shadow flex flex-col h-full min-h-[420px] md:min-h-[440px]"
              >
                <Card.Content className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">
                      {game.title}
                    </h3>
                    <Badge variant={
                      full ? 'destructive' : 
                      (game.status === 'closed' ? 'secondary' : 'outline')
                    }>
                      {full ? 'Full' : (game.status === 'closed' ? 'Closed' : (game.status || 'Open'))}
                    </Badge>
                  </div>
                  {/* Allow one more line before truncation for longer descriptions */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-4 leading-relaxed">
                    {game.description || 'Community match'}
                  </p>
                  <div className="space-y-1 text-sm mb-4">
                     <div className="flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-primary" />
                       <span>{dateStr} {timeStr && `• ${timeStr}`}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <MapPin className="h-4 w-4 text-primary" />
                       <span>{venue?.name}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <Users className="h-4 w-4 text-primary" />
                       <span>{currentPlayers}/{game.maxPlayers} players</span>
                     </div>
                     {court?.sportType && (
                       <Badge variant="secondary" className="mt-1">{court.sportType}</Badge>
                     )}
                   </div>

                  {/* Push actions to bottom with extra top padding for spacing */}
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                     <Button variant="outline" size="sm" asChild>
                       <Link to={`/games/${game.id}`}>Details</Link>
                     </Button>
                     {user && (game.hostId === user.id) && game.status !== 'closed' && (
                       <Button
                         size="sm"
                         variant="outline"
                         disabled={closingId === game.id}
                         onClick={async () => {
                           setClosingId(game.id);
                           try {
                             await gameService.closePublicGame(game.id);
                             mutateGame(game.id, gWrap => {
                               const gm = gWrap.game || gWrap;
                                 return { 
                                   ...gWrap, 
                                   game: { ...gm, status: 'closed' }, 
                                   status: 'closed' 
                                 };
                             });
                             toast.success('Game closed');
                           } catch (e) {
                             console.error('Close error', e);
                             toast.error(e.response?.data?.message || 'Failed to close game');
                           } finally {
                             setClosingId(null);
                           }
                         }}
                       >
                         {closingId === game.id ? 'Closing...' : 'Close'}
                       </Button>
                     )}
                     {user && (game.hostId === user.id) && (
                       <Button size="sm" disabled>
                         Host
                       </Button>
                     )}
                     {user && game.hostId !== user.id && !isParticipant(g) && !full && (
                       <Button size="sm" onClick={() => handleJoin(game.id)}>
                         Join
                       </Button>
                     )}
                     {user && isParticipant(g) && game.hostId !== user.id && (
                       <Button size="sm" variant="destructive" onClick={() => handleLeave(game.id)}>
                         Leave
                       </Button>
                     )}
                   </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && visibleGames.length < decorate(games).length && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => setPage(p => p + 1)}>
            Load More
          </Button>
        </div>
      )}

      {/* Create Game Modal (simple inline) */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card w-full max-w-lg rounded-lg border shadow-xl p-6 space-y-5 relative">
            <button
              className="absolute top-3 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setShowCreate(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold">Create Public Game</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Booking *</label>
                <select
                  required
                  value={newGame.bookingId}
                  onChange={e => setNewGame(g => ({ ...g, bookingId: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select your upcoming booking</option>
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.courtName || 'Court'} • {b.date} {b.startTime}-{b.endTime}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <input
                  required
                  value={newGame.title}
                  onChange={e => setNewGame(g => ({ ...g, title: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Evening Tennis Doubles"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  rows={3}
                  value={newGame.description}
                  onChange={e => setNewGame(g => ({ ...g, description: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Friendly intermediate match"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Max Players *</label>
                  <input
                    type="number"
                    min={2}
                    value={newGame.maxPlayers}
                    onChange={e => setNewGame(g => ({ ...g, maxPlayers: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Skill Level</label>
                  <select
                    value={newGame.skillLevel}
                    onChange={e => setNewGame(g => ({ ...g, skillLevel: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}