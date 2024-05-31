let song;
let songLoaded = false;
let stage = 1; // Variable to track the stage

// MultiCircle class definition
class MultiCircle {
  constructor(x, y, maxRadius, innerMultiCircleNum, layerNum) {
    this.x = x;
    this.y = y;
    this.maxRadius = maxRadius;
    this.innerMultiCircleNum = innerMultiCircleNum;
    this.layerNum = layerNum;
    this.innerRadius = maxRadius / 2;
    this.dotRadius = 5;
    this.z = random(width);
    this.pz = this.z;
    this.innerAllowedColors = [
      color(87, 98, 100),
      color(180, 172, 153),
      color(128, 128, 98),
      color(175, 146, 116),
      color(145, 73, 63)
    ];
    this.outerAllowedColors = [
      color(221, 211, 143),
      color(198, 177, 107),
      color(124, 167, 195),
      color(141, 164, 189),
      color(228, 122, 77),
    ];
    this.innerColors = this.generateRandomColors(innerMultiCircleNum, this.innerAllowedColors);
    this.outerColor = this.generateRandomColors(1, this.outerAllowedColors)[0];
    this.updateTime();
    this.splashes = [];
  }

  generateRandomColors(num, allowedColors = []) {
    let colors = [];
    for (let i = 0; i < num; i++) {
      if (allowedColors.length > 0) {
        colors.push(allowedColors[int(random(allowedColors.length))]);
      } else {
        colors.push(color(random(255), random(255), random(255)));
      }
    }
    return colors;
  }

  update(speed) {
    this.z -= speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
      this.pz = this.z;
    }
  }

  display() {
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let radius = map(this.z, 0, width, this.maxRadius, 0);

    fill(231, 231, 224);
    noStroke();
    ellipse(sx, sy, radius * 2);

    noFill();
    for (let i = this.innerColors.length - 1; i >= 0; i--) {
      stroke(this.innerColors[i]);
      strokeWeight(5);
      ellipse(sx, sy, (radius * (i + 1) / this.innerColors.length) * 2);
    }

    fill(this.outerColor);
    noStroke();
    for (let i = 0; i < 360; i += 30) {
      let angle = radians(i);
      let r = radius + (this.layerNum - 1) * this.dotRadius * 2;
      let x = sx + cos(angle) * r;
      let y = sy + sin(angle) * r;
      ellipse(x, y, this.dotRadius * 2);
    }

    let hour = this.hour % 12;
    let minute = this.minute;
    let second = this.second;
    drawClock(sx, sy, hour, minute, second);

    // Display splashes
    for (let splash of this.splashes) {
      splash.update();
      splash.show();
    }
  }

  updateTime() {
    this.hour = hour();
    this.minute = minute();
    this.second = second();
  }

  marble(drop) {
    let d = dist(this.x, this.y, drop.x, drop.y);
    if (d < this.maxRadius + drop.radius) {
      let angle = atan2(drop.y - this.y, drop.x - this.x);
      let targetX = this.x + cos(angle) * (this.maxRadius + drop.radius);
      let targetY = this.y + sin(angle) * (this.maxRadius + drop.radius);
      let ax = (targetX - drop.x) * 0.05;
      let ay = (targetY - drop.y) * 0.05;
      this.splashes.push(new Splash(this.x, this.y, ax, ay, this.outerColor));
      return true; // Indicate that the drop hit the MultiCircle
    }
    return false;
  }

  tine(v, x, y, z, c) {
    this.splashes.push(new Splash(x, y, v.x * z, v.y * z, c));
  }
}

// Function to draw clock
function drawClock(x, y, hour, minute, second) {
  let hourRadius = 30;
  let minuteRadius = 40;
  let secondRadius = 45;

  let hourAngle = TWO_PI * ((hour % 12) / 12) - HALF_PI;
  let minuteAngle = TWO_PI * (minute / 60) - HALF_PI;
  let secondAngle = TWO_PI * (second / 60) - HALF_PI;

  stroke(0);
  strokeWeight(3);
  line(x, y, x + cos(hourAngle) * hourRadius, y + sin(hourAngle) * hourRadius);

  stroke(0);
  strokeWeight(2);
  line(x, y, x + cos(minuteAngle) * minuteRadius, y + sin(minuteAngle) * minuteRadius);

  stroke(255, 0, 0);
  strokeWeight(1);
  line(x, y, x + cos(secondAngle) * secondRadius, y + sin(secondAngle) * secondRadius);
}

