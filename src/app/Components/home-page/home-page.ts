import { Component, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage {
  private el = inject(ElementRef);
  
  mainImageTransform = 'translateY(0px)'; // הגדולה נשארת העוגן היציב שלנו
  sideImageTransform = 'translateY(0px)';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // מוצאים את אזור החריטה במסך
    const section = this.el.nativeElement.querySelector('.engraving-editorial-final');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // חישוב המרכז המדויק של המסך לעומת המרכז של אזור החריטה
    const viewportCenter = windowHeight / 2;
    const sectionCenter = rect.top + (rect.height / 2);

    // חישוב ההתקדמות מ- 1- (העמוד רק נכנס) ל- 0 (אמצע מושלם) ל- 1+ (העמוד יוצא)
    let progress = (viewportCenter - sectionCenter) / (windowHeight / 2 + rect.height / 2);

    // חוסמים חריגות כדי שהתמונה לא תמשיך לעוף כשכבר עברנו את העמוד
    if (progress < -1) progress = -1;
    if (progress > 1) progress = 1;

    // --- המתמטיקה של העיצוב ---
    // התמונה הגדולה: 93vh, הקטנה: 60vh. ההפרש: 33vh. 
    // כדי ליישר אותן קו-למעלה או קו-למטה, הקטנה צריכה לנוע בדיוק 16.5vh מנקודת האמצע.
    const maxOffset = windowHeight * 0.165; 

    // ככל שגוללים למטה (Progress עולה ממינוס לפלוס), הקטנה גולשת איתנו למטה
    const sideMove = progress * maxOffset;

    // החלת התנועה בזמן אמת
    this.mainImageTransform = `translateY(0px)`;
    this.sideImageTransform = `translateY(${sideMove}px)`;
  }
}