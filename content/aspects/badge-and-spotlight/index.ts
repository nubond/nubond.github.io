import { AppRoot } from 'nubond';
import { Badge } from './badge';
import { Spotlight } from './spotlight';

// aspects appear only in markup: passing them to a decorator imports and registers them
@AppRoot(Badge, Spotlight)
export class App {
    public unread = 2;
}