// Dot class definition
class Dot {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.pz = this.z;
    this.splashes = [];
  }

  update(speed) {
    this.z -= speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
      this.pz = this.z;
    }
  }

  display() {
    fill(231, 231, 224);
    noStroke();

    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = map(this.z, 0, width, dotSize, 0);
    ellipse(sx, sy, r, r);

    let px = map(this.x / this.pz, 0, 1, 0, width);
    let py = map(this.y / this.pz, 0, 1, 0, height);

    this.pz = this.z;

    stroke(193, 110, 74);
    line(px, py, sx, sy);

    // Display splashes
    for (let splash of this.splashes) {
      splash.update();
      splash.show();
    }
  }

  marble(drop) {
    let d = dist(this.x, this.y, drop.x, drop.y);
    if (d < dotSize + drop.radius) {
      let angle = atan2(drop.y - this.y, drop.x - this.x);
      let targetX = this.x + cos(angle) * (dotSize + drop.radius);
      let targetY = this.y + sin(angle) * (dotSize + drop.radius);
      let ax = (targetX - drop.x) * 0.05;
      let ay = (targetY - drop.y) * 0.05;
      this.splashes.push(new Splash(this.x, this.y, ax, ay, color(193, 110, 74)));
      return true; // Indicate that the drop hit the Dot
    }
    return false;
  }

  tine(v, x, y, z, c) {
    this.splashes.push(new Splash(x, y, v.x * z, v.y * z, c));
  }
}

// InkDrop class definition
class InkDrop {
  constructor(x, y, r, col) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.color = col;
    this.splashes = [];
  }

  marble(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    if (d < this.radius + other.radius) {
      let angle = atan2(other.y - this.y, other.x - this.x);
      let targetX = this.x + cos(angle) * (this.radius + other.radius);
      let targetY = this.y + sin(angle) * (this.radius + other.radius);
      let ax = (targetX - other.x) * 0.05;
      let ay = (targetY - other.y) * 0.05;
      this.splashes.push(new Splash(this.x, this.y, ax, ay, this.color));
    }
  }

  tine(v, x, y, z, c) {
    this.splashes.push(new Splash(x, y, v.x * z, v.y * z, c));
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);

    for (let splash of this.splashes) {
      splash.update();
      splash.show();
    }
  }
}

class Splash {
  constructor(x, y, vx, vy, col) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = col;
    this.lifetime = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime -= 5;
  }

  show() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.lifetime);
    ellipse(this.x, this.y, 5);
  }
}

let multiCircles = [];
let dots = [];
let innerMultiCircleNum = 10;
let layerNum = 5;
let dotSize = 15;
let dotDensity = 3;
let speed = 7;
let button;

let inkDrops = []; // Array to store ink drops
let palette = [];
let bk;
let newDrop = true;
let currentColor;
let counter = 1;

// Preload function to load sound file
function preload() {
  song = loadSound('assets/music.m4a', () => {
    songLoaded = true;
  }, (err) => {
    console.error('Failed to load sound file', err);
  });
}

// Setup function
function setup() {
  createCanvas(windowWidth, windowHeight);
  initMultiCircles(50);
  initDots(100);
  initBackgroundDots(1000);
  button = createButton("Stage 2");
  button.position((width - button.width) / 2, height - button.height - 2);
  button.mousePressed(changeStage);

  palette = [
    color(255), // white
    color(192), // light grey
    color(128), // dark grey
    color(0) // black
  ];
  bk = color(252, 238, 33);

  userStartAudio().then(() => {
    if (songLoaded) {
      song.loop(); // Start the music when the sketch is initialized
    } else {
      console.error('Sound file not loaded yet');
    }
  });
}

