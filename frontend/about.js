// ==========================================
// ABOUT PAGE
// ==========================================

// Wait until page loads

document.addEventListener("DOMContentLoaded", () => {

    animateNumbers();

    console.log("About Page Loaded Successfully");

});

// ==========================================
// LOGOUT
// ==========================================

const logout = document.querySelector(
'a[href="../login/login.html"]'
);

if(logout){

    logout.addEventListener("click", function(event){

        event.preventDefault();

        const answer = confirm(
            "Are you sure you want to logout?"
        );

        if(answer){

            window.location.href =
            "../login/login.html";

        }

    });

}

// ==========================================
// ANIMATE STATISTICS
// ==========================================

function animateNumbers(){

    const stats = document.querySelectorAll(".stat-card h2");

    stats.forEach(stat=>{

        const text = stat.innerText;

        const number = parseFloat(text);

        if(isNaN(number)) return;

        const suffix = text.replace(number, "");

        let current = 0;

        const increment = number / 100;

        const timer = setInterval(()=>{

            current += increment;

            if(current >= number){

                stat.innerText = text;

                clearInterval(timer);

            }else{

                if(number >= 1000){

                    stat.innerText =
                    Math.floor(current).toLocaleString() + suffix;

                }else{

                    stat.innerText =
                    current.toFixed(1) + suffix;

                }

            }

        },20);

    });

}

// ==========================================
// FADE-IN ANIMATION
// ==========================================

const observer = new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity = "1";

            entry.target.style.transform =
            "translateY(0px)";

        }

    });

});

const sections = document.querySelectorAll(

".about-card, .stat-card, .team"

);

sections.forEach(section=>{

    section.style.opacity = "0";

    section.style.transform =

    "translateY(40px)";

    section.style.transition =

    "0.6s ease";

    observer.observe(section);

});

// ==========================================
// WELCOME MESSAGE
// ==========================================

setTimeout(()=>{

    console.log(

        "Welcome to the About Us page."

    );

},1000);