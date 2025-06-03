import { createElement } from '../../component';

export function createMiniSidebar() {
  return createElement('div', {
    class: [
      'w-[70px]',
      'bg-[#e9edef]',
      'flex',
      'flex-col',
      'items-center',
      'py-2',
      'border-r',
      'border-[#d1d7db]'
    ]
  }, [
    // Avatar
    createElement('div', {
      class: [
        'w-10',
        'h-10',
        'rounded-full',
        'bg-[#dfe5e7]',
        'cursor-pointer',
        'mb-4'
      ]
    }),
    // Navigation Icons
    createElement('div', {
      class: ['flex', 'flex-col', 'gap-4']
    }, [
      createNavItem('💬', true),
      createNavItem('👥'),
      createNavItem('⭕'),
      createNavItem('📝'),
    ])
  ]);
}

function createNavItem(icon, isActive = false) {
  return createElement('div', {
    class: [
      'w-12',
      'h-12',
      'flex',
      'items-center',
      'justify-center',
      'cursor-pointer',
      'text-xl',
      isActive ? 'text-[#00a884]' : 'text-[#54656f]',
      'hover:bg-[#dadfe2]',
      'rounded-lg',
      'transition-colors'
    ]
  }, icon);
}