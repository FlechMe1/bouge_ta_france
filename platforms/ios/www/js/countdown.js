function init_countdown(){

  var endTime = new Date("07/10/2017 12:00:00");
  var endTime = (Date.parse(endTime)) / 1000;

  var now = new Date();
  var now = (Date.parse(now) / 1000);

  var timeLeft = endTime - now;

  var days = Math.floor(timeLeft / 86400);
  var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
  var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
  var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

  if (hours < "10") { hours = "0" + hours; }
  if (minutes < "10") { minutes = "0" + minutes; }
  if (seconds < "10") { seconds = "0" + seconds; }

  second_go_to(seconds);
  minutes_go_to(minutes);
  hours_go_to(hours);
  days_go_to(days);
}
function second_go_to(seconds){
  $('.number.seconds').html(seconds);
}

function minutes_go_to(minutes){
  $('.number.minutes').html(minutes);
}

function hours_go_to(hours){
  $('.number.hours').html(hours);
}

function days_go_to(days){
  $('.number.days').html(days);
}
