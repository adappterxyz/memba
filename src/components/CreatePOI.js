import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MenuList, Box, RadioGroup, Radio, FormControlLabel, Checkbox, ListItemText, TextField, ListSubheader, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem, Select, InputLabel, FormControl, Chip, OutlinedInput } from '@mui/material';
import { AddLocation, People, ArrowLeft, ArrowRight, DirectionsRun, PhotoCamera, CloudUpload, Link, Map, Schedule, CheckCircle, Cancel, Event, Star, SportsEsports, LocalActivity, WbSunny } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GoogleMapComponent from './GoogleMapComponent';
import { options } from './Tags';
import 'font-awesome/css/font-awesome.min.css';
import UploadImage from './UploadImage'; // Import the UploadImage component
import CTADialog from './CTADialog';
import modalStyles from './ModalStyles';
const activityTypes = [
  { label: "Listing", icon: <Star /> },
  { label: "Promotion", icon: <LocalActivity /> },
  { label: "Event", icon: <Event /> },
  { label: "Hangout", icon: <WbSunny /> },
  { label: "Tasks", icon: <SportsEsports /> }
];

const CreatePOI = ({ setIsLoading, authorship, group, setTokens, userId, walletAddress, coordinates }) => {
  console.log(coordinates);
  const emptyForm = {
    title: '',
    description: '',
    imageFile: null,
    imageUrl: '',
    lat: coordinates.latitude,
    lng: coordinates.longitude,
    start: null,
    end: null,
    activity: 'Promotion',
    tags: [],
    cta: '',
    communityid: ''
  };

  const [formData, setFormData] = useState(emptyForm);
  const [validation, setValidation] = useState(false);

  useEffect(() => {
    // Check if all required fields are filled
    if (formData.title) {
      setValidation(false);
    } else {
      setValidation(true);
    }
  }, [formData]);

  const handleSelect = (option) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      communityid: option // Only allow one item to be selected
    }));
  };

  const [topen, settOpen] = useState(false);
  const [locationSelected, setLocationSelected] = useState(true);
  const [scheduleSet, setScheduleSet] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [initPref, setInitPref] = useState([]);
  const [uselink, setuselink] = useState(false);
  const [listCard, setListCard] = useState(false);
  const [openCTA, setOpenCTA] = useState(false);
  const [community, setCommunity] = useState(false);
  const [deleteImg, setDeleteImg] = useState(false);
  const containerRef = useRef(null);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'tags') {
      const { target: { options } } = event;
      const value = [];
      for (let i = 0, l = options.length; i < l; i += 1) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
      setFormData(prevState => ({
        ...prevState,
        tags: value
      }));
    } else if (files && files[0]) {
      setFormData(prevState => ({
        ...prevState,
        imageFile: files[0],
        imageUrl: URL.createObjectURL(files[0])
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const getstep = () => {
    if (formData.imageFile && formData.activity && formData.title && formData.description) { return "stage" + 3; }
    if (formData.imageFile && formData.cta) { return "stage" + 2; }
    if (formData.imageFile) { return "stage" + 1; }
    console.log(formData);
  };

  const ctalabel = (activity) => {
    if (activity == "Event") {
      return 'link to rsvp, ie luma, meetup, eventsbrite ...';
    } else if (activity == "Listing") {
      return 'link to restaurant/ venue/ bar information, booking details';
    } else if (activity == "Promotion") {
      return 'link to claim TG vouchers';
    } else if (activity == "Tasks") {
      return 'link to your activity page';
    } else if (activity == "Chilling") {
      return 'Your TG or group TG.';
    } else {
      return 'cta action link';
    }
  };

  const handleSubmit = async (value) => {
    setFormData(prevState => ({
      ...prevState,
      communityid: value
    }));
    console.log('Form Data:', formData);
    await postpoi(value);
  };

  const toggleScheduleDialog = () => {
    setOpenSchedule(!openSchedule);
  };

  const handleLocationSelect = (location,address) => {
    console.log(location,address);
    setFormData(prev => ({
      ...prev,
      lat: location.lat.toFixed(6),
      lng: location.lng.toFixed(6)
    }));
    setLocationSelected(true);
  };

  const handleDateChange = (newValue, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
    setScheduleSet(true);
  };

  const clearSchedule = () => {
    setFormData(prev => ({
      ...prev,
      start: null,
      end: null
    }));
    setOpenSchedule(false);
    setScheduleSet(false);
  };

  const updatePref = async (event) => {
    // logic for updating preferences
  };

  const handleTagChange = (event) => {
    const value = event.target.value;
    if (value.length <= 2) {
      setInitPref(value);
      const newFormdata = formData;
      newFormdata.tags = value;
      setFormData(newFormdata);
    } else {
      window.showAlert("You can only select up to 2 tags.");
    }
    console.log(formData);
  };

  const handleIns = () => {
    window.showAlert("Coming Soon");
  };

  const postpoi = async (value) => {
    // Create a FormData object
    const data = new FormData();

    // Append fields to the FormData
    data.append('title', formData.title);
    data.append('description', formData.description || '');
    if (formData.imageFile && formData.imageFile instanceof File) {
      data.append('imageFile', formData.imageFile);
    }
    data.append('imageUrl', formData.imageUrl || '');
    data.append('lat', formData.lat);
    data.append('lng', formData.lng);
    data.append('start', formData.start || '');
    data.append('end', formData.end || '');
    data.append('activity', formData.activity || 'Listing');
    data.append('cta', formData.cta);
    data.append('tags', JSON.stringify(formData.tags));
    data.append('authorid', userId);
    data.append('communityid', [value]);

    const auth = window.Telegram.WebApp.initData;
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.showme.asia/postpoi`, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Authorization': JSON.stringify(auth)
        },
        body: data
      });
      const output = await response.json();
      window.showAlert("<img src='dj-party.gif'/><br/>" + formData.title + " posted!");
      setTokens(output.tokens);
      setFormData(emptyForm);
      setInitPref([]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
const closeCTA =()=>{
  
  console.log(111,formData);
}
  const handleuselink = () => {
    setuselink(!uselink);
  };

  const handleClose = () => {
    console.log('selected');
   };

  const handleDelete = (preferenceToDelete) => async () => {
    setInitPref((prevPreferences) => prevPreferences.filter((preference) => preference !== preferenceToDelete));
  };

  return (
    <div className='poiform' style={modalStyles.formContainer}>
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ ...modalStyles.dialogPaper, p: 2, width: '100%', height:'100%', overflow:'auto', margin: '10px auto' }}>
<div >
         
            </div>
          {/* Use the UploadImage component here */}
          <UploadImage
            imageUrl={formData.imageUrl}
            setImageUrl={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
            setCommunityLogo={(file) => setFormData(prev => ({ ...prev, imageFile: file }))}
          />

          <Box className="form">
          <Button
                  variant="outlined"
                  onClick={() => setOpenCTA(true)}
                  size="small"
                  sx={{ flex: '0 0 auto', scrollSnapAlign: 'center' , color:"#FFF"}}
                >
                  <DirectionsRun /> Create Post 
                </Button>
          <TextField fullWidth variant='filled' label="Title" name="title" value={formData.title} onChange={handleChange} size="small" margin="dense" sx={modalStyles.textField} InputLabelProps={modalStyles.labelProps} InputProps={modalStyles.labelProps} />

        <TextField fullWidth variant='filled' label="Description" name="description" multiline rows={2} value={formData.description} onChange={handleChange} size="small" margin="dense" sx={modalStyles.textField} InputLabelProps={modalStyles.labelProps} InputProps={modalStyles.labelProps} />
        <CTADialog
        handleLocationSelect={handleLocationSelect}
        handleClose={handleClose}
        setFormData={setFormData}
        closeCTA={closeCTA}
        openCTA={openCTA}
        setOpenCTA={setOpenCTA}
        formData={formData}
        handleChange={handleChange}
        handleDateChange={handleDateChange}
        clearSchedule={clearSchedule}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip variant="fi" label="Add Tags" onClick={settOpen} />
              {initPref.map((preference) => (
                <Chip sx={{ background: "var(--button-background)" }}
                  key={preference}
                  label={preference}
                  onDelete={handleDelete(preference)}
                />
              ))}
            </Box>

          </Box>
          <Button onClick={() => setCommunity(true)}
            variant="contained" color="primary" disabled={validation} fullWidth
            sx={{
              width: '100%',
              py: 2, // Increase the padding for a larger button
              fontSize: '1rem',
              backgroundColor: '#1a73e8',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#1765cc',
              },
            }}>Post {formData.communityid && `to ${group[formData.communityid]}`}</Button>



          <Dialog open={openSchedule} onClose={toggleScheduleDialog} fullWidth maxWidth="sm">
            <Typography sx={{ p: 2 }} variant="h6">Validity</Typography>
            <Button variant="outlined" onClick={toggleScheduleDialog} color="primary" sx={{ mb: 2, margin: 2 }}>Save Schedule</Button>
            <Button
              variant="outlined"
              onClick={clearSchedule}
              fullWidth
              size="small"
              startIcon={<Cancel sx={{ color: "red" }} />}
              style={{ "border": "0" }}>

              Remove Schedule
            </Button>
          </Dialog>
          <Dialog open={community} onClose={() => setCommunity(false)} fullWidth maxWidth="sm">
            <Typography sx={{ p: 2 }} variant="h6">Where will this be listed on?</Typography>
            <MenuList>
              {Object.entries(authorship).map(([key, value]) => (
                <MenuItem key={value} value={value}
                  onClick={() => { setCommunity(false); handleSubmit(value); }}>
                  <ListItemText primary={group[value]} />
                </MenuItem>
              ))}
            </MenuList>

          </Dialog>
          <Dialog open={deleteImg} onClose={() => setDeleteImg(false)} fullWidth maxWidth="sm">

            <Button onClick={() => { setDeleteImg(false); formData.imageFile = ''; formData.imageUrl = ''; }}>Remove Image</Button>
          </Dialog>
          <Select
            sx={{ border: '1px solid #FFF', visibility: "hidden" }}
            labelId="preferences-label"
            id="preferences-select"
            multiple
            open={topen}
            value={initPref}
            onChange={handleTagChange}
            onClose={() => { settOpen(false) }}
            renderValue={(selected) => null}
          >
            {Object.keys(options).flatMap((category) => [
              <ListSubheader key={category}>{category}</ListSubheader>,
              ...options[category].map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox sx={{
                    '& .MuiSvgIcon-root': {
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }
                  }} checked={initPref.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              )),
            ])}
          </Select>
        </Box>

    </div>
  );
};

export default CreatePOI;
