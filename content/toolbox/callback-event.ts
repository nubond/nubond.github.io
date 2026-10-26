import { CallBackEvent } from 'nubond';

const onSaved = new CallBackEvent<(id: number) => void>();

const unsubscribe = onSaved.subscribe(id => console.log(`saved ${id}`));
onSaved.raise(42);   // every subscriber runs, even if one throws
unsubscribe();
