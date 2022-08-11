// form validation
var vueinst = new Vue({
  el: "#createEvent",
  data: {
      // input check
      inputError: false,
      errorMsg: null,
      eventName: null,
      currentUserID: null,
  },
  methods: {
      checkInputName: function () { //check input event name
          if (!this.eventName) {
              this.inputError = true;
              this.errorMsg = "Please complete all fields";
          } else {
              this.inputError = false;
              this.createEvent(); //create the event to allow for invites
              window.location.href = "/createEvent/createEventInvite.html"
          }
      },
      getUserID: function () {
        var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    response = JSON.parse(this.responseText);
                    userID = response[0].userID;
                    console.log(userID);
                    vueinst.currentUserID = userID;
                } else if (this.readyState == 4 && this.status == 401) {
                    vueinst.inputError = true;
                    vueinst.errorMsg = "Error";
                }
            };
            xhttp.open("GET", "/users/userID", true);
            xhttp.send();
      },
      createEvent: function() { //create the event using event name to allow for invites
        console.log('creating event')
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                vueinst.inputError = true;
                vueinst.errorMsg = "Event created!";
                //empty input
                vueinst.eventName = null;
                vueinst.eventLocation = null;
                vueinst.eventStartTime = null;
                vueinst.eventEndTime = null;
              } else if (this.readyState == 4 && this.status == 401) {
                vueinst.inputError = true;
                vueinst.errorMsg = "errorr";
              }
          };
          console.log('posting')
          xhttp.open("POST", "/users/createEvent", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          console.log(`USERID = "${this.currentUserID}"`);
          xhttp.send(JSON.stringify({ eventName: this.eventName, eventOwner: this.currentUserID }));
      }
  },
  beforeMount() {
    this.getUserID();
  }
});




//createEventInvite.html
var inviteVueinst = new Vue({
  el: "#invite",
  data: {
      // input check
      inputError: false,
      errorMsg: null,
      emailField: '',
      invitedUserID: null,
      currentEventID: null,
  },
  methods: {
      checkEmailInput: function () {
          if (!this.emailField) {
              this.inputError = true;
              this.errorMsg = "Please enter a users email";
          } else {
              this.inputError = false;
              this.getInvitedUser();
          }
      },

      //get user id where email = user input
    //   getInvitedUser: function() {
    //     xhttp = new XMLHttpRequest();

    //     xhttp.onreadystatechange = function() {
    //         if ( this.readyState == 4 && this.status == 200 ) {
    //             response = JSON.parse(this.responseText);
    //             invitedUserID = response[0].userID;
    //             console.log(invitedUserID);
    //             inviteVueinst.invitedUserID = invitedUserID;
    //             return;
    //         }
    //     }
    //     if ( this.emailField != '' ) {
    //       xhttp.open('GET', `/users/getInvitedUser?email=${this.emailField}`, true);
    //     } else {
    //       this.errorMsg = "Please enter a users email";
    //     }
    //     xhttp.send();
    //     this.getEventID();
    // },

      getEventID: function () {
        var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    response = JSON.parse(this.responseText);
                    currentEventID = response[0].eventID;
                    console.log(currentEventID);
                    inviteVueinst.currentEventID = currentEventID;
                    inviteVueinst.invite();
                } else if (this.readyState == 4 && this.status == 401) {
                    inviteVueinst.inputError = true;
                    inviteVueinst.errorMsg = "Error";
                }
            };
            xhttp.open("GET", "/users/getEventID", true);
            xhttp.send();
            // this.invite();
      },

      //post request for inserting eventID and invited user ID into table
      invite: function() {
        // Guard clause
        console.log("test");
        if ( this.emailField == '' ) {
          return;
        }

        // let eventId = this.getEventID();
        if ( this.currentEventID == null || this.currentEventID == '' ) {
          return;
        }

        console.log('creating event');
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                inviteVueinst.inputError = true;
                inviteVueinst.errorMsg = "User invited";
                //empty input
              } else if (this.readyState == 4 && this.status == 401) {
                inviteVueinst.inputError = true;
                inviteVueinst.errorMsg = "error";
              }
          };
          console.log('posting attendance to database')
          xhttp.open("POST", "/users/invite", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          console.log(`EMAIL = "${this.emailField}"`);
          console.log(`EVENTID = "${this.currentEventID}"`);
          xhttp.send(JSON.stringify({ email: this.emailField, eventID: this.currentEventID }));
      }
  },
});

//createEventTime

