/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { NavBarLinkRef } from '@alfresco/adf-extensions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expand-menu',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './expand-menu.component.html',
  host: { class: 'app-expand-menu' }
})
export class ExpandMenuComponent implements OnInit {
  @Input()
  item: NavBarLinkRef;

  constructor(private cd: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.cd.detectChanges();
  }

  trackById(_index: number, obj: NavBarLinkRef) {
    return obj.id;
  }

  isRouteAbout(): boolean {
    return this.router.url.includes('/about');
  }

  isRouteProfile(): boolean {
    return this.router.url.includes('/profile');
  }

  isRouteSearch(): boolean {
    return this.router.url.includes('/search');
  }
}
