import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { LocalStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public urlName: string;
  public loginUrl = ["login"];
  public isNonLayout: boolean = true;

  constructor(private router: Router, route: ActivatedRoute, private localStorageService: LocalStorageService,) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        // Traverse the active route tree
        var snapshot = route.snapshot;
        var activated = route.firstChild;
        if (activated != null) {
          while (activated != null) {
            snapshot = activated.snapshot;
            activated = activated.firstChild;
          }
        }

        // Try finding the 'stateName' from the data
        this.urlName = snapshot.url[0].path;
        this.isNonLayout = this.checkNonLayout();
        if (this.localStorageService.retrieve('user') == null) {
          this.router.navigate(['/login']);
        }
      }
    });
  };

  private checkNonLayout(): boolean {
    if (this.loginUrl.indexOf(this.urlName) > -1) {
      return true;
    }

    return false;
  }
}