/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'zoom-out': 'zoomOut 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typewriter': 'typewriter 2s steps(40) 1s both',
        'blink': 'blink 1s infinite',
        'gradient': 'gradient 3s ease infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'rubber-band': 'rubberBand 1s ease-out',
        'jello': 'jello 1s ease-out',
        'swing': 'swing 1s ease-out',
        'tada': 'tada 1s ease-out',
        'flip': 'flip 1s ease-out',
        'light-speed-in': 'lightSpeedIn 1s ease-out',
        'roll-in': 'rollIn 1s ease-out',
        // Анимации в стиле Аркейн
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        zoomOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' }
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' }
        },
        blink: {
          '0%, 50%': { borderColor: 'transparent' },
          '51%, 100%': { borderColor: 'currentColor' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' }
        },
        rubberBand: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
          '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
          '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
          '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
          '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
          '100%': { transform: 'scale3d(1, 1, 1)' }
        },
        jello: {
          '0%, 11.1%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '22.2%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
          '33.3%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
          '44.4%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
          '55.5%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
          '66.6%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
          '77.7%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
          '88.8%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' }
        },
        swing: {
          '0%': { transform: 'rotate3d(0, 0, 1, 0deg)' },
          '20%': { transform: 'rotate3d(0, 0, 1, 15deg)' },
          '40%': { transform: 'rotate3d(0, 0, 1, -10deg)' },
          '60%': { transform: 'rotate3d(0, 0, 1, 5deg)' },
          '80%': { transform: 'rotate3d(0, 0, 1, -5deg)' },
          '100%': { transform: 'rotate3d(0, 0, 1, 0deg)' }
        },
        tada: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '10%, 20%': { transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
          '40%, 60%, 80%': { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
          '100%': { transform: 'scale3d(1, 1, 1)' }
        },
        flip: {
          '0%': { transform: 'perspective(400px) rotate3d(0, 1, 0, -360deg)' },
          '40%': { transform: 'perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg)' },
          '50%': { transform: 'perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg)' },
          '80%': { transform: 'perspective(400px) scale3d(0.95, 0.95, 0.95)' },
          '100%': { transform: 'perspective(400px)' }
        },
        lightSpeedIn: {
          '0%': { transform: 'translate3d(100%, 0, 0) skewX(-30deg)', opacity: '0' },
          '60%': { transform: 'skewX(20deg)', opacity: '1' },
          '80%': { transform: 'skewX(-5deg)' },
          '100%': { transform: 'translate3d(0, 0, 0)', opacity: '1' }
        },
        rollIn: {
          '0%': { opacity: '0', transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' }
        },
        // Анимации в стиле Аркейн
        'glow-pulse': {
          '0%': { 
            boxShadow: '0 0 20px rgba(0, 115, 230, 0.3)',
            transform: 'scale(1)'
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(0, 115, 230, 0.6), 0 0 60px rgba(225, 64, 255, 0.3)',
            transform: 'scale(1.02)'
          }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      colors: {
        // Цветовая схема в стиле Аркейн
        arcane: {
          // Неоновый синий (основной цвет Аркейн)
          blue: {
            50: '#e6f3ff',
            100: '#b3d9ff',
            200: '#80bfff',
            300: '#4da6ff',
            400: '#1a8cff',
            500: '#0073e6',
            600: '#005bb3',
            700: '#004280',
            800: '#002a4d',
            900: '#00121a',
          },
          // Золотой/медный (цвет Пилтовера)
          gold: {
            50: '#fffdf0',
            100: '#fff8d1',
            200: '#fff0a3',
            300: '#ffe775',
            400: '#ffdd47',
            500: '#ffd319',
            600: '#e6b800',
            700: '#b38f00',
            800: '#806600',
            900: '#4d3d00',
          },
          // Темно-синий/фиолетовый (цвет Зауна)
          dark: {
            50: '#f0f0f5',
            100: '#d1d1e0',
            200: '#a3a3c2',
            300: '#7575a3',
            400: '#474785',
            500: '#191966',
            600: '#141452',
            700: '#0f0f3d',
            800: '#0a0a29',
            900: '#050514',
          },
          // Неоновый розовый/пурпурный (магия)
          pink: {
            50: '#fdf2ff',
            100: '#f9d9ff',
            200: '#f3b3ff',
            300: '#ed8cff',
            400: '#e766ff',
            500: '#e140ff',
            600: '#cb33e6',
            700: '#9f26b3',
            800: '#731a80',
            900: '#470d4d',
          },
          // Зеленый (химтех)
          green: {
            50: '#f0fff4',
            100: '#d1ffe0',
            200: '#a3ffc2',
            300: '#75ffa3',
            400: '#47ff85',
            500: '#19ff66',
            600: '#00e652',
            700: '#00b33d',
            800: '#008029',
            900: '#004d14',
          },
          // Красный (опасность/кровь)
          red: {
            50: '#fff0f0',
            100: '#ffd1d1',
            200: '#ffa3a3',
            300: '#ff7575',
            400: '#ff4747',
            500: '#ff1919',
            600: '#e60000',
            700: '#b30000',
            800: '#800000',
            900: '#4d0000',
          }
        },
        primary: {
          50: '#e6f3ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#005bb3',
          700: '#004280',
          800: '#002a4d',
          900: '#00121a',
        },
        success: {
          50: '#f0fff4',
          100: '#d1ffe0',
          200: '#a3ffc2',
          300: '#75ffa3',
          400: '#47ff85',
          500: '#19ff66',
          600: '#00e652',
          700: '#00b33d',
          800: '#008029',
          900: '#004d14',
        },
        warning: {
          50: '#fffdf0',
          100: '#fff8d1',
          200: '#fff0a3',
          300: '#ffe775',
          400: '#ffdd47',
          500: '#ffd319',
          600: '#e6b800',
          700: '#b38f00',
          800: '#806600',
          900: '#4d3d00',
        },
        error: {
          50: '#fff0f0',
          100: '#ffd1d1',
          200: '#ffa3a3',
          300: '#ff7575',
          400: '#ff4747',
          500: '#ff1919',
          600: '#e60000',
          700: '#b30000',
          800: '#800000',
          900: '#4d0000',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(59, 130, 246, 0.2)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'snappy': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

