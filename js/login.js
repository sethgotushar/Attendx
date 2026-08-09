/* =========================================================
   ATTENDX PROFILE / LOGIN SYSTEM
   ========================================================= */

const ATTENDX_PROFILE_KEY = "attendxProfile";

let selectedAvatar = "assets/avatars/avatar1.png";


/* =========================================================
   PAGE START
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadSavedProfile();

    setupAvatarButtons();

});


/* =========================================================
   AVATAR SELECTION
   ========================================================= */

function setupAvatarButtons() {

    const avatars =
        document.querySelectorAll(".avatar-choice");

    avatars.forEach(function (avatar) {

        avatar.addEventListener("click", function () {

            selectAvatar(this);

        });

    });

}


/* =========================================================
   SELECT AVATAR
   ========================================================= */

function selectAvatar(element) {

    const avatar =
        element.getAttribute("data-avatar");

    if (!avatar) {
        return;
    }

    selectedAvatar = avatar;


    /* Remove selection */

    document
        .querySelectorAll(".avatar-choice")
        .forEach(function (item) {

            item.classList.remove(
                "selected-avatar"
            );

        });


    /* Add selection */

    element.classList.add(
        "selected-avatar"
    );


    /* Change profile preview */

    const profileImage =
        document.getElementById(
            "profileImage"
        );

    if (profileImage) {

        profileImage.src =
            selectedAvatar;

    }

}


/* =========================================================
   SAVE PROFILE
   ========================================================= */

function saveProfile() {

    const nameInput =
        document.getElementById(
            "studentName"
        );

    const targetInput =
        document.getElementById(
            "attendanceTarget"
        );


    if (!nameInput) {

        alert("Name field was not found.");

        return;

    }


    if (!targetInput) {

        alert("Attendance criterion field was not found.");

        return;

    }


    const name =
        nameInput.value.trim();


    const target =
        Number(targetInput.value);


    /* -------------------------
       CHECK NAME
       ------------------------- */

    if (name.length === 0) {

        alert(
            "Please enter your name first."
        );

        nameInput.focus();

        return;

    }


    /* -------------------------
       CHECK TARGET
       ------------------------- */

    if (
        !Number.isFinite(target) ||
        target < 1 ||
        target > 100
    ) {

        alert(
            "Please enter an attendance criterion between 1 and 100."
        );

        targetInput.focus();

        return;

    }


    /* =====================================================
       CREATE PROFILE
       ===================================================== */

    const profile = {

        name: name,

        avatar: selectedAvatar,

        attendanceTarget: target

    };


    /* =====================================================
       SAVE
       ===================================================== */

    localStorage.setItem(

        ATTENDX_PROFILE_KEY,

        JSON.stringify(profile)

    );


    /* =====================================================
       UPDATE SCREEN
       ===================================================== */

    updateProfileScreen(profile);


    /* =====================================================
       SUCCESS MESSAGE
       ===================================================== */

    const message =
        document.getElementById(
            "profileMessage"
        );

    if (message) {

        message.textContent =
            "✓ Profile saved successfully!";

        message.className =
            "profile-message success";

    }


    /* =====================================================
       SHOW PROCEED BUTTON
       ===================================================== */

    const proceedButton =
        document.getElementById(
            "proceedButton"
        );

    if (proceedButton) {

        proceedButton.style.display =
            "inline-flex";

    }

}


/* =========================================================
   UPDATE PROFILE SCREEN
   ========================================================= */

function updateProfileScreen(profile) {

    const profileImage =
        document.getElementById(
            "profileImage"
        );


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileClass =
        document.getElementById(
            "profileClass"
        );


    if (profileImage) {

        profileImage.src =
            profile.avatar;

    }


    if (profileName) {

        profileName.textContent =
            profile.name;

    }


    if (profileClass) {

        profileClass.textContent =
            "Target attendance: " +
            profile.attendanceTarget +
            "%";

    }

}


/* =========================================================
   LOAD SAVED PROFILE
   ========================================================= */

function loadSavedProfile() {

    const saved =
        localStorage.getItem(
            ATTENDX_PROFILE_KEY
        );


    if (!saved) {

        return;

    }


    try {

        const profile =
            JSON.parse(saved);


        /* Restore avatar */

        if (profile.avatar) {

            selectedAvatar =
                profile.avatar;

        }


        /* Restore name */

        const nameInput =
            document.getElementById(
                "studentName"
            );

        if (
            nameInput &&
            profile.name
        ) {

            nameInput.value =
                profile.name;

        }


        /* Restore criterion */

        const targetInput =
            document.getElementById(
                "attendanceTarget"
            );

        if (
            targetInput &&
            profile.attendanceTarget
        ) {

            targetInput.value =
                profile.attendanceTarget;

        }


        /* Restore preview */

        updateProfileScreen(profile);


        /* Highlight correct avatar */

        document
            .querySelectorAll(
                ".avatar-choice"
            )
            .forEach(function (avatar) {

                avatar.classList.remove(
                    "selected-avatar"
                );


                if (
                    avatar.getAttribute(
                        "data-avatar"
                    ) === profile.avatar
                ) {

                    avatar.classList.add(
                        "selected-avatar"
                    );

                }

            });


    } catch (error) {

        console.error(
            "AttendX profile error:",
            error
        );

    }

}


/* =========================================================
   PROCEED TO CALCULATOR
   ========================================================= */

function proceedToCalculator() {

    const saved =
        localStorage.getItem(
            ATTENDX_PROFILE_KEY
        );


    if (!saved) {

        alert(
            "Please save your profile first."
        );

        return;

    }


    window.location.href =
        "calculator.html";

}


/* =========================================================
   RESET PROFILE
   ========================================================= */

function logout() {

    const confirmReset =
        confirm(
            "Reset your AttendX profile?"
        );


    if (!confirmReset) {

        return;

    }


    localStorage.removeItem(
        ATTENDX_PROFILE_KEY
    );


    selectedAvatar =
        "assets/avatars/avatar1.png";


    const nameInput =
        document.getElementById(
            "studentName"
        );

    if (nameInput) {

        nameInput.value = "";

    }


    const targetInput =
        document.getElementById(
            "attendanceTarget"
        );

    if (targetInput) {

        targetInput.value = 75;

    }


    const profileImage =
        document.getElementById(
            "profileImage"
        );

    if (profileImage) {

        profileImage.src =
            "assets/avatars/avatar1.png";

    }


    const profileName =
        document.getElementById(
            "profileName"
        );

    if (profileName) {

        profileName.textContent =
            "Student";

    }


    const profileClass =
        document.getElementById(
            "profileClass"
        );

    if (profileClass) {

        profileClass.textContent =
            "Target attendance: 75%";

    }


    document
        .querySelectorAll(
            ".avatar-choice"
        )
        .forEach(function (avatar) {

            avatar.classList.remove(
                "selected-avatar"
            );

        });


    const firstAvatar =
        document.querySelector(
            ".avatar-choice"
        );

    if (firstAvatar) {

        firstAvatar.classList.add(
            "selected-avatar"
        );

    }


    alert(
        "AttendX profile has been reset."
    );

}
