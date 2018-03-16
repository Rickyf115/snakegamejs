var grid = [];
var rows, cols;
var cellSize;
var score;
var currentX, currentY;
var head, food;
var tail;
var direction = {"UP":0, "DOWN":1, "LEFT":2, "RIGHT":3};
Object.freeze(direction);

//MAIN FUNCTIONS
function setup(){
  createCanvas(800, 800);

  //Initialize Variables
  cellSize = 40;
  score = 0;
  tail = [];

  //Number of rows and columns in grid
  rows = floor(width/cellSize); //21
  cols = floor(height/cellSize); //21

  //Push Cell objects into grid
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      var cell = new Cell(i,j);
      grid.push(cell);
    }
  }

  //Initialize Snake
  head = new Head(getRandomInt(0, rows - 1), getRandomInt(0, cols - 1));

  //Initilaize food
  food = new Food(getRandomInt(0, rows - 1), getRandomInt(0, cols - 1));


  //Not efficient but chances are this wont be an issue for the first boot.
  while(food.x == head.x && food.y == head.y){
    food = new Food(getRandomInt(0, rows - 1), getRandomInt(0, cols - 1));
  }
}

function draw(){
  background(60);

  //Update head position every five frames.
  head.show();
  if(frameCount % 5 == 0){
    head.update();
  }

  food.show();

  //Push new tail if food and snake are in the same cell
  if(head.currentCell == food.currentCell){
    food.eat();
  }

  //Update tail position every 5 frames
  for(var i = 0; i < tail.length; i++){
    tail[i].show();

    if(frameCount % 5 == 0){
      tail[i].update();
    }

    //Restart game if player loses by running into him/herself.
    if(tail[i].currentCell == head.currentCell){
      setup();
    }
  }

  drawScore();
}

function Cell(x, y){
  this.x = x;
  this.y = y;
  this.scaledX = this.x * cellSize;
  this.scaledY = this.y * cellSize;

  this.show = function(){
    stroke(0, 200 , 255);
    noFill();
    rect(this.scaledX, this.scaledY, cellSize, cellSize);
  }
}

//ENTITY FUNCTIONS
function Head(x, y){
  //Initialize head
  this.currentCell = findCell(x, y);
  this.previousCell = null;
  this.x = x;
  this.y = y;

  //Choose random direction for snake to move in on initial launch.
  var randomDir = getRandomInt(0,3);
  this.movementX = 0;
  this.movementY = 0;
  if(randomDir == direction.UP){
    this.movementY = -1;
  }else if(randomDir == direction.DOWN){
    this.movementY = 1;
  }else if(randomDir == direction.LEFT){
    this.movementX = -1;
  }else if(randomDir == direction.RIGHT){
    this.movementX = 1;
  }

  //Show Head as part of the grid
  this.show = function(){
    stroke(0);
    fill(0,255,0);
    rect(this.currentCell.scaledX, this.currentCell.scaledY, cellSize, cellSize);
  }

  /*
    Update head position based on velocity towards given direction.
    X = -1 : LEFT
    X = 1 : RIGHT
    Y = -1 : UP
    Y = 1 : DOWN
  */
  this.update = function(){
    //Keep track of previousCell for the tail to update here
    this.previousCell = this.currentCell;
    this.x += this.movementX;
    this.y += this.movementY;

    //Loop around the canvas if head goes out of bounds
    if(this.x >= rows){
      this.x = 0;
    }else if(this.x < 0){
      this.x = rows - 1;
    }if(this.y >= cols){
      this.y = 0;
    }else if(this.y < 0){
      this.y = cols - 1;
    }

    //Update current cell
    this.currentCell = findCell(this.x, this.y);
  }
}

function Food(x,y){
  this.currentCell = findCell(x,y);

  this.x = x;
  this.y = y;

  this.show = function(){
    stroke(0);
    fill(255,0,0);
    rect(this.currentCell.scaledX, this.currentCell.scaledY, cellSize, cellSize);
  }

  this.eat = function(){

    //Generate new location for food
    this.x = getRandomInt(0, rows - 1);
    this.y = getRandomInt(0, cols - 1);

    //HEAD CHECK (DONT SPAWN FOOD IN SAME CELL AS HEAD)
    while(this.x == head.x && this.y == head.y){
      this.x = getRandomInt(0, rows - 1);
      this.y = getRandomInt(0, cols - 1);
    }

    //TAIL CHECK (DONT SPAWN FOOD IN SAME CELL AS TAIL)
    for(var i = 0; i < tail.length; i++){
      while(this.x == tail[i].x && this.y == tail[i].y){
        this.x = getRandomInt(0, rows - 1);
        this.y = getRandomInt(0, cols - 1);
      }
    }

    this.currentCell = findCell(this.x, this.y);

    //Push new tail
    if(tail.length == 0){
      tail.push(new Tail(head.previousCell.x, head.previousCell.y, 1000));
    }else{
      tail.push(new Tail(tail[tail.length-1].previousCell.x, tail[tail.length-1].previousCell.x, tail.length-1));
    }
    score++;
  }
}

function Tail(x, y, cellToFollowIndex){
  //Setup function
  this.currentCell = findCell(x,y);
  this.x = x;
  this.y = y;
  this.previousCell = null;

  this.show = function(){
    stroke(0);
    fill(0,255,0);
    rect(this.currentCell.scaledX, this.currentCell.scaledY, cellSize, cellSize);
  }

  this.update = function(){
    this.previousCell = this.currentCell;

    //FOLLOW HEAD(1000 is not a possible index in list).
    if(cellToFollowIndex == 1000){
      this.currentCell = head.previousCell;
      this.x = this.currentCell.x;
      this.y = this.currentCell.y;
    }else{ //Follows what was the previously the last index in the tail array.
      this.currentCell = tail[cellToFollowIndex].previousCell;
      this.x = this.currentCell.x;
      this.y = this.currentCell.y;
    }
  }
}

//UTILITY FUNCTIONS
function drawScore(){
  fill(255)
  textSize(32);
  textAlign(CENTER)
  text(score, width/2, 32)
}

//Gets cell, minimizes work for setting up cells for objects.
function findCell(x, y){
  for(var i = 0; i < grid.length; i++){
    if(grid[i].x == x && grid[i].y == y){
      return grid[i];
    }
  }
}

//RNG
function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//CHECK KEYS PRESSED
function keyPressed(){
  //UP
  if(keyCode == UP_ARROW){
    head.movementX = 0;
    head.movementY = -1;
  //DOWN
  }else if(keyCode == DOWN_ARROW){
    head.movementX = 0;
    head.movementY = 1;
  //LEFT
  }else if(keyCode == LEFT_ARROW){
    head.movementX = -1;
    head.movementY = 0;
  //RIGHT
  }else if(keyCode == RIGHT_ARROW){
    head.movementX = 1;
    head.movementY = 0;
  }
}
