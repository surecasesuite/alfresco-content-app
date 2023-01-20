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

import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { ContentServiceExtensionService } from '../../../../../aca-content/src/lib/services/content-service-extension.service';

@Component({
  selector: 'aca-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-page-layout' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageLayoutComponent implements OnInit {
  @Input()
  hasError = false;
  hideSidenav: boolean;

  constructor(private contentServices: ContentServiceExtensionService, private ref: ChangeDetectorRef) {
    setInterval(() => {
      this.ref.detectChanges();
    });
  }

  ngOnInit() {
    this.contentServices.cast.subscribe((data) => (this.hideSidenav = data));
  }

  toggleClick() {
    this.hideSidenav = !this.hideSidenav;
    this.contentServices.push(this.hideSidenav);
  }
}
