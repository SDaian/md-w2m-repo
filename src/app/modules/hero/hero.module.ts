import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { HeroComponent } from './hero.component';
import { HeroDialogComponent } from './components/hero-dialog/hero-dialog.component';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { HeroRoutingModule } from './hero-routing.module';
import { HeroService } from './services/hero.service';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { LoaderService } from './services/loader.service';
import { MaterialModule } from './material.module';
import { UpperCaseInputDirective } from './directives/uppercase.directive';

@NgModule({
  declarations: [
    LoaderComponent,
    HeroComponent,
    HeroListComponent,
    HeroDialogComponent,
    UpperCaseInputDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    HeroRoutingModule,
    MaterialModule,
  ],
  providers: [
    HeroService,
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
  ],
})
export class HeroModule {}
