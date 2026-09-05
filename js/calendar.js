document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ATTENDX CALENDAR
    // =========================================================

    const PROFILE_KEY = "attendxProfile";


    // =========================================================
    // LOAD PROFILE
    // =========================================================

    let profile = null;

    try {

        const saved =
            localStorage.getItem(PROFILE_KEY);

        if (saved) {
            profile = JSON.parse(saved);
        }

    } catch (error) {

        console.error(
            "AttendX: Profile could not be loaded.",
            error
        );
    }


    // No profile
    if (!profile) {

        window.location.href =
            "login.html";

        return;
    }


    // =========================================================
    // ATTENDANCE STORAGE
    // =========================================================

    if (
        !profile.attendance ||
        typeof profile.attendance !== "object" ||
        Array.isArray(profile.attendance)
    ) {

        profile.attendance = {};
    }


    // =========================================================
    // ELEMENTS
    // =========================================================

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


    // =========================================================
    // PROFILE DISPLAY
    // =========================================================

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

        const target =
            Number(profile.targetAttendance);

        calendarTarget.textContent =
            `${Number.isFinite(target) ? target : 75}%`;
    }


    if (calendarAvatar) {

        calendarAvatar.src =
            profile.avatar ||
            "assets/avatars/avatar1.png";


        calendarAvatar.onerror = () => {

            calendarAvatar.src =
                "assets/avatars/avatar1.png";
        };
    }


    // =========================================================
    // DATE FUNCTIONS
    // =========================================================

    function parseDate(value) {

        if (
            typeof value !== "string" ||
            !value
        ) {

            return null;
        }


        const parts =
            value.split("-");


        if (parts.length !== 3) {

            return null;
        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]);

        const day =
            Number(parts[2]);


        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day)
        ) {

            return null;
        }


        const date =
            new Date(
                year,
                month - 1,
                day
            );


        // Validate date
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {

            return null;
        }


        return date;
    }


    function formatDate(date) {

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");


        const year =
            date.getFullYear();


        return `${day}/${month}/${year}`;
    }


    function getMonthName(
        year,
        month
    ) {

        return new Date(
            year,
            month,
            1
        ).toLocaleString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );
    }


    function makeDateKey(
        year,
        month,
        day
    ) {

        return (
            `${year}-` +
            `${String(month + 1).padStart(2, "0")}-` +
            `${String(day).padStart(2, "0")}`
        );
    }


    // =========================================================
    // START / END DATE
    // =========================================================

    const startDate =
        parseDate(profile.startDate);

    const endDate =
        parseDate(profile.endDate);


    if (!startDate || !endDate) {

        alert(
            "Please set your academic start and end dates."
        );

        window.location.href =
            "login.html?edit=true";

        return;
    }


    if (startDate > endDate) {

        alert(
            "Start date cannot be after the end date."
        );

        window.location.href =
            "login.html?edit=true";

        return;
    }


    // =========================================================
    // DISPLAY ACADEMIC PERIOD
    // =========================================================

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
                "AttendX: Could not save.",
                error
            );

            return false;
        }
    }


    // =========================================================
    // GENERATE CALENDAR
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


        let year =
            startYear;

        let month =
            startMonth;


        // =====================================================
        // GENERATE MONTHS ONLY UNTIL END DATE
        // =====================================================

        while (
            year < endYear ||
            (
                year === endYear &&
                month <= endMonth
            )
        ) {


            // -------------------------------------------------
            // MONTH CARD
            // -------------------------------------------------

            const monthCard =
                document.createElement("section");

            monthCard.className =
                "month-card";


            // -------------------------------------------------
            // MONTH HEADER
            // -------------------------------------------------

            const monthHeader =
                document.createElement("div");

            monthHeader.className =
                "month-header";


            const monthTitle =
                document.createElement("h2");

            monthTitle.textContent =
                getMonthName(
                    year,
                    month
                );


            monthHeader.appendChild(
                monthTitle
            );

            monthCard.appendChild(
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
                name => {

                    const weekday =
                        document.createElement("div");

                    weekday.className =
                        "weekday";

                    weekday.textContent =
                        name;

                    weekdays.appendChild(
                        weekday
                    );
                }
            );


            monthCard.appendChild(
                weekdays
            );


            // -------------------------------------------------
            // DAYS GRID
            // -------------------------------------------------

            const daysGrid =
                document.createElement("div");

            daysGrid.className =
                "calendar-grid";


            // Number of days
            const daysInMonth =
                new Date(
                    year,
                    month + 1,
                    0
                ).getDate();


            // Selected range limits
            let firstDay = 1;

            let lastDay =
                daysInMonth;


            // First month
            if (
                year === startYear &&
                month === startMonth
            ) {

                firstDay =
                    startDate.getDate();
            }


            // Last month
            if (
                year === endYear &&
                month === endMonth
            ) {

                lastDay =
                    endDate.getDate();
            }


            // -------------------------------------------------
            // FIRST WEEKDAY
            // -------------------------------------------------

            const startingWeekday =
                new Date(
                    year,
                    month,
                    firstDay
                ).getDay();


            // -------------------------------------------------
            // EMPTY CELLS
            // -------------------------------------------------

            for (
                let i = 0;
                i < startingWeekday;
                i++
            ) {

                const empty =
                    document.createElement("div");

                empty.className =
                    "calendar-day empty-day";

                daysGrid.appendChild(
                    empty
                );
            }


            // -------------------------------------------------
            // CREATE DAYS
            // -------------------------------------------------

            for (
                let day = firstDay;
                day <= lastDay;
                day++
            ) {

                const key =
                    makeDateKey(
                        year,
                        month,
                        day
                    );


                // ---------------------------------------------
                // BUTTON
                // ---------------------------------------------

                const dayCell =
                    document.createElement("button");

                dayCell.type =
                    "button";

                dayCell.className =
                    "calendar-day";

                dayCell.dataset.date =
                    key;


                // ---------------------------------------------
                // NUMBER
                // ---------------------------------------------

                const number =
                    document.createElement("span");

                number.className =
                    "day-number";

                number.textContent =
                    day;


                // ---------------------------------------------
                // CROSS
                // ---------------------------------------------

                const cross =
                    document.createElement("span");

                cross.className =
                    "day-cross";

                cross.textContent =
                    "×";


                dayCell.appendChild(
                    number
                );

                dayCell.appendChild(
                    cross
                );


                // ---------------------------------------------
                // RESTORE SAVED STATUS
                // ---------------------------------------------

                applyStatus(
                    dayCell,
                    profile.attendance[key]
                );


                // ---------------------------------------------
                // CLICK
                // ---------------------------------------------

                dayCell.addEventListener(
                    "click",
                    () => {

                        openDateMenu(
                            key,
                            year,
                            month,
                            day
                        );
                    }
                );


                daysGrid.appendChild(
                    dayCell
                );
            }


            monthCard.appendChild(
                daysGrid
            );


            monthsContainer.appendChild(
                monthCard
            );


            // -------------------------------------------------
            // NEXT MONTH
            // -------------------------------------------------

            month++;


            if (month > 11) {

                month = 0;
                year++;
            }
        }
    }


    // =========================================================
    // APPLY STATUS
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


    // =========================================================
    // CLOSE BUTTON
    // =========================================================

    if (closeDateMenu) {

        closeDateMenu.addEventListener(
            "click",
            closeMenu
        );
    }


    // =========================================================
    // CLICK OUTSIDE
    // =========================================================

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

                    // No selected date
                    if (!selectedDateKey) {
                        return;
                    }


                    const status =
                        button.dataset.status;


                    // -------------------------------------------------
                    // VALID STATUS
                    // -------------------------------------------------

                    const validStatuses = [
                        "present",
                        "absent",
                        "holiday",
                        "none"
                    ];


                    if (
                        !validStatuses.includes(
                            status
                        )
                    ) {

                        return;
                    }


                    // -------------------------------------------------
                    // NONE = CLEAR DATE
                    // -------------------------------------------------

                    if (
                        status === "none"
                    ) {

                        delete profile.attendance[
                            selectedDateKey
                        ];

                    }


                    // -------------------------------------------------
                    // PRESENT / ABSENT / HOLIDAY
                    // -------------------------------------------------

                    else {

                        profile.attendance[
                            selectedDateKey
                        ] = status;
                    }


                    // -------------------------------------------------
                    // SAVE IMMEDIATELY
                    // -------------------------------------------------

                    const saved =
                        saveProfile();


                    if (!saved) {

                        alert(
                            "AttendX could not save this attendance."
                        );

                        return;
                    }


                    // -------------------------------------------------
                    // UPDATE CROSS
                    // -------------------------------------------------

                    const selectedCell =
                        document.querySelector(
                            `.calendar-day[data-date="${selectedDateKey}"]`
                        );


                    if (selectedCell) {

                        applyStatus(
                            selectedCell,
                            status === "none"
                                ? null
                                : status
                        );
                    }


                    // -------------------------------------------------
                    // UPDATE NUMBERS
                    // -------------------------------------------------

                    updateStatistics();


                    // -------------------------------------------------
                    // CLOSE MENU
                    // -------------------------------------------------

                    closeMenu();
                }
            );
        }
    );


    // =========================================================
    // STATISTICS
    // =========================================================

    function updateStatistics() {

        let totalPresent = 0;

        let totalAbsent = 0;

        let totalHoliday = 0;


        let currentPresent = 0;

        let currentAbsent = 0;


        // Today's date
        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        // =====================================================
        // READ SAVED ATTENDANCE
        // =====================================================

        Object.entries(
            profile.attendance
        ).forEach(
            ([key, status]) => {

                const attendanceDate =
                    parseDate(key);


                if (!attendanceDate) {
                    return;
                }


                // Only selected academic period
                if (
                    attendanceDate < startDate ||
                    attendanceDate > endDate
                ) {

                    return;
                }


                // ------------------------------------------------
                // TOTAL COUNTS
                // ------------------------------------------------

                if (
                    status === "present"
                ) {

                    totalPresent++;
                }


                else if (
                    status === "absent"
                ) {

                    totalAbsent++;
                }


                else if (
                    status === "holiday"
                ) {

                    totalHoliday++;
                }


                // ------------------------------------------------
                // CURRENT ATTENDANCE
                // ------------------------------------------------

                if (
                    attendanceDate <= today
                ) {

                    if (
                        status === "present"
                    ) {

                        currentPresent++;
                    }


                    else if (
                        status === "absent"
                    ) {

                        currentAbsent++;
                    }
                }
            }
        );


        // =====================================================
        // CALCULATE PERCENTAGE
        // =====================================================

        const workingDays =
            currentPresent +
            currentAbsent;


        let percentage = 0;


        if (workingDays > 0) {

            percentage =
                (
                    currentPresent /
                    workingDays
                ) * 100;
        }


        // =====================================================
        // UPDATE UI
        // =====================================================

        if (presentCount) {

            presentCount.textContent =
                totalPresent;
        }


        if (absentCount) {

            absentCount.textContent =
                totalAbsent;
        }


        if (holidayCount) {

            holidayCount.textContent =
                totalHoliday;
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
    // START
    // =========================================================

    generateCalendar();

    updateStatistics();

});
