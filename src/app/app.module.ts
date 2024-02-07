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

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiModule,
    TuiRootModule,
    AuthModule,
    BrowserAnimationsModule,
    FileModule,
    ChatModule,
  ],
  providers: [
    { useClass: ApiInterceptor, multi: true, provide: HTTP_INTERCEPTORS },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
