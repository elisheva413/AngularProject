// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-netfree',
//   imports: [],
//   templateUrl: './netfree.html',
//   styleUrl: './netfree.scss',
// })
// export class Netfree {

// }
// import { Component, inject } from '@angular/core';
// import { CommonModule, Location } from '@angular/common';

// @Component({
//   selector: 'app-netfree',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './netfree.html', 
//   styleUrls: ['./netfree.scss']
// })
// export class NetfreeComponent {
//   // השירות הזה יודע לנווט בהיסטוריית הדפדפן
//   private location = inject(Location);

//   goBack() {
//     this.location.back(); // מחזיר בדיוק לעמוד שממנו הלקוח נזרק!
//   }
// }
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-netfree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './netfree.html',
  styleUrls: ['./netfree.scss']
})
export class NetfreeComponent implements OnInit {
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // מבטיח שהדף הלבן יתמלא בתוכן מיד עם הטעינה
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  goBack() {
    this.location.back();
  }
}