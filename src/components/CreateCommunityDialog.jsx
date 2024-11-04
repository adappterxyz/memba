import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography,
  FormControlLabel, Switch, FormControl, RadioGroup, Radio, FormLabel
} from '@mui/material';
import UploadImage from './UploadImage'; // Import the new UploadImage component
import modalStyles from './ModalStyles';

const CreateCommunityDialog = ({
  open,
  onClose,
  onCreate,
  communityLogo,
  setCommunityLogo,
  imageUrl,
  setImageUrl,
  isOnchainGated,
  setIsOnchainGated,
  newCommunity,
  setNewCommunity,
  newCommunityDescription,
  setNewCommunityDescription,
  communityPrivacy,
  setCommunityPrivacy,
  canMembersPublish,
  setCanMembersPublish,
  chain,
  setChain,
  server,
  setServer,
  isNFT,
  setIsNFT,
  contractAddress,
  setContractAddress,
  threshold,
  setThreshold,
  fadeClass
}) => {
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth fullScreen className={fadeClass}
    sx={{ '& .MuiPaper-root': isOnchainGated ? { ...modalStyles.dialogPaper, 
    background: 'linear-gradient(135deg, #8e69bf, #562399 , #333)' } : modalStyles.dialogPaper }}>
      <DialogTitle sx={{ background: 'transparent', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
        Create New Community
      </DialogTitle>
      <DialogContent sx={{ background: 'transparent', color: '#fff', paddingBottom: 4 }}>
     
        <UploadImage
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          setCommunityLogo={setCommunityLogo}
        />
  <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Community Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newCommunity}
          onChange={(e) => setNewCommunity(e.target.value)}
          sx={modalStyles.textField}
          InputLabelProps={modalStyles.labelProps}
          InputProps={modalStyles.labelProps}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isOnchainGated}
              onChange={(e) => setIsOnchainGated(e.target.checked)}
              name="isOnchainGated"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#FF5722',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#FF5722',
                },
              }}
            />
          }
          label={<Typography sx={{ color: '#fff' }}>Onchain Gated?</Typography>}
          sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
        />
        {isOnchainGated ? (
          <>
            <TextField
              fullWidth
              label="Chain"
              name="chain"
              value={chain}
              onChange={(e) => setChain(e.target.value)}
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
            <TextField
              fullWidth
              label="Server"
              name="server"
              value={server}
              onChange={(e) => setServer(e.target.value)}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
              <Typography sx={{ color: '#fff', mr: 1 }}>Token</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isNFT}
                    onChange={(e) => setIsNFT(e.target.checked)}
                    name="isNFT"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#1a73e8',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#1a73e8',
                      },
                    }}
                  />
                }
                label={<Typography sx={{ color: '#fff' }}>NFT</Typography>}
                sx={{ background: 'transparent' }}
              />
              {!isNFT && (
                <TextField
                  fullWidth
                  label="Threshold"
                  name="threshold"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
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
            </Box>
            <TextField
              fullWidth
              label="Contract Address"
              name="contractAddress"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
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
          </>
        ) : (
          <FormControl component="fieldset" margin="dense" sx={{ textAlign: 'center', mt: 2, color: '#fff' }}>
            <FormLabel component="legend">
              <Typography sx={{ color: '#fff' }}>Is this a private group?</Typography>
            </FormLabel>
            <RadioGroup
              aria-label="privacy"
              name="privacy"
              value={communityPrivacy}
              onChange={(e) => setCommunityPrivacy(e.target.value)}
              row
              sx={{ justifyContent: 'center' }}
            >
              <FormControlLabel
                value="0"
                control={<Radio sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' } }} />}
                label={<Typography sx={{ color: '#fff' }}>No. All are welcome.</Typography>}
              />
              <FormControlLabel
                value="1"
                control={<Radio sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' } }} />}
                label={<Typography sx={{ color: '#fff' }}>Yes. Only by invitation.</Typography>}
              />
            </RadioGroup>
          </FormControl>
        )}
        <TextField
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={2}
          value={newCommunityDescription}
          onChange={(e) => setNewCommunityDescription(e.target.value)}
          variant="outlined"
          size="small"
          margin="dense"
          sx={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: 1, mt: 2 }}
          InputLabelProps={{
            style: { color: '#fff' },
          }}
          InputProps={{
            style: { color: '#fff' },
          }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={canMembersPublish}
              onChange={(e) => setCanMembersPublish(e.target.checked)}
              name="canMembersPublish"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#1a73e8',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#1a73e8',
                },
              }}
            />
          }
          label={<Typography sx={{ color: '#fff' }}>Allow all members to publish</Typography>}
          sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ background: 'transparent', justifyContent: 'center', paddingBottom: 2 }}>
        <Button onClick={onClose} color="primary" variant="outlined" sx={{ color: '#fff', borderColor: '#fff', mr: 2 }}>
          Cancel
        </Button>
        <Button onClick={onCreate} color="primary" variant="contained" sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCommunityDialog;
