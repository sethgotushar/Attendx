document.addEventListener("DOMContentLoaded", () => {
    const PROFILE_KEY = "attendxProfile";

    const profile = JSON.parse(localStorage.getItem(PROFILE_KEY));

    // No profile → go back to login
    if (!profile) {
        window.location.href = "login.html";
        return;
    }

    // Make sure attendance storage exists
    if (!profile.attendance) {
        profile.attendance = {};
    }

    // --------------------------------------------------
    // ELEMENTS
    // --------------------------------------------------

    const calendarName = document.getElementById("calendarName");
    const calendarClass = document.getElementById("calendarClass");
    const calendarTarget = document.getElementById("calendarTarget");
    const calendarAvatar = document.getElementById("calendarAvatar");
    const calendarPeriod = document.getElementById("calendarPeriod");

    const monthsContainer = document.getElementById("monthsContainer");

    const presentCount = document.getElementById("presentCount");
    const absentCount = document.getElementById("absentCount");
    const holidayCount = document.getElementById("holidayCount");
    const currentPercentage = document.getElementById("currentPercentage");

    const dateMenu = document.getElementById("dateMenu");
    const selectedDateText = document.getElementById("selectedDateText");
    const closeDateMenu = document.getElementById("closeDateMenu");

    const editProfileButton = document.getElementById("editProfileButton");
    const editPeriodButton = document.getElementById("editPeriodButton");

    // --------------------------------------------------
    // PROFILE INFORMATION
    // --------------------------------------------------

    calendarName.textContent = profile.name || "Student";

    calendarClass.textContent = profile.className
        ? `Class ${profile.className}`
        : "Class";

    calendarTarget.textContent =
        `${Number(profile.targetAttendance || 75)}%`;

    if (profile.avatar) {
        calendarAvatar.src = profile.avatar;
    } else {
        calendarAvatar.src = "assets/avatars/avatar1.png";
    }

    // --------------------------------------------------
    // DATE HELPERS
    // --------------------------------------------------

    function parseDate(dateString) {
        if (!dateString) return null;

        const parts = dateString.split("-");

        if (parts.length !== 3) return null;

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        return new Date(year, month - 1, day);
    }

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    function formatMonthYear(year, month) {
        const date = new Date(year, month, 1);

        return date.toLocaleString("en-US", {
            month: "long",
            year: "numeric"
        });
    }

    function dateKey(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    // --------------------------------------------------
    // GET SELECTED DATE RANGE
    // --------------------------------------------------

    const startDate = parseDate(profile.startDate);
    const endDate = parseDate(profile.endDate);

    // If dates are missing, use a safe default
    if (!startDate || !endDate) {
        alert("Please set your academic start and end dates.");

        window.location.href = "login.html?edit=true";
        return;
    }

    // Make sure start isn't after end
    if (startDate > endDate) {
        alert("Start date cannot be after the end date.");

        window.location.href = "login.html?edit=true";
        return;
    }

    // Show selected period
    calendarPeriod.textContent =
        `${formatDate(startDate)} — ${formatDate(endDate)}`;

    // --------------------------------------------------
    // CALENDAR GENERATION
    // --------------------------------------------------

    function generateCalendar() {
        monthsContainer.innerHTML = "";

        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();

        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth();

        let currentYear = startYear;
        let currentMonth = startMonth;

        // Continue ONLY until the month containing endDate
        while (
            currentYear < endYear ||
            (
                currentYear === endYear &&
                currentMonth <= endMonth
            )
        ) {

            const monthSection = document.createElement("section");
            monthSection.className = "month-card";

            // ------------------------------------------
            // MONTH HEADER
            // ------------------------------------------

            const monthHeader = document.createElement("div");
            monthHeader.className = "month-header";

            const monthTitle = document.createElement("h2");
            monthTitle.textContent =
                formatMonthYear(currentYear, currentMonth);

            monthHeader.appendChild(monthTitle);
            monthSection.appendChild(monthHeader);

            // ------------------------------------------
            // WEEKDAY HEADER
            // ------------------------------------------

            const weekdays = document.createElement("div");
            weekdays.className = "calendar-weekdays";

            const weekdayNames = [
                "SUN",
                "MON",
                "TUE",
                "WED",
                "THU",
                "FRI",
                "SAT"
            ];

            weekdayNames.forEach(dayName => {
                const day = document.createElement("div");

                day.className = "weekday";
                day.textContent = dayName;

                weekdays.appendChild(day);
            });

            monthSection.appendChild(weekdays);

            // ------------------------------------------
            // DAYS GRID
            // ------------------------------------------

            const daysGrid = document.createElement("div");
            daysGrid.className = "calendar-grid";

            // Number of days in this month
            const daysInMonth =
                new Date(currentYear, currentMonth + 1, 0).getDate();

            // First weekday of this month
            const firstWeekday =
                new Date(currentYear, currentMonth, 1).getDay();

            // Empty spaces before day 1
            for (let i = 0; i < firstWeekday; i++) {
                const emptyDay = document.createElement("div");

                emptyDay.className =
                    "calendar-day empty-day";

                daysGrid.appendChild(emptyDay);
            }

            // ------------------------------------------
            // EXACT START / END LIMITS
            // ------------------------------------------

            let firstDay = 1;
            let lastDay = daysInMonth;

            // FIRST MONTH
            if (
                currentYear === startYear &&
                currentMonth === startMonth
            ) {
                firstDay = startDate.getDate();
            }

            // LAST MONTH
            if (
                currentYear === endYear &&
                currentMonth === endMonth
            ) {
                lastDay = endDate.getDate();
            }

            // ------------------------------------------
            // CREATE ONLY VALID DAYS
            // ------------------------------------------

            for (let dayNumber = firstDay;
                 dayNumber <= lastDay;
                 dayNumber++) {

                const key =
                    dateKey(
                        currentYear,
                        currentMonth,
                        dayNumber
                    );

                const dayCell =
                    document.createElement("button");

                dayCell.type = "button";
                dayCell.className = "calendar-day";

                dayCell.dataset.date = key;

                // Date number
                const number =
                    document.createElement("span");

                number.className = "day-number";
                number.textContent = dayNumber;

                dayCell.appendChild(number);

                // Attendance cross
                const cross =
                    document.createElement("span");

                cross.className = "day-cross";
                cross.textContent = "✕";

                dayCell.appendChild(cross);

                // Apply saved status
                applyStatus(
                    dayCell,
                    profile.attendance[key]
                );

                // Click date
                dayCell.addEventListener("click", () => {
                    openDateMenu(
                        key,
                        currentYear,
                        currentMonth,
                        dayNumber
                    );
                });

                daysGrid.appendChild(dayCell);
            }

            monthSection.appendChild(daysGrid);

            monthsContainer.appendChild(monthSection);

            // ------------------------------------------
            // MOVE TO NEXT MONTH
            // ------------------------------------------

            currentMonth++;

            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
    }

    // --------------------------------------------------
    // APPLY ATTENDANCE STATUS
    // --------------------------------------------------

    function applyStatus(dayCell, status) {
        dayCell.classList.remove(
            "present",
            "absent",
            "holiday"
        );

        if (status === "present") {
            dayCell.classList.add("present");
        }

        if (status === "absent") {
            dayCell.classList.add("absent");
        }

        if (status === "holiday") {
            dayCell.classList.add("holiday");
        }
    }

    // --------------------------------------------------
    // DATE MENU
    // --------------------------------------------------

    let selectedDateKey = null;

    function openDateMenu(
        key,
        year,
        month,
        day
    ) {
        selectedDateKey = key;

        const selectedDate =
            new Date(year, month, day);

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

        dateMenu.classList.add("show");
    }

    function closeMenu() {
        dateMenu.classList.remove("show");
        selectedDateKey = null;
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
        dateMenu.addEventListener("click", event => {
            if (event.target === dateMenu) {
                closeMenu();
            }
        });
    }

    // --------------------------------------------------
    // ATTENDANCE BUTTONS
    // --------------------------------------------------

    const attendanceOptions =
        document.querySelectorAll(
            ".attendance-option"
        );

    attendanceOptions.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (!selectedDateKey) {
                    return;
                }

                const status =
                    button.dataset.status;

                // Save status
                profile.attendance[
                    selectedDateKey
                ] = status;

                // Save profile
                localStorage.setItem(
                    PROFILE_KEY,
                    JSON.stringify(profile)
                );

                // Find selected day
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

                // Update statistics
                updateStatistics();

                closeMenu();
            }
        );
    });

    // --------------------------------------------------
    // ATTENDANCE STATISTICS
    // --------------------------------------------------

    function updateStatistics() {

        let present = 0;
        let absent = 0;
        let holiday = 0;

        const today = new Date();

        // Remove time from today
        today.setHours(0, 0, 0, 0);

        Object.entries(
            profile.attendance
        ).forEach(([key, status]) => {

            const attendanceDate =
                parseDate(key);

            if (!attendanceDate) {
                return;
            }

            // Future dates should NOT affect
            // current attendance
            if (attendanceDate > today) {
                return;
            }

            if (status === "present") {
                present++;
            }

            else if (status === "absent") {
                absent++;
            }

            else if (status === "holiday") {
                holiday++;
            }
        });

        const totalWorkingDays =
            present + absent;

        let percentage = 0;

        if (totalWorkingDays > 0) {
            percentage =
                (present / totalWorkingDays) * 100;
        }

        presentCount.textContent = present;
        absentCount.textContent = absent;
        holidayCount.textContent = holiday;

        currentPercentage.textContent =
            `${percentage.toFixed(1)}%`;
    }

    // --------------------------------------------------
    // EDIT PROFILE
    // --------------------------------------------------

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

    // --------------------------------------------------
    // INITIALIZE
    // --------------------------------------------------

    generateCalendar();
    updateStatistics();
});
