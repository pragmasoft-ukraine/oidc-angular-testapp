import { Observable, Observer } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { OktaAuth } from "@okta/okta-auth-js";

@Injectable({ providedIn: "root" })
export class AuthService {

  CLIENT_ID = "0oa4jk1fjlcnzyIqq357";
  ISSUER = "https://auth.casualtyanalytics.co.uk/oauth2/default";
  LOGIN_REDIRECT_URI = "http://localhost:4200/callback";
  LOGOUT_REDIRECT_URI = "http://localhost:4200/";

  oktaAuth = new OktaAuth({
    clientId: this.CLIENT_ID,
    issuer: this.ISSUER,
    redirectUri: this.LOGIN_REDIRECT_URI,
    pkce: true
  });

  $isAuthenticated: Observable<boolean>;
  private observer: Observer<boolean>;
  constructor(private router: Router) {
    this.$isAuthenticated = new Observable((observer: Observer<boolean>) => {
      this.observer = observer;
      this.isAuthenticated().then((val) => {
        observer.next(val);
      });
    });
  }

  async isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!(await this.oktaAuth.tokenManager.get("accessToken"));
  }

  login(originalUrl?) {
    // Save current URL before redirect
    sessionStorage.setItem("okta-app-url", originalUrl || this.router.url);

    // Launches the login redirect.
    this.oktaAuth.token.getWithRedirect({
      scopes: ["tenant/default_client"],
    });
  }

  async handleAuthentication() {
    const tokenContainer = await this.oktaAuth.token.parseFromUrl();

    this.oktaAuth.tokenManager.add("idToken", tokenContainer.tokens.idToken);
    this.oktaAuth.tokenManager.add(
      "accessToken",
      tokenContainer.tokens.accessToken
    );

    if (await this.isAuthenticated()) {
      this.observer.next(true);
    }

    // Retrieve the saved URL and navigate back
    const url = sessionStorage.getItem("okta-app-url");
    this.router.navigateByUrl(url);
  }

  async logout() {
    await this.oktaAuth.signOut({
      postLogoutRedirectUri: this.LOGOUT_REDIRECT_URI,
    });
  }
}
