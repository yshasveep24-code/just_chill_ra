export class AnimationSpeedControl {
    constructor() {
        this.init();
    }

    init() {
        const speedSlider = document.getElementById('animation-speed');
        const speedValue = document.getElementById('speed-value');

        if (speedSlider && speedValue) {
            // Load saved speed
            const savedSpeed = localStorage.getItem('animation-speed') || '1';
            speedSlider.value = savedSpeed;
            speedValue.textContent = `${savedSpeed}x`;

            // Update on change
            speedSlider.addEventListener('input', (e) => {
                const speed = e.target.value;
                speedValue.textContent = `${speed}x`;
                localStorage.setItem('animation-speed', speed);

                // Dispatch event for other components
                window.dispatchEvent(new CustomEvent('animationspeedchange', {
                    detail: { speed: parseFloat(speed) }
                }));
            });
        }
    }

    getSpeed() {
        const savedSpeed = localStorage.getItem('animation-speed');
        return savedSpeed ? parseFloat(savedSpeed) : 1.0;
    }
}
