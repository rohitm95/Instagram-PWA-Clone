import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-help-page',
    imports: [MatGridListModule, MatIconModule, MatButtonModule],
    templateUrl: './help-page.component.html',
    styleUrl: './help-page.component.scss'
})
export class HelpPageComponent {

}
