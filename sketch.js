// Starfield simulation tech:https://www.youtube.com/watch?v=17WoOqgXsRM
// "map" function tech:https://p5js.org/reference/#/p5/map
// Add ink drops tech:https://www.youtube.com/watch?v=p7IGZTjC008
// "palette" array tech:https://github.com/remistura/p5.palette
// Music played speed tech:https://www.geeksforgeeks.org/p5-js-rate-function/
// Button text in HTML tech:https://www.youtube.com/watch?v=587qclhguQg

let song; // Variable to store the song
let songLoaded = false; // Flag to track if the song is loaded
let stage = 1; // Variable to track the current stage
let stage3StartTime = 0; // Variable to store the start time of Stage 3
let inkDropRadiusPercentage = 0.05; // Percentage of the canvas size for InkDrop radius

// MultiCircle class definition
class MultiCircle {
  constructor(x, y, maxRadius, innerMultiCircleNum, layerNum) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.maxRadius = maxRadius; // Maximum radius of the circle
    this.innerMultiCircleNum = innerMultiCircleNum; // Number of inner circles
    this.layerNum = layerNum; // Number of layers
    this.innerRadius = maxRadius / 2; // Inner radius
    this.dotRadius = 5; // Radius of dots
    this.z = random(width); // Random z-coordinate for depth effect
    this.pz = this.z; // Previous z-coordinate
    this.noiseOffsetX = random(1000); // Random noise offset for x
    this.noiseOffsetY = random(1000); // Random noise offset for y
    this.innerAllowedColors = [
      color(87, 98, 100), // Inner allowed color
      color(180, 172, 153), // Inner allowed color
      color(128, 128, 98), // Inner allowed color
      color(175, 146, 116), // Inner allowed color
      color(145, 73, 63) // Inner allowed color
    ];
    this.outerAllowedColors = [
      color(221, 211, 143), // Outer allowed color
      color(198, 177, 107), // Outer allowed color
      color(124, 167, 195), // Outer allowed color
      color(141, 164, 189), // Outer allowed color
      color(228, 122, 77) // Outer allowed color
    ];
    this.innerColors = this.generateRandomColors(innerMultiCircleNum, this.innerAllowedColors); // Generate inner colors
    this.outerColor = this.generateRandomColors(1, this.outerAllowedColors)[0]; // Generate outer color
    this.updateTime(); // Update time
  }

  generateRandomColors(num, allowedColors = []) {
    let colors = []; // Array to store colors
    for (let i = 0; i < num; i++) {
      if (allowedColors.length > 0) {
        colors.push(allowedColors[int(random(allowedColors.length))]); // Add random allowed color
      } else {
        colors.push(color(random(255), random(255), random(255))); // Add random color
      }
    }
    return colors; // Return generated colors
  }

  update(speed) {
    this.z -= speed; // Decrease z-coordinate by speed
    if (this.z < 1) {
      this.z = width; // Reset z-coordinate
      this.x = random(-width, width); // Randomize x-coordinate
      this.y = random(-height, height); // Randomize y-coordinate
      this.pz = this.z; // Update previous z-coordinate
    }
    this.x += (noise(this.noiseOffsetX) - 0.5) * 2; // Update x using Perlin noise
    this.y += (noise(this.noiseOffsetY) - 0.5) * 2; // Update y using Perlin noise
    this.noiseOffsetX += 0.01; // Increment noise offset for x
    this.noiseOffsetY += 0.01; // Increment noise offset for y
  }

  display() {
    let sx = map(this.x / this.z, 0, 1, 0, width); // Map x to screen
    let sy = map(this.y / this.z, 0, 1, 0, height); // Map y to screen
    let radius = map(this.z, 0, width, this.maxRadius, 0); // Map radius

    fill(231, 231, 224); // Set fill color
    noStroke(); // Disable stroke
    ellipse(sx, sy, radius * 2); // Draw outer ellipse

    noFill(); // Disable fill
    for (let i = this.innerColors.length - 1; i >= 0; i--) {
      stroke(this.innerColors[i]); // Set stroke color
      strokeWeight(5); // Set stroke weight
      ellipse(sx, sy, (radius * (i + 1) / this.innerColors.length) * 2); // Draw inner ellipse
    }

    fill(this.outerColor); // Set fill color
    noStroke(); // Disable stroke
    for (let i = 0; i < 360; i += 30) {
      let angle = radians(i); // Convert angle to radians
      let r = radius + (this.layerNum - 1) * this.dotRadius * 2; // Calculate radius
      let x = sx + cos(angle) * r; // Calculate x
      let y = sy + sin(angle) * r; // Calculate y
      ellipse(x, y, this.dotRadius * 2); // Draw dot
    }

    let hour = this.hour % 12; // Get hour
    let minute = this.minute; // Get minute
    let second = this.second; // Get second
    drawClock(sx, sy, hour, minute, second); // Draw clock
  }

  updateTime() {
    this.hour = hour(); // Get current hour
    this.minute = minute(); // Get current minute
    this.second = second(); // Get current second
  }

  checkCollision(drop) {
    let d = dist(this.x, this.y, drop.x, drop.y); // Calculate distance to drop
    if (d < this.maxRadius + drop.radius) {
      let angle = atan2(drop.y - this.y, drop.x - this.x); // Calculate angle to drop
      let targetX = this.x + cos(angle) * (this.maxRadius + drop.radius); // Calculate target x
      let targetY = this.y + sin(angle) * (this.maxRadius + drop.radius); // Calculate target y
      return true; // Indicate that the drop hit the MultiCircle
    }
    return false; // Indicate that the drop did not hit the MultiCircle
  }
}

