
// import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

// import { CommonModule } from '@angular/common';

// import { FormsModule } from '@angular/forms';

// import { RouterModule } from '@angular/router';



// import { ProductService } from '../../../Services/product-service';

// import { CategoryService } from '../../../Services/category-service';



// @Component({

//   selector: 'app-product-management',

//   standalone: true,

//   imports: [CommonModule, FormsModule, RouterModule],

//   templateUrl: './product-management.html',

//   styleUrls: ['./product-management.scss']

// })

// export class ProductManagementComponent implements OnInit {

//   private productService = inject(ProductService);

//   private categoryService = inject(CategoryService);

//   private cdr = inject(ChangeDetectorRef);



//   products: any[] = [];    

//   categories: any[] = [];

//   displayDialog: boolean = false;

//   isEditMode: boolean = false;

//   uploading: boolean = false;

 

//   Math = Math;

//   totalCount: number = 0;

//   pageSize: number = 12;  

//   currentPage: number = 0;

 

//   toastMessage: string | null = null;



//   productForm: any = {

//     productsId: 0, categoryId: null, productsName: '', productsDescreption: '',

//     price: null, imgUrl: '', imgUrl2: '', color: '', material: '', quantity: 0, isActive: true

//   };



//   ngOnInit() {

//     this.currentPage = 0;

//     this.loadProducts();

//     this.loadCategories();

//   }



//   showSuccessToast(message: string) {

//     this.toastMessage = message;

//     setTimeout(() => this.toastMessage = null, 3000);

//   }



//   getImageUrl(imgPath: string, productName: string = ''): string {

//     // 1. הטיפול בשורש הבעיה של ה-Gift Cards!

//     // ה-DB שומר קבצים בשם "dummy_", אבל הם לא קיימים פיזית בתיקייה.

//     // לכן, אם המוצר הוא גיפט קארד או מכיל dummy, נציג את תמונת הגיפט קארד הראשית!

//     if ((imgPath && imgPath.includes('dummy_')) || (productName && productName.toLowerCase().includes('gift card'))) {

//         return '/images/GIFT-CARD.png';

//     }



//     // 2. תמונת ברירת מחדל אם אין שום נתיב

//     if (!imgPath || imgPath.trim() === '') {

//         return '/images/no-image.png';

//     }

   

//     const cleanPath = imgPath.replace(/\\/g, '/');



//     // 3. אם הכתובת כבר מוחלטת

//     if (cleanPath.startsWith('/')) {

//         return cleanPath;

//     }



//     // 4. תיקון נתיבים של קבצים שיושבים פיזית באנגולר

//     if (cleanPath.startsWith('images/') || cleanPath.startsWith('assets/')) {

//         return '/' + cleanPath;

//     }



//     // 5. תמונות של תכשיטים רגילים שמושכים משרת ה-C#

//     const apiBaseUrl = 'https://localhost:44360/';

//     if (cleanPath.startsWith('products/')) {

//       return `${apiBaseUrl}${cleanPath}`;

//     } else {

//       return `${apiBaseUrl}products/${cleanPath}`;

//     }

//   }

//   loadProducts() {

//     const filters = { skip: this.pageSize, position: this.currentPage + 1 };

   

//     this.productService.getProducts(filters).subscribe({

//       next: (res: any) => {

//         this.products = res.items || [];

//         this.totalCount = res.totalCount || this.products.length;

//         this.cdr.detectChanges();

//       },

//       error: (err) => console.error('❌ שגיאה בשליפת מוצרים:', err)

//     });

//   }



//   nextPage() {

//     if ((this.currentPage + 1) * this.pageSize < this.totalCount) {

//       this.currentPage++;

//       this.loadProducts();

//     }

//   }



//   prevPage() {

//     if (this.currentPage > 0) {

//       this.currentPage--;

//       this.loadProducts();

//     }

//   }



//   goToFirst() { this.currentPage = 0; this.loadProducts(); }

//   goToLast() { this.currentPage = Math.floor((this.totalCount - 1) / this.pageSize); this.loadProducts(); }

//   get totalPages() { return Math.ceil(this.totalCount / this.pageSize) || 1; }



//   loadCategories() {

//     this.categoryService.getCategories().subscribe(res => this.categories = res);

//   }



//   onFileUpload(event: any, imageIndex: number) {

//     const file = event.target.files[0];

//     if (!file) return;

//     this.uploading = true;

//     this.productService.uploadImage(file).subscribe({

//       next: (res: any) => {

//         if (imageIndex === 1) this.productForm.imgUrl = res.imageUrl;

//         else this.productForm.imgUrl2 = res.imageUrl;

//         this.uploading = false;

