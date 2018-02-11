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
//# sourceMappingURL=UnderthiefApp.js.map
});

require.register("UnderthiefGame.ts", function(exports, require, module) {
"use strict";
const Intro_1 = require("./states/Intro");
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
        this.state.add('Options', Options_1.Options);
        this.state.add('GamepadOptionsLayout', GamepadOptionsLayout_1.GamepadOptionsLayout);
        this.state.add('GamepadOptionsBindAxis', GamepadOptionsBindAxisOrButton_1.GamepadOptionsBindAxisOrButton);
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
exports.UnderthiefGame = UnderthiefGame;
//# sourceMappingURL=UnderthiefGame.js.map
});

;require.register("entities/Player.ts", function(exports, require, module) {
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
//# sourceMappingURL=Player.js.map
});

;require.register("entities/Team.ts", function(exports, require, module) {
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
//# sourceMappingURL=Team.js.map
});

;require.register("entities/Underwear.ts", function(exports, require, module) {
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
        this.body.bounce.x = 0.8;
        this.body.bounce.y = 0.8;
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
//# sourceMappingURL=Underwear.js.map
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
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad', { font: "42px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);
        let subtitle = this.game.add.text(0, 0, 'Move stick or press button to show gamepad number', { font: "32px monospace", fill: 'white' });
        subtitle.y = this.game.world.height - subtitle.height;
        new GamepadMenuButton(this.input.gamepad.pad1, 0xFF6666, "Gamepad 1", 200, 100, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 1);
        });
        new GamepadMenuButton(this.input.gamepad.pad2, 0x66FF66, "Gamepad 2", 200, 200, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 2);
        });
        new GamepadMenuButton(this.input.gamepad.pad3, 0x6666FF, "Gamepad 3", 200, 300, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 3);
        });
        new GamepadMenuButton(this.input.gamepad.pad4, 0xFFFF66, "Gamepad 4", 200, 400, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 4);
        });
        new MenuButton_1.MenuButton(this.game, "Back", 200, 550, () => this.game.state.start('Options'));
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

