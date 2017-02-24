/* File: Wing.js 
 *
 * Creates and initializes a Wing object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Wing(spriteTexture) {
    this.kDelta = 0.3;
    this.kRotateSpeed = 0.01;
    this.mWing = new SpriteAnimateRenderable(spriteTexture);
    this.mWing.setColor([1, 1, 1, 0]);
    this.mWing.getXform().setSize(12, 9.6);
    this.mWing.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,   // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.mWing.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mWing.setAnimationSpeed(15);
                                // show each element for mAnimSpeed updates

    GameObject.call(this, this.mWing);
    this.setVisibility(true);
    this.mCirc = new RigidCircle(this.mWing.getXform());
    this.mCirc.setRadius(4);
    this.mCirc.setRadiusBlack(4);
    var velX = Math.random();
    var velY = Math.random();
    if (Math.random() < 0.5) {
        velX *= -1;
    }
    
    if (Math.random() < 0.5) {
        velY *= -1;
    }
    this.setCurrentFrontDir([velX, velY]);
    this.setSpeed(this.kDelta);
}
gEngine.Core.inheritPrototype(Wing, GameObject);

Wing.prototype.update = function (x, y) {
//    // remember to update wing's animation
//    this.mWing.updateAnimation();
//    
//    var xdist = Math.abs(this.mWing.getXform().getXPos() - x);
//    var ydist = Math.abs(this.mWing.getXform().getYPos() - y);
//    var dist = Math.sqrt(xdist * xdist + ydist * ydist);
//    this.rotateObjPointTo([x, y], 0.05);
//    this.setSpeed(dist / 20);
//    this.mCirc.update();
//    GameObject.prototype.update.call(this);

};

Wing.prototype.update = function (aCamera) {
    // wing movement
    var xform = this.getXform();
    var pos = xform.getPosition();
    var radius = this.mCirc.getRadius();
    var dirX = this.getCurrentFrontDir()[0];
    var dirY = this.getCurrentFrontDir()[1];
    if (pos[0] + radius > 100) {
        dirX *= -1;
        pos[0] = 100 - radius;
    }
    else if (pos[0] - radius < 0) {
        dirX *= -1;
        pos[0] = 0 + radius;
    }
    if (pos[1] + radius > 75) {
        dirY *= -1;
    }
    else if (pos[1] - radius < 0) {
        dirY *= -1;
    }
    this.setCurrentFrontDir(vec2.fromValues(dirX, dirY));
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
    
    // wing rotation
    if (xform.getRotationInRad() > 1.0 || xform.getRotationInRad() < -1.0) {
        this.kRotateSpeed *= -1;
    }
    xform.incRotationByRad(this.kRotateSpeed);
    
    // toggle texture drawing
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.T)) {
        this.setVisibility(!this.isVisible());
    }
    
    // animation and circle location updates
    this.mWing.updateAnimation();
    this.mCirc.update();
};

Wing.prototype.draw = function (aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
    this.mCirc.draw(aCamera);
};

