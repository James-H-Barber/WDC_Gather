# Gather
Gather - WDC Group 15

Please note that we integrated 2 special features: both OAuth integration and emailing invitees. __We are not postgrad students!__

<hr>

## Create account
- Users create an account using their first name, last name and unique email address
    - Error is shown if user with entered email already exists in database
- Vue is used to check if all inputs are filled / valid
- A password re-enter check is performed via Vue before sending POST request to create account
<!-- New create acciunt features: -->
- When creating an account, users specify their availability for all days of the week

## Sign in
- Users can sign in using their email + password after creating an account
- Sign in with Google is also available; users need to first create a Gather account with the same email as their Google account for this to function correctly
    - If user signs in via Google and no account with matching email is found, an error message is shown instructing user to first create account
- Upon successful sign in, user is redirected to the "signed home" page, where they can see all events they are attending, in addition to a link to the *create event* page and a sign out button
    - The sign out button deletes the user's session

## Create event
- After signing in, users can create an event
- When creating an event, users must input the event name, start time & date, end time & date, location and invitees
    - Invitees recieve an email with a link to confirm the event (even users who do not have an account)
        - If users do not have an existing account, after accessing the link they will be asked to specify their availability
    - A pie chart showes invited users' preferred availability for all days of the week

## Admin panel
- Upon creation of gather database from gather.sql, a default admin is created.
- Default admin email and password are `admin@gather.com` and `qwertyuiop`.
- After signing in and accessing the signed in homepage, if user is recognised as an admin a link to the admin panel is displayed.
- Within the admin panel, admins can:
    - View all users
    - Search all users
    - Edit user details
        - First name
        - Last name
        - Delete user
        - Promote to admin
    - View all events
    - Search all events
    - Edit event details
        - Event name
        - Start time
        - End time
        - Event owner
        - Event location
-Unauthorized users can not access the admin panel


## Account settings
In account settings, users can:
- Change first name & last name
- Change email
- Change password
- Set dark mode
- Change availability
- Delete account
- When attempting to access the account settings when not logged out, the client will be redirected to the sign-in page


## Darkmode Button
A floating button which can be moved around persists across the page when signed in.
- When pressed the darkmode cookie which determines which css file to use is toggled true/false