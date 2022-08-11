var vueinst = new Vue({
    el: "#createAccount",
    data: {
        // input check
        inputError: false,
        errorMsg: null,
        firstName: null,
        lastName: null,
        email: new URLSearchParams(window.location.search).get('email'),
        password: null,
        confirmPassword: null,
        // show password
        showPassword: false
    },
    methods: {
        checkInput: function () {
            if (!this.email || !this.password || !this.firstName || !this.lastName || !this.confirmPassword) {
                this.inputError = true;
                this.errorMsg = "Please complete all fields";
            } else if (this.password != this.confirmPassword) {
                this.inputError = true;
                this.errorMsg = "Passwords do not match";
            } else {
                this.inputError = false;
                this.emailCheck();
                // this.signUp();
            }
        },
        // Checks if user with email exists
        emailCheck: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.signUp();
                } else if (this.readyState == 4 && this.status == 409) {
                    vueinst.inputError = true;
                    vueinst.errorMsg = "Account with email already exists!";
                }
            };
            xhttp.open("POST", "/emailCheck", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ email: this.email }));
        },
        signUp: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.inputError = true;
                    vueinst.errorMsg = "Account created!";
                    //empty input
                    // vueinst.firstName = null;
                    // vueinst.lastName = null;
                    // vueinst.email = null;
                    // vueinst.password = null;
                    // vueinst.confirmPassword = null;
                    vueinst.login();
                }
            };
            xhttp.open("POST", "/signup", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password }));
        },
        login: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    window.location.href = "/signInCreateAccount/availability/availability.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    vueinst.inputError = true;
                    vueinst.errorMsg = "error";
                }
            };
            xhttp.open("POST", "/login", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ email: this.email, password: this.password }));
        }
    }
});