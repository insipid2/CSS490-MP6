function RigidRectangle(xform) {
    this.mXform = xform;
    
    this.mLines = [];
    this.mNormals = [];
    var x1 = 2, y1 = 0, x2 = 2, y2 = 20;
    
    for (var i = 0; i < 4; i++) {
        this.mCurrentLine = new LineRenderable();
        this.mCurrentLine.setFirstVertex(x1, y1);
        this.mCurrentLine.setSecondVertex(x2, y2);
        this.mLines.push(this.mCurrentLine);
        
        this.mCurrentLine = new LineRenderable();
        this.mCurrentLine.setFirstVertex(x1, y1);
        this.mCurrentLine.setSecondVertex(x2, y2);
        this.mNormals.push(this.mCurrentLine);
    }
    
    this.mLines[0].setColor([0.5, 1.0, 1.0, 1.0]);
    this.mNormals[0].setColor([0.5, 1.0, 1.0, 1.0]);
    this.mLines[1].setColor([1.0, 0.5, 1.0, 1.0]);
    this.mNormals[1].setColor([1.0, 0.5, 1.0, 1.0]);
    this.mLines[2].setColor([1.0, 1.0, 0.5, 1.0]);
    this.mNormals[2].setColor([1.0, 1.0, 0.5, 1.0]);
    this.mLines[3].setColor([0.5, 1.0, 0.5, 1.0]);
    this.mNormals[3].setColor([0.5, 1.0, 0.5, 1.0]);
    
}

RigidRectangle.prototype.update = function () {
    // find the 4 verteces and corresponding normal position points
    var vertex0 = vec2.fromValues(this.mXform.getXPos() + this.mXform.getWidth() / 2, this.mXform.getYPos() + this.mXform.getHeight() / 2);
    var vertex1 = vec2.fromValues(this.mXform.getXPos() + this.mXform.getWidth() / 2, this.mXform.getYPos() - this.mXform.getHeight() / 2);
    var vertex2 = vec2.fromValues(this.mXform.getXPos() - this.mXform.getWidth() / 2, this.mXform.getYPos() - this.mXform.getHeight() / 2);
    var vertex3 = vec2.fromValues(this.mXform.getXPos() - this.mXform.getWidth() / 2, this.mXform.getYPos() + this.mXform.getHeight() / 2);
    var normal0 = vec2.fromValues(this.mXform.getXPos() + this.mXform.getWidth() / 2, this.mXform.getYPos() + this.mXform.getHeight() / 2 + this.mXform.getWidth() / 3);
    var normal1 = vec2.fromValues(this.mXform.getXPos() + this.mXform.getWidth() / 2 + this.mXform.getWidth() / 3, this.mXform.getYPos() - this.mXform.getHeight() / 2);
    var normal2 = vec2.fromValues(this.mXform.getXPos() - this.mXform.getWidth() / 2, this.mXform.getYPos() - this.mXform.getHeight() / 2 - this.mXform.getWidth() / 3);
    var normal3 = vec2.fromValues(this.mXform.getXPos() - this.mXform.getWidth() / 2 - this.mXform.getWidth() / 3, this.mXform.getYPos() + this.mXform.getHeight() / 2);
    
    // rotate the verteces with respect to the center, based on xform rotation amount
    vec2.rotateWRT(vertex0, vertex0, this.mXform.getRotationInRad(), this.mXform.getPosition());
    vec2.rotateWRT(vertex1, vertex1, this.mXform.getRotationInRad(), this.mXform.getPosition());
    vec2.rotateWRT(vertex2, vertex2, this.mXform.getRotationInRad(), this.mXform.getPosition());
    vec2.rotateWRT(vertex3, vertex3, this.mXform.getRotationInRad(), this.mXform.getPosition());
    
    vec2.rotateWRT(normal0, normal0, this.mXform.getRotationInRad(), this.mXform.getPosition());
    vec2.rotateWRT(normal1, normal1, this.mXform.getRotationInRad(), this.mXform.getPosition());
    vec2.rotateWRT(normal2, normal2, this.mXform.getRotationInRad(), this.mXform.getPosition());
    vec2.rotateWRT(normal3, normal3, this.mXform.getRotationInRad(), this.mXform.getPosition());
    
    // define rectangle and normal line locations based off verteces and normal position points
    this.mLines[0].setFirstVertex(vertex3[0], vertex3[1]);
    this.mLines[0].setSecondVertex(vertex0[0], vertex0[1]);
    this.mNormals[0].setFirstVertex(vertex0[0], vertex0[1]);
    this.mNormals[0].setSecondVertex(normal0[0], normal0[1]);
    
    this.mLines[1].setFirstVertex(vertex0[0], vertex0[1]);
    this.mLines[1].setSecondVertex(vertex1[0], vertex1[1]);
    this.mNormals[1].setFirstVertex(vertex1[0], vertex1[1]);
    this.mNormals[1].setSecondVertex(normal1[0], normal1[1]);
    
    this.mLines[2].setFirstVertex(vertex1[0], vertex1[1]);
    this.mLines[2].setSecondVertex(vertex2[0], vertex2[1]);
    this.mNormals[2].setFirstVertex(vertex2[0], vertex2[1]);
    this.mNormals[2].setSecondVertex(normal2[0], normal2[1]);
    
    this.mLines[3].setFirstVertex(vertex2[0], vertex2[1]);
    this.mLines[3].setSecondVertex(vertex3[0], vertex3[1]);
    this.mNormals[3].setFirstVertex(vertex3[0], vertex3[1]);
    this.mNormals[3].setSecondVertex(normal3[0], normal3[1]);
};

RigidRectangle.prototype.draw = function (aCamera) {
    for (var i = 0; i < this.mLines.length; i++) {
        this.mLines[i].draw(aCamera);
        this.mNormals[i].draw(aCamera);
    }
};