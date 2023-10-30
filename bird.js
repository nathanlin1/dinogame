import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"
import { SPEED } from "./ground.js"
import { WORLD_HEIGHT } from "./script.js"
import { FRAME_TIME } from "./dino.js"

const BIRD_FRAME_COUNT = 2
const worldElem = document.querySelector("[data-world]")

let birdFrame
let currentFrameTime

export function setupBird() {
    birdFrame = 0
    currentFrameTime = 0
    document.querySelectorAll("[data-bird]").forEach(bird => {
        bird.remove()
    })
}

export function updateBird(delta, speedScale) {
    document.querySelectorAll("[data-bird]").forEach(bird => {
        if (currentFrameTime >= FRAME_TIME * 3) {
            birdFrame = (birdFrame + 1) % BIRD_FRAME_COUNT
            bird.src = `imgs/bird-${birdFrame}.png`
            currentFrameTime -= FRAME_TIME * 3
        }
        currentFrameTime += delta * speedScale

        incrementCustomProperty(bird, "--left", delta * SPEED * speedScale * -1)
        if (getCustomProperty(bird, "--left") <= -100) {
            bird.remove()
        }
    })
}

export function getBirdRects() {
    return [...document.querySelectorAll("[data-bird]")].map(bird => {
        return bird.getBoundingClientRect()
    })
}

export function createBird() {
    const bird = document.createElement("img")
    bird.dataset.bird = true
    bird.src = "imgs/bird-0.png"
    bird.classList.add("bird")
    setCustomProperty(bird, "--left", 100)
    setCustomProperty(bird, "--bottom", Math.random() * (WORLD_HEIGHT - 10) + 10)
    worldElem.append(bird)
}