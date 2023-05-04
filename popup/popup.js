
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

    console.log(`POPUP: Child added at index uid:  ${message.data.uid}`);
    console.log(message);

    // let t;

    // if (message.data.time == "") {
    //   t = Date.now();
    // } else {
    //   t = new Date(message.data.time)
    // }

    addMessage(message.data.message,
      { id: message.data.uid, senderName: message.data.name },
      new Date(message.data.time));


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


function addMessage(message = "", sender = "defaultSender", timestamp = Date.now(), prepend = false) {

  if (!oldestMessageTimestamp || timestamp < oldestMessageTimestamp) {
    oldestMessageTimestamp = timestamp;
  }

  var li = document.createElement('li');

  // if (lastSenderId && lastSenderId === sender) {
  //   li.classList.add('continuous-message');
  // }

  // lastSenderId = sender.id;

  var messageWrapper = document.createElement('div');
  messageWrapper.className = 'message-wrapper';

  // Adds the message time
  var messageTimeWrapper = document.createElement('div');
  messageTimeWrapper.classList.add('message-time'); // parent div

  var messageTimestamp = document.createElement('div'); // invisible div element
  messageTimestamp.classList.add('message-timestamp');
  messageTimestamp.classList.add('invisible');
  messageTimestamp.innerHTML = timestamp;

  var messageReadableTime = document.createElement('div');
  messageReadableTime.classList.add('message-readable-time');
  messageReadableTime.innerHTML = timestamp.toLocaleString();

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

