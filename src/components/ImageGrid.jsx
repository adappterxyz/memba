import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import { useTonAddress, TonConnectButton } from '@tonconnect/ui-react';
import {ajax, tracker } from '../common';


 

const ImageGrid = ({page,setPage,dummyImages,effectiveResults,setEffectiveResults,scrollDistance,setScrollDistance, startToggleInterval, intervalRef, setRestState, initPref, membership, setbookmarkinfo, bookmarkinfo, images, setImages, tokens, id, coordinates, setTokens, setIsLoading, bookmarks, setBookmarks }) => {



  const [animate, setAnimate] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const touchStartY = useRef(0);
  const observer = useRef(null);
  const [swiped, setSwiped] = useState(false);
  const swipedRef = useRef(false);
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const [walletAddress, setWalletAddress] = useState({ userFriendly: '', raw: '' });

  const [speeding, setSpeeding] = useState(false);
  const [spam, setSpam] = useState(0);
  const originalScrollY = useRef(0);
  const scrollingRef = useRef(scrolling);
  const [posY,setposY] = useState(0);
  const [posX,setposX] = useState(0);
  const [pop,setPop] = useState(false);
  const [pluses, setPluses] = useState([]);
  const [newPluses, setNewPluses] = useState([]);


    useEffect(() => {
    scrollingRef.current = scrolling;
  }, [scrolling]);

  useEffect(() => {
  
    
    // Define global functions
    window.bookmark =  async function(pid) {


      setBookmarks((prevBookmarks) => {
        if (prevBookmarks.includes(pid)) {
          const updatedBookmarks = prevBookmarks.filter((bookmark) => bookmark !== pid);
          console.log(`removed bookmark: ${pid}`, updatedBookmarks);
          ajax('addbookmarks', { bookmarks:updatedBookmarks });
          return updatedBookmarks;
        }
        console.log(`Bookmarked: ${pid}`);

        setbookmarkinfo((prevBookmarkInfo) => {
           console.log(1);
           ajax('addbookmarks', { bookmarks:[...prevBookmarks, pid] });
           return [...prevBookmarks, pid].map((bookmarkId) => {
             return images.find((image) => parseInt(image.id) == parseInt(bookmarkId));
           }).filter(image => image !== undefined); // Filter out undefined values
           
            
         });

        return [...prevBookmarks, pid];
      });

      setbookmarkinfo((prevBookmarks) => {
        if (prevBookmarks.includes(pid)) {
          const updatedBookmarks = prevBookmarks.filter((bookmark) => bookmark !== pid);
          console.log(`removed bookmark: ${pid}`, updatedBookmarks);
          return updatedBookmarks;
        }
        console.log(`Bookmarked: ${pid}`);
        return [...prevBookmarks, pid];
      });
      
      

      
      //modify to reflect only bookmark speciofic images
     
  
    };

    window.cta = async function(cta) {
      console.log(`CTA action: ${cta}`);
     // await track('addcta',{});
     if(!cta.includes("https://")){ cta="https://t.me/showmecom"; }
      window.open(`${cta}`, '_blank');
    };

    window.getdirections = function(lat, lng) {
      //  await track('getdirections',{});
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    // Cleanup global functions on unmount
    return () => {
      delete window.bookmark;
      delete window.cta;
      delete window.getdirections;
    };
  }, [images,bookmarks]);


  useEffect(() => {
    if (userFriendlyAddress && rawAddress) {
      setWalletAddress({ userFriendly: userFriendlyAddress, raw: rawAddress });
    }
  }, [userFriendlyAddress, rawAddress]);

  const GetWalletAddress = () => {
    console.log("Address:", walletAddress.userFriendly, walletAddress.raw);
  };

  useEffect(() => {
    loadInitialImages();
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchImages(page);
    }
  }, [page]);

  useEffect(() => {
    observer.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.current.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.image-item');
    items.forEach(item => {
      observer.current.observe(item);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [images]);

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
        body: JSON.stringify({ page , effectiveResults: er , id, distance: parseFloat(scrollDistance) ,coordinates, auth, pref:initPref, membership})
      });
      const rdata = await response.json();
      setEffectiveResults(effectiveResults+rdata.effectiveResults);
      const data = rdata.sortedResults;
      setImages((prevImages) => initial ? data : [...prevImages, ...data]);
    } catch (error) {
      console.error('Failed to fetch images, using dummy data', error);
      const data = dummyImages.map((image, index) => ({
        ...image,
        alt: `Image ${page * dummyImages.length + index + 1}`
      }));
      setImages((prevImages) => [...prevImages, ...data]);
    }

    setIsLoading(false);
  };
