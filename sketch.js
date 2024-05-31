let song;
let songLoaded = false;
let stage = 1; // Variable to track the stage

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
  }

  updateTime() {
    this.hour = hour();
    this.minute = minute();
    this.second = second();
  }
}

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

class Dot {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.pz = this.z;
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

function preload() {
  song = loadSound('assets/music.m4a', () => {
    songLoaded = true;
  }, (err) => {
    console.error('Failed to load sound file', err);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initMultiCircles(30);
  initBackgroundDots(1000); // Initialize background dots

  button = createButton("Stage 2");
  button.position((width - button.width) / 2, height - button.height - 2);
  button.mousePressed(changeStage);

  userStartAudio().then(() => {
    if (songLoaded) {
      song.loop();
    } else {
      console.error('Sound file not loaded yet');
    }
  });
}

function draw() {
  if (stage === 1) {
    background(0);
    speed = map(mouseX, 0, width, 1, 20);
    if (songLoaded) {
      let rate = map(mouseX, 0, width, 0.5, 2);
      song.rate(rate);
    }

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
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  button.position((width - button.width) / 2, height - button.height - 2);

  // Adjust the size of the MultiCircles
  multiCircles = [];
  initMultiCircles(20);
}

function initMultiCircles(count) {
  for (let i = 0; i < count; i++) {
    let x = random(width);
    let y = random(height);
    let maxRadius = random(0.05 * min(width, height), 0.2 * min(width, height)); // Use a percentage of the window size
    multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum));
  }
}

function initBackgroundDots(count) {
  for (let i = 0; i < count; i++) {
    let x = random(width);
    let y = random(height);
    let z = random(width);
    dots.push(new Dot(x, y, z));
  }
}

function updateMultiCircleTimes() {
  for (let mc of multiCircles) {
    mc.updateTime();
  }
}

function changeStage() {
  if (stage === 1) {
    stage = 2;
    background(0); // Different background color for stage 2
    // You can add additional logic for stage 2 here
    if (songLoaded) {
      song.stop(); // Stop the music when stage changes to 2
    }
  }
}
