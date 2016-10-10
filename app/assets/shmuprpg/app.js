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
var ShmuprpgGame_ts_1 = require("./ShmuprpgGame.ts");
new ShmuprpgGame_ts_1.ShmuprpgGame();
//# sourceMappingURL=ShmuprpgApp.js.map
});

require.register("ShmuprpgGame.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Intro_ts_1 = require("./states/Intro.ts");
var Title_ts_1 = require("./states/Title.ts");
var Level_ts_1 = require("./states/Level.ts");
var GameOver_ts_1 = require("./states/GameOver.ts");
var Controls_ts_1 = require("./utils/Controls.ts");
var ShmuprpgGame = (function (_super) {
    __extends(ShmuprpgGame, _super);
    function ShmuprpgGame() {
        var _this = this;
        _super.call(this, 1920, 1080, Phaser.CANVAS, 'game', {
            preload: function () { return _this.preloadGame(); },
            create: function () { return _this.createGame(); }
        });
        this.state.add('Intro', Intro_ts_1.Intro);
        this.state.add('Title', Title_ts_1.Title);
        this.state.add('Level', Level_ts_1.Level);
        this.state.add('GameOver', GameOver_ts_1.GameOver);
    }
    ShmuprpgGame.prototype.preloadGame = function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    };
    ShmuprpgGame.prototype.createGame = function () {
        this.controls = new Controls_ts_1.Controls(this);
        this.state.start('Level');
    };
    ShmuprpgGame.prototype.addSpriteAnimation = function (sprite, animationName, frameCount) {
        return sprite.animations.add(animationName, this.genAnimArray(animationName, frameCount));
    };
    ShmuprpgGame.prototype.genAnimArray = function (name, n) {
        var result = new Array();
        for (var i = 0; i < n; ++i) {
            result.push(name + i);
        }
        return result;
    };
    return ShmuprpgGame;
}(Phaser.Game));
exports.ShmuprpgGame = ShmuprpgGame;
//# sourceMappingURL=ShmuprpgGame.js.map
});

;require.register("entities/Bird.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bird = (function (_super) {
    __extends(Bird, _super);
    function Bird(game) {
        _super.call(this, game, 0, 0, 'bird');
        this.animations.add('fly');
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
        this.birdExplosion = this.game.add.sprite(this.x, this.y, 'bird-explosion');
        this.birdExplosion.anchor.setTo(0.5, 0.5);
        this.birdExplosion.exists = false;
        var explodeAnimation = this.birdExplosion.animations.add('explode');
        explodeAnimation.killOnComplete = true;
    }
    Bird.prototype.fly = function (fromX, fromY, angle) {
        var _this = this;
        var beforeBird = this.game.add.sprite(fromX, fromY, 'before-bird');
        beforeBird.anchor.setTo(0.5, 0.5);
        var beforeBirdAnimation = beforeBird.animations.add('appears');
        beforeBirdAnimation.onComplete.add(function () {
            beforeBird.destroy();
            _this.reset(fromX, fromY);
            _this.play('fly', 8, true);
            _this.game.physics.arcade.velocityFromRotation(angle, 300, _this.body.velocity);
            _this.scale.set(_this.body.velocity.x < 0 ? -1 : 1, 1);
        });
        beforeBirdAnimation.play(4, false);
    };
    Bird.prototype.kill = function () {
        _super.prototype.kill.call(this);
        this.birdExplosion.reset(this.x, this.y);
        this.birdExplosion.play('explode', 8, false);
        return this;
    };
    return Bird;
}(Phaser.Sprite));
exports.Bird = Bird;
//# sourceMappingURL=Bird.js.map
});

