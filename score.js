import { poles } from './gamefield.js'
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
let redDragon = new Dragon('Fiery', 0)
let blueDragon = new Dragon('War', 0)

/* updates score saved in the team objects and the display on the scoreboard */
/* does so by checking each pole to see who has the topmost ring */
/* I am aware that this is not the most efficient way to do it but eh */
function update_score() {
    redDragon.score = 0
    blueDragon.score = 0

    for (let i = 0; i < poles.length; i++) {
        /* skip if the pole is empty */
        if (poles[i].rings.length == 0) {
            /* console.log('empty') */
            continue
        }

        /* console.log( */
        /*     'pole number ' + */
        /*         i + */
        /*         ': ' + */
        /*         poles[i].rings[poles[i].rings.length - 1] */
        /* ) */

        let captured_by = poles[i].rings[poles[i].rings.length - 1]
        let score_increase = 0

        if (poles[i].type.includes('type1')) {
            /* console.log('type1') */

            /* consider type 1 bonus for opposing pole */
            if (poles[i].type.includes(captured_by)) {
                score_increase = 10
            } else {
                score_increase = 25
            }
        } else if (poles[i].type.includes('type2')) {
            /* console.log('type2') */

            score_increase = 30
        } else if (poles[i].type.includes('type3')) {
            /* console.log('type3') */

            score_increase = 70
        }

        console.log(
            'pole ' +
                i +
                ' captured by ' +
                captured_by +
                ' with a score increase of ' +
                score_increase
        )

        /* add score to team  */
        if (captured_by == 'red') {
            redDragon.score += score_increase
        } else {
            blueDragon.score += score_increase
        }

        /* update score displayed on the scoreboard */
        document.getElementById('red_score').innerHTML = redDragon.score
        document.getElementById('blue_score').innerHTML = blueDragon.score
    }
}

export { update_score }
