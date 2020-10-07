import { getPassiveOptions } from '../utils/DOMUtils';

class CustomElement {
  constructor(element) {
    this.target = element;
  }
  css(styles) {
    const {target} = this;
    try {
      Object.assign(target.style, styles);
    } catch(err) {
      console.trace();
    }
  }
  on(name, callback, withoutOptions=false) {
    const {target} = this;
    try {
      if(withoutOptions) {
        target.addEventListener(name, callback);
      } else {
        const options = getPassiveOptions();
        target.addEventListener(name, callback, options);
      }
    } catch(err) {
      console.trace();
    }
  }
  off(name, callback) {
    const {target} = this;
    try {
      target.removeEventListener(name, callback);
    } catch(err) {
      console.trace();
    }
  }
}

export const $ = (target) => {
  if(target instanceof CustomElement) {
    return target;
  } else {
    return new CustomElement(target);
  }
};
