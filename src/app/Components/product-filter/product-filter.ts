import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.scss'
})
export class ProductFilter {
  @Output() applyFilters = new EventEmitter<any>();
  @Output() closeSidebar = new EventEmitter<void>();

  // מערכים לשמירת הבחירות המרובות
  selectedMaterials: string[] = [];
  selectedColors: string[] = [];
  
  // טווח מחירים
  minPrice: number = 0;
  maxPrice: number = 1700;
  maxLimit: number = 1700;

  // הרשימות שלך - שימי לב שכתבתי בעברית מדויקת תחת value!
 materials = [
    { name: 'כסף בציפוי זהב 18K', value: 'כסף בציפוי זהב 18K', cssClass: 'mat-silver-gold-18k' },
    { name: 'כסף סטרלינג', value: 'כסף סטרלינג', cssClass: 'mat-silver' },
    // { name: 'מתכת בשילוב כסף וציפוי זהב 14k', value: 'מתכת בשילוב כסף וציפוי זהב 14k', cssClass: 'mat-silver-gold' },
    {name:'אבן פנדורה בשילוב זהב 14K',value:'אבן פנדורה בשילוב זהב 14K',cssClass:'mat-silver-gold'},
    { name: 'כסף בשילוב רוז גולד 14K', value: 'כסף בשילוב רוז גולד 14K', cssClass: 'mat-silver-rose' },
    { name: 'ציפוי זהב 14k', value: 'ציפוי זהב 14k', cssClass: 'mat-gold' },
    { name: 'ציפוי רוז גולד 14K', value: 'ציפוי רוז גולד 14K', cssClass: 'mat-rose' },
    { name: 'ציפוי רותניום', value: 'ציפוי רותניום', cssClass: 'mat-ruthenium' }
  ];

  colors = [
    { name: 'אדום', value: 'אדום', cssClass: 'color-red' },
    { name: 'ורוד', value: 'ורוד', cssClass: 'color-pink' },
    { name: 'טורקיז', value: 'טורקיז', cssClass: 'color-turquoise' },
    { name: 'כחול', value: 'כחול', cssClass: 'color-blue' },
    { name: 'סגול', value: 'סגול', cssClass: 'color-purple' },
    { name: 'שחור', value: 'שחור', cssClass: 'color-black' },
    { name: 'לבן', value: 'לבן', cssClass: 'color-white' },
    { name: 'כסף', value: 'כסף', cssClass: 'silver' },
    { name: 'זהב', value: 'זהב', cssClass: 'gold' },
    { name: 'רוז', value: 'רוז', cssClass: 'rose-gold' }
  ];

  // פונקציה לבחירה וביטול בחירה של מתכת
  toggleMaterial(value: string) {
    const index = this.selectedMaterials.indexOf(value);
    if (index > -1) {
      this.selectedMaterials.splice(index, 1); // ביטול בחירה אם כבר קיים
    } else {
      this.selectedMaterials.push(value); // הוספה לבחירה
    }
    this.emitCurrentFilters();
  }

  // פונקציה לבחירה וביטול בחירה של צבע
  toggleColor(value: string) {
    const index = this.selectedColors.indexOf(value);
    if (index > -1) {
      this.selectedColors.splice(index, 1); // ביטול בחירה
    } else {
      this.selectedColors.push(value); // הוספה לבחירה
    }
    this.emitCurrentFilters();
  }

  onMinInput() { if (this.minPrice > this.maxPrice) this.minPrice = this.maxPrice; }
  onMaxInput() { if (this.maxPrice < this.minPrice) this.maxPrice = this.minPrice; }

  onPriceDragEnd() {
    this.emitCurrentFilters();
  }
  onMinChange() { if (this.minPrice > this.maxPrice) this.minPrice = this.maxPrice; }
  onMaxChange() { if (this.maxPrice < this.minPrice) this.maxPrice = this.minPrice; }

  private emitCurrentFilters() {
    const filters = {
      material: this.selectedMaterials.length > 0 ? this.selectedMaterials.join(',') : null,
      color: this.selectedColors.length > 0 ? this.selectedColors.join(',') : null,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    };
    this.applyFilters.emit(filters);
  }
  // לחיצה על הכפתור השחור "החל סינון"
  onApply() {
    const filters = {
      material: this.selectedMaterials.length ? this.selectedMaterials.join(',') : null,
      color: this.selectedColors.length ? this.selectedColors.join(',') : null,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    };
    
    this.applyFilters.emit(filters); // שולח את הנתונים לאבא
    this.closeSidebar.emit(); // אומר לאבא לסגור את התפריט
  }

  // לחיצה על "נקה הכל"
  onReset() {
    this.selectedMaterials = [];
    this.selectedColors = [];
    this.minPrice = 0;
    this.maxPrice = this.maxLimit;
    
    this.applyFilters.emit({ material: null, color: null, minPrice: 0, maxPrice: 1700 });
    this.closeSidebar.emit();
  }
}