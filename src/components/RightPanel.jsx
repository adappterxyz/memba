import React, { useState, useEffect } from 'react';
import { Drawer, Button, Tabs, Tab, useTheme, useMediaQuery, Typography, Box, Divider } from '@mui/material';
import { useTonAddress , TonConnectButton } from '@tonconnect/ui-react';
import { Clear, Lock } from '@mui/icons-material';
import CreatePOI from './CreatePOI';
import CreateCommunity from './CreateCommunity';
import ViewMembership from './ViewMembership';
import Preferences from './Preferences';
import Bookmarked from './Bookmarked';

import LocationOnIcon from '@mui/icons-material/AddLocation';
import GroupIcon from '@mui/icons-material/Group';
import MembershipIcon from '@mui/icons-material/VerifiedUser';
import SettingsIcon from '@mui/icons-material/Checklist';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const tabs = [
  { label: "Filter", key: "Preferences", icon: <SettingsIcon />, component: <Preferences /> },
  { label: "Bookmark",   key: "Bookmarked", icon: <BookmarkIcon />, component: <Bookmarked /> },
  {  label: "Communities",  key: "ViewMembership", icon: <GroupIcon />, component: <ViewMembership /> },
 // {  key: "CreatePOI", icon: <LocationOnIcon />, component: <CreatePOI /> },
 
];

   
const RightPanel = ({page,setPage,fetchImages,loadInitialImages,effectiveResults,setEffectiveResults,scrollDistance,setScrollDistance,setIsLoading,setAuthorship,authorship,setGroup,setMembershipaccess,setTokens, userId, coordinates, setbookmarkinfo, group, bookmarkinfo, membershipaccess, panelIsVisible, setPanelIsVisible, username , tokens ,initPref,setInitPref, setBookmarks, bookmarks, setMembership, membership}) => {
 
  const [activeTab, setActiveTab] = useState('Preferences');
  const theme = useTheme();
  const [value,setValue]= useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const [walletAddress, setWalletAddress] = useState({ userFriendly: '', raw: '' });
  const [toggleCreator, setToggleCreator] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isFiltered, setIsFiltered] = useState(true);

  useEffect(() => {
    if (userFriendlyAddress && rawAddress) {
      setWalletAddress({ userFriendly: userFriendlyAddress, raw: rawAddress });
    }
  }, [userFriendlyAddress, rawAddress]);



  const GetWalletAddress = () => {
    console.log("Address:", walletAddress.userFriendly, walletAddress.raw);
  };

  const claim = async () => {
    if (isClaiming) return; // Prevent duplicate claims

  setIsClaiming(true);

    if (walletAddress.userFriendly == "" || walletAddress.userFriendly == null ) {
         window.Telegram.WebApp.showAlert(`Connect TON wallet before claiming.`);
         setIsClaiming(false);
    }else{
      setIsLoading(true);
      const claimedTokens = parseInt(scrollDistance*10);
      const auth = window.Telegram.WebApp.initData;
      try{
      const response = await fetch(`https://api.showme.asia/claim`, {
        mode:'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': JSON.stringify(auth)
        },
        body: JSON.stringify({ id:userId , tokens : claimedTokens, address: walletAddress.userFriendly  })
      });
      const data = await response.json();
      
      loadInitialImages();

      const intervalId = setInterval(() => {
        
        setScrollDistance((prevDistance) => {
          const newDistance = Math.max(prevDistance - 0.01, 0).toFixed(2);
          if (newDistance < 0.01) {
            setIsLoading(false);
            clearInterval(intervalId);
          if(data.msg.includes("capped")){
              window.showAlert(`<div class="coin"><img src="/token.png"></div> <br/><h3>${data.msg}</h3>`);
              //       
            }else if(data.msg.includes("exceeded")){
              window.showAlert(`<div><img src="/pepenohugs.gif"></div> <br/><h3>${data.msg}</h3>`);
              //       
            }else{
              window.showAlert(`<div class="coin"><img src="/token.png"></div> <br/><h3> Claimed ${claimedTokens} tokens</h3>`);
        
            }
            setTokens((prevTokens) => parseInt(data.tokens));
            window.scrollTo(0, 30);
            setEffectiveResults(0);
            loadInitialImages();
            setIsClaiming(false);
          }else{
            setIsLoading(true);
          }
          return newDistance;
        });
      }, 20);

    }catch(err){
      console.log(err);
     
      setIsClaiming(false);
     // window.Telegram.WebApp.showAlert(`Claim error.`);
      
}
    
   
  }
  };

  const toggleVisibility = async() => {
    setPanelIsVisible(!panelIsVisible);
    //if close
    if(isFiltered){
     fetchImages(page);
    }
  };
  const drawerWidth = isMobile ? 320 : 540;
  const toggleTabPosition = panelIsVisible ? (drawerWidth - 10) : (-10);

  const renderContent = () => {
    console.log("render");
    switch (activeTab) {
   //   case 'CreatePOI':
      case 'ViewMembership':
        return <ViewMembership setIsLoading={setIsLoading} authorship={authorship} setAuthorship={setAuthorship} setTokens={setTokens}  setGroup={setGroup} setMembershipaccess={setMembershipaccess} group={group} membershipaccess={membershipaccess} membership={membership} setMembership={setMembership}/>;
      case 'Preferences':
        return <Preferences initPref={initPref} setInitPref={setInitPref} />;
      case 'Bookmarked':
        return <Bookmarked setbookmarkinfo={setbookmarkinfo} bookmarkinfo={bookmarkinfo} bookmarks={bookmarks} setBookmarks={setBookmarks}/>;
      default:
        return <CreatePOI coordinates={coordinates}  />;
    }

  };
  const handleChange = (event, newValue) => {
   // const key= ["CreatePOI","CreateCommunity","ViewMembership","Preferences","Bookmarked"];
    console.log(newValue);
    setValue(newValue);
    setActiveTab(tabs[newValue].key);
  };
  return (
    <div className="right-panel">
              <div className="creator">
              {authorship.length>0 &&(<button className="addbtn" onClick={()=>{setToggleCreator(!toggleCreator)}}>
              {toggleCreator ? (<Clear />):(<LocationOnIcon />) }
              </button>) }
        {toggleCreator && (<CreatePOI authorship={authorship} setIsLoading={setIsLoading} setToggleCreator={setToggleCreator} setTokens={setTokens} group={group} coordinates={coordinates} userId={userId} walletAddress={walletAddress}   />
        )}
  
          

        </div>
      <Drawer id="right"
        anchor="right"
        open={panelIsVisible}
        onClose={toggleVisibility}
        variant="temporary"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            padding: theme.spacing(2),
          },
        }}
      >
        <h1 className="score">{tokens}  
          <div class="coin"><img src="/token.png"/></div><div className="scorebox"></div>
          <div class="shadowtext">{tokens} </div></h1>
          <div className='claimbtn'>{scrollDistance > 0.5 && <sup onClick={claim} >Click to claim {parseInt(scrollDistance*10)} tokens</sup>}
          </div>
         
        <div style={{margin:"0 auto;"}}><TonConnectButton /></div>
  
        <Box className='main' display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" gutterBottom>
            {username}
          </Typography>
         
          <Divider sx={{ my: 1 }} />
          <Tabs value={value} onChange={handleChange}   variant="scrollable"
            scrollButtons="auto" aria-label="basic tabs example"
          sx={{"max-width":"100%",
            '& .MuiTab-root': { color: '#999' },
            '& .Mui-selected': { color: '#666' },
            '& .MuiTabs-indicator': { backgroundColor: '#999' }
          }}
        >
            {tabs.map((tab, index) => (
               <Tab
               key={index}
               icon={tab.icon}
               label={
                 <div style={{ fontSize: '0.75rem' }}> {/* Adjust the font size here */}
                   {tab.label}
                 </div>
               }
             />
            ))}
          </Tabs>
        </Box>

        <div className="rendered">
        {renderContent()}
      </div>
      </Drawer>
      <Tab
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: '50%',
          right: toggleTabPosition,
          width: 'auto',
          minWidth: '100px',
          transform: 'translateY(-0%) translateX(25%) rotate(90deg)',
          zIndex: 1300,
          height: '28px',
          backgroundColor: 'var(--button-background)',
          color: "#000",
          borderRadius: '0px 0px 5px 5px',
          minHeight: '28px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#FFF',
            color: '#000',
          },
        }}
        icon={<span>{panelIsVisible ? '▲ Hide' : '▼ Menu'}</span>}
        onClick={toggleVisibility}
      />
    </div>
  );
};

export default RightPanel;
