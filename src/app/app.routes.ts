import { Routes } from '@angular/router';
import { HomePage } from './Components/home-page/home-page';
import { ProductsList } from './Components/products-list/products-list';
import { SingleProduct } from './Components/single-product/single-product';
import { GiftCard } from './Components/gift-card/gift-card'; 
import { Cart } from './Components/cart/cart';
import { Login} from './Components/login/login'; 
import { Register } from './Components/register/register'; 
import { Checkout } from './Components/checkout/checkout';
import { ProfileComponent } from './Components/profile/profile';
import { AdminDashboardComponent } from './Components/admin/admin-dashboard/admin-dashboard';
import { StoreLocatorComponent } from './Components/store-locator/store-locator';
import { ProductManagementComponent } from './Components/admin/product-management/product-management';
import { OrdersHistoryComponent } from './Components/orders-history/orders-history'; 
import { EditInfoComponent } from './Components/edit-info/edit-info'; 
import { adminGuard } from './Guards/admin.guard';
import { NetfreeComponent } from './Components/netfree/netfree'; 

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'products', component: ProductsList },
    { path: 'products/:id', component: SingleProduct},
    { path: 'gift-card', component: GiftCard },
    { path: 'cart', component: Cart },
    { path: 'login', component: Login },      
    { path: 'register', component: Register },
    { path: 'checkout', component: Checkout },
    { path: 'netfree', component: NetfreeComponent },
    
    {   
      path: 'profile', 
      component: ProfileComponent, 
      children: [
        { path: 'edit', component: EditInfoComponent }, 
        { path: 'orders', component: OrdersHistoryComponent }, 
        { path: '', redirectTo: 'edit', pathMatch: 'full' } 
      ]
    },
    { path: 'my-orders', component: OrdersHistoryComponent }, 
    { path: 'stores', component: StoreLocatorComponent },
    
    { 
      path: 'admin', 
      canActivate: [adminGuard],
      children: [
        { path: '', component: AdminDashboardComponent },
        { path: 'products', component: ProductManagementComponent },
        { path: 'orders', component: OrdersHistoryComponent } 
      ]
    },
    
    { path: '**', redirectTo: '' }
];