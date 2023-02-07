/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { HeaderActionsComponent } from './header-actions.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('HeaderActionsComponent', () => {
  let component: HeaderActionsComponent;
  let fixture: ComponentFixture<HeaderActionsComponent>;
  let loader: HarnessLoader;

  // beforeAll(() => {
  //   TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  // });

  // beforeEach(
  //   //waitForAsync(
  //     () => {
  //     TestBed.configureTestingModule({
  //       imports: [AppTestingModule, NoopAnimationsModule, MatButtonModule, MatMenuModule],
  //       declarations: [HeaderActionsComponent]
  //     }).compileComponents();
  //     fixture = TestBed.createComponent(HeaderActionsComponent);
  //     component = fixture.componentInstance;
  //     fixture.detectChanges();
  //     loader = TestbedHarnessEnvironment.loader(fixture);
  //     inject([OverlayContainer], () => {})();
  //   }
  //   //)
  //   );

    // afterEach(() => {
    //   fixture.destroy();
    // });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(HeaderActionsComponent);
  //   fixture.detectChanges();
  //   loader = TestbedHarnessEnvironment.loader(fixture);
  //   inject([OverlayContainer], () => {})();
  // });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, NoopAnimationsModule, MatButtonModule, MatMenuModule],
      declarations: [HeaderActionsComponent]
    });

    fixture = TestBed.createComponent(HeaderActionsComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    inject([OverlayContainer], () => {})();
    fixture.detectChanges();
  });

  it('total number of buttons in header should be 2 if route is personal-files', async () => {
    spyOn(component, 'isPersonalFilesRoute').and.returnValue(true);
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    const createButton = await loader.getAllHarnesses(MatButtonHarness.with({text: 'APP.HEADER.BUTTONS.CREATE'}));
    const uploadButton = await loader.getAllHarnesses(MatButtonHarness.with({text: 'APP.HEADER.BUTTONS.UPLOAD'}));

    expect(buttons.length).toBe(2);
    expect(createButton.length).toBe(1);
    expect(uploadButton.length).toBe(1);
  });

  it('total number of buttons in header should be 1 if route is libraries', async () => {
    spyOn(component, 'isLibrariesRoute').and.returnValue(true);
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    const createButton = await loader.getAllHarnesses(MatButtonHarness.with({text: 'APP.HEADER.BUTTONS.CREATE'}));

    expect(buttons.length).toBe(1);
    expect(createButton.length).toBe(1);
  });

  it('should open and close the create menu', async () => {
    spyOn(component, 'isPersonalFilesRoute').and.returnValue(true);
    const createMenu = await loader.getHarness(MatMenuHarness.with({ triggerText: 'APP.HEADER.BUTTONS.CREATE' }));

    expect(await createMenu.isOpen()).toBe(false);
    await createMenu.open();
    expect(await createMenu.isOpen()).toBe(true);

    await createMenu.close();
    expect(await createMenu.isOpen()).toBe(false);
  });

  it('should open and close the upload menu', async () => {
    spyOn(component, 'isPersonalFilesRoute').and.returnValue(true);
    const uploadMenu = await loader.getHarness(MatMenuHarness.with({ triggerText: 'APP.HEADER.BUTTONS.UPLOAD' }));

    expect(await uploadMenu.isOpen()).toBe(false);
    await uploadMenu.open();
    expect(await uploadMenu.isOpen()).toBe(true);

    await uploadMenu.close();
    expect(await uploadMenu.isOpen()).toBe(false);
  });

  fit('should get all items', async () => {
    spyOn(component, 'isPersonalFilesRoute').and.returnValue(true);
    const createMenu = await loader.getHarness(MatMenuHarness.with({ triggerText: 'APP.HEADER.BUTTONS.CREATE' }));

    await createMenu.open();
    //let cItems = await createMenu.getAllHarnesses(MatMenuItemHarness);
    let cItems = await createMenu.getAllChildLoaders('app-toolbar-menu-item');
    expect(cItems.length).toBe(4);
  });

  it('should load create menu on click of create button', async () => {
    spyOn(component, 'isPersonalFilesRoute').and.returnValue(true);
    const buttons = await loader.getHarness(MatButtonHarness.with({ selector: '.aca-create-button' }));
    buttons.click();
    const createMenu = await loader.getHarness(MatMenuHarness.with({ triggerText: 'APP.HEADER.BUTTONS.CREATE' }));


    expect(createMenu).toBeTruthy();

    await createMenu.open();
    // const items = await createMenu.getItems({text: 'APP.NEW_MENU.MENU_ITEMS.CREATE_FOLDER'});
    const items = await createMenu.getItems();
    console.log("items", items);
    //expect(createMenu.isOpen()).toBe(true);
    expect(items.length).toBe(4);
  });

  it('should load upload menu on click of upload button', async () => {
    spyOn(component, 'isPersonalFilesRoute').and.returnValue(true);
    const buttons = await loader.getHarness(MatButtonHarness.with({ selector: '.aca-upload-button' }));
    buttons.click();
    const uploadMenu = await loader.getHarness(MatMenuHarness.with({ triggerText: 'APP.HEADER.BUTTONS.UPLOAD' }));

    expect(uploadMenu).toBeTruthy();
  
    const items = await uploadMenu.getItems({text: 'APP.NEW_MENU.MENU_ITEMS.UPLOAD_FILE'});
    expect(items.length).toBe(1);

    // expect((await uploadMenu.getItems()).length).toBe(2);

    // let items = await uploadMenu.getItems();
    // expect(items.length).toBe(2);
  });
});
