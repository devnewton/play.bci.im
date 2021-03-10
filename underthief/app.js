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
require.register("UnderthiefApp.ts", function(exports, require, module) {
"use strict";
const UnderthiefGame_1 = require("./UnderthiefGame");
new UnderthiefGame_1.UnderthiefGame();


});

require.register("UnderthiefGame.ts", function(exports, require, module) {
"use strict";
const Intro_1 = require("./states/Intro");
const Help1_1 = require("./states/Help1");
const Help2_1 = require("./states/Help2");
const Title_1 = require("./states/Title");
const Options_1 = require("./states/Options");
const KeyboardOptions_1 = require("./states/KeyboardOptions");
const KeyboardOptionsBindKey_1 = require("./states/KeyboardOptionsBindKey");
const GamepadOptions_1 = require("./states/GamepadOptions");
const GamepadOptionsLayout_1 = require("./states/GamepadOptionsLayout");
const GamepadOptionsBindAxisOrButton_1 = require("./states/GamepadOptionsBindAxisOrButton");
const TeamSelectScreen_1 = require("./states/TeamSelectScreen");
const Level_1 = require("./states/Level");
const Controls_1 = require("./utils/Controls");
class UnderthiefGame extends Phaser.Game {
    constructor() {
        super(1280, 720, Phaser.CANVAS, 'game', {
            preload: () => this.preloadGame(),
            create: () => this.createGame()
        });
        this.state.add('Intro', Intro_1.Intro);
        this.state.add('Title', Title_1.Title);
        this.state.add('Help1', Help1_1.Help1);
        this.state.add('Help2', Help2_1.Help2);
        this.state.add('Options', Options_1.Options);
        this.state.add('GamepadOptionsLayout', GamepadOptionsLayout_1.GamepadOptionsLayout);
        this.state.add('GamepadOptionsBindAxisOrButton', GamepadOptionsBindAxisOrButton_1.GamepadOptionsBindAxisOrButton);
        this.state.add('KeyboardOptions', KeyboardOptions_1.KeyboardOptions);
        this.state.add('KeyboardOptionsBindKey', KeyboardOptionsBindKey_1.KeyboardOptionsBindKey);
        this.state.add('GamepadOptions', GamepadOptions_1.GamepadOptions);
        this.state.add('TeamSelectScreen', TeamSelectScreen_1.TeamSelectScreen);
        this.state.add('Level', Level_1.Level);
    }
    preloadGame() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }
    createGame() {
        this.controllers = new Controls_1.Controllers(this);
        this.state.start('Intro');
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
exports.UnderthiefGame = UnderthiefGame;


});

require.register("entities/EmotionSprite.ts", function(exports, require, module) {
"use strict";
class EmotionSprite extends Phaser.Sprite {
    constructor(game, key, emotion) {
        super(game, game.world.centerX, game.world.centerY, 'emotions');
        this.health = 3;
        const anim = key + "." + emotion;
        game.addSpriteAnimation(this, anim, emotion === 'sad' ? 10 : 4);
        this.play(anim, 4, true);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);
    }
    static preload(game) {
        game.load.atlasXML('emotions', 'sprites/opengameart/emotions.png', 'sprites/opengameart/emotions.xml');
    }
}
exports.EmotionSprite = EmotionSprite;


});

require.register("entities/Player.ts", function(exports, require, module) {
"use strict";
class PlayerDashState {
    constructor(player) {
        this.dashSteps = 3;
        if (Math.abs(player.body.velocity.y) > Math.abs(player.body.velocity.x)) {
            if (player.body.velocity.y < 0) {
                player.play("player.dash.back", 8, false);
            }
            else {
                player.play("player.dash.front", 8, false);
            }
        }
        else {
            if (player.body.velocity.x < 0) {
                player.play("player.dash.left", 8, false);
            }
            else {
                player.play("player.dash.right", 8, false);
            }
        }
    }
    update(player) {
        --this.dashSteps;
        if (this.dashSteps <= 0) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            if (this.dashSteps <= -10) {
                player.dashCoolDown = 30;
                player.state = Player.RUNNING_STATE;
            }
        }
    }
}
class PlayerHammeredState {
    constructor() {
        this.steps = 60;
    }
    update(player) {
        this.steps--;
        if (this.steps <= 0) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.state = Player.RUNNING_STATE;
        }
        else {
            player.play("player.hammered", 8, false);
        }
    }
}
class PlayerRunningState {
    update(player) {
        player.hammerTime = false;
        --player.dashCoolDown;
        if (!player.oldPos.equals(player.position)) {
            player.oldPos = player.position.clone();
        }
        if (player.controls) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            let dashAngle = player.controls.dashingAngle(player.body.center);
            if (player.dashCoolDown < 0 && null != dashAngle) {
                player.dash(dashAngle);
            }
            else if (player.controls.isHammerTime()) {
                player.hammerTime = true;
                player.play("player.hammertime", 8, false);
            }
            else {
                if (player.controls.isGoingLeft()) {
                    player.body.velocity.x = -300;
                }
                else if (player.controls.isGoingRight()) {
                    player.body.velocity.x = 300;
                }
                if (player.controls.isGoingUp()) {
                    player.body.velocity.y = -300;
                }
                else if (player.controls.isGoingDown()) {
                    player.body.velocity.y = 300;
                }
                if (player.body.velocity.y < 0) {
                    player.play("player.walk.back", 8, false);
                }
                else if (player.body.velocity.y > 0) {
                    player.play("player.walk.front", 8, false);
                }
                else if (player.body.velocity.x < 0) {
                    player.play("player.walk.left", 8, false);
                }
                else if (player.body.velocity.x > 0) {
                    player.play("player.walk.right", 8, false);
                }
                else {
                    player.play("player.wait", 8, false);
                }
            }
        }
    }
}
class Player extends Phaser.Sprite {
    constructor(game, key) {
        super(game, game.world.centerX, game.world.centerY, key);
        this.hammerTime = false;
        this.dashCoolDown = 0;
        this.cpuData = {};
        this.oldPos = new Phaser.Point(0, 0);
        this.health = 3;
        game.addSpriteAnimation(this, 'player.walk.back', 4);
        game.addSpriteAnimation(this, 'player.walk.front', 4);
        game.addSpriteAnimation(this, 'player.walk.left', 4);
        game.addSpriteAnimation(this, 'player.walk.right', 4);
        game.addSpriteAnimation(this, 'player.dash.back', 1);
        game.addSpriteAnimation(this, 'player.dash.front', 1);
        game.addSpriteAnimation(this, 'player.dash.left', 1);
        game.addSpriteAnimation(this, 'player.dash.right', 1);
        game.addSpriteAnimation(this, 'player.hammertime', 4);
        game.addSpriteAnimation(this, 'player.hammered', 4);
        game.addSpriteAnimation(this, 'player.wait', 1);
        this.play("player.wait", 8, false);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(24);
        this.body.collideWorldBounds = true;
        this.game.add.existing(this);
        this.state = Player.RUNNING_STATE;
    }
    static preload(game) {
        game.load.atlasXML('betty', 'sprites/opengameart/betty.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('betty2', 'sprites/opengameart/betty2.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('george', 'sprites/opengameart/george.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('george2', 'sprites/opengameart/george2.png', 'sprites/opengameart/player.xml');
    }
    update() {
        super.update();
        this.state.update(this);
    }
    dash(angle) {
        if (!(this.state instanceof PlayerDashState)) {
            this.game.physics.arcade.velocityFromRotation(angle, 1200, this.body.velocity);
            this.state = new PlayerDashState(this);
        }
    }
    hammer(other) {
        if (!(other.state instanceof PlayerHammeredState)) {
            other.state = new PlayerHammeredState();
            let angle = Phaser.Math.angleBetweenPoints(this.body.center, other.body.center);
            this.game.physics.arcade.velocityFromRotation(angle, 300, other.body.velocity);
        }
    }
}
Player.RUNNING_STATE = new PlayerRunningState();
exports.Player = Player;


});

