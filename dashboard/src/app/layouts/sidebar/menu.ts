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
        roles: ['ENTREPRISE']
      
     
    },
    {
        id: 3,
        label: 'Gestion des modules',
        icon: 'bx-home-circle',
        link: '/modules',
        roles: ['ENTREPRISE']
      
     
    },
    {
        id: 4,
        label: 'Gestion des comptes',
        icon: 'bx-home-circle',
        link: '/entreprises',
        roles: ['ADMIN']
      
     
    },
    {
        id: 5,
        label: 'Gestion des modules',
        icon: 'bx-home-circle',
        link: '/modulesadmin',
        roles: ['ADMIN']
      
     
    }

];

