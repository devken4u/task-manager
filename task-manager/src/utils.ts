function calculateElapsedDate(date: Date) {
  const created = new Date(date);
  const dateNow = new Date();

  const elapsedMilliseconds = dateNow.getTime() - created.getTime();
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  const elapsedMonths = Math.floor(elapsedDays / 30);
  const elapsedYears = Math.floor(elapsedMonths / 12);

  if (elapsedSeconds < 60) {
    return "Just Now";
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min(s) ago`;
  }

  if (elapsedHours < 25) {
    return `${elapsedHours} hour(s) ago`;
  }

  if (elapsedDays < 31) {
    return `${elapsedDays} day(s) ago`;
  }

  if (elapsedMonths < 13) {
    return `${elapsedMonths} month(s) ago`;
  }

  return `${elapsedYears} year(s) ago`;
}

export { calculateElapsedDate };
