let scrollID;




let stopped = true;


let scrollSpeed = 2; // 1 - Fast | 2 - Medium | 3 - Slow


let scrollInterval = scrollSpeed * 3;


// PS! Replace this with your own channel ID


// If you use this channel ID your app will stop working in the future


const CLIENT_ID = '4g2JP9Qwzlu7VX3m';







const drone = new ScaleDrone(CLIENT_ID, {


 data: { // Will be sent out as clientData via events


   name: getRandomName(),


   color: getRandomColor(),


 },


});







let members = [];







drone.on('open', error => {


 if (error) {


   return console.error(error);


 }


 console.log('Successfully connected to Scaledrone');







 const room = drone.subscribe('observable-room');


 room.on('open', error => {


   if (error) {


     return console.error(error);


   }


   console.log('Successfully joined room');


 });







 room.on('members', m => {


   members = m;


   updateMembersDOM();


 });







 room.on('member_join', member => {


   members.push(member);


   updateMembersDOM();


 });







 room.on('member_leave', ({id}) => {


   const index = members.findIndex(member => member.id === id);


   members.splice(index, 1);


   updateMembersDOM();


 });







 room.on('data', (text, member) => {


   if (member) {


     addMessageToListDOM(text, member);


   } else {


     // Message is from server


   }


 });


});







drone.on('close', event => {


 console.log('Connection was closed', event);


});







drone.on('error', error => {


 console.error(error);


});







function getRandomName() {


 const adjs = ["thicc", "cool", "awesome", "big", "tubular", "radical", "wacky", "chunky", "stupid", "slimey", "hot", "spicy", "juicy", "sussy", "sexy", "grilled", "hairy", "moist"];


 const nouns = ["dude", "bro", "bagel", "toothbrush", "mustard", "tree", "meme", "peanut_butter", "dumpling", "water", "leg", "baka", "headphones", "turtle", "sewer", "sausage", "lamp", "gamer"];


 return (


   adjs[Math.floor(Math.random() * adjs.length)] +


   "_" +


   nouns[Math.floor(Math.random() * nouns.length)]


 );


}







function getRandomColor() {


 return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);


}







//------------- DOM STUFF







const DOM = {


 membersCount: document.querySelector('.members-count'),


 membersList: document.querySelector('.members-list'),


 messages: document.querySelector('.messages'),


 input: document.querySelector('.message-form__input'),


 form: document.querySelector('.message-form'),


};







DOM.form.addEventListener('submit', sendMessage);







function sendMessage() {


 const value = DOM.input.value;


 if (value === '') {


   return;


 }


 DOM.input.value = '';


 drone.publish({


   room: 'observable-room',


   message: value,


 });


}







function createMemberElement(member) {


 const { name, color } = member.clientData;


 const el = document.createElement('div');


 el.appendChild(document.createTextNode(name));


 el.className = 'member';


 el.style.color = color;


 return el;


}







function updateMembersDOM() {


 DOM.membersCount.innerText = `${members.length} nerds in room:`;


 DOM.membersList.innerHTML = '';


 members.forEach(member =>


   DOM.membersList.appendChild(createMemberElement(member))


 );


}







function createMessageElement(text, member) {

if(text.match(/(pp|ass|bitch|shit|cunt|cock|dick|fuck|hell|shit|nigger|nigga|pussy|slut|whore|faggot|tom sucks)/gi)){
     return;
     }

 const el = document.createElement('div');


 el.appendChild(createMemberElement(member));


 el.appendChild(document.createTextNode(text));


 el.className = 'message';


 return el;


}


function startScrolling(){


let ID = setInterval(function() {


  window.scrollBy(0, 2);


    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {


       // Reached end of page


       stopScroll();


    }


  }, scrollInterval);


return ID;






}


function stopScroll() {


clearInterval(scrollID);


}







function addMessageToListDOM(text, member) {






 const el = DOM.messages;


 const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;


 el.appendChild(createMessageElement(text, member));


 if (wasTop) {


   el.scrollTop = el.scrollHeight - el.clientHeight;


  


 }


      if(stopped == true) {


      scrollID = startScrolling();


      stopped = false;


    }else {


      stopScroll();


      stopped = true;


    }


}



