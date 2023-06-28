class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  draw() {
    ctx.strokeRect(this.x, this.y, playerWidth, playerHeight)
  }

  update() {
    if ((keys.a || keys.arrowleft) && this.x > 0) this.x -= 5
    if ((keys.d || keys.arrowright) && this.x + playerWidth < canvas.width) this.x += 5
  }
}

class Brick {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  draw() {
    ctx.strokeRect(this.x, this.y, brickWidth, brickHeight)
  }
}

class Ball {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.up = true
    this.left = true
  }

  draw() {
    ctx.strokeRect(this.x, this.y, ballWidth, ballHeight)
  }

  update() {
    if (this.up) this.y -= 4.5
    else this.y += 4.5

    if (this.left) this.x -= 4.5
    else this.x += 4.5

    if (this.y + ballHeight > canvas.height) {
      endGame(false)
      return
    } else if (this.y < 0) {
      this.up = false
    }

    if (this.x + ballWidth > canvas.width) {
      this.left = true
    } else if (this.x < 0) {
      this.left = false
    }

    if (
      this.y + ballHeight > player.y &&
      this.x + ballWidth > player.x &&
      player.x + playerWidth > this.x
    )
      this.up = true

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i]

      if (
        brick.x + brickWidth > this.x &&
        brick.y + brickHeight > this.y &&
        this.x + ballWidth > brick.x &&
        this.y + ballHeight > brick.y
      ) {
        if (this.x > brick.x) this.left = false
        else this.left = true

        if (this.y < brick.y) this.up = false
        else this.up = true

        bricks.splice(i, 1)

        if (bricks.length === 0) {
          endGame(true)
          return
        }
      }
    }
  }
}

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const brickWidth = canvas.width / 5 - 10
const brickHeight = canvas.height / 10 - 5
const ballWidth = 30
const ballHeight = ballWidth
const playerWidth = 100
const playerHeight = 20

const NUMBER_OF_BRICKS = 20
const BALL_SPEED = 3

const bricks = []
const player = new Player(canvas.width / 2 - playerWidth / 2, canvas.height - 50)
const ball = new Ball(canvas.width / 2 - ballWidth / 2, canvas.height - 100)

const keys = {}

let running = false
let started = false

function createBricks() {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 5; x++)
      bricks.push(new Brick(brickWidth * x + 10 * x + 5, brickHeight * y + 5 * y + 5))
  }
}

function endGame(win) {
  running = false

  const text = win ? "You win!" : "You lose..."

  setTimeout(() => {
    ctx.fillText(text, canvas.width / 2, canvas.height - 40)

    const restartButton = document.createElement("button")
    restartButton.innerText = "Restart"
    restartButton.addEventListener("click", () => location.reload())
    document.body.appendChild(restartButton)
  }, 1000)
}

let handle

function loop() {
  if (!running) {
    cancelAnimationFrame(handle)
    return
  }

  update()
  draw()

  handle = requestAnimationFrame(loop)
}

function update() {
  player.update()
  ball.update()
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  player.draw()
  ball.draw()

  for (let brick of bricks) {
    brick.draw()
  }
}

function startGame() {
  running = true
  started = true

  handle = requestAnimationFrame(loop)
}

window.addEventListener("DOMContentLoaded", () => {
  createBricks()
  draw()

  ctx.textAlign = "center"
  ctx.font = "30px monospace"
  ctx.fillText("Press any key to start", canvas.width / 2, canvas.height - 40)
})

window.addEventListener("keydown", (e) => {
  if (!running && !started) startGame()

  keys[e.key.toLowerCase()] = true
})

window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false))
