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
const ShmuprpgGame_1 = require("./ShmuprpgGame");
new ShmuprpgGame_1.ShmuprpgGame();
//# sourceMappingURL=ShmuprpgApp.js.map
});

require.register("ShmuprpgGame.ts", function(exports, require, module) {
"use strict";
const Intro_1 = require("./states/Intro");
const Title_1 = require("./states/Title");
const DemoEnding_1 = require("./states/DemoEnding");
const Help_1 = require("./states/Help");
const Options_1 = require("./states/Options");
const KeyboardOptions_1 = require("./states/KeyboardOptions");
const KeyboardOptionsBindKey_1 = require("./states/KeyboardOptionsBindKey");
const GamepadOptions_1 = require("./states/GamepadOptions");
const GamepadOptionsLayout_1 = require("./states/GamepadOptionsLayout");
const GamepadOptionsBindAxis_1 = require("./states/GamepadOptionsBindAxis");
const Level_1 = require("./states/Level");
const GameOver_1 = require("./states/GameOver");
const Controls_1 = require("./utils/Controls");
class ShmuprpgGame extends Phaser.Game {
    constructor() {
        super(1920, 1080, Phaser.CANVAS, 'game', {
            preload: () => this.preloadGame(),
            create: () => this.createGame()
        });
        this.state.add('Intro', Intro_1.Intro);
        this.state.add('Title', Title_1.Title);
        this.state.add('Help', Help_1.Help);
        this.state.add('Options', Options_1.Options);
        this.state.add('GamepadOptionsLayout', GamepadOptionsLayout_1.GamepadOptionsLayout);
        this.state.add('GamepadOptionsBindAxis', GamepadOptionsBindAxis_1.GamepadOptionsBindAxis);
        this.state.add('KeyboardOptions', KeyboardOptions_1.KeyboardOptions);
        this.state.add('KeyboardOptionsBindKey', KeyboardOptionsBindKey_1.KeyboardOptionsBindKey);
        this.state.add('GamepadOptions', GamepadOptions_1.GamepadOptions);
        this.state.add('Level', Level_1.Level);
        this.state.add('GameOver', GameOver_1.GameOver);
        this.state.add('DemoEnding', DemoEnding_1.DemoEnding);
    }
    preloadGame() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }
    createGame() {
        this.controls = new Controls_1.Controls(this);
        this.state.start('Title');
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
//# sourceMappingURL=ShmuprpgGame.js.map
});

;require.register("entities/Bird.ts", function(exports, require, module) {
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
//# sourceMappingURL=Bird.js.map
});

;require.register("entities/BirdFlock.ts", function(exports, require, module) {
"use strict";
const Bird_1 = require("./Bird");
class BirdFlock extends Phaser.Group {
    constructor(target, maxBirds = 10) {
        super(target.game);
        this.flyRate = 1000;
        this.nextFlyTime = 0;
        this.reset(target, maxBirds);
    }
    reset(target, maxBirds = 10) {
        this.target = target;
        this.removeAll();
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
        return new Bird_1.Bird(this.game);
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
//# sourceMappingURL=BirdFlock.js.map
});

;require.register("entities/Bullet.ts", function(exports, require, module) {
"use strict";
class Bullet extends Phaser.Sprite {
    constructor(game, animation = 'bullet.red', atlas = 'bullets') {
        super(game, 0, 0, atlas);
        this.bulletAnimation = animation;
        game.addSpriteAnimation(this, this.bulletAnimation, 4);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
        this.health = 0;
        this.alive = false;
    }
    fire(fromX, fromY, angle, speed, gravityX, gravityY) {
        this.reset(fromX, fromY, 1);
        this.scale.set(1);
        this.game.physics.arcade.velocityFromRotation(angle, speed, this.body.velocity);
        this.angle = angle;
        this.body.gravity.set(gravityX, gravityY);
        this.play(this.bulletAnimation, 4, true);
    }
}
exports.Bullet = Bullet;
//# sourceMappingURL=Bullet.js.map
});

;require.register("entities/Bunny.ts", function(exports, require, module) {
"use strict";
const CircularGun_1 = require("./CircularGun");
const b3 = require("../ia/decisions/b3");
class Bunny extends Phaser.Sprite {
    constructor(game, pathfinder) {
        super(game, 0, 0, 'bunny');
        this.pathfinder = pathfinder;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
        this.game.addSpriteAnimation(this, 'bunny.walk.front', 7);
        this.game.addSpriteAnimation(this, 'bunny.walk.back', 7);
        this.game.addSpriteAnimation(this, 'bunny.walk.right', 7);
        this.game.addSpriteAnimation(this, 'bunny.walk.left', 7);
        this.game.addSpriteAnimation(this, 'bunny.stand.front', 1);
        this.game.addSpriteAnimation(this, 'bunny.stand.back', 1);
        this.game.addSpriteAnimation(this, 'bunny.stand.right', 1);
        this.game.addSpriteAnimation(this, 'bunny.stand.left', 1);
        this.birdExplosion = this.game.add.sprite(this.x, this.y, 'bird-explosion');
        this.birdExplosion.anchor.setTo(0.5, 0.5);
        this.birdExplosion.exists = false;
        const explodeAnimation = this.birdExplosion.animations.add('explode');
        explodeAnimation.killOnComplete = true;
        this.weapon = new CircularGun_1.CircularGun(this.game);
    }
    static preload(game) {
        game.load.atlasXML('bunny', 'sprites/lpc/bunny/bunny.png', 'sprites/lpc/bunny/bunny.xml');
    }
    appears(fromX, fromY) {
        const beforeBunny = this.game.add.sprite(fromX, fromY, 'before-bird');
        beforeBunny.anchor.setTo(0.5, 0.5);
        const beforeBunnyAnimation = beforeBunny.animations.add('appears');
        beforeBunnyAnimation.onComplete.add(() => {
            beforeBunny.destroy();
            this.reset(fromX, fromY, 10);
            this.blackboard = new BunnyBlackboard();
        });
        beforeBunnyAnimation.play(4, false);
    }
    update() {
        super.update();
        if (this.exists) {
            this.executeBehaviorTree();
        }
    }
    executeBehaviorTree() {
        BunnyB3.get().tick(this, this.blackboard);
    }
    damage(amount) {
        super.damage(amount);
        if (!this.damageTween) {
            this.damageTween = this.game.add.tween(this).from({ tint: 0xFF0000 }).to({ tint: 0xFFFFFF }, 500, Phaser.Easing.Linear.None, true, 0, 4, false);
            this.damageTween.onComplete.add(() => this.damageTween = null);
        }
        this.blackboard.fearLevel = 60;
        return this;
    }
    kill() {
        super.kill();
        if (this.damageTween) {
            this.damageTween.stop(true);
        }
        this.birdExplosion.reset(this.x, this.y);
        this.birdExplosion.play('explode', 8, false);
        return this;
    }
}
exports.Bunny = Bunny;
class BunnyBlackboard extends b3.Blackboard {
    constructor(...args) {
        super(...args);
        this.fearLevel = 60;
    }
}
class BunnyB3 extends b3.Tree {
    constructor() {
        super();
        this.root = this.selector(new ActionFollowPath(), this.sequence(new ConditionFeelSafe(), new ActionAttack()), new ActionSearchAPath());
    }
    static get() {
        return this.singleton || (this.singleton = new BunnyB3());
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
                me.play("bunny.walk.left", 8, false);
            }
            else if (me.body.velocity.x > 0) {
                me.play("bunny.walk.right", 8, false);
            }
            else if (me.body.velocity.y < 0) {
                me.play("bunny.walk.back", 8, false);
            }
            else if (me.body.velocity.y > 0) {
                me.play("bunny.walk.front", 8, false);
            }
            else {
                me.play("bunny.stand.front", 0, false);
            }
        }
        else {
            if (me.body.velocity.y < 0) {
                me.play("bunny.walk.back", 8, false);
            }
            else if (me.body.velocity.y > 0) {
                me.play("bunny.walk.front", 8, false);
            }
            else if (me.body.velocity.x < 0) {
                me.play("bunny.walk.left", 8, false);
            }
            else if (me.body.velocity.x > 0) {
                me.play("bunny.walk.right", 8, false);
            }
            else {
                me.play("bunny.stand.front", 0, false);
            }
        }
    }
    moveToXY(me, x, y, speed = 60) {
        var angle = Math.atan2(y - me.body.center.y, x - me.body.center.x);
        me.body.velocity.x = Math.cos(angle) * speed;
        me.body.velocity.y = Math.sin(angle) * speed;
    }
}
class ActionSearchAPath extends b3.Action {
    constructor(...args) {
        super(...args);
        this.thinking = new b3.BlackboardKey();
    }
    tick(t) {
        let thinking = t.blackboard.get(this.thinking) || false;
        let me = t.me;
        if (!thinking) {
            t.blackboard.set(this.thinking, true);
            let targetPos = me.pathfinder.randomWalkablePos();
            me.pathfinder.findPath(me.body.center.x, me.body.center.y, targetPos.x, targetPos.y, (path) => {
                t.blackboard.path = path || [];
                t.blackboard.set(this.thinking, false);
            });
        }
        let path = t.blackboard.path || [];
        return path.length > 0 ? b3.NodeState.SUCCESS : b3.NodeState.RUNNING;
    }
}
class ConditionFeelSafe extends b3.Action {
    tick(t) {
        let fearLevel = t.blackboard.fearLevel > 0 ? t.blackboard.fearLevel-- : 0;
        if (fearLevel == 0) {
            return b3.NodeState.SUCCESS;
        }
        if (fearLevel == 60) {
            return b3.NodeState.FAILURE;
        }
        return b3.NodeState.RUNNING;
    }
}
class ActionAttack extends b3.Action {
    tick(t) {
        t.me.weapon.fire(t.me.centerX, t.me.centerY);
        return b3.NodeState.RUNNING;
    }
}
//# sourceMappingURL=Bunny.js.map
});

;require.register("entities/CircularGun.ts", function(exports, require, module) {
"use strict";
const Bullet_1 = require("./Bullet");
class CircularGun extends Phaser.Group {
    constructor(game, maxBullets = 64, bulletsByShots = 8) {
        super(game);
        this.bulletSpeed = 300;
        this.fireRate = 800;
        this.nextFireTime = 0;
        this.bulletsByShots = bulletsByShots;
        for (let i = 0; i < maxBullets; ++i) {
            this.add(this.createBullet());
        }
    }
    createBullet() {
        return new Bullet_1.Bullet(this.game);
    }
    fire(fromX, fromY) {
        if (this.game.time.time >= this.nextFireTime) {
            for (let b = 1; b <= this.bulletsByShots; ++b) {
                const bullet = this.getFirstExists(false);
                if (bullet) {
                    bullet.fire(fromX, fromY, b * 2 * Math.PI / this.bulletsByShots, this.bulletSpeed, 0, 0);
                }
            }
            this.nextFireTime = this.game.time.time + this.fireRate;
        }
    }
}
exports.CircularGun = CircularGun;
//# sourceMappingURL=CircularGun.js.map
});

;require.register("entities/Grobelin.ts", function(exports, require, module) {
"use strict";
const b3 = require("../ia/decisions/b3");
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
    appears(fromX, fromY, target) {
        const beforeGrobelin = this.game.add.sprite(fromX, fromY, 'before-bird');
        beforeGrobelin.anchor.setTo(0.5, 0.5);
        const beforeGrobelinAnimation = beforeGrobelin.animations.add('appears');
        beforeGrobelinAnimation.onComplete.add(() => {
            beforeGrobelin.destroy();
            this.reset(fromX, fromY, 20);
            this.body.setSize(16, 16, 24, 48);
            this.body.collideWorldBounds = true;
            this.blackboard = new GrobelinBlackboard();
            this.enemy = target;
        });
        beforeGrobelinAnimation.play(4, false);
    }
    kill() {
        super.kill();
        if (this.damageTween) {
            this.damageTween.stop(true);
        }
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
//# sourceMappingURL=Grobelin.js.map
});

;require.register("entities/GrobelinHorde.ts", function(exports, require, module) {
"use strict";
const Grobelin_1 = require("./Grobelin");
class GrobelinHorde extends Phaser.Group {
    constructor(target, pathFinder, maxGrobelins = 4) {
        super(target.game);
        this.appearsRate = 10000;
        this.nextAppearsTime = 0;
        this.pathfinder = pathFinder;
        this.reset(target, maxGrobelins);
    }
    reset(target, maxGrobelins = 4) {
        this.target = target;
        this.removeAll();
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
        const grobelin = new Grobelin_1.Grobelin(this.game, this.pathfinder);
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
//# sourceMappingURL=GrobelinHorde.js.map
});

;require.register("entities/Hero.ts", function(exports, require, module) {
"use strict";
const MachineGun_1 = require("./MachineGun");
const Bullet_1 = require("./Bullet");
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
        this.weapon = new HeroMachineGun(this.game);
        this.game.add.existing(this.weapon);
    }
    static preload(game) {
        game.load.atlasXML('tobira', 'sprites/lpc/characters/tobira.png', 'sprites/lpc/characters/lpc.xml');
        game.load.atlasXML('bullets', 'sprites/devnewton/bullets.png', 'sprites/devnewton/bullets.xml');
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
class HeroMachineGun extends MachineGun_1.CircularGun {
    createBullet() {
        return new Bullet_1.Bullet(this.game, 'bullet.blue');
    }
}
//# sourceMappingURL=Hero.js.map
});

;require.register("entities/MachineGun.ts", function(exports, require, module) {
"use strict";
const Bullet_1 = require("./Bullet");
class CircularGun extends Phaser.Group {
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
        return new Bullet_1.Bullet(this.game);
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
exports.CircularGun = CircularGun;
//# sourceMappingURL=MachineGun.js.map
});

;require.register("entities/Spider.ts", function(exports, require, module) {
"use strict";
const b3 = require("../ia/decisions/b3");
const MachineGun_1 = require("./MachineGun");
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
        this.machineGun = new MachineGun_1.CircularGun(this.game, 1);
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
//# sourceMappingURL=Spider.js.map
});

;require.register("entities/SpiderHorde.ts", function(exports, require, module) {
"use strict";
const Spider_1 = require("./Spider");
class SpiderHorde extends Phaser.Group {
    constructor(target, pathFinder, maxSpiders = 4) {
        super(target.game);
        this.appearsRate = 10000;
        this.nextAppearsTime = 0;
        this.pathfinder = pathFinder;
        this.reset(target, maxSpiders);
    }
    reset(target, maxSpiders = 4) {
        this.target = target;
        this.removeAll();
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
        const spider = new Spider_1.Spider(this.game, this.pathfinder);
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
//# sourceMappingURL=SpiderHorde.js.map
});

;require.register("ia/decisions/b3.ts", function(exports, require, module) {
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
//# sourceMappingURL=b3.js.map
});

;require.register("ia/services/Pathfinder.ts", function(exports, require, module) {
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
        if (!tileStart) {
            console.log('cannot find path starting out of the map: (' + startX + ';' + startY + ')');
            return;
        }
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
//# sourceMappingURL=Pathfinder.js.map
});

;require.register("states/AbstractState.ts", function(exports, require, module) {
"use strict";
class AbstractState extends Phaser.State {
    constructor() {
        super();
    }
    create() {
        this.game.input.keyboard.addKey(Phaser.Keyboard.F11).onDown.add(() => this.toggleFullscreen());
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
//# sourceMappingURL=AbstractState.js.map
});

;require.register("states/DemoEnding.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class DemoEnding extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.image('demo_ending', 'help/demo_ending.png');
        MenuButton_1.MenuButton.preload(this.game);
    }
    create() {
        super.create();
        let logo = this.game.add.sprite(0, 0, 'demo_ending');
        new MenuButton_1.MenuButton(this.game, "Back", 500, 900, () => this.game.state.start('Title'));
    }
}
exports.DemoEnding = DemoEnding;
//# sourceMappingURL=DemoEnding.js.map
});

;require.register("states/GameOver.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class GameOver extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.image('gameover', 'gameover/gameover.png');
    }
    create() {
        super.create();
        this.game.add.image(0, 0, 'gameover');
        new MenuButton_1.MenuButton(this.game, "Main menu", 500, 900, () => this.game.state.start('Title'));
    }
}
exports.GameOver = GameOver;
//# sourceMappingURL=GameOver.js.map
});

;require.register("states/GamepadOptions.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class GamepadOptions extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        MenuButton_1.MenuButton.preload(this.game);
    }
    create() {
        super.create();
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad', { font: "68px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);
        let subtitle = this.game.add.text(0, 0, 'Move stick or press button to show gamepad number', { font: "60px monospace", fill: 'white' });
        subtitle.y = this.game.world.height - subtitle.height;
        new GamepadMenuButton(this.input.gamepad.pad1, 0xFF6666, "Gamepad 1", 500, 200, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 1);
        });
        new GamepadMenuButton(this.input.gamepad.pad2, 0x66FF66, "Gamepad 2", 500, 350, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 2);
        });
        new GamepadMenuButton(this.input.gamepad.pad3, 0x6666FF, "Gamepad 3", 500, 500, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 3);
        });
        new GamepadMenuButton(this.input.gamepad.pad4, 0xFFFF66, "Gamepad 4", 500, 650, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 4);
        });
        new MenuButton_1.MenuButton(this.game, "Back", 500, 800, () => this.game.state.start('Options'));
    }
}
exports.GamepadOptions = GamepadOptions;
class GamepadMenuButton extends MenuButton_1.MenuButton {
    constructor(pad, activePadTint, label, x, y, callback) {
        super(pad.game, label, x, y, callback);
        this.pad = pad;
        this.activePadTint = activePadTint;
    }
    update() {
        super.update();
        if (this.isPadActive()) {
            this.tint = this.activePadTint;
        }
        else {
            this.tint = 0xFFFFFF;
        }
    }
    isPadActive() {
        for (let b = 0; b < 16; ++b) {
            let button = this.pad.getButton(b);
            if (button && button.isDown) {
                return true;
            }
        }
        for (let a = 0; a < 16; ++a) {
            if (Math.abs(this.pad.axis(a)) > this.pad.deadZone) {
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=GamepadOptions.js.map
});

;require.register("states/GamepadOptionsBindAxis.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class GamepadOptionsBindAxis extends AbstractState_1.AbstractState {
    constructor() {
        super();
        this.bindings = [
            { label: 'Pull move X axis', localStorageKeySuffix: 'moveXAxis' },
            { label: 'Pull move Y axis', localStorageKeySuffix: 'moveYAxis' },
            { label: 'Pull shoot X axis', localStorageKeySuffix: 'shootXAxis' },
            { label: 'Pull shoot Y axis', localStorageKeySuffix: 'shootYAxis' }
        ];
        this.currentBinding = 0;
        this.padIndex = 1;
    }
    preload() {
        MenuButton_1.MenuButton.preload(this.game);
    }
    init(padIndex, binding = 0) {
        padIndex = padIndex || 1;
        this.padIndex = 1;
        this.pad = this.input.gamepad['pad' + this.padIndex];
        if (binding >= this.bindings.length) {
            this.currentBinding = 0;
            this.game.controls.useCustomGamepadLayout(padIndex);
            this.game.state.start('GamepadOptions');
        }
        else {
            this.currentBinding = binding;
        }
        this.waitForNoInput = 60;
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindings[this.currentBinding].label, { font: "68px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Back", 500, 900, () => this.game.state.start('GamepadOptions'));
    }
    update() {
        super.update();
        let activationZone = Math.max(0.99, Math.min(0.8, 4 * this.pad.deadZone));
        for (var k in Phaser.Gamepad) {
            if (k.startsWith('AXIS_')) {
                let axisCode = Phaser.Gamepad[k];
                if (Math.abs(this.pad.axis(axisCode)) >= activationZone) {
                    if (this.waitForNoInput > 0) {
                        return;
                    }
                    else {
                        localStorage.setItem('gamepad' + this.padIndex + '.layout.custom.' + this.bindings[this.currentBinding].localStorageKeySuffix, axisCode);
                        this.game.state.start('GamepadOptionsBindAxis', true, false, this.padIndex, this.currentBinding + 1);
                        return;
                    }
                }
            }
        }
        this.waitForNoInput--;
    }
}
exports.GamepadOptionsBindAxis = GamepadOptionsBindAxis;
//# sourceMappingURL=GamepadOptionsBindAxis.js.map
});

