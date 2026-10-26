import { AppRoot } from 'nubond';
import { ProductList } from './product-list';
import { CartBadge } from './cart-badge';

@AppRoot(ProductList, CartBadge)
export class App { }
