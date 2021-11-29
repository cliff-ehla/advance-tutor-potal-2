module.exports = {
  purge: {
    content: ["./src/**/*.svelte"],
    options: {
      whitelistPatterns: [/svelte-/],
    },
  },
  theme: {
    fontSize: {
      'xxs': ['0.6rem'],
      'xs': ['0.75rem'],
      'sm': ['0.875rem'],
      DEFAULT: ['1rem'],
      'p2': ['1.125rem'],
      't1': ['1.25rem', {lineHeight: '1.1'}],
      't2': ['1.5rem', {lineHeight: '1.1'}],
      'h1': ['2rem', {lineHeight: '1'}]
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: {
        '50': '#FCFCFC',
        '100': '#FAFAFA',
        '200': '#F2F2F2',
        '300': '#DDDDDD',
        '400': '#7B818E',
        '500': '#616161',
        '700': '#424242',
        '800': '#000000'
      },
      red:  {
        '500': '#FF6A3A'
      },
      blue: {
        '100': '#ebeff3',
        '200': '#dbeeff',
        '300': '#84b4d4',
        '500': '#21A6FF',
        '700': '#0f8cde'
      },
      green: {
        '500': '#70C449',
        '700': '#6c9a5c'
      },
      yellow: {
        '500': '#e6b700'
      },
      grammar: '#9F545D',
      speaking: '#1E3E78',
      listening: '#D6D294',
      reading: '#e6b700',
      writing: '#AAC6A0',
      revision: '#424242',
      vocab: '#977250',
      rcd: '#742626'
    },
    borderRadius: {
      none: '0px',
      sm: '0.25rem',
      DEFAULT: '0.5rem',
      lg: '1rem',
      xl: '1.5rem',
      full: '9999px',
    },
    extend: {
      maxWidth: {
        none: 'none',
        xs: '10rem',
        sm: '14rem',
        md: '18rem',
        lg: '22rem',
        xl: '26rem'
      }
    }
  },
  variants: {
    display: ['responsive','group-hover']
  }
};
