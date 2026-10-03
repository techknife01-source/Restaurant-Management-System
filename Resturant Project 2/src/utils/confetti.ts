import confetti from 'canvas-confetti';

export function fireSuccessConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#d49e47', '#ede8de', '#b46927', '#3d5a45', '#f5deb3']
  });
}
