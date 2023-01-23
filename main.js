class Dragon {
    constructor(name, score, violations) {
        this.name = name
        this.score = score
        this.violations = violations
    }
}

class Poles {
    constructor(type, color, rings, score_given) {
        this.type = type
        this.color = color
    }
}

/* define team objects */
let redDragon = new Dragon('Fiery', 0, 0)
let blueDragon = new Dragon('War', 0, 0)

console.log('hello there')

/* triggered when poles are clicked */
/* left click: red  */
/* right click: blue */
function score_listener(event, scorer) {
    /* prevents the right click menu from showing up */
    event.preventDefault()

    console.log(scorer)

    if (event.target.className.includes('type1')) {
        console.log('type1')
    } else if (event.target.className.includes('type2')) {
        console.log('type2')
    } else if (event.target.className.includes('type3')) {
        console.log('type3')
    }
}

/* add pole listeners */
const type1_poles = document.getElementsByClassName('pole')

for (let i = 0; i < type1_poles.length; i++) {
    type1_poles[i].addEventListener('click', (event) => {
        score_listener(event, 'red')
    })
    type1_poles[i].addEventListener('contextmenu', (event) => {
        score_listener(event, 'blue')
    })
}
