import Component from '../../Engine/Behaviour/Component.js';
import Vector from '../../Engine/Math/Vector.js';

export default class Jump extends Component {
  constructor(entity) {
    super('turbo', entity);
  }

  /**
   * Update jump component
   */
  update() {
    if (this.entity.controller.isPressed('actionA')) {
      this.entity.maxSpeed = game.config.player.turboMaxSpeed;
      this.entity.accelaration = new Vector(game.config.player.turboMaxSpeed, 0);
    } else {
      this.entity.maxSpeed = game.config.player.maxSpeed;
      this.entity.accelaration = new Vector(game.config.player.acceleration, 0);
    }
  }
}