;require.register("states/GamepadOptionsLayout.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class GamepadOptionsLayout extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        MenuButton_1.MenuButton.preload(this.game);
    }
    init(padIndex) {
        this.padIndex = padIndex || 1;
    }
    create() {
        super.create();
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad layout', { font: "68px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Xbox", 500, 200, () => {
            this.game.controls.useXboxLayout(this.padIndex);
            this.game.state.start('Options');
        });
        new MenuButton_1.MenuButton(this.game, "Custom", 500, 350, () => {
            this.game.state.start('GamepadOptionsBindAxis', true, false, this.padIndex);
        });
        new MenuButton_1.MenuButton(this.game, "Back", 500, 500, () => this.game.state.start('Options'));
    }
}
exports.GamepadOptionsLayout = GamepadOptionsLayout;
class GamepadMenuButton extends MenuButton_1.MenuButton {
    constructor(pad, activePadTint, label, x, y, callback) {
        super(pad.game, label, x, y, callback);
        this.pad = pad;
        this.activePadTint = activePadTint;
    }
    update() {
        super.update();
        if (this.isPadActive()) {
            this.tint = this.activePadTint;
        }
        else {
            this.tint = 0xFFFFFF;
        }
    }
    isPadActive() {
        for (let b = 0; b < 16; ++b) {
            let button = this.pad.getButton(b);
            if (button && button.isDown) {
                return true;
            }
        }
        for (let a = 0; a < 16; ++a) {
            if (Math.abs(this.pad.axis(a)) > this.pad.deadZone) {
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=GamepadOptionsLayout.js.map
});

;require.register("states/Help.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class Help extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.image('help', 'help/help.png');
        MenuButton_1.MenuButton.preload(this.game);
    }
    create() {
        super.create();
        let logo = this.game.add.sprite(0, 0, 'help');
        new MenuButton_1.MenuButton(this.game, "Back", 500, 900, () => this.game.state.start('Title'));
    }
}
exports.Help = Help;
//# sourceMappingURL=Help.js.map
});

