/*

Contains data for a boss's attack; mainly a bunch of values
- Contains code to choose a random cooldown
- Includes a function where it can randomly determine to attack
*/

export class BossAttack {
    public act: Function;
    public lastUsed: number = 0;
    public disabled: boolean = false;
    private cooldownMin: number;
    private cooldownMax: number;
    public chosenCooldown: number = -1;
    public occurenceChance: number;
    constructor(act: Function, cooldownMin: number, cooldownMax: number, occurenceChance: number) {
        this.act = (tValue: number) => { this.lastUsed = tValue; act(); this.chooseRandomCooldown() }
        this.cooldownMin = cooldownMin
        this.cooldownMax = cooldownMax
        this.occurenceChance = occurenceChance

        this.chooseRandomCooldown()
    }

    chooseRandomCooldown() {
        const randomCooldown = Math.floor(Math.random() * (this.cooldownMax - this.cooldownMin + 1)) + this.cooldownMin;
        this.chosenCooldown = randomCooldown
        return randomCooldown
    }

    randomlyAttack(tValue: number) {
        const randomNumber = Math.random()
        if (randomNumber <= this.occurenceChance) {
            this.act(tValue)
            return true
        }
        return false
    }

    cooldownPassed(tValue: number) {
        if (tValue - this.lastUsed >= this.chosenCooldown) {
            return true
        }
        return false
    }

    runAttackLogic(tValue: number) { // Go through the steps of cooldown passed? --> randomly attack --> act
        if (!this.cooldownPassed(tValue)) { return false }
        return this.randomlyAttack(tValue)
    }
}