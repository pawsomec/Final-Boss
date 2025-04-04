
/*

Contains code for the boss 
- Attacks
    - Includes heart attack code
*/

import { BossArea } from "./BossArea";
import { BossAttack } from "./BossAttack";
import { GameElement } from "./GameElement";
import { HeartAttack } from "./HeartAttack";
import { PlayerArea } from "./PlayerArea";
import { playerObject } from "./utils";

export class Boss extends GameElement {

    private bossArea: BossArea;
    private playerArea: PlayerArea;
    private tValue: number = 0;

    public hits: number = 0;

    // Specific Goblin fight variables:
    private hearts: HeartAttack[] = [];
    private heartAttackStarted: boolean = false // Only start doing the heart attacks after the player has taken damage
    private heartAttackLength: number = HeartAttack.length
    private busyWithHeartAttack: number = 0 // A number that determines when the heart attack started so the other attacks will pause until a certain amount of time
    private attacks = {
        // Stage 1
        punchAttack: new BossAttack(() => { this.punchAttack() }, 1500, 5000, .8),
        whisperAttack: new BossAttack(() => { this.whisperAttack() }, 4300, 10000, .2), // Also stage 2

        // Stage 2
        punchAttack2: new BossAttack(() => { this.punchAttack2() }, 1250, 2250, .3),
        soldierAttack: new BossAttack(() => { this.soldierAttack() }, 2000, 12000, .1),
        heartAttack: new BossAttack(() => { this.heartAttack() }, 25000, 35000, .2),
        fakeHeartAttack: new BossAttack(() => { this.fakeHeartAttack() }, 24000, 34000, .2),

        // Stage 2.5
        punchAttack2Double: new BossAttack(() => { this.punchAttack2Double() }, 1250, 2250, .3),
        objectAttack: new BossAttack(() => { this.objectAttack() }, 3000, 7000, .2), // Also stage 3

        // Stage 3
        punchAttack2Fast: new BossAttack(() => { this.punchAttack2Fast() }, 500, 750, 1),
        doubleWhisperAttack: new BossAttack(() => { this.doubleWhisperAttack() }, 4300, 10000, .2),
        breathAttack: new BossAttack(() => { this.breathAttack() }, 10000, 15000, .1),
        removeEdgesAttack: new BossAttack(() => { this.removeEdgesAttack() }, 0, 0, 1), // This attack will only happen once, so cooldown doesn't really matter

    }
    constructor(bossArea: BossArea, playerArea: PlayerArea, canvas: HTMLCanvasElement) {
        super(canvas)
        this.playerArea = playerArea
        this.bossArea = bossArea

        window.addEventListener("keypress", (k) => {
            switch (k.key) {
                case ("`"):
                    this.punchAttack()
                    break
                case ("1"):
                    this.punchAttack2()
                    break
                case ("2"):
                    this.punchAttack2Double()
                    break
                case ("3"):
                    this.punchAttack2Fast()
                    break
                case ("4"):
                    this.whisperAttack()
                    break
                case ("5"):
                    this.soldierAttack()
                    break
                case ("6"):
                    this.objectAttack()
                    break
                case ("7"):
                    this.heartAttack()
                    break
                case ("8"):
                    this.fakeHeartAttack()
                    break
                case ("9"):
                    this.removeEdgesAttack()
                    break
                case ("0"):
                    this.breathAttack()
                    break
                case ("-"):
                    this.hits -= 1
                    break
                case ("="):
                    this.hits += 1
                    break
            }
        })
    }

