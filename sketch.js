let song; // Variable to store the song
let songLoaded = false; // Flag to track if the song is loaded
let stage = 1; // Variable to track the current stage

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
      color(228, 122, 77), // Outer allowed color
    ];
    this.innerColors = this.generateRandomColors(innerMultiCircleNum, this.innerAllowedColors); // Generate inner colors
    this.outerColor = this.generateRandomColors(1, this.outerAllowedColors)[0]; // Generate outer color
    this.updateTime(); // Update time
    this.splashes = []; // Array to store splashes
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

    // Display splashes
    for (let splash of this.splashes) {
      splash.update(); // Update splash
      splash.show(); // Show splash
    }
  }

  updateTime() {
    this.hour = hour(); // Get current hour
    this.minute = minute(); // Get current minute
    this.second = second(); // Get current second
  }

  marble(drop) {
    let d = dist(this.x, this.y, drop.x, drop.y); // Calculate distance to drop
    if (d < this.maxRadius + drop.radius) {
      let angle = atan2(drop.y - this.y, drop.x - this.x); // Calculate angle to drop
      let targetX = this.x + cos(angle) * (this.maxRadius + drop.radius); // Calculate target x
      let targetY = this.y + sin(angle) * (this.maxRadius + drop.radius); // Calculate target y
      let ax = (targetX - drop.x) * 0.05; // Calculate x acceleration
      let ay = (targetY - drop.y) * 0.05; // Calculate y acceleration
      this.splashes.push(new Splash(this.x, this.y, ax, ay, this.outerColor)); // Add splash
      return true; // Indicate that the drop hit the MultiCircle
    }
    return false; // Indicate that the drop did not hit the MultiCircle
  }

  tine(v, x, y, z, c) {
    this.splashes.push(new Splash(x, y, v.x * z, v.y * z, c)); // Add splash
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
    this.splashes = []; // Array to store splashes
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

    // Display splashes
    for (let splash of this.splashes) {
      splash.update(); // Update splash
      splash.show(); // Show splash
    }
  }

  marble(drop) {
    let d = dist(this.x, this.y, drop.x, drop.y); // Calculate distance to drop
    if (d < dotSize + drop.radius) {
      let angle = atan2(drop.y - this.y, drop.x - this.x); // Calculate angle to drop
      let targetX = this.x + cos(angle) * (dotSize + drop.radius); // Calculate target x
      let targetY = this.y + sin(angle) * (dotSize + drop.radius); // Calculate target y
      let ax = (targetX - drop.x) * 0.05; // Calculate x acceleration
      let ay = (targetY - drop.y) * 0.05; // Calculate y acceleration
      this.splashes.push(new Splash(this.x, this.y, ax, ay, color(193, 110, 74))); // Add splash
      return true; // Indicate that the drop hit the Dot
    }
    return false; // Indicate that the drop did not hit the Dot
  }

  tine(v, x, y, z, c) {
    this.splashes.push(new Splash(x, y, v.x * z, v.y * z, c)); // Add splash
  }
}

// InkDrop class definition
class InkDrop {
  constructor(x, y, r, col) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.radius = r; // Radius
    this.color = col; // Color
    this.splashes = []; // Array to store splashes
  }

  marble(other) {
    let d = dist(this.x, this.y, other.x, other.y); // Calculate distance to other
    if (d < this.radius + other.radius) {
      let angle = atan2(other.y - this.y, other.x - this.x); // Calculate angle to other
      let targetX = this.x + cos(angle) * (this.radius + other.radius); // Calculate target x
      let targetY = this.y + sin(angle) * (this.radius + other.radius); // Calculate target y
      let ax = (targetX - other.x) * 0.05; // Calculate x acceleration
      let ay = (targetY - other.y) * 0.05; // Calculate y acceleration
      this.splashes.push(new Splash(this.x, this.y, ax, ay, this.color)); // Add splash
    }
  }

  tine(v, x, y, z, c) {
    this.splashes.push(new Splash(x, y, v.x * z, v.y * z, c)); // Add splash
  }

  show() {
    noStroke(); // Disable stroke
    fill(this.color); // Set fill color
    ellipse(this.x, this.y, this.radius * 2); // Draw ellipse

    for (let splash of this.splashes) {
      splash.update(); // Update splash
      splash.show(); // Show splash
    }
  }
}

