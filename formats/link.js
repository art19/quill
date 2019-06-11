import Inline from '../blots/inline';

class Link extends Inline {
  static create(value) {
    let { href = value, rel } = value;
    let node = super.create(href);
    href = this.sanitize(href);
    node.setAttribute('href', href);
    node.setAttribute('target', '_blank');
    if (rel) {
      node.setAttribute('rel', rel);
    }
    return node;
  }

  static formats(domNode) {
    const href = domNode.getAttribute('href');
    const rel = domNode.getAttribute('rel');
    const hasRel = rel !== null;
    return hasRel ? { href, rel } : href;
  }

  static sanitize(url) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  }

  format(name, value) {
    if (value) {
      let { href = value, rel = null } = value;
      if (rel) {
        this.domNode.setAttribute('rel', rel);
      } else {
        this.domNode.removeAttribute('rel');
      }
      if (name !== this.statics.blotName || !href) return super.format(name, href);
      href = this.constructor.sanitize(href);
      this.domNode.setAttribute('href', href);
    } else {
      this.domNode.removeAttribute('rel');
      if (name !== this.statics.blotName || !value) return super.format(name, value);
      let href = this.constructor.sanitize(value);
      this.domNode.setAttribute('href', href);
    }
  }
}
Link.blotName = 'link';
Link.tagName = 'A';
Link.SANITIZED_URL = 'about:blank';
Link.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel'];


function sanitize(url, protocols) {
  let anchor = document.createElement('a');
  anchor.href = url;
  let protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}


export { Link as default, sanitize };