;require.register("entities/BirdFlock.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bird_ts_1 = require("./Bird.ts");
var BirdFlock = (function (_super) {
    __extends(BirdFlock, _super);
    function BirdFlock(target, maxBirds) {
        if (maxBirds === void 0) { maxBirds = 8; }
        _super.call(this, target.game);
        this.flyRate = 1000;
        this.nextFlyTime = 0;
        this.target = target;
        for (var i = 0; i < maxBirds; ++i) {
            this.add(this.createBird());
        }
    }
    BirdFlock.preload = function (game) {
        game.load.spritesheet('bird', 'sprites/oga/tower-defense-prototyping-assets-4-monsters-some-tiles-a-background-image/bird.png', 48, 48, 5);
        game.load.spritesheet('before-bird', 'sprites/oga/rpg-special-move-effects/VioletSlash.png', 64, 64, 4);
        game.load.spritesheet('bird-explosion', 'sprites/oga/space_shooter_pack/explosion.png', 16, 16, 5);
    };
    BirdFlock.prototype.update = function () {
        _super.prototype.update.call(this);
        var x = this.game.world.randomX;
        var y = this.game.world.randomY;
        var angle = Phaser.Math.angleBetween(x, y, this.target.x, this.target.y);
        this.fly(x, y, angle);
    };
    BirdFlock.prototype.createBird = function () {
        return new Bird_ts_1.Bird(this.game);
    };
    BirdFlock.prototype.fly = function (fromX, fromY, angle) {
        if (this.game.time.time >= this.nextFlyTime) {
            var bird = this.getFirstExists(false);
            if (bird) {
                bird.fly(fromX, fromY, angle);
                this.nextFlyTime = this.game.time.time + this.flyRate;
            }
        }
    };
    return BirdFlock;
}(Phaser.Group));
exports.BirdFlock = BirdFlock;
//# sourceMappingURL=BirdFlock.js.map
});

;require.register("entities/Bullet.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(game) {
        _super.call(this, game, 0, 0, 'bullet');
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
    }
    Bullet.prototype.fire = function (fromX, fromY, angle, speed, gravityX, gravityY) {
        this.reset(fromX, fromY);
        this.scale.set(1);
        this.game.physics.arcade.velocityFromRotation(angle, speed, this.body.velocity);
        this.angle = angle;
        this.body.gravity.set(gravityX, gravityY);
    };
    return Bullet;
}(Phaser.Sprite));
exports.Bullet = Bullet;
//# sourceMappingURL=Bullet.js.map
});

