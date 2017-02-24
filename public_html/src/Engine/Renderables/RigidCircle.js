function RigidCircle(xform) {
    this.mXform = xform;
    this.mCenter = null;
    this.mRefVertex = null;
    this.mRadius = null;
    this.mRadiusBlack = null;
    this.numCircleLines = 32;
    
    this.mLines = [];
    this.mLinesBlack = [];
    var x1 = 2, y1 = 0, x2 = 2, y2 = 20;
    
    // creation of black lines for circle
    for (var i = 0; i < this.numCircleLines; i++) {
        this.mCurrentLine = new LineRenderable();
        this.mCurrentLine.setFirstVertex(x1, y1);
        this.mCurrentLine.setSecondVertex(x2, y2);
        this.mCurrentLine.setColor([0.0, 0.0, 0.0, 1.0]);
        this.mLinesBlack.push(this.mCurrentLine);
    }
    
    // creation of white lines for circle
    for (var i = 0; i < this.numCircleLines; i++) {
        this.mCurrentLine = new LineRenderable();
        this.mCurrentLine.setFirstVertex(x1, y1);
        this.mCurrentLine.setSecondVertex(x2, y2);
        this.mCurrentLine.setColor([1.0, 1.0, 1.0, 1.0]);
        this.mLines.push(this.mCurrentLine);
    }
    
    this.mCenter = this.mXform.getPosition();
    this.mRefVertex = vec2.fromValues(this.mCenter[0] + this.mXform.getWidth() / 2, this.mCenter[1] + this.mXform.getHeight() / 2);
    this.mRadius = vec2.distance(this.mCenter, this.mRefVertex);
    this.mRadiusBlack = this.mRadius;
}

RigidCircle.prototype.update = function () {
    var edgeLen = 0;
    var vertex0temp = null;
    var vertex1temp = null;
    
    // update the reference points to center
    this.mCenter = this.mXform.getPosition();
    
    // *Black Circle*
    // find the initial 2 verteces
    edgeLen = this.mRadiusBlack * Math.tan(Math.PI / this.numCircleLines);
    var vertex0 = vec2.fromValues(this.mCenter[0] + this.mRadiusBlack, this.mCenter[1] + edgeLen);
    var vertex1 = vec2.fromValues(this.mCenter[0] + this.mRadiusBlack, this.mCenter[1] - edgeLen);
    
    // define line locations
    vertex0temp = vec2.fromValues(vertex0[0], vertex0[1]);
    vertex1temp = vec2.fromValues(vertex1[0], vertex1[1]);
    
    for (var i = 0; i < this.mLinesBlack.length; i++) {
        if ( i > 0){
            vec2.rotateWRT(vertex0temp, vertex0, i * Math.PI * 2 / this.numCircleLines, this.mCenter);
            vec2.rotateWRT(vertex1temp, vertex1, i * Math.PI * 2 / this.numCircleLines, this.mCenter);
        }
        this.mLinesBlack[i].setFirstVertex(vertex0temp[0], vertex0temp[1]);
        this.mLinesBlack[i].setSecondVertex(vertex1temp[0], vertex1temp[1]);        
    }
    

    // *White Circle*
    // find the initial 2 verteces
    edgeLen = this.mRadius * Math.tan(Math.PI / this.numCircleLines);
    var vertex0 = vec2.fromValues(this.mCenter[0] + this.mRadius, this.mCenter[1] + edgeLen);
    var vertex1 = vec2.fromValues(this.mCenter[0] + this.mRadius, this.mCenter[1] - edgeLen);
    
    // define line locations
    vertex0temp = vec2.fromValues(vertex0[0], vertex0[1]);
    vertex1temp = vec2.fromValues(vertex1[0], vertex1[1]);
    
    
    for (var i = 0; i < this.mLines.length; i++) {
        if ( i > 0){
            vec2.rotateWRT(vertex0temp, vertex0, i * Math.PI * 2 / this.numCircleLines, this.mCenter);
            vec2.rotateWRT(vertex1temp, vertex1, i * Math.PI * 2 / this.numCircleLines, this.mCenter);
        }
        this.mLines[i].setFirstVertex(vertex0temp[0], vertex0temp[1]);
        this.mLines[i].setSecondVertex(vertex1temp[0], vertex1temp[1]);        
    }
    
};

RigidCircle.prototype.draw = function (aCamera) {
    for (var i = 0; i < this.mLines.length; i++) {
        this.mLinesBlack[i].draw(aCamera);
        this.mLines[i].draw(aCamera);    
    }
};

RigidCircle.prototype.getRadius = function() {
    return this.mRadius;
};

RigidCircle.prototype.setRadius = function(newRadius) {
    this.mRadius = newRadius;
};

RigidCircle.prototype.setRadiusBlack = function(newRadius) {
    this.mRadiusBlack = newRadius;
};