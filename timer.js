const ONE_MIN = 60000;
const THREE_MINS = 180000;

class Timer {
  constructor() {
    this.btn_state = "START";
    this.timer_state = "IDLE";
    this.start_time = Date.now();
    this.countdown = ONE_MIN;
  }

  get_elapsed_time() {
    return Date.now() - this.start_time;
  }
}

let game_timer = new Timer();

function ms_to_time(ms) {
  const new_ms = ("0" + Math.floor((ms % 1000) / 10)).slice(-2);
  const sec = ("0" + Math.floor((ms / 1000) % 60)).slice(-2);
  const min = ("0" + Math.floor(ms / 60 / 1000)).slice(-2);
  return min + ":" + sec + ":" + new_ms;
}

function timer_listener(event) {
  /* let btn_state = event.target.innerHTML; */
  console.log(game_timer.btn_state);
  if (game_timer.btn_state == "START") {
    game_timer.btn_state = "STOP";
    game_timer.timer_state = "PREP";
    game_timer.start_time = Date.now();
  } else {
    game_timer.btn_state = "START";
    game_timer.timer_state = "IDLE";
  }
  event.target.innerHTML = game_timer.btn_state;

  /* console.log(game_timer.get_elapsed_time()); */
  /* console.log(ms_to_time(game_timer.get_elapsed_time())); */
}

function timer_update() {
  let timer_display = document.getElementById("timer");
  let remaining_time;
  /* timer_display.innerHTML = ms_to_time( */
  /*   game_timer.countdown - game_timer.get_elapsed_time() */
  /* ); */
  switch (game_timer.timer_state) {
    case "IDLE":
      timer_display.innerHTML = "00:00:00";
      break;

    case "PREP":
      remaining_time = ONE_MIN - game_timer.get_elapsed_time();
      if (remaining_time < 0) {
        game_timer.timer_state = "GAME";
        game_timer.start_time = Date.now();
      } else {
        timer_display.innerHTML = ms_to_time(remaining_time);
      }
      break;

    case "GAME":
      remaining_time = THREE_MINS - game_timer.get_elapsed_time();
      if (remaining_time < 0) {
        game_timer.timer_state = "IDLE";
      } else {
        timer_display.innerHTML = ms_to_time(remaining_time);
      }
  }
}

function timer_init() {
  let timer_button = document.getElementById("timer-toggle");
  timer_button.addEventListener("click", (event) => timer_listener(event));
}

setInterval(timer_update, 8);

export { Timer, timer_init };
