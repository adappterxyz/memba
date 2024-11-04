import React, { useState } from 'react';
import { Button, MenuItem, FormControl, InputLabel, Select, Checkbox, ListItemText, ListSubheader, Chip, Box } from '@mui/material';
import {ajax, tracker } from '../common';
import {options} from './Tags';

const Preferences = ({setIsFiltered,initPref,setInitPref}) => {
 // const [selectedPreferences, setSelectedPreferences] = useState(initPref);

const updatePref= async (event) => {
  await ajax('updatepreferences',{"pref":initPref});
  setIsFiltered(true);
}
const clearPref = async() =>{
  setInitPref([]);
  await ajax('updatepreferences',{"pref":[]});
  setIsFiltered(true);
}
  const handleChange = (event) => {
    const value = event.target.value;
      //setSelectedPreferences(value);
      setInitPref(value);
  };

  const handleDelete = (preferenceToDelete) => async () => {
    // Calculate the new preferences
    const updatedPreferences = initPref.filter((preference) => preference !== preferenceToDelete);
    
    // Update the state
    setInitPref(updatedPreferences);
    
    // Send the updated preferences to the server
    await ajax('updatepreferences', { "pref": updatedPreferences });
    setIsFiltered(true);
  };
  

  return (
    <div>

      <FormControl sx={{ m: 1, width: 300}}>
      
        <Select
          sx={{ border: '1px solid #FFF', margin : "16px" }}
          labelId="preferences-label"
          id="preferences-select"
          multiple
          value={initPref}
          onChange={handleChange}
          onClose={updatePref}
          renderValue={(selected) => null}
        >
          {Object.keys(options).flatMap((category) => [
            <ListSubheader key={category}>{category}</ListSubheader>,
            ...options[category].map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox sx={{
                    '& .MuiSvgIcon-root': {
                      border: '1px solid #ccc', // Change this color to whatever you prefer
                      borderRadius: '4px', // Optional: adds a rounded border
                    }
                  }} checked={initPref.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {initPref.map((preference) => (
          <Chip sx={{background:"var(--button-background)"}}
            key={preference}
            label={preference}
            onDelete={handleDelete(preference)}
          />
        ))}
      </Box>
      <Button onClick={clearPref}>Clear Filters</Button>

    </div>
  );
};

export default Preferences;
