const padTime = time => {
  return "".padStart.call(time, 2, "0");
};

module.exports = () => {
  const d = new Date();
  const year = "".slice.call(d.getFullYear(), 2);
  const month = padTime(d.getMonth() + 1);
  const date = padTime(d.getDate());
  const hours = padTime(d.getHours());
  const min = padTime(d.getMinutes());
  const secs = padTime(d.getSeconds());

  return `${year}${month}${date}-${hours}${min}${secs}`;
};
