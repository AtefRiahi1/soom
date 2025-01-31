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
      
     
    },
    {
        id: 6,
        label: 'Gestion des sessions',
        icon: 'bx-home-circle',
        link: '/sessionemploye',
        roles: ['ENTREPRISE']
      
     
    },
    {
         id: 7,
         label: 'CRM',
         icon: 'bx-home-circle',
          roles: ['CRM'],
         subItems: [
             {
             id:1,
             label: 'Gestion des clients',
             icon: 'bx-home-circle',
             link: 'clients',
             parentId:7,
     
         },
         {
            id:2,
            label: 'Gestion des Fournisseurs',
            icon: 'bx-home-circle',
            link: 'fournisseurs',
            parentId:7,
    
        },
        {
           id:3,
           label: 'Gestion des Articles',
           icon: 'bx-home-circle',
           link: 'articles',
           parentId:7,
   
       },
        
         ]
     },
     {
         id: 8,
         label: 'Liste des mouvements',
         icon: 'bx-home-circle',
         link: '/mouvements',
         roles: ['ENTREPRISE']
       
      
     },

];

