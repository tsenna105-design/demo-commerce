// ======================================
// NOTIFICATIONS PAGE
// ======================================

// Storage Key
const STORAGE_KEY = "notifications";

// Load Notifications
let notifications =
JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// HTML Elements
const notificationList =
document.getElementById("notificationList");

const markAllRead =
document.getElementById("markAllRead");

const clearNotifications =
document.getElementById("clearNotifications");

// ======================================
// DEFAULT NOTIFICATIONS
// ======================================

if(notifications.length === 0){

    notifications = [

        {

            title:"Welcome!",

            message:"Welcome to the POS System.",

            type:"info",

            time:new Date().toLocaleString(),

            read:false

        },

        {

            title:"Discount",

            message:"Enjoy 10% off selected products.",

            type:"success",

            time:new Date().toLocaleString(),

            read:false

        }

    ];

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications)
    );

}

// ======================================
// DISPLAY NOTIFICATIONS
// ======================================

function displayNotifications(){

    notificationList.innerHTML = "";

    if(notifications.length === 0){

        notificationList.innerHTML = `

        <div class="empty-message">

            <i class="fas fa-bell-slash"></i>

            <h2>No Notifications</h2>

            <p>You have no notifications.</p>

        </div>

        `;

        return;

    }

    notifications.forEach((notification,index)=>{

        let icon = "fa-circle-info";
        let color = "info";

        if(notification.type === "success"){

            icon = "fa-check-circle";
            color = "success";

        }

        if(notification.type === "warning"){

            icon = "fa-triangle-exclamation";
            color = "warning";

        }

        if(notification.type === "error"){

            icon = "fa-circle-xmark";
            color = "error";

        }

        notificationList.innerHTML += `

        <div class="notification-card ${notification.read ? "" : "unread"}">

            <div class="icon ${color}">

                <i class="fas ${icon}"></i>

            </div>

            <div class="content">

                <h3>${notification.title}</h3>

                <p>${notification.message}</p>

                <small>${notification.time}</small>

            </div>

            <button
            class="mark-btn"
            onclick="markAsRead(${index})">

                ✔

            </button>

        </div>

        `;

    });

}

displayNotifications();

// ======================================
// MARK ONE AS READ
// ======================================

function markAsRead(index){

    notifications[index].read = true;

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications)
    );

    displayNotifications();

}

// ======================================
// MARK ALL AS READ
// ======================================

markAllRead.addEventListener("click",()=>{

    notifications.forEach(notification=>{

        notification.read = true;

    });

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications)
    );

    displayNotifications();

    alert("All notifications marked as read.");

});

// ======================================
// CLEAR ALL
// ======================================

clearNotifications.addEventListener("click",()=>{

    const answer =
    confirm("Delete all notifications?");

    if(answer){

        notifications = [];

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(notifications)
        );

        displayNotifications();

    }

});

// ======================================
// LOGOUT
// ======================================

const logout =
document.querySelector(
'a[href="../login/login.html"]'
);

logout.addEventListener("click",(event)=>{

    event.preventDefault();

    const answer =
    confirm("Are you sure you want to logout?");

    if(answer){

        window.location.href =
        "login.html";

    }

});

// ======================================
// PAGE READY
// ======================================

console.log("Notifications Loaded Successfully");