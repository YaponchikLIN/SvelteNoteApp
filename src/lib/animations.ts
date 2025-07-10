import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

/**
 * Анимация появления с затуханием
 */
export function fadeIn(node: Element, { delay = 0, duration = 300, easing = cubicOut } = {}): TransitionConfig {
  return {
    delay,
    duration,
    easing,
    css: (t: number) => `
      opacity: ${t};
      transform: translateY(${(1 - t) * 10}px);
    `
  };
}

/**
 * Анимация масштабирования
 */
export function scale(node: Element, { delay = 0, duration = 300, easing = cubicOut, start = 0.95 } = {}): TransitionConfig {
  return {
    delay,
    duration,
    easing,
    css: (t: number) => {
      const scale = start + (1 - start) * t;
      return `
        transform: scale(${scale});
        opacity: ${t};
      `;
    }
  };
}

/**
 * Анимация подпрыгивания
 */
export function bounce(node: Element, { delay = 0, duration = 600, easing = cubicOut } = {}): TransitionConfig {
  return {
    delay,
    duration,
    easing,
    css: (t: number) => {
      const bounce = Math.sin(t * Math.PI * 3) * (1 - t) * 0.1;
      return `
        transform: translateY(${bounce * 20}px) scale(${0.95 + t * 0.05});
        opacity: ${t};
      `;
    }
  };
}

/**
 * Анимация скольжения слева
 */
export function slideInLeft(node: Element, { delay = 0, duration = 300, easing = cubicOut } = {}): TransitionConfig {
  return {
    delay,
    duration,
    easing,
    css: (t: number) => `
      transform: translateX(${(1 - t) * -100}px);
      opacity: ${t};
    `
  };
}

/**
 * Анимация скольжения справа
 */
export function slideInRight(node: Element, { delay = 0, duration = 300, easing = cubicOut } = {}): TransitionConfig {
  return {
    delay,
    duration,
    easing,
    css: (t: number) => `
      transform: translateX(${(1 - t) * 100}px);
      opacity: ${t};
    `
  };
}

/**
 * Функции для CSS классов анимаций
 */
export const animations = {
  fadeIn,
  scale,
  bounce,
  slideInLeft,
  slideInRight
};

/**
 * CSS классы для анимаций
 */
export const animationClasses = {
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping'
};