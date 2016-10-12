(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("ShmuprpgApp.ts", function(exports, require, module) {
"use strict";
const ShmuprpgGame_ts_1 = require("./ShmuprpgGame.ts");
new ShmuprpgGame_ts_1.ShmuprpgGame();


});

require.register("ShmuprpgGame.ts", function(exports, require, module) {
"use strict";
const Intro_ts_1 = require("./states/Intro.ts");
const Title_ts_1 = require("./states/Title.ts");
const Level_ts_1 = require("./states/Level.ts");
const GameOver_ts_1 = require("./states/GameOver.ts");
const Controls_ts_1 = require("./utils/Controls.ts");
class ShmuprpgGame extends Phaser.Game {
    constructor() {
        super(1920, 1080, Phaser.CANVAS, 'game', {
            preload: () => this.preloadGame(),
            create: () => this.createGame()
        });
        this.state.add('Intro', Intro_ts_1.Intro);
        this.state.add('Title', Title_ts_1.Title);
        this.state.add('Level', Level_ts_1.Level);
        this.state.add('GameOver', GameOver_ts_1.GameOver);
    }
    preloadGame() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }
    createGame() {
        this.controls = new Controls_ts_1.Controls(this);
        this.state.start('Level');
    }
    addSpriteAnimation(sprite, animationName, frameCount) {
        return sprite.animations.add(animationName, this.genAnimArray(animationName, frameCount));
    }
    genAnimArray(name, n) {
        let result = new Array();
        for (let i = 0; i < n; ++i) {
            result.push(name + i);
        }
        return result;
    }
}
exports.ShmuprpgGame = ShmuprpgGame;


});

require.register("entities/Bird.ts", function(exports, require, module) {
"use strict";
class Bird extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, 'bird');
        this.animations.add('fly');
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
        this.birdExplosion = this.game.add.sprite(this.x, this.y, 'bird-explosion');
        this.birdExplosion.anchor.setTo(0.5, 0.5);
        this.birdExplosion.exists = false;
        const explodeAnimation = this.birdExplosion.animations.add('explode');
        explodeAnimation.killOnComplete = true;
    }
    fly(fromX, fromY, angle) {
        const beforeBird = this.game.add.sprite(fromX, fromY, 'before-bird');
        beforeBird.anchor.setTo(0.5, 0.5);
        const beforeBirdAnimation = beforeBird.animations.add('appears');
        beforeBirdAnimation.onComplete.add(() => {
            beforeBird.destroy();
            this.reset(fromX, fromY, 1);
            this.play('fly', 8, true);
            this.game.physics.arcade.velocityFromRotation(angle, 300, this.body.velocity);
            this.scale.set(this.body.velocity.x < 0 ? -1 : 1, 1);
        });
        beforeBirdAnimation.play(4, false);
    }
    kill() {
        super.kill();
        this.birdExplosion.reset(this.x, this.y);
        this.birdExplosion.play('explode', 8, false);
        return this;
    }
}
exports.Bird = Bird;


});

require.register("entities/BirdFlock.ts", function(exports, require, module) {
"use strict";
const Bird_ts_1 = require("./Bird.ts");
class BirdFlock extends Phaser.Group {
    constructor(target, maxBirds = 10) {
        super(target.game);
        this.flyRate = 1000;
        this.nextFlyTime = 0;
        this.target = target;
        for (let i = 0; i < maxBirds; ++i) {
            this.add(this.createBird());
        }
    }
    static preload(game) {
        game.load.spritesheet('bird', 'sprites/oga/tower-defense-prototyping-assets-4-monsters-some-tiles-a-background-image/bird.png', 48, 48, 5);
        game.load.spritesheet('before-bird', 'sprites/oga/rpg-special-move-effects/VioletSlash.png', 64, 64, 4);
        game.load.spritesheet('bird-explosion', 'sprites/oga/space_shooter_pack/explosion.png', 16, 16, 5);
    }
    update() {
        super.update();
        const x = this.game.world.randomX;
        const y = this.game.world.randomY;
        const angle = Phaser.Math.angleBetween(x, y, this.target.x, this.target.y);
        this.fly(x, y, angle);
    }
    createBird() {
        return new Bird_ts_1.Bird(this.game);
    }
    fly(fromX, fromY, angle) {
        if (this.game.time.time >= this.nextFlyTime) {
            const bird = this.getFirstExists(false);
            if (bird) {
                bird.fly(fromX, fromY, angle);
                this.nextFlyTime = this.game.time.time + this.flyRate;
            }
        }
    }
}
exports.BirdFlock = BirdFlock;


});

require.register("entities/Bullet.ts", function(exports, require, module) {
"use strict";
class Bullet extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, 'bullets');
        game.addSpriteAnimation(this, 'bullet.red', 4);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
    }
    fire(fromX, fromY, angle, speed, gravityX, gravityY) {
        this.reset(fromX, fromY, 1);
        this.scale.set(1);
        this.game.physics.arcade.velocityFromRotation(angle, speed, this.body.velocity);
        this.angle = angle;
        this.body.gravity.set(gravityX, gravityY);
        this.play('bullet.red', 4, true);
    }
}
exports.Bullet = Bullet;


});

