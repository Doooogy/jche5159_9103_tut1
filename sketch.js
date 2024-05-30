class MultiCircle {
  constructor(x, y, maxRadius, innerMultiCircleNum, layerNum) {
    this.x = x;
    this.y = y;
    this.maxRadius = maxRadius;
    this.innerMultiCircleNum = innerMultiCircleNum;
    this.layerNum = layerNum;
    this.innerRadius = maxRadius / 2;
    this.dotRadius = 5;
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
    this.hour = hour();
    this.minute = minute();
    this.second = second();
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

  display() {
    let outerRadius = this.innerRadius + this.layerNum * this.dotRadius * 2;

    fill(231, 231, 224);
    noStroke();
    ellipse(this.x, this.y, outerRadius * 2);

    noFill();
    for (let i = this.innerColors.length - 1; i >= 0; i--) {
      stroke(this.innerColors[i]);
      strokeWeight(5);
      ellipse(this.x, this.y, this.innerRadius * (i + 1) / this.innerColors.length * 2);
    }

    fill(this.outerColor);
    noStroke();
    for (let i = 0; i < 360; i += 30) {
      let angle = radians(i);
      let radius = this.innerRadius + (this.layerNum - 1) * this.dotRadius * 2;
      let x = this.x + cos(angle) * radius;
      let y = this.y + sin(angle) * radius;
      ellipse(x, y, this.dotRadius * 2);
    }

    // Draw clock at the center of the circle
    let hour = this.hour % 12;
    let minute = this.minute;
    let second = this.second;
    drawClock(this.x, this.y, hour, minute, second);
  }
}

function drawClock(x, y, hour, minute, second) {
  let hourRadius = 30; // Length of hour hand
  let minuteRadius = 40; // Length of minute hand
  let secondRadius = 45; // Length of second hand

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


let multiCircles = [];
let innerMultiCircleNum = 10;
let layerNum = 5;
let dotSize = 10;
let dotDensity = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);
    let maxRadius = random(50, 200);
    multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum));
  }
}

function draw() {
  background(255);
  drawPolkaDotBackground();
  
  for (let mc of multiCircles) {
    mc.display();
  }
  
  // Update time
  for (let mc of multiCircles) {
    mc.hour = hour();
    mc.minute = minute();
    mc.second = second();
  }
}

function drawPolkaDotBackground() {
  fill(231, 231, 224);
  noStroke();
  for (let y = 0; y < height; y += dotDensity) {
    for (let x = 0; x < width; x += dotDensity) {
      ellipse(x, y, dotSize);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}