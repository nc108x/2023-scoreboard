import { update_score, poles } from './score.js'

/* resets the state of all the poles */
function reset_listener() {
    console.log('reset')
    for (let i = 0; i < poles.length; i++) {
        poles[i].rings.length = 0
        console.log(poles[i].rings)
    }
    update_score()
}

function control_panel_init() {
    let reset_button = document.getElementById('reset')
    reset_button.addEventListener('click', reset_listener)
}

export { control_panel_init }
