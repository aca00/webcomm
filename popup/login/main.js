var ShowLoginBtn = document.getElementById("ShowLoginBtn");
var ShowRegistrationBtn = document.getElementById("ShowRegistrationBtn");
var ForgotPasswordLink = document.getElementById("ForgotPassword");
var RegistrationitBtn = document.getElementById("RegistrationitBtn");
var EmailVerifyCheck = document.getElementById("EmailVerifyCheck");


function ShowLoginForm() {

	SetTitle("Login");

	ShowHideForm("LoginFrom", "Show");
	ShowHideForm("RegistrationFrom", "Hide");
	ShowHideForm("ForgotPasswordForm", "Hide");
	ShowHideForm("VerifyEmailAddress", "Hide")

	ActiveInactiveBtn("ShowLoginBtn", "Active");
	ActiveInactiveBtn("ShowRegistrationBtn", "Inactive");

	ShowHideFromSwitchBtn("Show");
};

function ShowRegistrationForm() {
	SetTitle("Registration");

	ShowHideForm("RegistrationFrom", "Show");
	ShowHideForm("LoginFrom", "Hide");
	ShowHideForm("VerifyEmailAddress", "Hide")
	ShowHideForm("ForgotPasswordForm", "Hide");

	ActiveInactiveBtn("ShowLoginBtn", "Inactive");
	ActiveInactiveBtn("ShowRegistrationBtn", "Active");

	ShowHideFromSwitchBtn("Show");
};

function ShowForgotPasswordForm() {

	SetTitle("Forgot Password");

	ShowHideForm("RegistrationFrom", "Hide");
	ShowHideForm("LoginFrom", "Hide");
	ShowHideForm("VerifyEmailAddress", "Hide")
	ShowHideForm("ForgotPasswordForm", "Show");

	ActiveInactiveBtn("ShowLoginBtn", "Inactive");
	ActiveInactiveBtn("ShowRegistrationBtn", "Inactive");
	ShowHideFromSwitchBtn("Hide");
}

function showEmailVerification() {
	SetTitle("Verify email address");

	ShowHideForm("RegistrationFrom", "Hide");
	ShowHideForm("LoginFrom", "Hide");
	ShowHideForm("ForgotPasswordForm", "Hide");
	ShowHideForm("VerifyEmailAddress", "Show")

	ActiveInactiveBtn("ShowLoginBtn", "Inactive");
	ActiveInactiveBtn("ShowRegistrationBtn", "Inactive");
	ShowHideFromSwitchBtn("Hide");
}

function SetTitle(Title) {
	var formTitle = document.getElementById('formTitle');
	formTitle.innerHTML = Title;
}

function ShowHideForm(FormID, ShowOrHide) {
	var Form = document.getElementById(FormID);

	if (ShowOrHide == "Show") {
		Form.style.display = 'block';
	} else {
		Form.style.display = 'none';
	}
}

function ActiveInactiveBtn(ButtonID, ActiveORInactive) {
	var Button = document.getElementById(ButtonID);

	if (ActiveORInactive == "Active") {
		Button.classList.add('active');
	} else {
		Button.classList.remove('active');
	}
}

function ShowHideFromSwitchBtn(ShowOrHide) {
	var formSwitchBtn = document.getElementById('formSwitchBtn');
	if (ShowOrHide == 'Show') {
		formSwitchBtn.style.display = '';
	} else {
		formSwitchBtn.style.display = 'none';
	}
}

function signUp(email, password) {
	chrome.runtime.sendMessage({ type: "signup", data: { email: email, password: password } });
}

ShowLoginBtn.addEventListener('click', () => {
	console.log("LOGIN: clicked ShowLoginBtn");
	ShowLoginForm();
})

ShowRegistrationBtn.addEventListener('click', () => {
	console.log("LOGIN: clicked ShowRegistrationBtn");
	ShowRegistrationForm();
})

ForgotPasswordLink.addEventListener('click', () => {
	console.log("LOGIN: clicked ForgotPasswordLink");
	ShowForgotPasswordForm();
});

EmailVerifyCheck.addEventListener('click', () => {
	console.log(`LOGIN: clicked EmailVerifyCheck`)
	chrome.runtime.sendMessage({ type: 'check-email-verified' });
})

RegistrationitBtn.addEventListener('click', async () => {
	console.log("LOGIN: clicked JoinButton");
	if (ValidateRegistrationForm()) {
		signUp(document.getElementById('RegiEmailAddres').value, document.getElementById('RegiPassword').value)
	} else {
		console.log("LOGIN: form validation failed");
	}
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log(`LOGIN: form SW: type: ${message.type}`);
	if (message.type == "signup-success") {
		showEmailVerification();
	} else if (message.type == "signup-error") {
		// update <P>
	} else if (message.type == "email-verified-status") {
		console.log(message.data);
	}
});


// end