;require.register("states/GamepadOptionsBindAxisOrButton.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const MenuButton_1 = require("../ui/MenuButton");
class GamepadOptionsBindAxisOrButton extends AbstractState_1.AbstractState {
    constructor() {
        super();
        this.bindings = [
            { label: 'Pull move X axis', localStorageKeySuffix: 'moveXAxis' },
            { label: 'Pull move Y axis', localStorageKeySuffix: 'moveYAxis' },
            { label: 'Press hammer button', localStorageKeySuffix: 'hammerButton' },
            { label: 'Press shoot button', localStorageKeySuffix: 'shootButton' },
            { label: 'Press dash button', localStorageKeySuffix: 'dashButton' }
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
            this.game.controllers.getPad(this.padIndex).useCustomGamepadLayout(padIndex);
            this.game.state.start('GamepadOptions');
        }
        else {
            this.currentBinding = binding;
        }
        this.waitForNoInput = 60;
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindings[this.currentBinding].label, { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Back", 200, 500, () => this.game.state.start('GamepadOptions'));
    }
    update() {
        super.update();
        if (this.bindings[this.currentBinding].localStorageKeySuffix.match(/axis/gi)) {
            this.detectAxis();
        }
        else {
            this.detectButton();
        }
    }
    detectAxis() {
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
    detectButton() {
        let activationZone = Math.max(0.99, Math.min(0.8, 4 * this.pad.deadZone));
        for (var k in Phaser.Gamepad) {
            if (k.startsWith('BUTTON_')) {
                let buttonCode = Phaser.Gamepad[k];
                if (Math.abs(this.pad.buttonValue(buttonCode)) >= activationZone) {
                    if (this.waitForNoInput > 0) {
                        return;
                    }
                    else {
                        localStorage.setItem('gamepad' + this.padIndex + '.layout.custom.' + this.bindings[this.currentBinding].localStorageKeySuffix, buttonCode);
                        this.game.state.start('GamepadOptionsBindAxis', true, false, this.padIndex, this.currentBinding + 1);
                        return;
                    }
                }
            }
        }
        this.waitForNoInput--;
    }
}
exports.GamepadOptionsBindAxisOrButton = GamepadOptionsBindAxisOrButton;
//# sourceMappingURL=GamepadOptionsBindAxisOrButton.js.map
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
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad layout', { font: "42px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Xbox", 200, 200, () => {
            this.game.controllers.getPad(this.padIndex).useXboxLayout(this.padIndex);
            this.game.state.start('Options');
        });
        new MenuButton_1.MenuButton(this.game, "Custom", 200, 300, () => {
            this.game.state.start('GamepadOptionsBindAxis', true, false, this.padIndex);
        });
        new MenuButton_1.MenuButton(this.game, "Back", 200, 500, () => this.game.state.start('Options'));
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
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Choose keyboard layout', { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Azerty zsqd hjk", 200, 100, () => {
            this.game.controllers.getKeyboard().useAzertyLayout();
            this.game.state.start('Options');
        });
        new MenuButton_1.MenuButton(this.game, "Qwerty wsad hjk", 200, 200, () => {
            this.game.controllers.getKeyboard().useQwertyLayout();
            this.game.state.start('Options');
        });
        new MenuButton_1.MenuButton(this.game, "Others ⬆⬇⬅➡ ⎇␣⎈", 200, 300, () => {
            this.game.controllers.getKeyboard().useOtherKeyboardLayout();
            this.game.state.start('Options');
        });
        new MenuButton_1.MenuButton(this.game, "Custom", 200, 400, () => {
            this.game.controllers.getKeyboard().useOtherKeyboardLayout();
            this.game.state.start('KeyboardOptionsBindKey', true, false);
        });
        new MenuButton_1.MenuButton(this.game, "Back", 200, 600, () => this.game.state.start('Options'));
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
            { label: 'Press hammer key', localStorageKey: 'keyboard.layout.custom.hammer' },
            { label: 'Press shoot key', localStorageKey: 'keyboard.layout.custom.shoot' },
            { label: 'Press dash key', localStorageKey: 'keyboard.layout.custom.dash' }
        ];
        this.currentBinding = 0;
    }
    preload() {
        MenuButton_1.MenuButton.preload(this.game);
    }
    init(binding = 0) {
        if (binding >= this.bindings.length) {
            this.currentBinding = 0;
            this.game.controllers.getKeyboard().useCustomKeyboardLayout();
            this.game.state.start('KeyboardOptions');
        }
        else {
            this.currentBinding = binding;
        }
    }
    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindings[this.currentBinding].label, { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Back", 200, 600, () => this.game.state.start('KeyboardOptions'));
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
const Player_1 = require("../entities/Player");
const Underwear_1 = require("../entities/Underwear");
const Team_1 = require("../entities/Team");
const Pathfinder_1 = require("../ia/services/Pathfinder");
class LevelConfig {
}
exports.LevelConfig = LevelConfig;
class Level extends AbstractState_1.AbstractState {
    constructor() {
        super();
        this.isNotFirstFrame = false;
    }
    preload() {
        Player_1.Player.preload(this.game);
        Underwear_1.Underwear.preload(this.game);
        this.game.load.tilemap('map', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('interior', 'sprites/opengameart/LPC_house_interior/interior.png');
        this.game.load.image('arabic1', 'sprites/opengameart/arabic_set/arabic1.png');
        this.game.load.image('house_inside', 'sprites/opengameart/house_inside.png');
        this.game.load.image('misc', 'sprites/opengameart/misc.png');
    }
    init(config) {
        this.config = config;
    }
    create() {
        super.create();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        const map = this.game.add.tilemap('map');
        map.addTilesetImage('interior');
        map.addTilesetImage('arabic1');
        map.addTilesetImage('house_inside');
        map.addTilesetImage('misc');
        const layer = map.createLayer('ground');
        map.createLayer('doors_and_furnitures');
        layer.resizeWorld();
        this.collisionSprites = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
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
        this.braCapturePoints = new Underwear_1.UnderwearCapturePoints(this.game, map, 'bra');
        this.boxersCapturePoints = new Underwear_1.UnderwearCapturePoints(this.game, map, 'boxers');
        this.underwearCaptureCollisionResolver = new Underwear_1.UnderwearCaptureCollisionResolver(this.game);
        this.pathfinder = new Pathfinder_1.Pathfinder(map);
        let controllers = this.game.controllers;
        this.leftTeam = new Team_1.Team(this.game);
        let betty = new Player_1.Player(this.game, 'betty');
        betty.x = 256;
        betty.y = 320;
        betty.controls = controllers.getController(this.config.bettyController);
        this.leftTeam.add(betty);
        let betty2 = new Player_1.Player(this.game, 'betty2');
        betty2.x = 256;
        betty2.y = 480;
        betty2.controls = controllers.getController(this.config.betty2Controller);
        this.leftTeam.add(betty2);
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
        this.rightTeam = new Team_1.Team(this.game);
        let george = new Player_1.Player(this.game, 'george');
        george.x = 1024;
        george.y = 320;
        george.controls = controllers.getController(this.config.georgeController);
        this.rightTeam.add(george);
        let george2 = new Player_1.Player(this.game, 'george2');
        george2.x = 1024;
        george2.y = 480;
        george2.controls = controllers.getController(this.config.george2Controller);
        this.rightTeam.add(george2);
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
    }
    update() {
        if (this.isNotFirstFrame) {
            this.teamCollisionResolver.groupVersusGroup(this.leftTeam, this.rightTeam);
            this.underwearCaptureCollisionResolver.groupVersusGroup(this.braGroup, this.braCapturePoints);
            this.underwearCaptureCollisionResolver.groupVersusGroup(this.boxersGroup, this.boxersCapturePoints);
            this.game.physics.arcade.collide(this.braGroup);
            this.game.physics.arcade.collide(this.boxersGroup);
            this.game.physics.arcade.collide(this.braGroup, this.boxersGroup);
            this.game.physics.arcade.collide(this.braGroup, this.leftTeam);
            this.game.physics.arcade.collide(this.boxersGroup, this.leftTeam);
            this.game.physics.arcade.collide(this.braGroup, this.rightTeam);
            this.game.physics.arcade.collide(this.boxersGroup, this.rightTeam);
            this.game.physics.arcade.collide(this.leftTeam, this.collisionSprites);
            this.game.physics.arcade.collide(this.rightTeam, this.collisionSprites);
            this.game.physics.arcade.collide(this.braGroup, this.collisionSprites);
            this.game.physics.arcade.collide(this.boxersGroup, this.collisionSprites);
        }
        else {
            this.isNotFirstFrame = true;
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
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Options', { font: "100px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        let y = 100;
        new MenuButton_1.MenuButton(this.game, "Keyboard", 200, y += 150, () => this.game.state.start('KeyboardOptions'));
        if (this.input.gamepad.supported) {
            new MenuButton_1.MenuButton(this.game, "Gamepad", 200, y += 150, () => this.game.state.start('GamepadOptions'));
        }
        new MenuButton_1.MenuButton(this.game, "Back", 200, y += 150, () => this.game.state.start('Title'));
    }
}
exports.Options = Options;
//# sourceMappingURL=Options.js.map
});

;require.register("states/TeamSelectScreen.ts", function(exports, require, module) {
"use strict";
const AbstractState_1 = require("./AbstractState");
const Level_1 = require("./Level");
const MenuButton_1 = require("../ui/MenuButton");
const MenuSelect_1 = require("../ui/MenuSelect");
const Controls_1 = require("../utils/Controls");
class TeamSelectScreen extends AbstractState_1.AbstractState {
    constructor() {
        super();
    }
    preload() {
        MenuButton_1.MenuButton.preload(this.game);
        MenuSelect_1.MenuSelect.preload(this.game);
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
        let playerOptions = [
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.CPU, 'CPU'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.KEYBOARD, 'Keyboard'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD1, 'Pad 1'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD2, 'Pad 2'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD4, 'Pad 3'),
            new MenuSelect_1.MenuSelectOption(Controls_1.ControllerType.PAD4, 'Pad 4')
        ];
        let bettySelect = new MenuSelect_1.MenuSelect(this.game, 200, 150, playerOptions);
        let betty2Select = new MenuSelect_1.MenuSelect(this.game, 200, 250, playerOptions);
        let georgeSelect = new MenuSelect_1.MenuSelect(this.game, 200, 350, playerOptions);
        let george2Select = new MenuSelect_1.MenuSelect(this.game, 200, 450, playerOptions);
        switch (this.input.gamepad.padsConnected) {
            case 0:
                bettySelect.setSelectedValue(Controls_1.ControllerType.KEYBOARD);
                break;
            case 1:
                bettySelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                break;
            case 2:
                bettySelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                georgeSelect.setSelectedValue(Controls_1.ControllerType.PAD2);
                break;
            case 3:
                bettySelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                betty2Select.setSelectedValue(Controls_1.ControllerType.PAD2);
                georgeSelect.setSelectedValue(Controls_1.ControllerType.PAD3);
                break;
            default:
                bettySelect.setSelectedValue(Controls_1.ControllerType.PAD1);
                betty2Select.setSelectedValue(Controls_1.ControllerType.PAD2);
                georgeSelect.setSelectedValue(Controls_1.ControllerType.PAD3);
                george2Select.setSelectedValue(Controls_1.ControllerType.PAD4);
                break;
        }
        new MenuButton_1.MenuButton(this.game, "Play", 200, 600, () => {
            let config = new Level_1.LevelConfig();
            config.bettyController = bettySelect.getSelectedValue();
            config.betty2Controller = betty2Select.getSelectedValue();
            config.georgeController = georgeSelect.getSelectedValue();
            config.george2Controller = george2Select.getSelectedValue();
            this.game.state.start('Level', true, true, config);
        });
    }
}
exports.TeamSelectScreen = TeamSelectScreen;
//# sourceMappingURL=TeamSelectScreen.js.map
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
        this.game.load.image('school', 'title/school.jpg');
        this.game.load.image('logo', 'title/logo.png');
        MenuButton_1.MenuButton.preload(this.game);
    }
    create() {
        super.create();
        this.game.add.image(0, 0, 'school');
        let logo = this.game.add.sprite(this.game.world.centerX, 10, 'logo');
        logo.scale.x = 1.4;
        logo.scale.y = 1.4;
        logo.anchor.setTo(0.5, 0);
        new MenuButton_1.MenuButton(this.game, "Start", 200, 250, () => this.game.state.start('TeamSelectScreen'));
        new MenuButton_1.MenuButton(this.game, "Options", 200, 400, () => this.game.state.start('Options'));
        new MenuButton_1.MenuButton(this.game, "Help", 200, 550, () => this.game.state.start('Help'));
    }
}
exports.Title = Title;
//# sourceMappingURL=Title.js.map
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

