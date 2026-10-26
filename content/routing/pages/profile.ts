import { Container } from 'nubond';

@Container('<h3>Profile</h3><p>Hello, <b nb-value="this.user"></b>!</p>')
export class Profile {
    public user: string | undefined;   // nb-in:user from the parent

    constructor() { }
}
