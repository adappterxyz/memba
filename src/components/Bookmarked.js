import React, { useState } from 'react';
import { Box, Typography, IconButton, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ajax } from '../common';

const Bookmarked = ({ setbookmarkinfo, bookmarkinfo, bookmarks, setBookmarks }) => {
  const [open, setOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  const handleOpenDialog = (bookmark) => {
    setSelectedBookmark(bookmark);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedBookmark(null);
  };

  const handleDelete = (bookmarkToDelete) => () => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark !== bookmarkToDelete);
    setBookmarks(updatedBookmarks);
    ajax('addbookmarks', { bookmarks: updatedBookmarks });
  };

  const getImageDetails = (id) => {
    return bookmarkinfo.find(image => image.id === parseInt(id));
  };

  return (
    <Box sx={{ p: 2, maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
      {bookmarks.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {bookmarks.map((bookmark, index) => {
            const imageDetails = getImageDetails(bookmark);
            if (!imageDetails) return null;

            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  backgroundColor: '#f9f9f9'
                }}
                onClick={() => handleOpenDialog(imageDetails)}
              >
                <Avatar
                  src={imageDetails.image}
                  alt={imageDetails.title}
                  sx={{ width: 40, height: 40 }}
                />
                <Typography  variant="body2">
                  {imageDetails.title}
                </Typography>
                <IconButton onClick={handleDelete(bookmark)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography variant="body1">No bookmarks added yet.</Typography>
      )}

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{selectedBookmark?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={selectedBookmark?.image}
              alt={selectedBookmark?.title}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="body2">{selectedBookmark?.description}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              window.open(selectedBookmark?.cta, '_blank');
              handleCloseDialog();
            }}
            color="primary"
            variant="contained"
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookmarked;