/*
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
        body: JSON.stringify({ id , tokens : claimedTokens, address: walletAddress.userFriendly  })
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
  */
  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleWheel = (event) => {
    console.log("wheel");
    event.preventDefault();
    if (!scrolling) {
   //   setScrolling(true);
      setTimeout(() => {
        window.scrollBy(0, event.deltaY / 3);
       // setScrolling(false);
      }, 50);
    }
  };

  const handleScroll = (event) => {
    event.preventDefault();
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      setRestState(false);
      startToggleInterval();
    console.log('clear idle state');
    }
    console.log('scroll');
    const newScrollDistance = parseFloat(Math.pow((window.scrollY/1000),(1/4))).toFixed(2);
    setScrollDistance((prevScrollDistance) => {
      if (prevScrollDistance < newScrollDistance) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
      }
      return newScrollDistance;
    });
  };

  const handleTouchStart = (event) => {
    if (!scrolling) {
    originalScrollY.current = window.scrollY;
    touchStartY.current = event.touches[0].clientY;
  }else{
    console.log("still scrolling......");
  }
  };
  function smoothScrollTo(endX, endY, duration = 600) {
    
    const startX = window.scrollX || window.pageXOffset;
    const startY = window.scrollY || window.pageYOffset;
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    const startTime = new Date().getTime();
  
    // Easing function for smooth scrolling
    const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  
    const animateScroll = () => {
      const currentTime = new Date().getTime();
      const timeElapsed = Math.min(1, (currentTime - startTime) / duration);
      const ease = easeInOutQuad(timeElapsed);
     
      window.scrollTo(startX + distanceX * ease, startY + distanceY * ease);
  
      if (timeElapsed < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Remove the class 'scrolling' from the body once the scrolling is done
        document.body.classList.remove('scrolling');
       // 
      }
    };
  
    // Add the class 'scrolling' to the body
    document.body.classList.add('scrolling');
    animateScroll();
  }
  
  const smoothScrollBy = (x, y) => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const stepY = Math.min(y * (progress / 200), y);
      window.scrollBy(x, stepY);
      if (progress < 200) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };
  
