export class Modal {
  constructor() {}

  createModal() {
    document.body.style.overflow = 'hidden';
    const overlay = document.createElement('div');
    const modal = document.createElement('div');
    const button = document.createElement('button');
    modal.classList.add('modal');
    overlay.classList.add('overlay');
    button.classList.add('button_secondary');
    button.textContent = 'Close';
    modal.append(button);
    overlay.append(modal);
    return overlay;
  }
}
