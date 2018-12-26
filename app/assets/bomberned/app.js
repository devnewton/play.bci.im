(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

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
    var hot = hmr && hmr.createHot(name);
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
    if (bundle && typeof bundle === 'object') {
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
var global = typeof window === 'undefined' ? this : window;
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
require.register("BombernedApp.ts", function(exports, require, module) {
"use strict";
const BombernedGame_1 = require("./BombernedGame");
new BombernedGame_1.BombernedGame();


});

require.register("BombernedGame.ts", function(exports, require, module) {
"use strict";
const Intro_1 = require("./states/Intro");
const Help1_1 = require("./states/Help1");
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
class BombernedGame extends Phaser.Game {
    constructor() {
        super(1280, 720, Phaser.CANVAS, 'game', {
            preload: () => this.preloadGame(),
            create: () => this.createGame()
        });
        this.state.add('Intro', Intro_1.Intro);
        this.state.add('Title', Title_1.Title);
        this.state.add('Help1', Help1_1.Help1);
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
exports.BombernedGame = BombernedGame;


});

require.register("entities/Arrow.ts", function(exports, require, module) {
"use strict";
const Explosion_1 = require("./Explosion");
class Arrow extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, 'arrow');
        game.addSpriteAnimation(this, 'arrow.fly', 4);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;
        this.health = 0;
        this.alive = false;
        this.game.state.getCurrentState().arrows.add(this);
        this.arrowCharge = new ArrowCharge(game);
        this.arrowCharge.x = 11;
        this.arrowCharge.y = 0;
        this.addChild(this.arrowCharge);
    }
    static preload(game) {
        game.load.atlasXML('arrow', 'sprites/devnewton/arrow.png', 'sprites/devnewton/arrow.xml');
    }
    fire(fromX, fromY, angle, speed) {
        this.reset(fromX, fromY, 1);
        this.scale.set(1);
        this.game.physics.arcade.velocityFromRotation(angle, speed, this.body.velocity);
        this.rotation = angle;
        this.play('arrow.fly', 4, true);
        this.arrowCharge.reset(11, 0, 1);
        this.arrowCharge.play('arrow.charge', 16, true, false);
    }
}
exports.Arrow = Arrow;
class ArrowExplosion extends Explosion_1.Explosion {
    constructor(game) {
        super(game, game.world.centerX, game.world.centerY, 'arrow');
        game.addSpriteAnimation(this, 'arrow.explode', 8);
        this.play('arrow.explode', 3, false, true);
        this.anchor.setTo(0.5, 0.5);
        this.game.state.getCurrentState().explosions.add(this);
    }
    kill() {
        this.destroy();
        return super.kill();
    }
}
exports.ArrowExplosion = ArrowExplosion;
class ArrowCharge extends Phaser.Sprite {
    constructor(game) {
        super(game, game.world.centerX, game.world.centerY, 'arrow');
        game.addSpriteAnimation(this, 'arrow.charge', 11);
        this.play('arrow.charge', 16, true, false);
        this.anchor.setTo(0.5, 0.5);
    }
    kill() {
        let explosion = new ArrowExplosion(this.game);
        let explosionPos = new Phaser.Point(this.parent.x + 11, this.parent.y);
        Phaser.Point.rotate(explosionPos, this.parent.x, this.parent.y, this.parent.rotation);
        explosion.x = explosionPos.x;
        explosion.y = explosionPos.y;
        this.parent.kill();
        return super.kill();
    }
}
exports.ArrowCharge = ArrowCharge;


});

require.register("entities/Bomb.ts", function(exports, require, module) {
"use strict";
const Explosion_1 = require("./Explosion");
const TIME_BEFORE_EXPLOSION = 50000;
const ABOUT_TO_EXPLODE_ANIM_DURATION = 3000;
class Bomb extends Phaser.Sprite {
    constructor(game) {
        super(game, game.world.centerX, game.world.centerY, 'bomb');
        this.explosionSize = 3;
        game.addSpriteAnimation(this, 'bomb.dropped', 2);
        game.addSpriteAnimation(this, 'bomb.abouttoexplode', 3);
        this.explosionTime = game.time.time + TIME_BEFORE_EXPLOSION;
        this.play('bomb.dropped', 4, true);
        this.anchor.setTo(0.5, 0.5);
        this.game.state.getCurrentState().bombs.add(this);
    }
    static preload(game) {
        game.load.atlasXML('bomb', 'sprites/devnewton/bomb.png', 'sprites/devnewton/bomb.xml');
    }
    damage(amount) {
        if (this.game.time.time < (this.explosionTime - ABOUT_TO_EXPLODE_ANIM_DURATION)) {
            this.explosionTime = this.game.time.time + ABOUT_TO_EXPLODE_ANIM_DURATION;
        }
        return this;
    }
    update() {
        if (this.game.time.time > (this.explosionTime - ABOUT_TO_EXPLODE_ANIM_DURATION)) {
            this.play('bomb.abouttoexplode', 15, false);
        }
        if (this.game.time.time > this.explosionTime) {
            let explosion = new BombExplosion(this.game, 'bomb.explosion.center', 0);
            explosion.x = this.x;
            explosion.y = this.y;
            for (let i = 1; i <= this.explosionSize; ++i) {
                let animation = i === this.explosionSize ? 'bomb.explosion.end' : 'bomb.explosion.side';
                let explosionTop = new BombExplosion(this.game, animation, 180);
                explosionTop.x = this.x;
                explosionTop.y = this.y - i * 32;
                let explosionBottom = new BombExplosion(this.game, animation, 0);
                explosionBottom.x = this.x;
                explosionBottom.y = this.y + i * 32;
                let explosionLeft = new BombExplosion(this.game, animation, 90);
                explosionLeft.x = this.x - i * 32;
                explosionLeft.y = this.y;
                let explosionRight = new BombExplosion(this.game, animation, -90);
                explosionRight.x = this.x + i * 32;
                explosionRight.y = this.y;
            }
            this.destroy();
        }
    }
}
exports.Bomb = Bomb;
class BombExplosion extends Explosion_1.Explosion {
    constructor(game, animation, angle) {
        super(game, game.world.centerX, game.world.centerY, 'bomb');
        game.addSpriteAnimation(this, animation, 8);
        this.play(animation, 3, false, true);
        this.anchor.setTo(0.5, 0.5);
        this.angle = angle;
        this.game.state.getCurrentState().explosions.add(this);
    }
    kill() {
        this.destroy();
        return super.kill();
    }
}
exports.BombExplosion = BombExplosion;


});

require.register("entities/Explosion.ts", function(exports, require, module) {
"use strict";
class Explosion extends Phaser.Sprite {
    kill() {
        this.destroy();
        return super.kill();
    }
    damage(amount) {
        return this;
    }
}
exports.Explosion = Explosion;


});

require.register("entities/Player.ts", function(exports, require, module) {
"use strict";
const Bomb_1 = require("./Bomb");
const Arrow_1 = require("./Arrow");
class PlayerRunningState {
    constructor() {
        this.nextBombTime = -1;
    }
    update(player) {
        if (!player.oldPos.equals(player.position)) {
            player.oldPos = player.position.clone();
        }
        if (player.controls) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            let aimingAngle = player.controls.aimingAngle(player.position);
            if (aimingAngle != null) {
                if (player.controls.isShooting() && !player.arrow.alive) {
                    player.arrow.fire(player.x, player.y, aimingAngle, 500);
                }
            }
            if (player.controls.isDroppingBomb() && player.game.time.time > this.nextBombTime) {
                let bomb = new Bomb_1.Bomb(player.game);
                bomb.x = player.x;
                bomb.y = player.y;
                this.nextBombTime = player.game.time.time + 1000;
            }
            if (player.controls.isGoingLeft()) {
                player.body.velocity.x = -1;
            }
            else if (player.controls.isGoingRight()) {
                player.body.velocity.x = 1;
            }
            if (player.controls.isGoingUp()) {
                player.body.velocity.y = -1;
            }
            else if (player.controls.isGoingDown()) {
                player.body.velocity.y = 1;
            }
            player.body.velocity = player.body.velocity.setMagnitude(300);
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
class Player extends Phaser.Sprite {
    constructor(game, key) {
        super(game, game.world.centerX, game.world.centerY, key);
        this.cpuData = {};
        this.oldPos = new Phaser.Point(0, 0);
        this.invincible = false;
        this.health = 1;
        game.addSpriteAnimation(this, 'player.walk.back', 4);
        game.addSpriteAnimation(this, 'player.walk.front', 4);
        game.addSpriteAnimation(this, 'player.walk.left', 4);
        game.addSpriteAnimation(this, 'player.walk.right', 4);
        game.addSpriteAnimation(this, 'player.wait', 1);
        this.play("player.wait", 8, false);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(24);
        this.body.collideWorldBounds = true;
        this.game.add.existing(this);
        this.state = Player.RUNNING_STATE;
        this.name = key;
        this.arrow = new Arrow_1.Arrow(game);
        this.arrow.arrowCharge.data.friends = [this.name];
        this.arrow.arrowCharge.name = this.name + '-arrow-charge';
        this.data.friends = [this.arrow.arrowCharge.name];
    }
    static preload(game) {
        game.load.atlasXML('ned', 'sprites/devnewton/ned.png', 'sprites/devnewton/player.xml');
        game.load.atlasXML('ned2', 'sprites/devnewton/ned2.png', 'sprites/devnewton/player.xml');
        game.load.atlasXML('moustaki', 'sprites/devnewton/moustaki.png', 'sprites/devnewton/player.xml');
        game.load.atlasXML('moustaki2', 'sprites/devnewton/moustaki2.png', 'sprites/devnewton/player.xml');
    }
    update() {
        super.update();
        this.state.update(this);
    }
    damage(amount) {
        if (!this.invincible) {
            this.invincible = true;
            this.game.add.tween(this).from({ tint: 0xFF0000 }).to({ tint: 0xFFFFFF }, 1000, Phaser.Easing.Linear.None, true, 0, 4, false).onComplete.add(() => this.invincible = false);
            super.damage(amount);
        }
        return this;
    }
    kill() {
        let ghost = new Ghost(this.game, this.key);
        ghost.x = this.x;
        ghost.y = this.y;
        let goToHeavenTween = this.game.add.tween(ghost);
        goToHeavenTween.to({ y: -100 }, 5000, "Linear", true);
        let swirlTween = this.game.add.tween(ghost);
        swirlTween.to({ x: "-50" }, 1000, "Linear", true, 0, -1, true);
        this.game.state.getCurrentState().add.existing(ghost);
        this.destroy();
        return this;
    }
}
Player.RUNNING_STATE = new PlayerRunningState();
exports.Player = Player;
class Ghost extends Phaser.Sprite {
    constructor(game, key) {
        super(game, game.world.centerX, game.world.centerY, key);
        this.outOfBoundsKill = true;
        game.addSpriteAnimation(this, 'player.ghost', 1);
        this.play("player.ghost", 1, false);
        this.anchor.setTo(0.5, 0.5);
    }
}


});

;require.register("entities/Team.ts", function(exports, require, module) {
"use strict";
class Team extends Phaser.Group {
    constructor(game) {
        super(game);
    }
}
exports.Team = Team;


});

require.register("ia/CPU.ts", function(exports, require, module) {
"use strict";
class CPU {
    constructor() {
        this.lastCapturedCount = 0;
    }
    think() {
        this.controls.reset();
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
            { label: 'Press drop bomb button', localStorageKey: 'droppingBombButton' },
            { label: 'Pull aim X axis', localStorageKey: 'aimXAxis' },
            { label: 'Pull aim Y axis', localStorageKey: 'aimYAxis' },
            { label: 'Press shoot button', localStorageKey: 'shootButton' },
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
const GamepadUtils_1 = require("../utils/GamepadUtils");
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
        menu.button("Continue", 200, 610, () => this.game.state.start('Title'));
    }
}
exports.Help1 = Help1;


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
        menu.button("Azerty zsqd", 200, 100, () => {
            localStorage.setItem('keyboard.layout', 'azerty');
            this.game.controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('Options');
        });
        menu.button("Qwerty wsad", 200, 200, () => {
            localStorage.setItem('keyboard.layout', 'qwerty');
            this.game.controllers.getKeyboard().setupKeyboardLayout();
            this.game.state.start('Options');
        });
        menu.button("⬆⬇⬅➡", 200, 300, () => {
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
            { label: 'Press shoot key', localStorageKey: 'shoot' },
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
const Bomb_1 = require("../entities/Bomb");
const Arrow_1 = require("../entities/Arrow");
const Team_1 = require("../entities/Team");
const Menu_1 = require("../ui/Menu");
const Controls_1 = require("../utils/Controls");
const DamageResolver_1 = require("../utils/DamageResolver");
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
        Arrow_1.Arrow.preload(this.game);
        Bomb_1.Bomb.preload(this.game);
        Menu_1.Menu.preload(this.game);
        this.game.load.image('neds-win', 'victory/neds-win.png');
        this.game.load.image('moustakis-win', 'victory/moustakis-win.png');
        this.game.load.tilemap('map', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('dojo', 'levels/dojo.png');
        this.game.load.image('arabic1', 'sprites/opengameart/arabic_set/arabic1.png');
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
        map.addTilesetImage('dojo');
        map.addTilesetImage('arabic1');
        const layer = map.createLayer('ground');
        map.createLayer('wall');
        layer.resizeWorld();
        this.damageResolver = new DamageResolver_1.DamageResolver(this.game);
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
        this.bombs = new Phaser.Group(this.game);
        this.arrows = new Phaser.Group(this.game);
        this.explosions = new Phaser.Group(this.game);
        let controllers = this.game.controllers;
        this.nedsTeam = new Team_1.Team(this.game);
        let nedControls = controllers.getController(this.config.nedController);
        if (nedControls) {
            let ned = new Player_1.Player(this.game, 'ned');
            ned.x = 256;
            ned.y = 320;
            ned.controls = nedControls;
            this.nedsTeam.add(ned);
        }
        let ned2Controls = controllers.getController(this.config.ned2Controller);
        if (ned2Controls) {
            let ned2 = new Player_1.Player(this.game, 'ned2');
            ned2.x = 256;
            ned2.y = 480;
            ned2.controls = ned2Controls;
            this.nedsTeam.add(ned2);
        }
        this.moustakisTeam = new Team_1.Team(this.game);
        let moustakiControls = controllers.getController(this.config.moustakiController);
        if (moustakiControls) {
            let moustaki = new Player_1.Player(this.game, 'moustaki');
            moustaki.x = 1024;
            moustaki.y = 320;
            moustaki.controls = moustakiControls;
            this.moustakisTeam.add(moustaki);
        }
        let moustaki2Controls = controllers.getController(this.config.moustaki2Controller);
        if (moustaki2Controls) {
            let moustaki2 = new Player_1.Player(this.game, 'moustaki2');
            moustaki2.x = 1024;
            moustaki2.y = 480;
            moustaki2.controls = moustaki2Controls;
            this.moustakisTeam.add(moustaki2);
        }
        this.nedsTeam.forEachAlive((player) => {
            if (player.controls instanceof Controls_1.CPUControls) {
                let cpu = new CPU_1.CPU();
                cpu.me = player;
                cpu.buddies = this.nedsTeam;
                cpu.opponents = this.moustakisTeam;
                cpu.controls = player.controls;
                this.cpus.push(cpu);
            }
        }, null);
        this.moustakisTeam.forEachAlive((player) => {
            if (player.controls instanceof Controls_1.CPUControls) {
                let cpu = new CPU_1.CPU();
                cpu.me = player;
                cpu.buddies = this.moustakisTeam;
                cpu.opponents = this.nedsTeam;
                cpu.controls = player.controls;
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
                this.damageResolver.arrowsVersusGroup(this.arrows, this.bombs);
                this.damageResolver.arrowsVersusGroup(this.arrows, this.nedsTeam);
                this.damageResolver.arrowsVersusGroup(this.arrows, this.moustakisTeam);
                this.damageResolver.groupVersusGroup(this.explosions, this.nedsTeam);
                this.damageResolver.groupVersusGroup(this.explosions, this.moustakisTeam);
                this.game.physics.arcade.collide(this.nedsTeam, this.collisionSprites);
                this.game.physics.arcade.collide(this.moustakisTeam, this.collisionSprites);
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
        this.nedsTeam.forEachAlive((player) => {
            isMenuAsked = isMenuAsked || player.controls.isMenuAsked();
        }, null);
        this.moustakisTeam.forEachAlive((player) => {
            isMenuAsked = isMenuAsked || player.controls.isMenuAsked();
        }, null);
        if (isMenuAsked) {
            this.showMenu();
        }
    }
    checkVictory() {
        if (!this.victory) {
            const nedsTeamWin = this.moustakisTeam.countLiving() === 0;
            const moustakisTeamWin = this.nedsTeam.countLiving() === 0;
            this.victory = nedsTeamWin || moustakisTeamWin;
            if (this.victory) {
                this.game.sound.stopAll();
                this.game.sound.play('victory-music', 1, false);
                let victoryText = this.game.add.sprite(this.game.world.centerX, 100, nedsTeamWin && moustakisTeamWin && 'draw' || nedsTeamWin && 'neds-win' || 'moustakis-win');
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
        this.game.load.atlasXML('ned', 'sprites/devnewton/ned.png', 'sprites/devnewton/player.xml');
        this.game.load.atlasXML('ned2', 'sprites/devnewton/ned2.png', 'sprites/devnewton/player.xml');
        this.game.load.atlasXML('moustaki', 'sprites/devnewton/moustaki.png', 'sprites/devnewton/player.xml');
        this.game.load.atlasXML('moustaki2', 'sprites/devnewton/moustaki2.png', 'sprites/devnewton/player.xml');
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Team selection', { font: "64px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        let ned = this.add.sprite(150, 175, 'ned', 0);
        this.game.addSpriteAnimation(ned, 'player.wait', 1);
        ned.play('player.wait', 8, true);
        let ned2 = this.add.sprite(150, 275, 'ned2', 0);
        this.game.addSpriteAnimation(ned2, 'player.wait', 1);
        ned2.play('player.wait', 8, true);
        let moustaki = this.add.sprite(1060, 375, 'moustaki', 0);
        this.game.addSpriteAnimation(moustaki, 'player.wait', 1);
        moustaki.play('player.wait', 8, true);
        let moustaki2 = this.add.sprite(1060, 475, 'moustaki2', 0);
        this.game.addSpriteAnimation(moustaki2, 'player.wait', 1);
        moustaki2.play('player.wait', 8, true);
        const menu = new Menu_1.Menu(this.game);
        let playerOptions = [
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.NONE, 'None'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.CPU, 'CPU'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.KEYBOARD_AND_MOUSE, 'Keyboard & mouse'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD1, 'Pad 1'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD2, 'Pad 2'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD3, 'Pad 3'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD4, 'Pad 4')
        ];
        this.nedSelect = menu.select(200, 150, playerOptions);
        this.ned2Select = menu.select(200, 250, playerOptions);
        this.moustakiSelect = menu.select(200, 350, playerOptions);
        this.moustaki2Select = menu.select(200, 450, playerOptions);
        this.autoSelect();
        menu.button("Play", 200, 600, () => {
            let config = new Level_1.LevelConfig();
            config.nedController = this.nedSelect.getSelectedValue();
            config.ned2Controller = this.ned2Select.getSelectedValue();
            config.moustakiController = this.moustakiSelect.getSelectedValue();
            config.moustaki2Controller = this.moustaki2Select.getSelectedValue();
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
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.KEYBOARD_AND_MOUSE);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            case 1:
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            case 2:
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.PAD2);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            case 3:
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.PAD2);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.PAD3);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.CPU);
                break;
            default:
                this.nedSelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                this.ned2Select.setSelectedValue(Controls_1.ControllerType.PAD2);
                this.moustakiSelect.setSelectedValue(Controls_1.ControllerType.PAD3);
                this.moustaki2Select.setSelectedValue(Controls_1.ControllerType.PAD4);
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
        this.game.load.image('school', 'title/background.jpg');
        this.game.load.audio('main-music', 'musics/opengameart/hungry-dino-9-chiptune-tracks-10-sfx/main.mp3');
        Menu_1.Menu.preload(this.game);
    }
    create() {
        super.create();
        this.game.sound.stopAll();
        this.game.sound.play('main-music', 1, true);
        this.game.add.image(0, 0, 'school');
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

require.register("utils/Controls.ts", function(exports, require, module) {
"use strict";
const GamepadUtils_1 = require("./GamepadUtils");
var ControllerType;
(function (ControllerType) {
    ControllerType[ControllerType["NONE"] = -2] = "NONE";
    ControllerType[ControllerType["CPU"] = -1] = "CPU";
    ControllerType[ControllerType["KEYBOARD_AND_MOUSE"] = 0] = "KEYBOARD_AND_MOUSE";
    ControllerType[ControllerType["PAD1"] = 1] = "PAD1";
    ControllerType[ControllerType["PAD2"] = 2] = "PAD2";
    ControllerType[ControllerType["PAD3"] = 3] = "PAD3";
    ControllerType[ControllerType["PAD4"] = 4] = "PAD4";
})(ControllerType = exports.ControllerType || (exports.ControllerType = {}));
class Controllers {
    constructor(game) {
        game.input.gamepad.start();
        this.controllers = [
            new KeyboardAndMouseControls(game),
            new PadControls(game, 1),
            new PadControls(game, 2),
            new PadControls(game, 3),
            new PadControls(game, 4),
        ];
    }
    getController(type) {
        switch (type) {
            case ControllerType.NONE:
                return null;
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
        this.droppingBomb = false;
        this.aimAngle = null;
        this.shooting = false;
    }
    reset() {
        this.goingUp = false;
        this.goingDown = false;
        this.goingLeft = false;
        this.goingRight = false;
        this.droppingBomb = false;
        this.aimAngle = null;
        this.shooting = false;
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
    isDroppingBomb() {
        return this.droppingBomb;
    }
    aimingAngle(playerPos) {
        return this.aimAngle;
    }
    isShooting() {
        return this.shooting;
    }
    isMenuAsked() {
        return false;
    }
}
exports.CPUControls = CPUControls;
class KeyboardAndMouseControls extends AbstractControls {
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
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }
    useQwertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.W;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.A;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }
    useOtherKeyboardLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.UP;
        this.keyCodeMoveDown = Phaser.KeyCode.DOWN;
        this.keyCodeMoveLeft = Phaser.KeyCode.LEFT;
        this.keyCodeMoveRight = Phaser.KeyCode.RIGHT;
        this.keyCodeMenu = Phaser.KeyCode.ESC;
    }
    isShooting() {
        return this.game.input.activePointer.rightButton.isDown;
    }
    aimingAngle(playerPos) {
        const pointer = this.game.input.activePointer;
        return Phaser.Math.angleBetween(playerPos.x, playerPos.y, pointer.worldX, pointer.worldY);
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
    isDroppingBomb() {
        return this.kb && this.game.input.activePointer.leftButton.isDown;
    }
    isMenuAsked() {
        return this.kb && this.kb.isDown(this.keyCodeMenu);
    }
}
exports.KeyboardAndMouseControls = KeyboardAndMouseControls;
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
                this.aimXAxis = layout.aimXAxis || Phaser.Gamepad.XBOX360_STICK_RIGHT_X;
                this.aimYAxis = layout.aimYAxis || Phaser.Gamepad.XBOX360_STICK_RIGHT_Y;
                this.shootButton = layout.shootButton || Phaser.Gamepad.XBOX360_RIGHT_BUMPER;
                this.menuButton = layout.menuButton || Phaser.Gamepad.XBOX360_START;
                this.droppingBombButton = layout.droppingBombButton || Phaser.Gamepad.XBOX360_LEFT_BUMPER;
            }
            return true;
        }
        else {
            return false;
        }
    }
    isShooting() {
        return this.checkPad() && this.pad.isDown(this.shootButton);
    }
    aimingAngle(playerPos) {
        return this.checkPad() && this.aimingAngleFromPad();
    }
    aimingAngleFromPad() {
        let dx = this.pad.axis(this.aimXAxis);
        let dy = this.pad.axis(this.aimYAxis);
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
    isDroppingBomb() {
        return this.checkPad() && this.pad.isDown(this.droppingBombButton);
    }
    isMenuAsked() {
        return this.checkPad() && this.pad.isDown(this.menuButton);
    }
}
exports.PadControls = PadControls;


});

require.register("utils/DamageResolver.ts", function(exports, require, module) {
"use strict";
const Arrow_1 = require("../entities/Arrow");
class DamageResolver {
    constructor(game) {
        this.game = game;
    }
    arrowsVersusGroup(arrows, groupB) {
        for (let arrow of arrows.children) {
            if (arrow instanceof Arrow_1.Arrow) {
                this.arrowVersusGroup(arrow.arrowCharge, groupB);
            }
        }
    }
    arrowVersusGroup(spriteA, groupB) {
        if (spriteA.exists) {
            for (let spriteB of groupB.children) {
                if (spriteB instanceof Phaser.Sprite) {
                    this.arrowVersusSprite(spriteA, spriteB);
                }
            }
        }
    }
    arrowVersusSprite(spriteA, spriteB) {
        if (this.checkArrowCollision(spriteA, spriteB)) {
            this.onCollide(spriteA, spriteB);
        }
    }
    checkArrowCollision(spriteA, spriteB) {
        let arrowChargeBound = spriteA.getBounds();
        let arrowChargeX = arrowChargeBound.x + arrowChargeBound.width / 2;
        let arrowChargeY = arrowChargeBound.y + arrowChargeBound.height / 2;
        return spriteA.exists && spriteB.exists && spriteB.getBounds().contains(arrowChargeX, arrowChargeY);
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
        if (!b.data.friends || !b.data.friends.includes(a.name)) {
            a.damage(1);
        }
        if (!a.data.friends || !a.data.friends.includes(b.name)) {
            b.damage(1);
        }
    }
}
exports.DamageResolver = DamageResolver;


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

require('BombernedApp');