var timeVueinst = new Vue({
  el: "#time",
  data: {
      // input check
      inputError: false,
      errorMsg: null,
      currentEventID: null,
      eventStartTime: null,
      eventEndTime: null,
  },
  methods: {
      checkDateInput: function () {
          if (!this.eventStartTime) {
              this.inputError = true;
              this.errorMsg = "Please enter a date";
          } else {
              this.inputError = false;
              this.getTimeEventID();
              window.location.href = "/createEvent/createEventLocation.html"
          }
      },

      getTimeEventID: function () {
        var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    response = JSON.parse(this.responseText);
                    currentEventID = response[0].eventID;
                    console.log(currentEventID);
                    timeVueinst.currentEventID = currentEventID;
                } else if (this.readyState == 4 && this.status == 401) {
                    timeVueinst.inputError = true;
                    timeVueinst.errorMsg = "Error";
                }
            };
            xhttp.open("GET", "/users/getEventID", true);
            xhttp.send();
            this.setTime();
      },

      //post request for inserting eventID and invited user ID into table
      setTime: function() {
        console.log('Setting event time')
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                timeVueinst.inputError = true;
                timeVueinst.errorMsg = "Date set";
                //empty input
              } else if (this.readyState == 4 && this.status == 401) {
                timeVueinst.inputError = true;
                timeVueinst.errorMsg = "error";
              }
          };
          console.log('posting time to database')
          xhttp.open("POST", "/users/setTime", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          console.log(`EVENTSTARTTIME = "${this.eventStartTime}"`);
          console.log(`EVENTENDTIME = "${this.eventEndTime}"`);
          xhttp.send(JSON.stringify({eventStartTime: this.eventStartTime, eventEndTime: this.eventEndTime, eventID: this.currentEventID }));
      }
  },
  beforeMount() {
    this.getTimeEventID();
  }
});

var locationVueinst = new Vue({
  el: "#location",
  data: {
      // input check
      inputError: false,
      errorMsg: null,
      currentEventID: null,
      eventLocation: null
  },
  methods: {
      checkLocationInput: function () {
          if (!this.eventLocation) {
              this.inputError = true;
              this.errorMsg = "Please enter a location";
          } else {
              this.inputError = false;
              this.getLocationEventID();

          }
      },

      getLocationEventID: function () {
        var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    response = JSON.parse(this.responseText);
                    currentEventID = response[0].eventID;
                    console.log(currentEventID);
                    locationVueinst.currentEventID = currentEventID;
                } else if (this.readyState == 4 && this.status == 401) {
                    locationVueinst.inputError = true;
                    locationVueinst.errorMsg = "Error";
                }
            };
            xhttp.open("GET", "/users/getEventID", true);
            xhttp.send();
            this.setLocation();
      },

      //post request for inserting eventID and invited user ID into table
      setLocation: function() {
        console.log('Setting event location')
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                locationVueinst.inputError = true;
                locationVueinst.errorMsg = "location set";
                //empty input
              } else if (this.readyState == 4 && this.status == 401) {
                locationVueinst.inputError = true;
                locationVueinst.errorMsg = "error";
              }
          };
          console.log('posting location to database')
          xhttp.open("POST", "/users/setLocation", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          console.log(`LOCATION = "${this.eventLocation}"`);
          console.log(`EVENTID = "${this.currentEventID}"`);
          xhttp.send(JSON.stringify({eventLocation: this.eventLocation, eventID: this.currentEventID }));
      }
  },
  beforeMount() {
    this.getLocationEventID();
  }
});




//Guest list code

function addGuests()
{
  let addGuest = document.getElementById('invite');
  let guestList = document.getElementById('guestList');
  let inputField = document.getElementById("description");
  var paragraph = document.createElement('h3');
  paragraph.innerText = inputField.value;
  guestList.appendChild(paragraph);
}


function setupPie()
{
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {

  var data = google.visualization.arrayToDataTable([
  ['Day', 'Number Available'],
  ['Monday', 11],
  ['Tuesday', 2],
  ['Wednesday', 2],
  ['Friday', 2],
  ['Saturday', 7],
  ['Sunday', 7]
  ]);

  var options = {
    title: 'Guests Availability'
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}




flatpickr("input[type = datetime - local]", {});

//This is the function for create event map
function initMap(){
  var location =
  {
    lat: 0,
    lng: 0
  }

  var options = {
    center:location,
    zoom: 9
  }

  //dertermine user location and create map
  if(navigator.geolocation) {
    console.log('geolocation available');

    navigator.geolocation.getCurrentPosition((loc) => {
      location.lat = loc.coords.latitude;
      location.lng = loc.coords.longitude;

      map = new google.maps.Map(document.getElementById("map"), options);
    },
    (err) => {
      console.log("Location denied");
      map = new google.maps.Map(document.getElementById("map"), options);
    })
  }else{
    console.log('geolocation unavailable');

  }

  //auto completing the location fields
  autocomplete = new google.maps.places.Autocomplete(document.getElementById("location"),
  {
    componentRestrictions: {'country': ['aus']}, //locations are limited to Australia
    fields: ['geometry', 'name'], //additional fields cost money and my account will be charged
    types: ['establishment' ] //additional types cost money and my account will be charged
  })

  //this will create an info window on the marker that can show event iformation when clicked
  autocomplete.addListener("place_changed", () => {
    var infowindow = new google.maps.InfoWindow({
      content: "<h1>HTML event information goes here</h1>"
    });

    //this creates the marker on the map
    const place = autocomplete.getPlace();
    var marker = new google.maps.Marker({
      position: place.geometry.location,
      title: place.name,
      map: map
    })
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
  });

}