require.register("entities/Team.ts", function(exports, require, module) {
"use strict";
const CollisionResolver_1 = require("../utils/CollisionResolver");
class Team extends Phaser.Group {
    constructor(game) {
        super(game);
    }
}
exports.Team = Team;
class TeamCollisionResolver extends CollisionResolver_1.CollisionResolver {
    constructor(game) {
        super(game);
    }
    onCollide(sa, sb) {
        let a = sa;
        let b = sb;
        if (a.hammerTime) {
            a.hammer(b);
        }
        if (b.hammerTime) {
            b.hammer(a);
        }
    }
}
exports.TeamCollisionResolver = TeamCollisionResolver;


});

require.register("entities/Underwear.ts", function(exports, require, module) {
"use strict";
const CollisionResolver_1 = require("../utils/CollisionResolver");
class Underwear extends Phaser.Sprite {
    constructor(game, key) {
        super(game, game.world.centerX, game.world.centerY, key);
        this.health = 3;
        game.addSpriteAnimation(this, 'underwear.moving', 1);
        this.play("underwear.moving", 8, false);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(32);
        this.body.collideWorldBounds = true;
        this.body.bounce.x = 0.7;
        this.body.bounce.y = 0.7;
    }
    static preload(game) {
        game.load.atlasXML('bra', 'sprites/devnewton/bra.png', 'sprites/devnewton/underwear.xml');
        game.load.atlasXML('boxers', 'sprites/devnewton/boxers.png', 'sprites/devnewton/underwear.xml');
    }
}
exports.Underwear = Underwear;
class UnderwearCapturePoint extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y);
        this.containsUnderwear = false;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
}
exports.UnderwearCapturePoint = UnderwearCapturePoint;
class UnderwearCapturePoints extends Phaser.Group {
    constructor(game, map, key) {
        super(game);
        for (let o of map.objects[key + '-capture-points']) {
            if (o.rectangle) {
                const capturePoint = new UnderwearCapturePoint(this.game, o.x, o.y);
                capturePoint.width = o.width;
                capturePoint.height = o.height;
                this.add(capturePoint);
            }
        }
    }
    areAllCaptured() {
        for (let c in this.children) {
            let child = this.children[c];
            if (!child.containsUnderwear) {
                return false;
            }
        }
        return true;
    }
    countCaptured() {
        let count = 0;
        for (let c in this.children) {
            let child = this.children[c];
            if (child.containsUnderwear) {
                ++count;
            }
        }
        return count;
    }
}
exports.UnderwearCapturePoints = UnderwearCapturePoints;
class UnderwearCaptureCollisionResolver extends CollisionResolver_1.CollisionResolver {
    constructor(game) {
        super(game);
    }
    checkCollision(sa, sb) {
        let a = sa;
        let b = sb;
        return !b.containsUnderwear && a.exists && b.exists && b.body.hitTest(a.centerX, a.centerY);
    }
    onCollide(sa, sb) {
        let a = sa;
        let b = sb;
        a.body.enable = false;
        a.tint = 0xAADDAA;
        b.containsUnderwear = true;
    }
}
exports.UnderwearCaptureCollisionResolver = UnderwearCaptureCollisionResolver;


});

require.register("ia/CPU.ts", function(exports, require, module) {
"use strict";
var CPUAttitude;
(function (CPUAttitude) {
    CPUAttitude[CPUAttitude["OFFENSIVE"] = 1] = "OFFENSIVE";
    CPUAttitude[CPUAttitude["DEFENSIVE"] = 2] = "DEFENSIVE";
})(CPUAttitude || (CPUAttitude = {}));
class CPU {
    constructor() {
        this.lastCapturedCount = 0;
    }
    think() {
        this.controls.reset();
        if (!this.waiting() && !this.hammering()) {
            switch (this.chooseBehavior()) {
                case CPUAttitude.OFFENSIVE:
                    this.attack();
                    break;
                case CPUAttitude.DEFENSIVE:
                    this.defend();
                    break;
            }
        }
    }
    chooseBehavior() {
        if (!this.me.cpuData.attitude) {
            let nbOffensive = 0;
            let nbDefensive = 0;
            this.buddies.forEachAlive((player) => {
                switch (player.cpuData.attitude) {
                    case CPUAttitude.OFFENSIVE:
                        ++nbOffensive;
                        break;
                    case CPUAttitude.DEFENSIVE:
                        ++nbDefensive;
                        break;
                }
            }, null);
            if (nbDefensive < nbOffensive) {
                this.me.cpuData.attitude = this.me.game.rnd.weightedPick([CPUAttitude.OFFENSIVE, CPUAttitude.DEFENSIVE]);
            }
            else if (nbDefensive > nbOffensive) {
                this.me.cpuData.attitude = CPUAttitude.OFFENSIVE;
            }
            else {
                this.me.cpuData.attitude = this.me.game.rnd.weightedPick([CPUAttitude.OFFENSIVE, CPUAttitude.DEFENSIVE]);
            }
        }
        return this.me.cpuData.attitude;
    }
    attack() {
        const capturedCount = this.capturePoints.countCaptured();
        if (this.lastCapturedCount !== capturedCount) {
            this.lastCapturedCount = capturedCount;
            this.me.cpuData.attitude = null;
        }
        else {
            let underwear = this.underwears.getClosestTo(this.me, u => u.body.enable);
            let capturePoint = this.capturePoints.getClosestTo(this.me, u => u.body.enable);
            if (underwear && capturePoint) {
                if (this.me.game.physics.arcade.overlap(this.me, this.underwears)) {
                    this.waitUntil = this.me.game.time.time + 500;
                }
                else {
                    this.pushUnderwear(underwear, capturePoint);
                }
            }
        }
    }
    defend() {
        let opponent = this.opponents.getClosestTo(this.me);
        if (opponent) {
            if (this.me.game.physics.arcade.overlap(this.me, this.opponents)) {
                this.hammerUntil = this.me.game.time.time + 500;
                this.me.cpuData.attitude = null;
            }
            else {
                this.moveToXY(opponent.body.x, opponent.body.y);
            }
        }
    }
    pushUnderwear(underwear, capturePoint) {
        if (underwear.body.blocked.up && underwear.body.blocked.left) {
            this.unblockTopLeftUnderwear(underwear);
        }
        else if (underwear.body.blocked.up && underwear.body.blocked.right) {
            this.unblockTopRightUnderwear(underwear);
        }
        if (underwear.body.blocked.down && underwear.body.blocked.left) {
            this.unblockBottomLeftUnderwear(underwear);
        }
        else if (underwear.body.blocked.down && underwear.body.blocked.right) {
            this.unblockBottomRightUnderwear(underwear);
        }
        else {
            this.pushUnderwearToCapturePoint(underwear, capturePoint);
        }
    }
    pushUnderwearToCapturePoint(underwear, capturePoint) {
        let ucVector = new Phaser.Point(underwear.body.x - capturePoint.body.x, underwear.body.y - capturePoint.body.y);
        ucVector.setMagnitude(underwear.body.radius).add(underwear.body.x, underwear.body.y);
        this.moveToXY(ucVector.x, ucVector.y);
    }
    unblockTopLeftUnderwear(underwear) {
        this.moveToXY(underwear.left, underwear.top);
    }
    unblockTopRightUnderwear(underwear) {
        this.moveToXY(underwear.right, underwear.top);
    }
    unblockBottomLeftUnderwear(underwear) {
        this.moveToXY(underwear.left, underwear.bottom);
    }
    unblockBottomRightUnderwear(underwear) {
        this.moveToXY(underwear.right, underwear.bottom);
    }
    waiting() {
        if (this.waitUntil) {
            if (this.me.game.time.time < this.waitUntil) {
                return true;
            }
            else {
                this.waitUntil = null;
            }
        }
        return false;
    }
    hammering() {
        if (this.hammerUntil) {
            if (this.me.game.time.time < this.hammerUntil) {
                this.controls.hammerTime = true;
                return true;
            }
            else {
                this.waitUntil = this.me.game.time.time + 500;
                this.hammerUntil = null;
            }
        }
        return false;
    }
    moveToXY(x, y) {
        if (this.me.body.x < x) {
            this.controls.goingRight = true;
        }
        else if (this.me.body.x > x) {
            this.controls.goingLeft = true;
        }
        if (this.me.body.y < y) {
            this.controls.goingDown = true;
        }
        else if (this.me.body.y > y) {
            this.controls.goingUp = true;
        }
    }
}
exports.CPU = CPU;


});