;require.register("states/Intro.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
class Intro extends AbstractState_1.AbstractState {
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
//# sourceMappingURL=Intro.js.map
});

;require.register("states/KeyboardOptions.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class KeyboardOptions extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        MenuButton_1.MenuButton.preload(this.game);
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Choose keyboard layout', { font: "68px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Azerty zsqd ikjl", 500, 300, () => {
            this.game.controls.useAzertyLayout();
            this.game.state.start('Options');
        });
        new MenuButton_1.MenuButton(this.game, "Qwerty wsad ikjl", 500, 450, () => {
            this.game.controls.useQwertyLayout();
            this.game.state.start('Options');
        });
        new MenuButton_1.MenuButton(this.game, "Others ⬆⬇⬅➡ ikjl", 500, 600, () => {
            this.game.controls.useOtherKeyboardLayout();
            this.game.state.start('Options');
        });
        new MenuButton_1.MenuButton(this.game, "Custom", 500, 750, () => {
            this.game.controls.useOtherKeyboardLayout();
            this.game.state.start('KeyboardOptionsBindKey', true, false);
        });
        new MenuButton_1.MenuButton(this.game, "Back", 500, 900, () => this.game.state.start('Options'));
    }
}
exports.KeyboardOptions = KeyboardOptions;
//# sourceMappingURL=KeyboardOptions.js.map
});

