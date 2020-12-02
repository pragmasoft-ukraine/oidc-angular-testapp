import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { OktaAuth } from "@okta/okta-auth-js";

@Injectable({ providedIn: "root" })
export class AuthService {
  CLIENT_ID = "0oa2gfh9tywuM1Psb357";
  ISSUER = "https://auth.casualtyanalytics.co.uk/oauth2/default";
  LOGIN_REDIRECT_URI = "http://localhost:4200/callback";
  LOGOUT_REDIRECT_URI = "http://localhost:4200/";

  oktaAuth = new OktaAuth({
    clientId: this.CLIENT_ID,
    issuer: this.ISSUER,
    redirectUri: this.LOGIN_REDIRECT_URI,
    pkce: true,
  });

  constructor(private router: Router) {}

  async isAuthenticated(): Promise<boolean> {
    return !!(await this.oktaAuth.tokenManager.get("accessToken"));
  }

  login(): void {
    this.oktaAuth.token.getWithRedirect({
      scopes: ["tenant/default_client"],
    });
  }

  async handleAuthentication(): Promise<void> {
    const tokenContainer = await this.oktaAuth.token.parseFromUrl();
    this.oktaAuth.tokenManager.add(
      "accessToken",
      tokenContainer.tokens.accessToken
    );
    this.router.navigateByUrl("/");
  }

  async logout(): Promise<void> {
    await this.oktaAuth.signOut({
      postLogoutRedirectUri: this.LOGOUT_REDIRECT_URI,
    });
  }
}
