import { Injectable } from "@angular/core";
import { CanLoad } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService) {}

  async canLoad() {
    if (await this.authService.isAuthenticated()) {
      return true;
    }
    this.authService.login();
    return false;
  }
}
