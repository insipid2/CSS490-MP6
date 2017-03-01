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

GameObjectSet.prototype.size = function () {
    return this.mSet.length;
};

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

GameObjectSet.prototype.increaseBound = function (delta) {
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
    var c1Pos = null;
    var c2Pos = null;
    var c1Rad = null;
    var c2Rad = null;
    var radsum = null;
    var dist = null;
    var depth = null;
    var normal = [0, 0];
    var start = [0, 0];

    for (var i = 0; i < this.mSet.length; i++) {
        for (var j = i + 1; j < this.mSet.length; j++) {
            // test for broad phase collision
            if (this.mSet[i].getRigidBody().boundTest(this.mSet[j].getRigidBody())) {
                this.mHasCollision = true;
                // test for collision type
                // shape types: RigidCircle, RigidRectangle
                if (this.mSet[i].getRigidBody().mType === "RigidCircle" &&
                        this.mSet[j].getRigidBody().mType === "RigidCircle") {
                    console.log("we have 2 circles!");
                    // Circle - Circle collision
                    c1Pos = this.mSet[i].getXform().getPosition();
                    c2Pos = this.mSet[j].getXform().getPosition();
                    c1Rad = this.mSet[i].getRigidBody().getRadius();
                    c2Rad = this.mSet[j].getRigidBody().getRadius();
                    radsum = c1Rad + c2Rad;
                    dist = vec2.distance(c1Pos, c2Pos);
                    depth = radsum - dist;
                    vec2.subtract(normal, c1Pos, c2Pos);
                    console.log("normal 1: " + normal);
                    vec2.normalize(normal, normal);
                    console.log("normal 2: " + normal);
                    vec2.scale(normal, normal, c2Rad);
                    console.log("normal 3: " + normal);
                    vec2.add(start, normal, c2Pos);
                    vec2.normalize(normal, normal);
                    console.log("start: " + start);
                    console.log("c1Pos: " + c1Pos + ", c2Pos: " + c2Pos);
                    console.log("c1x: " + c1Pos[0] + ", c1y: " + c1Pos[1]);
                    console.log("radsum: " + radsum + ", dist: " + dist + ", depth: " + depth + ", normal: " + normal);
                    ci = new CollisionInfo();
                    ci.setInfo(depth, normal, start);
                    this.mCollisions.push(ci);
                }
                else if (this.mSet[i].getRigidBody().mType === "RigidCircle" &&
                        this.mSet[j].getRigidBody().mType === "RigidRectangle") {
                    // Circle - Rectangle collision
                }
                else if (this.mSet[i].getRigidBody().mType === "RigidRectangle" &&
                        this.mSet[j].getRigidBody().mType === "RigidCircle") {
                    // Rectangle - Circle collision
                }                
                else if (this.mSet[i].getRigidBody().mType === "RigidRectangle" &&
                        this.mSet[j].getRigidBody().mType === "RigidRectangle"){
                    // Rectangle - Rectangle collision
                }
            }
        }
    }


};

GameObjectSet.prototype.draw = function (aCamera) {
    var i;
    var collision;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera);

    }
    while (this.mCollisions.length > 0) {
        collision = this.mCollisions.pop();
        if (collision.getDepth() > 0) {
            collision.draw(aCamera);
        }
    }
};