;require.register("states/KeyboardOptionsBindKey.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class KeyboardOptionsBindKey extends AbstractState_1.AbstractState {
    constructor() {
        super();
        this.bindings = [
            { label: 'Press move up key', localStorageKey: 'keyboard.layout.custom.moveUp' },
            { label: 'Press move down key', localStorageKey: 'keyboard.layout.custom.moveDown' },
            { label: 'Press move left key', localStorageKey: 'keyboard.layout.custom.moveLeft' },
            { label: 'Press move right key', localStorageKey: 'keyboard.layout.custom.moveRight' },
            { label: 'Press shoot up key', localStorageKey: 'keyboard.layout.custom.shootUp' },
            { label: 'Press shoot down key', localStorageKey: 'keyboard.layout.custom.shootDown' },
            { label: 'Press shoot left key', localStorageKey: 'keyboard.layout.custom.shootLeft' },
            { label: 'Press shoot right key', localStorageKey: 'keyboard.layout.custom.shootRight' }
        ];
        this.currentBinding = 0;
    }
    preload() {
        MenuButton_1.MenuButton.preload(this.game);
    }
    init(binding = 0) {
        if (binding >= this.bindings.length) {
            this.currentBinding = 0;
            this.game.controls.useCustomKeyboardLayout();
            this.game.state.start('KeyboardOptions');
        }
        else {
            this.currentBinding = binding;
        }
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindings[this.currentBinding].label, { font: "68px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Back", 500, 900, () => this.game.state.start('KeyboardOptions'));
    }
    update() {
        for (var k in Phaser.KeyCode) {
            let keycode = Phaser.KeyCode[k];
            if (this.input.keyboard.isDown(keycode)) {
                localStorage.setItem(this.bindings[this.currentBinding].localStorageKey, keycode);
                this.game.state.start('KeyboardOptionsBindKey', true, false, this.currentBinding + 1);
                break;
            }
        }
    }
}
exports.KeyboardOptionsBindKey = KeyboardOptionsBindKey;
//# sourceMappingURL=KeyboardOptionsBindKey.js.map
});