// Splash class definition
class Splash {
  constructor(x, y, vx, vy, col) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.vx = vx; // x-velocity
    this.vy = vy; // y-velocity
    this.color = col; // Color
    this.lifetime = 255; // Lifetime
  }

  update() {
    this.x += this.vx; // Update x by velocity
    this.y += this.vy; // Update y by velocity
    this.lifetime -= 5; // Decrease lifetime
  }

  show() {
    noStroke(); // Disable stroke
    fill(red(this.color), green(this.color), blue(this.color), this.lifetime); // Set fill color
    ellipse(this.x, this.y, 5); // Draw ellipse
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
let bk; // Background color
let newDrop = true; // Flag for new drop
let currentColor; // Current color
let counter = 1; // Counter

// Preload function to load sound file
function preload() {
  song = loadSound('assets/music.m4a', () => {
    songLoaded = true; // Set song loaded flag
  }, (err) => {
    console.error('Failed to load sound file', err); // Log error
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
  bk = color(252, 238, 33); // Background color

  userStartAudio().then(() => {
    if (songLoaded) {
      song.loop(); // Start the music when the sketch is initialized
    } else {
      console.error('Sound file not loaded yet'); // Log error
    }
  });
}

let musicPlaying = false; // Flag to track if music is playing

// Draw function
function draw() {
  if (stage === 1) {
    background(0); // Set background color
    speed = map(mouseX, 0, width, 1, 20); // Map mouseX to speed
    
    if (songLoaded && !musicPlaying) { // Check if the song is loaded and music is not already playing
      song.loop(); // Start playing the song
      musicPlaying = true; // Update flag
    }

    let rate = map(mouseX, 0, width, 0.5, 2); // Map mouseX to rate
    song.rate(rate); // Set song rate
  
    fill(255); // Set fill color for text
    textSize(32); // Set text size
    text("Stage 1", 10, 40); // Draw stage text
    textSize(16); // Set text size
    text("Young people always believe they are in control of the world: Move Mouse", 10, 70); // Draw description text
  
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
    text("Stage 2", 10, 40); // Draw stage text
    textSize(16); // Set text size
    text("However, as time goes by, the world decays: Press Mouse", 10, 70); // Draw description text

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
      addInk(mouseX, mouseY, 35, currentColor); // Add ink drop
    }

    for (let inkDrop of inkDrops) {
      inkDrop.show(); // Show ink drop
    }
  } else if (stage === 3) {
    background(0); // Set background color

    fill(255); // Set fill color for text
    textSize(32); // Set text size
    textAlign(CENTER, CENTER); // Center text
    text("Then reborn and prosperous", width / 2, height / 2); // Draw stage text

    if (frameCount % 30 === 0) { // Every 0.5 seconds (assuming 60 FPS)
      let x = random(width); // Randomize x
      let y = random(height); // Randomize y
      let maxRadius = random(0.05 * min(width, height), 0.2 * min(width, height)); // Randomize radius
      multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum)); // Add MultiCircle

      for (let i = 0; i < 3; i++) {
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
  button.position((width - button.width) / 2, height - button.height - 2); // Reposition button

  // Adjust the size of the MultiCircles
  if (stage === 1) {
    multiCircles = []; // Clear MultiCircles
    initMultiCircles(50); // Reinitialize MultiCircles
  }
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
    button.html("Stage 1"); // Change button text
  } else if (stage === 3) {
    stage = 1; // Change to stage 1
    background(0); // Set background color
    initMultiCircles(50); // Reinitialize MultiCircles
    initDots(100); // Reinitialize dots
    initBackgroundDots(1000); // Reinitialize background dots
    button.html("Stage 2"); // Change button text
    if (songLoaded && !song.isPlaying()) {
      song.loop(); // Start the music when stage changes to 1
    }
  }
}

// Mouse pressed event handler
function mousePressed() {
  if (stage === 2 && mouseY < height - button.height - 2) {
    newDrop = true; // Set newDrop flag
    checkInkDrop(mouseX, mouseY, 35, currentColor); // Check for interactions immediately on press
  }
}

function mouseReleased() {
  newDrop = true; // Reset newDrop flag
}

// Function to add ink drop
function addInk(x, y, r, col) {
  let drop = new InkDrop(x, y, r, col); // Create new ink drop
  inkDrops.push(drop); // Add to array
}

// Function to check ink drop interactions
function checkInkDrop(x, y, r, col) {
  let drop = new InkDrop(x, y, r, col); // Create new ink drop
  for (let i = dots.length - 1; i >= 0; i--) {
    if (dots[i].marble(drop)) {
      dots.splice(i, 1); // Remove dot if hit
    }
  }
  for (let i = multiCircles.length - 1; i >= 0; i--) {
    if (multiCircles[i].marble(drop)) {
      multiCircles.splice(i, 1); // Remove MultiCircle if hit
    }
  }
}