;require.register("ui/MenuSelect.ts", function(exports, require, module) {
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
    static preload(game) {
        game.load.atlasXML('menu-buttons', 'menu/buttons.png', 'menu/buttons.xml');
    }
}
exports.MenuSelect = MenuSelect;
//# sourceMappingURL=MenuSelect.js.map
});

;require.register("utils/CollisionResolver.ts", function(exports, require, module) {
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
//# sourceMappingURL=CollisionResolver.js.map
});

;require.register("utils/Controls.ts", function(exports, require, module) {
"use strict";
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
                return null;
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
class KeyboardControls extends AbstractControls {
    constructor(game) {
        super();
        this.game = game;
        game.input.gamepad.start();
        this.setupKeyboardLayout();
    }
    setupKeyboardLayout() {
        this.kb = this.game.input.keyboard;
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
        this.keyCodeHammerTime = Phaser.KeyCode.H;
        this.keyCodeShoot = Phaser.KeyCode.J;
        this.keyCodeDash = Phaser.KeyCode.K;
        localStorage.setItem('keyboard.layout', 'azerty');
    }
    useQwertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.W;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.A;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeHammerTime = Phaser.KeyCode.H;
        this.keyCodeShoot = Phaser.KeyCode.J;
        this.keyCodeDash = Phaser.KeyCode.K;
        localStorage.setItem('keyboard.layout', 'qwerty');
    }
    useOtherKeyboardLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.UP;
        this.keyCodeMoveDown = Phaser.KeyCode.DOWN;
        this.keyCodeMoveLeft = Phaser.KeyCode.LEFT;
        this.keyCodeMoveRight = Phaser.KeyCode.RIGHT;
        this.keyCodeHammerTime = Phaser.KeyCode.ALT;
        this.keyCodeShoot = Phaser.KeyCode.SPACEBAR;
        this.keyCodeDash = Phaser.KeyCode.CONTROL;
        localStorage.setItem('keyboard.layout', 'other');
    }
    useCustomKeyboardLayout() {
        this.keyCodeMoveUp = this.readNumberFromLocalStorage('keyboard.layout.custom.moveUp', Phaser.KeyCode.UP);
        this.keyCodeMoveDown = this.readNumberFromLocalStorage('keyboard.layout.custom.moveDown', Phaser.KeyCode.DOWN);
        this.keyCodeMoveLeft = this.readNumberFromLocalStorage('keyboard.layout.custom.moveLeft', Phaser.KeyCode.LEFT);
        this.keyCodeMoveRight = this.readNumberFromLocalStorage('keyboard.layout.custom.moveRight', Phaser.KeyCode.RIGHT);
        this.keyCodeShoot = this.readNumberFromLocalStorage('keyboard.layout.custom.shoot', Phaser.KeyCode.SPACEBAR);
        this.keyCodeHammerTime = this.readNumberFromLocalStorage('keyboard.layout.custom.hammer', Phaser.KeyCode.ALT);
        this.keyCodeDash = this.readNumberFromLocalStorage('keyboard.layout.custom.dash', Phaser.KeyCode.CONTROL);
        localStorage.setItem('keyboard.layout', 'custom');
    }
    shootingAngle(playerPos) {
        if (this.kb && this.kb.isDown(this.keyCodeShoot)) {
            return this.lookingAngle();
        }
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
}
exports.KeyboardControls = KeyboardControls;
class PadControls extends AbstractControls {
    constructor(game, padIndex) {
        super();
        this.game = game;
        game.input.gamepad.start();
        this.setupGamepadLayout(padIndex);
    }
    setupGamepadLayout(padIndex) {
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
        this.shootButton = Phaser.Gamepad.XBOX360_A;
        this.dashButton = Phaser.Gamepad.XBOX360_X;
        this.hammerTimeButton = Phaser.Gamepad.XBOX360_B;
        localStorage.setItem('gamepad' + padIndex + '.layout', 'xbox');
    }
    useCustomGamepadLayout(padIndex) {
        padIndex = padIndex || 1;
        this.pad = this.game.input.gamepad['pad' + padIndex];
        this.moveXAxis = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.moveXAxis', Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        this.moveYAxis = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.moveYAxis', Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        this.shootButton = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.shootButton', Phaser.Gamepad.XBOX360_A);
        this.dashButton = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.dashButton', Phaser.Gamepad.XBOX360_X);
        this.hammerTimeButton = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.hammerTimeButton', Phaser.Gamepad.XBOX360_B);
        localStorage.setItem('gamepad' + padIndex + '.layout', 'custom');
    }
    shootingAngle(playerPos) {
        if (this.pad && this.pad.isDown(this.shootButton)) {
            return this.lookingAngle();
        }
    }
    dashingAngle(playerPos) {
        if (this.pad && this.pad.isDown(this.dashButton)) {
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
        return this.pad && this.pad.axis(this.moveYAxis) < -this.pad.deadZone;
    }
    isGoingDown() {
        return this.pad && this.pad.axis(this.moveYAxis) > this.pad.deadZone;
    }
    isGoingLeft() {
        return this.pad && this.pad.axis(this.moveXAxis) < -this.pad.deadZone;
    }
    isGoingRight() {
        return this.pad && this.pad.axis(this.moveXAxis) > this.pad.deadZone;
    }
    isHammerTime() {
        return this.pad && this.pad.isDown(this.hammerTimeButton);
    }
}
exports.PadControls = PadControls;
//# sourceMappingURL=Controls.js.map
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('UnderthiefApp');
//# sourceMappingURL=app.js.map