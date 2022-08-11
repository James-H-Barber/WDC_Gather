// vue = new Vue({
//     el: '#header',
//     data: {
//         accountSel: false,
//     }
// });

// window.addEventListener("click", e => {
//     let button = document.getElementById("account-button");
//     if ( e.target != button ) {
//         vue.accountSel = false;
//     }
// })

// var counter = 0

// const html = document.querySelector("html")
// const header = document.getElementById("header")


// function boxShadow() {
    //     if ( html.scrollTop != 0 ) {
        //         header.classList.add('shadow');
        //     }
        //     else {
            //         header.classList.remove('shadow')
            //     }
            // }
const darkmodeCSS = document.getElementById('main-stylesheet');

function getCookie(cookieName) {
    let name = cookieName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let splitCookie = decodedCookie.split(';');
    for ( let i = 0; i < splitCookie.length; i++ ) {
        let c = splitCookie[i];
        while ( c.charAt(0) == ' ' ) {
            c = c.substring(1);
        }
        if ( c.indexOf(name) == 0 ) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function checkDarkmode() {
    // Check if darkmode is currently on
    cookies = document.cookie;
    let darkmode = getCookie('darkmode');

    // Checks if the cookie for darkmode has been created
    if ( darkmode == '' ) {
        // Default: darkmode --> false
        document.cookie = 'darkmode=false;path=/';
        return false;
    }

    if ( darkmode == 'true' ) {
        return true;
    }

    return false;
}

function darkmode() {
    console.log("here");
    let darkmode = checkDarkmode();

    if ( darkmode == true ) {
        darkmodeCSS.href='../stylesheets/style-darkmode.css';
    } else {
        darkmodeCSS.href='../stylesheets/style.css';
    }
}

function changeDarkmode() {
    let isDark = checkDarkmode();

    if ( isDark == true ) {
        document.cookie = 'darkmode=false;path=/';
    } else {
        document.cookie = 'darkmode=true;path=/'
    }
    darkmode();
}

darkmode();