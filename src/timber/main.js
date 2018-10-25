window.focus();
var best = 0;

function crat() {
    widthTemp = window.innerWidth * window.devicePixelRatio, heightTemp = window.innerHeight * window.devicePixelRatio, width = heightTemp * ratioWH, height = heightTemp, widthTemp / height < ratioWH && (width = widthTemp, height = widthTemp / ratioWH), ratio = width / SAFE_ZONE_WIDTH
}
var ratioWH, widthTemp, heightTemp, width, height, ratio, gameState;
const SAFE_ZONE_WIDTH = 1080,
    SAFE_ZONE_HEIGHT = 1775;
ratioWH = SAFE_ZONE_WIDTH / SAFE_ZONE_HEIGHT, crat();
var GAME_START = !1,
    GAME_OVER = !1,
    game = new Phaser.Game(width, height, Phaser.AUTO, "timberman");
game.transparent = !0, gameState = {}, gameState.load = function () {}, gameState.main = function () {}, gameState.load.prototype = {
    preload: function () {
        game.load.atlas("man", "img/man.png", "data/man.json"), game.load.image("rip", "img/rip.png"), game.load.image("timeContainer", "img/time-container.png"), game.load.image("timeBar", "img/time-bar.png"), game.load.image("background", "img/background.png"), game.load.image("trunk1", "img/trunk1.png"), game.load.image("trunk2", "img/trunk2.png"), game.load.image("branchLeft", "img/branch1.png"), game.load.image("branchRight", "img/branch2.png"), game.load.image("stump", "img/stump.png"), game.load.atlas("numbers", "img/numbers.png", "data/numbers.json"), game.load.atlas("levelNumbers", "img/levelNumbers.png", "data/numbers.json"), game.load.image("level", "img/level.png"), game.load.image("gameOver", "img/game-over.png"), game.load.image("buttonPlay", "img/btn-play.png"), game.load.image("instructions", "img/instructions.png"), game.load.audio("soundCut", ["sons/cut.ogg"]), game.load.audio("soundMenu", ["sons/menu.ogg"]), game.load.audio("soundDeath", ["sons/death.ogg"])
    },
    create: function () {
        game.state.start("main")
    }
}, gameState.main.prototype = {
    create: function () {
        var r, n, i, t;
        game.physics.startSystem(Phaser.Physics.ARCADE), game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL, game.scale.setShowAll(), window.addEventListener("resize", function () {
            game.scale.refresh()
        }), game.scale.refresh(), this.background = game.add.sprite(0, 0, "background"), this.background.width = game.width, this.background.height = game.height, game.input.onDown.add(this.listener, this), this.stump = game.add.sprite(0, 0, "stump"), this.stump.scale = {
            x: ratio,
            y: ratio
        }, this.stump.x = 352 * ratio, this.stump.y = 1394 * ratio, this.HEIGHT_TRUNK = 243 * ratio, this.constructTree(), this.canCut = !0, this.man = game.add.sprite(0, 1070 * ratio, "man"), this.man.scale = {
            x: ratio,
            y: ratio
        }, this.man.animations.add("breath", [0, 1]), this.man.animations.add("cut", [1, 2, 3, 4]), this.man.animations.play("breath", 3, !0), this.manPosition = "left", this.timeContainer = game.add.sprite(0, 100 * ratio, "timeContainer"), this.timeContainer.scale = {
            x: ratio,
            y: ratio
        }, this.timeContainer.x = game.width / 2 - this.timeContainer.width / 2, this.timeBar = game.add.sprite(0, 130 * ratio, "timeBar"), this.timeBar.scale = {
            x: ratio,
            y: ratio
        }, this.timeBar.x = game.width / 2 - this.timeBar.width / 2, this.timeBarWidth = this.timeBar.width / 2, r = new Phaser.Rectangle(0, 0, this.timeBarWidth / ratio, this.timeBar.height / ratio), this.timeBar.crop(r), this.timeBar.updateCrop(), this.currentScore = 0, n = game.add.sprite(game.width / 2, 440 * ratio, "numbers"), n.scale = {
            x: ratio,
            y: ratio
        }, n.animations.add("number"), n.animations.frame = this.currentScore, n.x -= n.width / 2, this.spritesScoreNumbers = [], this.spritesScoreNumbers.push(n), this.currentLevel = 1, i = 290 * ratio, this.level = game.add.sprite(0, i, "level"), this.level.scale = {
            x: ratio,
            y: ratio
        }, this.level.alpha = 0, t = game.add.sprite(0, i, "levelNumbers"), t.scale = {
            x: ratio,
            y: ratio
        }, t.alpha = 0, t.animations.add("number"), t.animations.frame = this.currentLevel, this.spritesLevelNumbers = [], this.spritesLevelNumbers.push(t), this.buttonPlay = game.add.sprite(0, 1200 * ratio, "buttonPlay"), this.buttonPlay.scale = {
            x: ratio,
            y: ratio
        }, this.buttonPlay.x = game.width / 2 - this.buttonPlay.width / 2, this.buttonPlay.alpha = 0, this.instructions = game.add.sprite(0, 1070 * ratio, "instructions"), this.instructions.scale = {
            x: ratio,
            y: ratio
        }, this.instructions.x = game.width / 2 - this.instructions.width / 2, this.soundMenu = game.add.audio("soundMenu", 1), this.soundDeath = game.add.audio("soundDeath", 1), this.soundCut = game.add.audio("soundCut", 1)
    },
    update: function () {
        if (GAME_START)
            if (this.timeBarWidth > 0) {
                this.timeBarWidth -= (.6 + .1 * this.currentLevel) * ratio;
                var n = new Phaser.Rectangle(0, 0, this.timeBarWidth / ratio, this.timeBar.height / ratio);
                this.timeBar.crop(n), this.timeBar.updateCrop()
            } else this.death();
        GAME_OVER ? game.input.keyboard.justPressed(Phaser.Keyboard.ENTER) && (GAME_OVER = !1, this.soundMenu.play(), game.state.start("main")) : game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) ? this.listener("left") : game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) && this.listener("right")
    },
    constructTree: function () {
        this.tree = game.add.group(), this.tree.create(37 * ratio, 1151 * ratio, "trunk1"), this.tree.create(37 * ratio, 1151 * ratio - this.HEIGHT_TRUNK, "trunk2"), this.tree.setAll("scale", {
            x: ratio,
            y: ratio
        });
        for (var n = 0; n < 4; n++) this.addTrunk()
    },
    increaseScore: function () {
        this.currentScore++, this.currentScore % 20 == 0 && this.increaseLevel(), this.timeBarWidth += 12 * ratio;
        for (var n = 0; n < this.spritesScoreNumbers.length; n++) this.spritesScoreNumbers[n].kill();
        this.spritesScoreNumbers = [], this.spritesScoreNumbers = this.createSpritesNumbers(this.currentScore, "numbers", 440 * ratio, 1)
    },
    increaseLevel: function () {
        var i, t, n, r;
        for (this.currentLevel++, i = 0; i < this.spritesLevelNumbers.length; i++) this.spritesLevelNumbers[i].kill();
        for (this.spritesLevelNumbers = [], this.spritesLevelNumbers = this.createSpritesNumbers(this.currentLevel, "levelNumbers", this.level.y, 0), this.level.x = 0, n = 0; n < this.spritesLevelNumbers.length; n++) this.spritesLevelNumbers[n].x = this.level.width + 20, n != 0 && (this.spritesLevelNumbers[n].x = this.level.width + 20 + this.spritesLevelNumbers[n - 1].width);
        for (t = game.add.group(), t.add(this.level), n = 0; n < this.spritesLevelNumbers.length; n++) t.add(this.spritesLevelNumbers[n]);
        for (t.x = game.width / 2 - t.width / 2, n = 0; n < this.spritesLevelNumbers.length; n++) game.add.tween(this.spritesLevelNumbers[n]).to({
            alpha: 1
        }, 300, Phaser.Easing.Linear.None, !0);
        game.add.tween(this.level).to({
            alpha: 1
        }, 300, Phaser.Easing.Linear.None, !0), r = this, setTimeout(function () {
            for (var n = 0; n < r.spritesLevelNumbers.length; n++) game.add.tween(r.spritesLevelNumbers[n]).to({
                alpha: 0
            }, 300, Phaser.Easing.Linear.None, !0);
            game.add.tween(r.level).to({
                alpha: 0
            }, 300, Phaser.Easing.Linear.None, !0)
        }, 1500)
    },
    cutTrunk: function () {
        var n, t, i;
        this.soundCut.stop(), this.soundCut.play(), this.addTrunk(), this.increaseScore(), n = game.add.sprite(37 * ratio, 1151 * ratio, this.tree.getAt(0).key), n.scale = {
            x: ratio,
            y: ratio
        }, game.physics.enable(n, Phaser.Physics.ARCADE), n.anchor.setTo(.5, .5), n.x += n.width / 2, n.y += n.height / 2, t = 0, this.manPosition == "left" ? (n.body.velocity.x = 800 * window.devicePixelRatio, t = -500) : (n.body.velocity.x = -800 * window.devicePixelRatio, t = 500), n.body.velocity.y = -600 * window.devicePixelRatio, n.body.gravity.y = 2e3 * window.devicePixelRatio, game.add.tween(n).to({
            angle: n.angle + t
        }, 1e3, Phaser.Easing.Linear.None, !0), this.tree.remove(this.tree.getAt(0)), this.canCut = !1, i = this, this.tree.forEach(function (n) {
            var t = game.add.tween(n).to({
                y: n.y + i.HEIGHT_TRUNK
            }, 100, Phaser.Easing.Linear.None, !0);
            t.onComplete.add(function () {
                i.canCut = !0
            }, i)
        })
    },
    addTrunk: function () {
        var n = ["trunk1", "trunk2"],
            t = ["branchLeft", "branchRight"];
        t.indexOf(this.tree.getAt(this.tree.length - 1).key) == -1 ? Math.random() * 4 <= 1 ? this.tree.create(37 * ratio, this.stump.y - this.HEIGHT_TRUNK * (this.tree.length + 1), n[Math.floor(Math.random() * 2)]) : this.tree.create(37 * ratio, this.stump.y - this.HEIGHT_TRUNK * (this.tree.length + 1), t[Math.floor(Math.random() * 2)]) : this.tree.create(37 * ratio, this.stump.y - this.HEIGHT_TRUNK * (this.tree.length + 1), n[Math.floor(Math.random() * 2)]), this.tree.setAll("scale", {
            x: ratio,
            y: ratio
        })
    },
    listener: function (n) {
        var t, i, r;
        this.canCut && (GAME_START || (GAME_START = !0), this.instructions.kill(), n == "left" || n == "right" ? n == "left" ? (this.man.anchor.setTo(0, 0), this.man.scale.x = ratio, this.man.x = 0, this.manPosition = "left") : (this.man.anchor.setTo(1, 0), this.man.scale.x = -ratio, this.man.x = game.width - Math.abs(this.man.width), this.manPosition = "right") : game.input.activePointer.x <= game.width / 2 ? (this.man.anchor.setTo(0, 0), this.man.scale.x = ratio, this.man.x = 0, this.manPosition = "left") : (this.man.anchor.setTo(1, 0), this.man.scale.x = -ratio, this.man.x = game.width - Math.abs(this.man.width), this.manPosition = "right"), t = this.tree.getAt(0).key, i = this.tree.getAt(1).key, t == "branchLeft" && this.manPosition == "left" || t == "branchRight" && this.manPosition == "right" ? this.death() : (this.man.animations.stop("breath", !0), r = this.man.animations.play("cut", 15), r.onComplete.add(function () {
            this.man.animations.play("breath", 3, !0)
        }, this), this.cutTrunk(), (i == "branchLeft" && this.manPosition == "left" || i == "branchRight" && this.manPosition == "right") && this.death()))
    },
    death: function () {
        var n, t, i;
        for (GAME_START = !1, GAME_OVER = !0, this.canCut = !1, game.input.onDown.removeAll(), this.soundDeath.play(), n = this, game.add.tween(this.timeBar).to({
                y: this.timeBar.y - 550 * ratio
            }, 150, Phaser.Easing.Linear.None, !0), game.add.tween(this.timeContainer).to({
                y: this.timeContainer.y - 550 * ratio
            }, 150, Phaser.Easing.Linear.None, !0), t = 0; t < this.spritesScoreNumbers.length; t++) game.add.tween(this.spritesScoreNumbers[t]).to({
            y: this.spritesScoreNumbers[t].y - 550 * ratio
        }, 150, Phaser.Easing.Linear.None, !0);
        i = game.add.tween(this.man).to({
            alpha: 0
        }, 300, Phaser.Easing.Linear.None, !0), i.onComplete.add(function () {
            n.rip = game.add.sprite(0, 0, "rip"), n.rip.alpha = 0, game.add.tween(n.rip).to({
                alpha: 1
            }, 300, Phaser.Easing.Linear.None, !0), n.rip.scale = {
                x: ratio,
                y: ratio
            }, n.rip.x = this.manPosition == "left" ? this.man.x + 50 * ratio : this.man.x + 200 * ratio, n.rip.y = this.man.y + this.man.height - n.rip.height, n.gameFinish()
        }, this)
    },
    gameFinish: function () {
        var n, t, i, r;
        this.gameOver = game.add.sprite(0, 0, "gameOver"), this.gameOver.scale = {
            x: ratio,
            y: ratio
        }, this.gameOver.x = game.width / 2 - this.gameOver.width / 2, this.gameOver.y -= game.height, n = this, t = best, (t == null || t != null && t < this.currentScore) && (best = this.currentScore, t = this.currentScore), i = t.toString().split(""), r = 0, this.spritesBestScoreNumbers = this.createSpritesNumbers(t, "numbers", 730 * ratio, 0), this.spritesScoreNumbers = this.createSpritesNumbers(this.currentScore, "numbers", 945 * ratio, 0), game.add.tween(this.gameOver).to({
            y: 0
        }, 300, Phaser.Easing.Linear.None, !0).onComplete.add(function () {
            for (var t = 0; t < n.spritesBestScoreNumbers.length; t++) game.add.tween(n.spritesBestScoreNumbers[t]).to({
                alpha: 1
            }, 150, Phaser.Easing.Linear.None, !0);
            for (t = 0; t < n.spritesScoreNumbers.length; t++) game.add.tween(n.spritesScoreNumbers[t]).to({
                alpha: 1
            }, 150, Phaser.Easing.Linear.None, !0);
            game.add.tween(n.buttonPlay).to({
                alpha: 1
            }, 300, Phaser.Easing.Linear.None, !0), n.buttonPlay.inputEnabled = !0, n.buttonPlay.events.onInputDown.add(function () {
                n.buttonPlay.y += 10 * ratio
            }, this), this.buttonPlay.events.onInputUp.add(function () {
                n.buttonPlay.y -= 10 * ratio, GAME_OVER = !1, n.soundMenu.play(), game.state.start("main")
            }, this)
        }, n)
    },
    createSpritesNumbers: function (n, t, i, r) {
        for (var h = n.toString().split(""), c = 0, e = [], o, f, s, u = 0; u < h.length; u++) o = 0, u > 0 && (o = 5 * ratio), f = game.add.sprite(c + o, i, t), f.scale = {
            x: ratio,
            y: ratio
        }, f.alpha = r, f.animations.add("number"), f.animations.frame = +h[u], e.push(f), c += f.width + o;
        for (s = game.add.group(), u = 0; u < e.length; u++) s.add(e[u]);
        return s.x = game.width / 2 - s.width / 2, e
    }
}, game.state.add("load", gameState.load), game.state.add("main", gameState.main), game.state.start("load")
