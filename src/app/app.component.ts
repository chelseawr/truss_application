import { Component } from '@angular/core';
import { faDev, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'truss_app';
  gitIcon = faGithub;
  devIcon = faDev;
  liIcon = faLinkedin;

}
