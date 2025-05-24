export default class Ball {
    element
    posX
    posY
    radius
    velocity
    direction
    
    constructor() {
        this.element = document.createElement('div')
        this.element.className = "ball"
        document.querySelector("body").appendChild(this.element)
        this.setRadius(15)
        this.setPosCenter()
    }
    
    setRadius(radius) {
        this.radius = radius
        this.element.style.width = 2 * radius + "px"
        this.element.style.height = 2 * radius + "px"
    }
    
    setPos(x, y) {
        this.setX(x)
        this.setY(y)
    }
    
    setPosCenter() {
        this.setX(window.innerWidth / 2)
        this.setY(window.innerHeight / 2)
    }
    
    setX(x) {
        this.posX = x
        this.element.style.left = (x - this.radius) + "px"
    }
    
    setY(y) {
        this.posY = y
        this.element.style.top = (y - this.radius) + "px"
    }
}