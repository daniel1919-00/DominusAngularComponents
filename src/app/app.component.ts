import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DominusRoute, dominusRoutes} from "./dominus-routes";
import {menuItem} from "./sidenav";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    menuItems: menuItem[] = [];
    title = 'Dominus Components';

    constructor(
    ) {
        const menuItems: menuItem[] = [];
        for(let i = dominusRoutes.length; i--;)
        {
            const dominusRoute = dominusRoutes[i];
            if(dominusRoute.data.displayInMenu) {
                menuItems.push(this.dominusRouteToMenuItem(dominusRoute));
            }
        }

        menuItems.sort((a, b) => {
            if ( a.title < b.title ){
                return -1;
            }

            if ( a.title > b.title ){
                return 1;
            }

            return 0;
        });
        this.menuItems = menuItems;
    }

    dominusRouteToMenuItem(route: DominusRoute): menuItem {
        return {
            title: route.title,
            path: '/' + route.path,
            icon: route.data.icon,
            children: []
        };
    }
}