require.register("states/AbstractState.ts", function(exports, require, module) {
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


});

require.register("states/GamepadOptions.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
const MenuButton_1 = require("../ui/MenuButton");
const GamepadUtils_1 = require("../utils/GamepadUtils");
class GamepadOptions extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        Menu_1.Menu.preload(this.game);
    }
    create() {
        super.create();
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad', { font: "42px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);
        let subtitle = this.game.add.text(0, 0, 'Move stick or press button to show gamepad number', { font: "32px monospace", fill: 'white' });
        subtitle.y = this.game.world.height - subtitle.height;
        const menu = new Menu_1.Menu(this.game).disableGamepadCursor();
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad1, "Gamepad 1", 200, 100, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 1);
        }));
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad2, "Gamepad 2", 200, 200, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 2);
        }));
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad3, "Gamepad 3", 200, 300, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 3);
        }));
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad4, "Gamepad 4", 200, 400, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 4);
        }));
        menu.button("Back", 200, 550, () => this.game.state.start('Options'));
    }
}
exports.GamepadOptions = GamepadOptions;
class GamepadMenuButton extends MenuButton_1.MenuButton {
    constructor(pad, label, x, y, callback) {
        super(pad.game, label, x, y, callback);
        this.pad = pad;
    }
    update() {
        super.update();
        if (this.isPadActive()) {
            this.labelText.tint = GamepadUtils_1.GamepadUtils.gamepadColor(this.pad);
        }
        else {
            this.labelText.tint = 0xFFFFFF;
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


});

;require.register("states/GamepadOptionsBindAxisOrButton.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
const MenuMiniButton_1 = require("../ui/MenuMiniButton");
const GamepadUtils_1 = require("../utils/GamepadUtils");
class GamepadOptionsBindAxisOrButton extends AbstractState_1.AbstractState {
    constructor() {
        super();
        this.bindingsDescription = [
            { label: 'Pull move X axis', localStorageKey: 'moveXAxis' },
            { label: 'Pull move Y axis', localStorageKey: 'moveYAxis' },
            { label: 'Press hammer button', localStorageKey: 'hammerButton' },
            { label: 'Press dash button', localStorageKey: 'dashButton' },
            { label: 'Press menu button', localStorageKey: 'menuButton' }
        ];
        this.currentBinding = 0;
        this.padIndex = 1;
        this.bindings = {};
    }
    preload() {
        Menu_1.Menu.preload(this.game);
        MenuMiniButton_1.MenuMiniButton.preload(this.game);
    }
    init(padIndex, binding = 0, bindings) {
        this.bindings = bindings || {};
        this.pad = GamepadUtils_1.GamepadUtils.gamepadByIndex(this.game, padIndex);
        if (binding >= this.bindingsDescription.length) {
            this.currentBinding = 0;
            localStorage.setItem('gamepad.' + GamepadUtils_1.GamepadUtils.gamepadId(this.pad) + '.layout', JSON.stringify(this.bindings));
            this.game.controllers.updatePadLayout();
            this.game.state.start('GamepadOptions');
        }
        else {
            this.currentBinding = binding;
        }
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindingsDescription[this.currentBinding].label, { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        const menu = new Menu_1.Menu(this.game).disableGamepadCursor();
        menu.button("Back", 200, 600, () => this.game.state.start('GamepadOptions'));
        this.createAxisButtons();
        this.createButtonsButtons();
    }
    createAxisButtons() {
        this.axisButtons = this.game.add.group();
        this.axisButtons.visible = false;
        const nbButtonsPerColumn = Math.ceil(Math.sqrt(GamepadUtils_1.GamepadUtils.NB_AXIS));
        for (let y = 0, axisCode = 0; axisCode < GamepadUtils_1.GamepadUtils.NB_AXIS; ++y) {
            for (let x = 0; x < nbButtonsPerColumn; ++x) {
                const buttonAxisCode = axisCode++;
                let miniButton = new AxisButton(this.game, this.pad, buttonAxisCode, 250 + x * 200, 100 + y * 120, () => this.bindAxis(buttonAxisCode));
                this.axisButtons.add(miniButton);
            }
        }
    }
    createButtonsButtons() {
        this.buttonsButtons = this.game.add.group();
        this.buttonsButtons.visible = false;
        const nbButtonsPerColumn = Math.ceil(Math.sqrt(GamepadUtils_1.GamepadUtils.NB_BUTTONS));
        for (let y = 0, buttonCode = 0; buttonCode < GamepadUtils_1.GamepadUtils.NB_BUTTONS; ++y) {
            for (let x = 0; x < nbButtonsPerColumn; ++x) {
                const buttonButtonCode = buttonCode++;
                let miniButton = new ButtonButton(this.game, this.pad, buttonButtonCode, 250 + x * 200, 100 + y * 120, () => this.bindButton(buttonButtonCode));
                this.buttonsButtons.add(miniButton);
            }
        }
    }
    update() {
        super.update();
        if (this.bindingsDescription[this.currentBinding].localStorageKey.match(/axis/gi)) {
            this.axisButtons.visible = true;
            this.buttonsButtons.visible = false;
        }
        else {
            this.axisButtons.visible = false;
            this.buttonsButtons.visible = true;
        }
    }
    bindAxis(axisCode) {
        this.bindings[this.bindingsDescription[this.currentBinding].localStorageKey] = axisCode;
        this.game.state.start('GamepadOptionsBindAxisOrButton', true, false, this.padIndex, this.currentBinding + 1, this.bindings);
    }
    bindButton(buttonCode) {
        this.bindings[this.bindingsDescription[this.currentBinding].localStorageKey] = buttonCode;
        this.game.state.start('GamepadOptionsBindAxisOrButton', true, false, this.padIndex, this.currentBinding + 1, this.bindings);
    }
}
exports.GamepadOptionsBindAxisOrButton = GamepadOptionsBindAxisOrButton;
class AxisButton extends MenuMiniButton_1.MenuMiniButton {
    constructor(game, pad, axisCode, x, y, callback) {
        super(game, axisCode.toString(), x, y, callback);
        this.pad = pad;
        this.axisCode = axisCode;
    }
    update() {
        super.update();
        if (Math.abs(this.pad.axis(this.axisCode)) > this.pad.deadZone) {
            this.labelText.tint = GamepadUtils_1.GamepadUtils.gamepadColor(this.pad);
        }
        else {
            this.labelText.tint = 0xFFFFFF;
        }
    }
}
class ButtonButton extends MenuMiniButton_1.MenuMiniButton {
    constructor(game, pad, buttonCode, x, y, callback) {
        super(game, buttonCode.toString(), x, y, callback);
        this.pad = pad;
        this.buttonCode = buttonCode;
    }
    update() {
        super.update();
        if (this.pad.isDown(this.buttonCode)) {
            this.labelText.tint = GamepadUtils_1.GamepadUtils.gamepadColor(this.pad);
        }
        else {
            this.labelText.tint = 0xFFFFFF;
        }
    }
}


});

;require.register("states/GamepadOptionsLayout.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
const GamepadUtils_1 = require('../utils/GamepadUtils');
class GamepadOptionsLayout extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        Menu_1.Menu.preload(this.game);
    }
    init(padIndex) {
        this.padIndex = padIndex || 1;
    }
    create() {
        super.create();
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad layout', { font: "42px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);
        const menu = new Menu_1.Menu(this.game).disableGamepadCursor();
        menu.button("Xbox", 200, 200, () => {
            localStorage.setItem('gamepad.' + GamepadUtils_1.GamepadUtils.gamepadId(GamepadUtils_1.GamepadUtils.gamepadByIndex(this.game, this.padIndex)) + '.layout', 'xbox');
            this.game.state.start('Options');
        });
        menu.button("Custom", 200, 300, () => {
            this.game.state.start('GamepadOptionsBindAxisOrButton', true, false, this.padIndex);
        });
        menu.button("Back", 200, 500, () => this.game.state.start('Options'));
    }
}
exports.GamepadOptionsLayout = GamepadOptionsLayout;


});

