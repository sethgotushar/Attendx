document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ATTENDX CALENDAR
    // =========================================================

    const PROFILE_KEY = "attendxProfile";

    // ---------------------------------------------------------
    // LOAD PROFILE
    // ---------------------------------------------------------

    let profile;

    try {
        profile = JSON.parse(localStorage.getItem(PROFILE_KEY));
    } catch (error) {
        profile = null;
    }

    // No profile found
    if (!profile) {
        window.location.href = "login.html";
        return;
    }

    // Make sure attendance exists
    if (
        !profile.attendance ||
        typeof profile.attendance !== "object"
    ) {
        profile.attendance = {};
    }

    // ---------------------------------------------------------
    // ELEMENTS
    // ---------------------------------------------------------

    const calendarName =
        document.getElementById("calendarName");

    const calendarClass =
        document.getElementById("calendarClass");

    const calendarTarget =
        document.getElementById("calendarTarget");

    const calendarAvatar =
        document.getElementById("calendarAvatar");

    const calendarPeriod =
        document.getElementById("calendarPeriod");

    const monthsContainer =
        document.getElementById("monthsContainer");

    const presentCount =
        document.getElementById("presentCount");

    const absentCount =
        document.getElementById("absentCount");

    const holidayCount =
        document.getElementById("holidayCount");

    const currentPercentage =
        document.getElementById("currentPercentage");

    const dateMenu =
        document.getElementById("dateMenu");

    const selectedDateText =
        document.getElementById("selectedDateText");

    const closeDateMenu =
        document.getElementById("closeDateMenu");

    const editProfileButton =
        document.getElementById("editProfileButton");

    const editPeriodButton =
        document.getElementById("editPeriodButton");


    // ---------------------------------------------------------
    // DISPLAY PROFILE
    // ---------------------------------------------------------

    if (calendarName) {
        calendarName.textContent =
            profile.name || "Student";
    }

    if (calendarClass) {
        calendarClass.textContent =
            profile.className
                ? `Class ${profile.className}`
                : "Class";
    }

    if (calendarTarget) {
        calendarTarget.textContent =
            `${Number(profile.targetAttendance || 75)}%`;
    }

    if (calendarAvatar) {
        calendarAvatar.src =
            profile.avatar ||
            "assets/avatars/avatar1.png";
    }


    // =========================================================
    // DATE FUNCTIONS
    // =========================================================

    function parseDate(dateString) {

        if (!dateString) {
            return null;
        }

        const parts = dateString.split("-");

        if (parts.length !== 3) {
            return null;
        }

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day)
        ) {
            return null;
        }

        return new Date(
            year,
            month - 1,
            day
        );
    }


    function formatDate(date) {

        const day =
            String(date.getDate()).padStart(2, "0");

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const year =
            date.getFullYear();

        return `${day}/${month}/${year}`;
    }


    function formatMonthYear(year, month) {

        const date =
            new Date(year, month, 1);

        return date.toLocaleString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );
    }


    function createDateKey(year, month, day) {

        return (
            `${year}-` +
            `${String(month + 1).padStart(2, "0")}-` +
            `${String(day).padStart(2, "0")}`
        );
    }


    function isSameDay(date1, date2) {

        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }


    // =========================================================
    // GET START / END DATE
    // =========================================================

    const startDate =
        parseDate(profile.startDate);

    const endDate =
        parseDate(profile.endDate);


    // Missing dates
    if (!startDate || !endDate) {

        alert(
            "Please set your academic start and end dates."
        );

        window.location.href =
            "login.html?edit=true";

        return;
    }


    // Invalid date range
    if (startDate > endDate) {

        alert(
            "Start date cannot be after end date."
        );

        window.location.href =
            "login.html?edit=true";

        return;
    }


    // Display academic period
    if (calendarPeriod) {

        calendarPeriod.textContent =
            `${formatDate(startDate)} — ${formatDate(endDate)}`;
    }


    // =========================================================
    // SAVE PROFILE
    // =========================================================

    function saveProfile() {

        try {

            localStorage.setItem(
                PROFILE_KEY,
                JSON.stringify(profile)
            );

            return true;

        } catch (error) {

            console.error(
                "Unable to save AttendX profile:",
                error
            );

            return false;
        }
    }


    // =========================================================
    // CALENDAR GENERATION
    // =========================================================

    function generateCalendar() {

        if (!monthsContainer) {
            return;
        }

        monthsContainer.innerHTML = "";


        const startYear =
            startDate.getFullYear();

        const startMonth =
            startDate.getMonth();

        const endYear =
            endDate.getFullYear();

        const endMonth =
            endDate.getMonth();


        let currentYear =
            startYear;

        let currentMonth =
            startMonth;


        // -----------------------------------------------------
        // ONLY GENERATE MONTHS INSIDE SELECTED PERIOD
        // -----------------------------------------------------

        while (
            currentYear < endYear ||
            (
                currentYear === endYear &&
                currentMonth <= endMonth
            )
        ) {

            const monthSection =
                document.createElement("section");

            monthSection.className =
                "month-card";


            // -------------------------------------------------
            // MONTH TITLE
            // -------------------------------------------------

            const monthHeader =
                document.createElement("div");

            monthHeader.className =
                "month-header";


            const monthTitle =
                document.createElement("h2");

            monthTitle.textContent =
                formatMonthYear(
                    currentYear,
                    currentMonth
                );


            monthHeader.appendChild(
                monthTitle
            );

            monthSection.appendChild(
                monthHeader
            );


            // -------------------------------------------------
            // WEEKDAYS
            // -------------------------------------------------

            const weekdays =
                document.createElement("div");

            weekdays.className =
                "calendar-weekdays";


            const weekdayNames = [
                "SUN",
                "MON",
                "TUE",
                "WED",
                "THU",
                "FRI",
                "SAT"
            ];


            weekdayNames.forEach(
                weekdayName => {

                    const weekday =
                        document.createElement("div");

                    weekday.className =
                        "weekday";

                    weekday.textContent =
                        weekdayName;

                    weekdays.appendChild(
                        weekday
                    );
                }
            );


            monthSection.appendChild(
                weekdays
            );


            // -------------------------------------------------
            // DAYS GRID
            // -------------------------------------------------

            const daysGrid =
                document.createElement("div");

            daysGrid.className =
                "calendar-grid";


            // Number of days in month
            const daysInMonth =
                new Date(
                    currentYear,
                    currentMonth + 1,
                    0
                ).getDate();


            // First weekday
            const firstWeekday =
                new Date(
                    currentYear,
                    currentMonth,
                    1
                ).getDay();


            // -------------------------------------------------
            // EMPTY SPACES
            // -------------------------------------------------

            for (
                let i = 0;
                i < firstWeekday;
                i++
            ) {

                const emptyDay =
                    document.createElement("div");

                emptyDay.className =
                    "calendar-day empty-day";

                daysGrid.appendChild(
                    emptyDay
                );
            }


            // -------------------------------------------------
            // EXACT DATE LIMITS
            // -------------------------------------------------

            let firstDay =
                1;

            let lastDay =
                daysInMonth;


            // FIRST MONTH
            if (
                currentYear === startYear &&
                currentMonth === startMonth
            ) {

                firstDay =
                    startDate.getDate();
            }


            // LAST MONTH
            if (
                currentYear === endYear &&
                currentMonth === endMonth
            ) {

                lastDay =
                    endDate.getDate();
            }


            // -------------------------------------------------
            // CREATE DAYS
            // -------------------------------------------------

            for (
                let dayNumber = firstDay;
                dayNumber <= lastDay;
                dayNumber++
            ) {

                const key =
                    createDateKey(
                        currentYear,
                        currentMonth,
                        dayNumber
                    );


                const dayCell =
                    document.createElement("button");

                dayCell.type =
                    "button";

                dayCell.className =
                    "calendar-day";

                dayCell.dataset.date =
                    key;


                // ------------------------------------------------
                // DATE NUMBER
                // ------------------------------------------------

                const number =
                    document.createElement("span");

                number.className =
                    "day-number";

                number.textContent =
                    dayNumber;


                // ------------------------------------------------
                // ATTENDANCE CROSS
                // ------------------------------------------------

                const cross =
                    document.createElement("span");

                cross.className =
                    "day-cross";

                cross.textContent =
                    "✕";


                dayCell.appendChild(
                    number
                );

                dayCell.appendChild(
                    cross
                );


                // ------------------------------------------------
                // RESTORE SAVED STATUS
                // ------------------------------------------------

                const savedStatus =
                    profile.attendance[key];

                applyStatus(
                    dayCell,
                    savedStatus
                );


                // ------------------------------------------------
                // CLICK DATE
                // ------------------------------------------------

                dayCell.addEventListener(
                    "click",
                    () => {

                        openDateMenu(
                            key,
                            currentYear,
                            currentMonth,
                            dayNumber
                        );
                    }
                );


                daysGrid.appendChild(
                    dayCell
                );
            }


            monthSection.appendChild(
                daysGrid
            );

            monthsContainer.appendChild(
                monthSection
            );


            // ------------------------------------------------
            // NEXT MONTH
            // ------------------------------------------------

            currentMonth++;

            if (currentMonth > 11) {

                currentMonth = 0;

                currentYear++;
            }
        }
    }


    // =========================================================
    // STATUS / CROSS
    // =========================================================

    function applyStatus(
        dayCell,
        status
    ) {

        if (!dayCell) {
            return;
        }


        dayCell.classList.remove(
            "present",
            "absent",
            "holiday"
        );


        if (status === "present") {

            dayCell.classList.add(
                "present"
            );
        }


        else if (status === "absent") {

            dayCell.classList.add(
                "absent"
            );
        }


        else if (status === "holiday") {

            dayCell.classList.add(
                "holiday"
            );
        }
    }


    // =========================================================
    // DATE MENU
    // =========================================================

    let selectedDateKey =
        null;


    function openDateMenu(
        key,
        year,
        month,
        day
    ) {

        selectedDateKey =
            key;


        const selectedDate =
            new Date(
                year,
                month,
                day
            );


        if (selectedDateText) {

            selectedDateText.textContent =
                selectedDate.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );
        }


        if (dateMenu) {

            dateMenu.classList.add(
                "show"
            );
        }
    }


    function closeMenu() {

        if (dateMenu) {

            dateMenu.classList.remove(
                "show"
            );
        }

        selectedDateKey =
            null;
    }


    // Close button
    if (closeDateMenu) {

        closeDateMenu.addEventListener(
            "click",
            closeMenu
        );
    }


    // Click outside menu
    if (dateMenu) {

        dateMenu.addEventListener(
            "click",
            event => {

                if (
                    event.target === dateMenu
                ) {

                    closeMenu();
                }
            }
        );
    }


    // =========================================================
    // ATTENDANCE OPTIONS
    // =========================================================

    const attendanceOptions =
        document.querySelectorAll(
            ".attendance-option"
        );


    attendanceOptions.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (!selectedDateKey) {
                        return;
                    }


                    const status =
                        button.dataset.status;


                    if (
                        status !== "present" &&
                        status !== "absent" &&
                        status !== "holiday"
                    ) {
                        return;
                    }


                    // -----------------------------------------
                    // SAVE STATUS
                    // -----------------------------------------

                    profile.attendance[
                        selectedDateKey
                    ] = status;


                    // -----------------------------------------
                    // SAVE PERMANENTLY
                    // -----------------------------------------

                    saveProfile();


                    // -----------------------------------------
                    // UPDATE CROSS
                    // -----------------------------------------

                    const selectedCell =
                        document.querySelector(
                            `.calendar-day[data-date="${selectedDateKey}"]`
                        );


                    if (selectedCell) {

                        applyStatus(
                            selectedCell,
                            status
                        );
                    }


                    // -----------------------------------------
                    // UPDATE STATISTICS
                    // -----------------------------------------

                    updateStatistics();


                    // Close menu
                    closeMenu();
                }
            );
        }
    );


    // =========================================================
    // ATTENDANCE STATISTICS
    // =========================================================

    function updateStatistics() {

        let present = 0;
        let absent = 0;
        let holiday = 0;


        // Today
        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        // Check every saved attendance
        Object.entries(
            profile.attendance
        ).forEach(
            ([key, status]) => {

                const attendanceDate =
                    parseDate(key);


                if (!attendanceDate) {
                    return;
                }


                // Future dates don't count
                if (
                    attendanceDate > today
                ) {
                    return;
                }


                if (
                    status === "present"
                ) {

                    present++;
                }


                else if (
                    status === "absent"
                ) {

                    absent++;
                }


                else if (
                    status === "holiday"
                ) {

                    holiday++;
                }
            }
        );


        const workingDays =
            present + absent;


        let percentage =
            0;


        if (workingDays > 0) {

            percentage =
                (
                    present /
                    workingDays
                ) * 100;
        }


        // Update UI
        if (presentCount) {

            presentCount.textContent =
                present;
        }


        if (absentCount) {

            absentCount.textContent =
                absent;
        }


        if (holidayCount) {

            holidayCount.textContent =
                holiday;
        }


        if (currentPercentage) {

            currentPercentage.textContent =
                `${percentage.toFixed(1)}%`;
        }
    }


    // =========================================================
    // EDIT PROFILE
    // =========================================================

    if (editProfileButton) {

        editProfileButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "login.html?edit=true";
            }
        );
    }


    if (editPeriodButton) {

        editPeriodButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "login.html?edit=true";
            }
        );
    }


    // =========================================================
    // INITIALIZE
    // =========================================================

    generateCalendar();

    updateStatistics();

});