    punchAttack(time: number = 1000, delay: number = 0) {
        const spot = this.playerArea.getRandomEnabledSpot()
        spot.startAttack(this.tValue + delay, time, .2)
    }
    punchAttack2() {
        this.punchAttack()
        this.punchAttack()
    }
    punchAttack2Double() {
        this.punchAttack()
        this.punchAttack()
        this.punchAttack(500, 1000)
        this.punchAttack(500, 1000)
    }
    punchAttack2Fast() {
        this.punchAttack(500)
        this.punchAttack(500)
    }
    whisperAttack() {
        const randomRow = Math.floor(Math.random() * (this.playerArea.rows - 1)) // Subtract one because can't do the final row and the row after it

        for (let i = 0; i < this.playerArea.spots.length; i++) {
            this.playerArea.spots[i][randomRow].startAttack(this.tValue + 300 * i, 2000, .1)
            this.playerArea.spots[i][randomRow + 1].startAttack(this.tValue + 300 * i, 2000, .1) // The whisper attack takes up two rows
        }
    }
    doubleWhisperAttack() {
        this.whisperAttack()
        this.whisperAttack()
    }
    removeEdgesAttack() {
        const start = this.tValue
        const length = 1000
        for (let i = 0; i < this.playerArea.spots[1].length; i++) {
            this.playerArea.spots[0][i].startAttack(start, length, .2, true)
            this.playerArea.spots[1][i].startAttack(start, length, .2, true)
            this.playerArea.spots[7][i].startAttack(start, length, .2, true)
            this.playerArea.spots[8][i].startAttack(start, length, .2, true)
        }
    }
    breathAttack() {
        const windupTime = 3000
        const damage = .2
        if (Math.random() < 0.5) {
            this.playerArea.spots[5][0].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[5][1].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[5][2].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[5][3].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[6][1].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[6][2].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[6][3].startAttack(this.tValue, windupTime, damage)
        } else {
            this.playerArea.spots[3][0].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[3][1].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[3][2].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[3][3].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[2][1].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[2][2].startAttack(this.tValue, windupTime, damage)
            this.playerArea.spots[2][3].startAttack(this.tValue, windupTime, damage)
        }
    }
    soldierAttack() { // Only can and will happen before the edges are removed!
        const randomStartRow = Math.floor(Math.random() * (this.playerArea.rows))
        const randomColumn = Math.floor(Math.random() * (3)) // Only start in the first three columns
        this.playerArea.spots[randomColumn][randomStartRow].startAttack(this.tValue, 3000, .4) // The location where the soldier will drop to appears first
        for (let i = randomColumn + 1; i < this.playerArea.columns; i++) {
            const spot = this.playerArea.spots[i][randomStartRow]
            const offset = i - randomColumn - 1 // offset each start time and length so they appear and attack one after the other
            spot.startAttack(this.tValue + 2000, 1500 + 500 * offset, .3)
        }
    }
    objectAttack() {
        const randomColumn1 = Math.floor(Math.random() * (this.playerArea.columns))
        const randomColumn2 = Math.floor(Math.random() * (this.playerArea.columns))
        const randomColumn3 = Math.floor(Math.random() * (this.playerArea.columns))
        for (let r = 0; r < this.playerArea.rows; r++) {
            const spot1 = this.playerArea.spots[randomColumn1][r]
            spot1.startAttack(this.tValue + 300 * r, 1000, .2)

            const spot2 = this.playerArea.spots[randomColumn2][r]
            spot2.startAttack(this.tValue + 300 * r, 1000, .2)

            const spot3 = this.playerArea.spots[randomColumn3][r]
            spot3.startAttack(this.tValue + 300 * r, 1000, .2)
        }
    }
    heartAttack(damage: number = -.25, tries: number = 0) {
        if (tries > 3) { return } // If couldn't find a free spot after 3 tries, stop trying to avoid an inifinte loop
        const possibleSpots = this.playerArea.getEnabledSpots()
        const randomSpot = possibleSpots[Math.floor(Math.random() * possibleSpots.length)]

        // Prevent the hearts from appearing on the same spot
        const spotOccupied = this.hearts.find(heart => {
            return heart.spot.row === randomSpot.row && heart.spot.column === randomSpot.column
        })
        if (spotOccupied) {
            this.heartAttack(damage, tries + 1)
            return
        }

        const newHeart = new HeartAttack(this.canvas, this.bossArea, this.tValue, randomSpot, damage) // Negative = heal
        this.hearts.push(newHeart)
    }
    fakeHeartAttack() {
        this.heartAttack(.25)
    }

