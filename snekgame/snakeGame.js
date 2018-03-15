var rows, cols;
var squareSize = 40;
var grid = [];
var head;
var snake = [];
var currentX;
var currentY;
var movementX;
var movementY;
var score;

function setup(){
  createCanvas(800, 800);
  rows = floor(width/squareSize);
  cols = floor(height/squareSize);
  currentX = getRandomInt(0,rows-1);
  currentY = getRandomInt(0,cols-1);

  head = new Head(currentX,currentY);

  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      grid.push(new Cell(i,j));
    }
  }

  movementX = getRandomInt(-1, 1);
  movementY = getRandomInt(-1, 1);

  if(movementX != 0 && movementY != 0){
    movementY = 0;
  }else if(movementX == 0 && movementY == 0){
    movementX = 1;
  }

  score = 0;
}

function draw(){
  background(0);
  /*
  for(var i = 0; i < grid.length; i++){
    grid[i].show();
  }
  */
  head.show();
  if(frameCount % 3 == 0){
    head.update();
  }

  stroke(255);
  fill(255);
  textSize(32);
  text(score, width/2, 30);
}

function Cell(i,j){
  this.i = i;
  this.j = j;
  var x = this.i * squareSize;
  var y = this.j * squareSize;

  this.show = function(){
    stroke(0);
    noFill();
    rect(x,y,squareSize,squareSize);
  }
}

function Head(){
  this.show = function(){
    var x = currentX * squareSize;
    var y = currentY * squareSize;
    stroke(0,255,0)
    fill(0,255,0);
    rect(x,y,squareSize,squareSize);
  }

  this.update = function(){
    currentX += movementX;
    currentY += movementY;

    if(currentX > rows){
      currentX = 0;
    }else if(currentX < 0){
      currentX = rows-1
    }if(currentY > cols){
      currentY = 0;
    }else if(currentY < 0){
      currentY = cols-1;
    }
  }
}

function body(){

}

function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function keyPressed(){
  if(keyCode === LEFT_ARROW){
    movementX = -1;
    movementY = 0;
  }else if(keyCode === RIGHT_ARROW){
    movementX = 1;
    movementY = 0;
  }else if(keyCode === UP_ARROW){
    movementX = 0;
    movementY = -1;
  }else if(keyCode === DOWN_ARROW){
    movementX = 0;
    movementY = 1;
  }
}

function food(){
  var foodEaten = false;

  this.generateFood = function(){
    this.x = getRandomInt(0,rows-1) * squareSize;
    this.y = getRandomInt(0,cols-1) * squareSize;
  }

  this.show = function(){
    fill(255,0,0);
    rect(this.x,this.y,squareSize,squareSize);
  }
}
