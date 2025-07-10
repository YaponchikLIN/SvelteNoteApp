import type { TransitionConfig } from '$lib/types';

// Предустановленные анимации для Svelte transitions
export const animations = {
  // Плавное появление
  fadeIn: (node: Element, { duration = 300, delay = 0 }: { duration?: number; delay?: number } = {}): TransitionConfig => ({
    duration,
    delay,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    css: (t: number) => `
      opacity: ${t};
      transform: translateY(${(1 - t) * 10}px);
    `
  }),

  // Плавное исчезновение
  fadeOut: (node: Element, { duration = 300, delay = 0 }: { duration?: number; delay?: number } = {}): TransitionConfig => ({
    duration,
    delay,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    css: (t: number) => `
      opacity: ${t};
      transform: translateY(${(1 - t) * -10}px);
    `
  }),

  // Скольжение слева
  slideInLeft: (node: Element, { duration = 300, delay = 0 }: { duration?: number; delay?: number } = {}): TransitionConfig => ({
    duration,
    delay,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    css: (t: number) => `
      opacity: ${t};
      transform: translateX(${(1 - t) * -100}%);
    `
  }),

  // Скольжение справа
  slideInRight: (node: Element, { duration = 300, delay = 0 }: { duration?: number; delay?: number } = {}): TransitionConfig => ({
    duration,
    delay,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    css: (t: number) => `
      opacity: ${t};
      transform: translateX(${(1 - t) * 100}%);
    `
  }),

  // Масштабирование
  scale: (node: Element, { duration = 300, delay = 0, start = 0.8 }: { duration?: number; delay?: number; start?: number } = {}): TransitionConfig => ({
    duration,
    delay,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    css: (t: number) => `
      opacity: ${t};
      transform: scale(${start + (1 - start) * t});
    `
  }),

  // Пружинистое появление
  bounce: (node: Element, { duration = 600, delay = 0 }: { duration?: number; delay?: number } = {}): TransitionConfig => ({
    duration,
    delay,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    css: (t: number) => `
      opacity: ${t};
      transform: scale(${0.3 + 0.7 * t}) translateY(${(1 - t) * 20}px);
    `
  }),

  // Вращение
  rotate: (node: Element, { duration = 300, delay = 0 }: { duration?: number; delay?: number } = {}): TransitionConfig => ({
    duration,
    delay,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    css: (t: number) => `
      opacity: ${t};
      transform: rotate(${(1 - t) * 180}deg) scale(${0.8 + 0.2 * t});
    `
  }),

  // Флип эффект
  flip: (node: Element, { duration = 400, delay = 0 }: { duration?: number; delay?: number } = {}): TransitionConfig => ({
    duration,
    delay,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    css: (t: number) => {
      const angle = (1 - t) * 180;
      return `
        opacity: ${t};
        transform: perspective(400px) rotateY(${angle}deg);
        backface-visibility: hidden;
      `;
    }
  }),

  // Эффект печатной машинки для текста
  typewriter: (node: Element, { duration = 1000, delay = 0 }: { duration?: number; delay?: number } = {}): TransitionConfig => {
    const text = node.textContent || '';
    const length = text.length;
    
    return {
      duration,
      delay,
      easing: 'linear',
      tick: (t: number) => {
        const i = Math.trunc(length * t);
        node.textContent = text.slice(0, i);
      }
    };
  }
};

// Утилиты для CSS анимаций
export const cssAnimations = {
  // Пульсация
  pulse: 'animate-pulse',
  
  // Вращение
  spin: 'animate-spin',
  
  // Подпрыгивание
  bounce: 'animate-bounce',
  
  // Покачивание
  ping: 'animate-ping',

  // Кастомные CSS классы
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  zoomIn: 'animate-zoom-in',
  zoomOut: 'animate-zoom-out'
};

// Функция для создания задержки
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Функция для последовательной анимации элементов
export const staggerAnimation = (
  elements: NodeListOf<Element> | Element[],
  animationClass: string,
  delayBetween: number = 100
): void => {
  Array.from(elements).forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass);
    }, index * delayBetween);
  });
};

// Функция для анимации счетчика
export const animateCounter = (
  element: Element,
  start: number,
  end: number,
  duration: number = 1000,
  easing: (t: number) => number = (t) => t
): void => {
  const startTime = performance.now();
  const difference = end - start;

  const updateCounter = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const current = Math.round(start + difference * easedProgress);
    
    element.textContent = current.toString();

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
};

// Easing функции
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  easeInOutQuint: (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  easeInElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInBounce: (t: number) => 1 - easingFunctions.easeOutBounce(1 - t),
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
};

// Функция для создания кастомной анимации
export const createCustomAnimation = (
  keyframes: Record<string, string>,
  options: {
    duration?: number;
    easing?: string;
    delay?: number;
    iterations?: number;
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  } = {}
) => {
  const {
    duration = 300,
    easing = 'ease',
    delay = 0,
    iterations = 1,
    direction = 'normal',
    fillMode = 'both'
  } = options;

  return (node: Element): TransitionConfig => {
    const keyframeString = Object.entries(keyframes)
      .map(([key, value]) => `${key} { ${value} }`)
      .join(' ');

    const animationName = `custom-animation-${Math.random().toString(36).substr(2, 9)}`;
    
    const style = document.createElement('style');
    style.textContent = `@keyframes ${animationName} { ${keyframeString} }`;
    document.head.appendChild(style);

    return {
      duration,
      delay,
      easing,
      css: () => `
        animation: ${animationName} ${duration}ms ${easing} ${delay}ms ${iterations} ${direction} ${fillMode};
      `,
      tick: (t, u) => {
        if (u === 0) {
          document.head.removeChild(style);
        }
      }
    };
  };
};