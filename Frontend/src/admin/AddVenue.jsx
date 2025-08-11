import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAddVenue() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    location: '',
    sportTypes: '',
    amenities: '',
    pricePerHour: '',
    courts: [] // Add courts array
  });
  
  // Add court state
  const [newCourt, setNewCourt] = useState({
    name: '',
    sportType: '',
    pricePerHour: '',
    openingTime: '08:00',
    closingTime: '22:00',
    count: 1
  });
  
  const [errors, setErrors] = useState({});
  const [courtErrors, setCourtErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add handleCourtChange function
  const handleCourtChange = (e) => {
    const { name, value } = e.target;
    setNewCourt(prev => ({ ...prev, [name]: value }));
    if (courtErrors[name]) {
      setCourtErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Add validateCourt function
  const validateCourt = () => {
    const errors = {};
    if (!newCourt.name.trim()) errors.name = 'Court name is required';
    if (!newCourt.sportType.trim()) errors.sportType = 'Sport type is required';
    if (!newCourt.pricePerHour || isNaN(newCourt.pricePerHour) || newCourt.pricePerHour <= 0) {
      errors.pricePerHour = 'Price must be greater than 0';
    }
    if (!newCourt.count || isNaN(newCourt.count) || newCourt.count < 1) {
      errors.count = 'Count must be at least 1';
    }
    
    const openingHour = parseInt(newCourt.openingTime.split(':')[0]);
    const closingHour = parseInt(newCourt.closingTime.split(':')[0]);
    if (closingHour <= openingHour) {
      errors.closingTime = 'Closing time must be after opening time';
    }
    
    return errors;
  };
  
  // Add addCourt function
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
    setNewCourt({ 
      name: '', 
      sportType: '', 
      pricePerHour: '', 
      openingTime: '08:00', 
      closingTime: '22:00',
      count: 1 
    });
    setCourtErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Process data including courts
      const sanitizedData = {
        ...formData,
        sportTypes: formData.sportTypes.split(',').map(type => type.trim()),
        amenities: formData.amenities ? formData.amenities.split(',').map(amenity => amenity.trim()) : [],
        courts: formData.courts.map(court => ({
          name: court.name,
          sportType: court.sportType,
          pricePerHour: parseFloat(court.pricePerHour),
          openingTime: court.openingTime,
          closingTime: court.closingTime,
          count: parseInt(court.count)
        }))
      };
      
      await adminService.createVenue(sanitizedData);
      toast.success('Venue created successfully!');
      navigate('/admin/venues');
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
        <Button variant="ghost" className="mr-4" onClick={() => navigate('/admin/venues')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Venues
        </Button>
        <h1 className="text-3xl font-bold">Add New Venue</h1>
      </div>

      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Venue Details
          </Card.Title>
          <Card.Description>Create a new venue for booking</Card.Description>
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
            
            {/* Court Details */}
            <div>
              <h3 className="text-lg font-medium mb-3">Add Courts</h3>
              <div className="grid gap-4 sm:grid-cols-2">
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
                
                <div>
                  <input
                    type="number"
                    name="count"
                    value={newCourt.count}
                    onChange={handleCourtChange}
                    placeholder="Count"
                    className={`p-2 border rounded-md w-full ${courtErrors.count ? 'border-destructive' : 'border-input'}`}
                    min="1"
                  />
                  {courtErrors.count && <p className="text-xs text-destructive mt-1">{courtErrors.count}</p>}
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
                      className="p-2 border rounded-md w-full"
                    />
                    {courtErrors.closingTime && <p className="text-xs text-destructive mt-1">{courtErrors.closingTime}</p>}
                  </div>
                </div>
                
                <div>
                  <Button type="button" variant="outline" onClick={addCourt} className="w-full">
                    Add Court
                  </Button>
                </div>
              </div>
              
              {/* Display added courts */}
              {formData.courts.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Added Courts:</h4>
                  <ul className="space-y-2">
                    {formData.courts.map((court, index) => (
                      <li key={index} className="p-2 border rounded-md flex justify-between">
                        <span>
                          {court.name} ({court.sportType}) - ${court.pricePerHour}/hr - {court.count} {court.count > 1 ? 'courts' : 'court'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {court.openingTime} - {court.closingTime}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/venues')}>
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