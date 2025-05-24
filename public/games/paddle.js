export default class Paddle {
    element
    posX
    posY
    width
    height
    velocity
    
    constructor(width) {
        this.element = document.createElement("div")
        this.element.className = "paddle"
        document.querySelector("body").appendChild(this.element)
        this.setWidth(width)
        this.setHeight(250)
        this.setPos(0, 0)
        this.velocity = 0
    }
    
    setWidth(width) {
        this.width = width
        this.element.style.width = width + "px"
    }
    
    setHeight(height) {
        this.height = height
        this.element.style.height = height + "px"
    }
    
    setPos(x, y) {
        this.setX(x)
        this.setY(y)
    }
    
    setX(x) {
        this.posX = x
        this.element.style.left = (x - (this.width / 2)) + "px"
    }
    
    setY(y) {
        if (y + (this.height / 2) > window.innerHeight) {
            y = window.innerHeight - (this.height / 2)
        } else if (y - (this.height / 2) < 0) {
            y = this.height / 2
        }
        this.posY = y
        this.element.style.top = (y - (this.height / 2)) + "px"
    }
    
    setAxis(axisX) {
        this.setX(axisX)
    }
    
    center() {
        this.setY(window.innerHeight / 2)
    }
    
    checkY(y) {
        if (y > this.posY - (this.height / 2) && y < this.posY + (this.height / 2)) {
            return ((2 * Math.PI) / 3) * ((y - this.posY) / this.height)
        } else {
            return null
        }
    }
}