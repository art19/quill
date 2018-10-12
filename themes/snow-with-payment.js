import extend from 'extend';
import Emitter from '../core/emitter';
import SnowTheme, { SnowTooltip } from './snow';
import LinkBlot from '../formats/link';
import { Range } from '../core/selection';
import icons from '../ui/icons';


const TOOLBAR_CONFIG = [
  [{ header: ['1', '2', '3', false] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean']
];

class SnowThemeWithPayment extends SnowTheme {
  extendToolbar(toolbar) {
    toolbar.container.classList.add('ql-snow');
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), icons);
    this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), icons);
    this.tooltip = new SnowTooltipWithPayment(this.quill, this.options.bounds);
    if (toolbar.container.querySelector('.ql-link')) {
      this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, function(range, context) {
        toolbar.handlers['link'].call(toolbar, !context.format.link);
      });
    }
  }
}
SnowThemeWithPayment.DEFAULTS = extend(true, {}, SnowTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link: function(value) {
          if (value) {
            let range = this.quill.getSelection();
            if (range == null || range.length == 0) return;
            let preview = this.quill.getText(range);
            if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
              preview = 'mailto:' + preview;
            }
            let tooltip = this.quill.theme.tooltip;
            tooltip.edit('payment', preview);
          } else {
            this.quill.format('payment', false);
          }
        }
      }
    }
  }
});


class SnowTooltipWithPayment extends SnowTooltip {
  save() {
    let { value  } = this.textbox;
    switch (this.root.getAttribute('data-mode')) {
      case 'payment': {
        const { scrollTop } = this.quill.root;
        if (this.linkRange) {
          this.quill.formatText(
            this.linkRange,
            'payment',
            value,
            Emitter.sources.USER
          );
          delete this.linkRange;
        } else {
          this.restoreFocus();
          this.quill.format('payment', value, Emitter.sources.USER);
        }
        this.quill.root.scrollTop = scrollTop;
        break;
      }
    }
    super.save();
    this.textbox.value = '';
    this.hide();
  }
}
SnowTooltipWithPayment.TEMPLATE = [
  '<select>',
  '<option value="link">Link</option>',
  '<option value="payment">Payment</option>',
  '</select>',
  '<a class="ql-preview" target="_blank" href="about:blank"></a>',
  '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
  '<a class="ql-action"></a>',
  '<a class="ql-remove"></a>'
].join('');


export { SnowTooltipWithPayment, SnowThemeWithPayment as default };