const handleTouchMove = (event) => {
  // Replace with your specific div ID
  const touchEndY = event.touches[0].clientY;
  const deltaY = touchStartY.current - touchEndY;
  const touch = event.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  var overlay =null;    var overlay1 =null;    var overlay2 =null; 
  if(element){ overlay= element.closest('.load-bg'); if(overlay){ overlay=1; } }
  if(element){  if(overlay){ overlay=2; } }
  if(element){ 
    overlay= element.closest('.MuiDialog-paper');
    overlay1= element.closest('.MuiPaper-elevation'); 
    overlay2= element.closest('.poiform'); 
    if(overlay || overlay1 || overlay2){ overlay=2; } }
  if(element){ if(overlay){ overlay=2; } }
  if (overlay && overlay==2) {
    console.log("overlay2");
  } else {

 console.log("touchmove",swipedRef);
 event.preventDefault();

  }
  
  
};
useEffect(() => {
  if (newPluses.length > 0) {
    newPluses.forEach((newPlus, index) => {
      setTimeout(() => {
        setPluses((prev) => [...prev, newPlus]);
        setTimeout(() => {
          setPluses((prev) => prev.filter((plus) => plus.id !== newPlus.id));
        }, 600);
      }, index * 1000/newPluses.length); // Staggering by 100ms
    });
  }
}, [newPluses]);
  const handleTouchEnd = () => {
    
    touchStartY.current = 0;
  };


  const handleKeyDown = (event) => {
    if (event.key === 'PageDown') {
      event.preventDefault();
    }
  };

  const handleTouchStartSwipe = (e, index) => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      setRestState(false);
      startToggleInterval();
    console.log('clear idle state');
    }
    e.target.startX = e.touches[0].clientX;
    e.target.startY = e.touches[0].clientY;
  };

  const handleTouchMoveSwipe = (e, index) => {
    if (scrollingRef.current) {
      console.log("Speeding!!",spam);
      var spamc=spam+1;
      setSpam(spamc);
      if(spam>7){ setSpeeding(true); 
        setTimeout(()=>{
          setSpeeding(false); 
          setSpam(0);
        },1000)
      
       }
      return;
    }else{
      setTimeout(()=>{
        setSpeeding(false); 
        setSpam(0);
      },1000)
    }
    if (!e.target.startX) return;
    const diffX = e.touches[0].clientX - e.target.startX;
    const diffY = e.touches[0].clientY - e.target.startY;
    const imageItem = document.getElementById(`image-item-${index}`);
    const contentDiv = imageItem.querySelector('.content');
    console.log("diffy",diffY);
    if (diffX < -90){
      e.target.startX = e.touches[0].clientX;

    swipedRef.current = true;
    console.log("swipeleftmove",swipedRef);
      swipeview(contentDiv,imageItem,1);

      const rect = imageItem.getBoundingClientRect();
      const offsetY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const targetScrollY = rect.top + offsetY - 20;    
          if(targetScrollY > offsetY){
      console.log(targetScrollY,offsetY);
      var diff= targetScrollY - offsetY

      const plusesToAdd = [];
      let x = e.changedTouches[0].clientX;
      let y = e.changedTouches[0].clientY;
    while (diff > 10) {
      x=x+Math.random()*2*diffX;
      console.log("X",diffX);
      y=y-15;
      console.log(diff);
      plusesToAdd.push({ x:x, y:y, id:  Date.now() + diff  });
      diff -= 80;
    }
    console.log(plusesToAdd);
    setNewPluses(plusesToAdd);
    
    
    }
    }else if (contentDiv.innerHTML!="" && diffX > 90) {
      e.target.startX = e.touches[0].clientX;
      console.log("close",contentDiv.innerHTML);
 
        swipeview(contentDiv,imageItem,0);
     
      
    
  }else if(diffY<-30){  


    const rect = imageItem.getBoundingClientRect();
    const offsetY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const targetScrollY = rect.top + offsetY - 20;    
    
    smoothScrollTo(0, targetScrollY,600);

    if(targetScrollY > offsetY){
      console.log(targetScrollY,offsetY);
      var diff= targetScrollY - offsetY

      const plusesToAdd = [];
      let x = e.changedTouches[0].clientX;
      let y = e.changedTouches[0].clientY;
    while (diff > 10) {
      x=x+Math.random()*2*diffX;
      console.log("X",diffX);
      y=y-15;
      console.log(diff);
      plusesToAdd.push({ x:x, y:y, id:  Date.now() + diff  });
      diff -= 80;
    }
    console.log(plusesToAdd);
    setNewPluses(plusesToAdd);
    
    
    }

    setScrolling(true);
  setTimeout(() => {
    console.log("Timeout reached, resetting scrolling to false");
    setScrolling(false);
  }, 600);
}else if(diffY>30){   
  const previmageitem = imageItem.previousElementSibling;
  console.log(previmageitem);
  const rect = previmageitem.getBoundingClientRect(); 
  const offsetY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  const targetScrollY = rect.top + offsetY - 20;   
  
  smoothScrollTo(0, targetScrollY,600);
  setScrolling(true);
    smoothScrollTo(0, targetScrollY, 600);
  
      setTimeout(() => {
        console.log("Timeout reached, resetting scrolling to false");
        setScrolling(false);
      }, 600);

}
  }
  const swipeview = (contentDiv,imageItem,state)=>{
    
    const title = imageItem.title;
    const description = imageItem.getAttribute('description');
    const pid = imageItem.getAttribute('pid');
    const cta = imageItem.getAttribute('cta');
    const lat = imageItem.getAttribute('lat');
    const lng = imageItem.getAttribute('lng');
    //make this contentDiv scroll to top 
    //imageItem.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Ensure contentDiv is scrolled into view
    
    const rect = imageItem.getBoundingClientRect();
    const offsetY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const targetScrollY = rect.top + offsetY - 20;
    
    console.log("scrollto", rect.top, offsetY, targetScrollY);
    
    smoothScrollTo(0, targetScrollY,600);

          if (state == 0 && contentDiv.innerHTML!="") {
      imageItem.classList.add('out');
      console.log("out",contentDiv.innerHTML);
      setTimeout(()=>{
        
        contentDiv.innerHTML = '';
        imageItem.classList.remove('out');
        imageItem.classList.remove('swiped');
      },300)
    } else {
//to clear other views:
      const allImageItems = document.querySelectorAll('.image-item');
    allImageItems.forEach(item => {
        item.classList.remove('swiped');
        const content = item.querySelector('.content');
        if (content) {
            content.innerHTML = '';
        }
    });

      contentDiv.innerHTML = `<h4>${title}</h4><p>${description}</p><br/>
      <div class="actions ${pid}">
      <button onClick="bookmark('${pid}')" class="bookmark"><img src="/bookmark.png" /> </button>
      <button onClick="cta('${cta}')"class="cta"><img src="/cta.png" /> </button>
      <button onclick="getdirections('${lat}','${lng}')" class="directions"><img src="/directions.png" /></button>
      </div>`;
      imageItem.classList.add('swiped');
    }
  }
  const dblclick = (e, index) => {
    const imageItem = document.getElementById(`image-item-${index}`);
    const contentDiv = imageItem.querySelector('.content');
   
    if (contentDiv.innerHTML !== "") {
      swipeview(contentDiv,imageItem,0);
    } else {
      swipeview(contentDiv,imageItem,1);
    }
  };

  const handleTouchEndSwipe = (e) => {
   // setSwiped(false);


    e.target.startX = null;
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div>
      <button className={`scroll-counter ${animate ? 'animate' : ''}`}>
               <div class="box">Distance: <span className='distance'>{scrollDistance}</span> km </div> 
   
      </button>
      <InfiniteScroll
        dataLength={images.length}
        next={fetchMoreData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((image, index) => (
            <div
              key={index}
              id={`image-item-${index}`}
              className={`image-item` }
              bookmark={`${bookmarks.includes(image.id.toString()) ? 'bookmark' : ''}`}
              onTouchStart={(e) => handleTouchStartSwipe(e, index)}
              onTouchMove={(e) => handleTouchMoveSwipe(e, index)}
              onDoubleClick={(e) => dblclick(e, index)}
              onTouchEnd={handleTouchEndSwipe}
              title={image.title}
              description={image.description}
              pid={image.id}
              cta={image.cta}
              lat={image.lat}
              lng={image.lng}
            >
               {image.image ? (
      <img src={image.image} alt={image.alt} />
    ) : (
      <div style={{"min-height":"100px","padding":"50px 10px"}}><h2 style={{color:"#FFF"}}>{image.title}</h2></div>
    )}
              <div className={`content`}></div>
            </div>
          ))}
        </Masonry>
      </InfiniteScroll>

      {pluses.map((plus) => (
        <div
          key={plus.id}
          className="plus-one"
          style={{ top: plus.y, left: plus.x }}
        >
          +1
        </div>
      ))}
      {/* Your component content */}
 
      
      <div className='bottomglow'>bottom</div>
      <div className={speeding ? 'speeding':'' } style={{display:"none"}}>
        {spam<12 && <img src="catpepe.gif"/> }
        {spam>=12 && <img src="bumpy.gif"/> }
        </div>
     
    </div>
  );
};

export default ImageGrid;
