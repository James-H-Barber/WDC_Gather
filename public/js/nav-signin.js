// Template navigation bar

fetch('/src/nav-template-signin.html')
    .then(response => response.text())
    .then(text => {
        document.getElementById('head').innerHTML = text;
    })
    .then(() => {
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
                window.removeEventListener("mousemove", move);l
            })
        })
    });