// Function to draw clock
function drawClock(x, y, hour, minute, second) {
  let hourRadius = 30; // Set hour radius
  let minuteRadius = 40; // Set minute radius
  let secondRadius = 45; // Set second radius

  let hourAngle = TWO_PI * ((hour % 12) / 12) - HALF_PI; // Calculate hour angle
  let minuteAngle = TWO_PI * (minute / 60) - HALF_PI; // Calculate minute angle
  let secondAngle = TWO_PI * (second / 60) - HALF_PI; // Calculate second angle

  stroke(0); // Set stroke color
  strokeWeight(3); // Set stroke weight
  line(x, y, x + cos(hourAngle) * hourRadius, y + sin(hourAngle) * hourRadius); // Draw hour hand

  stroke(0); // Set stroke color
  strokeWeight(2); // Set stroke weight
  line(x, y, x + cos(minuteAngle) * minuteRadius, y + sin(minuteAngle) * minuteRadius); // Draw minute hand

  stroke(255, 0, 0); // Set stroke color
  strokeWeight(1); // Set stroke weight
  line(x, y, x + cos(secondAngle) * secondRadius, y + sin(secondAngle) * secondRadius); // Draw second hand
}

// Dot class definition
class Dot {
  constructor(x, y, z) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.z = z; // z-coordinate
    this.pz = this.z; // Previous z-coordinate
    this.noiseOffsetX = random(1000); // Random noise offset for x
    this.noiseOffsetY = random(1000); // Random noise offset for y
  }

  update(speed) {
    this.z -= speed; // Decrease z-coordinate by speed
    if (this.z < 1) {
      this.z = width; // Reset z-coordinate
      this.x = random(-width, width); // Randomize x-coordinate
      this.y = random(-height, height); // Randomize y-coordinate
      this.pz = this.z; // Update previous z-coordinate
    }
    this.x += (noise(this.noiseOffsetX) - 0.5) * 2; // Update x using Perlin noise
    this.y += (noise(this.noiseOffsetY) - 0.5) * 2; // Update y using Perlin noise
    this.noiseOffsetX += 0.01; // Increment noise offset for x
    this.noiseOffsetY += 0.01; // Increment noise offset for y
  }

  display() {
    fill(231, 231, 224); // Set fill color
    noStroke(); // Disable stroke

    let sx = map(this.x / this.z, 0, 1, 0, width); // Map x to screen
    let sy = map(this.y / this.z, 0, 1, 0, height); // Map y to screen
    let r = map(this.z, 0, width, dotSize, 0); // Map radius
    ellipse(sx, sy, r, r); // Draw dot

    let px = map(this.x / this.pz, 0, 1, 0, width); // Map previous x to screen
    let py = map(this.y / this.pz, 0, 1, 0, height); // Map previous y to screen

    this.pz = this.z; // Update previous z-coordinate

    stroke(193, 110, 74); // Set stroke color
    line(px, py, sx, sy); // Draw line
  }

  checkCollision(drop) {
    let d = dist(this.x, this.y, drop.x, drop.y); // Calculate distance to drop
    if (d < dotSize + drop.radius) {
      let angle = atan2(drop.y - this.y, drop.x - this.x); // Calculate angle to drop
      let targetX = this.x + cos(angle) * (dotSize + drop.radius); // Calculate target x
      let targetY = this.y + sin(angle) * (dotSize + drop.radius); // Calculate target y
      return true; // Indicate that the drop hit the Dot
    }
    return false; // Indicate that the drop did not hit the Dot
  }
}

