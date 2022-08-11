settings = new Vue({
    el: '#main',
    data: {
        title: 'Profile',
        selected: 1,
        firstName: '',
        lastName: '',
        displayLastName: true,
        email: '',
        darkMode: checkDarkmode()? true : false,
        shareAnalytics: false,
        password: '',
        oldPassword: '',
        newPassword: ['', ''],
        passwordPrompt: ['', '', ''],
        passwordCheck: false,
        availability: [false, false, false, false, false, false, false]
    },
    methods: {
        passwordLength: function() {
            // Old password must be greater than 5 characters
            if ( this.oldPassword.length < 6 ) {
                this.passwordPrompt[0] = 'Old password must be longer than 5 characters';
                this.passwordCheck = false;
                return;
            }
            this.passwordPrompt[0] = '';

            // New password must be greater than 5 characters
            if ( this.newPassword[0].length < 6 ) {
                this.passwordPrompt[1] = 'New password must be longer than 5 characters';
                this.passwordCheck = false;
                return;
            }

            // New password can't be the same as old password
            if ( this.newPassword[0] == this.oldPassword ) {
                this.passwordPrompt[1] = 'Cannot be the same as the old password';
                this.passwordCheck = false;
                return;
            }
            this.passwordPrompt[1] = '';

            // New password must be == Repeated password
            if ( this.newPassword[0] != this.newPassword[1] ) {
                this.passwordPrompt[2] = 'New passwords do not match!';
                this.passwordCheck = false;
                return;
            }
            this.passwordPrompt[2] = '';
            this.passwordCheck = true;
            return;
        },
        deleteAccount: function() {
            if ( this.password.length < 5 ) {
                alert('Must type in password with length > 5');
                return;
            }

            xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if ( this.readyState == 4 && this.status == 200 ) {
                    window.location.href = '/';
                }
                else if ( this.readyState == 4 ) {
                    alert("Unable to process request, please ensure your password is correct");
                }

            }
            xhttp.open('POST', `/users/deleteAccount?password=${this.password}`, true);
            xhttp.send();
        }
    }
})

function toggleHidden(target) {
    document.getElementById(target).classList.toggle('hidden');
}

// Function run when onclick --> Save button
// Submits form data to server through POST request
function submitForm() {
    let response = document.getElementById('response');
    let form = document.querySelector('form');
    let formData = new FormData(form);
    var value = {};
    response.innerText = '';

    // If error in form, do not send
    if ( !settings.passwordCheck && settings.selected == 2) {
        return;
    }

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
    // Password settings
    if ( settings.selected == 2 ) {
        xhttp.open('POST', '/users/changePasswordSettings', true);
        value = { oldPassword: settings.oldPassword, newPassword: settings.newPassword};
    }
    // Availability settings
    if ( settings.selected == 3) {
        value = { 'availability': settings.availability };
        xhttp.open('POST', '/users/setAvailability', true);
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
    settings.availability = JSON.parse(values.weekDays);
}


getFormData();