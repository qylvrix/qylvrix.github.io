var Snake = (function() {
  // ---- CONFIG ----
  const INITIAL_TAIL = 4;
  var tileCount = 15;
  var gridSize;
  var fps = 8; // speed
  var tail = INITIAL_TAIL;
  
  var player = { x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) };
  var velocity = { x: 0, y: 0 };
  var trail = [];
  var fruit = { x: 1, y: 1 };
  var points = 0,
    pointsMax = 0;
  var paused = false;
  
  // ---- CANVAS ----
  var canv = document.getElementById('gc');
  var ctx = canv.getContext('2d');
  gridSize = canv.width / tileCount;
  
  // ---- FRUIT IMAGE ----
  var fruitImg = new Image();
  fruitImg.src = '/icons/apple.svg';
  
  fruitImg.onload = function() {
    reset();
    setInterval(loop, 1000 / fps);
  };
  
  // ---- FUNCTIONS ----
  function reset() {
    tail = INITIAL_TAIL;
    points = 0;
    velocity = { x: 0, y: 0 };
    player.x = Math.floor(tileCount / 2);
    player.y = Math.floor(tileCount / 2);
    trail = [{ x: player.x, y: player.y }];
    spawnFruit();
    updateScore();
    paused = false;
  }
  
  function spawnFruit() {
    fruit.x = Math.floor(Math.random() * tileCount);
    fruit.y = Math.floor(Math.random() * tileCount);
    while (trail.some(t => t.x == fruit.x && t.y == fruit.y)) spawnFruit();
  }
  
  function updateScore() {
    document.getElementById('score').textContent = "Score: " + points;
    document.getElementById('topScore').textContent = "Top: " + pointsMax;
  }
  
  function loop() {
    if (paused) return;
    
    // Move snake
    player.x += velocity.x;
    player.y += velocity.y;
    
    // Wrap around edges
    if (player.x < 0) player.x = tileCount - 1;
    if (player.x >= tileCount) player.x = 0;
    if (player.y < 0) player.y = tileCount - 1;
    if (player.y >= tileCount) player.y = 0;
    
    // Add to trail
    trail.push({ x: player.x, y: player.y });
    while (trail.length > tail) trail.shift();
    
    // Collision with self
    for (let i = 0; i < trail.length - 1; i++) {
      if (trail[i].x == player.x && trail[i].y == player.y) {
        reset();
        return;
      }
    }
    
    // Eating fruit
    if (player.x == fruit.x && player.y == fruit.y) {
      tail++;
      points++;
      if (points > pointsMax) pointsMax = points;
      spawnFruit();
      updateScore();
    }
    
    // ---- DRAW ----
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canv.width, canv.height);
    
    // Draw fruit (apple)
    ctx.drawImage(fruitImg, fruit.x * gridSize + 2, fruit.y * gridSize + 2, gridSize - 4, gridSize - 4);
    
    // Draw snake (rounded squares)
    trail.forEach((t, i) => {
      let x = t.x * gridSize + 2;
      let y = t.y * gridSize + 2;
      let size = gridSize - 4;
      ctx.fillStyle = `hsl(${(i/trail.length)*120}, 100%, 50%)`;
      
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 8); // 8px corner radius
        ctx.fill();
      } else {
        // fallback: slightly smaller square for rounded effect
        ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
      }
    });
  }
  
  // ---- KEYBOARD CONTROLS ----
  function keyPush(evt) {
    switch (evt.keyCode) {
      case 37:
        if (velocity.x == 0) { velocity.x = -1;
          velocity.y = 0; }
        break; // left
      case 38:
        if (velocity.y == 0) { velocity.x = 0;
          velocity.y = -1; }
        break; // up
      case 39:
        if (velocity.x == 0) { velocity.x = 1;
          velocity.y = 0; }
        break; // right
      case 40:
        if (velocity.y == 0) { velocity.x = 0;
          velocity.y = 1; }
        break; // down
      case 32:
        paused = !paused;
        break; // space
      case 27:
        reset();
        break; // esc
    }
    evt.preventDefault();
  }
  window.addEventListener('keydown', keyPush);
  
  // ---- PUBLIC METHODS ----
  return {
    action: function(dir) {
      if (dir == 'up' && velocity.y == 0) { velocity.x = 0;
        velocity.y = -1; }
      if (dir == 'down' && velocity.y == 0) { velocity.x = 0;
        velocity.y = 1; }
      if (dir == 'left' && velocity.x == 0) { velocity.x = -1;
        velocity.y = 0; }
      if (dir == 'right' && velocity.x == 0) { velocity.x = 1;
        velocity.y = 0; }
    },
    pause: function() { paused = true; },
    resume: function() { paused = false; },
    reset: reset
  };
  
})();