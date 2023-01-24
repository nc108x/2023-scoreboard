import { redDragon, blueDragon, poles, update_score } from "./score.js"

/* resets the state of all the poles */
function reset_listener() {
    console.log("reset")
    for (let i = 0; i < poles.length; i++) {
        poles[i].rings.length = 0
        console.log(poles[i].rings)
    }
    update_score()
}

/* swap names of the two sides */
function swap_listener() {
    if (redDragon.name == "FIERY") {
        redDragon.name = "WAR"
        blueDragon.name = "FIERY"
    } else {
        redDragon.name = "FIERY"
        blueDragon.name = "WAR"
    }
    document.getElementById("red-name").innerHTML = redDragon.name + " DRAGON: "
    document.getElementById("blue-name").innerHTML =
        blueDragon.name + " DRAGON: "
}

/* inits all buttons in the control panel */
function control_panel_init() {
    let reset_button = document.getElementById("reset")
    reset_button.addEventListener("click", reset_listener)

    let swap_button = document.getElementById("swap")
    swap_button.addEventListener("click", swap_listener)
}

export { control_panel_init }
