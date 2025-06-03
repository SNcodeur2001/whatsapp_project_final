import { createElement } from '../component';

export function createInput(props = {}) {
  return createElement('input', {
    class: ['border', 'rounded-md', 'px-3', 'py-2', 'w-full', ...(props.class || [])],
    ...props
  });
}