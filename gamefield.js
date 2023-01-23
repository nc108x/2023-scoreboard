import { update_score } from './score.js'
/* rings: array containing all the rings thrown onto the pole */
/* am using it as a stack so the last element is the topmost ring i.e. the ring that is actually counted */
/* type: contains the type of the pole (type 1/2/3 and which side of the field it is on for type 1) */
class Pole {
    rings = []
    constructor(type) {
        this.type = type
    }
}

/* array containing all the pole objects */
/* score.js will access this to check the state of the poles and calc the score */
const poles = []

/* triggered when poles are clicked */
/* left click: red  */
/* right click: blue */
function score_listener(event, color, pole_no) {
    /* prevents the right click menu from showing up */
    event.preventDefault()

    /* console.log(color) */

    /* update specified pole */
    poles[pole_no].rings.push(color)
    console.log(pole_no)
    console.log(poles[pole_no].rings)
    update_score()

    /* if (event.target.className.includes('type1')) { */
    /*     console.log('type1') */
    /* } else if (event.target.className.includes('type2')) { */
    /*     console.log('type2') */
    /* } else if (event.target.className.includes('type3')) { */
    /*     console.log('type3') */
    /* } */

    /* if (color == 'red') { */
    /*     document.getElementById('red_score').innerHTML = dragon.score */
    /* } else { */
    /*     document.getElementById('blue_score').innerHTML = dragon.score */
    /* } */
}

/* basically inits all gamefield stuff */
function gamefield_init() {
    const pole_buttons = document.getElementsByClassName('pole')

    for (let i = 0; i < pole_buttons.length; i++) {
        /* create pole objects */
        poles[i] = new Pole(pole_buttons[i].className.substring(4))

        /* add pole button listeners for left/right click */
        pole_buttons[i].addEventListener('click', (event) => {
            score_listener(event, 'red', i)
        })
        pole_buttons[i].addEventListener('contextmenu', (event) => {
            score_listener(event, 'blue', i)
        })
    }
}

export { poles, gamefield_init }
