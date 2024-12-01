const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const textInput = document.getElementById('textInput');
const addTextBtn = document.getElementById('addTextBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const fontSizeInput = document.getElementById('fontSize');
const fontStyleInput = document.getElementById('fontStyle');

// State
let texts = []; // Array of text objects
let undoStack = [];
let redoStack = [];
let isDragging = false;
let selectedTextIndex = null;

// Utility to draw all texts
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  texts.forEach((text) => {
    ctx.font = `${text.fontSize}px ${text.fontStyle}`;
    ctx.fillText(text.text, text.x, text.y);
  });
}

// Add text functionality
addTextBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (!text) return;
  
  const fontSize = parseInt(fontSizeInput.value, 10);
  const fontStyle = fontStyleInput.value;

  texts.push({ text, x: 50, y: 50, fontSize, fontStyle });
  undoStack.push([...texts]);
  redoStack = []; // Clear redo stack on new action
  drawCanvas();
});

// Mouse down event to start dragging
canvas.addEventListener('mousedown', (e) => {
  const { offsetX, offsetY } = e;
  selectedTextIndex = texts.findIndex(
    (text) => offsetX >= text.x && offsetX <= text.x + ctx.measureText(text.text).width && offsetY >= text.y - text.fontSize && offsetY <= text.y
  );
  if (selectedTextIndex !== -1) {
    isDragging = true;
  }
});

// Mouse move event to drag text
canvas.addEventListener('mousemove', (e) => {
  if (isDragging && selectedTextIndex !== null) {
    const { offsetX, offsetY } = e;
    texts[selectedTextIndex].x = offsetX;
    texts[selectedTextIndex].y = offsetY;
    drawCanvas();
  }
});

// Mouse up event to stop dragging
canvas.addEventListener('mouseup', () => {
  if (isDragging) {
    undoStack.push([...texts]);
    redoStack = []; // Clear redo stack on new action
  }
  isDragging = false;
  selectedTextIndex = null;
});

// Undo functionality
undoBtn.addEventListener('click', () => {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    texts = [...undoStack[undoStack.length - 1]];
    drawCanvas();
  }
});

// Redo functionality
redoBtn.addEventListener('click', () => {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());
    texts = [...undoStack[undoStack.length - 1]];
    drawCanvas();
  }
});
