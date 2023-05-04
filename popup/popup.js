
var msgCount = 0;
var txtbox = document.getElementById('tbox');
var sendButton = document.getElementById('myButton');

var uname = null;
var uid = null;
var utype = null;
var emailVerified = null;
var isAuthenticated = null;


var emailVerficationButton = document.getElementById("email-verification-button");
var signOutButton = document.getElementById("sign-out-button");
var signInWithEmailButton = document.getElementById("sign-in-with-email-button");
var signInStatusDescription = document.getElementById("sign-in-status-description");
var userNameField = document.getElementById("user-name-field");
var signedWithEmailBlock = document.getElementById("signed-in-with-email");
var anonSignedInBlock = document.getElementById("anon-signed-in");
var emailVerficationSuccess = document.getElementById("email-verificaton-success");
var emailVerificationPending = document.getElementById("email-verification-pending");
var rateIcon = document.getElementById("rate-icon");
var chatIcon = document.getElementById("chat-icon");
var accountIcon = document.getElementById("account-icon");

var rateInterface = document.getElementById("rate-interface");
var chatInterface = document.getElementById("chat-interface");
var accountInterface = document.getElementById("account-interface");

// function createChatBubble(chat, counter) {
//   console.log(`POPUP: New message count: ${counter}`)
//   let chatBub = document.createElement('pre');
//   chatBub.classList.add('chat_bubble');
//   chatBub.setAttribute('id', `m${counter}`);
//   let chatContent = document.createTextNode(
//     `Message: ${chat.message}\nUserName: ${chat.name}\nTimestamp: ${chat.time}\nType: ${chat.type}\nUID: ${chat.uid}\nStatus: ${chat.status}\nMsgCount: ${msgCount}`
//   );
//   chatBub.appendChild(chatContent);
//   return chatBub;
// }

function updateUI(type, args) {
  let chatFrame = document.getElementById(args.id);
  // switch (type) {
  //   case "loadAllChats":
  //     for (let i = 1; i < args.chats.length; i++) {
  //       chatFrame.appendChild(createChatBubble(args.chats[i]), msgCount++)
  //     }
  //     break;
  //   case "newMessage":
  //     console.log("POPUP: Appending new child by listener " + args.chat.name)
  //     chatFrame.appendChild(createChatBubble(args.chat), msgCount++);
  //     break;
  //   case "sendMessage":
  //     chatFrame.appendChild(createChatBubble(args.chat), args.chat.msgCount);
  //     break;

  //   case "updateStatus":
  //     console.log(`POPUP bubble id: ${args.id}`)
  //     let chatBubble = document.getElementById(args.id);
  //     console.log("POPUP: Inside update Status");
  //     if (chatBubble) {
  //       chatBubble.textContent = `Message: ${args.message}\nUserName: ${args.name}\nTimestamp: ${args.time}\nType: ${args.type}\nUID: ${args.uid}\nStatus: ${args.status}\nMsgCount: ${args.msgCount}`;
  //     }
  //     break;
  //   case "rating":
  //     chatFrame.innerHTML = `<pre>Rate value: ${args.rateVal}</pre>`
  //     break;

  //   default:
  //     document.getElementById(args.id).textContent = "ERRO";

  // }
}

function send(text) {
  let currTime = new Date().toISOString();

  addMessage(message = text, sender = uname, timestamp = currTime);

  chrome.runtime.sendMessage(
    {
      type: "send-message",
      data: {
        message: text,
        time: currTime,
        msgCount: msgCount
      }
    }
  )
}

function rate(text) {
  let rateVal = Number(text);
  if (isNaN(rateVal)) {
    console.log("POPUP: Not a number");
  } else {
    chrome.runtime.sendMessage({ type: "rate-website", data: { rateVal: rateVal } })
  }
}

function getAuthStatus() {
  console.log("POPUP: getting-auth-status")
  chrome.runtime.sendMessage({ type: "get-auth-status" });
}

function getUserDetails() {
  chrome.runtime.sendMessage({ type: "get-user-details" });
}