// InkDrop class definition
class InkDrop {
  constructor(x, y, col) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.color = col; // Color
    this.radius = inkDropRadiusPercentage * min(width, height); // Radius as a percentage of canvas size
  }

  checkCollision(other) {
    let d = dist(this.x, this.y, other.x, other.y); // Calculate distance to other
    if (d < this.radius + other.radius) {
      let angle = atan2(other.y - this.y, other.x - this.x); // Calculate angle to other
      let targetX = this.x + cos(angle) * (this.radius + other.radius); // Calculate target x
      let targetY = this.y + sin(angle) * (this.radius + other.radius); // Calculate target y
    }
  }

  show() {
    noStroke(); // Disable stroke
    fill(this.color); // Set fill color
    ellipse(this.x, this.y, this.radius * 2); // Draw ellipse
  }

  updateRadius() {
    this.radius = inkDropRadiusPercentage * min(width, height); // Update radius based on canvas size
  }
}

let multiCircles = []; // Array to store MultiCircles
let dots = []; // Array to store dots
let innerMultiCircleNum = 10; // Number of inner MultiCircles
let layerNum = 5; // Number of layers
let dotSize = 15; // Size of dots
let dotDensity = 3; // Density of dots
let speed = 7; // Speed
let button; // Button

let inkDrops = []; // Array to store ink drops
let palette = []; // Palette
let newDrop = true; // Flag for new drop
let currentColor; // Current color
let counter = 1; // Counter

// Preload function to load sound file
function preload() {
  song = loadSound('assets/music.m4a', () => {
    songLoaded = true; // Set song loaded flag
  }, (err) => {
    console.error('Failed to load sound file', err); // Report error
  });
}

// Setup function
function setup() {
  createCanvas(windowWidth, windowHeight); // Create canvas
  initMultiCircles(50); // Initialize MultiCircles
  initDots(100); // Initialize dots
  initBackgroundDots(1000); // Initialize background dots
  button = createButton("Stage 2"); // Create button
  button.position((width - button.width) / 2, height - button.height - 2); // Position button
  button.mousePressed(changeStage); // Set button click handler

  palette = [
    color(255), // white
    color(192), // light grey
    color(128), // dark grey
    color(0) // black
  ];

  userStartAudio().then(() => {
    if (songLoaded) {
      song.loop(); // Start the music when the sketch is initialized
    } else {
      console.error('Sound file not loaded yet'); // Report error
    }
  });
}