;require.register("entities/Grobelin.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Grobelin = (function (_super) {
    __extends(Grobelin, _super);
    function Grobelin(game, pathfinder) {
        _super.call(this, game, 0, 0, 'grobelin');
        this.path = new Array();
        this.thinking = false;
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
    Grobelin.prototype.getVulnerableRectangles = function () {
        return [new Phaser.Rectangle(this.x, this.y, this.width, this.height)];
    };
    Grobelin.prototype.appears = function (fromX, fromY, target) {
        var _this = this;
        var beforeGrobelin = this.game.add.sprite(fromX, fromY, 'before-bird');
        beforeGrobelin.anchor.setTo(0.5, 0.5);
        var beforeGrobelinAnimation = beforeGrobelin.animations.add('appears');
        beforeGrobelinAnimation.onComplete.add(function () {
            beforeGrobelin.destroy();
            _this.reset(fromX, fromY, 50);
            _this.body.setSize(16, 16, 24, 48);
            _this.body.collideWorldBounds = true;
            _this.path = [];
            _this.currentPathPointTarget = null;
            _this.thinking = false;
            _this.enemy = target;
        });
        beforeGrobelinAnimation.play(4, false);
    };
    Grobelin.prototype.kill = function () {
        _super.prototype.kill.call(this);
        this.damageTween.stop(true);
        this.tint = 0xFFFFFF;
        this.grobelinDeath.reset(this.x, this.y);
        this.grobelinDeath.animations.play("lpc.hurt", 6, false).killOnComplete = true;
        return this;
    };
    Grobelin.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.exists) {
            this.executeBehaviorTree();
        }
    };
    Grobelin.prototype.damage = function (amount) {
        var _this = this;
        if (!this.damageTween) {
            this.damageTween = this.game.add.tween(this).from({ tint: 0xFF0000 }).to({ tint: 0xFFFFFF }, 500, Phaser.Easing.Linear.None, true, 0, 4, false);
            this.damageTween.onComplete.add(function () { return _this.damageTween = null; });
        }
        _super.prototype.damage.call(this, amount);
        return this;
    };
    Grobelin.prototype.executeBehaviorTree = function () {
        this.priority_Root();
    };
    Grobelin.prototype.priority_Root = function () {
        this.sequence_Attack() || this.action_FollowPath() || this.action_SearchAPathToEnemy();
    };
    Grobelin.prototype.sequence_Attack = function () {
        return this.condition_IsNearEnemy() && this.action_AttackEnemy();
    };
    Grobelin.prototype.condition_IsNearEnemy = function () {
        return this.enemy && Phaser.Math.distance(this.body.center.x, this.body.center.y, this.enemy.body.center.x, this.enemy.body.center.y) < this.body.width * 2;
    };
    Grobelin.prototype.action_AttackEnemy = function () {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        if (!this.attackAnimation) {
            _a = this.action_AttackEnemy_PlayAnimation(), this.attackAnimation = _a[0], this.attackDangerousOffset = _a[1];
        }
        else if (this.attackAnimation.isFinished) {
            this.attackAnimation = null;
            var enemyRectangle = new Phaser.Rectangle(this.enemy.left, this.enemy.top, this.enemy.width, this.enemy.height);
            if (Phaser.Rectangle.containsPoint(enemyRectangle, this.getAttackPoint())) {
                this.enemy.damage(1);
            }
        }
        return true;
        var _a;
    };
    Grobelin.prototype.getAttackPoint = function () {
        if (this.attackDangerousOffset) {
            return new Phaser.Point(this.body.center.x + this.attackDangerousOffset.x, this.body.center.y + this.attackDangerousOffset.y);
        }
        else {
            return null;
        }
    };
    Grobelin.prototype.action_AttackEnemy_PlayAnimation = function () {
        var dx = this.enemy.body.center.x - this.body.center.x;
        var dy = this.enemy.body.center.y - this.body.center.y;
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
    };
    Grobelin.prototype.action_FollowPath = function () {
        if (this.currentPathPointTarget) {
            this.action_FollowPath_MoveToXY(this.currentPathPointTarget.x, this.currentPathPointTarget.y, 300);
            if (Phaser.Math.distance(this.body.center.x, this.body.center.y, this.currentPathPointTarget.x, this.currentPathPointTarget.y) < this.body.halfWidth) {
                this.currentPathPointTarget = null;
            }
        }
        else {
            this.currentPathPointTarget = this.path.shift();
            if (this.path.length == 0) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                return false;
            }
        }
        this.action_FollowPath_Animate();
        return true;
    };
    Grobelin.prototype.action_FollowPath_Animate = function () {
        if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
            if (this.body.velocity.x < 0) {
                this.play("lpc.walk.left", 8, false);
            }
            else if (this.body.velocity.x > 0) {
                this.play("lpc.walk.right", 8, false);
            }
            else if (this.body.velocity.y < 0) {
                this.play("lpc.walk.back", 8, false);
            }
            else if (this.body.velocity.y > 0) {
                this.play("lpc.walk.front", 8, false);
            }
            else {
                this.play("lpc.hurt", 0, false);
            }
        }
        else {
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
        }
    };
    Grobelin.prototype.action_FollowPath_MoveToXY = function (x, y, speed) {
        if (speed === void 0) { speed = 60; }
        var angle = Math.atan2(y - this.body.center.y, x - this.body.center.x);
        this.body.velocity.x = Math.cos(angle) * speed;
        this.body.velocity.y = Math.sin(angle) * speed;
    };
    Grobelin.prototype.action_SearchAPathToEnemy = function () {
        var _this = this;
        if (!this.thinking) {
            this.thinking = true;
            this.pathfinder.findPath(this.body.center.x, this.body.center.y, this.enemy.body.center.x, this.enemy.body.center.y, function (path) {
                _this.path = path || new Array();
                _this.thinking = false;
            });
        }
        return this.path.length == 0;
    };
    return Grobelin;
}(Phaser.Sprite));
exports.Grobelin = Grobelin;
//# sourceMappingURL=Grobelin.js.map
});

