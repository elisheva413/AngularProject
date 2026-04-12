
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router'; 
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-store-locator',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    InputTextModule, 
    PasswordModule, 
    ButtonModule, 
    FloatLabelModule,
    DividerModule 
  ],
  templateUrl: './store-locator.html',
  styleUrl: './store-locator.scss'
})
export class StoreLocatorComponent {
 
   stores = [
  { city: 'אילת', branch: 'מול הים', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'אשדוד', branch: 'ביג פאשן', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'אשקלון', branch: 'קניון גירון', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'באר שבע', branch: 'גרנד קניון', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'בית שמש', branch: 'ביג', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'גבעתיים', branch: 'קניון גבעתיים', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'חדרה', branch: 'מול החוף וילג\'', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'חולון', branch: 'קניון חולון', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'חיפה', branch: 'עופר גרנד קניון', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'טבריה', branch: 'ביג', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'ירושלים', branch: 'קניון מלחה', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'ירושלים', branch: 'קניון ממילא', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'כרמיאל', branch: 'ביג', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'מודיעין', branch: 'קניון עזריאלי', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'נצרת', branch: 'ביג פאשן', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'נתניה', branch: 'עיר ימים', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'פתח תקווה', branch: 'הקניון הגדול', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'קריות', branch: 'קריון', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'קריית אונו', branch: 'קניון דרור', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'ראש פינה', branch: 'סנטר הגליל', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'ראשון לציון', branch: 'קניון הזהב', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'ראשון לציון', branch: 'קניון ראשונים', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'רחובות', branch: 'קניון רחובות', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'רמת גן', branch: 'קניון איילון', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'רעננה', branch: 'קניון רננים', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'תל אביב', branch: 'קניון עזריאלי', link: 'https://maps.app.goo.gl/uXyYw' },
  { city: 'תל אביב', branch: 'דיזנגוף סנטר', link: 'https://maps.app.goo.gl/uXyYw' }
];
}