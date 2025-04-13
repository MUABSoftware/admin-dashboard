
export interface MenuItem {
  id: string;
  label: string;
  type?: string;
  link?: string;
  subItems?: MenuItem[];
  labelAr?: string;
  parentId?: string;
}

export const initialMenuData: MenuItem[] = [
  { id: '1', label: 'Categories' },
  { id: '2', label: 'Web Development', subItems: [
    { id: '2-1', label: 'Frontend Development' },
    { id: '2-2', label: 'Backend Development' }
  ]},
  { id: '3', label: 'Mobile App development', subItems: [
    { id: '3-1', label: 'iOS Development' },
    { id: '3-2', label: 'Android Development' }
  ]},
  { id: '4', label: 'Customize Software Solutions' },
  { id: '5', label: 'Startup Support' },
  { id: '6', label: 'SEO Services' },
  { id: '7', label: 'Marketing Agency' },
  { id: '8', label: 'AI Technologies' },
];
