var vueinst = new Vue({
    el: "#signIn",
    data: {
        inputError: false,
        email: null,
        password: null,
        errorMsg: null
    },
    methods: {
        checkInput: function () {
            if (!this.email || !this.password) {
                this.inputError = true;
                this.errorMsg = "Please enter both your email and password"
            } else {
                this.inputError = false;
                this.login();
            }
        },
        login: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // vueinst.loginCheck();
                    // vueinst.adminCheck();
                    window.location.href = "/signed-home/signed-home.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    vueinst.inputError = true;
                    vueinst.errorMsg = "Username or password incorrect";
                }
            };
            xhttp.open("POST", "/login", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ email: this.email, password: this.password }));
        },
        loginCheck: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    vueinst.inputError = true;
                    usercontent = JSON.parse(this.responseText);
                    firstName = usercontent[0].firstName;
                    lastName = usercontent[0].lastName;
                    //vueinst.errorMsg = "Sign in successful (no sessions yet)!";
                    vueinst.errorMsg = "Sign in successful. Hello, " + firstName + " " + lastName +"!";
                    //empty input
                    vueinst.email = null;
                    vueinst.password = null;
                } else if (this.readyState == 4 && this.status == 401) {
                    vueinst.inputError = true;
                    vueinst.errorMsg = "Error";
                }
            };
            xhttp.open("GET", "/loggedin", true);
            xhttp.send();
        },
        googleNoAccount: function() {
            vueinst.inputError = true;
            vueinst.errorMsg = "No account has been created with the same email as this Google account. Please create an account and try again."
        },
        adminCheck: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.errorMsg += " User is admin.";
                } else if (this.readyState == 4 && this.status == 401) {
                    vueinst.errorMsg += " User is not admin.";
                }
            };
            xhttp.open("GET", "/users/adminCheck", true);
            xhttp.send();
        },
    }
});

function onSignIn(googleUser) {
    console.log("Google sign in");
    var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tokensignin');

    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // login successful
        // vueinst.loginCheck();
        window.location.href = "/signed-home/signed-home.html";
    } else  if (this.readyState == 4 && this.status == 401) {
        // login failed
        vueinst.googleNoAccount();
    }
    };

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'idtoken': id_token}));
}