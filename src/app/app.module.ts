import { ApiInterceptor } from './common/interceptor/api.interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TuiRootModule } from '@taiga-ui/core';
import { FileModule } from './features/file/file.module';
import { AuthModule } from './features/auth/auth.module';
import { TuiModule } from './shared/tui/tui.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './shared/components/home/home.component';
import { ChatModule } from './features/chat/chat.module';
import { UserModule } from './features/user/user.module';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { CapitalizePipe } from './common/pipe/capitalize.pipe';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, CapitalizePipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiModule,
    TuiRootModule,
    AuthModule,
    BrowserAnimationsModule,
    FileModule,
    ChatModule,
    UserModule
  ],
  providers: [
    { useClass: ApiInterceptor, multi: true, provide: HTTP_INTERCEPTORS },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