;require.register("states/Level.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Hero_1 = require("../entities/Hero");
const BirdFlock_1 = require("../entities/BirdFlock");
const GrobelinHorde_1 = require("../entities/GrobelinHorde");
const SpiderHorde_1 = require("../entities/SpiderHorde");
const Bunny_1 = require("../entities/Bunny");
const Pathfinder_1 = require("../ia/services/Pathfinder");
const DamageResolver_1 = require("../utils/DamageResolver");
const Dialog_1 = require("../ui/Dialog");
class Level extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        BirdFlock_1.BirdFlock.preload(this.game);
        GrobelinHorde_1.GrobelinHorde.preload(this.game);
        SpiderHorde_1.SpiderHorde.preload(this.game);
        Hero_1.Hero.preload(this.game);
        Bunny_1.Bunny.preload(this.game);
        this.game.load.tilemap('map', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('terrains', 'sprites/lpc/terrains/terrains.png');
        this.game.load.image('cottage', 'sprites/lpc/thatched-roof-cottage/cottage.png');
        this.game.load.image('thatched-roof', 'sprites/lpc/thatched-roof-cottage/thatched-roof.png');
        this.game.load.image('doors', 'sprites/lpc/windows-doors/doors.png');
        this.game.load.image('windows', 'sprites/lpc/windows-doors/windows.png');
        this.game.load.image('obj_misk_atlas', 'sprites/lpc/tile-atlas2/obj_misk_atlas.png');
        Dialog_1.Dialog.preload(this.game);
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
        this.damageResolver = new DamageResolver_1.DamageResolver(this.game);
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
        this.pathfinder = new Pathfinder_1.Pathfinder(map);
        this.hero = new Hero_1.Hero(this.game);
        this.game.add.existing(this.hero);
        this.birdFlock = new BirdFlock_1.BirdFlock(this.hero, 0);
        this.game.add.existing(this.birdFlock);
        this.grobelinHorde = new GrobelinHorde_1.GrobelinHorde(this.hero, this.pathfinder, 0);
        this.game.add.existing(this.grobelinHorde);
        this.spiderHorde = new SpiderHorde_1.SpiderHorde(this.hero, this.pathfinder, 0);
        this.game.add.existing(this.spiderHorde);
        this.bunnyGroup = this.game.add.group();
        this.shouldCheckBunnyLiving = false;
        this.startDialog();
    }
    startDialog() {
        let dialog = new Dialog_1.Dialog(this.game, "What a beautiful day! I do not regret leaving the magic university to live in this farm with my wife, Clementine.");
        dialog.onFinishCallback = () => {
            dialog.text = "Speaking of her, she should be back from the forest soon. I hope she catched something good for diner.";
            dialog.onFinishCallback = () => {
                dialog.text = "Mmh that's strange, I am suddently feeling magic around and not a good one...";
                dialog.onFinishCallback = () => {
                    dialog.destroy();
                    this.startAction();
                };
            };
        };
    }
    endingDialog() {
        let dialog = new Dialog_1.Dialog(this.game, "What was that? It looks like somebody has invoked monsters and sent them to... me?");
        dialog.onFinishCallback = () => {
            dialog.text = "Clementine! I must go to the forest, maybe she is in danger!";
            dialog.onFinishCallback = () => {
                this.game.state.start('DemoEnding');
            };
        };
    }
    startAction() {
        this.game.time.events.add(1000, () => this.grobelinHorde.reset(this.hero, 3));
        this.game.time.events.add(20 * 1000, () => this.spiderHorde.reset(this.hero, 4));
        this.game.time.events.add(40 * 1000, () => this.birdFlock.reset(this.hero, 10));
        this.game.time.events.add(60 * 1000, () => {
            this.birdFlock.flyRate = Number.MAX_VALUE;
            this.spiderHorde.appearsRate = Number.MAX_VALUE;
            this.grobelinHorde.appearsRate = Number.MAX_VALUE;
        });
        this.game.time.events.add(80 * 1000, () => {
            for (let i = 0; i < 4; ++i) {
                let pos = this.pathfinder.randomWalkablePos();
                let bunny = new Bunny_1.Bunny(this.game, this.pathfinder);
                bunny.appears(pos.x, pos.y);
                this.bunnyGroup.add(bunny);
            }
            this.shouldCheckBunnyLiving = true;
        });
    }
    update() {
        this.pathfinder.update();
        this.game.physics.arcade.collide(this.hero, this.collisionSprites);
        this.resolveWeaponsEffects();
        if (this.shouldCheckBunnyLiving && this.bunnyGroup.countLiving() == 0) {
            this.shouldCheckBunnyLiving = false;
            this.game.time.events.add(3 * 1000, () => {
                this.endingDialog();
            });
        }
    }
    resolveWeaponsEffects() {
        this.damageResolver.groupVersusGroup(this.hero.weapon, this.bunnyGroup);
        for (let bunny of this.bunnyGroup.children) {
            this.damageResolver.spriteVersusGroup(this.hero, bunny.weapon);
        }
        this.damageResolver.spriteVersusGroup(this.hero, this.birdFlock);
        this.damageResolver.groupVersusGroup(this.hero.weapon, this.birdFlock);
        this.damageResolver.spriteVersusGroup(this.hero, this.birdFlock);
        this.damageResolver.groupVersusGroup(this.hero.weapon, this.grobelinHorde);
        this.damageResolver.groupVersusGroup(this.hero.weapon, this.spiderHorde);
        for (let spider of this.spiderHorde.children) {
            this.damageResolver.spriteVersusGroup(this.hero, spider.machineGun);
        }
    }
    render() {
    }
}
exports.Level = Level;
//# sourceMappingURL=Level.js.map
});

