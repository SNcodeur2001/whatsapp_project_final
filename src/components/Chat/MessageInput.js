import { createElement } from '../../component';

export function createMessageInput() {
  return createElement('div', {
    class: ['h-[62px]', 'bg-[#f0f2f5]', 'flex', 'items-center', 'px-4', 'gap-2']
  }, [
    createElement('i', { class: ['fas', 'fa-smile', 'text-[#54656f]', 'cursor-pointer'] }),
    createElement('i', { class: ['fas', 'fa-paperclip', 'text-[#54656f]', 'cursor-pointer'] }),
    createElement('input', {
      type: 'text',
      placeholder: 'Tapez un message',
      class: [
        'flex-1',
        'h-[42px]',
        'bg-white',
        'rounded-lg',
        'px-4',
        'focus:outline-none',
        'placeholder-[#667781]'
      ]
    }),
    createElement('i', { class: ['fas', 'fa-microphone', 'text-[#54656f]', 'cursor-pointer'] })
  ]);
}