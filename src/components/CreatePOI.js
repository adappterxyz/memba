import React, { useState, useRef, useEffect,useCallback  } from 'react';
import { MenuList, Box, RadioGroup, Radio, FormControlLabel, Checkbox, ListItemText, TextField, ListSubheader , Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem, Select, InputLabel, FormControl, Chip, OutlinedInput } from '@mui/material';
import { AddLocation, People, ArrowLeft, ArrowRight, DirectionsRun, PhotoCamera, CloudUpload, Link, Map, Schedule, CheckCircle, Cancel, Event, Star, SportsEsports, LocalActivity, WbSunny } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GoogleMapComponent from './GoogleMapComponent';
import { options } from './Tags';
import 'font-awesome/css/font-awesome.min.css';
import Cropper from 'react-easy-crop';
import {getCroppedImg} from './cropImage';

const activityTypes = [
  { label: "Listing", icon: <Star /> },
  { label: "Promotion", icon: <LocalActivity /> },
  { label: "Event", icon: <Event /> },
  { label: "Hangout", icon: <WbSunny /> },
  { label: "Tasks", icon: <SportsEsports /> }
];

const CreatePOI = ({ setIsLoading, authorship, group, setTokens, userId ,walletAddress,coordinates }) => {
  console.log(coordinates);
  const emptyForm ={
    title: '',
    description: '',
    imageFile: null,
    imageUrl: '',
    lat: coordinates.latitude,
    lng: coordinates.longitude,
    start: null,
    end: null,
    activity: 'Listing',
    tags: [],
    cta: '',
    communityid:''
  }
  
  const [formData, setFormData] = useState(emptyForm);
  const [validation, setValidation] = useState(false);
  useEffect(() => {
    // Check if all required fields are filled
    if (formData.title){
      setValidation(false);
    } else {
//      if(formData.description && formData.imageUrl && formData.activity &&){}
      setValidation(true);
    }
  }, [formData]);
  const handleSelect = (option) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      communityid: option // Only allow one item to be selected
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
      setCropDialogOpen(true);
      
    }
  };

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropDialogClose = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      //handleChange(croppedImage);
      //setCommunityLogo(croppedImage);
      //setImageUrl(URL.createObjectURL(croppedImage));

      setFormData(prevState => ({
        ...prevState,
        imageFile: croppedImage,
        imageUrl: URL.createObjectURL(croppedImage)
      }));

    } catch (e) {
      console.error(e);
    }
    setCropDialogOpen(false);
  };

  const InstagramIcon = () => {
    return <FontAwesomeIcon icon={faInstagram} />
  }
  const [topen, settOpen] = useState(false);
  const [locationSelected, setLocationSelected] = useState(true);
  const [openMap, setOpenMap] = useState(false);
  const [scheduleSet, setScheduleSet] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [initPref, setInitPref] = useState([]);
  const [uselink, setuselink] = useState(false);
  const [listCard, setListCard] = useState(false);
  const [openCTA, setOpenCTA] = useState(false);
  const [community, setCommunity] = useState(false);
  const [deleteImg, setDeleteImg] =useState(false);
  const containerRef = useRef(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);


  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'tags') {
      const {
        target: { options },
      } = event;
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
const getstep = () =>{
  if(formData.imageFile && formData.activity && formData.title && formData.description){ return "stage"+3; }
  if(formData.imageFile && formData.cta){ return "stage"+2; }
    if(formData.imageFile){ return "stage"+1; }
    console.log(formData);
  
}
const ctalabel = (activity)=>{
 if(activity == "Event"){
  return 'link to rsvp, ie luma, meetup, eventsbrite ...';
 }else if(activity == "Listing"){
  return 'link to restaurant/ venue/ bar information, booking details';
}else if(activity == "Promotion"){
  return 'link to claim TG vouchers';
}else if(activity == "Tasks"){
return 'link to your activity page';
}else if(activity == "Chilling"){
  return 'Your TG or group TG.'; 
 }else{
  return 'cta action link';
 }
}

  const handleSubmit = async(value) => {
   // event.preventDefault();
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

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      lat: location.lat.toFixed(6),
      lng: location.lng.toFixed(6)
    }));
    setLocationSelected(true);
    setOpenMap(false);
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
     // setInitPref(value);
      //settOpen(false);
    }
    console.log(formData);
  };
