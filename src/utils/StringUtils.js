expot const zfill = (text, ch, len) => {
  text = text.toString();
  let result = text;
  ch = ch || ' ';
  for(let i = text.length; i < len; i++) {
    result = ch + result;
  }
  return result;
};
export const formatDateTime = (text, dateTime) => {
  const d = dateTime || new Date();
  const year = d.getYear() + 1900;
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hours = d.getHours();
  const min = d.getMinutes();
  const sec = d.getSeconds();
  const ms = d.getMilliseconds();
  return text
  .replace('YYYY', zfill(year, '0', 4))
  .replace('MM', zfill(month, '0', 2))
  .replace('DD', zfill(date, '0', 2))
  .replace('HH', zfill(hours, '0', 2))
  .replace('mm', zfill(min, '0', 2))
  .replace('SS', zfill(sec, '0', 2))
  .replace('ss', zfill(ms, '0', 2));
};
