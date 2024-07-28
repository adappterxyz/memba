export const ajax = async(endpoint,input)=>{
    try {
       
        const {udata} = await import('./local');
        input.user= udata.user.id; // ||
      const auth = window.Telegram.WebApp.initData;
      const response = await fetch(`https://api.showme.asia/${endpoint}`, {
        mode:'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        //    'Authorization': JSON.stringify(auth)
        },
        body: JSON.stringify(input)
      });
      return response;
  }catch(err){
    console.log(err);
  }}

export const track = async(endpoint,input)=>{
    try {
      
      const auth = window.Telegram.WebApp.initData;
      const response = await fetch(`https://api.showme.asia/${endpoint}`, {
        mode:'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': JSON.stringify(auth)
        },
        body: JSON.stringify(input)
      });
      return response;
  }catch(err){
    console.log(err);
  }}