;require.register("states/Options.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class Options extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        MenuButton_1.MenuButton.preload(this.game);
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Options', { font: "120px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        let y = 150;
        new MenuButton_1.MenuButton(this.game, "Keyboard", 500, y += 150, () => this.game.state.start('KeyboardOptions'));
        if (this.input.gamepad.supported) {
            new MenuButton_1.MenuButton(this.game, "Gamepad", 500, y += 150, () => this.game.state.start('GamepadOptions'));
        }
        new MenuButton_1.MenuButton(this.game, "Back", 500, y += 150, () => this.game.state.start('Title'));
    }
}
exports.Options = Options;
//# sourceMappingURL=Options.js.map
});

;require.register("states/Title.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class Title extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.image('logo', 'title/logo.png');
        MenuButton_1.MenuButton.preload(this.game);
    }
    create() {
        super.create();
        let logo = this.game.add.sprite(this.game.world.centerX, 0, 'logo');
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Start", 500, 300, () => this.game.state.start('Level'));
        new MenuButton_1.MenuButton(this.game, "Options", 500, 450, () => this.game.state.start('Options'));
        new MenuButton_1.MenuButton(this.game, "Help", 500, 600, () => this.game.state.start('Help'));
    }
}
exports.Title = Title;
//# sourceMappingURL=Title.js.map
});