// Draw function
function draw() {
  if (stage === 1) {
    background(0);
    speed = map(mouseX, 0, width, 1, 20);
    if (songLoaded && !song.isPlaying()) {
      song.loop(); // Ensure the music is playing in stage 1
    }
    let rate = map(mouseX, 0, width, 0.5, 2);
    song.rate(rate);

    for (let dot of dots) {
      dot.update(speed);
      dot.display();
    }
    for (let mc of multiCircles) {
      mc.update(speed);
      mc.display();
    }
    updateMultiCircleTimes();
  } else if (stage === 2) {
    background(0); // Black canvas for stage 2

    // Static MultiCircles
    for (let mc of multiCircles) {
      mc.display();
    }

    // Static white background dots
    fill(255);
    for (let dot of dots) {
      dot.display();
    }

    // Ink drop effect
    if (mouseIsPressed && mouseY < height - button.height - 2) {
      if (newDrop) {
        currentColor = palette[counter % palette.length];
        newDrop = false;
        counter++;
      }
      addInk(mouseX, mouseY, 35, currentColor); // Set drop size to 35
    }

    for (let inkDrop of inkDrops) {
      inkDrop.show();
    }
  } else if (stage === 3) {
    background(0); // Black canvas for stage 3
  }
}

// Window resize event handler
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  button.position((width - button.width) / 2, height - button.height - 2);

  // Adjust the size of the MultiCircles
  multiCircles = [];
  initMultiCircles(50);
}

// Function to initialize MultiCircles
function initMultiCircles(count) {
  for (let i = 0; i < count; i++) {
    let x = random(width);
    let y = random(height);
    let maxRadius = random(0.05 * min(width, height), 0.2 * min(width, height)); // Use a percentage of the window size
    multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum));
  }
}

// Function to initialize dots
function initDots(count) {
  for (let i = 0; i < count; i++) {
    let x = random(-width, width);
    let y = random(-height, height);
    let z = random(width);
    dots.push(new Dot(x, y, z));
  }
}

// Function to initialize background dots
function initBackgroundDots(count) {
  for (let i = 0; i < count; i++) {
    let x = random(width);
    let y = random(height);
    let z = random(width);
    dots.push(new Dot(x, y, z));
  }
}

// Function to update MultiCircle times
function updateMultiCircleTimes() {
  for (let mc of multiCircles) {
    mc.updateTime();
  }
}

// Function to change stage
function changeStage() {
  if (stage === 1) {
    stage = 2;
    background(0); // Different background color for stage 2
    button.html("Stage 3"); // Change button text to "Stage 3"
    if (songLoaded && song.isPlaying()) {
      song.stop(); // Stop the music when stage changes from 1
    }
  } else if (stage === 2) {
    stage = 3;
    background(0); // Clear canvas and set to black for stage 3
    dots = [];
    multiCircles = [];
    inkDrops = [];
    button.html("Stage 1"); // Change button text to "Stage 1"
  } else if (stage === 3) {
    stage = 1;
    background(0); // Clear canvas and set to black for stage 1
    initMultiCircles(50);
    initDots(100);
    initBackgroundDots(1000);
    button.html("Stage 2"); // Change button text to "Stage 2"
    if (songLoaded && !song.isPlaying()) {
      song.loop(); // Start the music when stage changes to 1
    }
  }
}

// Mouse pressed event handler
function mousePressed() {
  if (stage === 2 && mouseY < height - button.height - 2) {
    newDrop = true;
    checkInkDrop(mouseX, mouseY, 35, currentColor); // Check for interactions immediately on press with size 35
  }
}

function mouseReleased() {
  newDrop = true;
}

function addInk(x, y, r, col) {
  let drop = new InkDrop(x, y, r, col);
  inkDrops.push(drop);
}

function checkInkDrop(x, y, r, col) {
  let drop = new InkDrop(x, y, r, col);
  for (let i = dots.length - 1; i >= 0; i--) {
    if (dots[i].marble(drop)) {
      dots.splice(i, 1);
    }
  }
  for (let i = multiCircles.length - 1; i >= 0; i--) {
    if (multiCircles[i].marble(drop)) {
      multiCircles.splice(i, 1);
    }
  }
}
