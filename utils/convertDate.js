function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60; 
  hours = hours % 24;   

  return `${padTo2Digits(hours+1)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds,
  )}`;
}

export default convertMsToTime