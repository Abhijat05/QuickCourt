import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerService } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddVenue() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    location: '',
    sportTypes: '',
    amenities: '',
    pricePerHour: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await ownerService.createVenue(formData);
      toast.success('Venue created successfully! It will be reviewed by an admin.');
      navigate('/owner/venues');
    } catch (err) {
      console.error('Error creating venue:', err);
      toast.error(err.response?.data?.message || 'Failed to create venue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 mt-16"
    >
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={() => navigate('/owner/venues')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Venues
        </Button>
        <h1 className="text-3xl font-bold">Add New Venue</h1>
      </div>

      <div className="bg-info/10 border border-info/30 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-info" />
          <p className="font-medium text-info">Important Note</p>
        </div>
        <p className="mt-1 text-sm text-info/80">
          Your venue will need to be approved by an administrator before it becomes visible to users.
          Please provide complete and accurate information.
        </p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Venue Details
          </Card.Title>
          <Card.Description>Provide information about your venue</Card.Description>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Venue Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
              <div>
                <label htmlFor="pricePerHour" className="block text-sm font-medium mb-1">Price Per Hour *</label>
                <input
                  type="number"
                  id="pricePerHour"
                  name="pricePerHour"
                  required
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-md"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-input rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">Location (City/Area) *</label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border border-input rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="sportTypes" className="block text-sm font-medium mb-1">Sport Types * (comma-separated)</label>
              <input
                type="text"
                id="sportTypes"
                name="sportTypes"
                required
                value={formData.sportTypes}
                onChange={handleChange}
                className="w-full p-2 border border-input rounded-md"
                placeholder="Tennis, Basketball, Football"
              />
            </div>
            
            <div>
              <label htmlFor="amenities" className="block text-sm font-medium mb-1">Amenities (comma-separated)</label>
              <input
                type="text"
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full p-2 border border-input rounded-md"
                placeholder="Changing Rooms, Showers, Parking"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-input rounded-md"
                rows="4"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/owner/venues')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Venue'}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </motion.div>
  );
}