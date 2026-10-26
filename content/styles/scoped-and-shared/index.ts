import { AppRoot, $AdoptedStyle } from 'nubond';
import { InfoBox } from './info-box';
import shared from './shared.css';

// registered once, adopted by any component that names it
@AppRoot([$AdoptedStyle('shared', shared)], InfoBox)
export class App { }