;require.register("ui/Dialog.ts", function(exports, require, module) {
"use strict";
class Dialog extends Phaser.Group {
    constructor(game, text) {
        super(game);
        this.passButtonWasDown = false;
        let dialogBackground = game.add.image(0, 600, "dialog_bg", null, this);
        dialogBackground.alpha = 0.9;
        this.dialogText = game.add.text(game.world.centerX, 630, text, {
            font: "64px monospace",
            fill: "white",
            wordWrap: true,
            wordWrapWidth: 1900
        }, this);
        this.dialogText.anchor.x = 0.5;
        game.add.existing(this);
        this.controls = game.controls;
    }
    set text(text) {
        this.dialogText.text = text;
    }
    static preload(game) {
        game.load.image('dialog_bg', 'dialog/dialog_bg.png');
    }
    update() {
        let passButtonIsDown = this.controls.isPassDialogButtonDown();
        if (this.passButtonWasDown && !passButtonIsDown) {
            this.passButtonWasDown = false;
            if (this.onFinishCallback) {
                this.onFinishCallback();
            }
        }
        else {
            this.passButtonWasDown = passButtonIsDown;
        }
    }
}
exports.Dialog = Dialog;
//# sourceMappingURL=Dialog.js.map
});

;require.register("ui/MenuButton.ts", function(exports, require, module) {
"use strict";
class MenuButton extends Phaser.Button {
    constructor(game, label, x, y, callback) {
        super(game, x, y, 'menu-buttons', callback, null, 'over', 'out', 'down');
        this.labelText = new Phaser.Text(this.game, 140, 15, label, { font: "64px monospace", fill: 'white' });
        this.addChild(this.labelText);
        game.add.existing(this);
    }
    setText(text) {
        this.labelText.setText(text);
    }
    static preload(game) {
        game.load.atlasXML('menu-buttons', 'menu/buttons.png', 'menu/buttons.xml');
    }
}
exports.MenuButton = MenuButton;
//# sourceMappingURL=MenuButton.js.map
});