//         this.showSuccessToast('התמונה הועלתה בהצלחה');

//       },

//       error: () => { this.uploading = false; alert('העלאת תמונה נכשלה'); }

//     });

//   }



//   openAdd() {

//     this.isEditMode = false;

//     this.resetForm();

//     this.displayDialog = true;

//   }

 

//   openEdit(product: any) {

//     this.isEditMode = true;

   

//     this.productForm = {

//       productsId: product.productsId || product.productId || product.id,

//       categoryId: product.categoryId,

//       productsName: product.productsName,

//       price: product.price,

//       imgUrl: product.imgUrl || '',

//       imgUrl2: product.imgUrl2 || '',

//       color: product.color || '',

//       material: product.material || '',

//       productsDescreption: product.productsDescreption || '',

//       quantity: product.quantity || 0,

//       isActive: product.isActive !== false

//     };

   

//     this.displayDialog = true;

//   }



//   saveProduct() {

//     if (this.productForm.isActive && this.productForm.quantity <= 0) {

//       alert('לא ניתן להפוך מוצר לפעיל אם המלאי שלו הוא 0. אנא עדכני כמות במלאי.');

//       return;

//     }



//     if (!this.productForm.productsName || !this.productForm.price || !this.productForm.categoryId) {

//       alert('נא למלא את כל שדות החובה (*)');

//       return;

//     }



//     const payload = { ...this.productForm };

//     const productId = payload.productsId;



//     delete payload.category;

//     delete payload.ordersItems;



//     const action = this.isEditMode ?

//       this.productService.updateProduct(productId, payload) :

//       this.productService.addProduct(payload);

     

//     action.subscribe({

//       next: () => {

//         this.showSuccessToast(`המוצר נשמר בהצלחה!`);

//         this.closeDialog();

//         this.loadProducts();

//       },

//       error: (err) => {

//         console.error('שגיאת שרת בשמירה:', err);

//         alert('שגיאה בשמירת המוצר! ייתכן ששם המוצר כבר קיים במערכת.');

//       }

//     });

//   }



//   deleteProduct(product: any) {

//     if (confirm('האם את בטוחה שברצונך להפוך מוצר זה ללא פעיל?\n(הוא יוסתר מהחנות אך יישמר במערכת)')) {

//       const id = product.productsId || product.productId || product.id;

//       const payload: any = { ...product, isActive: false };

     

//       delete payload.category;

//       delete payload.ordersItems;



//       this.productService.updateProduct(id, payload).subscribe({

//           next: () => {

//               this.showSuccessToast('המוצר הועבר לסטטוס "לא פעיל" בהצלחה');

//               this.loadProducts();

//           },

//           error: (err) => {

//               console.error('שגיאה בשינוי סטטוס:', err);

//               alert('אירעה שגיאה מול השרת בשינוי הסטטוס.');

//           }

//       });

//     }

//   }



//   closeDialog() { this.displayDialog = false; }

 

//   resetForm() {

//     this.productForm = {

//       productsId: 0, categoryId: null, productsName: '', price: null,

//       quantity: 0, isActive: true, imgUrl: '', imgUrl2: '', color: '', material: ''

//     };

//   }

// }


