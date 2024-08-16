let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Função para atualizar as coordenadas do mouse ou toque
    const updateCoords = (e) => {
      if (e.touches && e.touches.length > 0) {
        this.mouseX = e.touches[0].clientX;
        this.mouseY = e.touches[0].clientY;
      } else {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }
    };

    // Função para lidar com a movimentação
    const handleMove = (e) => {
      updateCoords(e);
      if (!this.rotating) {
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      const dirX = this.mouseX - this.mouseTouchX;
      const dirY = this.mouseY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }
      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Função para começar o arrasto ou rotação
    const startDragOrRotate = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      updateCoords(e);
      this.mouseTouchX = this.mouseX;
      this.mouseTouchY = this.mouseY;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
      if (e.type === 'touchstart' || e.button === 0) {
        this.rotating = false;
      } else if (e.button === 2) {
        this.rotating = true;
      }
    };

    // Função para terminar o arrasto ou rotação
    const endDragOrRotate = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Eventos de mouse
    document.addEventListener('mousemove', handleMove);
    paper.addEventListener('mousedown', startDragOrRotate);
    window.addEventListener('mouseup', endDragOrRotate);

    // Eventos de toque
    document.addEventListener('touchmove', handleMove);
    paper.addEventListener('touchstart', startDragOrRotate);
    window.addEventListener('touchend', endDragOrRotate);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
