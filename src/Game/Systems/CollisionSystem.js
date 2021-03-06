export default class CollisionSystem {
  /**
   * CollisionSystem constructor
   *
   * @param {Array|Map} entities
   * @param {TileCollider} tileCollider
   */
  constructor(entities, tileCollider) {
    this.entities = entities;
    this.tileCollider = tileCollider;
  }

  /**
   * Update the system
   *
   * @param {Number} deltaTime
   */
  update(deltaTime) {
    this.entities.forEach((entity) => {
      this.horizontal(entity, deltaTime);
      this.vertical(entity, deltaTime);
    });
  }

  /**
   * Handle horizontal collisions
   *
   * @param {Entity} entity
   * @param {Number} deltaTime
   */
  horizontal(entity, deltaTime) {
    entity.position.set(entity.position.plusX(entity.velocity.scale(deltaTime)));
    this.tileCollider.checkX(entity);
  }

  /**
   * Handle vertical collisions
   *
   * @param {Entity} entity
   * @param {Number} deltaTime
   */
  vertical(entity, deltaTime) {
    entity.position.set(entity.position.plusY(entity.velocity.scale(deltaTime)));
    this.tileCollider.checkY(entity);
  }
}
