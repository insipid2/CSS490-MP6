/* File: GameObjectSet.js 
 *
 * Support for working with a set of GameObjects
 */

/*jslint node: true, vars: true */
/*global  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function GameObjectSet() {
    this.mSet = [];
    this.mCollisions = [];
    this.mHasCollision = false;
    this.mSelectedObj = 0;
}

GameObjectSet.prototype.size = function () { return this.mSet.length; };

GameObjectSet.prototype.getObjectAt = function (index) {
    return this.mSet[index];
};

GameObjectSet.prototype.getSelectedObject = function () {
    return this.mSet[this.mSelectedObj];
};

GameObjectSet.prototype.getSelectedIndex = function () {
    return this.mSelectedObj;
};

GameObjectSet.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};

GameObjectSet.prototype.hasCollision = function () {
    return this.mHasCollision;
};

GameObjectSet.prototype.increaseBound = function(delta) {
    var s = this.mSet[this.mSelectedObj].getRigidBody();
    var r = s.getBoundRadius();
    r += delta;
    s.setBoundRadius(r);
};

GameObjectSet.prototype.update = function (aCamera) {
    this.mHasCollision = false;
    var i;
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        this.mSelectedObj = (this.mSelectedObj + 1) % this.mSet.length;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        this.mSelectedObj = (this.mSelectedObj - 1);
        if (this.mSelectedObj < 0) {
            this.mSelectedObj = this.mSet.length - 1;
        }
    }
    
    this.mSet[this.mSelectedObj].update(aCamera);

    var ci = null;
    for (var i = 0; i < this.mSet.length; i++) {
        for(var j = i + 1; j < this.mSet.length; j ++) {
            // test for broad phase collision
            if (this.mSet[i].getRigidBody().boundTest(this.mSet[j].getRigidBody())) {
                this.mHasCollision = true;
                // create a new collision info
                // just make it draw a line connecting center of circles
                // this.mCollisions.push()
                ci = new CollisionInfo();
                // set the collision info based on i and j objects
                // then add it to array
                // then draw the array in our draw
                // once drawn, empty the array (during draw())
// d, n, s
//                ci.setInfo(this.mSet[j].)
//                this.mCollisions.push();
            }
        }
    }


};

GameObjectSet.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera);
    }
};