;require.register("entities/GrobelinHorde.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Grobelin_ts_1 = require("./Grobelin.ts");
var GrobelinHorde = (function (_super) {
    __extends(GrobelinHorde, _super);
    function GrobelinHorde(target, pathFinder, maxGrobelins) {
        if (maxGrobelins === void 0) { maxGrobelins = 4; }
        _super.call(this, target.game);
        this.appearsRate = 10000;
        this.nextAppearsTime = 0;
        this.pathfinder = pathFinder;
        this.target = target;
        for (var i = 0; i < maxGrobelins; ++i) {
            this.add(this.createGrobelin());
        }
    }
    GrobelinHorde.preload = function (game) {
        game.load.atlasXML('grobelin', 'sprites/lpc/characters/grobelin.png', 'sprites/lpc/characters/lpc.xml');
    };
    GrobelinHorde.prototype.update = function () {
        _super.prototype.update.call(this);
        this.appears();
    };
    GrobelinHorde.prototype.createGrobelin = function () {
        var grobelin = new Grobelin_ts_1.Grobelin(this.game, this.pathfinder);
        var game = this.game;
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
    };
    GrobelinHorde.prototype.appears = function () {
        if (this.game.time.time >= this.nextAppearsTime) {
            var grobelin = this.getFirstExists(false);
            if (grobelin) {
                var pos = this.pathfinder.randomWalkablePos();
                grobelin.appears(pos.x, pos.y, this.target);
                this.nextAppearsTime = this.game.time.time + this.appearsRate;
            }
        }
    };
    return GrobelinHorde;
}(Phaser.Group));
exports.GrobelinHorde = GrobelinHorde;
//# sourceMappingURL=GrobelinHorde.js.map
});

;require.register("entities/Hero.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MachineGun_ts_1 = require("./MachineGun.ts");
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero(game) {
        _super.call(this, game, game.world.centerX, game.world.centerY, 'tobira');
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
    Hero.preload = function (game) {
        game.load.atlasXML('tobira', 'sprites/lpc/characters/tobira.png', 'sprites/lpc/characters/lpc.xml');
        game.load.spritesheet('bullet', 'sprites/lpc/shootemup/effects01.png', 16, 16, 4);
    };
    Hero.prototype.update = function () {
        _super.prototype.update.call(this);
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
        var shootingAngle = this.controls.shootingAngle(this.x, this.y);
        if (shootingAngle != null) {
            this.weapon.fire(this.x, this.y, shootingAngle);
        }
    };
    Hero.prototype.damage = function (amount) {
        var _this = this;
        if (!this.invincible) {
            this.invincible = true;
            this.game.add.tween(this).from({ tint: 0xFF0000 }).to({ tint: 0xFFFFFF }, 1000, Phaser.Easing.Linear.None, true, 0, 4, false).onComplete.add(function () { return _this.invincible = false; });
            _super.prototype.damage.call(this, amount);
            if (!this.alive) {
                this.game.state.start('GameOver');
            }
        }
        return this;
    };
    return Hero;
}(Phaser.Sprite));
exports.Hero = Hero;
//# sourceMappingURL=Hero.js.map
});

;require.register("entities/MachineGun.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bullet_ts_1 = require("./Bullet.ts");
var MachineGun = (function (_super) {
    __extends(MachineGun, _super);
    function MachineGun(game, maxBullets) {
        if (maxBullets === void 0) { maxBullets = 64; }
        _super.call(this, game);
        this.bulletSpeed = 600;
        this.fireRate = 200;
        this.nextFireTime = 0;
        for (var i = 0; i < maxBullets; ++i) {
            this.add(this.createBullet());
        }
    }
    MachineGun.prototype.createBullet = function () {
        var bullet = new Bullet_ts_1.Bullet(this.game);
        return bullet;
    };
    MachineGun.prototype.fire = function (fromX, fromY, angle) {
        if (this.game.time.time >= this.nextFireTime) {
            var bullet = this.getFirstExists(false);
            if (bullet) {
                bullet.fire(fromX, fromY, angle, this.bulletSpeed, 0, 0);
                this.nextFireTime = this.game.time.time + this.fireRate;
            }
        }
    };
    return MachineGun;
}(Phaser.Group));
exports.MachineGun = MachineGun;
//# sourceMappingURL=MachineGun.js.map
});

;require.register("entities/features/Vulnerable.ts", function(exports, require, module) {
"use strict";
//# sourceMappingURL=Vulnerable.js.map
});