function setUserDetails(userDetails) {
  console.log(userDetails);
  uname = userDetails.userName;
  uid = userDetails.userId;
  utype = userDetails.userType;
  emailVerified = userDetails.emailVerified;

  if (utype == 'Anon') {
    anonSignedInBlock.style.display = 'block';
    signedWithEmailBlock.style.display = 'none';
  } else if (utype == "Signed") {
    anonSignedInBlock.style.display = 'none';
    signedWithEmailBlock.style.display = 'block';

    if (emailVerified) {
      emailVerificationPending.style.display = 'none';
      emailVerficationSuccess.style.display = 'block';
    } else {
      emailVerificationPending.style.display = 'flex';
      emailVerficationSuccess.style.display = 'none';
    }
  }

  userNameField.innerText = uname;
  if (utype == "Anon") {
    signInStatusDescription.innerText = "😎 Signed anonymously"
  } else if (utype == "Signed") {
    signInStatusDescription.innerText = "😍 Signed using email"

  }



}

function refresh() {
  chrome.runtime.sendMessage({ type: "refresh" }, (response) => {
    console.log("response")

    // const urlText = document.getElementById('para');

    // urlText.textContent = response.data.msg;

    console.log(`
          response to popup.js
          ${typeof response}
          ${response}
      `)

    console.log(response);
  });

}

getAuthStatus();




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`POPUP: form SW: type: ${message.type}`);
  if (message.type == "ack") {
    if (message.data.type == "progress") {
      console.log(`POPUP: ${message.data.message}`)
    }
  } else if (message.type == "allChats") {
    console.log("POPUP: receive all chats");
    console.log(message.data.chats)
    updateUI("loadAllChats", {
      id: "msg_res",
      chats: message.data.chats
    });
  } else if (message.type == 'child-added') {
    console.log(`OPUP: Child added at index time:  ${message.data.time}`);
    console.log(message);

    let t;

    if (message.data.time == "") {
      t = Date.now();
    } else {
      t = new Date(message.data.time)
    }

    addMessage(message = message.data.message, sender = uname, timestamp = t);
    // updateUI("newMessage", {
    //   id: "msg_res",
    //   chat: message.data
    // })
    console.log(message);
  } else if (message.type == 'message-sent') {
    console.log(`POPUP: Message sent count: ${message.data.msgCount}`);

  } else if (message.type == "rating") {
    console.log(`POPUP: rate value: ${message.data.rateVal}`)
    updateUI("rating", {
      id: "rate_res",
      rateVal: message.data.rateVal
    });
  } else if (message.type == "auth-status") {
    isAuthenticated = message.data.isAuthenticated;
    if (!isAuthenticated) {
      getAuthStatus()
    } else {
      console.log(`POPUP: auth status: ${isAuthenticated}`);
      getUserDetails();
      refresh();
    }

  } else if (message.type == "user-details") {
    setUserDetails(message.data)
  }

});




signInWithEmailButton.addEventListener('click', () => {
  console.log("POPUP: clicked signInWithEmailButton");
  chrome.tabs.create({ url: chrome.runtime.getURL("popup/login/index.html") })
});


rateIcon.addEventListener('click', () => {
  rateInterface.style.display = "block";
  chatInterface.style.display = "none";
  accountInterface.style.display = "none";
});

chatIcon.addEventListener('click', () => {
  rateInterface.style.display = "none";
  chatInterface.style.display = "block";
  accountInterface.style.display = "none";

})

accountIcon.addEventListener('click', () => {
  console.log("clicked")
  rateInterface.style.display = "none";
  chatInterface.style.display = "none";
  accountInterface.style.display = "block";

})


var user = { id: '', name: '' };
var tabUrl;
var lastSenderId;
var oldestMessageTimestamp;
var isTyping = false;


