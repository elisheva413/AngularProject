// מודל עבור פריט בודד בתוך הזמנה
export interface OrderItem {
  orderItemId: number;
  productsId: number;
  orderId: number;
  quantity: number;
  productName: string;  
  productImage: string;  
  price: number;  
}

export interface Order {
  orderId: number;
  orderDate: string; 
  orderSum: number;
  userId: number;
  orderStatus: string; // הסטטוסים שלנו: 'Paid', 'Shipped', 'Delivered'
  ordersItems: OrderItem[]; 
}