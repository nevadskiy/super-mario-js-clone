/* eslint-disable no-param-reassign,import/extensions */
import Vector from './Utils/Vector.js';
import Size from './Utils/Size.js';
import Bounds from './Utils/Bounds.js';

const FLOOR = 204;

export default class Player {
  constructor(controller, image) {
    this.controller = controller;
    this.gravity = new Vector(0, 3000);
    this.image = image;
    this.color = '#718096';
    this.size = new Size(14, 16);
    this.position = new Vector(100, 200);
    this.velocity = Vector.zero();
    this.maxSpeed = 100;
    this.jumping = false;
  }

  getBounds() {
    return new Bounds(this.position, this.size);
  }

  update(delta) {
    // TODO: correct feature orders: [go -> jump -> velocity]

    if (this.controller.isPressed('left')) {
      this.moveLeft(delta);
    }

    if (this.controller.isPressed('right')) {
      this.moveRight(delta);
    }

    if (this.controller.isPressed('up')) {
      this.jump(delta);
    }

    // this.velocity = this.velocity.plus(this.gravity.times(delta));
    // this.position = this.position.plus(this.velocity.times(delta));

    // // TODO: round parameter on low values
    // // TODO: add Vector function to plus only x or y (e.g. plusX(15), plusY(20))
    // this.velocity = this.velocity.plus(new Vector(null, this.gravity));

    // this.velocity = this.velocity.multiply(new Vector(0.9, null)); // TODO: probably add friction also to Y

    // TODO: create World class and add to it collide(player) method which Game class will handle inside update loop
    // TODO: also add isCollidable prop to check if it is not Fps, Background or any other not
    //  colidable entity (in the future will be fixed with grid and availability of location vector)

    // if (this.position.y >= FLOOR) {
    //   this.velocity = this.velocity.multiply(new Vector(null, 0));
    //   this.position = new Vector(this.position.x, FLOOR);
    //   this.jumping = false;
    // }

    // //
    // // if (this.position.x <= 0) {
    // //   this.velocity = this.velocity.multiply(new Vector(0, null));
    // //   this.position = new Vector(0, this.position.y);
    // // }
    // //

    // if (this.position.x >= 500) {
    //   this.velocity = this.velocity.multiply(new Vector(0, null));
    //   this.position = new Vector(500, this.position.y);
    // }
  }

  moveLeft(delta) {
    // TODO: check max speed with another vectors
    // this.velocity = this.velocity.plus(new Vector(-0.05, null));
    this.velocity = new Vector(-this.maxSpeed * delta, this.velocity.y);
  }

  moveRight(delta) {
    // TODO: check max speed with another vectors
    // TODO: probably dont return a new vector instance and just change the current (and to save possibility just add clone() method to Vector)
    // this.velocity = this.velocity.plus(new Vector(0.05, null));
    this.velocity = new Vector(this.maxSpeed * delta, this.velocity.y);
  }

  jump() {
    if (this.jumping) {
      return;
    }

    console.log('jumping');

    this.jumping = true;
    this.velocity = this.velocity.plus(new Vector(null, -400));
  }

  render(view, camera) {
    this.renderEntity(view, camera);
    this.renderController(view);
    this.renderDebug(view);
    this.renderHitBox(view, camera);
  }

  renderEntity(view, camera) {
    view.image(this.image, this.position.minus(camera.position), this.size);
  }

  renderDebug(view) {
    view.text(`Velocity X: ${this.velocity.x}`, new Vector(200, 20));
    view.text(`Velocity Y: ${this.velocity.y}`, new Vector(200, 40));
    view.text(`Position X: ${this.position.x}`, new Vector(200, 60));
    view.text(`Position Y: ${this.position.y}`, new Vector(200, 80));
  }

  renderHitBox(view, camera) {
    view.outline(this.position.minus(camera.position), this.size, 'red');
  }

  renderController(view) {
    view.text(`UP: ${this.controller.isPressed('up') ? 'PRESSED' : 'NO'}`, new Vector(10, 20));
    view.text(`LEFT: ${this.controller.isPressed('left') ? 'PRESSED' : 'NO'}`, new Vector(10, 40));
    view.text(`RIGHT: ${this.controller.isPressed('right') ? 'PRESSED' : 'NO'}`, new Vector(10, 60));
    view.text(`DOWN: ${this.controller.isPressed('down') ? 'PRESSED' : 'NO'}`, new Vector(10, 80));
  }
}
