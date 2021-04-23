var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed, lastFed, fedTime;

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happyDog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('food');
  foodStock.on("value",readStock);
  
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46,139,87);
  foodObj.display();
  time = hour();

  fedTime = database.ref('feedTime');
  fedTime.on("value", function(data){     //listener
    lastFed = data.val();                 //store value of time of last feed in 24-Hour format
  });
  console.log(lastFed);
  drawSprites();
  if (lastFed === 0){
    textSize(23);
    fill('yellow');
    text("Dog was last fed at 12AM", 80, 50);
  } else if (lastFed < 12){
    textSize(23);
    fill('yellow');
    text("Dog was last fed at " + lastFed % 12 + " AM", 80, 50);
  } else {
    textSize(23);
    fill('yellow');
    text("Dog was last fed fed at " + lastFed % 12 + " PM", 80, 50);
  }
}

//function to read foodStock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//function to decrease foodStock and set last feed time
function feedDog(){
  dog.addImage(happyDog);
  if (foodObj.getFoodStock() !== 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);  //set foodStock to ()...getFoodStock() returns value of foodStock
  }
    database.ref('/').update({
    food : foodObj.getFoodStock(),
    feedTime : hour()
  });
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    food: foodS
  });
}