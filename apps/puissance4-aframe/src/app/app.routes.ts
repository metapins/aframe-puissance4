export const routes = [
  {
    path: '/',
    redirect: '/game/forest',
  },
  {
    path: '/game/(.*)',
    action: async () => {
      await import('@marcbuils/puissance4-game/feature-game');
    },
    component: 'p4g-game',
  },
];