require.register("states/Help1.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
class Help1 extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.image('help1', 'help/help1.png');
        Menu_1.Menu.preload(this.game);
    }
    create() {
        super.create();
        this.game.add.image(0, 0, 'help1');
        const menu = new Menu_1.Menu(this.game);
        menu.button("Continue", 200, 610, () => this.game.state.start('Help2'));
    }
}
exports.Help1 = Help1;


});

require.register("states/Help2.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
class Help2 extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.image('help2', 'help/help2.png');
        Menu_1.Menu.preload(this.game);
    }
    create() {
        super.create();
        this.game.add.image(0, 0, 'help2');
        const menu = new Menu_1.Menu(this.game);
        menu.button("Continue", 200, 610, () => this.game.state.start('Title'));
    }
}
exports.Help2 = Help2;


});

require.register("states/Intro.ts", function(exports, require, module) {
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
        this.video = this.game.add.video('intro');
        this.video.play();
        this.video.addToWorld(this.game.world.centerX, this.game.world.centerY, 0.5, 0.5);
        this.video.onComplete.add(() => this.game.state.start('Title'));
        this.lastKey = this.game.input.keyboard.lastKey;
        this.game.input.onTap.add(() => {
            this.gotoTitle();
        });
    }
    update() {
        if (this.lastKey != this.game.input.keyboard.lastKey) {
            this.gotoTitle();
            return;
        }
        for (let b = 0; b < 16; ++b) {
            if (this.input.gamepad.isDown(b)) {
                this.gotoTitle();
                return;
            }
        }
    }
    gotoTitle() {
        this.video.stop();
        this.game.state.start('Title');
    }
}
exports.Intro = Intro;


});

require.register("states/KeyboardOptions.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
class KeyboardOptions extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        Menu_1.Menu.preload(this.game);
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Choose keyboard layout', { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        const menu = new Menu_1.Menu(this.game).disableKeyboardCursor();
        menu.button("Azerty zsqd jk", 200, 100, () => {
            localStorage.setItem('keyboard.layout', 'azerty');
            this.game.controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('Options');
        });
        menu.button("Qwerty wsad jk", 200, 200, () => {
            localStorage.setItem('keyboard.layout', 'qwerty');
            this.game.controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('Options');
        });
        menu.button("⬆⬇⬅➡ shift ctrl", 200, 300, () => {
            localStorage.setItem('keyboard.layout', 'other');
            this.game.controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('Options');
        });
        menu.button("Custom", 200, 400, () => {
            this.game.state.start('KeyboardOptionsBindKey', true, false);
        });
        menu.button("Back", 200, 600, () => this.game.state.start('Options'));
    }
}
exports.KeyboardOptions = KeyboardOptions;


});

require.register("states/KeyboardOptionsBindKey.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
class KeyboardOptionsBindKey extends AbstractState_1.AbstractState {
    constructor() {
        super();
        this.bindingsDescription = [
            { label: 'Press move up key', localStorageKey: 'moveUp' },
            { label: 'Press move down key', localStorageKey: 'moveDown' },
            { label: 'Press move left key', localStorageKey: 'moveLeft' },
            { label: 'Press move right key', localStorageKey: 'moveRight' },
            { label: 'Press hammer key', localStorageKey: 'hammer' },
            { label: 'Press dash key', localStorageKey: 'dash' },
            { label: 'Press menu key', localStorageKey: 'menu' }
        ];
        this.currentBinding = 0;
        this.bindings = {};
    }
    preload() {
        Menu_1.Menu.preload(this.game);
    }
    init(binding = 0, bindings) {
        this.bindings = bindings || {};
        if (binding >= this.bindingsDescription.length) {
            this.currentBinding = 0;
            localStorage.setItem('keyboard.layout', JSON.stringify(this.bindings));
            this.game.controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('KeyboardOptions');
        }
        else {
            this.currentBinding = binding;
        }
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindingsDescription[this.currentBinding].label, { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        const menu = new Menu_1.Menu(this.game).disableKeyboardCursor();
        menu.button("Back", 200, 600, () => this.game.state.start('KeyboardOptions'));
    }
    update() {
        for (var k in Phaser.KeyCode) {
            let keycode = Phaser.KeyCode[k];
            if (this.input.keyboard.isDown(keycode)) {
                this.bindings[this.bindingsDescription[this.currentBinding].localStorageKey] = keycode;
                this.game.state.start('KeyboardOptionsBindKey', true, false, this.currentBinding + 1, this.bindings);
                break;
            }
        }
    }
}
exports.KeyboardOptionsBindKey = KeyboardOptionsBindKey;


});

