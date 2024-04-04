import { Component} from '@angular/core';
import { HeaderComponent } from './layouts/header/header.component';
//router-outlet
import { RouterOutlet } from "@angular/router";
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [ NavBarComponent, HeaderComponent , RouterOutlet , DashboardComponent],
  standalone: true

})
export class AdminComponent {

}
