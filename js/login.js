/* =========================================================
   ATTENDX ACCOUNT + PROFILE SYSTEM
   ========================================================= */


/* =========================================================
   STORAGE KEYS
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

    /* -----------------------------------------------------
       GET FORM ELEMENTS
       ----------------------------------------------------- */

    const username =
        document.getElementById("username");

    const className =
        document.getElementById("className");

    const currentAttendance =
        document.getElementById("currentAttendance");

    const targetAttendance =
        document.getElementById("targetAttendance");

    const startDate =
        document.getElementById("startDate");

    const endDate =
        document.getElementById("endDate");

    const message =
        document.getElementById("accountMessage");


    /* -----------------------------------------------------
       CHECK ELEMENTS
       ----------------------------------------------------- */

    if (
        !username ||
        !className ||
        !currentAttendance ||
        !targetAttendance ||
        !startDate ||
        !endDate
    ) {

        console.error(
            "AttendX: Account form elements not found."
        );

        if (message) {

            showAccountMessage(
                "Some form fields are missing.",
                "error"
            );

        }

        return;

    }


    /* -----------------------------------------------------
       GET VALUES
       ----------------------------------------------------- */

    const name =
        username.value.trim();

    const studentClass =
        className.value.trim();

    const current =
        Number(currentAttendance.value);

    const target =
        Number(targetAttendance.value);

    const periodStart =
        startDate.value;

    const periodEnd =
        endDate.value;


    /* =====================================================
       VALIDATION
       ===================================================== */


    /* NAME */

    if (name === "") {

        showAccountMessage(
            "Please enter your name.",
            "error"
        );

        username.focus();

        return;

    }


    /* CLASS */

    if (studentClass === "") {

        showAccountMessage(
            "Please enter your class.",
            "error"
        );

        className.focus();

        return;

    }


    /* CURRENT ATTENDANCE */

    if (
        !Number.isFinite(current) ||
        current < 0 ||
        current > 100
    ) {

        showAccountMessage(
            "Current attendance must be between 0% and 100%.",
            "error"
        );

        currentAttendance.focus();

        return;

    }


    /* TARGET ATTENDANCE */

    if (
        !Number.isFinite(target) ||
        target < 1 ||
        target > 100
    ) {

        showAccountMessage(
            "Target attendance must be between 1% and 100%.",
            "error"
        );

        targetAttendance.focus();

        return;

    }


    /* START DATE */

    if (!periodStart) {

        showAccountMessage(
            "Please select your academic start date.",
            "error"
        );

        startDate.focus();

        return;

    }


    /* END DATE */

    if (!periodEnd) {

        showAccountMessage(
            "Please select your academic end date.",
            "error"
        );

        endDate.focus();

        return;

    }


    /* DATE ORDER */

    if (periodStart > periodEnd) {

        showAccountMessage(
            "End date must be after the start date.",
            "error"
        );

        endDate.focus();

        return;

    }


    /* =====================================================
       CREATE ACCOUNT OBJECT
       ===================================================== */

    const account = {

        name: name,

        className: studentClass,

        currentAttendance: current,

        targetAttendance: target,

        startDate: periodStart,

        endDate: periodEnd

    };


    /* =====================================================
       SAVE ACCOUNT
       ===================================================== */

    localStorage.setItem(

        ATTENDX_ACCOUNT_KEY,

        JSON.stringify(account)

    );


    /* =====================================================
       UPDATE EXISTING PROFILE
       -----------------------------------------------------
       If the student is editing their profile, preserve:
       - avatar
       - attendance records
       ===================================================== */

    const savedProfile =
        localStorage.getItem(
            ATTENDX_PROFILE_KEY
        );


    let previousProfile = null;


    if (savedProfile) {

        try {

            previousProfile =
                JSON.parse(savedProfile);

        } catch (error) {

            previousProfile = null;

        }

    }


    if (previousProfile) {

        const updatedProfile = {

            name: account.name,

            className: account.className,

            currentAttendance:
                account.currentAttendance,

            targetAttendance:
                account.targetAttendance,

            startDate:
                account.startDate,

            endDate:
                account.endDate,

            avatar:
                previousProfile.avatar ||
                "assets/avatars/avatar1.png",

            attendance:
                previousProfile.attendance || {}

        };


        localStorage.setItem(

            ATTENDX_PROFILE_KEY,

            JSON.stringify(updatedProfile)

        );

    }


    /* =====================================================
       SUCCESS MESSAGE
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


        /* -------------------------------------------------
           GET FORM ELEMENTS
           ------------------------------------------------- */

        const username =
            document.getElementById(
                "username"
            );

        const className =
            document.getElementById(
                "className"
            );

        const currentAttendance =
            document.getElementById(
                "currentAttendance"
            );

        const targetAttendance =
            document.getElementById(
                "targetAttendance"
            );

        const startDate =
            document.getElementById(
                "startDate"
            );

        const endDate =
            document.getElementById(
                "endDate"
            );


        /* -------------------------------------------------
           RESTORE NAME
           ------------------------------------------------- */

        if (
            username &&
            account.name
        ) {

            username.value =
                account.name;

        }


        /* -------------------------------------------------
           RESTORE CLASS
           ------------------------------------------------- */

        if (
            className &&
            account.className
        ) {

            className.value =
                account.className;

        }


        /* -------------------------------------------------
           RESTORE CURRENT ATTENDANCE
           ------------------------------------------------- */

        if (
            currentAttendance &&
            account.currentAttendance !== undefined
        ) {

            currentAttendance.value =
                account.currentAttendance;

        }


        /* -------------------------------------------------
           RESTORE TARGET ATTENDANCE
           ------------------------------------------------- */

        if (
            targetAttendance &&
            account.targetAttendance !== undefined
        ) {

            targetAttendance.value =
                account.targetAttendance;

        }


        /* -------------------------------------------------
           RESTORE START DATE
           ------------------------------------------------- */

        if (
            startDate &&
            account.startDate
        ) {

            startDate.value =
                account.startDate;

        }


        /* -------------------------------------------------
           RESTORE END DATE
           ------------------------------------------------- */

        if (
            endDate &&
            account.endDate
        ) {

            endDate.value =
                account.endDate;

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


    /* -----------------------------------------------------
       If this isn't the avatar/profile page, stop.
       ----------------------------------------------------- */

    if (avatars.length === 0) {

        return;

    }


    /* -----------------------------------------------------
       LOAD SAVED ACCOUNT
       ----------------------------------------------------- */

    const savedAccount =
        localStorage.getItem(
            ATTENDX_ACCOUNT_KEY
        );


    if (!savedAccount) {

        /*
         * User opened profile without
         * creating an account.
         */

        return;

    }


    try {

        const account =
            JSON.parse(savedAccount);


        /* =================================================
           SHOW ACCOUNT INFORMATION
           ================================================= */

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


        /* =================================================
           RESTORE PREVIOUS AVATAR
           ================================================= */

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


    /* =====================================================
       AVATAR CLICK
       ===================================================== */

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


    /* =====================================================
       REMOVE OLD SELECTION
       ===================================================== */

    document
        .querySelectorAll(
            ".avatar-choice"
        )
        .forEach(function (item) {

            item.classList.remove(
                "selected-avatar"
            );

        });


    /* =====================================================
       ADD NEW SELECTION
       ===================================================== */

    element.classList.add(
        "selected-avatar"
    );


    /* =====================================================
       UPDATE PREVIEW
       ===================================================== */

    const profileImage =
        document.getElementById(
            "profileImage"
        );


    if (profileImage) {

        profileImage.src =
            avatar;

    }


    /* =====================================================
       LOAD ACCOUNT
       ===================================================== */

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


        /* =================================================
           PRESERVE EXISTING ATTENDANCE
           ================================================= */

        const savedProfile =
            localStorage.getItem(
                ATTENDX_PROFILE_KEY
            );


        let oldAttendance = {};


        if (savedProfile) {

            try {

                const previousProfile =
                    JSON.parse(savedProfile);


                oldAttendance =
                    previousProfile.attendance || {};

            } catch (error) {

                oldAttendance = {};

            }

        }


        /* =================================================
           CREATE UPDATED PROFILE
           ================================================= */

        const profile = {

            name:
                account.name,

            className:
                account.className,

            currentAttendance:
                account.currentAttendance,

            targetAttendance:
                account.targetAttendance,

            startDate:
                account.startDate,

            endDate:
                account.endDate,

            avatar:
                avatar,

            attendance:
                oldAttendance

        };


        /* =================================================
           SAVE PROFILE
           ================================================= */

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


        /* -------------------------------------------------
           CHECK AVATAR
           ------------------------------------------------- */

        if (!profile.avatar) {

            alert(
                "Please choose an avatar first."
            );


            return;

        }


        /* -------------------------------------------------
           EVERYTHING IS READY
           GO TO CALENDAR
           ------------------------------------------------- */

        window.location.href =
            "calendar.html";


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


    /* -----------------------------------------------------
       DELETE ACCOUNT
       ----------------------------------------------------- */

    localStorage.removeItem(
        ATTENDX_ACCOUNT_KEY
    );


    /* -----------------------------------------------------
       DELETE PROFILE + ATTENDANCE
       ----------------------------------------------------- */

    localStorage.removeItem(
        ATTENDX_PROFILE_KEY
    );


    /* -----------------------------------------------------
       RETURN TO LOGIN
       ----------------------------------------------------- */

    window.location.href =
        "login.html";

}