require.register("states/Level.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Player_1 = require("../entities/Player");
const EmotionSprite_1 = require("../entities/EmotionSprite");
const Underwear_1 = require("../entities/Underwear");
const Team_1 = require("../entities/Team");
const Menu_1 = require("../ui/Menu");
const Controls_1 = require("../utils/Controls");
const CPU_1 = require("../ia/CPU");
class LevelConfig {
}
exports.LevelConfig = LevelConfig;
class Level extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        Player_1.Player.preload(this.game);
        Underwear_1.Underwear.preload(this.game);
        EmotionSprite_1.EmotionSprite.preload(this.game);
        Menu_1.Menu.preload(this.game);
        this.game.load.image('girls-win', 'victory/girls-win.png');
        this.game.load.image('boys-win', 'victory/boys-win.png');
        this.game.load.tilemap('map', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('interior', 'sprites/opengameart/LPC_house_interior/interior.png');
        this.game.load.image('arabic1', 'sprites/opengameart/arabic_set/arabic1.png');
        this.game.load.image('house_inside', 'sprites/opengameart/lpc-house-insides/house_inside.png');
        this.game.load.image('misc', 'sprites/opengameart/misc-32x32-tiles/misc.png');
        this.game.load.image('basket', 'sprites/devnewton/basket.png');
        this.game.load.audio('level-music', 'musics/opengameart/8-bit-music-pack-loopable/bgm_action_4.mp3');
        this.game.load.audio('victory-music', 'musics/opengameart/hungry-dino-9-chiptune-tracks-10-sfx/victory.mp3');
    }
    init(config) {
        this.config = config;
        this.cpus = [];
        this.isNotFirstFrame = false;
        this.victory = false;
    }
    create() {
        super.create();
        this.game.sound.stopAll();
        this.game.sound.play('level-music', 1, true);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        const map = this.game.add.tilemap('map');
        map.addTilesetImage('interior');
        map.addTilesetImage('arabic1');
        map.addTilesetImage('house_inside');
        map.addTilesetImage('misc');
        map.addTilesetImage('basket');
        const layer = map.createLayer('ground');
        map.createLayer('doors_and_furnitures');
        layer.resizeWorld();
        this.collisionSprites = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        for (let o of map.objects['collision']) {
            if (o.name === 'world-bounds') {
                this.game.physics.arcade.setBounds(o.x, o.y, o.width, o.height);
            }
            else if (o.rectangle) {
                const sprite = this.game.add.sprite(o.x, o.y);
                this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                sprite.body.immovable = true;
                sprite.width = o.width;
                sprite.height = o.height;
                this.collisionSprites.add(sprite);
            }
        }
        this.braCapturePoints = new Underwear_1.UnderwearCapturePoints(this.game, map, 'bra');
        this.boxersCapturePoints = new Underwear_1.UnderwearCapturePoints(this.game, map, 'boxers');
        this.underwearCaptureCollisionResolver = new Underwear_1.UnderwearCaptureCollisionResolver(this.game);
        let controllers = this.game.controllers;
        this.girlsTeam = new Team_1.Team(this.game);
        let betty = new Player_1.Player(this.game, 'betty');
        betty.x = 256;
        betty.y = 320;
        betty.controls = controllers.getController(this.config.bettyController);
        this.girlsTeam.add(betty);
        let betty2 = new Player_1.Player(this.game, 'betty2');
        betty2.x = 256;
        betty2.y = 480;
        betty2.controls = controllers.getController(this.config.betty2Controller);
        this.girlsTeam.add(betty2);
        this.braGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        let bra1 = new Underwear_1.Underwear(this.game, 'bra');
        bra1.x = 512;
        bra1.y = 240;
        this.braGroup.add(bra1);
        let bra2 = new Underwear_1.Underwear(this.game, 'bra');
        bra2.x = 512;
        bra2.y = 400;
        this.braGroup.add(bra2);
        let bra3 = new Underwear_1.Underwear(this.game, 'bra');
        bra3.x = 512;
        bra3.y = 560;
        this.braGroup.add(bra3);
        this.boysTeam = new Team_1.Team(this.game);
        let george = new Player_1.Player(this.game, 'george');
        george.x = 1024;
        george.y = 320;
        george.controls = controllers.getController(this.config.georgeController);
        this.boysTeam.add(george);
        let george2 = new Player_1.Player(this.game, 'george2');
        george2.x = 1024;
        george2.y = 480;
        george2.controls = controllers.getController(this.config.george2Controller);
        this.boysTeam.add(george2);
        this.boxersGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        let boxers1 = new Underwear_1.Underwear(this.game, 'boxers');
        boxers1.x = 768;
        boxers1.y = 240;
        this.boxersGroup.add(boxers1);
        let boxers2 = new Underwear_1.Underwear(this.game, 'boxers');
        boxers2.x = 768;
        boxers2.y = 400;
        this.boxersGroup.add(boxers2);
        let boxers3 = new Underwear_1.Underwear(this.game, 'boxers');
        boxers3.x = 768;
        boxers3.y = 560;
        this.boxersGroup.add(boxers3);
        this.teamCollisionResolver = new Team_1.TeamCollisionResolver(this.game);
        this.girlsTeam.forEachAlive((player) => {
            if (player.controls instanceof Controls_1.CPUControls) {
                let cpu = new CPU_1.CPU();
                cpu.me = player;
                cpu.buddies = this.girlsTeam;
                cpu.opponents = this.boysTeam;
                cpu.controls = player.controls;
                cpu.capturePoints = this.boxersCapturePoints;
                cpu.underwears = this.boxersGroup;
                this.cpus.push(cpu);
            }
        }, null);
        this.boysTeam.forEachAlive((player) => {
            if (player.controls instanceof Controls_1.CPUControls) {
                let cpu = new CPU_1.CPU();
                cpu.me = player;
                cpu.buddies = this.boysTeam;
                cpu.opponents = this.girlsTeam;
                cpu.controls = player.controls;
                cpu.capturePoints = this.braCapturePoints;
                cpu.underwears = this.braGroup;
                this.cpus.push(cpu);
            }
        }, null);
        this.menu = new Menu_1.Menu(this.game);
        this.menu.alive = false;
        this.menu.visible = false;
        this.menu.button("Continue", 200, 260, () => {
            if (this.victory) {
                this.game.state.restart(true, false, this.config);
            }
            else {
                this.menu.alive = false;
                this.menu.visible = false;
            }
        });
        this.menu.button("Change teams", 200, 410, () => this.game.state.start('TeamSelectScreen', true, false));
        this.menu.button("Return to title", 200, 560, () => this.game.state.start('Title', true, false));
    }
    update() {
        if (this.isNotFirstFrame) {
            if (!this.checkVictory()) {
                this.teamCollisionResolver.groupVersusGroup(this.girlsTeam, this.boysTeam);
                this.underwearCaptureCollisionResolver.groupVersusGroup(this.braGroup, this.braCapturePoints);
                this.underwearCaptureCollisionResolver.groupVersusGroup(this.boxersGroup, this.boxersCapturePoints);
                this.game.physics.arcade.collide(this.braGroup);
                this.game.physics.arcade.collide(this.boxersGroup);
                this.game.physics.arcade.collide(this.braGroup, this.boxersGroup);
                this.game.physics.arcade.collide(this.braGroup, this.girlsTeam);
                this.game.physics.arcade.collide(this.boxersGroup, this.girlsTeam);
                this.game.physics.arcade.collide(this.braGroup, this.boysTeam);
                this.game.physics.arcade.collide(this.boxersGroup, this.boysTeam);
                this.game.physics.arcade.collide(this.girlsTeam, this.collisionSprites);
                this.game.physics.arcade.collide(this.boysTeam, this.collisionSprites);
                this.game.physics.arcade.collide(this.braGroup, this.collisionSprites);
                this.game.physics.arcade.collide(this.boxersGroup, this.collisionSprites);
                this.cpus.forEach(c => c.think());
            }
            this.checkMenu();
        }
        else {
            this.isNotFirstFrame = true;
        }
    }
    checkMenu() {
        if (this.menu.alive) {
            return true;
        }
        const controllers = this.game.controllers;
        let isMenuAsked = controllers.getKeyboard().isMenuAsked();
        this.girlsTeam.forEachAlive((player) => {
            isMenuAsked = isMenuAsked || player.controls.isMenuAsked();
        }, null);
        this.boysTeam.forEachAlive((player) => {
            isMenuAsked = isMenuAsked || player.controls.isMenuAsked();
        }, null);
        if (isMenuAsked) {
            this.showMenu();
        }
    }
    checkVictory() {
        if (!this.victory) {
            const girlsWin = this.boxersCapturePoints.areAllCaptured();
            const boysWin = this.braCapturePoints.areAllCaptured();
            this.victory = boysWin || girlsWin;
            if (this.victory) {
                this.game.sound.stopAll();
                this.game.sound.play('victory-music', 1, false);
                this.girlsTeam.forEachAlive((player) => {
                    let emo = new EmotionSprite_1.EmotionSprite(this.game, player.key, girlsWin ? 'happy' : 'sad');
                    emo.x = player.x;
                    emo.y = player.y;
                    player.kill();
                }, null);
                this.boysTeam.forEachAlive((player) => {
                    let emo = new EmotionSprite_1.EmotionSprite(this.game, player.key, boysWin ? 'happy' : 'sad');
                    emo.x = player.x;
                    emo.y = player.y;
                    player.kill();
                }, null);
                let victoryText = this.game.add.sprite(this.game.world.centerX, 100, boysWin && girlsWin && 'draw' || boysWin && 'boys-win' || 'girls-win');
                var tween = this.game.add.tween(victoryText.scale).to({ x: 1.4, y: 1.4 }, 1000, "Linear", true, 0, -1);
                tween.yoyo(true);
                victoryText.anchor.setTo(0.5, 0);
                this.showMenu();
            }
        }
        return this.victory;
    }
    showMenu() {
        this.menu.alive = true;
        this.menu.visible = true;
    }
    render() {
    }
}
exports.Level = Level;


});