require.register("entities/Grobelin.ts", function(exports, require, module) {
"use strict";
const b3 = require("../ia/decisions/b3.ts");
class Grobelin extends Phaser.Sprite {
    constructor(game, pathfinder) {
        super(game, 0, 0, 'grobelin');
        this.exists = false;
        this.pathfinder = pathfinder;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.grobelinDeath = this.game.add.sprite(this.x, this.y, 'grobelin');
        this.grobelinDeath.anchor.setTo(0.5, 0.5);
        this.grobelinDeath.exists = false;
    }
    getVulnerableRectangles() {
        return [new Phaser.Rectangle(this.x, this.y, this.width, this.height)];
    }
    appears(fromX, fromY, target) {
        const beforeGrobelin = this.game.add.sprite(fromX, fromY, 'before-bird');
        beforeGrobelin.anchor.setTo(0.5, 0.5);
        const beforeGrobelinAnimation = beforeGrobelin.animations.add('appears');
        beforeGrobelinAnimation.onComplete.add(() => {
            beforeGrobelin.destroy();
            this.reset(fromX, fromY, 50);
            this.body.setSize(16, 16, 24, 48);
            this.body.collideWorldBounds = true;
            this.blackboard = new GrobelinBlackboard();
            this.enemy = target;
        });
        beforeGrobelinAnimation.play(4, false);
    }
    kill() {
        super.kill();
        this.damageTween.stop(true);
        this.tint = 0xFFFFFF;
        this.grobelinDeath.reset(this.x, this.y);
        this.grobelinDeath.animations.play("lpc.hurt", 6, false).killOnComplete = true;
        return this;
    }
    update() {
        super.update();
        if (this.exists) {
            this.executeBehaviorTree();
        }
    }
    damage(amount) {
        if (!this.damageTween) {
            this.damageTween = this.game.add.tween(this).from({ tint: 0xFF0000 }).to({ tint: 0xFFFFFF }, 500, Phaser.Easing.Linear.None, true, 0, 4, false);
            this.damageTween.onComplete.add(() => this.damageTween = null);
        }
        super.damage(amount);
        return this;
    }
    executeBehaviorTree() {
        GrobelinB3.get().tick(this, this.blackboard);
    }
    attackEnemy() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        if (!this.attackAnimation) {
            [this.attackAnimation, this.attackDangerousOffset] = this.playAttackEnemyAnimation();
        }
        else if (this.attackAnimation.isFinished) {
            this.attackAnimation = null;
            const enemyRectangle = new Phaser.Rectangle(this.enemy.left, this.enemy.top, this.enemy.width, this.enemy.height);
            if (Phaser.Rectangle.containsPoint(enemyRectangle, this.getAttackPoint())) {
                this.enemy.damage(1);
            }
        }
        return true;
    }
    getAttackPoint() {
        if (this.attackDangerousOffset) {
            return new Phaser.Point(this.body.center.x + this.attackDangerousOffset.x, this.body.center.y + this.attackDangerousOffset.y);
        }
        else {
            return null;
        }
    }
    playAttackEnemyAnimation() {
        const dx = this.enemy.body.center.x - this.body.center.x;
        const dy = this.enemy.body.center.y - this.body.center.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) {
                return [this.play("lpc.thrust.left", 8, false), new Phaser.Point(-24, -16)];
            }
            else if (dx > 0) {
                return [this.play("lpc.thrust.right", 8, false), new Phaser.Point(24, -16)];
            }
            else if (dy < 0) {
                return [this.play("lpc.thrust.back", 8, false), new Phaser.Point(8, -48)];
            }
            else if (dy > 0) {
                return [this.play("lpc.thrust.front", 8, false), new Phaser.Point(-8, 8)];
            }
            else {
                return [this.play("lpc.thrust.right", 8, false), new Phaser.Point(24, -16)];
            }
        }
        else {
            if (dy < 0) {
                return [this.play("lpc.thrust.back", 8, false), new Phaser.Point(8, -48)];
            }
            else if (dy > 0) {
                return [this.play("lpc.thrust.front", 8, false), new Phaser.Point(-8, 8)];
            }
            else if (dx < 0) {
                return [this.play("lpc.thrust.left", 8, false), new Phaser.Point(-24, -16)];
            }
            else if (dx > 0) {
                return [this.play("lpc.thrust.right", 8, false), new Phaser.Point(24, -16)];
            }
            else {
                return [this.play("lpc.thrust.back", 8, false), new Phaser.Point(8, -48)];
            }
        }
    }
}
exports.Grobelin = Grobelin;
class GrobelinBlackboard extends b3.Blackboard {
}
class GrobelinB3 extends b3.Tree {
    constructor() {
        super();
        this.root = this.selector(this.sequence(new ConditionIsNearEnemy(), new ActionAttackEnemy()), new ActionFollowPath(), new ActionSearchAPathToEnemy());
    }
    static get() {
        return this.singleton || (this.singleton = new GrobelinB3());
    }
}
class ActionFollowPath extends b3.Action {
    tick(t) {
        let me = t.me;
        let currentPathPointTarget = t.blackboard.currentPathPointTarget;
        if (currentPathPointTarget) {
            this.moveToXY(me, currentPathPointTarget.x, currentPathPointTarget.y, 300);
            if (Phaser.Math.distance(me.body.center.x, me.body.center.y, currentPathPointTarget.x, currentPathPointTarget.y) < me.body.halfWidth) {
                t.blackboard.currentPathPointTarget = null;
            }
        }
        else {
            let path = t.blackboard.path || [];
            t.blackboard.currentPathPointTarget = path.shift();
            if (path.length == 0) {
                me.body.velocity.x = 0;
                me.body.velocity.y = 0;
                return b3.NodeState.FAILURE;
            }
        }
        this.animate(me);
        return b3.NodeState.RUNNING;
    }
    animate(me) {
        if (Math.abs(me.body.velocity.x) > Math.abs(me.body.velocity.y)) {
            if (me.body.velocity.x < 0) {
                me.play("lpc.walk.left", 8, false);
            }
            else if (me.body.velocity.x > 0) {
                me.play("lpc.walk.right", 8, false);
            }
            else if (me.body.velocity.y < 0) {
                me.play("lpc.walk.back", 8, false);
            }
            else if (me.body.velocity.y > 0) {
                me.play("lpc.walk.front", 8, false);
            }
            else {
                me.play("lpc.hurt", 0, false);
            }
        }
        else {
            if (me.body.velocity.y < 0) {
                me.play("lpc.walk.back", 8, false);
            }
            else if (me.body.velocity.y > 0) {
                me.play("lpc.walk.front", 8, false);
            }
            else if (me.body.velocity.x < 0) {
                me.play("lpc.walk.left", 8, false);
            }
            else if (me.body.velocity.x > 0) {
                me.play("lpc.walk.right", 8, false);
            }
            else {
                me.play("lpc.hurt", 0, false);
            }
        }
    }
    moveToXY(me, x, y, speed = 60) {
        var angle = Math.atan2(y - me.body.center.y, x - me.body.center.x);
        me.body.velocity.x = Math.cos(angle) * speed;
        me.body.velocity.y = Math.sin(angle) * speed;
    }
}
class ActionSearchAPathToEnemy extends b3.Action {
    constructor(...args) {
        super(...args);
        this.thinking = new b3.BlackboardKey();
    }
    tick(t) {
        let thinking = t.blackboard.get(this.thinking) || false;
        let me = t.me;
        if (!thinking) {
            t.blackboard.set(this.thinking, true);
            me.pathfinder.findPath(me.body.center.x, me.body.center.y, me.enemy.body.center.x, me.enemy.body.center.y, (path) => {
                t.blackboard.path = path || [];
                t.blackboard.set(this.thinking, false);
            });
        }
        let path = t.blackboard.path || [];
        return path.length > 0 ? b3.NodeState.SUCCESS : b3.NodeState.RUNNING;
    }
}
class ConditionIsNearEnemy extends b3.Condition {
    check(t) {
        let me = t.me;
        return me.enemy && Phaser.Math.distance(me.body.center.x, me.body.center.y, me.enemy.body.center.x, me.enemy.body.center.y) < me.body.width * 2;
    }
}
class ActionAttackEnemy extends b3.Action {
    tick(t) {
        if (t.me.attackEnemy()) {
            return b3.NodeState.SUCCESS;
        }
        else {
            return b3.NodeState.RUNNING;
        }
    }
}


});

