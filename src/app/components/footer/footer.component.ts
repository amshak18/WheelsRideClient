import {Component, OnInit} from '@angular/core';
import {faFacebook, faGithub, faInstagram, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {faEnvelope} from "@fortawesome/free-regular-svg-icons";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  /**
   * List of font awesome icons used to show in the footer for the contact us section.
   */
  faLinkedIn = faLinkedin;
  faGithub = faGithub;
  faGmail = faEnvelope;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  isHandsetPortrait = false;
  isHandsetLandscape = false;
  isWebPortrait = false;
  isWebLandscape = false;

  /**
   * This is the component constructor where all the required services can be injected.
   * @param responsive the BreakPointObserver used to create the mobile first responsive UI.
   */
  constructor(private responsive: BreakpointObserver) {
  }

  /**
   * This is an angular lifecycle method called when the component is displayed on the screen.
   * This is used to subscribe to the BreakPointObserver and set the UI styles appropriately.
   */
  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,
      Breakpoints.WebPortrait,
      Breakpoints.WebLandscape])
      .subscribe({
        next: (result: BreakpointState) => {
          const breakpoints = result.breakpoints;
          this.isHandsetPortrait = false;
          this.isHandsetLandscape = false;
          this.isWebPortrait = false;
          this.isWebLandscape = false;
          if (breakpoints[Breakpoints.HandsetPortrait]) {
            console.log("Handset Portrait");
            this.isHandsetPortrait = true;
          }
          if (breakpoints[Breakpoints.HandsetLandscape]) {
            console.log("Handset Landscape");
            this.isHandsetLandscape = true;
          }
          if (breakpoints[Breakpoints.WebPortrait]) {
            console.log("Web Portrait");
            this.isWebPortrait = true;
          }
          if (breakpoints[Breakpoints.WebLandscape]) {
            console.log("Web Landscape");
            this.isWebLandscape = true;
          }
        }
      });
  }

}
