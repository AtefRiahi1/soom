import { MenuItem } from './menu.model';

const r =['ADMIN',
    'ENTREPRISE',
    'Achat',
    'Vente',
    'Rh'
];
export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true,

    },
    {
        id: 2,
        label: 'Gestion des employés',
        icon: 'bx-home-circle',
        link: '/employes',
        roles: ['ADMIN','ENTREPRISE']
      
     
    },
    {
        id: 3,
        label: 'Gestion des admins',
        icon: 'bx-home-circle',
        link: '/employes',
        roles: ['ADMIN']
      
     
    }

];

