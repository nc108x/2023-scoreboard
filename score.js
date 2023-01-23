class Dragon {
    constructor(name, score, violations) {
        this.name = name
        this.score = score
        this.violations = violations
    }
}

/* define team objects */
export let redDragon = new Dragon('Fiery', 0, 0)
export let blueDragon = new Dragon('War', 0, 0)