// Draw function
function draw() {
  if (stage === 1) {
    background(0); // Set background color
    speed = map(mouseX, 0, width, 1, 20); // Map mouseX to speed

    let rate = map(mouseX, 0, width, 0.5, 2); // Map mouseX to rate
    song.rate(rate); // Set song rate

    fill(255); // Set fill color for text
    textSize(32); // Set text size
    textAlign(LEFT, TOP); // Set text alignment
    text("Stage 1", 20, 40); // Draw stage text with a fixed left margin
    textSize(16); // Set text size
    text("Young people always believe they are in control of the world", 20, 80); // Draw description text with a fixed left margin
    text("Click then Move, to control speed", 20, 105); // Draw description text with a fixed left margin

    for (let dot of dots) {
      dot.update(speed); // Update dot
      dot.display(); // Display dot
    }
    for (let mc of multiCircles) {
      mc.update(speed); // Update MultiCircle
      mc.display(); // Display MultiCircle
    }
    updateMultiCircleTimes(); // Update MultiCircle times
  } else if (stage === 2) {
    background(0); // Set background color

    fill(255); // Set fill color for text
    textSize(32); // Set text size
    textAlign(LEFT, TOP); // Set text alignment
    text("Stage 2", 20, 40); // Draw stage text with a fixed left margin
    textSize(16); // Set text size
    text("However, as time goes by, the world decays", 20, 80); // Draw description text with a fixed left margin
    text("Press Mouse to affect the world", 20, 105); // Draw description text with a fixed left margin

    // Static MultiCircles
    for (let mc of multiCircles) {
      mc.display(); // Display MultiCircle
    }

    // Static white background dots
    fill(255); // Set fill color
    for (let dot of dots) {
      dot.display(); // Display dot
    }

    // Ink drop effect
    if (mouseIsPressed && mouseY < height - button.height - 2) {
      if (newDrop) {
        currentColor = palette[counter % palette.length]; // Set current color
        newDrop = false; // Reset newDrop flag
        counter++; // Increment counter
      }
      addInk(mouseX, mouseY, currentColor); // Add ink drop
    }

    for (let inkDrop of inkDrops) {
      inkDrop.show(); // Show ink drop
    }
  } else if (stage === 3) {
    if (frameCount - stage3StartTime > 1800) { // Automatically change to Stage 1 after 30 seconds 
      changeStageTo1();
      return;
    }

    background(0); // Set background color
    if (songLoaded && !song.isPlaying()) {
      song.rate(0.75); // Set song rate to 0.75x
      song.play(); // Start the music when entering stage 3
    }

    fill(255); // Set fill color for text
    textSize(32); // Set text size
    textAlign(CENTER, CENTER); // Center text
    text("Then reborn and prosperous", width / 2, height / 2); // Draw stage text

    if (frameCount % 30 === 0) { // Emerge MultiCircles and Dots every 0.5 seconds
      let x = random(width); // Randomize x
      let y = random(height); // Randomize y
      let maxRadius = random(0.05 * min(width, height), 0.2 * min(width, height)); // Randomize radius
      multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum)); // Add MultiCircle

      // Add dots
      for (let i = 0; i < 10; i++) {
        let x = random(-width, width); // Randomize x
        let y = random(-height, height); // Randomize y
        let z = random(width); // Randomize z
        dots.push(new Dot(x, y, z)); // Add dot
      }
    }

    for (let mc of multiCircles) {
      mc.update(0); // Update MultiCircle
      mc.display(); // Display MultiCircle
    }
    for (let dot of dots) {
      dot.update(0); // Update dot
      dot.display(); // Display dot
    }
  }
}

// Window resize event handler
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas
  if (stage !== 3) { // Recreate the button if not in stage 3
    button.position((width - button.width) / 2, height - button.height - 2); // Reposition button
  }

  // Adjust the size of the MultiCircles
  if (stage === 1) {
    multiCircles = []; // Clear MultiCircles
    initMultiCircles(50); // Reinitialize MultiCircles
  }

  // Update the radius of all ink drops
  updateInkDropRadii();
}

