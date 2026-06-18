import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TagsService } from "../../services/tags.service";
import { ArticleListConfig } from "../../models/article-list-config.model";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";
import { ArticleListComponent } from "../../components/article-list.component";
import { tap } from "rxjs/operators";
import { UserService } from "../../../../core/auth/services/user.service";
import { RxLet } from "@rx-angular/template/let";
import { IfAuthenticatedDirective } from "../../../../core/auth/if-authenticated.directive";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-home-page",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  imports: [
    NgClass,
    ArticleListComponent,
    AsyncPipe,
    RxLet,
    NgForOf,
    IfAuthenticatedDirective,
  ],
  standalone: true,
})
export default class HomeComponent implements OnInit {
  isAuthenticated = false;
  listConfig: ArticleListConfig = {
    type: "all",
    filters: {},
  };
  tags$ = inject(TagsService)
    .getAll()
    .pipe(tap(() => (this.tagsLoaded = true)));
  tagsLoaded = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.isAuthenticated
      .pipe(
        tap((isAuthenticated) => {
          // Store the previous authentication state to detect changes
          const wasAuthenticated = this.isAuthenticated;
          this.isAuthenticated = isAuthenticated;
          
          // Trigger feed refresh when authentication state changes
          if (isAuthenticated !== wasAuthenticated) {
            if (isAuthenticated) {
              this.setListToWithRefresh("feed");
            } else {
              this.setListToWithRefresh("all");
            }
          } else {
            // Initial load - set list type without forcing refresh
            if (isAuthenticated) {
              this.setListTo("feed");
            } else {
              this.setListTo("all");
            }
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  setListTo(type: string = "", filters: Object = {}): void {
    // If feed is requested but user is not authenticated, redirect to login
    if (type === "feed" && !this.isAuthenticated) {
      void this.router.navigate(["/login"]);
      return;
    }

    // Otherwise, set the list object
    this.listConfig = { type: type, filters: filters };
  }

  setListToWithRefresh(type: string = "", filters: Object = {}): void {
    // If feed is requested but user is not authenticated, redirect to login
    if (type === "feed" && !this.isAuthenticated) {
      void this.router.navigate(["/login"]);
      return;
    }

    // Create a new config object to trigger change detection in ArticleListComponent
    // Add a timestamp to ensure the object reference changes
    this.listConfig = { 
      type: type, 
      filters: { ...filters },
      refreshTrigger: Date.now()
    };
  }
}