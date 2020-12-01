import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { CallbackComponent } from "./callback/callback.component";

const routes: Routes = [
  {
    path: "callback",
    component: CallbackComponent,
  },
  {
    path: "",
    canLoad: [AuthGuard],
    loadChildren: () => import("./main/main.module").then((m) => m.MainModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
