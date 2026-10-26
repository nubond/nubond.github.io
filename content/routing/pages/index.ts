import { AppRoot, Router } from 'nubond';
import { Home } from './home';
import { Profile } from './profile';

// [page=home]: a container slot with a default; {user}: a variable slot
@AppRoot('/#[page=home]/{user}', Home, Profile)
export class App {
    constructor(public router: Router) { }
}
