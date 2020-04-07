const fontWeightValues = [
  { text: 'Normal', value: 'normal' },
  { text: 'Bold', value: 'bold' },
  { text: '100', value: '100' },
  { text: '200', value: '200' },
  { text: '300', value: '300' },
  { text: '400', value: '400' },
  { text: '600', value: '600' },
  { text: '700', value: '700' },
  { text: '800', value: '800' },
];

export default () => {
  window.tinymce.PluginManager.add('fontweight', (editor) => {
    editor.on('init', () => {
      editor.formatter.register({
        fontweight: {
          inline: 'span',
          styles: { 'font-weight': '%value' },
        },
      });
    });

    editor.addButton('fontweightselect', () => ({
      type: 'listbox',
      text: 'Font Weight',
      tooltip: 'Font Weight',
      values: fontWeightValues,
      fixedWidth: true,

      onPostRender() {
        editor.on('NodeChange', (e) => {
          // Code in below function helps in updating the selected value in toolbar dropdown
          const formatName = 'fontweight';
          const { formatter } = editor;
          let value = null;
          e.parents.forEach((node) => {
            if (!value) {
              fontWeightValues.forEach((item) => {
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
        editor.formatter.apply('fontweight', { value: this.value() });
        editor.fire('change');
      },
    }));
  });
};