;require.register("entities/GrobelinHorde.ts", function(exports, require, module) {
"use strict";
const Grobelin_ts_1 = require("./Grobelin.ts");
class GrobelinHorde extends Phaser.Group {
    constructor(target, pathFinder, maxGrobelins = 4) {
        super(target.game);
        this.appearsRate = 10000;
        this.nextAppearsTime = 0;
        this.pathfinder = pathFinder;
        this.target = target;
        for (let i = 0; i < maxGrobelins; ++i) {
            this.add(this.createGrobelin());
        }
    }
    static preload(game) {
        game.load.atlasXML('grobelin', 'sprites/lpc/characters/grobelin.png', 'sprites/lpc/characters/lpc.xml');
    }
    update() {
        super.update();
        this.appears();
    }
    createGrobelin() {
        const grobelin = new Grobelin_ts_1.Grobelin(this.game, this.pathfinder);
        const game = this.game;
        game.addSpriteAnimation(grobelin.grobelinDeath, 'lpc.hurt', 6);
        game.addSpriteAnimation(grobelin, 'lpc.hurt', 6);
        game.addSpriteAnimation(grobelin, 'lpc.walk.back', 9);
        game.addSpriteAnimation(grobelin, 'lpc.walk.front', 9);
        game.addSpriteAnimation(grobelin, 'lpc.walk.left', 9);
        game.addSpriteAnimation(grobelin, 'lpc.walk.right', 9);
        game.addSpriteAnimation(grobelin, 'lpc.thrust.back', 9);
        game.addSpriteAnimation(grobelin, 'lpc.thrust.front', 9);
        game.addSpriteAnimation(grobelin, 'lpc.thrust.left', 9);
        game.addSpriteAnimation(grobelin, 'lpc.thrust.right', 9);
        return grobelin;
    }
    appears() {
        if (this.game.time.time >= this.nextAppearsTime) {
            const grobelin = this.getFirstExists(false);
            if (grobelin) {
                const pos = this.pathfinder.randomWalkablePos();
                grobelin.appears(pos.x, pos.y, this.target);
                this.nextAppearsTime = this.game.time.time + this.appearsRate;
            }
        }
    }
}
exports.GrobelinHorde = GrobelinHorde;


});

require.register("entities/Hero.ts", function(exports, require, module) {
"use strict";
const MachineGun_ts_1 = require("./MachineGun.ts");
class Hero extends Phaser.Sprite {
    constructor(game) {
        super(game, game.world.centerX, game.world.centerY, 'tobira');
        this.invincible = false;
        this.health = 3;
        this.controls = game.controls;
        game.addSpriteAnimation(this, 'lpc.hurt', 6);
        game.addSpriteAnimation(this, 'lpc.walk.back', 9);
        game.addSpriteAnimation(this, 'lpc.walk.front', 9);
        game.addSpriteAnimation(this, 'lpc.walk.left', 9);
        game.addSpriteAnimation(this, 'lpc.walk.right', 9);
        this.play("lpc.hurt", 0, false);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setSize(16, 16, 24, 48);
        this.body.collideWorldBounds = true;
        this.weapon = new MachineGun_ts_1.MachineGun(this.game);
        this.game.add.existing(this.weapon);
    }
    static preload(game) {
        game.load.atlasXML('tobira', 'sprites/lpc/characters/tobira.png', 'sprites/lpc/characters/lpc.xml');
        game.load.atlasXML('bullets', 'sprites/lpc/shootemup/effects01.png', 'sprites/lpc/shootemup/bullets.xml');
    }
    update() {
        super.update();
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        if (this.controls.isGoingLeft()) {
            this.body.velocity.x = -300;
        }
        else if (this.controls.isGoingRight()) {
            this.body.velocity.x = 300;
        }
        if (this.controls.isGoingUp()) {
            this.body.velocity.y = -300;
        }
        else if (this.controls.isGoingDown()) {
            this.body.velocity.y = 300;
        }
        if (this.body.velocity.y < 0) {
            this.play("lpc.walk.back", 8, false);
        }
        else if (this.body.velocity.y > 0) {
            this.play("lpc.walk.front", 8, false);
        }
        else if (this.body.velocity.x < 0) {
            this.play("lpc.walk.left", 8, false);
        }
        else if (this.body.velocity.x > 0) {
            this.play("lpc.walk.right", 8, false);
        }
        else {
            this.play("lpc.hurt", 0, false);
        }
        const shootingAngle = this.controls.shootingAngle(this.x, this.y);
        if (shootingAngle != null) {
            this.weapon.fire(this.x, this.y, shootingAngle);
        }
    }
    damage(amount) {
        if (!this.invincible) {
            this.invincible = true;
            this.game.add.tween(this).from({ tint: 0xFF0000 }).to({ tint: 0xFFFFFF }, 1000, Phaser.Easing.Linear.None, true, 0, 4, false).onComplete.add(() => this.invincible = false);
            super.damage(amount);
            if (!this.alive) {
                this.game.state.start('GameOver');
            }
        }
        return this;
    }
}
exports.Hero = Hero;


});

