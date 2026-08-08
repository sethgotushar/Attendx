function isHoliday(date, holidaySet) {

    const key =
        date.toISOString().split("T")[0];

    return holidaySet.has(key);
}


function calculateWorkingDays(start, end, weeklyHoliday, holidaySet) {

    let count = 0;

    const date = new Date(start);

    while (date <= end) {

        const day =
            date.getDay();

        const weekend =
            weeklyHoliday !== "none" &&
            Number(weeklyHoliday) === day;

        if (!weekend && !isHoliday(date, holidaySet)) {
            count++;
        }

        date.setDate(date.getDate() + 1);
    }

    return count;
}


function calculateAttendance() {

    const startValue =
        document.getElementById("startDate").value;

    const endValue =
        document.getElementById("endDate").value;

    const held =
        Number(document.getElementById("heldDays").value);

    const present =
        Number(document.getElementById("presentDays").value);

    const target =
        Number(document.getElementById("target").value);

    const weeklyHoliday =
        document.getElementById("weeklyHoliday").value;

    const holidayText =
        document.getElementById("holidays").value;


    if (!startValue || !endValue) {

        alert("Please select the start and end dates.");

        return;
    }


    if (held < 0 || present < 0 || present > held) {

        alert(
            "Please enter valid attendance numbers."
        );

        return;
    }


    if (target <= 0 || target > 100) {

        alert(
            "Target attendance must be between 1 and 100."
        );

        return;
    }


    const start =
        new Date(startValue + "T00:00:00");

    const end =
        new Date(endValue + "T00:00:00");


    if (end < start) {

        alert(
            "End date must be after the start date."
        );

        return;
    }


    const holidaySet =
        new Set(
            holidayText
                .split(",")
                .map(x => x.trim())
                .filter(Boolean)
        );


    const workingDays =
        calculateWorkingDays(
            start,
            end,
            weeklyHoliday,
            holidaySet
        );


    const totalPossible =
        held + workingDays;


    const requiredTotalPresent =
        Math.ceil(
            (target / 100) *
            totalPossible
        );


    const additionalPresent =
        Math.max(
            0,
            requiredTotalPresent - present
        );


    const maximumAdditionalAbsence =
        Math.max(
            0,
            workingDays - additionalPresent
        );


    const projected =
        (
            (present + additionalPresent) /
            totalPossible
        ) * 100;


    document.getElementById("workingDays")
        .textContent = workingDays;


    document.getElementById("requiredPresent")
        .textContent = additionalPresent;


    document.getElementById("maxAbsent")
        .textContent =
        maximumAdditionalAbsence;


    document.getElementById("projected")
        .textContent =
        projected.toFixed(1) + "%";


    const message =
        document.getElementById("message");


    if (additionalPresent === 0) {

        message.textContent =
            "You're already on track for your target. You can miss up to "
            + maximumAdditionalAbsence
            + " of the remaining working days and still stay at or above "
            + target
            + "%.";

    } else {

        message.textContent =
            "You need to attend at least "
            + additionalPresent
            + " more working days to reach "
            + target
            + "%. You can miss up to "
            + maximumAdditionalAbsence
            + " remaining working days.";

    }


    document.getElementById("results")
        .style.display = "block";

}
