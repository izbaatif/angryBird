////////////////////////////////////////////////////////////////
function setupGround(){
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true, angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround(){
  push();
  fill(128);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller(){
  
  //Draw a fixed rectangle and sets its angle
  propeller = Bodies.rectangle(150, 480, 200, 15, {isStatic:true, angle:angle});
  World.add(engine.world, [propeller]);

}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller(){

  push();

    //Sets the propellers angle and velocity
    Body.setAngle(propeller, angle);
    Body.setAngularVelocity(propeller, angleSpeed);

    //Increases the angle by angle speed
    angle += angleSpeed;

    //Draws the propeller
    fill(255);
    drawVertices(propeller.vertices);

  pop();

}
////////////////////////////////////////////////////////////////
function setupBird(){
  var bird = Bodies.circle(mouseX, mouseY, 20, {friction: 0,
      restitution: 0.95 });

  Matter.Body.setMass(bird, bird.mass*10);
  World.add(engine.world, [bird]);

  birds.push(bird);

  //Adds random value of color for each rgb value;
  reds.push(random(50,255));
  greens.push(random(50,255));
  blues.push(random(50,255));
}
////////////////////////////////////////////////////////////////
function drawBirds(){
  push();
  
    //loops through array and draws birds
    for(var i=0; i<birds.length; i++)
    {
      noStroke();
      //Uses the random values generated
      fill(reds[i], greens[i], blues[i]);
      drawVertices(birds[i].vertices);

      //Checks if bird is offscreen an deletes it
      if(isOffScreen(birds[i])==true)
      {
        removeFromWorld(birds[i]);
        birds.splice(i, 1);
        i--;

        //Also removes the color values of that bird
        reds.splice(i, 1);

        greens.splice(i, 1);

        blues.splice(i, 1);

      };
    }
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower(){

  //Start x an y values of the tower
  var colStart=700;
  var rowStart=140;
  var boxSize=80;

  //Draws the boxes and add them to the boxes array and to the world
  for(var col=0; col<3; col++)
  {
    for(var row=0; row<6; row++)
    {
      box = Bodies.rectangle(colStart + col*boxSize , rowStart + row*boxSize , boxSize, boxSize)
      boxes.push(box);
      World.add(engine.world, [box]);

      //Generate random value for green and adds to array
      colors.push(random(50,255));
    }
  }
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower(){

  push();
  
    //Loops through boxes array and draws them
    for(var i=0; i<boxes.length; i++)
    {
      noStroke();
      fill(0,colors[i], 0);
      drawVertices(boxes[i].vertices);

      //Checks if box is off screen and used the boxOffScreen function
      //Removes from the world if they are
      if(boxOffScreen(boxes[i])== true)
      {
        removeFromWorld(boxes[i]);
        boxes.splice(i, 1);
        i--;
      }
      
    }
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot(){
  
  //Sets up the slingshot bird
  slingshotBird = Bodies.circle(170, 200, 20, {friction:0, restitution:0.95});
  Matter.Body.setMass(slingshotBird, slingshotBird.mass*10);

  //Specifies instructions for the constraint for the bird
  slingshotConstraint = Constraint.create({
      pointA : { x:170 , y:150 },
      bodyB : slingshotBird,
      pointB : { x:0 , y:0 },
      stiffness: 0.01 ,
      damping : 0.0001
  })

  //Adds both the bird and constraint to the world
  World.add(engine.world, [slingshotBird , slingshotConstraint]);

}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot(){
  
  push();
  
    //Draws slingshot bird and constraint
    fill(255,165,0)
    drawVertices(slingshotBird.vertices);

    drawConstraint(slingshotConstraint);
  pop();

}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction(){
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

};


/////////////////////////////////////////////////////////////////
//function for the countdown
function timeCountdown()
{
    //Decreases the countdown if startTime is greater than 0
    if (frameCount % 60 == 0 && startTime > 0)
    { 
      startTime --;
    }

    //Writes the countdown at top and middle of screen
    push();
      fill(255);
      textSize(25);
      textAlign(CENTER);
      text(startTime , width/2, 20);
    pop();

    //Writes the instruction text for the start 5 seconds
    if(startTime > 55)
    {
      push();
        fill(255);
        textSize(15);
        text("Remove all boxes from screen to win" , 0, 20);
      pop();
    }


    //Checks if countdown has ended but there are still boxes on screen
    //If there are, shows that the game is over
    if(startTime == 0 && boxes.length > 0)
    {
      fill(255);
      textSize(100);
      textAlign(CENTER, CENTER);
      text("Game Over!" , width/2, height/2);
      stopLoop();
    }

    //Checks if countdown has not ended but there are no boxes on screen
    //If there arent, shows that the player has won
    if(startTime >= 0 && boxes.length == 0)
    {
      fill(255);
      textSize(100);
      textAlign(CENTER, CENTER);
      text("You Win!" , width/2, height/2);
      stopLoop();
    }


}
