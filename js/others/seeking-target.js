// create application
const app = new PIXI.Application({
  backgroundColor: 0x21252f,
  antialias: true,
  width: 800,
  height: 600,
});
document.body.appendChild(app.view);

// constants
const color = { pink: 0xec407a, white: 0xf2f5ea };
const center = new PIXI.Point(
  app.renderer.width * 0.5,
  app.renderer.height * 0.5
);
const maxSpeed = 5;
const maxForce = 0.2;

// runs an update loop
app.ticker.add(function (deltaTime) {
  if (app.renderer.plugins.interaction.mouseOverRenderer) {
    seek();
    update(deltaTime);
    vehicle.rotation = Math.atan2(velocity.y, velocity.x);
  }
});

const vehicle = new PIXI.Graphics();
app.stage.addChild(vehicle);
vehicle.position.copyFrom(center);
vehicle.beginFill(color.pink);
vehicle.drawPolygon(10, 0, -10, -8, -6, 0, -10, 8);

let velocity = new PIXI.Point();
let acceleration = new PIXI.Point();

function seek() {
  // mouse position
  const target = app.renderer.plugins.interaction.mouse.global;

  // a desired point from the position to the target
  let desired = new PIXI.Point(target.x - vehicle.x, target.y - vehicle.y);

  // scale to maximum speed
  desired = normalize(desired);
  desired.x *= maxSpeed;
  desired.y *= maxSpeed;

  // steering = desired minus velocity
  let steer = new PIXI.Point(desired.x - velocity.x, desired.y - velocity.y);

  // limit to maximum steering force
  steer = limit(steer, maxForce);
  acceleration.x += steer.x;
  acceleration.y += steer.y;
}

function update(deltaTime) {
  // update velocity
  velocity.x += acceleration.x;
  velocity.y += acceleration.y;

  // limit speed
  velocity = limit(velocity, maxSpeed);
  vehicle.x += velocity.x * deltaTime;
  vehicle.y += velocity.y * deltaTime;

  // reset accelerationelertion to 0 each cycle
  acceleration.x = 0;
  acceleration.y = 0;
}

function magnitude(vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

function magnitudeSqr(vector) {
  return vector.x * vector.x + vector.y * vector.y;
}

function normalize(vector) {
  let mag = magnitude(vector);
  if (mag > 0) {
    vector.x /= mag;
    vector.y /= mag;
  }
  return vector;
}

function limit(vector, max) {
  if (magnitudeSqr(vector) > max * max) {
    vector = normalize(vector);
    vector.x *= max;
    vector.y *= max;
  }
  return vector;
}