require.register("entities/MachineGun.ts", function(exports, require, module) {
"use strict";
const Bullet_ts_1 = require("./Bullet.ts");
class MachineGun extends Phaser.Group {
    constructor(game, maxBullets = 64) {
        super(game);
        this.bulletSpeed = 600;
        this.fireRate = 200;
        this.nextFireTime = 0;
        for (let i = 0; i < maxBullets; ++i) {
            this.add(this.createBullet());
        }
    }
    createBullet() {
        return new Bullet_ts_1.Bullet(this.game);
    }
    fire(fromX, fromY, angle) {
        if (this.game.time.time >= this.nextFireTime) {
            const bullet = this.getFirstExists(false);
            if (bullet) {
                bullet.fire(fromX, fromY, angle, this.bulletSpeed, 0, 0);
                this.nextFireTime = this.game.time.time + this.fireRate;
            }
        }
    }
}
exports.MachineGun = MachineGun;


});

require.register("entities/Spider.ts", function(exports, require, module) {
"use strict";
const b3 = require("../ia/decisions/b3.ts");
const MachineGun_ts_1 = require("./MachineGun.ts");
class Spider extends Phaser.Sprite {
    constructor(game, pathfinder) {
        super(game, 0, 0, 'spider');
        this.exists = false;
        this.pathfinder = pathfinder;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.spiderDeath = this.game.add.sprite(this.x, this.y, 'spider');
        this.spiderDeath.anchor.setTo(0.5, 0.5);
        this.spiderDeath.exists = false;
        this.machineGun = new MachineGun_ts_1.MachineGun(this.game, 1);
    }
    getVulnerableRectangles() {
        return [new Phaser.Rectangle(this.x, this.y, this.width, this.height)];
    }
    appears(fromX, fromY, target) {
        const beforeSpider = this.game.add.sprite(fromX, fromY, 'before-bird');
        beforeSpider.anchor.setTo(0.5, 0.5);
        const beforeSpiderAnimation = beforeSpider.animations.add('appears');
        beforeSpiderAnimation.onComplete.add(() => {
            beforeSpider.destroy();
            this.reset(fromX, fromY, 10);
            this.body.setSize(16, 16, 24, 48);
            this.body.collideWorldBounds = true;
            this.blackboard = new SpiderBlackboard();
            this.enemy = target;
        });
        beforeSpiderAnimation.play(4, false);
    }
    kill() {
        super.kill();
        this.damageTween.stop(true);
        this.tint = 0xFFFFFF;
        this.spiderDeath.reset(this.x, this.y);
        this.spiderDeath.animations.play("spider.hurt", 6, false).killOnComplete = true;
        return this;
    }
    update() {
        super.update();
        if (this.exists) {
            this.executeBehaviorTree();
        }
    }
    damage(amount) {
        if (!this.damageTween) {
            this.damageTween = this.game.add.tween(this).from({ tint: 0xFF0000 }).to({ tint: 0xFFFFFF }, 500, Phaser.Easing.Linear.None, true, 0, 4, false);
            this.damageTween.onComplete.add(() => this.damageTween = null);
        }
        super.damage(amount);
        return this;
    }
    executeBehaviorTree() {
        SpiderB3.get().tick(this, this.blackboard);
    }
    attackEnemy() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        if (!this.attackAnimation) {
            [this.attackAnimation, this.attackDangerousOffset] = this.playAttackEnemyAnimation();
        }
        else if (this.attackAnimation.isFinished) {
            this.attackAnimation = null;
            const enemyRectangle = new Phaser.Rectangle(this.enemy.left, this.enemy.top, this.enemy.width, this.enemy.height);
            if (Phaser.Rectangle.containsPoint(enemyRectangle, this.getAttackPoint())) {
                this.enemy.damage(1);
            }
        }
        return true;
    }
    fire() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        let [_, fireOffset] = this.playFireAnimation();
        let angle = Phaser.Math.angleBetween(this.body.center.x, this.body.center.y, this.enemy.body.center.x, this.enemy.body.center.y);
        this.machineGun.fire(this.body.center.x + fireOffset.x, this.body.center.y + fireOffset.y, angle);
        return true;
    }
    playFireAnimation() {
        const dx = this.enemy.body.center.x - this.body.center.x;
        const dy = this.enemy.body.center.y - this.body.center.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) {
                return [this.play("spider.stand.left", 6, false), new Phaser.Point(-24, -16)];
            }
            else if (dx > 0) {
                return [this.play("spider.stand.right", 6, false), new Phaser.Point(24, -16)];
            }
            else if (dy < 0) {
                return [this.play("spider.stand.back", 6, false), new Phaser.Point(8, -48)];
            }
            else if (dy > 0) {
                return [this.play("spider.stand.front", 6, false), new Phaser.Point(-8, 8)];
            }
            else {
                return [this.play("spider.stand.right", 6, false), new Phaser.Point(24, -16)];
            }
        }
        else {
            if (dy < 0) {
                return [this.play("spider.stand.back", 8, false), new Phaser.Point(8, -48)];
            }
            else if (dy > 0) {
                return [this.play("spider.stand.front", 8, false), new Phaser.Point(-8, 8)];
            }
            else if (dx < 0) {
                return [this.play("spider.stand.left", 8, false), new Phaser.Point(-24, -16)];
            }
            else if (dx > 0) {
                return [this.play("spider.stand.right", 8, false), new Phaser.Point(24, -16)];
            }
            else {
                return [this.play("spider.stand.back", 8, false), new Phaser.Point(8, -48)];
            }
        }
    }
    getAttackPoint() {
        if (this.attackDangerousOffset) {
            return new Phaser.Point(this.body.center.x + this.attackDangerousOffset.x, this.body.center.y + this.attackDangerousOffset.y);
        }
        else {
            return null;
        }
    }
    playAttackEnemyAnimation() {
        const dx = this.enemy.body.center.x - this.body.center.x;
        const dy = this.enemy.body.center.y - this.body.center.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) {
                return [this.play("spider.attack.left", 8, false), new Phaser.Point(-24, -16)];
            }
            else if (dx > 0) {
                return [this.play("spider.attack.right", 8, false), new Phaser.Point(24, -16)];
            }
            else if (dy < 0) {
                return [this.play("spider.attack.back", 8, false), new Phaser.Point(8, -48)];
            }
            else if (dy > 0) {
                return [this.play("spider.attack.front", 8, false), new Phaser.Point(-8, 8)];
            }
            else {
                return [this.play("spider.attack.right", 8, false), new Phaser.Point(24, -16)];
            }
        }
        else {
            if (dy < 0) {
                return [this.play("spider.attack.back", 8, false), new Phaser.Point(8, -48)];
            }
            else if (dy > 0) {
                return [this.play("spider.attack.front", 8, false), new Phaser.Point(-8, 8)];
            }
            else if (dx < 0) {
                return [this.play("spider.attack.left", 8, false), new Phaser.Point(-24, -16)];
            }
            else if (dx > 0) {
                return [this.play("spider.attack.right", 8, false), new Phaser.Point(24, -16)];
            }
            else {
                return [this.play("spider.attack.back", 8, false), new Phaser.Point(8, -48)];
            }
        }
    }
}
exports.Spider = Spider;
class SpiderBlackboard extends b3.Blackboard {
}
class SpiderB3 extends b3.Tree {
    constructor() {
        super();
        this.root = this.selector(this.sequence(new ConditionIsNearEnemy(), new ActionAttackEnemy()), this.sequence(new ConditionIsEnemyInLineOfFire(), new ActionFire()), new ActionFollowPath(), new ActionSearchAPathToEnemy());
    }
    static get() {
        return this.singleton || (this.singleton = new SpiderB3());
    }
}
class ActionFollowPath extends b3.Action {
    tick(t) {
        let me = t.me;
        let currentPathPointTarget = t.blackboard.currentPathPointTarget;
        if (currentPathPointTarget) {
            this.moveToXY(me, currentPathPointTarget.x, currentPathPointTarget.y, 300);
            if (Phaser.Math.distance(me.body.center.x, me.body.center.y, currentPathPointTarget.x, currentPathPointTarget.y) < me.body.halfWidth) {
                t.blackboard.currentPathPointTarget = null;
            }
        }
        else {
            let path = t.blackboard.path || [];
            t.blackboard.currentPathPointTarget = path.shift();
            if (path.length == 0) {
                me.body.velocity.x = 0;
                me.body.velocity.y = 0;
                return b3.NodeState.FAILURE;
            }
        }
        this.animate(me);
        return b3.NodeState.RUNNING;
    }
    animate(me) {
        if (Math.abs(me.body.velocity.x) > Math.abs(me.body.velocity.y)) {
            if (me.body.velocity.x < 0) {
                me.play("spider.walk.left", 8, false);
            }
            else if (me.body.velocity.x > 0) {
                me.play("spider.walk.right", 8, false);
            }
            else if (me.body.velocity.y < 0) {
                me.play("spider.walk.back", 8, false);
            }
            else if (me.body.velocity.y > 0) {
                me.play("spider.walk.front", 8, false);
            }
            else {
                me.play("spider.hurt", 0, false);
            }
        }
        else {
            if (me.body.velocity.y < 0) {
                me.play("spider.walk.back", 8, false);
            }
            else if (me.body.velocity.y > 0) {
                me.play("spider.walk.front", 8, false);
            }
            else if (me.body.velocity.x < 0) {
                me.play("spider.walk.left", 8, false);
            }
            else if (me.body.velocity.x > 0) {
                me.play("spider.walk.right", 8, false);
            }
            else {
                me.play("lpc.hurt", 0, false);
            }
        }
    }
    moveToXY(me, x, y, speed = 60) {
        var angle = Math.atan2(y - me.body.center.y, x - me.body.center.x);
        me.body.velocity.x = Math.cos(angle) * speed;
        me.body.velocity.y = Math.sin(angle) * speed;
    }
}
class ActionSearchAPathToEnemy extends b3.Action {
    constructor(...args) {
        super(...args);
        this.thinking = new b3.BlackboardKey();
    }
    tick(t) {
        let thinking = t.blackboard.get(this.thinking) || false;
        let me = t.me;
        if (!thinking) {
            t.blackboard.set(this.thinking, true);
            me.pathfinder.findPath(me.body.center.x, me.body.center.y, me.enemy.body.center.x, me.enemy.body.center.y, (path) => {
                t.blackboard.path = path || [];
                t.blackboard.set(this.thinking, false);
            });
        }
        let path = t.blackboard.path || [];
        return path.length > 0 ? b3.NodeState.SUCCESS : b3.NodeState.RUNNING;
    }
}
class ConditionIsEnemyInLineOfFire extends b3.Condition {
    check(t) {
        let me = t.me;
        if (me.enemy) {
            const epsilon = 10 * Phaser.Math.PI2 / 360;
            let angle = Phaser.Math.angleBetween(me.body.center.x, me.body.center.y, me.enemy.body.center.x, me.enemy.body.center.y);
            angle = Phaser.Math.normalizeAngle(angle);
            if (Phaser.Math.fuzzyEqual(angle, Phaser.Math.PI2, epsilon)) {
                return true;
            }
            if (Phaser.Math.fuzzyEqual(angle, Math.PI / 2, epsilon)) {
                return true;
            }
            if (Phaser.Math.fuzzyEqual(angle, Math.PI, epsilon)) {
                return true;
            }
            if (Phaser.Math.fuzzyEqual(angle, 3 * Math.PI / 2, epsilon)) {
                return true;
            }
        }
        return false;
    }
}
class ActionFire extends b3.Action {
    tick(t) {
        t.me.fire();
        return b3.NodeState.RUNNING;
    }
}
class ConditionIsNearEnemy extends b3.Condition {
    check(t) {
        let me = t.me;
        return me.enemy && Phaser.Math.distance(me.body.center.x, me.body.center.y, me.enemy.body.center.x, me.enemy.body.center.y) < me.body.width * 2;
    }
}
class ActionAttackEnemy extends b3.Action {
    tick(t) {
        if (t.me.attackEnemy()) {
            return b3.NodeState.SUCCESS;
        }
        else {
            return b3.NodeState.RUNNING;
        }
    }
}


});

