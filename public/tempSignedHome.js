var vueinst = new Vue({
    el: "#app",
    data: {
        admin: false,
        firstName: null,
        lastName: null
    },
    methods: {
        loginCheck: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    vueinst.inputError = true;
                    usercontent = JSON.parse(this.responseText);
                    vueinst.firstName = usercontent[0].firstName;
                    vueinst.lastName = usercontent[0].lastName;
                } else if (this.readyState == 4 && this.status == 401) {
                    vueinst.firstName = "Error";
                    vueinst.lastName = "Error";
                }
            };
            xhttp.open("GET", "/loggedin", true);
            xhttp.send();
        },
        adminCheck: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.admin = true;
                } else {
                    vueinst.admin = false;
                }
            };
            xhttp.open("GET", "/users/adminCheck", true);
            xhttp.send();
        },
        signOut: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.loginCheck();
                    window.location.href = "https://matthewbeltrame-code50-100504743-jjgvwxqwjh5xvp-8080.githubpreview.dev/";
                }
            };
            xhttp.open("POST", "/logout", true);
            xhttp.send();
        }
    },
    beforeMount() {
        this.loginCheck();
        this.adminCheck();
    }
});