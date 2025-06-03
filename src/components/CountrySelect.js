import { createElement } from '../component';

export function createCountrySelect(props = {}) {
  return createElement('select', {
    class: [
      'w-full',
      'border-gray-300',
      'rounded-lg',
      'px-2',
      'py-2',
      'focus:ring-[#00a884]',
      'focus:border-[#00a884]',
      'text-[#41525d]',
      ...(props.class || [])
    ],
    ...props
  }, [
    createElement('option', { value: 'SN' }, '🇸🇳 Sénégal (+221)'),
    createElement('option', { value: 'FR' }, '🇫🇷 France (+33)'),
    createElement('option', { value: 'BE' }, '🇧🇪 Belgique (+32)'),
    createElement('option', { value: 'CH' }, '🇨🇭 Suisse (+41)')
  ]);
}