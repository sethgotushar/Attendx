/* ============================================================
   ATTENDX PROFILE SYSTEM
   ============================================================ */


/* ============================================================
   STORAGE KEY
   ============================================================ */

const PROFILE_KEY = "attendxProfile";


/* ============================================================
   CURRENT AVATAR
   ============================================================ */

let selectedAvatar = "assets/avatars/avatar1.png";


/* ============================================================
   PAGE LOAD
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    loadProfile();

    setupAvatarSelection();

});


/* ============================================================
   AVATAR SELECTION
   ============================================================ */

function changeAvatar(element) {

    if (!element) {
        return;
    }

    const avatar =
        element.getAttribute("data-avatar");

    if (!avatar) {
        return;
    }

    selectedAvatar = avatar;


    /* Update preview */

    const profileImage =
        document.getElementById("profileImage");

    if (profileImage) {

        profileImage.src =
            selectedAvatar;

    }


    /* Remove selection from all avatars */

    document
        .querySelectorAll(".avatar-choice")
        .forEach(function (avatarElement) {

            avatarElement.classList.remove(
                "selected-avatar"
            );

        });


    /* Select current avatar */

    element.classList.add(
        "selected-avatar"
    );

});


/* ============================================================
   AVATAR SETUP
   ============================================================ */

function setupAvatarSelection() {

    const avatars =
        document.querySelectorAll(
            ".avatar-choice"
        );


    avatars.forEach(function (avatar) {

        avatar.addEventListener(
            "click",
            function () {

                changeAvatar(this);

            }
        );

    });

}


/* ============================================================
   SAVE PROFILE
   ============================================================ */

function saveProfile() {

    const nameInput =
        document.getElementById(
            "studentName"
        );


    const targetInput =
        document.getElementById(
            "attendanceTarget"
        );


    const message =
        document.getElementById(
            "profileMessage"
        );


    const name =
        nameInput.value.trim();


    const target =
        Number(targetInput.value);


    /* ================= VALIDATION ================= */

    if (name === "") {

        showMessage(
            "Please enter your name.",
            "error"
        );

        nameInput.focus();

        return;
    }


    if (
        !Number.isFinite(target) ||
        target < 1 ||
        target > 100
    ) {

        showMessage(
            "Attendance criterion must be between 1% and 100%.",
            "error"
        );

        targetInput.focus();

        return;
    }


    /* ================= PROFILE OBJECT ================= */

    const profile = {

        name: name,

        avatar: selectedAvatar,

        attendanceTarget: target,

        createdAt:
            new Date().toISOString()

    };


    /* ================= SAVE ================= */

    localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(profile)
    );


    /* ================= UPDATE PREVIEW ================= */

    updateProfilePreview(profile);


    /* ================= MESSAGE ================= */

    showMessage(
        "✓ Profile saved successfully!",
        "success"
    );

}


/* ============================================================
   LOAD PROFILE
   ============================================================ */

function loadProfile() {

    const savedProfile =
        localStorage.getItem(
            PROFILE_KEY
        );


    if (!savedProfile) {

        return;

    }


    try {

        const profile =
            JSON.parse(savedProfile);


        /* Restore avatar */

        if (profile.avatar) {

            selectedAvatar =
                profile.avatar;


            const profileImage =
                document.getElementById(
                    "profileImage"
                );


            if (profileImage) {

                profileImage.src =
                    profile.avatar;

            }


            document
                .querySelectorAll(
                    ".avatar-choice"
                )
                .forEach(function (avatar) {

                    avatar.classList.remove(
                        "selected-avatar"
                    );


                    if (
                        avatar.dataset.avatar ===
                        profile.avatar
                    ) {

                        avatar.classList.add(
                            "selected-avatar"
                        );

                    }

                });

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


        /* Update profile preview */

        updateProfilePreview(profile);


    } catch (error) {

        console.error(
            "AttendX profile could not be loaded:",
            error
        );

    }

}


/* ============================================================
   UPDATE PROFILE PREVIEW
   ============================================================ */

function updateProfilePreview(profile) {

    const name =
        document.getElementById(
            "profileName"
        );


    const classText =
        document.getElementById(
            "profileClass"
        );


    const image =
        document.getElementById(
            "profileImage"
        );


    if (name) {

        name.textContent =
            profile.name || "Student";

    }


    if (classText) {

        classText.textContent =
            "Target attendance: " +
            profile.attendanceTarget +
            "%";

    }


    if (image && profile.avatar) {

        image.src =
            profile.avatar;

    }

}


/* ============================================================
   PROCEED TO CALCULATOR
   ============================================================ */

function proceedToCalculator() {

    const savedProfile =
        localStorage.getItem(
            PROFILE_KEY
        );


    /* Don't allow proceeding without profile */

    if (!savedProfile) {

        showMessage(
            "Please save your profile first.",
            "error"
        );

        return;

    }


    window.location.href =
        "calculator.html";

}


/* ============================================================
   RESET PROFILE
   ============================================================ */

function logout() {

    const confirmation =
        confirm(
            "Are you sure you want to reset your AttendX profile?"
        );


    if (!confirmation) {

        return;

    }


    localStorage.removeItem(
        PROFILE_KEY
    );


    selectedAvatar =
        "assets/avatars/avatar1.png";


    /* Reset inputs */

    const nameInput =
        document.getElementById(
            "studentName"
        );


    const targetInput =
        document.getElementById(
            "attendanceTarget"
        );


    if (nameInput) {

        nameInput.value = "";

    }


    if (targetInput) {

        targetInput.value = 75;

    }


    /* Reset avatar */

    const image =
        document.getElementById(
            "profileImage"
        );


    if (image) {

        image.src =
            "assets/avatars/avatar1.png";

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


    /* Reset preview */

    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileClass =
        document.getElementById(
            "profileClass"
        );


    if (profileName) {

        profileName.textContent =
            "Student";

    }


    if (profileClass) {

        profileClass.textContent =
            "Target attendance: 75%";

    }


    showMessage(
        "Profile has been reset.",
        "success"
    );

}


/* ============================================================
   MESSAGE SYSTEM
   ============================================================ */

function showMessage(text, type) {

    const message =
        document.getElementById(
            "profileMessage"
        );


    if (!message) {

        return;

    }


    message.textContent =
        text;


    message.className =
        "profile-message " +
        type;


    setTimeout(function () {

        message.textContent =
            "";

        message.className =
            "profile-message";

    }, 4000);

}