function addMessage(message, sender = "test", timestamp = "timestamp", prepend = false) {
  if (!oldestMessageTimestamp || timestamp < oldestMessageTimestamp) {
    oldestMessageTimestamp = timestamp;
  }

  var li = document.createElement('li');

  if (lastSenderId && lastSenderId === sender) {
    li.classList.add('continuous-message');
  }

  lastSenderId = sender.id;

  var messageWrapper = document.createElement('div');
  messageWrapper.className = 'message-wrapper';

  // Adds the message time
  var messageTimeWrapper = document.createElement('div');
  messageTimeWrapper.classList.add('message-time');

  var messageTimestamp = document.createElement('div');
  messageTimestamp.classList.add('message-timestamp');
  messageTimestamp.classList.add('invisible');
  messageTimestamp.innerHTML = timestamp;

  var messageReadableTime = document.createElement('div');
  messageReadableTime.classList.add('message-readable-time');
  messageReadableTime.innerHTML = new Date(timestamp).toLocaleString();

  messageTimeWrapper.appendChild(messageTimestamp);
  messageTimeWrapper.appendChild(messageReadableTime);
  messageWrapper.appendChild(messageTimeWrapper);

  // Adds the message sender
  if (sender && sender.id && sender.id !== user.id) {
    var messageSenderWrapper = document.createElement('div');
    messageSenderWrapper.classList.add('message-sender');

    var messageSenderId = document.createElement('div');
    messageSenderId.classList.add('message-sender-id');
    messageSenderId.innerHTML = sender.id + ':';

    var messageSenderName = document.createElement('div');
    messageSenderName.classList.add('message-sender-name');

    if (sender.name) {
      messageSenderId.classList.add('invisible');
      messageSenderName.innerText = sender.name + ':';
    }

    messageSenderWrapper.appendChild(messageSenderId);
    messageSenderWrapper.appendChild(messageSenderName);
    messageWrapper.appendChild(messageSenderWrapper);
    messageReadableTime.innerHTML = messageReadableTime.innerHTML + ' -';
  } else {
    messageWrapper.classList.add('my-message');
    messageReadableTime.innerHTML = messageReadableTime.innerHTML + ':';
  }

  // Adds the message
  var messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  messageDiv.appendChild(document.createTextNode(message));
  messageWrapper.appendChild(messageDiv);

  li.appendChild(messageWrapper);
  var messages = document.getElementById('messages');

  if (prepend) {
    messages.insertBefore(li, messages.getElementsByTagName('li')[0]);
  } else {
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
  }

}

function sendMessageTest() {
  console.log("POPUP: sending message")
  var message = document.getElementById('message-input').value;

  if (message === '') {
    return;
  }

  addMessage(message, "hmdlkjfasd", Date.now());

  // socketIO.emit('chatMessage', {
  //   room: tabUrl,
  //   senderId: user.id,
  //   senderName: user.name,
  //   message: message
  // });

  document.getElementById('message-input').value = '';
}

var sendmsgbt = document.getElementById('send')

sendmsgbt.addEventListener('click', () => {
  console.log("POPUP: clicked sendmsgbt");
  // sendMessageTest();
  let msgText = document.getElementById('message-input').value;
  if (msgText === '') {
    return;
  }

  send(msgText);

})


// sendButton.addEventListener('click', () => {

//   console.log("POPUP: Button clicked")
//   let text = txtbox.value;
//   if (text == '') {
//       console.log("POPUP: Type something")
//   } else {
//       console.log(`POPUP: Message to send: ${text}`);
//       send(text);
//       // rate(text);
//   }
// });























// const socketIO = io('http://localhost:3000/');
// var user = { id: '', name: '' };
// var tabUrl;
// var lastSenderId;
// var oldestMessageTimestamp;
// var isTyping = false;

// /**
//  * Joins the chat room of the URL of the current tab.
//  */
// document.addEventListener('DOMContentLoaded', () => {
//   showLoadingOlderMessages();
//   getUserId();
//   getCurrentTabUrl((url) => {
//     tabUrl = url;
//     socketIO.emit('joinRoom', url);
//   });
//   document.getElementById('message-input').focus();
// });

// /**
//  * When this client enters a room,
//  * receives the user count and the last
//  * messages sent to this room.
//  */
// socketIO.on('login', (data) => {
//   removeLoadingOlderMessages();
//   changeUserCounter(data.userCount);

//   for (var i = 0; i < data.messages.length; i++) {
//     addMessage(data.messages[i].message, data.messages[i].sender, data.messages[i].timestamp);
//   }
// });