import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../Services/product-service';
import { CategoryService } from '../../../Services/category-service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.scss']
})
export class ProductManagementComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  categories: any[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  uploading: boolean = false;

  Math = Math;
  totalCount: number = 0;
  pageSize: number = 12;
  currentPage: number = 0;
  toastMessage: string | null = null;

  productForm: any = {
    productsId: 0, categoryId: null, productsName: '', productsDescreption: '',
    price: null, imgUrl: '', imgUrl2: '', color: '', material: '', quantity: 0, isActive: true
  };

  ngOnInit() {
    this.currentPage = 0;
    this.loadProducts();
    this.loadCategories();
  }

  showSuccessToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = null, 3000);
  }

  getImageUrl(imgPath: string, productName: string = ''): string {
    // 1. הטיפול בשורש הבעיה של ה-Gift Cards!
    // ה-DB שומר קבצים בשם "dummy_", אבל הם לא קיימים פיזית בתיקייה.
    // לכן, אם המוצר הוא גיפט קארד או מכיל dummy, נציג את תמונת הגיפט קארד הראשית!
    if ((imgPath && imgPath.includes('dummy_')) || (productName && productName.toLowerCase().includes('gift card'))) {
        return '/images/GIFT-CARD.png';
    }

    // 2. תמונת ברירת מחדל אם אין שום נתיב
    if (!imgPath || imgPath.trim() === '') {
        return '/images/no-image.png';
    }

    const cleanPath = imgPath.replace(/\\/g, '/');

    // 3. אם הכתובת כבר מוחלטת
    if (cleanPath.startsWith('/')) {
        return cleanPath;
    }

    // 4. תיקון נתיבים של קבצים שיושבים פיזית באנגולר
    if (cleanPath.startsWith('images/') || cleanPath.startsWith('assets/')) {
        return '/' + cleanPath;
    }

    // 5. תמונות של תכשיטים רגילים שמושכים משרת ה-C#
    const apiBaseUrl = 'https://localhost:44360/';
    if (cleanPath.startsWith('products/')) {
      return `${apiBaseUrl}${cleanPath}`;
    } else {
      return `${apiBaseUrl}products/${cleanPath}`;
    }
  }

  loadProducts() {
    const filters = { skip: this.pageSize, position: this.currentPage + 1 };
    this.productService.getProducts(filters).subscribe({
      next: (res: any) => {
        this.products = res.items || [];
        this.totalCount = res.totalCount || this.products.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ שגיאה בשליפת מוצרים:', err)
    });
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.totalCount) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  goToFirst() { this.currentPage = 0; this.loadProducts(); }
  goToLast() { this.currentPage = Math.floor((this.totalCount - 1) / this.pageSize); this.loadProducts(); }
  get totalPages() { return Math.ceil(this.totalCount / this.pageSize) || 1; }

  loadCategories() {
    this.categoryService.getCategories().subscribe(res => this.categories = res);
  }

  onFileUpload(event: any, imageIndex: number) {
    const file = event.target.files[0];
    if (!file) return;
    this.uploading = true;
    this.productService.uploadImage(file).subscribe({
      next: (res: any) => {
        if (imageIndex === 1) this.productForm.imgUrl = res.imageUrl;
        else this.productForm.imgUrl2 = res.imageUrl;
        this.uploading = false;
        this.showSuccessToast('התמונה הועלתה בהצלחה');
      },
      error: () => { this.uploading = false; alert('העלאת תמונה נכשלה'); }
    });
  }

  openAdd() {
    this.isEditMode = false;
    this.resetForm();
    this.displayDialog = true;
  }

  openEdit(product: any) {
    this.isEditMode = true;
    this.productForm = {
      productsId: product.productsId || product.productId || product.id,
      categoryId: product.categoryId,
      productsName: product.productsName,
      price: product.price,
      imgUrl: product.imgUrl || '',
      imgUrl2: product.imgUrl2 || '',
      color: product.color || '',
      material: product.material || '',
      productsDescreption: product.productsDescreption || '',
      quantity: product.quantity || 0,
      isActive: product.isActive !== false
    };
    this.displayDialog = true;
  }

  saveProduct() {
    if (this.productForm.isActive && this.productForm.quantity <= 0) {
      alert('לא ניתן להפוך מוצר לפעיל אם המלאי שלו הוא 0. אנא עדכני כמות במלאי.');
      return;
    }
    if (!this.productForm.productsName || !this.productForm.price || !this.productForm.categoryId) {
      alert('נא למלא את כל שדות החובה (*)');
      return;
    }
    const payload = { ...this.productForm };
    const productId = payload.productsId;
    delete payload.category;
    delete payload.ordersItems;

    const action = this.isEditMode ?
      this.productService.updateProduct(productId, payload) :
      this.productService.addProduct(payload);

    action.subscribe({
      next: () => {
        this.showSuccessToast(`המוצר נשמר בהצלחה!`);
        this.closeDialog();
        this.loadProducts();
      },
      error: (err) => {
        console.error('שגיאת שרת בשמירה:', err);
        alert('שגיאה בשמירת המוצר! ייתכן ששם המוצר כבר קיים במערכת.');
      }
    });
  }

  deleteProduct(product: any) {
    if (confirm('האם את בטוחה שברצונך להפוך מוצר זה ללא פעיל?\n(הוא יוסתר מהחנות אך יישמר במערכת)')) {
      const id = product.productsId || product.productId || product.id;
      const payload: any = { ...product, isActive: false };
      delete payload.category;
      delete payload.ordersItems;

      this.productService.updateProduct(id, payload).subscribe({
          next: () => {
              this.showSuccessToast('המוצר הועבר לסטטוס "לא פעיל" בהצלחה');
              this.loadProducts();
          },
          error: (err) => {
              console.error('שגיאה בשינוי סטטוס:', err);
              alert('אירעה שגיאה מול השרת בשינוי הסטטוס.');
          }
      });
    }
  }

  closeDialog() { this.displayDialog = false; }

  resetForm() {
    this.productForm = {
      productsId: 0, categoryId: null, productsName: '', price: null,
      quantity: 0, isActive: true, imgUrl: '', imgUrl2: '', color: '', material: ''
    };
  }
}
