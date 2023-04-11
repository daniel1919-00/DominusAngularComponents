export interface menuItemIcon {
  src: string;

  /**
   * defaults to font
   */
  type?: 'font' | 'image';
  /**
   * defaults to Material icons font
   */
  fontSet?: string;
}

export interface menuItem {
  title: string;
  path: string;
  icon: menuItemIcon;
  children: menuItem[];
}