require.register("states/Options.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
class Options extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        Menu_1.Menu.preload(this.game);
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Options', { font: "100px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        let y = 100;
        const menu = new Menu_1.Menu(this.game);
        menu.button("Keyboard", 200, y += 150, () => this.game.state.start('KeyboardOptions'));
        if (this.input.gamepad.supported) {
            menu.button("Gamepad", 200, y += 150, () => this.game.state.start('GamepadOptions'));
        }
        menu.button("Back", 200, y += 150, () => this.game.state.start('Title'));
    }
}
exports.Options = Options;


});

require.register("states/TeamSelectScreen.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Level_1 = require("./Level");
const Menu_1 = require("../ui/Menu");
const MenuSelect_1 = require("../ui/MenuSelect");
const Controls_1 = require("../utils/Controls");
class TeamSelectScreen extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        Menu_1.Menu.preload(this.game);
        this.game.load.atlasXML('betty', 'sprites/opengameart/betty.png', 'sprites/opengameart/player.xml');
        this.game.load.atlasXML('betty2', 'sprites/opengameart/betty2.png', 'sprites/opengameart/player.xml');
        this.game.load.atlasXML('george', 'sprites/opengameart/george.png', 'sprites/opengameart/player.xml');
        this.game.load.atlasXML('george2', 'sprites/opengameart/george2.png', 'sprites/opengameart/player.xml');
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Team selection', { font: "64px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        let betty = this.add.sprite(150, 175, 'betty', 0);
        this.game.addSpriteAnimation(betty, 'player.wait', 1);
        betty.play('player.wait', 8, true);
        let betty2 = this.add.sprite(150, 275, 'betty2', 0);
        this.game.addSpriteAnimation(betty2, 'player.wait', 1);
        betty2.play('player.wait', 8, true);
        let george = this.add.sprite(1060, 375, 'george', 0);
        this.game.addSpriteAnimation(george, 'player.wait', 1);
        george.play('player.wait', 8, true);
        let george2 = this.add.sprite(1060, 475, 'george2', 0);
        this.game.addSpriteAnimation(george2, 'player.wait', 1);
        george2.play('player.wait', 8, true);
        const menu = new Menu_1.Menu(this.game);
        let playerOptions = [
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.CPU, 'CPU'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.KEYBOARD, 'Keyboard'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD1, 'Pad 1'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD2, 'Pad 2'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD3, 'Pad 3'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD4, 'Pad 4')
        ];
        this.bettySelect = menu.select(200, 150, playerOptions);
        this.betty2Select = menu.select(200, 250, playerOptions);
        this.georgeSelect = menu.select(200, 350, playerOptions);
        this.george2Select = menu.select(200, 450, playerOptions);
        this.autoSelect();
        menu.button("Play", 200, 600, () => {
            let config = new Level_1.LevelConfig();
            config.bettyController = this.bettySelect.getSelectedValue();
            config.betty2Controller = this.betty2Select.getSelectedValue();
            config.georgeController = this.georgeSelect.getSelectedValue();
            config.george2Controller = this.george2Select.getSelectedValue();
            this.game.state.start('Level', true, false, config);
        });
        this.input.gamepad.onConnectCallback = this.input.gamepad.onDisconnectCallback = () => this.autoSelect();
    }
    shutdown() {
        this.input.gamepad.onConnectCallback = this.input.gamepad.onDisconnectCallback = null;
    }
    autoSelect() {
        switch (this.input.gamepad.padsConnected) {
            case 0:
                this.bettySelect.setSelectedValue(Controls_1.ControllerType.KEYBOARD);
                this.betty2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                this.georgeSelect.setSelectedValue(Controls_1.ControllerType.CPU);
                this.george2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            case 1:
                this.bettySelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.betty2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                this.georgeSelect.setSelectedValue(Controls_1.ControllerType.CPU);
                this.george2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            case 2:
                this.bettySelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.betty2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                this.georgeSelect.setSelectedValue(Controls_1.ControllerType.PAD2);
                this.george2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            case 3:
                this.bettySelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.betty2Select.setSelectedValue(Controls_1.ControllerType.PAD2);
                this.georgeSelect.setSelectedValue(Controls_1.ControllerType.PAD3);
                this.george2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            default:
                this.bettySelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.betty2Select.setSelectedValue(Controls_1.ControllerType.PAD2);
                this.georgeSelect.setSelectedValue(Controls_1.ControllerType.PAD3);
                this.george2Select.setSelectedValue(Controls_1.ControllerType.PAD4);
                break;
        }
    }
}
exports.TeamSelectScreen = TeamSelectScreen;


});

require.register("states/Title.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Menu_1 = require("../ui/Menu");
class Title extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        this.game.load.image('school', 'title/school.jpg');
        this.game.load.image('logo', 'title/logo.png');
        this.game.load.audio('main-music', 'musics/opengameart/hungry-dino-9-chiptune-tracks-10-sfx/main.mp3');
        Menu_1.Menu.preload(this.game);
    }
    create() {
        super.create();
        this.game.sound.stopAll();
        this.game.sound.play('main-music', 1, true);
        this.game.add.image(0, 0, 'school');
        let logo = this.game.add.sprite(this.game.world.centerX, 10, 'logo');
        logo.scale.x = 1.4;
        logo.scale.y = 1.4;
        logo.anchor.setTo(0.5, 0);
        const menu = new Menu_1.Menu(this.game);
        menu.button("Start", 200, 250, () => this.game.state.start('TeamSelectScreen'));
        menu.button("Options", 200, 400, () => this.game.state.start('Options'));
        menu.button("Help", 200, 550, () => this.game.state.start('Help1'));
    }
}
exports.Title = Title;


});

require.register("ui/Menu.ts", function(exports, require, module) {
"use strict";
const MenuCursor_1 = require("./MenuCursor");
const MenuButton_1 = require("./MenuButton");
const MenuSelect_1 = require("./MenuSelect");
class Menu extends Phaser.Group {
    constructor(game) {
        super(game);
        this.buttons = game.add.group();
        this.add(this.buttons);
        this.menuCursor = new MenuCursor_1.MenuCursor(game, this.buttons);
        this.add(this.menuCursor);
        game.add.existing(this);
    }
    disableGamepadCursor() {
        this.menuCursor.gamepadCursor = false;
        return this;
    }
    disableKeyboardCursor() {
        this.menuCursor.gamepadCursor = false;
        return this;
    }
    addButton(button) {
        this.buttons.add(button);
    }
    button(label, x, y, callback) {
        this.buttons.add(new MenuButton_1.MenuButton(this.game, label, x, y, callback));
    }
    select(x, y, options) {
        const select = new MenuSelect_1.MenuSelect(this.game, x, y, options);
        this.buttons.add(select);
        return select;
    }
    static preload(game) {
        game.load.atlasXML('menu-buttons', 'menu/buttons.png', 'menu/buttons.xml');
    }
}
exports.Menu = Menu;


});

