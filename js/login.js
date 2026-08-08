function createAccount() {

    const name =
        document.getElementById("username").value.trim();

    const className =
        document.getElementById("className").value.trim();

    const target =
        Number(
            document.getElementById("targetAttendance").value
        );


    if (!name) {

        alert("Please enter your name.");

        return;
    }


    const account = {

        name: name,

        className: className,

        target: target,

        avatar:
            "assets/avatars/avatar1.png",

        created:
            new Date().toISOString()

    };


    localStorage.setItem(
        "attendxAccount",
        JSON.stringify(account)
    );


    document.getElementById(
        "accountMessage"
    ).textContent =
        "Profile created successfully. Opening your profile...";


    setTimeout(() => {

        window.location.href =
            "profile.html";

    }, 900);

}
