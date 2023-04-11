import {Route} from "@angular/router";
import {menuItemIcon} from "./sidenav";

export interface DominusRoute extends Route {
  title: string;
  data: {
    displayInMenu: boolean;
    icon: menuItemIcon
  }
}

export const dominusRoutes: DominusRoute[] = [
  {
    title: 'Uploader',
    path: 'uploader',
    loadComponent: () => import('./demo/uploader-demo/uploader-demo.component').then(c => c.UploaderDemoComponent),
    data: {
      displayInMenu: true,
      icon: {
        src: 'file_upload'
      }
    }
  },
];
