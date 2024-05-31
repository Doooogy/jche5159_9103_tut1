# jche5159_9103_tut1_Individual

## Artwork Description:
### outline
Methods: User Input
There are three stages in this project, representing the beginning, decay and rebirth of fate.

* **Stage 1:**
  Users control the image movement and music playback speed by moving the mouse horizontally, which means controlling fate.

* **Stage 2:**
  Users press the mouse to influence the Canvas, which means the butterfly effect caused by different choices in fate.

* **Stage 3:**
  The increasing and randomly moving images represent the occurrence of the multiverse.


## Inspiration:
### Wheels of fortune
We selected Pacita Abad's 'Wheels of fortune' as our inspiration image. Pacita’s works contain her thoughts on fate. She is an outstanding female writer in the Philippines. Her travels in Asia deeply inspired her, so combined with the ancient Chinese Dunhuang culture, I hope to show the theme of the ups and downs of fate.

[![Pacita Abad Wheels of fortune.jpg](https://img2.imgtp.com/2024/05/30/23dRn1bE.jpg)](https://img2.imgtp.com/2024/05/30/23dRn1bE.jpg)

### Starfield Simulation
Through the visualization simulation of the starry sky and warp speed, a visual effect of things coming towards you is presented.

[Link Text](https://www.youtube.com/watch?v=17WoOqgXsRM)

* Defines a dot and a circle object that can be updated and displayed on a canvas. The update() method moves them based on its depth (z), and then displays the dots and its trail on the canvas.
  
```
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
    line(px, py, sx, sy); // Draw line}

```

### Ink Drops
Use marbling colour to simulate ink dripping when the mouse is pressed.

[Link Text](https://www.youtube.com/watch?v=p7IGZTjC008)

* The marble method in the InkDrop class is responsible for detecting interactions between the ink drop and other elements (MultiCircles, Dots).
* It takes another object (e.g., a Dot or MultiCircle) as a parameter and checks if the distance between the ink drop and that object is less than the sum of their radii (this.radius + other.radius).
* If they are close enough (d < this.radius + other.radius), it calculates the angle to the other object and adjusts the ink drop's position (targetX and targetY) so that it looks like the ink is "marbling" around the other object.
* It then calculates the acceleration (ax and ay) towards the target position and creates a new Splash object at the ink drop's position with the calculated acceleration and color.
  

```
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

```


