/* name: fiery/war dragon (unless we come up with new names lmao) */
/* score: current score */
/* there should only be two instances of the Dragon object (red and blue) */
class Dragon {
    constructor(name, score) {
        this.name = name
        this.score = score
    }
}

/* define team objects */
let redDragon = new Dragon("FIERY", 0)
let blueDragon = new Dragon("WAR", 0)

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
const poles = []

/* updates score saved in the team objects and the display on the scoreboard */
/* does so by checking each pole to see who has the topmost ring */
/* I am aware that this is not the most efficient way to do it but eh */
function update_score() {
    redDragon.score = 0
    blueDragon.score = 0

    for (let i = 0; i < poles.length; i++) {
        let score_increase = 0

        /* skip if the pole is empty */
        if (poles[i].rings.length != 0) {
            let captured_by = poles[i].rings[poles[i].rings.length - 1]

            if (poles[i].type.includes("type1")) {
                /* console.log('type1') */

                /* consider type 1 bonus for opposing pole */
                if (poles[i].type.includes(captured_by)) {
                    score_increase = 10
                } else {
                    score_increase = 25
                }
            } else if (poles[i].type.includes("type2")) {
                /* console.log('type2') */

                score_increase = 30
            } else if (poles[i].type.includes("type3")) {
                /* console.log('type3') */

                score_increase = 70
            }

            console.log(
                "pole " +
                    i +
                    " captured by " +
                    captured_by +
                    " with a score increase of " +
                    score_increase
            )

            /* add score to team  */
            if (captured_by == "red") {
                redDragon.score += score_increase
            } else {
                blueDragon.score += score_increase
            }
        }
    }

    /* update score displayed on the scoreboard */
    document.getElementById("red-score").innerHTML = redDragon.score
    document.getElementById("blue-score").innerHTML = blueDragon.score
}

function pole_button_listener(event, color, pole_no) {
    /* prevents the right click menu from showing up */
    event.preventDefault()

    /* console.log(color) */

    /* update specified pole */
    poles[pole_no].rings.push(color)
    console.log(pole_no)
    console.log(poles[pole_no].rings)
    update_score()
}

/* basically inits all gamefield stuff */
function gamefield_init() {
    const pole_buttons = document.getElementsByClassName("pole")

    for (let i = 0; i < pole_buttons.length; i++) {
        /* create pole objects */
        poles[i] = new Pole(pole_buttons[i].className.substring(4))

        /* add pole button listeners for left/right click */
        pole_buttons[i].addEventListener("click", (event) => {
            pole_button_listener(event, "red", i)
        })
        pole_buttons[i].addEventListener("contextmenu", (event) => {
            pole_button_listener(event, "blue", i)
        })
    }
}

export { redDragon, blueDragon, poles, update_score, gamefield_init }
