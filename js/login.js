/* =========================================================
   ATTENDX ACCOUNT + PROFILE SYSTEM
   ========================================================= */

const ATTENDX_ACCOUNT_KEY = "attendxAccount";
const ATTENDX_PROFILE_KEY = "attendxProfile";


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadAccountData();

    setupAvatarPage();

});


/* =========================================================
   CREATE ACCOUNT
   ACCOUNT PAGE
   ========================================================= */

function createAccount() {

    const username =
        document.getElementById("username");

    const className =
        document.getElementById("className");

    const targetAttendance =
        document.getElementById("targetAttendance");

    const message =
        document.getElementById("accountMessage");


    /* Check elements */

    if (!username || !className || !targetAttendance) {

        console.error(
            "AttendX: Account form elements not found."
        );

        return;

    }


    const name =
        username.value.trim();

    const studentClass =
        className.value.trim();

    const target =
        Number(targetAttendance.value);


    /* =====================================================
       VALIDATION
       ===================================================== */

    if (name === "") {

        showAccountMessage(
            "Please enter your name.",
            "error"
        );

        username.focus();

        return;

    }


    if (studentClass === "") {

        showAccountMessage(
            "Please enter your class.",
            "error"
        );

        className.focus();

        return;

    }


    if (
        !Number.isFinite(target) ||
        target < 1 ||
        target > 100
    ) {

        showAccountMessage(
            "Attendance must be between 1% and 100%.",
            "error"
        );

        targetAttendance.focus();

        return;

    }


    /* =====================================================
       CREATE ACCOUNT OBJECT
       ===================================================== */

    const account = {

        name: name,

        className: studentClass,

        targetAttendance: target

    };


    /* =====================================================
       SAVE ACCOUNT
       ===================================================== */

    localStorage.setItem(

        ATTENDX_ACCOUNT_KEY,

        JSON.stringify(account)

    );


    /* =====================================================
       SUCCESS
       ===================================================== */

    showAccountMessage(
        "✓ Details saved! Choose your avatar next.",
        "success"
    );


    /* =====================================================
       GO TO AVATAR PAGE
       ===================================================== */

    setTimeout(function () {

        window.location.href =
            "profile.html";

    }, 700);

}


/* =========================================================
   LOAD ACCOUNT
   ========================================================= */

function loadAccountData() {

    const savedAccount =
        localStorage.getItem(
            ATTENDX_ACCOUNT_KEY
        );


    if (!savedAccount) {

        return;

    }


    try {

        const account =
            JSON.parse(savedAccount);


        const username =
            document.getElementById(
                "username"
            );


        const className =
            document.getElementById(
                "className"
            );


        const targetAttendance =
            document.getElementById(
                "targetAttendance"
            );


        if (
            username &&
            account.name
        ) {

            username.value =
                account.name;

        }


        if (
            className &&
            account.className
        ) {

            className.value =
                account.className;

        }


        if (
            targetAttendance &&
            account.targetAttendance
        ) {

            targetAttendance.value =
                account.targetAttendance;

        }


    } catch (error) {

        console.error(
            "AttendX account loading error:",
            error
        );

    }

}


/* =========================================================
   ACCOUNT MESSAGE
   ========================================================= */

function showAccountMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "accountMessage"
        );


    if (!message) {

        return;

    }


    message.textContent =
        text;


    message.className =
        "message " + type;

}


/* =========================================================
   AVATAR PAGE
   ========================================================= */

