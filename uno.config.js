import { defineConfig, presetUno } from 'unocss'
import { presetMini } from '@unocss/preset-mini'

// Material Design 3 调色板
const materialColors = {
  'primary': {
    DEFAULT: 'rgb(var(--md-sys-color-primary))',
    'container': 'rgb(var(--md-sys-color-primary-container))',
    'on': 'rgb(var(--md-sys-color-on-primary))',
    'on-container': 'rgb(var(--md-sys-color-on-primary-container))',
  },
  'secondary': {
    DEFAULT: 'rgb(var(--md-sys-color-secondary))',
    'container': 'rgb(var(--md-sys-color-secondary-container))',
    'on': 'rgb(var(--md-sys-color-on-secondary))',
    'on-container': 'rgb(var(--md-sys-color-on-secondary-container))',
  },
  'surface': {
    DEFAULT: 'rgb(var(--md-sys-color-surface))',
    'variant': 'rgb(var(--md-sys-color-surface-variant))',
    'on': 'rgb(var(--md-sys-color-on-surface))',
    'on-variant': 'rgb(var(--md-sys-color-on-surface-variant))',
  }
}

// Material Design 3 排版
const typography = {
  'display-large': 'font-roboto text-[57px] leading-[64px] tracking-[-0.25px]',
  'display-medium': 'font-roboto text-[45px] leading-[52px] tracking-normal',
  'display-small': 'font-roboto text-[36px] leading-[44px] tracking-normal',
  'headline-large': 'font-roboto text-[32px] leading-[40px] tracking-normal',
  'headline-medium': 'font-roboto text-[28px] leading-[36px] tracking-normal',
  'headline-small': 'font-roboto text-[24px] leading-[32px] tracking-normal',
  'body-large': 'font-roboto text-[16px] leading-[24px] tracking-[0.5px]',
  'body-medium': 'font-roboto text-[14px] leading-[20px] tracking-[0.25px]',
  'body-small': 'font-roboto text-[12px] leading-[16px] tracking-[0.4px]',
  'label-large': 'font-roboto text-[14px] leading-[20px] tracking-[0.1px]',
  'label-medium': 'font-roboto text-[12px] leading-[16px] tracking-[0.5px]',
  'label-small': 'font-roboto text-[11px] leading-[16px] tracking-[0.5px]',
}

// Material Design 3 阴影
const elevation = {
  'elevation-1': 'shadow-md',
  'elevation-2': 'shadow-lg',
  'elevation-3': 'shadow-xl',
  'elevation-4': 'shadow-2xl',
}

export default defineConfig({
  presets: [
    presetUno(),
    presetMini(),
  ],
  theme: {
    colors: materialColors,
    extend: {
      spacing: {
        '1dp': '1px',
        '4dp': '4px',
        '8dp': '8px',
        '12dp': '12px',
        '16dp': '16px',
        '24dp': '24px',
        '32dp': '32px',
        '48dp': '48px',
        '64dp': '64px',
      }
    }
  },
  shortcuts: {
    // 排版快捷方式
    ...typography,
    // 阴影快捷方式
    ...elevation,
    // 常用布局
    'md-container': 'max-w-5xl mx-auto px-24dp',
    'md-card': 'bg-surface rounded-lg p-16dp elevation-1',
    'md-surface': 'bg-surface p-16dp',
    // 交互状态
    'md-interactive': 'transition-all duration-200 ease-in-out hover:brightness-110 active:brightness-90',
    // 响应式布局
    'md-responsive-grid': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16dp',
  },
  safelist: [
    // 确保关键类始终被打包
    ...Object.values(typography),
    ...Object.values(elevation),
  ]
})
