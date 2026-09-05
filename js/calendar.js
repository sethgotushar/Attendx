document.addEventListener("DOMContentLoaded", () => {

    const PROFILE_KEY = "attendxProfile";

    let profile = JSON.parse(
        localStorage.getItem(PROFILE_KEY)
    );

    /*
     * If no profile exists,
     * send the user to profile setup.
     */

    if (!profile) {
        window.location.href = "login.html";
        return;
    }


    /*
     * Make sure attendance storage exists.
     */

    if (!profile.attendance) {
        profile.attendance = {};
        saveProfile();
    }


    const monthsContainer =
        document.getElementById("monthsContainer");

    const dateMenu =
        document.getElementById("dateMenu");

    const selectedDateText =
        document.getElementById("selectedDateText");


    /*
     * SAVE PROFILE
     */

    function saveProfile() {

        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(profile)
        );

    }


    /*
     * DISPLAY PROFILE
     */

    function displayProfile() {

        document.getElementById("calendarName").textContent =
            profile.name || "Student";

        document.getElementById("calendarClass").textContent =
            profile.className || "Class";

        document.getElementById("calendarTarget").textContent =
            `${Number(profile.targetAttendance || 75)}%`;

        document.getElementById("calendarAvatar").src =
            profile.avatar || "assets/avatars/avatar1.png";

        if (profile.startDate && profile.endDate) {

            const start =
                formatDisplayDate(profile.startDate);

            const end =
                formatDisplayDate(profile.endDate);

            document.getElementById("calendarPeriod").textContent =
                `${start} — ${end}`;

        }

    }


    /*
     * DD/MM/YYYY DISPLAY
     */

    function formatDisplayDate(dateString) {

        const date = parseDate(dateString);

        if (!date) return dateString;

        return String(date.getDate()).padStart(2, "0")
            + "/"
            + String(date.getMonth() + 1).padStart(2, "0")
            + "/"
            + date.getFullYear();

    }


    /*
     * IMPORTANT:
     * Parse date without timezone problems.
     */

    function parseDate(value) {

        if (!value) return null;

        const parts = value.split("-");

        if (parts.length !== 3) return null;

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    }


    /*
     * DATE → YYYY-MM-DD
     */

    function dateKey(date) {

        return date.getFullYear()
            + "-"
            + String(date.getMonth() + 1).padStart(2, "0")
            + "-"
            + String(date.getDate()).padStart(2, "0");

    }


    /*
     * MONTH NAMES
     */

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    /*
     * WEEKDAYS
     */

    const weekdayNames = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];


    /*
     * GENERATE COMPLETE CALENDAR
     */

    function generateCalendar() {

        monthsContainer.innerHTML = "";

        const startDate =
            parseDate(profile.startDate);

        const endDate =
            parseDate(profile.endDate);


        if (!startDate || !endDate) {

            monthsContainer.innerHTML = `
                <div class="calendar-error">
                    Please set your academic period
                    in Edit Profile.
                </div>
            `;

            return;
        }


        /*
         * Start at the first day of the
         * starting month.
         */

        let currentMonth =
            new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                1
            );


        /*
         * Continue until the ending month.
         */

        while (currentMonth <= endDate) {

            createMonth(currentMonth, startDate, endDate);

            currentMonth.setMonth(
                currentMonth.getMonth() + 1
            );

        }

    }


    /*
     * CREATE ONE MONTH
     */

    function createMonth(monthDate, startDate, endDate) {

        const year =
            monthDate.getFullYear();

        const month =
            monthDate.getMonth();


        const monthSection =
            document.createElement("section");

        monthSection.className =
            "calendar-month";


        /*
         * MONTH HEADER
         */

        const header =
            document.createElement("div");

        header.className =
            "month-header";


        header.innerHTML = `
            <div>
                <p class="eyebrow">
                    ${year}
                </p>

                <h2>
                    ${monthNames[month]}
                </h2>
            </div>
        `;


        monthSection.appendChild(header);


        /*
         * WEEKDAY HEADER
         */

        const weekdayRow =
            document.createElement("div");

        weekdayRow.className =
            "weekday-row";


        weekdayNames.forEach(day => {

            const element =
                document.createElement("div");

            element.textContent = day;

            weekdayRow.appendChild(element);

        });


        monthSection.appendChild(weekdayRow);


        /*
         * CALENDAR GRID
         */

        const grid =
            document.createElement("div");

        grid.className =
            "calendar-grid";


        /*
         * First day of month
         */

        const firstDay =
            new Date(year, month, 1);

        const startingWeekday =
            firstDay.getDay();


        /*
         * Empty cells before first date.
         */

        for (
            let i = 0;
            i < startingWeekday;
            i++
        ) {

            const empty =
                document.createElement("div");

            empty.className =
                "calendar-day empty";

            grid.appendChild(empty);

        }


        /*
         * Number of days in month.
         *
         * This automatically handles
         * February and leap years.
         */

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        /*
         * CREATE EVERY DAY
         */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const date =
                new Date(
                    year,
                    month,
                    day
                );


            /*
             * Don't display dates outside
             * user's selected period.
             */

            if (
                date < startDate ||
                date > endDate
            ) {

                const outside =
                    document.createElement("div");

                outside.className =
                    "calendar-day empty";

                grid.appendChild(outside);

                continue;

            }


            const key =
                dateKey(date);


            const cell =
                document.createElement("button");

            cell.className =
                "calendar-day";

            cell.dataset.date =
                key;


            /*
             * DATE NUMBER
             */

            const number =
                document.createElement("span");

            number.className =
                "day-number";

            number.textContent =
                day;


            cell.appendChild(number);


            /*
             * COLORED CROSS
             */

            const cross =
                document.createElement("span");

            cross.className =
                "day-cross";


            cell.appendChild(cross);


            /*
             * RESTORE SAVED STATUS
             */

            const status =
                profile.attendance[key];


            if (status) {

                cell.classList.add(
                    `status-${status}`
                );

            }


            /*
             * CLICK DATE
             */

            cell.addEventListener(
                "click",
                () => {

                    openDateMenu(
                        date,
                        key
                    );

                }
            );


            grid.appendChild(cell);

        }


        monthSection.appendChild(grid);

        monthsContainer.appendChild(monthSection);

    }


    /*
     * OPEN DATE MENU
     */

    let selectedDateKey = null;


    function openDateMenu(date, key) {

        selectedDateKey = key;


        selectedDateText.textContent =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        dateMenu.classList.add("show");

    }


    /*
     * CLOSE DATE MENU
     */

    document
        .getElementById("closeDateMenu")
        .addEventListener(
            "click",
            () => {

                dateMenu.classList.remove("show");

            }
        );


    /*
     * CLICK OUTSIDE MENU
     */

    dateMenu.addEventListener(
        "click",
        event => {

            if (event.target === dateMenu) {

                dateMenu.classList.remove("show");

            }

        }
    );


    /*
     * PRESENT / ABSENT / HOLIDAY
     */

    document
        .querySelectorAll(
            ".attendance-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (!selectedDateKey) return;


                    const status =
                        button.dataset.status;


                    /*
                     * SAVE STATUS
                     */

                    profile.attendance[
                        selectedDateKey
                    ] = status;


                    saveProfile();


                    /*
                     * Close popup
                     */

                    dateMenu.classList.remove(
                        "show"
                    );


                    /*
                     * Rebuild calendar
                     */

                    generateCalendar();


                    /*
                     * Update statistics
                     */

                    updateStatistics();

                }
            );

        });


    /*
     * CALCULATE STATISTICS
     */

    function updateStatistics() {

        let present = 0;
        let absent = 0;
        let holiday = 0;


        const today =
            new Date();

        today.setHours(
            23, 59, 59, 999
        );


        Object.entries(
            profile.attendance
        ).forEach(
            ([key, status]) => {

                const date =
                    parseDate(key);


                /*
                 * Don't count future dates
                 * in CURRENT attendance.
                 */

                if (date > today) return;


                if (status === "present") {

                    present++;

                }

                else if (status === "absent") {

                    absent++;

                }

                else if (status === "holiday") {

                    holiday++;

                }

            }
        );


        /*
         * Holidays are NOT attendance days.
         */

        const attendanceDays =
            present + absent;


        let percentage = 0;


        if (attendanceDays > 0) {

            percentage =
                (present / attendanceDays) * 100;

        }


        document.getElementById(
            "presentCount"
        ).textContent = present;


        document.getElementById(
            "absentCount"
        ).textContent = absent;


        document.getElementById(
            "holidayCount"
        ).textContent = holiday;


        document.getElementById(
            "currentPercentage"
        ).textContent =
            percentage.toFixed(2) + "%";

    }


    /*
     * EDIT PROFILE
     */

    document
        .getElementById("editProfileButton")
        .addEventListener(
            "click",
            () => {

                window.location.href =
                    "login.html?edit=true";

            }
        );


    document
        .getElementById("editPeriodButton")
        .addEventListener(
            "click",
            () => {

                window.location.href =
                    "login.html?edit=true";

            }
        );


    /*
     * INITIAL LOAD
     */

    displayProfile();

    generateCalendar();

    updateStatistics();

});
