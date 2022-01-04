export const routes = [
  {
    path: '/game',
    children: [
      {
        path: '/forest',
        action: async () => {
          await import('@marcbuils/puissance4-game/feature-game-forest');
        },
        component: 'a-p4g-game-forest',
      },
      {
        path: '/arches',
        action: async () => {
          await import('@marcbuils/puissance4-game/feature-game-arches');
        },
        component: 'a-p4g-game-arches',
      },
    ],
  },
];
