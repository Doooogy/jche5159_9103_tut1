# jche5159_9103_tut1_Individual

## Artwork Description:
### outline
Methods: User Input
There are three stages in this project, representing the beginning, decay and rebirth of fate. Compared with other group members, this project emphasizes user interaction to reflect the individual's control and choice of destiny. In order to express time, which is an element throughout the 3 stages, I incorporated the appearance of clocks into the group basics, and set background to be black to indicate universe.

* **Stage 1:**
  Users control the image movement and music playback speed by moving the mouse horizontally, which means controlling fate. Click to start playing music.

* **Stage 2:**
  Users press the mouse to influence the Canvas, which means the butterfly effect caused by different choices in fate. If the ink dot collides with an element, the element disappears.

* **Stage 3:**
  The increasing and randomly moving images represent the occurrence of the multiverse. After 30 seconds, the page will return to Stage 1 automatically.


## Inspiration:
### Wheels of fortune
We selected Pacita Abad's 'Wheels of fortune' as our inspiration image. Pacita’s works contain her thoughts on fate. She is an outstanding female writer in the Philippines. Her travels in Asia deeply inspired her, so combined with the ancient Asia's Dunhuang culture, I hope to show the theme of the ups and downs of fate, and people's ideas about controlling their destiny. In addition, the simple low-saturation colors are more conducive to showing the sense of history.

[Introduction of Pacita's story](https://www.artsy.net/artwork/pacita-abad-wheels-of-fortune)
[![Pacita Abad Wheels of fortune.jpg](https://img2.imgtp.com/2024/05/30/23dRn1bE.jpg)](https://img2.imgtp.com/2024/05/30/23dRn1bE.jpg)

### Starfield Simulation
Through the visualization simulation of the starry sky and warp speed, a visual effect of things coming towards user is presented. The arrival of destiny is irresistible.

[Introduction of Starfield Simulation](https://www.youtube.com/watch?v=17WoOqgXsRM)
![Star](https://github.com/Doooogy/jche5159_9103_tut1/blob/d32f7f47506bc5c6060061846aa02c135186de41/assets/Star.jpg)

### Ink Drops
After making the canvas static, the user should interact with it to highlight the theme. Drip some dots to represent the impact of personal choices on destiny.

[Introduction of Ink Drops](https://www.youtube.com/watch?v=p7IGZTjC008)
![Ink Drop](https://github.com/Doooogy/jche5159_9103_tut1/blob/d32f7f47506bc5c6060061846aa02c135186de41/assets/Ink%20Drop.jpg)

### Cornfield Chase
Cornfield Chase is a song composed by Hans Zimmer for Interstellar. The sense of fate and the undulating waves of sound are very consistent with the theme. In order to combine with the ancient Asian culture, I chose to use the national instrument Guzheng to reinterpret the tune.

[Complete Guzheng Song](https://www.bilibili.com/video/BV1jT4y1q78n/?spm_id_from=333.337.search-card.all.click&vd_source=bc951931180c440a2da29944e924aca6)

## Code Description:
### Class
 **MultiCircle Class:**  
- constructor(x, y, maxRadius, innerMultiCircleNum, layerNum): Initializes a new MultiCircle object with the specified coordinates, maximum radius, number of inner circles, and number of layers.

- generateRandomColors(num, allowedColors = []): Generates an array of random colors, optionally from a set of allowed colors.

- update(speed): Updates the position and depth of the circle based on a speed parameter.

- display(): Displays the MultiCircle on the canvas.

- updateTime(): Updates the internal time used for displaying a clock.

- checkCollision(drop): Checks if the MultiCircle collides with an InkDrop.

  **Dot Class:**  
- constructor(x, y, z): Initializes a new Dot object with the specified coordinates and depth.

- update(speed): Updates the position and depth of the dot based on a speed parameter.

- display(): Displays the Dot on the canvas.

- checkCollision(drop): Checks if the Dot collides with an InkDrop.

  **InkDrop Class:**  
- constructor(x, y, col): Initializes a new InkDrop object with the specified coordinates and color.

- checkCollision(other): Checks if the InkDrop collides with another object.

- show(): Displays the InkDrop on the canvas.

- updateRadius(): Updates the radius of the InkDrop based on the canvas size.

### Function
* **preload():**
Loads the sound file in advance.

* **setup():**
Sets up the canvas, initializes objects, and audio.

* **draw():**
Main draw loop that handles the different stages.

* **windowResized():**
Handles canvas resizing and reinitializes objects if needed.

* **initMultiCircles(count):**
Initializes MultiCircle objects. initDots(count) and initBackgroundDots(count) work similarly.

* **updateMultiCircleTimes():**
Updates the time for all MultiCircle objects.

* **changeStage():**
Changes between stages. changeStageTo1() works similarly.

* **mousePressed():**
Handles mouse pressed events in stage 2.

* **addInk(x, y, col):**
Adds a new InkDrop at the specified coordinates with the specified color.

* **checkInkDrop(x, y, col):**
Checks for collisions between InkDrop and other objects.

* **updateInkDropRadii():**
Updates the radii of all InkDrop objects when the window is resized.

### Reference
[Starfield simulation tech:](https://www.youtube.com/watch?v=17WoOqgXsRM)
Inspired me to create a dynamic universe by shifting group basic elements outwards.

["map" function tech:](https://p5js.org/reference/#/p5/map)
The map function in the code is used to re-map a number from one range to another range. In this project, the map function is converting the coordinates of the MultiCircle or Dot object from its original range to the screen's width and height.

[Add ink drops tech:](https://www.youtube.com/watch?v=p7IGZTjC008)
Inspired me to add ink dots as an interaction between Stage 2 and the fate element.

["palette" array tech:](https://github.com/remistura/p5.palette)
The palette array in code defines a set of colors that can be used for the ink drops in Stage 2, ensuring that each new ink drop gets a color from the palette in sequence. The modulo operator (%) is used to loop back to the beginning of the palette once the end is reached.

[Music played speed tech:](https://www.geeksforgeeks.org/p5-js-rate-function/)
Music speed is controlled using the rate() function from the p5.js sound library. The speed of the music is dynamically adjusted based on the horizontal position of the mouse within the canvas during Stage 1. 

[Button text in HTML tech:](https://www.youtube.com/watch?v=587qclhguQg)
The button.html() method in the p5.js library is used to change the content (inner HTML) of an HTML element. In this context, it is used to update the text displayed on the button.