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
    this.mHasCollision = false;
    this.mSelectedObj = 0;
}

GameObjectSet.prototype.size = function () { return this.mSet.length; };

GameObjectSet.prototype.getObjectAt = function (index) {
    return this.mSet[index];
};

GameObjectSet.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};

GameObjectSet.prototype.hasCollision = function () {
    return this.mHasCollision;
};

GameObjectSet.prototype.update = function (aCamera) {
    this.mHasCollision = false;
    var i;
    
//    for (i = 0; i < this.mSet.length; i++) {
//        this.mSet[i].update(aCamera);
//    }
    // object selection
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
    

    
    for (var i = 0; i < this.mSet.length; i++) {
        for(var j = i + 1; j < this.mSet.length; j ++) {
            // we have a broad phase collision here
            
            if (this.mSet[i].getRigidBody().boundTest(this.mSet[j].getRigidBody())) {
                this.mHasCollision = true;
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
