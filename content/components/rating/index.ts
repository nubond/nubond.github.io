import { AppRoot } from 'nubond';
import { StarRating } from './star-rating';

@AppRoot(StarRating)
export class App {
    public rating = 3;
}