// /**
//  * Notifies that someone is typing.
//  */
// socketIO.on('typing', (user) => {
//   var usersTyping = document.getElementById('users-typing');

//   if (usersTyping.getElementsByClassName(user.id).length > 0) {
//     return;
//   }

//   var userTyping = document.createElement('li');
//   userTyping.classList.add(user.id);
//   userTyping.innerText = user.name ? user.name : user.id;
//   usersTyping.appendChild(userTyping);

//   if (usersTyping.childNodes.length === 1) {
//     document.getElementById('is-are-typing').innerHTML = 'is typing...';
//   } else {
//     document.getElementById('is-are-typing').innerHTML = 'are typing...';
//   }
// });

// /**
//  * Notifies that someone has stopped typing.
//  */
// socketIO.on('stoppedTyping', (user) => {
//   var usersTyping = document.getElementById('users-typing');
//   var userTyping = usersTyping.getElementsByClassName(user.id);

//   if (userTyping && userTyping.length > 0) {
//     usersTyping.removeChild(userTyping[0]);
//   }

//   if (usersTyping.childNodes.length === 0) {
//     document.getElementById('is-are-typing').innerHTML = '';
//   } else if (usersTyping.childNodes.length === 1) {
//     document.getElementById('is-are-typing').innerHTML = 'is typing...';
//   } else {
//     document.getElementById('is-are-typing').innerHTML = 'are typing...';
//   }
// });

// /**
//  * Receives a chat message from the server.
//  */
// socketIO.on('chatMessage', (data) => {
//   addMessage(data.message, data.sender, data.timestamp);
// });

// /**
//  * Receives older messages from the server.
//  */
// socketIO.on('olderChatMessages', (messages) => {
//   for (var i = messages.length - 1; i >= 0; i--) {
//     addMessage(messages[i].message, messages[i].sender, messages[i].timestamp, true);
//   }

//   var lastMessageInserted = document.getElementById('messages').getElementsByTagName('li')[messages.length - 1];
//   removeLoadingOlderMessages();
//   lastMessageInserted.scrollIntoView();
// });

// /**
//  * Called when some other user changes his name,
//  * so it also changes his name shown in his messages
//  * on other users computers.
//  */
// socketIO.on('changeUserName', (data) => {
//   changeUserName(data.user.id, data.user.name);
// });

// /**
//  * Changes the user counter when some other
//  * user joined or left the room.
//  */
// socketIO.on('updateUserCounter', (data) => {
//   changeUserCounter(data.userCount);
// });

// /**
//  * Changes the user counter.
//  * 
//  * @param userCount - the amount of users to be showed on the counter.
//  */
// function changeUserCounter(userCount) {
//   document.getElementById('room-users-counter').innerHTML = userCount + ' users in this room';
// }

// /**
//  * Gets the URL of the current active tab.
//  *
//  * @param {function(string)} callback - called when the URL of the current tab
//  *   is found.
//  */
// function getCurrentTabUrl(callback) {
//   // Query filter to get the current active tab
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };

//   chrome.tabs.query(queryInfo, (tabs) => {
//     var tab = tabs[0];
//     var url = tab.url;

//     console.log('You are in the chat of the url: ' + url);

//     callback(url);
//   });
// }

// /**
//  * Sends the message contained in the 'message-input' to the server.
//  */
// function sendMessage() {
//   var message = document.getElementById('message-input').value;

//   if (message === '') {
//     return;
//   }

//   addMessage(message, user.id, Date.now());

//   document.getElementById('message-input').value = '';
// }

// /**
//  * Adds a message to the chat, either it's been received or sent.
//  * 
//  * @param message - message received/sent.
//  * @param sender - if the message was sent by this client,
//  *   adds the sender's name on top of the message.
//  * @param prepend - add the message to the beginning.
//  */
// function addMessage(message, sender, timestamp, prepend) {
//   if (!oldestMessageTimestamp || timestamp < oldestMessageTimestamp) {
//     oldestMessageTimestamp = timestamp;
//   }

//   var li = document.createElement('li');

//   if (lastSenderId && lastSenderId === sender) {
//     li.classList.add('continuous-message');
//   }