require.register("ui/MenuButton.ts", function(exports, require, module) {
"use strict";
class MenuButton extends Phaser.Button {
    constructor(game, label, x, y, callback) {
        super(game, x, y, 'menu-buttons', callback, null, 'over', 'out', 'down');
        this.callback = callback;
        this.labelText = new Phaser.Text(this.game, 140, 15, label, { font: "64px monospace", fill: 'white' });
        this.addChild(this.labelText);
    }
    toggle() {
        this.callback();
    }
    setText(text) {
        this.labelText.setText(text);
    }
}
exports.MenuButton = MenuButton;


});

require.register("ui/MenuCursor.ts", function(exports, require, module) {
"use strict";
class MenuCursor extends Phaser.Text {
    constructor(game, buttons) {
        super(game, 0, 0, '👉', { font: "64px monospace", fontWeight: 'bold', fill: 'white' });
        this.currentButton = 0;
        this.waitUntil = -1;
        this.keyboardCursor = true;
        this.gamepadCursor = true;
        this.buttons = buttons;
        this.visible = false;
    }
    firstPadConnected() {
        const gamepad = this.game.input.gamepad;
        if (gamepad.pad1.connected) {
            return gamepad.pad1;
        }
        else if (gamepad.pad2.connected) {
            return gamepad.pad2;
        }
        else if (gamepad.pad3.connected) {
            return gamepad.pad3;
        }
        else if (gamepad.pad4.connected) {
            return gamepad.pad4;
        }
        else {
            return null;
        }
    }
    update() {
        super.update();
        if (this.parent.visible && this.game.time.time > this.waitUntil && (this.processPad() || this.processKeyboard())) {
            this.waitUntil = this.game.time.time + 230;
        }
    }
    processKeyboard() {
        if (this.keyboardCursor) {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.moveToButton(-1);
                return true;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.moveToButton(1);
                return true;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
                this.activateButton();
                return true;
            }
        }
        return false;
    }
    processPad() {
        if (this.gamepadCursor) {
            const pad = this.firstPadConnected();
            if (pad) {
                for (let b = 0; b < 4; ++b) {
                    let button = pad.getButton(b);
                    if (button && button.isDown) {
                        this.activateButton();
                        return true;
                    }
                }
                for (let a = 0; a < 2; ++a) {
                    const axis = pad.axis(a);
                    if (axis > pad.deadZone) {
                        this.moveToButton(1);
                        return true;
                    }
                    else if (axis < -pad.deadZone) {
                        this.moveToButton(-1);
                        return true;
                    }
                }
            }
        }
        return false;
    }
    moveToButton(direction) {
        if (this.parent.visible && this.buttons.children.length > 0) {
            if (!this.visible) {
                this.visible = true;
            }
            else {
                this.currentButton += direction;
            }
            if (this.currentButton >= this.buttons.length) {
                this.currentButton = 0;
            }
            if (this.currentButton < 0) {
                this.currentButton = this.buttons.length - 1;
            }
            const button = this.buttons.children[this.currentButton];
            this.x = button.x;
            this.y = button.y;
        }
    }
    activateButton() {
        if (this.parent.visible) {
            if (!this.visible) {
                this.moveToButton(0);
            }
            else if (this.buttons.children.length > 0) {
                const button = this.buttons.children[this.currentButton];
                if (button.toggle) {
                    button.toggle();
                }
            }
        }
    }
}
exports.MenuCursor = MenuCursor;


});

require.register("ui/MenuMiniButton.ts", function(exports, require, module) {
"use strict";
class MenuMiniButton extends Phaser.Button {
    constructor(game, label, x, y, callback) {
        super(game, x, y, 'menu-mini-buttons', callback, null, 'over', 'out', 'down');
        this.callback = callback;
        this.labelText = new Phaser.Text(this.game, 15, 15, label, { font: "64px monospace", fill: 'white' });
        this.addChild(this.labelText);
    }
    static preload(game) {
        game.load.atlasXML('menu-mini-buttons', 'menu/mini-buttons.png', 'menu/mini-buttons.xml');
    }
    toggle() {
        this.callback();
    }
    setText(text) {
        this.labelText.setText(text);
    }
}
exports.MenuMiniButton = MenuMiniButton;


});

require.register("ui/MenuSelect.ts", function(exports, require, module) {
"use strict";
class MenuSelectOption {
    constructor(value, label, callback) {
        this.label = label;
        this.value = value;
        this.callback = callback;
    }
}
exports.MenuSelectOption = MenuSelectOption;
class MenuSelect extends Phaser.Button {
    constructor(game, x, y, options) {
        super(game, x, y, 'menu-buttons', () => this.toggle(), null, 'over', 'out', 'down');
        this.selectedOption = 0;
        this.options = options;
        this.labelText = new Phaser.Text(this.game, 140, 15, options[0].label, { font: "64px monospace", fill: 'white' });
        this.addChild(this.labelText);
        game.add.existing(this);
    }
    toggle() {
        this.selectedOption = (this.selectedOption + 1) % this.options.length;
        this.labelText.setText(this.options[this.selectedOption].label);
    }
    getSelectedValue() {
        return this.options[this.selectedOption].value;
    }
    setSelectedValue(optionValue) {
        let foundIndex = this.options.findIndex((option) => option.value === optionValue);
        this.selectedOption = foundIndex >= 0 ? foundIndex : 0;
        this.labelText.setText(this.options[this.selectedOption].label);
    }
}
exports.MenuSelect = MenuSelect;


});

require.register("utils/CollisionResolver.ts", function(exports, require, module) {
"use strict";
class CollisionResolver {
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
        if (this.checkCollision(spriteA, spriteB)) {
            this.onCollide(spriteA, spriteB);
        }
    }
    checkCollision(spriteA, spriteB) {
        return spriteA.exists && spriteB.exists && spriteA.overlap(spriteB);
    }
    onCollide(a, b) {
        console.log('prout');
    }
}
exports.CollisionResolver = CollisionResolver;


});

