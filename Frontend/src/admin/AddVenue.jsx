import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Clock,
  DollarSign,
  Plus,
  X,
  Info,
  Check,
  AlertCircle,
  ImageIcon,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAddVenue() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    location: '',
    sportTypes: '',
    amenities: '',
    pricePerHour: '',
    courts: []
  });
  
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

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Venue details and location' },
    { id: 2, title: 'Courts', description: 'Add courts and facilities' },
    { id: 3, title: 'Review', description: 'Confirm and create' }
  ];

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
    if (courtErrors[name]) {
      setCourtErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Venue name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.sportTypes.trim()) newErrors.sportTypes = 'Sport types are required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.pricePerHour || isNaN(formData.pricePerHour) || formData.pricePerHour <= 0) {
      newErrors.pricePerHour = 'Valid price is required';
    }
    return newErrors;
  };

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
  
  const addCourt = () => {
    const validationErrors = validateCourt();
    if (Object.keys(validationErrors).length > 0) {
      setCourtErrors(validationErrors);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      courts: [...prev.courts, { ...newCourt, id: Date.now() }]
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
    toast.success('Court added successfully!');
  };

  const removeCourt = (courtId) => {
    setFormData(prev => ({
      ...prev,
      courts: prev.courts.filter(court => court.id !== courtId)
    }));
    toast.success('Court removed');
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const stepErrors = validateStep1();
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        toast.error('Please fill in all required fields');
        return;
      }
    }
    
    if (currentStep === 2 && formData.courts.length === 0) {
      toast.error('Please add at least one court');
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const venueData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        location: formData.location,
        sportTypes: formData.sportTypes.split(',').map(type => type.trim()),
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
        pricePerHour: parseFloat(formData.pricePerHour),
      };

      const venueRes = await adminService.createVenue(venueData);
      console.log('Admin create venue response:', venueRes?.data);

      const venueId =
        venueRes?.data?.venue?.[0]?.id ??
        venueRes?.data?.venue?.id ??
        venueRes?.data?.id;

      if (!venueId) {
        console.error('Could not resolve venueId from response:', venueRes?.data);
        throw new Error('Failed to create venue (no id returned)');
      }

      toast.success('Venue created. Now add courts.');
      navigate(`/admin/venues/${venueId}/courts/new`);
    } catch (err) {
      console.error('Error creating venue:', err);
      toast.error(err.response?.data?.message || 'Failed to create venue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
            ${currentStep >= step.id 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-muted bg-background text-muted-foreground'
            }
          `}>
            {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
          </div>
          <div className="ml-3 mr-8 hidden md:block">
            <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.title}
            </p>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 ${currentStep > step.id ? 'bg-primary' : 'bg-muted'} mr-8`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderBasicInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Building className="w-4 h-4" />
            Venue Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-primary/20 ${
              errors.name ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Enter venue name"
          />
          {errors.name && <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors.name}
          </p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Base Price Per Hour *
          </label>
          <input
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-primary/20 ${
              errors.pricePerHour ? 'border-destructive' : 'border-input'
            }`}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {errors.pricePerHour && <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors.pricePerHour}
          </p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Full Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-primary/20 ${
            errors.address ? 'border-destructive' : 'border-input'
          }`}
          placeholder="Street address, building number, etc."
        />
        {errors.address && <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {errors.address}
        </p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">City/Area *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-primary/20 ${
            errors.location ? 'border-destructive' : 'border-input'
          }`}
          placeholder="e.g., Downtown Mumbai, Bangalore Central"
        />
        {errors.location && <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {errors.location}
        </p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sport Types *</label>
        <input
          type="text"
          name="sportTypes"
          value={formData.sportTypes}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-primary/20 ${
            errors.sportTypes ? 'border-destructive' : 'border-input'
          }`}
          placeholder="Tennis, Basketball, Football (comma-separated)"
        />
        {errors.sportTypes && <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {errors.sportTypes}
        </p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.sportTypes.split(',').map((sport, index) => 
            sport.trim() && (
              <Badge key={index} variant="outline" className="text-xs">
                {sport.trim()}
              </Badge>
            )
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Amenities</label>
        <input
          type="text"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          className="w-full p-3 border border-input rounded-lg transition-colors focus:ring-2 focus:ring-primary/20"
          placeholder="Changing Rooms, Showers, Parking (comma-separated)"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.amenities.split(',').map((amenity, index) => 
            amenity.trim() && (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity.trim()}
              </Badge>
            )
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-primary/20 resize-none ${
            errors.description ? 'border-destructive' : 'border-input'
          }`}
          rows="4"
          placeholder="Describe your venue, facilities, and what makes it special..."
        />
        {errors.description && <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {errors.description}
        </p>}
      </div>
    </motion.div>
  );

  const renderCourts = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-info" />
          <h3 className="font-medium text-info">Add Courts</h3>
        </div>
        <p className="text-sm text-info/80">
          Add individual courts with their specific details. Each court can have different pricing and schedules.
        </p>
      </div>

      {/* Add New Court Form */}
      <Card className="border-dashed border-2 border-primary/20">
        <Card.Content className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Court
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Court Name *</label>
              <input
                type="text"
                name="name"
                value={newCourt.name}
                onChange={handleCourtChange}
                className={`w-full p-3 border rounded-lg ${courtErrors.name ? 'border-destructive' : 'border-input'}`}
                placeholder="e.g., Court A, Tennis Court 1"
              />
              {courtErrors.name && <p className="text-xs text-destructive">{courtErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sport Type *</label>
              <input
                type="text"
                name="sportType"
                value={newCourt.sportType}
                onChange={handleCourtChange}
                className={`w-full p-3 border rounded-lg ${courtErrors.sportType ? 'border-destructive' : 'border-input'}`}
                placeholder="e.g., Tennis, Basketball"
              />
              {courtErrors.sportType && <p className="text-xs text-destructive">{courtErrors.sportType}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Per Hour *</label>
              <input
                type="number"
                name="pricePerHour"
                value={newCourt.pricePerHour}
                onChange={handleCourtChange}
                className={`w-full p-3 border rounded-lg ${courtErrors.pricePerHour ? 'border-destructive' : 'border-input'}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {courtErrors.pricePerHour && <p className="text-xs text-destructive">{courtErrors.pricePerHour}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Courts *</label>
              <input
                type="number"
                name="count"
                value={newCourt.count}
                onChange={handleCourtChange}
                className={`w-full p-3 border rounded-lg ${courtErrors.count ? 'border-destructive' : 'border-input'}`}
                min="1"
                placeholder="1"
              />
              {courtErrors.count && <p className="text-xs text-destructive">{courtErrors.count}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Opening Time
              </label>
              <input
                type="time"
                name="openingTime"
                value={newCourt.openingTime}
                onChange={handleCourtChange}
                className="w-full p-3 border border-input rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Closing Time</label>
              <input
                type="time"
                name="closingTime"
                value={newCourt.closingTime}
                onChange={handleCourtChange}
                className={`w-full p-3 border rounded-lg ${courtErrors.closingTime ? 'border-destructive' : 'border-input'}`}
              />
              {courtErrors.closingTime && <p className="text-xs text-destructive">{courtErrors.closingTime}</p>}
            </div>
          </div>

          <Button onClick={addCourt} className="w-full mt-4" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Court
          </Button>
        </Card.Content>
      </Card>

      {/* Added Courts List */}
      {formData.courts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Added Courts ({formData.courts.length})</h3>
          <div className="grid gap-4">
            {formData.courts.map((court, index) => (
              <Card key={court.id} className="hover:shadow-md transition-shadow">
                <Card.Content className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{court.name}</h4>
                        <Badge variant="outline">{court.sportType}</Badge>
                        {court.count > 1 && (
                          <Badge variant="secondary">×{court.count}</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${court.pricePerHour}/hr
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {court.openingTime} - {court.closingTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Daily
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCourt(court.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      )}

      {formData.courts.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg bg-muted/20">
          <Building className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No courts added yet</p>
          <p className="text-sm text-muted-foreground">Add at least one court to continue</p>
        </div>
      )}
    </motion.div>
  );

  const renderReview = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Check className="w-5 h-5 text-success" />
          <h3 className="font-medium text-success">Review Your Venue</h3>
        </div>
        <p className="text-sm text-success/80">
          Please review all information before creating the venue. You can go back to make changes if needed.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Venue Information
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{formData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{formData.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{formData.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base Price</p>
              <p className="font-medium">${formData.pricePerHour}/hour</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sports</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.sportTypes.split(',').map((sport, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {sport.trim()}
                  </Badge>
                ))}
              </div>
            </div>
            {formData.amenities && (
              <div>
                <p className="text-sm text-muted-foreground">Amenities</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.amenities.split(',').map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Courts ({formData.courts.length})
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            {formData.courts.map((court, index) => (
              <div key={court.id} className="p-3 border rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{court.name}</p>
                  <Badge variant="outline">{court.sportType}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>${court.pricePerHour}/hr</span>
                  <span>×{court.count} courts</span>
                  <span>{court.openingTime} - {court.closingTime}</span>
                </div>
              </div>
            ))}
          </Card.Content>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Description</Card.Title>
        </Card.Header>
        <Card.Content>
          <p className="text-muted-foreground">{formData.description}</p>
        </Card.Content>
      </Card>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 mt-16 max-w-4xl"
    >
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-4" onClick={() => navigate('/admin/venues')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Venues
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Venue</h1>
          <p className="text-muted-foreground">Create a new venue for booking</p>
        </div>
      </div>

      {renderStepIndicator()}

      <Card className="shadow-lg">
        <Card.Header>
          <Card.Title className="text-xl">
            {currentStep === 1 && 'Basic Information'}
            {currentStep === 2 && 'Courts & Facilities'}
            {currentStep === 3 && 'Review & Create'}
          </Card.Title>
        </Card.Header>
        <Card.Content className="p-6">
          {currentStep === 1 && renderBasicInfo()}
          {currentStep === 2 && renderCourts()}
          {currentStep === 3 && renderReview()}

          <div className="flex justify-between pt-6 border-t mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/admin/venues')}>
                Cancel
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Venue'}
                </Button>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}