;require.register("states/AbstractState.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractState = (function (_super) {
    __extends(AbstractState, _super);
    function AbstractState() {
        _super.call(this);
    }
    AbstractState.prototype.create = function () {
        var _this = this;
        this.game.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(function () { return _this.toggleFullscreen(); });
    };
    AbstractState.prototype.toggleFullscreen = function () {
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        }
        else {
            this.game.scale.startFullScreen();
        }
    };
    return AbstractState;
}(Phaser.State));
exports.AbstractState = AbstractState;
//# sourceMappingURL=AbstractState.js.map
});

;require.register("states/GameOver.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractState_ts_1 = require("./AbstractState.ts");
var GameOver = (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        _super.call(this);
    }
    GameOver.prototype.preload = function () {
        this.game.load.image('gameover', 'gameover/gameover.png');
    };
    GameOver.prototype.create = function () {
        _super.prototype.create.call(this);
        this.game.add.image(0, 0, 'gameover');
    };
    return GameOver;
}(AbstractState_ts_1.AbstractState));
exports.GameOver = GameOver;
//# sourceMappingURL=GameOver.js.map
});

;require.register("states/Intro.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractState_ts_1 = require("./AbstractState.ts");
var Intro = (function (_super) {
    __extends(Intro, _super);
    function Intro() {
        _super.call(this);
    }
    Intro.prototype.preload = function () {
        this.game.load.video('intro', 'intro/intro.webm');
    };
    Intro.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        var video = this.game.add.video('intro');
        video.play();
        video.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5);
        video.onComplete.add(function () { return _this.game.state.start('Title'); });
    };
    return Intro;
}(AbstractState_ts_1.AbstractState));
exports.Intro = Intro;
//# sourceMappingURL=Intro.js.map
});

