import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, ListItemIcon, Tabs, Tab, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Leaderboard = ({ open, onClose }) => {
  const [dailyLeaderboard, setDailyLeaderboard] = useState([]);
  const [totalLeaderboard, setTotalLeaderboard] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const dailyResponse = await fetch('/api/leaderboard/daily');
        const dailyData = await dailyResponse.json();
        setDailyLeaderboard(dailyData.leaders);

        const totalResponse = await fetch('/api/leaderboard/total');
        const totalData = await totalResponse.json();
        setTotalLeaderboard(totalData.leaders);
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
      }
    };

    if (open) {
      fetchLeaderboardData();
    }
  }, [open]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderLeaderboard = (leaders) => (
    <List sx={{ width: '100%' }}>
      {leaders.map((leader, index) => (
        <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, backgroundColor: '#e8f4f8', borderRadius: '8px', padding: '12px' }}>
          <Typography variant="body1" fontWeight="bold">{index + 1}. {leader.username}</Typography>
          <Typography variant="body1" fontWeight="bold" sx={{ color: '#1a73e8' }}>{leader.points} Points</Typography>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiPaper-root': {
          background: 'linear-gradient(135deg, #E0F7FA 30%, #81D4FA 90%)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Leaderboard</DialogTitle>
      <DialogContent>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Daily Points" />
          <Tab label="Total Points" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {selectedTab === 0 ? renderLeaderboard(dailyLeaderboard) : renderLeaderboard(totalLeaderboard)}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ReferralList = ({ open, onClose, referrals }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    sx={{
      '& .MuiPaper-root': {
        background: 'linear-gradient(135deg, #E0F7FA 30%, #81D4FA 90%)',
      },
    }}
  >
    <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Your Referrals</DialogTitle>
    <DialogContent>
      <List sx={{ width: '100%' }}>
        {referrals.map((referral, index) => (
          <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, backgroundColor: '#e8f4f8', borderRadius: '8px', padding: '12px' }}>
            <Typography variant="body1" fontWeight="bold">{index + 1}. {referral.username}</Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ color: '#1a73e8' }}>{referral.date}</Typography>
          </ListItem>
        ))}
      </List>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
      <Button onClick={onClose} color="primary" variant="outlined">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

const Tasks = ({ open, onClose, userId }) => {
  const [referralCount, setReferralCount] = useState(0);
  const [referrals, setReferrals] = useState([]);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [referralListOpen, setReferralListOpen] = useState(false);

  useEffect(() => {
    const fetchReferralCount = async () => {
      try {
        const response = await fetch(`/api/referrals/${userId}`);
        const data = await response.json();
        setReferralCount(data.count);
        setReferrals(data.referrals);
      } catch (error) {
        console.error('Failed to fetch referral count:', error);
      }
    };

    fetchReferralCount();
  }, [userId]);

  const handleCopyReferralLink = () => {
    const referralLink = `https://telegram.me/showmeasia_bot?start=${userId}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        alert('Referral link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy referral link: ', err);
      });
  };

  return (
    <Box sx={{ background: 'linear-gradient(0deg, #E0F7FA 30%, #81D4FA 90%)', minHeight: '100vh', padding: '16px' }}>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            background: '#000',
          },
        }}
      >
        <DialogContent sx={{ padding: '16px', backgroundColor: 'transparent', borderRadius: '8px' }}>
         
          <Typography variant="body1" gutterBottom align="center" sx={{ color: "#fff", marginBottom: '24px' }}>
            Complete the following tasks to earn points:
          </Typography>
         
          <List sx={{ width: '100%' }}>
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, backgroundColor: '#e8f4f8', borderRadius: '8px', padding: '12px' }}>
              <ListItemIcon>
                <CalendarTodayIcon color="primary" sx={{ fontSize: '36px' }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body1" fontWeight="bold">Daily Visit</Typography>}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => alert('Daily visit recorded!')}
                sx={{ minWidth: '120px', height: '50px', ml: 2, fontSize: '16px' }}
              >
                100 pts
              </Button>
            </ListItem>
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, backgroundColor: '#e8f4f8', borderRadius: '8px', padding: '12px' }}>
              <ListItemIcon>
                <TwitterIcon color="primary" sx={{ fontSize: '36px' }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body1" fontWeight="bold">Follow ShowMeAsia Twitter</Typography>}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => window.open('https://twitter.com/showmeasia', '_blank')}
                sx={{ minWidth: '120px', height: '50px', ml: 2, fontSize: '16px' }}
              >
                250 pts
              </Button>
            </ListItem>
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, backgroundColor: '#e8f4f8', borderRadius: '8px', padding: '12px' }}>
              <ListItemIcon>
                <TelegramIcon color="primary" sx={{ fontSize: '36px' }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body1" fontWeight="bold">Join Telegram Community</Typography>}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => window.open('https://t.me/showmecom', '_blank')}
                sx={{ minWidth: '120px', height: '50px', ml: 2, fontSize: '16px' }}
              >
                250 pts
              </Button>
            </ListItem>
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, backgroundColor: '#e8f4f8', borderRadius: '8px', padding: '12px' }}>
              <ListItemIcon>
                <PersonAddIcon color="primary" sx={{ fontSize: '36px' }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body1" fontWeight="bold">Refer a User</Typography>}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCopyReferralLink}
                sx={{ minWidth: '120px', height: '50px', ml: 2, fontSize: '16px' }}
              >
                500 pts
              </Button>
            </ListItem>
            <ListItem 
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, backgroundColor: '#e8f4f8', borderRadius: '8px', padding: '12px', cursor: 'pointer' }} 
              onClick={() => setReferralListOpen(true)}
            >
              <ListItemText
                primary={<Typography variant="body1" fontWeight="bold">Your Successful Referrals</Typography>}
              />
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#1a73e8', minWidth: '50px', textAlign: 'center' }}>
                {referralCount}
              </Typography>
            </ListItem>
            <ListItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, backgroundColor: '#e8f4f8', borderRadius: '8px', padding: '12px' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setLeaderboardOpen(true)}
                sx={{ minWidth: '200px', height: '50px', fontSize: '16px' }}
              >
                View Leaderboard
              </Button>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, backgroundColor: 'transparent' }}>
          <Button onClick={onClose} color="primary" variant="outlined" sx={{color:"#FFF"}}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Leaderboard open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
      <ReferralList open={referralListOpen} onClose={() => setReferralListOpen(false)} referrals={referrals} />
    </Box>
  );
};

export default Tasks;
