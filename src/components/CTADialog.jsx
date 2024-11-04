import React, { useState, useEffect  } from 'react';
import {
  Dialog, Box, Typography, Grid, FormControl, FormControlLabel, RadioGroup, Radio, TextField, Button, Switch
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Cancel, Event, Star, Work, LocalActivity, WbSunny, DirectionsCarFilled, Home } from '@mui/icons-material';
import modalStyles from './ModalStyles';
import { udata } from '../local';
import GoogleMapComponent from './GoogleMapComponent';

const activityTypes = [
  { label: "Promotion", icon: <LocalActivity /> },
  { label: "Hitch", icon: <DirectionsCarFilled /> },
  { label: "Event", icon: <Event /> },
  { label: "Hangout", icon: <WbSunny /> },
  { label: "Job", icon: <Work /> },
  { label: "Listing", icon: <Star /> },
  { label: "Homestay", icon: <Home /> },  // New CTA type
];


const CTADialog = ({
  openCTA,
  setFormData,
  setOpenCTA,
  formData,
  handleChange,
  handleDateChange,
  clearSchedule,
  handleLocationSelect,
  handleClose
}) => {
  


  const [openMap, setOpenMap] = useState(false);
  const [useValidityPeriod, setUseValidityPeriod] = useState(false); // State to manage the validity toggle
  const [activeField, setActiveField] = useState(''); // State to track which field is active
  const [dataset, setDataset]= useState({});

  useEffect(() => {
    console.log('openMap state changed:', openMap);
}, [openMap]);

  // Handler to manage location selection and update the appropriate form field
  const handleLocationSelectWithAddress = (location, address) => {
    console.log('Location selected:', location, address);
    setDataset(prevState => ({
        ...prevState,
        [activeField]: address // Use activeField to set the correct field
    }));
    handleLocationSelect(location, address);
    console.log('Setting openMap to false');
    setOpenMap(false); // This should close the map dialog
    console.log('openMap state after setting to false:', openMap);
};

const changestate =()=>{
  
}

const ctalabel = (activity) => {
  switch (activity) {
    case "Event":
      return 'Link to RSVP, e.g., Luma, Meetup, Eventbrite ...';
    case "Hitch":
      return 'Link to TG/ TG group';
    case "Listing":
      return 'General listing/ link to restaurant/venue/bar information, booking details';
    case "Promotion":
      return 'Link to claim vouchers, airdrop';
    case "Tasks":
      return 'Link to your activity page';
    case "Hangout":
      return 'Link to group hangout details';
    case "Job":
      return 'Application Link';
    case "Homestay":
      return 'Link to homestay details or booking page'; // New label for Homestay
    default:
      return 'CTA action link';
  }
};


  const userTelegramLink = 'https://t.me/' + udata.user.username;

  const validityLabel = (activity) => {
    switch (activity) {
      case "Hitch":
        return "Hitch Availability";
      case "Promotion":
        return "Promotion Validity Period";
      case "Event":
        return "Event Duration";
      case "Hangout":
        return "Hangout Time";
      case "Tasks":
        return "Task Completion Period";
      case "Homestay":
        return "Homestay Availability Period"; // New validity label for Homestay
      default:
        return "Validity Period";
    }
  };
  

  const handleActivityChange = (event) => {
    const { value } = event.target;
    handleChange({
      target: { name: 'activity', value }
    });
    if (value === "Hangout" || value === "Hitch" ) {
      handleChange({
        target: { name: "cta", value: userTelegramLink }
      });
    } else {
      handleChange({
        target: { name: "cta", value: '' }
      });
    }
    console.log('Selected Activity:', value);
  };

  const renderUniqueFields = () => {
    switch (formData.activity) {
      case "Hitch":
        return (
          <>
            <TextField
              fullWidth
              label="Pickup Location"
              name="pickupLocation"
              value={dataset.pickupLocation || ''}
              onChange={handleChange}
              onClick={() => {
                setOpenMap(true);
                setActiveField('pickupLocation'); // Set active field
              }}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />                  
            <TextField
              fullWidth
              label="Destination"
              name="destination"
              onClick={() => {
                setOpenMap(true);
                setActiveField('destination'); // Set active field
              }}
              value={dataset.destination || ''}
              onChange={handleChange}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
          </>
        );
      case "Promotion":
        return (
          <>
            <TextField
              fullWidth
              label="Number of claims"
              name="promoCode"
              value={dataset.promoCode || ''}
              onChange={handleChange}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
            <TextField
              fullWidth
              label="Target Location where users see this, not necessarily business location"
              name="targetLocation"
              value={dataset.targetLocation || ''}
              onChange={handleChange}
              onClick={() => {
                setOpenMap(true);
                setActiveField('targetLocation'); // Set active field
              }}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
            <TextField
              fullWidth
              label="Discount Amount"
              name="discountAmount"
              value={dataset.discountAmount || ''}
              onChange={handleChange}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
          </>
        );
      case "Event":
        return (
          <>
            <TextField
              fullWidth
              label="Event Location"
              name="eventLocation"
              value={dataset.eventLocation || ''}
              onChange={handleChange}
              onClick={() => {
                setOpenMap(true);
                setActiveField('eventLocation'); // Set active field
              }}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
            <TextField
              fullWidth
              label="Max Attendees"
              name="maxAttendees"
              value={formData.maxAttendees || ''}
              onChange={handleChange}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
          </>
        );
      case "Job":
        return (
          <>
            <TextField
              fullWidth
              label="Job Description"
              name="jobDescription"
              value={formData.jobDescription || ''}
              onChange={handleChange}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
            <TextField
              fullWidth
              label="Job Site"
              name="jobSite"
              value={dataset.jobSite || ''}
              onChange={handleChange}
              onClick={() => {
                setOpenMap(true);
                setActiveField('jobSite'); // Set active field
              }}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
          </>
        );
      case "Hangout":
        return (
          <TextField
            fullWidth
            label="Meeting Location"
            name="meetingLocation"
            value={dataset.meetingLocation || ''}
            onChange={handleChange}
            onClick={() => {
              setOpenMap(true);
              setActiveField('meetingLocation'); // Set active field
            }}
            variant="filled"
            size="small"
            margin="dense"
            sx={modalStyles.textField}
          />
        );  
      case "Listing":
        return (
          <>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              onClick={() => {
                setOpenMap(true);
                setActiveField('location'); // Set active field
              }}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
            <TextField
              fullWidth
              label="Contact Info"
              name="contactInfo"
              value={formData.contactInfo || ''}
              onChange={handleChange}
              variant="filled"
              size="small"
              margin="dense"
              sx={modalStyles.textField}
            />
          </>
        );
        case "Homestay":
          return (
            <>
              <TextField
                fullWidth
                label="Homestay Location"
                name="homestayLocation"
                value={dataset.homestayLocation || ''}
                onChange={handleChange}
                onClick={() => {
                  setOpenMap(true);
                  setActiveField('homestayLocation'); // Set active field
                }}
                variant="filled"
                size="small"
                margin="dense"
                sx={modalStyles.textField}
              />
              <TextField
                fullWidth
                label="Homestay Price Per Night"
                name="homestayPrice"
                value={dataset.homestayPrice || ''}
                onChange={handleChange}
                variant="filled"
                size="small"
                margin="dense"
                sx={modalStyles.textField}
              />
              <TextField
                fullWidth
                label="Number of Rooms Available"
                name="homestayRooms"
                value={dataset.homestayRooms || ''}
                onChange={handleChange}
                variant="filled"
                size="small"
                margin="dense"
                sx={modalStyles.textField}
              />
            </>
          );  
      default:
        return null;
    }
  };

  const closeCTA = () => {
    console.log(1111, formData);
  
    let generatedTitle = '';
    let generatedDescription = '';
  
    switch (formData.activity) {
      case "Hitch":
        generatedTitle = `Hitch Ride to ${dataset.destination || 'Your Destination'}`;
        generatedDescription = `Join our hitch ride from ${dataset.pickupLocation || 'your location'} to ${dataset.destination || 'the destination'}. Contact via ${formData.cta || 'Telegram'}`;
        break;
      case "Promotion":
        generatedTitle = `Special Promotion: ${dataset.promoCode || 'Discount Available'}`;
        generatedDescription = `Claim your discount using the promo code ${dataset.promoCode || 'N/A'}. Offer valid at ${dataset.targetLocation || 'all outlets'}.`;
        break;
      case "Event":
        generatedTitle = `Event at ${dataset.eventLocation || 'Our Venue'}`;
        generatedDescription = `Join us at ${dataset.eventLocation || 'the venue'} for an exciting event. Limited to ${formData.maxAttendees || 'unlimited'} guests.`;
        break;
      case "Hangout":
        generatedTitle = `Hangout at ${dataset.meetingLocation || 'a cool spot'}`;
        generatedDescription = `Let's meet up at ${dataset.meetingLocation || 'the place'} and enjoy some time together.`;
        break;
      case "Job":
        generatedTitle = `Job Opportunity: ${formData.jobDescription || 'Position Available'}`;
        generatedDescription = `Apply now for ${formData.jobDescription || 'the job'}. Visit ${dataset.jobSite || 'our site'} for more details.`;
        break;
      case "Listing":
        generatedTitle = `Available Now: ${formData.location || 'Great Spot'}`;
        generatedDescription = `Contact ${formData.contactInfo || 'us'} for more details about this listing.`;
        break;
      case "Homestay":
      generatedTitle = `Homestay Available at ${dataset.homestayLocation || 'a great place'}`;
      generatedDescription = `Book a stay at ${dataset.homestayLocation || 'our homestay'} for just ${dataset.homestayPrice || 'a great price'} per night. ${dataset.homestayRooms || 'Rooms available'}.`;
      break;  
      default:
        generatedTitle = 'New Activity';
        generatedDescription = 'Details about this activity will be updated soon.';
    }
  
    // Set the title and description if they are empty
    setFormData(prevState => ({
      ...prevState,
      title: formData.title || generatedTitle,
      description: formData.description || generatedDescription
    }));
  
    setOpenCTA(false);
  };
  return (
    <Dialog open={openCTA} onClose={closeCTA}  fullScreen>
      <Box className="action" sx={modalStyles.dialogBox}>
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto', px: 2 , maxWidth: "600px", margin:"0 auto"}}>
          <Grid container spacing={1.3} alignItems="center" justifyContent="center">
            <FormControl component="fieldset" sx={{ width: '100%', overflowX: 'auto' }}>
              <RadioGroup
              className='ctagroup'
                aria-label="activity"
                name="activity"
                value={formData.activity}
                onChange={handleActivityChange}
                row
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  maxWidth: '100%',
                  padding: '0 10px',
                  scrollbarWidth: 'thin',
                }}
              >
                {activityTypes.map(({ label, icon }) => (
                  <FormControlLabel
                    key={label}
                    value={label}
                    control={<Radio sx={{ color: '#FFF' }} icon={icon} checkedIcon={icon} />}
                    label={<Box sx={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', color: "#FFF" }}>{label}</Box>}
                    labelPlacement="bottom"
                    sx={{ flex: '0 0 auto', marginRight: 2 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {formData.activity && (
              <TextField
                fullWidth
                label={ctalabel(formData.activity)}
                name="cta"
                value={formData.cta}
                onChange={handleChange}
                variant="filled"
                size="small"
                margin="dense"
                sx={modalStyles.textField}
              />
            )}

            {renderUniqueFields()}

            <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useValidityPeriod}
                    onChange={() => setUseValidityPeriod(!useValidityPeriod)}
                    color="primary"
                  />
                }
                label={<Typography sx={{ color: '#fff' }}>{validityLabel(formData.activity)}</Typography>}
                sx={{ color: '#FFF !important' }}
              />
            </Box>

            {useValidityPeriod && (
              <Box className="date" sx={{ textAlign: 'center', width: '100%', mt: 0, background: 'transparent', borderRadius: '8px', color: '#ffffff', padding: '0px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                      <Grid item xs={6}>
                        <DateTimePicker
                          label="Start Date/Time"
                          value={formData.start}
                          onChange={(newValue) => handleDateChange(newValue, 'start')}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              margin="dense"
                              sx={modalStyles.dateTimePicker}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <DateTimePicker
                          label="End Date/Time"
                          value={formData.end}
                          onChange={(newValue) => handleDateChange(newValue, 'end')}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              margin="dense"
                              sx={modalStyles.dateTimePicker}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </LocalizationProvider>

                {formData.start && formData.end && (
                  <Button
                    variant="filled"
                    onClick={clearSchedule}
                    size="small"
                    fullWidth
                    startIcon={<Cancel sx={{ color: "#ffffff" }} />}
                    sx={modalStyles.buttonOutlined}
                  >
                    Remove Validity
                  </Button>
                )}
              </Box>
            )}
          </Grid>
        </Box>

        <Box sx={modalStyles.fixedCloseButton}>
          <Button
            variant="filled"
            sx={{ color: '#FFF' }}
            onClick={closeCTA}
            fullWidth
            size="large"
            startIcon={<Cancel />}
          >
            Close 
          </Button>
        </Box>
      </Box>
      <Dialog open={openMap} onClose={() => setOpenMap(false)} fullWidth maxWidth="md">
        <Typography sx={{ p: 2 }} variant="h6">Location </Typography>
        <GoogleMapComponent
          lat={parseFloat(formData.lat)}
          lng={parseFloat(formData.lng)}
          onLocationSelect={handleLocationSelectWithAddress} // Use updated handler
          onClose={handleClose}
        />
      </Dialog>
    </Dialog>
  );
};

export default CTADialog;
