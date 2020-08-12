import { NgModule } from '@angular/core';
import { ExtensionService } from '@alfresco/adf-extensions';
import { MyExtensionComponent } from './my-extension.component';

@NgModule({
  declarations: [MyExtensionComponent],
  imports: [],
  exports: [MyExtensionComponent]
})
export class MyExtensionModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'my-extension.main.component': MyExtensionComponent
    });
  }
}
