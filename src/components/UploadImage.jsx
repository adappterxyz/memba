import React, { useState, useCallback } from 'react';
import { IconButton, TextField, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { PhotoCamera, Link, Delete } from '@mui/icons-material'; // Add Delete icon for removal
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImage'; // Ensure this utility function is correctly imported

const UploadImage = ({ imageUrl, setImageUrl, setCommunityLogo }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [uselink, setUseLink] = useState(false);
  const [hover, setHover] = useState(false); // State to manage hover

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

  const handleImageRemove = () => {
    setImageUrl(null);
    setCommunityLogo(null);
  };

  return (
    <Box className="imageupload" sx={{ 
      textAlign: 'center',
      maxHeight: '450px',
      maxWidth: '600px',
      margin: "0 auto",
      marginBottom: 2,
      position: 'relative',
      width: '100%',
      height: 'auto',
      aspectRatio: '4 / 3', // Ensures a 4:3 aspect ratio
      borderRadius: 2,
      overflow: 'hidden',
      backgroundColor: 'rgba(255,255,255,0.5)',
      display: 'block',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {imageUrl ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            cursor: 'pointer',
            position: 'absolute', // Cover the entire imageupload box
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleImageRemove}
        >
          {hover && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                paddingTop:"30%",
                alignItems: 'center',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: 2,
              }}
            >
              <Delete fontSize="large" />
            </Box>
          )}
        </Box>
      ) : (
        <>
          <Typography sx={{ color: '#000', width:'100%', display:'block' }}>No image selected</Typography>
          <br/><Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <IconButton color="primary" aria-label="upload picture" component="label">
              <input hidden accept="image/*" type="file" onChange={handleLogoChange} />
              <PhotoCamera />
            </IconButton>
            <IconButton color="primary" onClick={handleIns} aria-label="link to instagram and retrieve" component="label">
              <FontAwesomeIcon icon={faInstagram} />
            </IconButton>
            <IconButton color="primary" onClick={handleuselink} aria-label="input url" component="label">
              <Link />
            </IconButton>
          </Box>
        </>
      )}
      {uselink && !imageUrl && (
        <TextField
          fullWidth
          label="Image URL"
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          variant="outlined"
          size="small"
          margin="dense"
          sx={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: 1 }}
          InputLabelProps={{
            style: { color: '#fff' },
          }}
          InputProps={{
            style: { color: '#fff' },
          }}
        />
      )}

      <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} aria-labelledby="crop-dialog-title">
        <DialogTitle id="crop-dialog-title" sx={{ background: 'transparent', color: '#000' }}>Crop Image</DialogTitle>
        <DialogContent sx={{ padding: 0, background: 'transparent' }}>
          <div style={{ position: 'relative', width: 400, height: 300 }}> {/* 4:3 aspect ratio */}
            <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={4 / 3} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={handleCropComplete} />
          </div>
        </DialogContent>
        <DialogActions sx={{ background: 'transparent' }}>
          <Button onClick={() => setCropDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCropDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UploadImage;
