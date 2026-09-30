(() => {
  // Keep the 2 → 3 → 4 → 5 cone progression, but make every preview feel
  // like a soft drift from the tree instead of a firework burst.
  const gentleVectors = [
    { x: -18, y: -14, size: 30, rotation: -14 },
    { x: 34, y: -18, size: 38, rotation: 12 },
    { x: -24, y: 34, size: 32, rotation: -10 },
    { x: 48, y: 42, size: 36, rotation: 16 },
    { x: 12, y: 62, size: 40, rotation: 20 }
  ];

  window.previewConeBurst = function previewConeBurstPolished() {
    if (!cultOrigin) return;
    const countByClick = [2, 3, 4, 5];
    const count = countByClick[Math.min(Math.max(cultClickCount - 1, 0), countByClick.length - 1)];

    for (let i = 0; i < count; i += 1) {
      const cone = document.createElement('img');
      const vector = gentleVectors[(cultClickCount + i - 1) % gentleVectors.length];
      cone.className = 'click-cone';
      cone.src = cultConeAsset;
      cone.alt = '';
      cone.setAttribute('aria-hidden', 'true');
      cone.style.setProperty('--x', `${vector.x + ((cultClickCount + i) % 3) * 3}px`);
      cone.style.setProperty('--y', `${vector.y + ((cultClickCount + i) % 2) * 4}px`);
      cone.style.setProperty('--size', `${vector.size + ((cultClickCount + i) % 2) * 4}px`);
      cone.style.setProperty('--rotation', `${vector.rotation + cultClickCount * 2}deg`);
      cone.style.setProperty('--cone-duration', `${1.05 + i * 0.04}s`);
      cultOrigin.appendChild(cone);
      window.setTimeout(() => cone.remove(), 1250);
    }
  };

  window.previewMenuConeBurst = function previewMenuConeBurstPolished() {
    if (!coniferMenuTrigger) return;
    const rect = coniferMenuTrigger.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const countByClick = [2, 3, 4, 5];
    const count = countByClick[Math.min(Math.max(cultClickCount - 1, 0), countByClick.length - 1)];

    for (let i = 0; i < count; i += 1) {
      const cone = document.createElement('img');
      const vector = gentleVectors[(cultClickCount + i - 1) % gentleVectors.length];
      cone.className = 'menu-click-cone';
      cone.src = cultConeAsset;
      cone.alt = '';
      cone.setAttribute('aria-hidden', 'true');
      cone.style.left = `${originX}px`;
      cone.style.top = `${originY}px`;
      cone.style.setProperty('--x', `${vector.x + ((cultClickCount + i) % 3) * 3}px`);
      cone.style.setProperty('--y', `${vector.y + ((cultClickCount + i) % 2) * 4}px`);
      cone.style.setProperty('--size', `${vector.size + ((cultClickCount + i) % 2) * 4}px`);
      cone.style.setProperty('--rotation', `${vector.rotation + cultClickCount * 2}deg`);
      cone.style.setProperty('--cone-duration', `${1.05 + i * 0.04}s`);
      document.body.appendChild(cone);
      window.setTimeout(() => cone.remove(), 1250);
    }
  };

  // Reset the logical state as soon as the back arrow is pressed. Previously
  // the click counter stayed alive during the 780 ms closing transition, so a
  // fast second attempt could start from the wrong click and feel unresponsive.
  window.closeConiferCult = function closeConiferCultPolished() {
    if (!coniferScene) return;
    clearCultTimers();
    clearConePreviews();
    clearMenuConePreviews();
    cultClickCount = 0;

    coniferScene.classList.add('is-closing');
    coniferScene.style.opacity = '0';
    coniferScene.style.filter = 'blur(12px)';
    coniferScene.style.transform = 'scale(1.008)';

    cultCloseTimer = window.setTimeout(() => {
      resetConiferVisualState();
      clearMenuConePreviews();
      cultCloseTimer = null;
    }, 620);
  };

  const originalHandleMenuConiferClick = handleMenuConiferClick;
  window.handleMenuConiferClick = function handleMenuConiferClickPolished() {
    // If the user starts again while the previous scene is still fading out,
    // finish that reset immediately so the first click always counts.
    if (coniferScene?.classList.contains('is-closing')) {
      resetConiferVisualState();
      clearMenuConePreviews();
    }
    originalHandleMenuConiferClick();
  };
})();