//   lastSenderId = sender.id;

//   var messageWrapper = document.createElement('div');
//   messageWrapper.className = 'message-wrapper';

//   // Adds the message time
//   var messageTimeWrapper = document.createElement('div');
//   messageTimeWrapper.classList.add('message-time');

//   var messageTimestamp = document.createElement('div');
//   messageTimestamp.classList.add('message-timestamp');
//   messageTimestamp.classList.add('invisible');
//   messageTimestamp.innerHTML = timestamp;

//   var messageReadableTime = document.createElement('div');
//   messageReadableTime.classList.add('message-readable-time');
//   messageReadableTime.innerHTML = new Date(timestamp).toLocaleString();

//   messageTimeWrapper.appendChild(messageTimestamp);
//   messageTimeWrapper.appendChild(messageReadableTime);
//   messageWrapper.appendChild(messageTimeWrapper);

//   // Adds the message sender
//   if (sender && sender.id && sender.id !== user.id) {
//     var messageSenderWrapper = document.createElement('div');
//     messageSenderWrapper.classList.add('message-sender');

//     var messageSenderId = document.createElement('div');
//     messageSenderId.classList.add('message-sender-id');
//     messageSenderId.innerHTML = sender.id + ':';

//     var messageSenderName = document.createElement('div');
//     messageSenderName.classList.add('message-sender-name');

//     if (sender.name) {
//       messageSenderId.classList.add('invisible');
//       messageSenderName.innerText = sender.name + ':';
//     }

//     messageSenderWrapper.appendChild(messageSenderId);
//     messageSenderWrapper.appendChild(messageSenderName);
//     messageWrapper.appendChild(messageSenderWrapper);
//     messageReadableTime.innerHTML = messageReadableTime.innerHTML + ' -';
//   } else {
//     messageWrapper.classList.add('my-message');
//     messageReadableTime.innerHTML = messageReadableTime.innerHTML + ':';
//   }

//   // Adds the message
//   var messageDiv = document.createElement('div');
//   messageDiv.className = 'message';
//   messageDiv.appendChild(document.createTextNode(message));
//   messageWrapper.appendChild(messageDiv);

//   li.appendChild(messageWrapper);
//   var messages = document.getElementById('messages');

//   if (prepend) {
//     messages.insertBefore(li, messages.getElementsByTagName('li')[0]);
//   } else {
//     messages.appendChild(li);
//     messages.scrollTop = messages.scrollHeight;
//   }

// }

// /**
//  * Gets the identification of the user and sets it into the user.id var.
//  * If this is the first time retrieving it, a random identification is
//  * generated and stored at chrome storage.
//  */
// function getUserId() {
//   chrome.storage.sync.get('user', (items) => {
//     if (items.user) {
//       user = items.user;

//       var userDiv = document.getElementById('user');

//       if (!user.name) {
//         userDiv.classList.add('pulsate');
//       }

//       userDiv.innerText = user.name ? user.name : user.id;
//       document.getElementById('welcome-message').innerHTML = (user.name ? 'Hello ' : 'Hello user ') + userDiv.outerHTML;
//       setUserDivClickable();
//     } else {
//       socketIO.emit('generateUserId', (newUserId) => {
//         var userDiv = document.getElementById('user');
//         userDiv.classList.add('pulsate');
//         userDiv.innerText = newUserId;
//         document.getElementById('welcome-message').innerHTML = 'Hello user ' + userDiv.outerHTML;
//         setUserDivClickable();

//         user = {
//           id: newUserId,
//           name: ''
//         };

//         chrome.storage.sync.set({ 'user': user });
//       });
//     }
//   });
// }

// /**
//  * Changes the name of the user
//  * 
//  * @param userId - the id of the user that changed his name.
//  * @param userName - the new name of the user that changed his name.
//  */
// function changeUserName(userId, userName) {
//   if (user.id === userId) {
//     var userDiv = document.getElementById('user');
//     userDiv.classList.remove('pulsate');
//     userDiv.innerText = userName;
//     document.getElementById('welcome-message').innerHTML = 'Hello ' + userDiv.outerHTML;
//     setUserDivClickable();
//   }

