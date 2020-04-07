import { sizeRange } from './util';

export default () => {
  window.tinymce.PluginManager.add('lineheight', (editor) => {
    editor.on('init', () => {
      editor.formatter.register({
        lineheight: {
          selector: 'p,h1,h2,h3,h4,h5,h6,div,ul,ol,li,pre,address',
          styles: { 'line-height': '%value' },
        },
      });
    });

    editor.addButton('lineheightselect', () => {
      const items = [];
      items.push({ text: 'Normal', value: 'normal' });
      sizeRange.forEach((size) => {
        const text = size;
        const value = `${size}px`;
        items.push({ text, value });
      });

      return {
        type: 'listbox',
        text: 'Line Height',
        tooltip: 'Line Height',
        values: items,
        fixedWidth: true,
        onPostRender() {
          // Code in below function helps in updating the selected value in toolbar dropdown
          editor.on('NodeChange', (e) => {
            const formatName = 'lineheight';
            const { formatter } = editor;
            let value = null;
            e.parents.forEach((node) => {
              if (!value) {
                items.forEach((item) => {
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
        // Code in below updates the applied style
        onselect() {
          editor.formatter.apply('lineheight', { value: this.value() });
          editor.fire('change');
        },
      };
    });
  });
};
