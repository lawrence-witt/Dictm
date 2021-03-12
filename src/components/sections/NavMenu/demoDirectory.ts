type IconTypes = 'album' | 'note' | 'category' | 'settings' | 'signout';

interface MenuItem {
    primary: string,
    secondary?: string,
    type: 'link' | 'action',
    value: string,
    icon?: IconTypes,
    divider?: boolean,
    subItems?: MenuItem[]
}

const demoDirectory: MenuItem[] = [
    {
        primary: 'Recordings', 
        secondary: '',
        type: 'link',  
        value: '/recordings', 
        icon: 'album'
    },
    {
        primary: 'Notes',
        secondary: '',
        type: 'link',
        value: '/notes',
        icon: 'note'
    },
    {
        primary: 'Categories',
        secondary: '',
        type: 'link',
        value: '/categories',
        icon: 'category',
        subItems: [
            {
                primary: 'CategoryOne',
                secondary: '',
                type: 'link',
                value: '/categories/categoryOne'
            }
        ]
    },
    {
        primary: 'Settings',
        secondary: '',
        type: 'link',
        value: '/settings',
        icon: 'settings',
        divider: true
    },
    {
        primary: 'Sign Out',
        secondary: '',
        type: 'action',
        value: 'sign-out',
        icon: 'signout'
    }
];

export default demoDirectory;