//   var senders = document.getElementById('messages').getElementsByClassName('message-sender');
//   Array.prototype.forEach.call(senders, (sender) => {
//     var senderIdDiv = sender.getElementsByClassName('message-sender-id')[0];

//     if (senderIdDiv.innerHTML.startsWith(userId)) {
//       senderIdDiv.classList.add('invisible');
//       var senderNameDiv = sender.getElementsByClassName('message-sender-name')[0];
//       senderNameDiv.innerText = userName + ':';
//     }
//   });
// }

// /**
//  * Sends the name of the user to the server and
//  * saves it in the chrome's storage.
//  */
// function changeMyUserName() {
//   var name = document.getElementById('name-input').value;
//   if (!name) {
//     document.getElementById('name-input-messge').innerHTML = 'You should write your name in the input field above!';
//     return;
//   }

//   user.name = name;
//   socketIO.emit('changeUserName', {
//     room: tabUrl,
//     userId: user.id,
//     userName: user.name
//   });

//   changeUserName(user.id, user.name);
//   chrome.storage.sync.set({ 'user': user });

//   document.getElementById('name-input').value = '';
//   document.getElementById('name-input-wrapper').classList.add('invisible');
// }

// /**
//  * Shows an animation that indicates that
//  * older messages are being loaded.
//  */
// function showLoadingOlderMessages() {
//   document.getElementById('loading-older-messages-wrapper').classList.remove('invisible');
//   document.getElementById('messages').style.paddingTop = '50px';
// }

// /**
//  * Removes the animation that indicates that
//  * older messages are being loaded.
//  */
// function removeLoadingOlderMessages() {
//   document.getElementById('loading-older-messages-wrapper').classList.add('invisible');
//   document.getElementById('messages').style.paddingTop = '0';
// }

// /**
//  * Sets the 'user' div clickable, so the user can
//  * change it's name. The reason why it's not done
//  * directly without a function is because the 'user'
//  * div is changed when the user's name or id is loaded.
//  */
// function setUserDivClickable() {
//   document.getElementById('user').onclick = () => {
//     document.getElementById('name-input-wrapper').classList.remove('invisible');
//     document.getElementById('name-input').focus();
//   }
// }

// /**
//  * Hides the "Write your name" input.
//  */
// document.getElementById('name-input-close').onclick = () => {
//   document.getElementById('name-input-wrapper').classList.add('invisible');
// }

// /**
//  * Sends the name of the user to the server and
//  * saves it in the chrome's storage when the user
//  * clicks on the OK button.
//  */
// document.getElementById('name-input-ok').onclick = (event) => {
//   changeMyUserName();
// }

// /**
//  * Sends the name of the user to the server and
//  * saves it in the chrome's storage when the user
//  * presses enter on the name input field.
//  */
// document.getElementById('name-input').onkeypress = (event) => {
//   if (event.keyCode === 13) {
//     changeMyUserName();
//   }
// }

// /**
//  * Sends a chat message to the server when the user
//  * clicks on the send button.
//  */
// document.getElementById('send').onclick = sendMessage;

// /**
//  * Sends a chat message to the server when the user
//  * presses enter in the input field.
//  */
// document.getElementById('message-input').onkeypress = (event) => {
//   if (event.keyCode === 13) {
//     sendMessage();
//   }
// }

// /**
//  * Loads older messages when the user scrolls to the top
//  * of the page.
//  */
// document.getElementById('messages').onscroll = (event) => {
//   if (document.getElementById('messages').scrollTop === 0) {
//     showLoadingOlderMessages();
//     socketIO.emit('loadOlderMessages', { room: tabUrl, oldestMessageTimestamp });
//   }
// }

// /**
//  * Detects when the user is typing and broadcasts it to
//  * other users in the same room.
//  */
// document.getElementById('message-input').onkeyup = (event) => {
//   if (document.getElementById('message-input').value === '') {
//     isTyping = false;
//     return socketIO.emit('stoppedTyping', { room: tabUrl, user });
//   }

//   if (!isTyping) {
//     socketIO.emit('typing', { room: tabUrl, user });
//     isTyping = true;
//   }
// }