;require.register("utils/Controls.ts", function(exports, require, module) {
"use strict";
class Controls {
    constructor(game) {
        this.game = game;
        game.input.gamepad.start();
        this.kb = game.input.keyboard;
        this.setupKeyboardLayout();
        this.setupGamepadLayout();
    }
    setupKeyboardLayout() {
        let layout = localStorage.getItem('keyboard.layout');
        if (null == layout || layout == 'azerty') {
            this.useAzertyLayout();
        }
        else if (layout == 'qwerty') {
            this.useQwertyLayout();
        }
        else if (layout == 'other') {
            this.useOtherKeyboardLayout();
        }
        else if (layout == 'custom') {
            this.useCustomKeyboardLayout();
        }
    }
    useAzertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.Z;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.Q;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeShootUp = Phaser.KeyCode.I;
        this.keyCodeShootDown = Phaser.KeyCode.K;
        this.keyCodeShootLeft = Phaser.KeyCode.J;
        this.keyCodeShootRight = Phaser.KeyCode.L;
        localStorage.setItem('keyboard.layout', 'azerty');
    }
    useQwertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.W;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.A;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeShootUp = Phaser.KeyCode.I;
        this.keyCodeShootDown = Phaser.KeyCode.K;
        this.keyCodeShootLeft = Phaser.KeyCode.J;
        this.keyCodeShootRight = Phaser.KeyCode.L;
        localStorage.setItem('keyboard.layout', 'qwerty');
    }
    useOtherKeyboardLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.UP;
        this.keyCodeMoveDown = Phaser.KeyCode.DOWN;
        this.keyCodeMoveLeft = Phaser.KeyCode.LEFT;
        this.keyCodeMoveRight = Phaser.KeyCode.RIGHT;
        this.keyCodeShootUp = Phaser.KeyCode.I;
        this.keyCodeShootDown = Phaser.KeyCode.K;
        this.keyCodeShootLeft = Phaser.KeyCode.J;
        this.keyCodeShootRight = Phaser.KeyCode.L;
        localStorage.setItem('keyboard.layout', 'other');
    }
    useCustomKeyboardLayout() {
        this.keyCodeMoveUp = this.readNumberFromLocalStorage('keyboard.layout.custom.moveUp', Phaser.KeyCode.UP);
        this.keyCodeMoveDown = this.readNumberFromLocalStorage('keyboard.layout.custom.moveDown', Phaser.KeyCode.DOWN);
        this.keyCodeMoveLeft = this.readNumberFromLocalStorage('keyboard.layout.custom.moveLeft', Phaser.KeyCode.LEFT);
        this.keyCodeMoveRight = this.readNumberFromLocalStorage('keyboard.layout.custom.moveRight', Phaser.KeyCode.RIGHT);
        this.keyCodeShootUp = this.readNumberFromLocalStorage('keyboard.layout.custom.shootUp', Phaser.KeyCode.I);
        this.keyCodeShootDown = this.readNumberFromLocalStorage('keyboard.layout.custom.shootDown', Phaser.KeyCode.K);
        this.keyCodeShootLeft = this.readNumberFromLocalStorage('keyboard.layout.custom.shootLeft', Phaser.KeyCode.J);
        this.keyCodeShootRight = this.readNumberFromLocalStorage('keyboard.layout.custom.shootRight', Phaser.KeyCode.L);
        localStorage.setItem('keyboard.layout', 'custom');
    }
    setupGamepadLayout() {
        let padIndex = parseInt(localStorage.getItem('gamepad')) || 1;
        let layout = localStorage.getItem('gamepad' + padIndex + '.layout');
        if (null == layout || layout == 'xbox') {
            this.useXboxLayout(padIndex);
        }
        else if (layout == 'custom') {
            this.useCustomGamepadLayout(padIndex);
        }
    }
    useXboxLayout(padIndex) {
        padIndex = padIndex || 1;
        this.pad = this.game.input.gamepad['pad' + padIndex];
        this.moveXAxis = Phaser.Gamepad.XBOX360_STICK_LEFT_X;
        this.moveYAxis = Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
        this.shootXAxis = Phaser.Gamepad.XBOX360_STICK_RIGHT_X;
        this.shootYAxis = Phaser.Gamepad.XBOX360_STICK_RIGHT_Y;
        localStorage.setItem('gamepad', padIndex.toString());
        localStorage.setItem('gamepad' + padIndex + '.layout', 'xbox');
    }
    useCustomGamepadLayout(padIndex) {
        padIndex = padIndex || 1;
        this.pad = this.game.input.gamepad['pad' + padIndex];
        this.moveXAxis = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.moveXAxis', Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        this.moveYAxis = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.moveYAxis', Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        this.shootXAxis = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.shootXAxis', Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
        this.shootYAxis = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.shootYAxis', Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);
        localStorage.setItem('gamepad', padIndex.toString());
        localStorage.setItem('gamepad' + padIndex + '.layout', 'custom');
    }
    readNumberFromLocalStorage(key, defaultValue) {
        let i = parseInt(localStorage.getItem(key));
        if (isNaN(i)) {
            return defaultValue;
        }
        else {
            return i;
        }
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
            return null;
        }
    }
    shootingAngleFromPad() {
        let dx = this.pad.axis(this.shootXAxis);
        let dy = this.pad.axis(this.shootYAxis);
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
        if (this.kb.isDown(this.keyCodeShootLeft)) {
            dx = -1;
        }
        else if (this.kb.isDown(this.keyCodeShootRight)) {
            dx = 1;
        }
        let dy = 0;
        if (this.kb.isDown(this.keyCodeShootUp)) {
            dy = -1;
        }
        else if (this.kb.isDown(this.keyCodeShootDown)) {
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
        return this.pad.axis(this.moveYAxis) < -this.pad.deadZone
            || this.kb.isDown(this.keyCodeMoveUp);
    }
    isGoingDown() {
        return this.pad.axis(this.moveYAxis) > this.pad.deadZone
            || this.kb.isDown(this.keyCodeMoveDown);
    }
    isGoingLeft() {
        return this.pad.axis(this.moveXAxis) < -this.pad.deadZone
            || this.kb.isDown(this.keyCodeMoveLeft);
    }
    isGoingRight() {
        return this.pad.axis(this.moveXAxis) > this.pad.deadZone
            || this.kb.isDown(this.keyCodeMoveRight);
    }
    isPassDialogButtonDown() {
        return this.game.input.activePointer.isDown
            || this.pad.isDown(Phaser.Gamepad.XBOX360_A);
    }
}
exports.Controls = Controls;
//# sourceMappingURL=Controls.js.map
});

;require.register("utils/DamageResolver.ts", function(exports, require, module) {
"use strict";
class DamageResolver {
    constructor(game) {
        this.game = game;
    }
    groupVersusGroup(groupA, groupB) {
        for (let spriteA of groupA.children) {
            if (spriteA instanceof Phaser.Sprite) {
                this.spriteVersusGroup(spriteA, groupB);
            }
        }
    }
    spriteVersusGroup(spriteA, groupB) {
        if (spriteA.exists) {
            for (let spriteB of groupB.children) {
                if (spriteB instanceof Phaser.Sprite) {
                    this.spriteVersusSprite(spriteA, spriteB);
                }
            }
        }
    }
    spriteVersusSprite(spriteA, spriteB) {
        if (spriteA.exists && spriteB.exists && spriteA.overlap(spriteB)) {
            spriteA.damage(1);
            spriteB.damage(1);
        }
    }
}
exports.DamageResolver = DamageResolver;
//# sourceMappingURL=DamageResolver.js.map
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('ShmuprpgApp');
//# sourceMappingURL=app.js.map