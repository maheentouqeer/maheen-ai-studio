import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Poppins', 'system-ui', 'sans-serif'],
				premium: ['Playfair Display', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					soft: 'hsl(var(--secondary-soft))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					bright: 'hsl(var(--accent-bright))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-text': 'var(--gradient-text)',
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'elevate': 'var(--shadow-elevate)',
				'soft': 'var(--shadow-soft)',
				'deep': 'var(--shadow-deep)',
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				// Accordion Animations
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				
				// Enhanced Fade Animations
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-down': {
					'0%': { opacity: '0', transform: 'translateY(-30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(30px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				
				// Enhanced Scale Animations
				'scale-in': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(0.8)', opacity: '0' }
				},
				'zoom-in': {
					'0%': { transform: 'scale(0.95) rotate(-1deg)', opacity: '0' },
					'100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
				},
				
				// Slide Animations
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				
				// Premium Animations
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)', opacity: '0.7' },
					'70%': { transform: 'scale(0.9)', opacity: '0.9' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(214 92% 55% / 0.3)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px hsl(214 92% 55% / 0.8)',
						transform: 'scale(1.02)'
					}
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'tilt': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(1deg)' },
					'75%': { transform: 'rotate(-1deg)' }
				}
			},
			animation: {
				// Basic Animations
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				
				// Enhanced Fade Animations
				'fade-in': 'fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-down': 'fade-in-down 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-left': 'fade-in-left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in-right': 'fade-in-right 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				
				// Scale Animations
				'scale-in': 'scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'scale-out': 'scale-out 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'zoom-in': 'zoom-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				
				// Slide Animations
				'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-out-right': 'slide-out-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				
				// Premium Animations
				'float': 'float 3s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'tilt': 'tilt 2s ease-in-out infinite',
				
				// Combined Animations
				'enter': 'fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'exit': 'fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'hero-enter': 'fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1), scale-in 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
