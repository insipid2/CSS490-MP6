/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture) {
    this.kDelta = 0.5;
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(35, 50);
    this.mDye.getXform().setSize(9, 12);
    this.mDye.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mDye);
    this.mRect = new RigidRectangle(this.getXform());
    this.mCirc = new RigidCircle(this.getXform());
}
gEngine.Core.inheritPrototype(Hero, GameObject);

// x, y describe the point toward which the hero will try to move
Hero.prototype.update = function (x, y) {
   
    // * interpolated mouse movement *
    var xdist = Math.abs(this.mDye.getXform().getXPos() - x);
    var ydist = Math.abs(this.mDye.getXform().getYPos() - y);
    var dist = Math.sqrt(xdist * xdist + ydist * ydist);
    this.rotateObjPointTo([x, y], 0.05);
    this.setSpeed(dist / 20);
    GameObject.prototype.update.call(this);
    
};

// x, y describe the point toward which the hero will try to move
Hero.prototype.update = function () {
    // * keyboard movement - WASD *
    var xform = this.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        if (xform.getYPos() + this.mCirc.getRadius() < 75) {
            xform.incYPosBy(this.kDelta);
        }
        
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        if (xform.getYPos() - this.mCirc.getRadius() > 0) {
            xform.incYPosBy(-this.kDelta);
        }
        
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        if (xform.getXPos() - this.mCirc.getRadius() > 0) {
            xform.incXPosBy(-this.kDelta);
        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if (xform.getXPos() + this.mCirc.getRadius() < 100) {
            xform.incXPosBy(this.kDelta);
        }
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        xform.incRotationByDegree(this.kDelta);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        xform.incRotationByDegree(-this.kDelta);
    }
    
    // toggle texture drawing
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.T)) {
        this.setVisibility(!this.isVisible());
    }
    
    
    this.mRect.update();
    this.mCirc.update();
};

Hero.prototype.draw = function (aCamera) {
    
    GameObject.prototype.draw.call(this, aCamera);
    this.mRect.draw(aCamera);
    this.mCirc.draw(aCamera);
};
