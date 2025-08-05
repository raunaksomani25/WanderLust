document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("dateRange");
  if (!input) return;

  flatpickr(input, {
    mode: "range",
    inline: true,
    minDate: "today",
    dateFormat: "Y-m-d",
    disable: bookedDates,
    onChange: function (selectedDates) {
      if (selectedDates.length === 2) {
        const [checkIn, checkOut] = selectedDates;
        document.getElementById("checkIn").value = checkIn.toISOString();
        document.getElementById("checkOut").value = checkOut.toISOString();
      }
    }
  });
});


  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-edit-booking='true']");
    if (!form) return;

    const input = document.getElementById("editDateRange");
    if (!input) return;

    // Extract booked date ranges (excluding current booking)
    const existingRaw = form.getAttribute("data-existing-bookings");
    let bookedRanges = [];
    try {
      const rawRanges = JSON.parse(existingRaw);
      bookedRanges = rawRanges.map(([start, end]) => ({
        from: start.slice(0, 10),
        to: end.slice(0, 10)
      }));
    } catch (e) {
      console.error("Invalid booked date format:", e);
    }

    // Default selected dates for this booking
    const defaultCheckIn = form.getAttribute("data-default-checkin");
    const defaultCheckOut = form.getAttribute("data-default-checkout");
    const defaultDates = defaultCheckIn && defaultCheckOut
      ? [new Date(defaultCheckIn), new Date(defaultCheckOut)]
      : [];

    flatpickr(input, {
      mode: "range",
      inline: true,
      static: true,
      minDate: "today",
      dateFormat: "Y-m-d",
      disable: bookedRanges,
      defaultDate: defaultDates,
      onChange: function (selectedDates) {
        if (selectedDates.length === 2) {
          const [checkIn, checkOut] = selectedDates;
          document.getElementById("checkIn").value = checkIn.toISOString();
          document.getElementById("checkOut").value = checkOut.toISOString();
        }
      }
    });
  });

