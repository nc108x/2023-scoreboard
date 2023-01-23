import { redDragon, blueDragon } from './score.js'

class Poles {
    constructor(type, color) {
        this.type = type
        this.color = color
        this.rings = []
    }
}

/* triggered when poles are clicked */
/* left click: red  */
/* right click: blue */
function score_listener(event, color, dragon) {
    /* prevents the right click menu from showing up */
    event.preventDefault()

    console.log(color)

    if (event.target.className.includes('type1')) {
        console.log('type1')
        dragon.score++
    } else if (event.target.className.includes('type2')) {
        console.log('type2')
        dragon.score += 2
    } else if (event.target.className.includes('type3')) {
        console.log('type3')
        dragon.score += 3
    }

    if (color == 'red') {
        document.getElementById('red_score').innerHTML = dragon.score
    } else {
        document.getElementById('blue_score').innerHTML = dragon.score
    }
}

/* basically inits all gamefield objects */
export function gamefield_init() {
    /* add pole listeners */
    const pole_buttons = document.getElementsByClassName('pole')

    for (let i = 0; i < pole_buttons.length; i++) {
        pole_buttons[i].addEventListener('click', (event) => {
            score_listener(event, 'red', redDragon)
        })
        pole_buttons[i].addEventListener('contextmenu', (event) => {
            score_listener(event, 'blue', blueDragon)
        })
    }
}