const handleIns = ()=>{
window.showAlert("Coming Soon");  
}

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
  data.append('start', formData.start || ''); // Handle null or undefined
  data.append('end', formData.end || ''); // Handle null or undefined
  data.append('activity', formData.activity || 'Listing');
  data.append('cta', formData.cta);
  // Convert array of tags to JSON or a string if necessary
  data.append('tags', JSON.stringify(formData.tags));
  data.append('authorid', userId);
  data.append('communityid', [value]);

  const auth = window.Telegram.WebApp.initData;
    try{
      setIsLoading(true);
    const response = await fetch(`https://api.showme.asia/postpoi`, {
      mode:'cors',
      method: 'POST',
      headers: {
        'Authorization': JSON.stringify(auth)
      },
      body: data
    });
    const output = await response.json();
    window.showAlert("<img src='dj-party.gif'/><br/>"+formData.title+" posted!");
    setTokens(output.tokens);
    setFormData(emptyForm);
    setInitPref([]);
    setIsLoading(false);
  }catch(err){
    console.log(err);
   // window.Telegram.WebApp.showAlert(`Claim error.`);
    
}
  


};

const handleScroll = (direction) => {
  if (containerRef.current) {
    const scrollAmount = direction === 'left' ? -200 : 200;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};
const handleuselink= ()=>{
  setuselink(!uselink);
}
  const handleClose = () => {};

  const handleDelete = (preferenceToDelete) => async () => {
    
    setInitPref((prevPreferences) => prevPreferences.filter((preference) => preference !== preferenceToDelete));
  };

  return (
    <Box className={`poiform `+getstep()} component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ overflowY:"auto", p: 2, maxWidth: 500, mx: 'auto' }}>
 <Typography sx={{ p: 2 }} variant="p">
  <br/><AddLocation/> <br/>Mark a Point of Interest</Typography>
      <Box className="imageupload" >
      {formData.imageUrl && 
      <div className="preview">
      <img onClick={()=>setDeleteImg(true)} src={formData.imageUrl} alt="Preview" />
      </div>}
 
    <p><IconButton color="primary" aria-label="upload picture" component="label">
    <input hidden accept="image/*" type="file" capture="environment" onChange={handleLogoChange} name="imageFile" />
    <PhotoCamera /></IconButton> <sup><br />Insert image</sup></p>
    
 
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
      {!uselink && (<IconButton color="primary" aria-label="upload picture" component="label">
          <input hidden accept="image/*" type="file" onChange={handleLogoChange} name="imageFile" />
          <CloudUpload />
        </IconButton>)}
        {!uselink && (<IconButton color="primary"  onClick={handleIns} aria-label="link to instagram and retrieve" component="label">
      
          <InstagramIcon />
        </IconButton>)}
        <IconButton color="primary"  onClick={handleuselink} aria-label="input url" component="label">
          <Link />
        </IconButton>
        {uselink && (<TextField fullWidth label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} variant="outlined" size="small" margin="dense" />) }
      </Box>
      </Box>
    
      <Box  className="form" >
      <TextField fullWidth variant='filled' label="Title" name="title" value={formData.title} onChange={handleChange}  size="small" margin="dense" />
      <TextField fullWidth variant='filled' label="Description" name="description" multiline rows={2} value={formData.description} onChange={handleChange}  size="small" margin="dense" />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip variant="outlined" label="Add Tags" onClick={settOpen} />
        {initPref.map((preference) => (
          <Chip sx={{ background: "var(--button-background)" }}
            key={preference}
            label={preference}
            onDelete={handleDelete(preference)}
          />
        ))}
      </Box>
    
      <Box className="additional" sx={{ display: 'flex', alignItems: 'center' }}>


      <Box
        ref={containerRef}
        sx={{ display: 'flex', gap: 1, flexGrow: 1 }}
      >
        <Button 
          variant="outlined"
          onClick={() => setOpenCTA(true)}
          size="small"
          className={formData.cta && "selected"}
          sx={{ flex: '0 0 auto', scrollSnapAlign: 'center' }}
        >
          <DirectionsRun />
        </Button>
        <Button className={locationSelected && "selected" }
          variant="outlined"
          onClick={() => setOpenMap(true)}
          size="small"
          sx={{ flex: '0 0 auto', scrollSnapAlign: 'center' }}
        >
          <Map />
        </Button>
       
        <Button 
          variant="outlined"
          onClick={toggleScheduleDialog}
          size="small"
          className={scheduleSet && "selected"}
          sx={{ flex: '0 0 auto', scrollSnapAlign: 'center' }}
        >
          <Schedule /> 
        </Button>
        
      </Box>
    </Box>
          </Box>
      <Button  onClick={() => setCommunity(true)} className="submit" variant="contained" color="primary" disabled={validation} fullWidth sx={{ padding: "15px", margin: "6px 0" }}>Post {formData.communityid && `to ${group[formData.communityid]}`}</Button>
      
      <Dialog open={openCTA} onClose={() => setOpenCTA(false)} fullWidth maxWidth="md">
    <Box className="action"  sx={{padding:"16px"}}>
        <Grid container spacing={1.3} alignItems="center" sx={{margin:0}}>

       
       
        <FormControl component="fieldset" >
          <RadioGroup
            aria-label="activity"
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            row
          >
            <Box sx={{ display: 'flex', overflowX: 'auto' , paddingTop:"6px" }}>
              {activityTypes.map(({ label, icon }) => (
                <FormControlLabel
                  key={label}
                  value={label}
                  control={<Radio icon={icon} checkedIcon={icon} />}
                  label={<Box sx={{ display: 'block', textAlign: 'center', fontSize: '0.6rem' }}>{label}</Box>}
                  labelPlacement="bottom"
                />
              ))}
            </Box>
          </RadioGroup>
        </FormControl>
        {formData.activity && (
          <TextField
            fullWidth
            label={ctalabel(formData.activity)}
            name="cta"
            value={formData.cta}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="dense"
          />
        )}
        </Grid>
        
      </Box>

    </Dialog>
      <Dialog open={openMap} onClose={() => setOpenMap(false)} fullWidth maxWidth="md">
        <GoogleMapComponent lat={parseFloat(formData.lat)} lng={parseFloat(formData.lng)} onLocationSelect={handleLocationSelect} onClose={handleClose} />
      </Dialog>
      <Dialog open={openSchedule} onClose={toggleScheduleDialog} fullWidth maxWidth="sm">
        <Typography sx={{ p: 2 }} variant="h6">Set Schedule / Operating hours/ Validity</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ px: 2, pb: 3 }}>
            <DateTimePicker label="Start Date/Time" value={formData.start} onChange={(newValue) => handleDateChange(newValue, 'start')}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
            <div style={{padding:10}}></div>
            <DateTimePicker label="End Date/Time"  c value={formData.end} onChange={(newValue) => handleDateChange(newValue, 'end')}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </Box>
        </LocalizationProvider>
        <Button variant="outlined" onClick={toggleScheduleDialog} color="primary" sx={{ mb: 2, margin: 2 }}>Save Schedule</Button>
        <Button
          variant="outlined"
          onClick={clearSchedule}
          fullWidth
          size="small"
          startIcon={<Cancel sx={{ color: "red" }} />}
          style={{"border":"0"}}>
          
          Remove Schedule
        </Button>
      </Dialog>
      <Dialog open={community}  onClose={() => setCommunity(false)} fullWidth maxWidth="sm">
      <Typography sx={{ p: 2 }} variant="h6">Where will this be listed on?</Typography>
<MenuList>
      {Object.entries(authorship).map(([key,value]) => (
        <MenuItem key={value} value={value} 
        onClick={() => { setCommunity(false); handleSubmit(value); }}>
        <ListItemText primary={group[value]} />
      </MenuItem>
      ))}
    </MenuList>

      </Dialog>
      <Dialog open={deleteImg}  onClose={() => setDeleteImg(false)} fullWidth maxWidth="sm">
        
        <Button onClick={() =>{ setDeleteImg(false); formData.imageFile =''; formData.imageUrl =''; }}>Remove Image</Button>
      </Dialog>
      <Dialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        aria-labelledby="crop-dialog-title"
      >
        <DialogTitle id="crop-dialog-title">Crop Image</DialogTitle>
        <DialogContent sx={{padding:0}}>
          <div style={{ position: 'relative', width: 300, height: 300 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1.3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCropDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Select
        sx={{ border: '1px solid #FFF', visibility: "hidden" }}
        labelId="preferences-label"
        id="preferences-select"
        multiple
        open={topen}
        value={initPref}
        onChange={handleTagChange}
        onClose={()=>{settOpen(false)}}
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
  );
};

export default CreatePOI;
