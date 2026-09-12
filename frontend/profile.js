 // ==========================================
// PROFILE PAGE
// ==========================================

// HTML Elements

const profilePicture = document.getElementById("profilePicture");
const imageUpload = document.getElementById("imageUpload");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const username = document.getElementById("username");

const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const saveProfile = document.getElementById("saveProfile");

// ==========================================
// LOAD PROFILE
// ==========================================

const profile =
JSON.parse(localStorage.getItem("profile"));

if(profile){

    fullName.value = profile.fullName || "";

    email.value = profile.email || "";

    phone.value = profile.phone || "";

    username.value = profile.username || "";

    if(profile.image){

        profilePicture.src = profile.image;

    }

}

// ==========================================
// IMAGE PREVIEW
// ==========================================

imageUpload.addEventListener("change", function(){

    const file = this.files[0];

    if(!file){

        return;

    }

    const reader = new FileReader();

    reader.onload = function(event){

        profilePicture.src = event.target.result;

    };

    reader.readAsDataURL(file);

});

// ==========================================
// SAVE PROFILE
// ==========================================

saveProfile.addEventListener("click", function(){

    if(fullName.value.trim() === ""){

        alert("Enter your full name.");

        fullName.focus();

        return;

    }

    if(email.value.trim() === ""){

        alert("Enter your email.");

        email.focus();

        return;

    }

    if(phone.value.trim() === ""){

        alert("Enter your phone number.");

        phone.focus();

        return;

    }

    if(username.value.trim() === ""){

        alert("Enter your username.");

        username.focus();

        return;

    }

    // Password validation

    if(newPassword.value !== "" ||
       confirmPassword.value !== ""){

        if(newPassword.value !== confirmPassword.value){

            alert("Passwords do not match.");

            return;

        }

        if(newPassword.value.length < 6){

            alert("Password must be at least 6 characters.");

            return;

        }

    }

    // Save Profile

    const userProfile = {

        fullName: fullName.value,

        email: email.value,

        phone: phone.value,

        username: username.value,

        image: profilePicture.src

    };

    localStorage.setItem(
        "profile",
        JSON.stringify(userProfile)
    );

    alert("Profile Updated Successfully!");

    currentPassword.value = "";

    newPassword.value = "";

    confirmPassword.value = "";

});

// ==========================================
// LOGOUT
// ==========================================

const logout =
document.querySelector(
'a[href="login.html"]'
);

logout.addEventListener("click", function(event){

    event.preventDefault();

    const answer =
    confirm("Are you sure you want to logout?");

    if(answer){

        window.location.href =
        "login.html";

    }

});

// ==========================================
// PAGE READY
// ==========================================

console.log("Profile Page Loaded Successfully");