;require.register("states/Level.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractState_ts_1 = require("./AbstractState.ts");
var Hero_ts_1 = require("../entities/Hero.ts");
var BirdFlock_ts_1 = require("../entities/BirdFlock.ts");
var GrobelinHorde_ts_1 = require("../entities/GrobelinHorde.ts");
var Pathfinder_ts_1 = require("../utils/Pathfinder.ts");
var Level = (function (_super) {
    __extends(Level, _super);
    function Level() {
        _super.call(this);
    }
    Level.prototype.preload = function () {
        BirdFlock_ts_1.BirdFlock.preload(this.game);
        GrobelinHorde_ts_1.GrobelinHorde.preload(this.game);
        Hero_ts_1.Hero.preload(this.game);
        this.game.load.tilemap('map', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('terrains', 'sprites/lpc/terrains/terrains.png');
        this.game.load.image('cottage', 'sprites/lpc/thatched-roof-cottage/cottage.png');
        this.game.load.image('thatched-roof', 'sprites/lpc/thatched-roof-cottage/thatched-roof.png');
        this.game.load.image('doors', 'sprites/lpc/windows-doors/doors.png');
        this.game.load.image('windows', 'sprites/lpc/windows-doors/windows.png');
        this.game.load.image('obj_misk_atlas', 'sprites/lpc/tile-atlas2/obj_misk_atlas.png');
    };
    Level.prototype.create = function () {
        _super.prototype.create.call(this);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var map = this.game.add.tilemap('map');
        map.addTilesetImage('terrains');
        map.addTilesetImage('cottage');
        map.addTilesetImage('thatched-roof');
        map.addTilesetImage('doors');
        map.addTilesetImage('windows');
        map.addTilesetImage('obj_misk_atlas');
        var layer = map.createLayer('grounds');
        map.createLayer('plants');
        map.createLayer('walls');
        map.createLayer('bridges');
        map.createLayer('doors_and_windows');
        map.createLayer('roofs');
        layer.resizeWorld();
        this.collisionSprites = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        ;
        for (var _i = 0, _a = map.objects['collision']; _i < _a.length; _i++) {
            var o = _a[_i];
            if (o.rectangle) {
                var sprite = this.game.add.sprite(o.x, o.y);
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
    };
    Level.prototype.update = function () {
        this.pathfinder.update();
        this.hero.update();
        this.game.physics.arcade.collide(this.hero, this.collisionSprites);
        this.resolveWeaponsEffects();
    };
    Level.prototype.resolveWeaponsEffects = function () {
        var _this = this;
        this.game.physics.arcade.overlap(this.birdFlock, this.hero.weapon, function (bird, bullet) {
            bird.kill();
            bullet.kill();
        });
        this.game.physics.arcade.overlap(this.hero, this.birdFlock, function (hero, bird) {
            bird.kill();
            _this.hero.damage(1);
        });
        for (var _i = 0, _a = this.hero.weapon.children; _i < _a.length; _i++) {
            var b = _a[_i];
            var bullet = b;
            if (bullet.exists) {
                var bulletRect = new Phaser.Rectangle(bullet.x, bullet.y, bullet.width, bullet.height);
                grobelins_loop: for (var _b = 0, _c = this.grobelinHorde.children; _b < _c.length; _b++) {
                    var c = _c[_b];
                    var grobelin = c;
                    if (grobelin.exists) {
                        for (var _d = 0, _e = grobelin.getVulnerableRectangles(); _d < _e.length; _d++) {
                            var v = _e[_d];
                            if (bulletRect.intersects(v, 1)) {
                                bullet.kill();
                                grobelin.damage(1);
                                break grobelins_loop;
                            }
                        }
                    }
                }
            }
        }
    };
    Level.prototype.render = function () {
    };
    return Level;
}(AbstractState_ts_1.AbstractState));
exports.Level = Level;
//# sourceMappingURL=Level.js.map
});

;require.register("states/Title.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractState_ts_1 = require("./AbstractState.ts");
var Title = (function (_super) {
    __extends(Title, _super);
    function Title() {
        _super.call(this);
    }
    Title.prototype.preload = function () {
        this.game.load.image('logo', 'title/logo.png');
    };
    Title.prototype.create = function () {
        _super.prototype.create.call(this);
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    };
    return Title;
}(AbstractState_ts_1.AbstractState));
exports.Title = Title;
//# sourceMappingURL=Title.js.map
});

;require.register("utils/Controls.ts", function(exports, require, module) {
"use strict";
var Controls = (function () {
    function Controls(game) {
        this.game = game;
        game.input.gamepad.start();
        this.kb = game.input.keyboard;
        this.pad = game.input.gamepad.pad1;
    }
    Controls.prototype.shootingAngle = function (shooterX, shooterY) {
        return this.firstNonNull(this.shootingAngleFromPointer(shooterX, shooterY), this.shootingAngleFromPad(), this.shootingFromKeyboard());
    };
    Controls.prototype.firstNonNull = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i - 0] = arguments[_i];
        }
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var value = values_1[_a];
            if (value != null) {
                return value;
            }
        }
        return null;
    };
    Controls.prototype.shootingAngleFromPointer = function (shooterX, shooterY) {
        var pointer = this.game.input.activePointer;
        if (pointer.isDown) {
            return Phaser.Math.angleBetween(shooterX, shooterY, pointer.worldX, pointer.worldY);
        }
        else {
            return this.shootingFromKeyboard();
        }
    };
    Controls.prototype.shootingAngleFromPad = function () {
        var dx = this.pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
        var dy = this.pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);
        dx = Math.abs(dx) <= this.pad.deadZone ? 0 : dx;
        dy = Math.abs(dy) <= this.pad.deadZone ? 0 : dy;
        if (dx != 0 || dy != 0) {
            return Phaser.Math.angleBetween(0, 0, dx, dy);
        }
        else {
            return null;
        }
    };
    Controls.prototype.shootingFromKeyboard = function () {
        var dx = 0;
        if (this.kb.isDown(Phaser.KeyCode.J)) {
            dx = -1;
        }
        else if (this.kb.isDown(Phaser.KeyCode.L)) {
            dx = 1;
        }
        var dy = 0;
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
    };
    Controls.prototype.isGoingUp = function () {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
            || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -this.pad.deadZone
            || this.kb.isDown(Phaser.KeyCode.UP)
            || this.kb.isDown(Phaser.KeyCode.Z);
    };
    Controls.prototype.isGoingDown = function () {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
            || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > this.pad.deadZone
            || this.kb.isDown(Phaser.KeyCode.DOWN)
            || this.kb.isDown(Phaser.KeyCode.S);
    };
    Controls.prototype.isGoingLeft = function () {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
            || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -this.pad.deadZone
            || this.kb.isDown(Phaser.KeyCode.LEFT)
            || this.kb.isDown(Phaser.KeyCode.Q);
    };
    Controls.prototype.isGoingRight = function () {
        return this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)
            || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > this.pad.deadZone
            || this.kb.isDown(Phaser.KeyCode.RIGHT)
            || this.kb.isDown(Phaser.KeyCode.D);
    };
    return Controls;
}());
exports.Controls = Controls;
//# sourceMappingURL=Controls.js.map
});

