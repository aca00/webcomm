var uname = null;
var uid = null;
var utype = null;
var emailVerified = null;
var isAuthenticated = null;
var newRateVal = null;
var currentUrl = null;
var lastSenderId;
var oldestMessageTimestamp;

// UI elements
var contextSwitchIconRate = document.getElementById("rate-icon");
var contextSwitchIconChat = document.getElementById("chat-icon");
var contextSwitchIconAccount = document.getElementById("account-icon");

var rateInterface = document.getElementById("rate-interface");
var rateDiv = document.getElementById('rating-stars-area');
var rateClearButton = document.getElementById("rate-clear-button");
var rateSubmitButton = document.getElementById('rate-submit-button');

var chatInterface = document.getElementById("chat-interface");
var sendMessageButton = document.getElementById('send')

var accountInterface = document.getElementById("account-interface");
var emailVerficationButton = document.getElementById("email-verification-button");
var signOutButton = document.getElementById("sign-out-button");
var signInWithEmailButton = document.getElementById("sign-in-with-email-button");
var signInStatusDescription = document.getElementById("sign-in-status-description");
var userNameField = document.getElementById("user-name-field");
var signedWithEmailBlock = document.getElementById("signed-in-with-email");
var anonSignedInBlock = document.getElementById("anon-signed-in");
var emailVerficationSuccess = document.getElementById("email-verificaton-success");
var emailVerificationPending = document.getElementById("email-verification-pending");

// Function definitions

// general 
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

// rate
function rate(text) {
  let rateVal = Number(text);
  if (isNaN(rateVal)) {
    console.log("POPUP: Not a number");
  } else {
    chrome.runtime.sendMessage({ type: "rate-website", data: { rateVal: rateVal } })
  }
}

// chat 
function send(text) {
  let currTime = new Date().toISOString();

  addMessage(message = text, sender = uname, timestamp = currTime);

  chrome.runtime.sendMessage(
    {
      type: "send-message",
      data: {
        message: text,
        time: currTime
        // msgCount: msgCount
      }
    }
  )
}

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
  if (sender && sender.id && sender.id !== uid) {
    var messageSenderWrapper = document.createElement('div');
    messageSenderWrapper.classList.add('message-sender');

    var messageSenderId = document.createElement('div');
    messageSenderId.classList.add('message-sender-id');
    messageSenderId.innerHTML = sender.id + ':';

    var messageSenderName = document.createElement('div');
    messageSenderName.classList.add('message-sender-name');

    if (sender.senderName) {
      messageSenderId.classList.add('invisible');
      messageSenderName.innerText = sender.senderName + ':';
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


getAuthStatus();

// Event listeners 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`POPUP: form SW: type: ${message.type}`);
  if (message.type == "ack") {
    if (message.data.type == "progress") {
      console.log(`POPUP: ${message.data.message}`)
    }
  } else if (message.type == "allChats") {
    console.log("POPUP: receive all chats");
    console.log(message.data.chats);
  } else if (message.type == 'child-added') {

    console.log(`POPUP: Child added at index uid:  ${message.data.uid}`);
    console.log(message);

    addMessage(message.data.message,
      { id: message.data.uid, senderName: message.data.name },
      new Date(message.data.time));


    console.log(message);
  } else if (message.type == 'message-sent') {
    // console.log(`POPUP: Message sent count: ${message.data.msgCount}`);

  } else if (message.type == "rating") {
    console.log(`POPUP: rate value: ${message.data.rateVal}`);
    var radioWithValue = document.querySelector(`input[name="rating"][value="${message.data.rateVal}"]`);
    newRateVal = message.data.rateVal;
    if (radioWithValue) {
      radioWithValue.checked = true;
    }

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


contextSwitchIconRate.addEventListener('click', () => {
  rateInterface.style.display = "block";
  chatInterface.style.display = "none";
  accountInterface.style.display = "none";
});

contextSwitchIconChat.addEventListener('click', () => {
  rateInterface.style.display = "none";
  chatInterface.style.display = "block";
  accountInterface.style.display = "none";

})

contextSwitchIconAccount.addEventListener('click', () => {
  console.log("clicked")
  rateInterface.style.display = "none";
  chatInterface.style.display = "none";
  accountInterface.style.display = "block";

});


rateDiv.addEventListener("click", function () {
  console.log("POPUP: clicked rateDiv");
  var checkedRadio = document.querySelector('input[name="rating"]:checked');
  if (checkedRadio) {
    newRateVal = checkedRadio.value;
    console.log("POPUP: Selected radio button value:", newRateVal);
  }
});

rateSubmitButton.addEventListener("click", function () {
  if (newRateVal) {
    rate(newRateVal);
  }
});

rateClearButton.addEventListener("click", () => {
  console.log("POPUP: rate-clear-button-clicked")
  var checkedRadio = document.querySelector('input[name="rating"]:checked');
  checkedRadio.checked = false;
  newRateVal = 0;
});


sendMessageButton.addEventListener('click', () => {
  console.log("POPUP: clicked sendmsgbt");
  let msgText = document.getElementById('message-input').value;
  if (msgText === '') {
    return;
  }

  send(msgText);

});
