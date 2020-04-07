const letterSpacingValues = [
  { text: 'Normal', value: 'normal' },
  { text: '1', value: '1px' },
  { text: '2', value: '2px' },
  { text: '3', value: '3px' },
  { text: '4', value: '4px' },
  { text: '5', value: '5px' },
  { text: '6', value: '6px' },
  { text: '7', value: '7px' },
  { text: '8', value: '8px' },
  { text: '9', value: '9px' },
  { text: '10', value: '10px' },
];

export default () => {
  window.tinymce.PluginManager.add('letterspacing', (editor) => {
    editor.on('init', () => {
      editor.formatter.register({
        letterspacing: {
          inline: 'span',
          styles: { 'letter-spacing': '%value' },
        },
      });
    });

    editor.addButton('letterspacingselect', () => ({
      type: 'listbox',
      text: 'Letter Spacing',
      tooltip: 'Letter Spacing',
      values: letterSpacingValues,
      fixedWidth: true,

      onPostRender() {
        // Code in below function helps in updating the selected value in toolbar dropdown
        editor.on('NodeChange', (e) => {
          const formatName = 'letterspacing';
          const { formatter } = editor;
          let value = null;
          e.parents.forEach((node) => {
            if (!value) {
              letterSpacingValues.forEach((item) => {
                if (formatName) {
                  if (
                    formatter.matchNode(node, formatName, {
                      value: item.value,
                    })
                  ) {
                    value = item.value;
                  }
                } else if (formatter.matchNode(node, item.value)) {
                  value = item.value;
                }
              });
            }
          });
          this.value(value);
        });
      },

      onselect() {
        editor.formatter.apply('letterspacing', { value: this.value() });
        editor.fire('change');
      },
    }));
  });
};