;require.register("entities/SpiderHorde.ts", function(exports, require, module) {
"use strict";
const Spider_ts_1 = require("./Spider.ts");
class SpiderHorde extends Phaser.Group {
    constructor(target, pathFinder, maxSpiders = 4) {
        super(target.game);
        this.appearsRate = 10000;
        this.nextAppearsTime = 0;
        this.pathfinder = pathFinder;
        this.target = target;
        for (let i = 0; i < maxSpiders; ++i) {
            this.add(this.createSpider());
        }
    }
    static preload(game) {
        game.load.atlasXML('spider', 'sprites/lpc/spiders/spider01.png', 'sprites/lpc/spiders/spider.xml');
    }
    update() {
        super.update();
        this.appears();
    }
    createSpider() {
        const spider = new Spider_ts_1.Spider(this.game, this.pathfinder);
        const game = this.game;
        game.addSpriteAnimation(spider.spiderDeath, 'spider.hurt', 6);
        game.addSpriteAnimation(spider, 'spider.stand.back', 6);
        game.addSpriteAnimation(spider, 'spider.stand.front', 6);
        game.addSpriteAnimation(spider, 'spider.stand.left', 6);
        game.addSpriteAnimation(spider, 'spider.stand.right', 6);
        game.addSpriteAnimation(spider, 'spider.walk.back', 9);
        game.addSpriteAnimation(spider, 'spider.walk.front', 9);
        game.addSpriteAnimation(spider, 'spider.walk.left', 9);
        game.addSpriteAnimation(spider, 'spider.walk.right', 9);
        game.addSpriteAnimation(spider, 'spider.attack.back', 9);
        game.addSpriteAnimation(spider, 'spider.attack.front', 9);
        game.addSpriteAnimation(spider, 'spider.attack.left', 9);
        game.addSpriteAnimation(spider, 'spider.attack.right', 9);
        return spider;
    }
    appears() {
        if (this.game.time.time >= this.nextAppearsTime) {
            const spider = this.getFirstExists(false);
            if (spider) {
                const pos = this.pathfinder.randomWalkablePos();
                spider.appears(pos.x, pos.y, this.target);
                this.nextAppearsTime = this.game.time.time + this.appearsRate;
            }
        }
    }
}
exports.SpiderHorde = SpiderHorde;


});