;require.register("utils/Pathfinder.ts", function(exports, require, module) {
"use strict";
var EasyStar = require('easystarjs');
var Pathfinder = (function () {
    function Pathfinder(map) {
        this.map = map;
        var pathfindLayer = map.getLayerIndex('pathfind');
        var grid = new Array();
        for (var row = 0; row < map.height; ++row) {
            var gridRow = new Array(map.width);
            for (var column = 0; column < map.width; ++column) {
                var tile = map.getTile(column, row, pathfindLayer);
                gridRow[column] = this.isTileWalkable(tile) ? 1 : 0;
            }
            grid[row] = gridRow;
        }
        this.easystar = new EasyStar.js();
        this.easystar.setGrid(grid);
        this.easystar.enableDiagonals();
        this.easystar.setAcceptableTiles([1]);
    }
    Pathfinder.prototype.randomWalkablePos = function () {
        var pathfindLayer = this.map.getLayerIndex('pathfind');
        var rnd = this.map.game.rnd;
        var maxChances = this.map.width * this.map.height;
        for (var i = 0; i < maxChances; ++i) {
            var x = rnd.integerInRange(0, this.map.width - 1);
            var y = rnd.integerInRange(0, this.map.height - 1);
            var tile = this.map.getTile(x, y, pathfindLayer);
            if (this.isTileWalkable(tile)) {
                return new Phaser.Point(tile.worldX, tile.worldY);
            }
        }
        return null;
    };
    Pathfinder.prototype.isTileWalkable = function (tile) {
        return tile && tile.properties['walkable'] == 1;
    };
    Pathfinder.prototype.findPath = function (startX, startY, endX, endY, callback) {
        var _this = this;
        var tileStart = this.map.getTileWorldXY(startX, startY);
        var tileEnd = this.findNearestWalkableTile(endX, endY);
        if (tileEnd) {
            this.easystar.findPath(tileStart.x, tileStart.y, tileEnd.x, tileEnd.y, function (path) {
                var worldPath;
                if (path && path.length > 1) {
                    worldPath = new Array(path.length - 1);
                    for (var i = 1; i < path.length; ++i) {
                        var tile = _this.map.getTile(path[i].x, path[i].y);
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
    };
    Pathfinder.prototype.findNearestWalkableTile = function (endX, endY) {
        var pathfindLayer = this.map.getLayerIndex('pathfind');
        var tile = this.map.getTileWorldXY(endX, endY, this.map.tileWidth, this.map.tileHeight, pathfindLayer);
        if (this.isTileWalkable(tile)) {
            return tile;
        }
        var minTile = null;
        var minTileDistance = null;
        for (var dx = -10; dx < 10; ++dx) {
            for (var dy = -10; dy < 10; ++dy) {
                var t = this.map.getTile(tile.x + dx, tile.y + dy, pathfindLayer);
                if (this.isTileWalkable(t)) {
                    var tileDistance = Phaser.Math.distanceSq(0, 0, dx, dy);
                    if (!minTileDistance || tileDistance < minTileDistance) {
                        minTileDistance = tileDistance;
                        minTile = t;
                    }
                }
            }
        }
        return minTile;
    };
    Pathfinder.prototype.update = function () {
        this.easystar.calculate();
    };
    return Pathfinder;
}());
exports.Pathfinder = Pathfinder;
//# sourceMappingURL=Pathfinder.js.map
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('ShmuprpgApp');
//# sourceMappingURL=app.js.map