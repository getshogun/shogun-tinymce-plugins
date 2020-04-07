const browserFonts = [
  { text: '(Default)', value: 'inherit' },
  { text: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { text: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
  {
    text: 'Courier New',
    value: 'Courier New, Courier, monospace',
  },
  { text: 'Georgia', value: 'Georgia, serif' },
  {
    text: 'Lucida Sans Unicode',
    value: 'Lucida Sans Unicode, Lucida Grande, sans-serif',
  },
  { text: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  {
    text: 'Times New Roman',
    value: 'Times New Roman, Times, serif',
  },
  {
    text: 'Trebuchet MS',
    value: 'Trebuchet MS, Helvetica, sans-serif',
  },
  { text: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
];

export const getBrowserFonts = () =>
  browserFonts.map((font) => ({
    ...font,
    type: 'menuitem',
    textStyle: `font-family:${font.value};`,
  }));
