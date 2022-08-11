vue = new Vue({
    el: '#days',
    data: {
        availability: [false, false, false, false, false, false, false],
        linkKey: ''
    },
    methods: {
        getParams: function() {
            let params = (new URL(document.location)).searchParams;
            this.linkKey = params.get("key");
        }
    }
});

vue.getParams();

// Function run when onclick --> Save button
// Submits form data to server through POST request
function submitForm() {
    let response = document.getElementById('response');
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if ( this.readyState === 4 && this.status === 200 ) {
            window.location.href = "/";
        } else if ( this.readyState === 4 ) {
            response.style.color = 'red';
            response.innerText = 'Submission error';
        }
    }

    // Availability settings
    let value = { 'availability': vue.availability, key: vue.linkKey };
    xhttp.open('POST', '/setAvailability', true);

    console.log('sending form data:', value);

    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(value));
}

function setAttending() {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if ( this.readyState === 4 && this.status === 200 ) {
            submitForm();
        }
    }
    xhttp.open('POST', `/setAttending?linkKey=${vue.linkKey}`, true);
    xhttp.send();
}