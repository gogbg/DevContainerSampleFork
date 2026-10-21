const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let rows, cols, cellSize; // Declare rows, cols, and cellSize globally

let grid = createGrid();
let ageGrid = createAgeGrid(); // Ensure ageGrid is initialized separately
let fish = [];

function createGrid() {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            grid[row][col] = Math.random() > 0.8 ? 1 : 0; // Randomly populate grid
        }
    }
    return grid;
}

function createAgeGrid() {
    const ageGrid = [];
    for (let row = 0; row < rows; row++) {
        ageGrid[row] = [];
        for (let col = 0; col < cols; col++) {
            ageGrid[row][col] = 0; // Initialize all ages to 0
        }
    }
    return ageGrid;
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col]) {
                ageGrid[row][col]++; // Increment age if cell is alive
                const age = ageGrid[row][col];
                if (age <= 20) {
                    const red = Math.floor((age / 20) * 255);
                    const blue = 255 - red;
                    ctx.fillStyle = `rgb(${red}, 0, ${blue})`;
                } else {
                    ctx.fillStyle = 'rgb(255, 0, 0)'; // Stay red after age 20
                }
            } else {
                ageGrid[row][col] = 0; // Reset age if cell is dead
                ctx.fillStyle = 'white';
            }
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
    drawFish();
}

function drawFish() {
    for (const swimmer of fish) {
        ctx.save();
        ctx.translate(swimmer.x, swimmer.y);
        ctx.scale(swimmer.direction, 1);
        ctx.fillStyle = swimmer.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, swimmer.size, swimmer.size * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-swimmer.size * 0.72, 0);
        ctx.lineTo(-swimmer.size * 1.5, -swimmer.size * 0.62);
        ctx.lineTo(-swimmer.size * 1.5, swimmer.size * 0.62);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(swimmer.size * 0.52, -swimmer.size * 0.12, swimmer.size * 0.13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#172b35';
        ctx.beginPath();
        ctx.arc(swimmer.size * 0.55, -swimmer.size * 0.12, swimmer.size * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function getNextGeneration(grid) {
    const nextGrid = createGrid();
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(grid, row, col);
            if (grid[row][col] === 1) {
                nextGrid[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
                nextGrid[row][col] = neighbors === 3 ? 1 : 0;
            }
        }
    }
    return nextGrid;
}

function countNeighbors(grid, row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}

function update() {
    grid = getNextGeneration(grid);
    for (const swimmer of fish) {
        swimmer.x += swimmer.speed * swimmer.direction;
        if (swimmer.x > canvas.width + swimmer.size * 2) swimmer.x = -swimmer.size * 2;
        if (swimmer.x < -swimmer.size * 2) swimmer.x = canvas.width + swimmer.size * 2;
    }
    drawGrid();
    setTimeout(update, 500); // Update every 0.5 seconds
}

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;
    cellSize = 10; // Keep cells small with a fixed size
    rows = Math.floor(canvas.height / cellSize);
    cols = Math.floor(canvas.width / cellSize);
    grid = createGrid(); // Reinitialize grid with random live cells
    ageGrid = createAgeGrid();
    fish = Array.from({ length: 8 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 9 + Math.random() * 10,
        speed: 2 + Math.random() * 3,
        direction: Math.random() < 0.5 ? -1 : 1,
        color: ['#ff7043', '#00a896', '#f4a261', '#4786c7'][Math.floor(Math.random() * 4)]
    }));
    drawGrid();
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas(); // Initial resize to set up the canvas

drawGrid();
update();
