import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddVenue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Venue name is required.';
    if (!formData.pricePerHour || isNaN(formData.pricePerHour) || formData.pricePerHour <= 0) {
      newErrors.pricePerHour = 'Price per hour must be a valid number greater than 0.';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.sportTypes.trim()) newErrors.sportTypes = 'Sport types are required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const venueData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        location: formData.location,
        sportTypes: formData.sportTypes,
        amenities: formData.amenities || '',
        pricePerHour: parseFloat(formData.pricePerHour),
      };

      const venueResponse = await ownerService.createVenue(venueData);
      const venueId =
        venueResponse?.data?.venue?.[0]?.id ??
        venueResponse?.data?.venue?.id ??
        venueResponse?.data?.id;
      const venueIdNum = Number(venueId);
      if (!Number.isFinite(venueIdNum)) {
        console.error('Invalid venueId from createVenue response:', venueResponse?.data);
        throw new Error('Failed to create venue (invalid id returned by API)');
      }

      toast.success('Venue created. Now add courts.');
      navigate(`/owner/venues/${venueIdNum}/courts/new`);
      return;
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
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.name ? 'border-destructive' : 'border-input'}`}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="pricePerHour" className="block text-sm font-medium mb-1">Price Per Hour *</label>
                <input
                  type="number"
                  id="pricePerHour"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.pricePerHour ? 'border-destructive' : 'border-input'}`}
                  min="0"
                  step="0.01"
                />
                {errors.pricePerHour && <p className="text-sm text-destructive mt-1">{errors.pricePerHour}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.address ? 'border-destructive' : 'border-input'}`}
              />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">Location (City/Area) *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.location ? 'border-destructive' : 'border-input'}`}
              />
              {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
            </div>
            
            <div>
              <label htmlFor="sportTypes" className="block text-sm font-medium mb-1">Sport Types * (comma-separated)</label>
              <input
                type="text"
                id="sportTypes"
                name="sportTypes"
                value={formData.sportTypes}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.sportTypes ? 'border-destructive' : 'border-input'}`}
                placeholder="Tennis, Basketball, Football"
              />
              {errors.sportTypes && <p className="text-sm text-destructive mt-1">{errors.sportTypes}</p>}
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
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.description ? 'border-destructive' : 'border-input'}`}
                rows="4"
              ></textarea>
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
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