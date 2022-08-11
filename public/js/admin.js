settings = new Vue({
    el: '#main',
    data: {
        title: 'Personal Info',
        selected: 1,
        firstName: '',
        lastName: '',
        displayLastName: true,
        email: '',
        userSearchField: '',
        users: [],
        eventSearchField: '',
        events: [],
    },
    methods: {
        getUsers: function() {
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if ( this.readyState == 4 && this.status == 200 ) {
                    let response = JSON.parse(this.responseText);
                    settings.users = response;
                    return;
                }
            }
            if ( this.userSearchField != '' ) {
                xhttp.open('GET', `/users/getUsers?user=${this.userSearchField}`, true);
            } else {
                xhttp.open('GET', `/users/getUsers?all=true`, true);
            }
            xhttp.send();
        },
        deleteUser: function(user) {
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if ( this.readyState == 4 && this.status == 200 ) {
                    settings.getUsers();
                    return;
                }
            }
            xhttp.open('POST', `/users/adminDeleteUser?email=${user}`, true);
            xhttp.send();
        },
        changeName: function(user) {
            let name = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }

            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200 ) {
                    settings.getUsers();
                }
            }

            xhttp.open('POST', '/users/adminChangeName', true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(name));
        },
        makeAdmin: function(user) {
            let id = user.userID;

            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200 ) {
                    settings.getUsers();
                    alert(`Successfully made ${user.firstName} an administrator`);
                    return;
                }
                else if ( this.readyState == 4 && this.status == 501 ) {
                    alert('This account is already an administrator');
                }
            }
            xhttp.open('POST', `/users/makeAdmin?id=${id}`, true);
            xhttp.send();
        },
        getEvents: function() {
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if ( this.readyState == 4 && this.status == 200 ) {
                    let response = JSON.parse(this.responseText);
                    settings.events = response;
                    console.log(response);
                    return;
                }
            }
            if ( this.eventSearchField != '' ) {
                xhttp.open('GET', `/users/getEvents?event=${this.eventsSearchField}`, true);
            } else {
                xhttp.open('GET', `/users/getEvents?all=true`, true);
            }
            xhttp.send();
        },
        changeEvent(e) {
            let event = {
                eventID: e.eventID,
                eventName: e.eventName,
                eventOwner: e.eventOwner,
                eventStartTime: e.eventStartTime,
                eventEndTime: e.eventEndTime
              }
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200 ) {
                    settings.getEvents();
                    return;
                }
            }

            xhttp.open('POST', '/users/adminChangeEvent', true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(event));
        },
        deleteEvent: function(event) {
            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if ( this.readyState == 4 && this.status == 200 ) {
                    settings.getEvents();
                    return;
                }
            }
            xhttp.open('POST', `/users/adminDeleteEvent?id=${event}`, true);
            xhttp.send();
        },
    }
})

// Function run when onclick --> Save button
// Submits form data to server through POST request
function submitForm() {
    let response = document.getElementById('response');
    let form = document.querySelector('form');
    let formData = new FormData(form);
    var value = {};
    response.innerText = '';

    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if ( this.readyState === 4 && this.status === 200 ) {
            response.style.color = 'green';
            response.innerText = 'New settings saved successfully';
        } else if ( this.readyState === 4 ) {
            response.style.color = 'red';
            response.innerText = 'Submission error';
        }
    }
    // Profile settings
    if ( settings.selected == 1 ) {
        value = Object.fromEntries(formData.entries());
        xhttp.open('POST', '/users/changeProfileSettings', true);
    }
    else {
        return;
    }
    console.log('sending form data:', value);

    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(value));
}

// Populates form data on page load
function getFormData() {
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if ( this.readyState === 4 && this.status === 200 ) {
            let response = JSON.parse(this.responseText);
            console.log(response);
            populateForm(response[0]);
        }
    }

    xhttp.open('GET', '/users/accountSettings', true)
    xhttp.send();
}

function populateForm(values) {
    settings.firstName = values.firstName;
    settings.lastName = values.lastName;
    settings.email = values.email;
        // settings.displayLastName = values.displayLastName;
        // settings.shareAnalytics = values.shareAnalytics;
}


getFormData();