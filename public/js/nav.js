// Template navigation bar

fetch('/src/nav-template.html')
    .then(response => response.text())
    .then(text => {
        document.getElementById('head').innerHTML = text;
    })
    .then(() => {
        vue = new Vue({
            el: '#header',
            data: {
                accountSel: false,
                admin: false,
                firstName: '',
                lastName: '',
                email: '',
                dModeTop: '600px'
            },
            methods: {
                adminCheck: function() {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            vue.admin = true;
                        } else if ( this.readyState == 4 ) {
                            vue.admin = false;
                        }
                    };
                    xhttp.open("GET", "/users/adminCheck", true);
                    xhttp.send();
                },
                getName: function() {
                    xhttp = new XMLHttpRequest();

                    xhttp.onreadystatechange = function() {
                        if ( this.readyState === 4 && this.status === 200 ) {
                            let response = JSON.parse(this.responseText);
                            console.log(response);
                            vue.firstName = response[0].firstName;
                            vue.lastName = response[0].lastName;
                            vue.email = response[0].email;
                        }
                    }

                    xhttp.open('GET', '/users/accountSettings', true)
                    xhttp.send();
                },
            }
        })
        vue.adminCheck();
        vue.getName();

        // Close dropdown when clicking outside of button
        window.addEventListener("click", e => {
            let button = document.getElementById("account-button");
            if ( e.target != button ) {
                vue.accountSel = false;
            }
        })

        var counter = 0

        const html = document.querySelector("html")
        const header = document.getElementById("header")

        window.setInterval(() => {
            boxShadow();
        })

        // Add shadow class to header when y-scroll is > 0
        function boxShadow() {
            if ( html.scrollTop != 0 ) {
                header.classList.add('shadow');
            }
            else {
                header.classList.remove('shadow')
            }
        }

        // floating darkmode button
        let darkB = document.getElementById("darkModeDiv");
        darkB.addEventListener("mousedown", () => {
            function move(e) {
                vue.dModeTop = `${e.clientY - 20}px`;
            }
            window.addEventListener("mousemove", move);
            // Stop movement
            window.addEventListener("mouseup", () => {
                window.removeEventListener("mousemove", move);
            })
        })
    });