require.register("entities/features/Vulnerable.ts", function(exports, require, module) {
"use strict";


});

require.register("ia/decisions/b3.ts", function(exports, require, module) {
"use strict";
class Tree {
    tick(me, blackboard) {
        const t = new Tick(me, blackboard);
        this.root.tick(t);
    }
    sequence(...children) {
        return new Sequence(...children);
    }
    selector(...children) {
        return new Selector(...children);
    }
    parallel(...children) {
        return new Parallel(...children);
    }
}
exports.Tree = Tree;
class BlackboardKey {
    constructor() {
        this.id = Symbol();
    }
}
exports.BlackboardKey = BlackboardKey;
class Blackboard {
    constructor() {
        this.data = {};
    }
    get(k) {
        return this.data[k.id];
    }
    set(k, value) {
        this.data[k.id] = value;
    }
    reset() {
        this.data = {};
    }
}
exports.Blackboard = Blackboard;
class Tick {
    constructor(me, b) {
        this.blackboard = b;
        this.me = me;
    }
}
exports.Tick = Tick;
(function (NodeState) {
    NodeState[NodeState["SUCCESS"] = 0] = "SUCCESS";
    NodeState[NodeState["FAILURE"] = 1] = "FAILURE";
    NodeState[NodeState["RUNNING"] = 2] = "RUNNING";
})(exports.NodeState || (exports.NodeState = {}));
var NodeState = exports.NodeState;
class Node {
}
exports.Node = Node;
class Branch extends Node {
    constructor(...children) {
        super();
        this.children = children;
    }
}
exports.Branch = Branch;
class Leaf extends Node {
}
exports.Leaf = Leaf;
class Selector extends Branch {
    constructor(...children) {
        super(...children);
    }
    tick(t) {
        for (let c of this.children) {
            switch (c.tick(t)) {
                case NodeState.SUCCESS:
                    return NodeState.SUCCESS;
                case NodeState.RUNNING:
                    return NodeState.RUNNING;
            }
        }
        return NodeState.FAILURE;
    }
}
exports.Selector = Selector;
class Sequence extends Branch {
    constructor(...children) {
        super(...children);
    }
    tick(t) {
        for (let c of this.children) {
            switch (c.tick(t)) {
                case NodeState.FAILURE:
                    return NodeState.FAILURE;
                case NodeState.RUNNING:
                    return NodeState.RUNNING;
            }
        }
        return NodeState.SUCCESS;
    }
}
exports.Sequence = Sequence;
class Parallel extends Branch {
    constructor(...children) {
        super(...children);
    }
    tick(t) {
        let failures = 0, successes = 0;
        for (let c of this.children) {
            switch (c.tick(t)) {
                case NodeState.FAILURE:
                    return ++failures;
                case NodeState.SUCCESS:
                    return ++successes;
            }
        }
        if (successes >= this.successThreshold) {
            return NodeState.SUCCESS;
        }
        else if (failures >= this.failureThreshold) {
            return NodeState.FAILURE;
        }
        else {
            return NodeState.RUNNING;
        }
    }
}
exports.Parallel = Parallel;
class Decorator extends Node {
    constructor(child) {
        super();
        this.child = child;
    }
}
exports.Decorator = Decorator;
class Action extends Leaf {
}
exports.Action = Action;
class Condition extends Leaf {
    tick(t) {
        if (this.check(t)) {
            return NodeState.SUCCESS;
        }
        else {
            return NodeState.FAILURE;
        }
    }
}
exports.Condition = Condition;


});

