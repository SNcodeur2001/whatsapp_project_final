import { createElement } from '../component';

export function createButton(text, props = {}) {
  return createElement('button', {
    class: [
      'bg-[#008069]',
      'text-white',
      'px-6',
      'py-3',
      'rounded-sm',
      'hover:bg-[#006e5c]',
      'transition-colors',
      'text-sm',
      'font-medium',
      'uppercase',
      ...(props.class || [])
    ],
    ...props
  }, text);
}