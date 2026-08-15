function checkMemberPassword() {

    const password =
        document.getElementById("memberPassword").value;

    const message =
        document.getElementById("memberMessage");


    if (password === "1211") {

        message.textContent =
            "Access granted. Welcome to the member area.";

        message.style.color = "#7ee7ff";


        setTimeout(function () {

            window.location.href =
                "presentation.html";

        }, 700);

    }

    else {

        message.textContent =
            "Incorrect password. Please try again.";

        message.style.color = "#ff6b8a";

    }

}
