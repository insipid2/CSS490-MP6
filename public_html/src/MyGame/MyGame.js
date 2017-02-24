/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    // The camera to view the scene
    this.mCamera = null;
    
    this.kMinionSprite = "assets/minion_sprite.png";
    
    // 0: hero, 1-5: enemies
    this.mObjects = [];
    this.mHero = null;
    this.mEnemies = [];
    
    // inidicates which object is currently selected
    // 0: hero, 1-5: enemies
    this.kSelected = 0;
    this.mMsg = null;

    this.mLineSet = [];
    this.mCurrentLine = null;
    this.mP1 = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                       // width of camera
        [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
       
    this.mHero = new Hero(this.kMinionSprite);
    this.mObjects.push(this.mHero);
    
    for(var i = 1; i < 6; i++) {
        this.mObjects.push(new Wing(this.kMinionSprite));
        this.mObjects[i].getXform().setPosition(Math.random() * 80 + 10, Math.random() * 55 + 10);
    }    
    
    
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(5, 5);
    this.mMsg.setTextHeight(3);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    var i, l;
    for (i = 0; i < this.mLineSet.length; i++) {
        l = this.mLineSet[i];
        l.draw(this.mCamera);
    }
    for (var i = 0; i < this.mObjects.length; i++) {
        this.mObjects[i].draw(this.mCamera);
    }
    this.mMsg.draw(this.mCamera);   // only draw status in the main camera
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    var msg = "Current: " + this.kSelected + " Radius: " + this.mObjects[this.kSelected].getRadius();
    var echo = "";
    var x, y;

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        this.kSelected++;
        if (this.kSelected > 5) {
            this.kSelected = 0;
        }
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        this.kSelected--;
        if (this.kSelected < 0) {
            this.kSelected = 5;
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        this.mObjects[this.kSelected].incRadius();
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        
        if(this.mObjects[this.kSelected].getRadius() > 1) {
            this.mObjects[this.kSelected].decRadius();
        }
    }
    
    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Middle)) {
        var len = this.mLineSet.length;
        if (len > 0) {
            this.mCurrentLine = this.mLineSet[len - 1];
            x = this.mCamera.mouseWCX();
            y = this.mCamera.mouseWCY();
            echo += "Selected " + len + " ";
            echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";
            this.mCurrentLine.setFirstVertex(x, y);
        }
    }

    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
        x = this.mCamera.mouseWCX();
        y = this.mCamera.mouseWCY();
        echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";

        if (this.mCurrentLine === null) { // start a new one
            this.mCurrentLine = new LineRenderable();
            this.mCurrentLine.setFirstVertex(x, y);
            this.mLineSet.push(this.mCurrentLine);
        } else {
            this.mCurrentLine.setSecondVertex(x, y);
        }
    } else {
        this.mCurrentLine = null;
        this.mP1 = null;
    }
    

    for (var i = 0; i < this.mObjects.length; i++) {
        for(var j = i + 1; j < this.mObjects.length; j ++) {
            if(vec2.distance(this.mObjects[i].getXform().getPosition(), this.mObjects[j].getXform().getPosition()) < 
                    this.mObjects[i].getRadius() + this.mObjects[j].getRadius()) {
                this.mObjects[i].setCurrentFrontDir(vec2.fromValues(this.mObjects[i].getCurrentFrontDir()[0] * -1, this.mObjects[i].getCurrentFrontDir()[1] * -1));
                this.mObjects[j].setCurrentFrontDir(vec2.fromValues(this.mObjects[j].getCurrentFrontDir()[0] * -1, this.mObjects[j].getCurrentFrontDir()[1] * -1));
            }
        }
    }
    
    for (var i = 0; i < this.mObjects.length; i++) {
        this.mObjects[i].update();
    }

    msg += echo;
    this.mMsg.setText(msg);
};