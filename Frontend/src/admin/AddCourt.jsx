import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminAddCourt() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <div className="container mx-auto px-4 py-8 mt-16">Not authorized</div>;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    sportType: '',
    pricePerHour: '',
    openingTime: '08:00',
    closingTime: '22:00',
    count: 1,
  });

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const count = parseInt(form.count) > 0 ? parseInt(form.count) : 1;
      const reqs = [];
      for (let i = 0; i < count; i++) {
        const courtName = count > 1 ? `${form.name} ${i + 1}` : form.name;
        reqs.push(
          adminService.createCourt(venueId, {
            name: courtName,
            sportType: form.sportType,
            pricePerHour: parseFloat(form.pricePerHour),
            openingTime: form.openingTime,
            closingTime: form.closingTime,
          })
        );
      }
      await Promise.all(reqs);
      toast.success('Courts created');
      navigate('/admin/venues');
    } catch (err) {
      console.error('Error creating courts:', err);
      toast.error(err.response?.data?.message || 'Failed to create courts');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-xl">
      <Card>
        <Card.Header>
          <Card.Title>Add Courts (Admin)</Card.Title>
          <Card.Description>Venue ID: {venueId}</Card.Description>
        </Card.Header>
        <Card.Content>
          <form onSubmit={submit} className="space-y-4">
            <input name="name" placeholder="Court Name" className="w-full p-2 border rounded-md" onChange={onChange} />
            <input name="sportType" placeholder="Sport Type" className="w-full p-2 border rounded-md" onChange={onChange} />
            <input name="pricePerHour" type="number" step="0.01" placeholder="Price Per Hour" className="w-full p-2 border rounded-md" onChange={onChange} />
            <div className="grid grid-cols-2 gap-2">
              <input name="openingTime" type="time" className="w-full p-2 border rounded-md" value={form.openingTime} onChange={onChange} />
              <input name="closingTime" type="time" className="w-full p-2 border rounded-md" value={form.closingTime} onChange={onChange} />
            </div>
            <input name="count" type="number" min="1" placeholder="Count" className="w-full p-2 border rounded-md" value={form.count} onChange={onChange} />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/venues')}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Courts'}</Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}