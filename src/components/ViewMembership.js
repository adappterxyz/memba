import React, { useState, useEffect, useCallback } from 'react';
import {
  IconButton, MenuItem, FormLabel, RadioGroup, Radio, FormControlLabel, FormControl, Checkbox, ListItemText,
  Box, MenuList, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ExploreIcon from '@mui/icons-material/TravelExplore';
import { PhotoCamera, CloudUpload, Link } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import {ajax, tracker } from '../common';
import Cropper from 'react-easy-crop';
import {getCroppedImg} from './cropImage'; // Import a utility function to handle image cropping

const ViewMembership = ({
  setIsLoading, setAuthorship, authorship, setTokens, setGroup, group, setMembershipaccess, membershipaccess, membership, setMembership
}) => {
  const [selectedPreferences, setSelectedPreferences] = useState(membership);
  const [options, setOptions] = useState(membershipaccess); 
  const [open, setOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [communityPrivacy, setCommunityPrivacy] = useState(false);
  const [canMembersPublish, setCanMembersPublish] = useState(false);
  const [communityLogo, setCommunityLogo] = useState(null);
  const [deleteImg, setDeleteImg] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uselink, setUseLink] = useState(false);

  // State for cropping
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    setSelectedPreferences(membership);
  }, [membership]);
/**
  useEffect(() => {
    const auth = window.Telegram.WebApp.initData;
    fetch('https://api.showme.asia/updatemembership', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Authorization': JSON.stringify(auth),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ preferences: selectedPreferences, membershipaccess })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Membership updated:', data);
      setMembership(selectedPreferences);
    })
    .catch(error => console.error('Failed to update membership:', error));

    // Optional: Log current state
    console.log('Current Preferences:', selectedPreferences);
  }, [selectedPreferences]);
 */
  const handleSelect = async(option) => {
    let inter;
    setSelectedPreferences((prevPreferences) => {
      if (prevPreferences.includes(option)) {
        inter = prevPreferences.filter((preference) => preference !== option);
      } else {
        inter = [...prevPreferences, option];
      }
      return inter;
    });
    await ajax('updatemembership',{ preferences: inter, membershipaccess });
    setMembership(inter);   
  };

  const handleDelete = (preferenceToDelete) => () => {
    
    setSelectedPreferences((prevPreferences) => prevPreferences.filter((preference) => preference !== preferenceToDelete));
  };

  const handleDiscover = () => {
    window.Telegram.WebApp.openTelegramLink("https://communities.showme.asia/discover");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    if (newCommunity && !options.includes(newCommunity)) {
      const { udata } = await import('../local');
      const formData = new FormData();
      formData.append('newCommunity', newCommunity);
      formData.append('newCommunityDescription', newCommunityDescription);
      formData.append('communityPrivacy', communityPrivacy);
      formData.append('canMembersPublish', canMembersPublish);
      formData.append('user', udata.user.id);
      if (communityLogo) {
        formData.append('communityLogo', communityLogo);
      }

      const auth = window.Telegram.WebApp.initData;
      setIsLoading(true);
      try {
        const response = await fetch('https://api.showme.asia/createcommunity', {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Authorization': JSON.stringify(auth)
          },
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          setTokens(data.tokens);
          setOptions((prevOptions) => [...prevOptions, data.id]);
          group[data.id] = newCommunity;
          setGroup(group);
          setAuthorship((prevOptions) => [...prevOptions, data.id]);
          setSelectedPreferences((prevOptions) => [...prevOptions, data.id]);
          setMembershipaccess((prevOptions) => [...prevOptions, data.id]);
          setNewCommunity('');
          setNewCommunityDescription('');
          setCommunityLogo(null);
          setOpen(false);
          setIsLoading(false);
          setImageUrl("");
          window.showAlert(`<div><img src='pepebounce.gif'/><br/>${newCommunity} created successfully!</div>`);
        } else {
          window.Telegram.WebApp.showAlert(`${data.error}`);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        window.Telegram.WebApp.showAlert(`Creation error.`);
      }
    }
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
      setCommunityLogo(croppedImage);
      setImageUrl(URL.createObjectURL(croppedImage));
    } catch (e) {
      console.error(e);
    }
    setCropDialogOpen(false);
  };

  const handleuselink = () => {
    setUseLink(!uselink);
  };

  const handleIns = () => {
    // Implement Instagram integration logic here
  };

  return (
    <div>
      <Typography variant="body2"> Display cards from your communities</Typography>
      <FormControl sx={{ m: 1, width: '100%', padding: "10px 0", height: 'calc(100vh - 350px)', overflow: 'auto' }}>
        <MenuList>
          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
              onClick={() => handleSelect(option)}
            >
              <Checkbox
                checked={selectedPreferences.includes(option)}
                sx={{
                  '& .MuiSvgIcon-root': {
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  },
                }}
              />
              <ListItemText primary={group[option]} />
            </MenuItem>
          ))}
          {() => { JSON.stringify(group); }}
        </MenuList>
      </FormControl>
      <Button variant="outlined" onClick={handleDiscover} sx={{ ml: 1 }}>
        <ExploreIcon /> Discover
      </Button>
      <Button variant="outlined" onClick={handleOpen} sx={{ ml: 1 }}>
        <GroupIcon /> Create 
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Community</DialogTitle>
        <DialogContent>
        <Box className="imageupload">
            {imageUrl && 
            <div className="preview">
              <img onClick={() => setDeleteImg(true)} src={imageUrl} alt="Preview" />
            </div>}
            <p>
              <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" capture="environment" onChange={handleLogoChange} name="imageFile" />
                <PhotoCamera />
              </IconButton>
              <sup><br />Insert image</sup>
            </p>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1 }}>
              {!uselink && (
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <input hidden accept="image/*" type="file" onChange={handleLogoChange} name="imageFile" />
                  <CloudUpload />
                </IconButton>
              )}
              {!uselink && (
                <IconButton color="primary" onClick={handleIns} aria-label="link to instagram and retrieve" component="label">
                  <FontAwesomeIcon icon={faInstagram} />
                </IconButton>
              )}
              <IconButton color="primary" onClick={handleuselink} aria-label="input url" component="label">
                <Link />
              </IconButton>
              {uselink && (
                <TextField fullWidth label="Image URL" name="imageUrl" value={imageUrl} onChange={handleLogoChange} variant="outlined" size="small" margin="dense" />
              )}
            </Box>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Community Name"
            type="text"
            fullWidth
            variant="filled"
            value={newCommunity}
            onChange={(e) => setNewCommunity(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            
           
            multiline
            rows={2}
            value={newCommunityDescription}
            onChange={(e) => setNewCommunityDescription(e.target.value)}
             variant="filled"
            size="small"
            margin="dense"
          />
          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend"><sub>Is this a private group?</sub></FormLabel>
            <RadioGroup
              aria-label="privacy"
              name="privacy"
              value={communityPrivacy}
              onChange={(e) => setCommunityPrivacy(e.target.value)}
            >
              <FormControlLabel value="0" control={<Radio />} label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <img src={`pepebounce.gif`} style={{ height: "58px" }} />
                    <br /><sup>No. All are welcome.</sup>
                  </div>
                </div>
              } />
              <FormControlLabel value="1" control={<Radio />} label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <img src={`pepenohugs.gif`} style={{ height: "38px" }} />
                    <br /><sup>Yes. Only by invitation.</sup>
                  </div>
                </div>
              } />
            </RadioGroup>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={canMembersPublish}
                onChange={(e) => setCanMembersPublish(e.target.checked)}
                name="canMembersPublish"
              />
            }
            label={<sub>Allow all members to publish</sub>}
          />
      <Dialog open={deleteImg}  onClose={() => setDeleteImg(false)} fullWidth maxWidth="sm">
        
        <Button onClick={() =>{ setDeleteImg(false); setCommunityLogo(null); setImageUrl(''); }}>Remove Image</Button>
      </Dialog>
      </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
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
    </div>
  );
};

export default ViewMembership;
