@Injectable()          // transient: a new instance for every constructor that asks
export class IdGenerator { }

@Injectable(true)      // singleton: one shared instance
export class Settings {
    constructor(private _ids: IdGenerator) { }   // services can inject services
}

$Injectable(Settings, true);                     // the same, without a decorator
$Injectable(Settings, true, IdGenerator);        // with explicit dependencies (no metadata needed)
$Injectable(new ApiClient({ baseUrl: '/api' })); // an existing instance (a singleton)