function setupAvatarPage() {

    const avatars =
        document.querySelectorAll(
            ".avatar-choice"
        );


    if (avatars.length === 0) {

        return;

    }


    /* Load saved account */

    const savedAccount =
        localStorage.getItem(
            ATTENDX_ACCOUNT_KEY
        );


    if (!savedAccount) {

        /*
         * User somehow opened profile
         * without creating an account.
         */

        return;

    }


    try {

        const account =
            JSON.parse(savedAccount);


        /* ================================================
           SHOW ACCOUNT INFORMATION
           ================================================ */

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
                account.name;

        }


        if (profileClass) {

            profileClass.textContent =
                account.className +
                " • Target: " +
                account.targetAttendance +
                "%";

        }


        /* ================================================
           RESTORE PREVIOUS AVATAR
           ================================================ */

        const savedProfile =
            localStorage.getItem(
                ATTENDX_PROFILE_KEY
            );


        if (savedProfile) {

            const profile =
                JSON.parse(savedProfile);


            if (profile.avatar) {

                selectAvatarByPath(
                    profile.avatar
                );

            }

        }


    } catch (error) {

        console.error(
            "AttendX avatar page error:",
            error
        );

    }


    /* ================================================
       AVATAR CLICK
       ================================================ */

    avatars.forEach(function (avatar) {

        avatar.addEventListener(
            "click",
            function () {

                selectAvatar(this);

            }
        );

    });

}


/* =========================================================
   SELECT AVATAR
   ========================================================= */

function selectAvatar(element) {

    if (!element) {

        return;

    }


    const avatar =
        element.getAttribute(
            "data-avatar"
        );


    if (!avatar) {

        return;

    }


    /* Remove old selection */

    document
        .querySelectorAll(
            ".avatar-choice"
        )
        .forEach(function (item) {

            item.classList.remove(
                "selected-avatar"
            );

        });


    /* Add new selection */

    element.classList.add(
        "selected-avatar"
    );


    /* Update preview */

    const profileImage =
        document.getElementById(
            "profileImage"
        );


    if (profileImage) {

        profileImage.src =
            avatar;

    }


    /* Save selected avatar immediately */

    const savedAccount =
        localStorage.getItem(
            ATTENDX_ACCOUNT_KEY
        );


    if (!savedAccount) {

        return;

    }


    try {

        const account =
            JSON.parse(savedAccount);


        const profile = {

            name: account.name,

            className:
                account.className,

            targetAttendance:
                account.targetAttendance,

            avatar: avatar

        };


        localStorage.setItem(

            ATTENDX_PROFILE_KEY,

            JSON.stringify(profile)

        );


    } catch (error) {

        console.error(
            "AttendX avatar save error:",
            error
        );

    }

}


/* =========================================================
   SELECT AVATAR BY PATH
   ========================================================= */

function selectAvatarByPath(
    avatarPath
) {

    const avatars =
        document.querySelectorAll(
            ".avatar-choice"
        );


    avatars.forEach(function (avatar) {

        avatar.classList.remove(
            "selected-avatar"
        );


        if (
            avatar.getAttribute(
                "data-avatar"
            ) === avatarPath
        ) {

            avatar.classList.add(
                "selected-avatar"
            );


            const profileImage =
                document.getElementById(
                    "profileImage"
                );


            if (profileImage) {

                profileImage.src =
                    avatarPath;

            }

        }

    });

}


/* =========================================================
   PROCEED FROM AVATAR PAGE
   ========================================================= */

function proceedToCalculator() {

    const savedAccount =
        localStorage.getItem(
            ATTENDX_ACCOUNT_KEY
        );


    if (!savedAccount) {

        alert(
            "Please create your AttendX account first."
        );

        window.location.href =
            "login.html";

        return;

    }


    const savedProfile =
        localStorage.getItem(
            ATTENDX_PROFILE_KEY
        );


    if (!savedProfile) {

        alert(
            "Please choose an avatar first."
        );

        return;

    }


    try {

        const profile =
            JSON.parse(savedProfile);


        if (!profile.avatar) {

            alert(
                "Please choose an avatar first."
            );

            return;

        }


        /* Everything is ready */

        window.location.href =
            "calculator.html";


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong. Please choose your avatar again."
        );

    }

}


/* =========================================================
   RESET ACCOUNT
   ========================================================= */

function logout() {

    const confirmation =
        confirm(
            "Are you sure you want to reset your AttendX profile?"
        );


    if (!confirmation) {

        return;

    }


    localStorage.removeItem(
        ATTENDX_ACCOUNT_KEY
    );


    localStorage.removeItem(
        ATTENDX_PROFILE_KEY
    );


    window.location.href =
        "login.html";

}
