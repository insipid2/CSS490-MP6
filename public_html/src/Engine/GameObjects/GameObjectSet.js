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
    this.mOutTrash = [0, 0];
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
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
        for (var i = 0; i < this.mSet.length; i++) {
            this.mSet[i].getRigidBody().toggleBoundShow();
        }
    }

    this.mSet[this.mSelectedObj].update(aCamera);

    var ci = null;
    var c1Pos = null;
    var c2Pos = null;
    var depth = null;
    var normal = [0, 0];
    var start = [0, 0];
    var infoColor = [1, 0, 1, 1];
    
    // circle vars   
    var c1Rad = null;
    var c2Rad = null;
    var radsum = null;
    var dist = null;
    
    // rectangle vars
    var ciR1 = null;
    var ciR2 = null;
    var depthVec = [0, 0];

    for (var i = 0; i < this.mSet.length; i++) {
        for (var j = i + 1; j < this.mSet.length; j++) {
            // test for broad phase collision
            if (this.mSet[i].getRigidBody().boundTest(this.mSet[j].getRigidBody())) {
                this.mHasCollision = true;
                ci = new CollisionInfo();
                ciR1 = new CollisionInfo();
                ciR2 = new CollisionInfo();
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
                    ci.setInfo(depth, normal, start, infoColor);
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
                    var status1 = false;
                    var status2 = false;
                    
                    status1 = this.findAxisLeastPenetration(this.mSet[i].getRigidBody(), this.mSet[j].getRigidBody(), ciR1, tmpSupport1);
                    // console.log("after status 1 assignment");
                    if (status1) {
                        status2 = this.findAxisLeastPenetration(this.mSet[j].getRigidBody(), this.mSet[i].getRigidBody(), ciR2, tmpSupport2);
                        if (status2) {
                            if (ciR1.getDepth() < ciR2.getDepth()) {
                                vec2.scale(depthVec, ciR1.getNormal(), ciR1.getDepth());
                                console.log("ciR1 is shortest");
                                ci.setInfo(ciR1.getDepth(), vec2.scale(ciR1.getNormal(), ciR1.getNormal(), -1), vec2.subtract(this.mOutTrash, ciR1.mStart, depthVec), infoColor);
                            }
                            else {
                                // ci.setInfo(ciR2.getDepth(), vec2.scale(this.mOutTrash, ciR2.getNormal(), -1), ciR2.mStart);
                                ci.setInfo(ciR2.getDepth(), ciR2.getNormal(), ciR2.mStart, infoColor);
                                console.log("ciR2 is shortest");
                            }
                            this.mCollisions.push(ci);
                        }
                    }
                }
            }
        }
    }


};

var SupportStruct = function () {
    this.mSupportPoint = null;
    this.mSupportPointDist = 0;
};
var tmpSupport1 = new SupportStruct();
var tmpSupport2 = new SupportStruct();

GameObjectSet.prototype.findSupportPoint = function (rec, dir, ptOnEdge, tmpSupport) {
    //the longest project length
    var vToEdge = [0, 0];
    var projection;

    tmpSupport.mSupportPointDist = -9999999;
    tmpSupport.mSupportPoint = null;
    
    //check each vector of other object
    for (var i = 0; i < rec.mVertex.length; i++) {
        vec2.subtract(vToEdge, rec.mVertex[i], ptOnEdge);
        projection = vec2.dot(vToEdge, dir);
        //find the longest distance with certain edge
        //dir is -n direction, so the distance should be positive       
        if ((projection > 0) && (projection > tmpSupport.mSupportPointDist)) {
            tmpSupport.mSupportPoint = rec.mVertex[i];
            tmpSupport.mSupportPointDist = projection;
        }
    }
};

GameObjectSet.prototype.findAxisLeastPenetration = function (rec1, rec2, collisionInfo, tmpSupport) {
    var n;
    var supportPoint;
    var dir = [0, 0];
    var ptOnEdge = [0, 0];
    
    var bestDistance = 999999;
    var bestIndex = null;
    var bestVec = [0, 0];
    var bestStart = [0, 0];

    var hasSupport = true;
    var i = 0;
    
    while ((hasSupport) && (i < rec1.mFaceNormal.length)) {
        
        // get facenormal from rec1
        n = rec1.mFaceNormal[i];
        
        // get direction, pointing out instead of in
        vec2.scale(dir, n, -1);
        ptOnEdge = rec1.mVertex[i];
        
        // find support point
        this.findSupportPoint(rec2, dir, ptOnEdge, tmpSupport);
        hasSupport = (tmpSupport.mSupportPoint !== null);
        
        //get the shortest support point depth
        if ((hasSupport) && (tmpSupport.mSupportPointDist < bestDistance)) {
            bestDistance = tmpSupport.mSupportPointDist;
            bestIndex = i;
            supportPoint = tmpSupport.mSupportPoint;
        }
        i = i + 1;
    }
    
    if (hasSupport) {
        //all four directions have support point
        vec2.scale(bestVec, rec1.mFaceNormal[bestIndex], bestDistance);
        vec2.add(bestStart, supportPoint, bestVec)
        console.log("best distance: " + bestDistance);
        console.log("normal: " + rec1.mFaceNormal[bestIndex]);
        console.log("best start: " + bestStart);
        collisionInfo.setInfo(bestDistance, rec1.mFaceNormal[bestIndex], bestStart, [1, 0, 1, 1]);
        console.log("stop");
    }
    return hasSupport;
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
