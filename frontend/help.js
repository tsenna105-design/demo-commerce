// =======================================
// HELP PAGE
// =======================================

// HTML Elements

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("sendMessage");

// =======================================
// SEND MESSAGE
// =======================================

sendButton.addEventListener("click",function(){

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if(name===""){

        alert("Please enter your name.");

        return;

    }

    if(email===""){

        alert("Please enter your email.");

        return;

    }

    if(message===""){

        alert("Please type your message.");

        return;

    }

    const supportMessages =
    JSON.parse(localStorage.getItem("supportMessages")) || [];

    supportMessages.push({

        name:name,
        email:email,
        message:message,
        date:new Date().toLocaleString()

    });

    localStorage.setItem(

        "supportMessages",

        JSON.stringify(supportMessages)

    );

    // Optional notification

    let notifications =
    JSON.parse(localStorage.getItem("notifications")) || [];

    notifications.unshift({

        title:"Support Request",

        message:"Your support request has been received successfully.",

        type:"success",

        time:new Date().toLocaleString(),

        read:false

    });

    localStorage.setItem(

        "notifications",

        JSON.stringify(notifications)

    );

    alert("Message sent successfully!");

    nameInput.value="";
    emailInput.value="";
    messageInput.value="";

});

// =======================================
// LOGOUT
// =======================================

const logout = document.querySelector(
'a[href="../login/login.html"]'
);

logout.addEventListener("click",function(event){

    event.preventDefault();

    if(confirm("Are you sure you want to logout?")){

        window.location.href="../login/login.html";

    }

});

// =======================================
// PAGE READY
// =======================================

console.log("Help Center Loaded Successfully");