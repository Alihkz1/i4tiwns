import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Routes = [
    {
        path: "",
        component: LayoutComponent,
        children: [
            {
                path: "editor",
                loadChildren: () =>
                    import("./pages/editor/editor.routing").then(
                        (r) => r.routes,
                    ),
            },
            {
                path: "auth",
                loadChildren: () =>
                    import("./pages/auth/auth.routing").then(
                        (r) => r.routes,
                    ),
            },
        ]
    }
]