require.register("utils/Controls.ts", function(exports, require, module) {
"use strict";
const GamepadUtils_1 = require("./GamepadUtils");
(function (ControllerType) {
    ControllerType[ControllerType["CPU"] = -1] = "CPU";
    ControllerType[ControllerType["KEYBOARD"] = 0] = "KEYBOARD";
    ControllerType[ControllerType["PAD1"] = 1] = "PAD1";
    ControllerType[ControllerType["PAD2"] = 2] = "PAD2";
    ControllerType[ControllerType["PAD3"] = 3] = "PAD3";
    ControllerType[ControllerType["PAD4"] = 4] = "PAD4";
})(exports.ControllerType || (exports.ControllerType = {}));
var ControllerType = exports.ControllerType;
class Controllers {
    constructor(game) {
        game.input.gamepad.start();
        this.controllers = [
            new KeyboardControls(game),
            new PadControls(game, 1),
            new PadControls(game, 2),
            new PadControls(game, 3),
            new PadControls(game, 4),
        ];
    }
    getController(type) {
        switch (type) {
            case ControllerType.CPU:
                return new CPUControls();
            default:
                return this.controllers[type];
        }
    }
    getKeyboard() {
        return this.controllers[0];
    }
    getPad(padIndex) {
        return this.controllers[padIndex];
    }
    updatePadLayout() {
        for (let i = 1; i < 4; ++i) {
            this.controllers[i].updatePadLayout();
        }
    }
}
exports.Controllers = Controllers;
class AbstractControls {
    readNumberFromLocalStorage(key, defaultValue) {
        let i = parseInt(localStorage.getItem(key));
        if (isNaN(i)) {
            return defaultValue;
        }
        else {
            return i;
        }
    }
}
exports.AbstractControls = AbstractControls;
class CPUControls extends AbstractControls {
    constructor() {
        super(...arguments);
        this.goingUp = false;
        this.goingDown = false;
        this.goingLeft = false;
        this.goingRight = false;
        this.hammerTime = false;
        this.dashAngle = null;
    }
    reset() {
        this.goingUp = false;
        this.goingDown = false;
        this.goingLeft = false;
        this.goingRight = false;
        this.hammerTime = false;
        this.dashAngle = null;
    }
    isGoingUp() {
        return this.goingUp;
    }
    isGoingDown() {
        return this.goingDown;
    }
    isGoingLeft() {
        return this.goingLeft;
    }
    isGoingRight() {
        return this.goingRight;
    }
    isHammerTime() {
        return this.hammerTime;
    }
    dashingAngle(playerPos) {
        return this.dashAngle;
    }
    isMenuAsked() {
        return false;
    }
}
exports.CPUControls = CPUControls;
class KeyboardControls extends AbstractControls {
    constructor(game) {
        super();
        this.game = game;
        this.setupKeyboardLayout();
    }
    setupKeyboardLayout() {
        const layout = localStorage.getItem('keyboard.layout');
        this.kb = this.game.input.keyboard;
        try {
            let mapping = JSON.parse(layout) || {};
            this.keyCodeMoveUp = mapping.moveUp || Phaser.KeyCode.UP;
            this.keyCodeMoveDown = mapping.moveDown || Phaser.KeyCode.DOWN;
            this.keyCodeMoveLeft = mapping.moveLeft || Phaser.KeyCode.LEFT;
            this.keyCodeMoveRight = mapping.moveRight || Phaser.KeyCode.RIGHT;
            this.keyCodeHammerTime = mapping.hammer || Phaser.KeyCode.SHIFT;
            this.keyCodeDash = mapping.dash || Phaser.KeyCode.CONTROL;
            this.keyCodeMenu = mapping.menu || Phaser.KeyCode.ESC;
            return;
        }
        catch (e) {
        }
        if (layout == 'azerty') {
            this.useAzertyLayout();
        }
        else if (layout == 'qwerty') {
            this.useQwertyLayout();
        }
        else {
            this.useOtherKeyboardLayout();
        }
    }
    useAzertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.Z;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.Q;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeHammerTime = Phaser.KeyCode.K;
        this.keyCodeDash = Phaser.KeyCode.J;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }
    useQwertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.W;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.A;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeHammerTime = Phaser.KeyCode.K;
        this.keyCodeDash = Phaser.KeyCode.J;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }
    useOtherKeyboardLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.UP;
        this.keyCodeMoveDown = Phaser.KeyCode.DOWN;
        this.keyCodeMoveLeft = Phaser.KeyCode.LEFT;
        this.keyCodeMoveRight = Phaser.KeyCode.RIGHT;
        this.keyCodeHammerTime = Phaser.KeyCode.SHIFT;
        this.keyCodeDash = Phaser.KeyCode.CONTROL;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }
    dashingAngle(playerPos) {
        if (this.kb && this.kb.isDown(this.keyCodeDash)) {
            return this.lookingAngle();
        }
    }
    lookingAngle() {
        let dx = 0;
        if (this.kb.isDown(this.keyCodeMoveLeft)) {
            dx = -1;
        }
        else if (this.kb.isDown(this.keyCodeMoveRight)) {
            dx = 1;
        }
        let dy = 0;
        if (this.kb.isDown(this.keyCodeMoveUp)) {
            dy = -1;
        }
        else if (this.kb.isDown(this.keyCodeMoveDown)) {
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
        return this.kb && this.kb.isDown(this.keyCodeMoveUp);
    }
    isGoingDown() {
        return this.kb && this.kb.isDown(this.keyCodeMoveDown);
    }
    isGoingLeft() {
        return this.kb && this.kb.isDown(this.keyCodeMoveLeft);
    }
    isGoingRight() {
        return this.kb && this.kb.isDown(this.keyCodeMoveRight);
    }
    isHammerTime() {
        return this.kb && this.kb.isDown(this.keyCodeHammerTime);
    }
    isMenuAsked() {
        return this.kb && this.kb.isDown(this.keyCodeMenu);
    }
}
exports.KeyboardControls = KeyboardControls;
class PadControls extends AbstractControls {
    constructor(game, padIndex) {
        super();
        this.game = game;
        this.padIndex = padIndex;
    }
    updatePadLayout() {
        this.pad = null;
    }
    checkPad() {
        let pad = GamepadUtils_1.GamepadUtils.gamepadByIndex(this.game, this.padIndex);
        if (pad != null) {
            if (this.pad != pad) {
                this.pad = pad;
                let layout = {};
                try {
                    layout = JSON.parse(localStorage.getItem('gamepad.' + GamepadUtils_1.GamepadUtils.gamepadId(this.pad) + '.layout')) || {};
                }
                catch (e) {
                    layout = {};
                }
                this.moveXAxis = layout.moveXAxis || Phaser.Gamepad.XBOX360_STICK_LEFT_X;
                this.moveYAxis = layout.moveYAxis || Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
                this.dashButton = layout.dashButton || Phaser.Gamepad.XBOX360_X;
                this.menuButton = layout.menuButton || Phaser.Gamepad.XBOX360_START;
                this.hammerTimeButton = layout.hammerTimeButton || Phaser.Gamepad.XBOX360_A;
            }
            return true;
        }
        else {
            return false;
        }
    }
    dashingAngle(playerPos) {
        if (this.checkPad() && this.pad.isDown(this.dashButton)) {
            return this.lookingAngle();
        }
    }
    lookingAngle() {
        let dx = this.pad.axis(this.moveXAxis);
        let dy = this.pad.axis(this.moveYAxis);
        dx = Math.abs(dx) <= this.pad.deadZone ? 0 : dx;
        dy = Math.abs(dy) <= this.pad.deadZone ? 0 : dy;
        if (dx != 0 || dy != 0) {
            return Phaser.Math.angleBetween(0, 0, dx, dy);
        }
        else {
            return null;
        }
    }
    isGoingUp() {
        return this.checkPad() && this.pad.axis(this.moveYAxis) < -this.pad.deadZone;
    }
    isGoingDown() {
        return this.checkPad() && this.pad.axis(this.moveYAxis) > this.pad.deadZone;
    }
    isGoingLeft() {
        return this.checkPad() && this.pad.axis(this.moveXAxis) < -this.pad.deadZone;
    }
    isGoingRight() {
        return this.checkPad() && this.pad.axis(this.moveXAxis) > this.pad.deadZone;
    }
    isHammerTime() {
        return this.checkPad() && this.pad.isDown(this.hammerTimeButton);
    }
    isMenuAsked() {
        return this.checkPad() && this.pad.isDown(this.menuButton);
    }
}
exports.PadControls = PadControls;


});

require.register("utils/GamepadUtils.ts", function(exports, require, module) {
"use strict";
class GamepadUtils {
    static gamepadColor(pad) {
        let gamepad = pad.game.input.gamepad;
        if (pad == gamepad.pad4) {
            return 0xFFFF00;
        }
        else if (pad == gamepad.pad3) {
            return 0x0000FF;
        }
        else if (pad == gamepad.pad2) {
            return 0x00FF00;
        }
        else {
            return 0xFF0000;
        }
    }
    static gamepadId(pad) {
        let anyPad = pad;
        if (anyPad._rawPad) {
            return anyPad._rawPad.id;
        }
        else {
            return null;
        }
    }
    static gamepadByIndex(game, padIndex) {
        return game.input.gamepad['pad' + padIndex];
    }
}
GamepadUtils.NB_BUTTONS = 16;
GamepadUtils.NB_AXIS = 10;
exports.GamepadUtils = GamepadUtils;


});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('UnderthiefApp');