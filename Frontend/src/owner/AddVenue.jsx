import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerService, adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, Info, AlertCircle } from 'lucide-react';
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
    pricePerHour: '',
    courts: [] // Add courts array to store court data
  });
  const [errors, setErrors] = useState({});

  // State for new court being added
  const [newCourt, setNewCourt] = useState({
    name: '',
    sportType: '',
    pricePerHour: '',
    openingTime: '08:00',
    closingTime: '22:00'
  });
  
  const [courtErrors, setCourtErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCourtChange = (e) => {
    const { name, value } = e.target;
    setNewCourt(prev => ({ ...prev, [name]: value }));
    // Clear court errors when typing
    if (courtErrors[name]) {
      setCourtErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate court data before adding
  const validateCourt = () => {
    const errors = {};
    if (!newCourt.name.trim()) errors.name = 'Court name is required';
    if (!newCourt.sportType.trim()) errors.sportType = 'Sport type is required';
    if (!newCourt.pricePerHour || isNaN(newCourt.pricePerHour) || newCourt.pricePerHour <= 0) {
      errors.pricePerHour = 'Price must be greater than 0';
    }
    
    // Validate times
    const openingHour = parseInt(newCourt.openingTime.split(':')[0]);
    const closingHour = parseInt(newCourt.closingTime.split(':')[0]);
    if (closingHour <= openingHour) {
      errors.closingTime = 'Closing time must be after opening time';
    }
    
    return errors;
  };

  // Add court to the venue
  const addCourt = () => {
    const validationErrors = validateCourt();
    if (Object.keys(validationErrors).length > 0) {
      setCourtErrors(validationErrors);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      courts: [...prev.courts, newCourt]
    }));
    setNewCourt({ name: '', sportType: '', pricePerHour: '', openingTime: '08:00', closingTime: '22:00' });
    setCourtErrors({});
  };

  // Validate the entire form before submission
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
        // strings, not arrays
        sportTypes: formData.sportTypes,
        amenities: formData.amenities || '',
        pricePerHour: parseFloat(formData.pricePerHour),
      };

      const createVenueFn = isAdmin ? adminService.createVenue : ownerService.createVenue;

      const venueRes = await createVenueFn(venueData);
      console.log('Create venue response:', venueRes?.data);

      const venueId =
        venueRes?.data?.venue?.[0]?.id ??
        venueRes?.data?.venue?.id ??
        venueRes?.data?.id;

      if (!venueId) {
        console.error('Could not resolve venueId from response:', venueRes?.data);
        throw new Error('Failed to create venue (no id returned)');
      }

      toast.success('Venue created. Now add courts.');
      // Redirect to role-specific Add Courts page
      if (isAdmin) {
        navigate(`/admin/venues/${venueId}/courts/new`);
      } else {
        navigate(`/owner/venues/${venueId}/courts/new`);
      }
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

      {formData.courts.length === 0 && (
        <div className="p-4 mb-6 border border-amber-200 bg-amber-50 rounded-md">
          <div className="flex items-center text-amber-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p><strong>Note:</strong> At least one court is required to create a venue.</p>
          </div>
        </div>
      )}

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

            {/* Court Details */}
            <div>
              <h3 className="text-lg font-medium mb-3">Add Courts *</h3>
              {errors.courts && <p className="text-sm text-destructive mb-2">{errors.courts}</p>}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={newCourt.name}
                    onChange={handleCourtChange}
                    placeholder="Court Name"
                    className={`p-2 border rounded-md w-full ${courtErrors.name ? 'border-destructive' : 'border-input'}`}
                  />
                  {courtErrors.name && <p className="text-xs text-destructive mt-1">{courtErrors.name}</p>}
                </div>
                
                <div>
                  <input
                    type="text"
                    name="sportType"
                    value={newCourt.sportType}
                    onChange={handleCourtChange}
                    placeholder="Sport Type"
                    className={`p-2 border rounded-md w-full ${courtErrors.sportType ? 'border-destructive' : 'border-input'}`}
                  />
                  {courtErrors.sportType && <p className="text-xs text-destructive mt-1">{courtErrors.sportType}</p>}
                </div>
                
                <div>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={newCourt.pricePerHour}
                    onChange={handleCourtChange}
                    placeholder="Price Per Hour"
                    className={`p-2 border rounded-md w-full ${courtErrors.pricePerHour ? 'border-destructive' : 'border-input'}`}
                    min="0"
                    step="0.01"
                  />
                  {courtErrors.pricePerHour && <p className="text-xs text-destructive mt-1">{courtErrors.pricePerHour}</p>}
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs mb-1">Opening Time</label>
                    <input
                      type="time"
                      name="openingTime"
                      value={newCourt.openingTime}
                      onChange={handleCourtChange}
                      className="p-2 border rounded-md w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs mb-1">Closing Time</label>
                    <input
                      type="time"
                      name="closingTime"
                      value={newCourt.closingTime}
                      onChange={handleCourtChange}
                      className={`p-2 border rounded-md w-full ${courtErrors.closingTime ? 'border-destructive' : 'border-input'}`}
                    />
                    {courtErrors.closingTime && <p className="text-xs text-destructive mt-1">{courtErrors.closingTime}</p>}
                  </div>
                </div>
                
                <Button type="button" variant="outline" onClick={addCourt}>
                  Add Court
                </Button>
              </div>
              <ul className="mt-4 space-y-2">
                {formData.courts.map((court, index) => (
                  <li key={index} className="flex justify-between items-center p-2 border rounded-md">
                    <span>
                      {court.name} ({court.sportType}) - ${court.pricePerHour}/hr
                      <span className="text-xs text-muted-foreground ml-2">
                        {court.openingTime} - {court.closingTime}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
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