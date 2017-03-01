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
    this.kMinionSprite = "assets/minion_sprite.png";
    
    // The camera to view the scene
    this.mCamera = null;

    // message text
    this.mMsg1 = null;
    this.mMsg2 = null;
    this.mNumFormat = null;

    // GameObjectSet containing all shapes
    this.mAllObjs = null;
    
    // for selecting
    this.mCurrentObj = 0;
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
        vec2.fromValues(50, 40), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    
    this.mAllObjs = new GameObjectSet();
    
    // create 3 rectangles, 3 circles, set to initial positions
    this.mAllObjs.addToSet(new Hero(this.kMinionSprite, 20, 20));
    this.mAllObjs.addToSet(new Minion(this.kMinionSprite, 20, 55));
    this.mAllObjs.addToSet(new Hero(this.kMinionSprite, 50, 20));
    this.mAllObjs.addToSet(new Minion(this.kMinionSprite, 50, 55));
    this.mAllObjs.addToSet(new Hero(this.kMinionSprite, 80, 20));
    this.mAllObjs.addToSet(new Minion(this.kMinionSprite, 80, 55));

    this.mNumFormat = new Intl.NumberFormat("en-US",
            {style: "decimal", minimumFractionDigits: 1,
                maximumFractionDigits: 1});
    this.mMsg1 = new FontRenderable("Status Message");
    this.mMsg1.setColor([0, 0, 0, 1]);
    this.mMsg1.getXform().setPosition(2, 5);
    this.mMsg1.setTextHeight(1.5);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.mAllObjs.draw(this.mCamera);
    this.mMsg1.draw(this.mCamera);   // only draw status in the main camera
};

// **moved into GameObjectSet**
//MyGame.prototype.increaseBound = function(delta) {
//    var s = this.mAllObjs.getObjectAt(this.mCurrentObj).getRigidBody();
//    var r = s.getBoundRadius();
//    r += delta;
//    s.setBoundRadius(r);
//};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.kBoundDelta = 0.1;
MyGame.prototype.update = function () {
    var msg = "Total Objects: " + this.mAllObjs.size() + " | Current: " + this.mAllObjs.getSelectedIndex();   
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
//        this.mCurrentObj = (this.mCurrentObj + 1) % 6;
//    }
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
//        this.mCurrentObj = (this.mCurrentObj - 1);
//        if (this.mCurrentObj < 0)
//            this.mCurrentObj = 5;
//    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        this.mAllObjs.increaseBound(MyGame.kBoundDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        this.mAllObjs.increaseBound(-MyGame.kBoundDelta);
    }
    
    //this.mAllObjs.getObjectAt(this.mCurrentObj).update(this.mCamera);
    this.mAllObjs.update(this.mCamera);
    // gEngine.Physics.processCollision(this.mAllObjs);

    msg += " | Radius: " + this.mNumFormat.format(this.mAllObjs.getSelectedObject().getRigidBody().getBoundRadius());
    msg += " | Collision Detected: " + this.mAllObjs.hasCollision();
    this.mMsg1.setText(msg);
};