    heartAttackLogic(t: number) {
        // The heart attack stops all other attacks if it occurs
        if (this.hearts.length < 2) { // Only allow two hearts to appear at once.  Technically, I think three could appear at once but that's ok
            if (this.attacks.heartAttack.cooldownPassed(t)) {
                this.busyWithHeartAttack = this.tValue

                this.attacks.heartAttack.runAttackLogic(t)

                this.attacks.fakeHeartAttack.lastUsed = t // Make sure the other heart attack won't occur too soon after this one
            } else if (this.attacks.fakeHeartAttack.cooldownPassed(t)) {
                this.busyWithHeartAttack = this.tValue

                this.attacks.fakeHeartAttack.runAttackLogic(t) // The fake heart attack doesn't stop the boss from other attacks
            }
        }
    }

    damage() {
        this.hits += 1
    }

    calculateSize() {

    }

    draw(t: number) {
        this.tValue = t
        const randomNumber = Math.random() // A random number for attacks to go off of when being random!

        // Calculate attacks
        console.log(this.hits)
        if (this.hits <= 0) {
            // No attacks; the game hasn't started
        } else if (this.hits < 6) { // Stage 1
            if (this.hits === 1) { // Start off with only one attack, the punch
                this.attacks.punchAttack.runAttackLogic(t)

            } else { // Then add the other attack
                this.attacks.punchAttack.runAttackLogic(t)
                this.attacks.whisperAttack.runAttackLogic(t)

            }
        } else if (this.hits < 12) { // Stage 2
            if (!this.heartAttackStarted && playerObject.healthPercent < 1) { // Once the player has taken damage, introduce the heart attack concept to the player
                this.heartAttackStarted = true
                this.busyWithHeartAttack = this.tValue

                this.attacks.heartAttack.runAttackLogic(t)

                this.attacks.fakeHeartAttack.lastUsed = t
                this.hits++
            }

            this.heartAttackLogic(t)

            if (this.tValue - this.busyWithHeartAttack > this.heartAttackLength) { // If the heart attack is still ongoing, don't do other attacks, otherwise do other attacks
                this.attacks.whisperAttack.runAttackLogic(t)

                if (this.attacks.soldierAttack.cooldownPassed(t)) {
                    this.attacks.soldierAttack.runAttackLogic(t)
                } else {
                    this.attacks.punchAttack2.runAttackLogic(t)
                }
            } else {
                // Pause attacks during the heart attack because boss will be occupied with the heart
            }

        } else if (this.hits < 17) { // Stage 2.5
            this.heartAttackLogic(t)

            if (this.tValue - this.busyWithHeartAttack > this.heartAttackLength) { // If the heart attack is still ongoing, don't do other attacks, otherwise do other attacks
                this.attacks.whisperAttack.runAttackLogic(t)
                this.attacks.objectAttack.runAttackLogic(t)

                if (this.attacks.soldierAttack.cooldownPassed(t)) {
                    this.attacks.soldierAttack.runAttackLogic(t)
                } else {
                    if (randomNumber > .7) { // Random chance to punch and punch again
                        this.attacks.punchAttack2Double.runAttackLogic(t)
                        this.attacks.punchAttack2.chooseRandomCooldown() // Don't want the punch attack 2 to happen immediately after so sync cooldowns 
                    } else {
                        this.attacks.punchAttack2.runAttackLogic(t)
                        this.attacks.punchAttack2Double.chooseRandomCooldown()
                    }
                }
            }

        } else if (this.hits < 35) { // Stage 3
            if (this.hits === 17) {
                this.attacks.removeEdgesAttack.act() // Only run this once, and run it specifically at this time
                this.hits++
            }

            this.heartAttackLogic(t) // For this stage, don't stop the other attacks from the hearts.

            this.attacks.punchAttack2Fast.runAttackLogic(t)
            this.attacks.whisperAttack.runAttackLogic(t)
            this.attacks.breathAttack.runAttackLogic(t)
            this.attacks.objectAttack.runAttackLogic(t)

        } else { // Boss is dead
            if (this.hits === 35) {
                alert("You win!")
                this.hits++
            }
        }

        // Draw hearts
        this.hearts.forEach((heart, i) => {
            heart.draw(t)
            if (heart.collected) {
                this.hearts.splice(i, 1)
            }
        });
    }
}