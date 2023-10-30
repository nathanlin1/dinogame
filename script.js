import { updateGround, setupGround } from './ground.js'
import { updateDino, setupDino, getDinoRect, setDinoLose } from './dino.js'
import { updateCactus, setupCactus, getCactusRects, createCactus } from './cactus.js'
import { updateBird, setupBird, getBirdRects, createBird } from './bird.js'

const WORLD_WIDTH = 100
export const WORLD_HEIGHT = 30
const SPEED_SCALE_INC = .00002

const OBSTACLE_INTERVAL_MIN = 1000
const OBSTACLE_INTERVAL_MAX = 3000

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

let lastTime
let speedScale
let score
let nextObstacleTime

function update(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime

    updateGround(delta, speedScale)
    updateDino(delta, speedScale)
    createObstacle(delta, speedScale)
    updateCactus(delta, speedScale)
    updateBird(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    if (checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function checkLose() {
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isCollision(rect, dinoRect)) || getBirdRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    return (
      rect1.left < rect2.right &&
      rect1.top < rect2.bottom &&
      rect1.right > rect2.left &&
      rect1.bottom > rect2.top
    )
  }

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INC
}

function updateScore(delta) {
    score += speedScale * .1
    scoreElem.textContent = Math.floor(score)
}

function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    nextObstacleTime = OBSTACLE_INTERVAL_MIN
    setupGround()
    setupDino()
    setupCactus()
    setupBird()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
}

function handleLose() {
    setDinoLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, {once: true})
        startScreenElem.classList.remove("hide")
    }, 100)
}

function createObstacle(delta, speedScale) {
    if (nextObstacleTime <= 0) {
        if (Math.random() > 0.3) createCactus()
        else createBird()
        nextObstacleTime = randomNumberBetween(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX) / speedScale
    }
    nextObstacleTime -= delta
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function setPixelToWorldScale() {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else {
      worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }

    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}