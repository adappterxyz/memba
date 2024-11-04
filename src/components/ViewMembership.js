import React, { useState, useEffect } from 'react';
import { Switch, MenuItem, Box, MenuList, Typography, Button, FormControl } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { ajax } from '../common';
import CreateCommunityDialog from './CreateCommunityDialog'; // Import the new component

const ViewMembership = ({ setIsFiltered, setIsLoading, setAuthorship, authorship, setTokens, setGroup, group, setMembershipaccess, membershipaccess, membership, setMembership }) => {
  const [selectedPreferences, setSelectedPreferences] = useState(membership);
  const [options, setOptions] = useState(membershipaccess);
  const [open, setOpen] = useState(false);
  const [communityLogo, setCommunityLogo] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isOnchainGated, setIsOnchainGated] = useState(false);
  const [newCommunity, setNewCommunity] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [communityPrivacy, setCommunityPrivacy] = useState("0");
  const [canMembersPublish, setCanMembersPublish] = useState(false);
  const [chain, setChain] = useState('');
  const [server, setServer] = useState('');
  const [isNFT, setIsNFT] = useState(true);
  const [contractAddress, setContractAddress] = useState('');
  const [threshold, setThreshold] = useState('');

  const [fadeClass, setFadeClass] = useState('');
  useEffect(() => {
    setSelectedPreferences(membership);
  }, [membership]);

  const handleSelect = async (option) => {
    let updatedPreferences;
    setSelectedPreferences((prevPreferences) => {
      if (prevPreferences.includes(option)) {
        updatedPreferences = prevPreferences.filter((preference) => preference !== option);
      } else {
        updatedPreferences = [...prevPreferences, option];
      }
      return updatedPreferences;
    });

    await ajax('updatemembership', { preferences: updatedPreferences, membershipaccess });
    setMembership(updatedPreferences);
    setIsFiltered(true);
  };

 

  const handleOpen = () => {
    setOpen(true);
    setFadeClass('fade-enter'); // Set fade-in class

  };

  const handleClose = () => {
    setFadeClass('fade-exit'); // Set fade-out class
    setTimeout(() => {
      setOpen(false); // Close dialog after animation
      setFadeClass(''); // Reset class
    }, 300); // Match duration of CSS transition
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
      formData.append('isOnchainGated', isOnchainGated);
      if (isOnchainGated) {
        formData.append('chain', chain);
        formData.append('server', server);
        formData.append('isNFT', isNFT);
        if (!isNFT) {
          formData.append('threshold', threshold);
        }
        formData.append('contractAddress', contractAddress);
      }
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
        window.Telegram.WebApp.showAlert('Creation error.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <Typography variant="body2">Display cards from your communities</Typography>
      <FormControl sx={{ m: 1, width: '100%', padding: "10px 0", height: 'calc(100vh - 350px)', overflow: 'auto' }}>
        <MenuList>
          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
              onClick={() => handleSelect(option)}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography>{group[option]}</Typography>
              <Switch
                checked={selectedPreferences.includes(option)}
                onChange={() => handleSelect(option)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#1a73e8',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#1a73e8',
                  },
                }}
              />
            </MenuItem>
          ))}
        </MenuList>
      </FormControl>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          width: '100%',
          py: 2,
          borderRadius: 0,
          fontSize: '1rem',
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: '#1a73e8',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1765cc',
          },
        }}
      >
        <GroupIcon sx={{ mr: 1 }} />
        Create Community
      </Button>
      
      <CreateCommunityDialog
        open={open}
        fadeClass={fadeClass}
        onClose={handleClose}
        onCreate={handleCreate}
        communityLogo={communityLogo}
        setCommunityLogo={setCommunityLogo}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        isOnchainGated={isOnchainGated}
        setIsOnchainGated={setIsOnchainGated}
        newCommunity={newCommunity}
        setNewCommunity={setNewCommunity}
        newCommunityDescription={newCommunityDescription}
        setNewCommunityDescription={setNewCommunityDescription}
        communityPrivacy={communityPrivacy}
        setCommunityPrivacy={setCommunityPrivacy}
        canMembersPublish={canMembersPublish}
        setCanMembersPublish={setCanMembersPublish}
        chain={chain}
        setChain={setChain}
        server={server}
        setServer={setServer}
        isNFT={isNFT}
        setIsNFT={setIsNFT}
        contractAddress={contractAddress}
        setContractAddress={setContractAddress}
        threshold={threshold}
        setThreshold={setThreshold}
      />
    </div>
  );
};

export default ViewMembership;
