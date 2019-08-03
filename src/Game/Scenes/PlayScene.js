/* eslint-disable quote-props */

import ImageLoader from '../../Engine/Loaders/ImageLoader.js';
import Scene from '../../Engine/Scenes/Scene.js';
import SpriteMap from '../../Engine/Graphic/Sprites/SpriteMap.js';
import Vector from '../../Engine/Math/Vector.js';
import Size from '../../Engine/Math/Size.js';
import TileMap from '../../Engine/Tiles/TileMap.js';
import TileMapLoader from '../Loaders/TileMapLoader.js';
import Camera from '../../Engine/Camera/Camera.js';
import Animation from '../../Engine/Graphic/Animations/Animation.js';
import Controller from '../../Engine/Input/Controller.js';
import Mario from '../Entities/Mario.js';
import TileCollider from '../../Engine/Tiles/TileCollider.js';
import MouseController from '../../Engine/Input/MouseController.js';

export default class PlayScene extends Scene {
  constructor() {
    super();
    this.camera = new Camera(Vector.zero(), new Size(500, 400));
    this.tileMap = null;
    this.controller = null;
    this.tileCollider = null;
    this.entities = [];
    this.gravity = new Vector(0, 100);
  }

  load() {
    return Promise.all([
      this.loadTiles(),
      this.loadEntities(),
    ]);
  }

  loadTiles() {
    return ImageLoader.load('/resources/sprites/world-sprite.png')
      .then((image) => {
        const sprite = new SpriteMap(image);

        sprite.define('sky', new Vector(48, 361), new Size(16, 16));
        sprite.define('ground', new Vector(0, 0), new Size(16, 16));
        sprite.define('bricks', new Vector(16, 0), new Size(16, 16));

        // TODO: Remove after animation resolved
        sprite.define('chance', new Vector(384, 0), new Size(16, 16));

        sprite.define('chance-1', new Vector(384, 0), new Size(16, 16));
        sprite.define('chance-2', new Vector(400, 0), new Size(16, 16));
        sprite.define('chance-3', new Vector(416, 0), new Size(16, 16));

        return sprite;
      })
      .then((sprite) => {
        const tileSize = new Size(game.config.tiles.size.width, game.config.tiles.size.height);
        this.tileMap = new TileMap(game.config, tileSize);

        // const animationManager = new AnimationManager();

        // animationManager.add('chance', new Animation([
        //   sprite.get('chance-1'),
        //   sprite.get('chance-2'),
        //   sprite.get('chance-2'),
        //   sprite.get('chance-3'),
        //   sprite.get('chance-2'),
        // ], 8));

        const mapping = {
          '.': { image: 'sky' },
          '#': { image: 'ground', options: { ground: true } },
          '%': { image: 'bricks', options: { ground: true } },
          'O': { image: 'chance', options: { ground: true } },
        };

        return TileMapLoader.fromTxt('/resources/levels/1-1.lvl', this.tileMap, mapping, sprite);
      })
      .then(() => {
        this.tileCollider = new TileCollider(this.tileMap);
      });
  }

  loadEntities() {
    return ImageLoader.load('/resources/sprites/characters-sprite.gif')
      .then((image) => {
        const spriteMap = new SpriteMap(image);

        // Idle
        spriteMap.define('mario-idle-right', new Vector(275, 44), new Size(16, 16));
        spriteMap.define('mario-idle-left', new Vector(222, 44), new Size(16, 16));

        // Run
        spriteMap.define('mario-move-right-1', new Vector(290, 44), new Size(16, 16));
        spriteMap.define('mario-move-right-2', new Vector(304, 44), new Size(16, 16));
        spriteMap.define('mario-move-right-3', new Vector(320, 44), new Size(16, 16));

        spriteMap.define('mario-move-left-1', new Vector(207, 44), new Size(16, 16));
        spriteMap.define('mario-move-left-2', new Vector(193, 44), new Size(16, 16));
        spriteMap.define('mario-move-left-3', new Vector(177, 44), new Size(16, 16));

        const keyBinds = {
          ArrowLeft: 'left',
          ArrowUp: 'up',
          ArrowRight: 'right',
          ArrowDown: 'down',
        };

        this.controller = new Controller(keyBinds);

        const animationMap = new Map();

        animationMap.set('moveRight', new Animation([
          spriteMap.get('mario-move-right-1'),
          spriteMap.get('mario-move-right-2'),
          spriteMap.get('mario-move-right-3'),
        ]));

        animationMap.set('moveLeft', new Animation([
          spriteMap.get('mario-move-left-1'),
          spriteMap.get('mario-move-left-2'),
          spriteMap.get('mario-move-left-3'),
        ]));

        animationMap.set('idleLeft', new Animation([
          spriteMap.get('mario-idle-left'),
        ]));

        animationMap.set('idleRight', new Animation([
          spriteMap.get('mario-idle-right'),
        ]));

        return new Mario(this.controller, animationMap);
      })
      .then((mario) => {
        const mouseController = new MouseController(game.view.context);

        // Camera simple mouse scroll
        mouseController.onRightButtonDrag((currentPosition, previousPosition) => {
          this.camera.position.set(
            this.camera.position.minusX(currentPosition.minus(previousPosition)),
          );
        });

        // player mouse control debugger
        mouseController.onLeftClick((position) => {
          mario.velocity.set(Vector.zero());
          mario.position.set(this.camera.position.plus(position));
        });

        this.entities.push(mario);
      });
  }

  update(deltaTime) {
    this.entities.forEach((entity) => {
      entity.update(deltaTime);

      entity.velocity.set(
        entity.velocity.plus(this.gravity.scale(deltaTime)),
      );

      entity.position.set(
        entity.position.plusX(entity.velocity.x * deltaTime),
      );
      this.tileCollider.checkX(entity);

      entity.position.set(
        entity.position.plusY(entity.velocity.y * deltaTime),
      );
      this.tileCollider.checkY(entity);
    });
  }

  render(view) {
    view.clear();

    this.tileMap.render(view, this.camera);

    this.tileCollider.render(view, this.camera);
    this.tileCollider.reset();

    this.entities.forEach(entity => entity.render(view, this.camera));

    this.camera.render(view);

    this.controller.render(view);
  }
}