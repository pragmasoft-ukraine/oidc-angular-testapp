import { Injectable } from "@angular/core";
import { CanLoad } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad {
  constructor(private okta: AuthService) {}

  async canLoad() {
    const authenticated = await this.okta.isAuthenticated();
    if (authenticated) {
      return true;
    }

    // Redirect to login flow.
    this.okta.login();
    return false;
  }
}