require.register("ia/services/Pathfinder.ts", function(exports, require, module) {
"use strict";
const EasyStar = require('easystarjs');
class Pathfinder {
    constructor(map) {
        this.map = map;
        const pathfindLayer = map.getLayerIndex('pathfind');
        const grid = new Array();
        for (let row = 0; row < map.height; ++row) {
            var gridRow = new Array(map.width);
            for (let column = 0; column < map.width; ++column) {
                const tile = map.getTile(column, row, pathfindLayer);
                gridRow[column] = this.isTileWalkable(tile) ? 1 : 0;
            }
            grid[row] = gridRow;
        }
        this.easystar = new EasyStar.js();
        this.easystar.setGrid(grid);
        this.easystar.enableDiagonals();
        this.easystar.setAcceptableTiles([1]);
    }
    randomWalkablePos() {
        const pathfindLayer = this.map.getLayerIndex('pathfind');
        const rnd = this.map.game.rnd;
        const maxChances = this.map.width * this.map.height;
        for (let i = 0; i < maxChances; ++i) {
            const x = rnd.integerInRange(0, this.map.width - 1);
            const y = rnd.integerInRange(0, this.map.height - 1);
            const tile = this.map.getTile(x, y, pathfindLayer);
            if (this.isTileWalkable(tile)) {
                return new Phaser.Point(tile.worldX, tile.worldY);
            }
        }
        return null;
    }
    isTileWalkable(tile) {
        return tile && tile.properties['walkable'] == 1;
    }
    findPath(startX, startY, endX, endY, callback) {
        const tileStart = this.map.getTileWorldXY(startX, startY);
        const tileEnd = this.findNearestWalkableTile(endX, endY);
        if (tileEnd) {
            this.easystar.findPath(tileStart.x, tileStart.y, tileEnd.x, tileEnd.y, (path) => {
                let worldPath;
                if (path && path.length > 1) {
                    worldPath = new Array(path.length - 1);
                    for (let i = 1; i < path.length; ++i) {
                        const tile = this.map.getTile(path[i].x, path[i].y);
                        worldPath[i - 1] = new Phaser.Point(tile.worldX + tile.width / 2, tile.worldY + tile.height / 2);
                    }
                }
                else {
                    worldPath = new Array();
                }
                callback(worldPath);
            });
        }
        else {
            callback(new Array());
        }
    }
    findNearestWalkableTile(endX, endY) {
        const pathfindLayer = this.map.getLayerIndex('pathfind');
        const tile = this.map.getTileWorldXY(endX, endY, this.map.tileWidth, this.map.tileHeight, pathfindLayer);
        if (this.isTileWalkable(tile)) {
            return tile;
        }
        let minTile = null;
        let minTileDistance = null;
        for (let dx = -10; dx < 10; ++dx) {
            for (let dy = -10; dy < 10; ++dy) {
                const t = this.map.getTile(tile.x + dx, tile.y + dy, pathfindLayer);
                if (this.isTileWalkable(t)) {
                    const tileDistance = Phaser.Math.distanceSq(0, 0, dx, dy);
                    if (!minTileDistance || tileDistance < minTileDistance) {
                        minTileDistance = tileDistance;
                        minTile = t;
                    }
                }
            }
        }
        return minTile;
    }
    update() {
        this.easystar.calculate();
    }
}
exports.Pathfinder = Pathfinder;


});

require.register("states/AbstractState.ts", function(exports, require, module) {
"use strict";
class AbstractState extends Phaser.State {
    constructor() {
        super();
    }
    create() {
        this.game.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(() => this.toggleFullscreen());
    }
    toggleFullscreen() {
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        }
        else {
            this.game.scale.startFullScreen();
        }
    }
}
exports.AbstractState = AbstractState;


});

require.register("states/GameOver.ts", function(exports, require, module) {
"use strict";
const AbstractState_ts_1 = require("./AbstractState.ts");
class GameOver extends AbstractState_ts_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.image('gameover', 'gameover/gameover.png');
    }
    create() {
        super.create();
        this.game.add.image(0, 0, 'gameover');
    }
}
exports.GameOver = GameOver;


});

require.register("states/Intro.ts", function(exports, require, module) {
"use strict";
const AbstractState_ts_1 = require("./AbstractState.ts");
class Intro extends AbstractState_ts_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.video('intro', 'intro/intro.webm');
    }
    create() {
        super.create();
        var video = this.game.add.video('intro');
        video.play();
        video.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5);
        video.onComplete.add(() => this.game.state.start('Title'));
    }
}
exports.Intro = Intro;


});

require.register("states/Level.ts", function(exports, require, module) {
"use strict";
const AbstractState_ts_1 = require("./AbstractState.ts");
const Hero_ts_1 = require("../entities/Hero.ts");
const BirdFlock_ts_1 = require("../entities/BirdFlock.ts");
const GrobelinHorde_ts_1 = require("../entities/GrobelinHorde.ts");
const SpiderHorde_ts_1 = require("../entities/SpiderHorde.ts");
const Pathfinder_ts_1 = require("../ia/services/Pathfinder.ts");
const DamageResolver_ts_1 = require("../utils/DamageResolver.ts");
class Level extends AbstractState_ts_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        BirdFlock_ts_1.BirdFlock.preload(this.game);
        GrobelinHorde_ts_1.GrobelinHorde.preload(this.game);
        SpiderHorde_ts_1.SpiderHorde.preload(this.game);
        Hero_ts_1.Hero.preload(this.game);
        this.game.load.tilemap('map', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('terrains', 'sprites/lpc/terrains/terrains.png');
        this.game.load.image('cottage', 'sprites/lpc/thatched-roof-cottage/cottage.png');
        this.game.load.image('thatched-roof', 'sprites/lpc/thatched-roof-cottage/thatched-roof.png');
        this.game.load.image('doors', 'sprites/lpc/windows-doors/doors.png');
        this.game.load.image('windows', 'sprites/lpc/windows-doors/windows.png');
        this.game.load.image('obj_misk_atlas', 'sprites/lpc/tile-atlas2/obj_misk_atlas.png');
    }
    create() {
        super.create();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        const map = this.game.add.tilemap('map');
        map.addTilesetImage('terrains');
        map.addTilesetImage('cottage');
        map.addTilesetImage('thatched-roof');
        map.addTilesetImage('doors');
        map.addTilesetImage('windows');
        map.addTilesetImage('obj_misk_atlas');
        const layer = map.createLayer('grounds');
        map.createLayer('plants');
        map.createLayer('walls');
        map.createLayer('bridges');
        map.createLayer('doors_and_windows');
        map.createLayer('roofs');
        layer.resizeWorld();
        this.damageResolver = new DamageResolver_ts_1.DamageResolver(this.game);
        this.collisionSprites = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        ;
        for (let o of map.objects['collision']) {
            if (o.rectangle) {
                const sprite = this.game.add.sprite(o.x, o.y);
                this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                sprite.body.immovable = true;
                sprite.width = o.width;
                sprite.height = o.height;
                this.collisionSprites.add(sprite);
            }
        }
        this.pathfinder = new Pathfinder_ts_1.Pathfinder(map);
        this.hero = new Hero_ts_1.Hero(this.game);
        this.game.add.existing(this.hero);
        this.birdFlock = new BirdFlock_ts_1.BirdFlock(this.hero);
        this.game.add.existing(this.birdFlock);
        this.grobelinHorde = new GrobelinHorde_ts_1.GrobelinHorde(this.hero, this.pathfinder);
        this.game.add.existing(this.grobelinHorde);
        this.spiderHorde = new SpiderHorde_ts_1.SpiderHorde(this.hero, this.pathfinder);
        this.game.add.existing(this.spiderHorde);
    }
    update() {
        this.pathfinder.update();
        this.hero.update();
        this.game.physics.arcade.collide(this.hero, this.collisionSprites);
        this.resolveWeaponsEffects();
    }
    resolveWeaponsEffects() {
        this.damageResolver.resolve(this.birdFlock, this.hero.weapon);
        this.damageResolver.resolve(this.hero, this.birdFlock);
        this.damageResolver.resolve(this.hero.weapon, this.grobelinHorde);
        this.damageResolver.resolve(this.hero.weapon, this.spiderHorde);
        for (let spider of this.spiderHorde.children) {
            this.damageResolver.resolve(this.hero, spider.machineGun);
        }
    }
    render() {
    }
}
exports.Level = Level;


});

