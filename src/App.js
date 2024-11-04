import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import LeftNavBar from "./components/LeftNavBar";
import Loader from "./components/Loader";
import RightPanel from "./components/RightPanel";
import { theme, GlobalCss } from './theme-mn';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import ImageGrid from './components/ImageGrid';
import { useTonAddress, TonConnectButton } from '@tonconnect/ui-react';
import {ajax, tracker } from './common';
import { GoogleMap, Marker, Autocomplete, LoadScript } from '@react-google-maps/api';



function App() {
  const [curract, setCurract] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [panelIsVisible, setPanelIsVisible] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [initPref,setInitPref]=useState([]);
  const [bookmarks,setBookmarks]=useState([]);
  const [bookmarkinfo, setbookmarkinfo] = useState([]);
  const [membership,setMembership]=useState([]);
  const [authorship,setAuthorship]=useState([]);
  const [membershipaccess,setMembershipaccess]=useState([]);
  const [tele,setTele]=useState(false);
  const [dp, setDp]= useState('');
  const [restState, setRestState] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(1);
  const [group,setGroup]=useState([])
  const apiUrl = process.env.REACT_APP_API_URL;
  const [images, setImages] = useState([]);
  const [effectiveResults,setEffectiveResults]=useState(0);
  const dummyImages = [];
  const intervalRef = useRef(null);
  const [page, setPage] = useState(1);




  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
          setCurract("Location access denied");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    
    }
  };
const loadandmessage = (message)=>{ setCurract(message); setIsLoading(true); 
setTimeout(()=>{ 
 // setIsLoading(false);
},3000)

}
const loadInitialImages = () => {
  setTimeout(()=>{ window.scrollTo(0,30); console.log("scroll"); }, 1000 );
  fetchImages(1, true);
};
const fetchImages = async (page, initial = false) => {
  setIsLoading(true);
  var er = 0;
  if(initial){  er =0;  }else{  er=effectiveResults; }
  const auth = window.Telegram.WebApp.initData;
  try {
    //showmebe.kwang-783.workers.dev
    const response = await fetch(`https://api.showme.asia/getimages`, {  
      mode:'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      //  'Authorization': JSON.stringify(auth)
      },
      body: JSON.stringify({ page , effectiveResults: er , userId, distance: parseFloat(scrollDistance) ,coordinates, auth, pref:initPref, membership})
    });
    const rdata = await response.json();
    setEffectiveResults(effectiveResults+rdata.effectiveResults);
    const data = rdata.sortedResults;
    setImages((prevImages) => initial ? data : [...prevImages, ...data]);
  } catch (error) {
    console.error('Failed to fetch images, using dummy data', error);
    const data = [];
    setImages((prevImages) => [...prevImages, ...data]);
  }

  setIsLoading(false);
};
const startToggleInterval = () => {
  intervalRef.current = setTimeout(() => {
    setRestState(true); // Toggle the state
    console.log("Toggled state to:", !restState);
  }, 5000); // Change 2000 to your desired interval in milliseconds
};

  const initialize = async() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      var auth = window.Telegram.WebApp.initData;
      const { udata } = await import('./local');


 

      if (typeof udata.user !== 'undefined') {
        setTele(true);
        setUserId(udata.user.id);
        if(typeof udata.user.username == null){ setUsername("empty");    }else{    setUsername(udata.user.username);     }
        if(typeof udata.user.photo_url == null){ setDp("empty");    }else{    setDp(udata.user.photo_url);     }

        // ajax()
//change to get initial info comprising of tokens, preferences, bookmark, membership, membership preference
        const response = await fetch(`https://api.showme.asia/gettokens`, {
          mode:'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          'Authorization': JSON.stringify(auth)
            
          },
          body: JSON.stringify({ id : udata.user.id , username : udata.user.username , dp : udata.user.photo_url , auth: auth})
        });
        const data = await response.json();
        
        console.log(data);
        setTokens(data.tokens);
        setMembership(data.membership);
        setAuthorship(data.authorship);
        setMembershipaccess(data.membershipaccess);
        setBookmarks(data.bookmarks);
        setInitPref(data.preference);
        setGroup(data.group);
        setbookmarkinfo(data.bookmarkdetails);
        
      }else{
        setTele(false);
        setPanelIsVisible(false);
      }
    //  setIsLoading(false); 
    } else {
      console.error('Telegram WebApp is not available');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGeolocation();
    initialize();
    window.closeCustomAlert();
    startToggleInterval();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);


  return (
    //
    <TonConnectUIProvider manifestUrl="https://app.showme.asia/tonconnect-manifest.json">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCss />
        <div className="App">
          {isLoading && (
            <div className={`load-bg`}>
              <Loader curract={curract} />
            
            </div>
          )}

          <div>
            {coordinates.latitude && coordinates.longitude ? (
              <div className={`${panelIsVisible ? 'lock' : ''}`}>
<div className="topspacer"></div>
              <ImageGrid 
                 page={page}
                 setPage={setPage}
              scrollDistance={scrollDistance}
              setScrollDistance={setScrollDistance}
              intervalRef={intervalRef}
              startToggleInterval={startToggleInterval}
              setRestState={setRestState}
              initPref={initPref} 
              loadandmessage={loadandmessage} 
              bookmarkinfo={bookmarkinfo} 
              membership={membership}
              effectiveResults={effectiveResults}
              setEffectiveResults={setEffectiveResults}
              setbookmarkinfo={setbookmarkinfo} 
              images={images} setImages={setImages} 
              bookmarks={bookmarks} setBookmarks={setBookmarks} 
              coordinates={coordinates} id={userId} tokens={tokens} 
              setTokens={setTokens} setIsLoading={setIsLoading} />
                <div>
                  List of curated POIs at [{coordinates.latitude}, {coordinates.longitude}]
                </div>
              </div>
            ) : (
              !isLoading && <div>Waiting for geolocation...</div>
            )}
  <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLEAPI} libraries={['places']}>


  {tele &&
            <RightPanel
            page={page}
            setPage={setPage}
            fetchImages={fetchImages}
            loadInitialImages={loadInitialImages}
            scrollDistance={scrollDistance}
              setScrollDistance={setScrollDistance}
            setIsLoading={setIsLoading}
            coordinates={coordinates} tokens={tokens} setTokens={setTokens}
              panelIsVisible={panelIsVisible}
              username={username}
              setAuthorship={setAuthorship}
              dp = {dp}
              effectiveResults={effectiveResults}
              setEffectiveResults={setEffectiveResults}
              authorship={authorship}
              group={group}
              setPanelIsVisible={setPanelIsVisible}
              initPref={initPref} setInitPref={setInitPref}
              bookmarks={bookmarks} 
              userId={userId}
              setGroup={setGroup}
              setbookmarkinfo={setbookmarkinfo}
              bookmarkinfo={bookmarkinfo} setBookmarks={setBookmarks}
              membership={membership} setMembership={setMembership} 
              setMembershipaccess={setMembershipaccess}
              membershipaccess={membershipaccess}
            /> }
              </LoadScript>
          </div>
          <div className={restState ? 'instructions':'' }  style={{display:"none"}}>
            {tele ?(<img src="swipeup.gif"/>):(<img src="scrollup.gif"/>)}
            </div>
       
        </div>
      </ThemeProvider>
    </TonConnectUIProvider>
  );
}

export default App;