// Function to initialize MultiCircles
function initMultiCircles(count) {
  for (let i = 0; i < count; i++) {
    let x = random(width); // Randomize x
    let y = random(height); // Randomize y
    let maxRadius = random(0.05 * min(width, height), 0.2 * min(width, height)); // Randomize radius
    multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum)); // Add MultiCircle
  }
}

// Function to initialize dots
function initDots(count) {
  for (let i = 0; i < count; i++) {
    let x = random(-width, width); // Randomize x
    let y = random(-height, height); // Randomize y
    let z = random(width); // Randomize z
    dots.push(new Dot(x, y, z)); // Add dot
  }
}

// Function to initialize background dots
function initBackgroundDots(count) {
  for (let i = 0; i < count; i++) {
    let x = random(width); // Randomize x
    let y = random(height); // Randomize y
    let z = random(width); // Randomize z
    dots.push(new Dot(x, y, z)); // Add dot
  }
}

// Function to update MultiCircle times
function updateMultiCircleTimes() {
  for (let mc of multiCircles) {
    mc.updateTime(); // Update time for each MultiCircle
  }
}

// Function to change stage
function changeStage() {
  if (stage === 1) {
    stage = 2; // Change to stage 2
    background(0); // Set background color
    button.html("Stage 3"); // Change button text
    if (songLoaded && song.isPlaying()) {
      song.stop(); // Stop the music when stage changes from 1
    }
  } else if (stage === 2) {
    stage = 3; // Change to stage 3
    background(0); // Set background color
    dots = []; // Clear dots
    multiCircles = []; // Clear MultiCircles
    inkDrops = []; // Clear ink drops
    button.remove(); // Remove the button in stage 3
    stage3StartTime = frameCount; // Record the start time of Stage 3
  }
}

// Function to change stage to 1 directly (used for automatic transition)
function changeStageTo1() {
  stage = 1; // Change to stage 1
  background(0); // Set background color
  initMultiCircles(50); // Reinitialize MultiCircles
  initDots(100); // Reinitialize dots
  initBackgroundDots(1000); // Reinitialize background dots
  button = createButton("Stage 2"); // Recreate button
  button.position((width - button.width) / 2, height - button.height - 2); // Position button
  button.mousePressed(changeStage); // Set button click handler
  if (songLoaded && !song.isPlaying()) {
    song.loop(); // Start the music when stage changes to 1
  }
}

// Mouse pressed event handler
function mousePressed() {
  if (stage === 2 && mouseY < height - button.height - 2) {
    newDrop = true; // Set newDrop flag
    checkInkDrop(mouseX, mouseY, currentColor); // Check for interactions immediately on press
  }
}

function mouseReleased() {
  newDrop = true; // Reset newDrop flag
}

// Function to add ink drop
function addInk(x, y, col) {
  let drop = new InkDrop(x, y, col); // Create new ink drop
  inkDrops.push(drop); // Add to array
}

// Function to check ink drop interactions
function checkInkDrop(x, y, col) {
  let drop = new InkDrop(x, y, col); // Create new ink drop
  for (let i = dots.length - 1; i >= 0; i--) {
    if (dots[i].checkCollision(drop)) {
      dots.splice(i, 1); // Remove dot if hit
    }
  }
  for (let i = multiCircles.length - 1; i >= 0; i--) {
    if (multiCircles[i].checkCollision(drop)) {
      multiCircles.splice(i, 1); // Remove MultiCircle if hit
    }
  }
}

// Function to update the radius of ink drops when window resized
function updateInkDropRadii() {
  for (let inkDrop of inkDrops) {
    inkDrop.updateRadius(); // Update radius based on new canvas size
  }
}