require.register("states/Title.ts", function(exports, require, module) {
"use strict";
const AbstractState_ts_1 = require("./AbstractState.ts");
class Title extends AbstractState_ts_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.image('logo', 'title/logo.png');
    }
    create() {
        super.create();
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }
}
exports.Title = Title;


});

require.register("utils/Controls.ts", function(exports, require, module) {
"use strict";
class Controls {
    constructor(game) {
        this.game = game;
        game.input.gamepad.start();
        this.kb = game.input.keyboard;
        this.pad = game.input.gamepad.pad1;
    }
    shootingAngle(shooterX, shooterY) {
        return this.firstNonNull(this.shootingAngleFromPointer(shooterX, shooterY), this.shootingAngleFromPad(), this.shootingFromKeyboard());
    }
    firstNonNull(...values) {
        for (let value of values) {
            if (value != null) {
                return value;
            }
        }
        return null;
    }
    shootingAngleFromPointer(shooterX, shooterY) {
        const pointer = this.game.input.activePointer;
        if (pointer.isDown) {
            return Phaser.Math.angleBetween(shooterX, shooterY, pointer.worldX, pointer.worldY);
        }
        else {
            return this.shootingFromKeyboard();
        }
    }
    shootingAngleFromPad() {
        let dx = this.pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
        let dy = this.pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);
        dx = Math.abs(dx) <= this.pad.deadZone ? 0 : dx;
        dy = Math.abs(dy) <= this.pad.deadZone ? 0 : dy;
        if (dx != 0 || dy != 0) {
            return Phaser.Math.angleBetween(0, 0, dx, dy);
        }
        else {
            return null;
        }
    }
    shootingFromKeyboard() {
        let dx = 0;
        if (this.kb.isDown(Phaser.KeyCode.J)) {
            dx = -1;
        }
        else if (this.kb.isDown(Phaser.KeyCode.L)) {
            dx = 1;
        }
        let dy = 0;
        if (this.kb.isDown(Phaser.KeyCode.I)) {
            dy = -1;
        }
        else if (this.kb.isDown(Phaser.KeyCode.K)) {
            dy = 1;
        }
        if (dx != 0 || dy != 0) {
            return Phaser.Math.angleBetween(0, 0, dx, dy);
        }
        else {
            return null;
        }
    }
    isGoingUp() {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
            || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -this.pad.deadZone
            || this.kb.isDown(Phaser.KeyCode.UP)
            || this.kb.isDown(Phaser.KeyCode.Z);
    }
    isGoingDown() {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
            || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > this.pad.deadZone
            || this.kb.isDown(Phaser.KeyCode.DOWN)
            || this.kb.isDown(Phaser.KeyCode.S);
    }
    isGoingLeft() {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
            || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -this.pad.deadZone
            || this.kb.isDown(Phaser.KeyCode.LEFT)
            || this.kb.isDown(Phaser.KeyCode.Q);
    }
    isGoingRight() {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)
            || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > this.pad.deadZone
            || this.kb.isDown(Phaser.KeyCode.RIGHT)
            || this.kb.isDown(Phaser.KeyCode.D);
    }
}
exports.Controls = Controls;


});

require.register("utils/DamageResolver.ts", function(exports, require, module) {
"use strict";
class DamageResolver {
    constructor(game) {
        this.game = game;
    }
    resolve(spriteOrGroupA, spriteOrGroupB) {
        this.game.physics.arcade.overlap(spriteOrGroupA, spriteOrGroupB, (a, b) => {
            const vulnerableA = a;
            if (DamageResolver.checkIfSpritesIntersect(a, b)) {
                a.damage(1);
                b.damage(1);
            }
        });
    }
    static checkIfSpritesIntersect(a, b) {
        let vulnerableRectangleOfA = DamageResolver.getVulnerableRectanglesOf(a);
        let vulnerableRectangleOfB = DamageResolver.getVulnerableRectanglesOf(b);
        if (vulnerableRectangleOfA || vulnerableRectangleOfB) {
            vulnerableRectangleOfA = vulnerableRectangleOfA || [new Phaser.Rectangle(a.x, a.y, a.width, a.height)];
            vulnerableRectangleOfB = vulnerableRectangleOfB || [new Phaser.Rectangle(b.x, b.y, b.width, b.height)];
            return this.checkIfRectanglesIntersect(vulnerableRectangleOfA, vulnerableRectangleOfB);
        }
        else {
            return true;
        }
    }
    static checkIfRectanglesIntersect(rectanglesA, rectanglesB) {
        for (let a of rectanglesA) {
            for (let b of rectanglesB) {
                if (a.intersects(b, 1)) {
                    return true;
                }
            }
        }
        return false;
    }
    static getVulnerableRectanglesOf(s) {
        let result;
        if (DamageResolver.isVulnerable(s)) {
            result = s.getVulnerableRectangles();
        }
        return result;
    }
    static isVulnerable(s) {
        return s.getVulnerableRectangles != undefined;
    }
}
exports.DamageResolver = DamageResolver;


});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('ShmuprpgApp');