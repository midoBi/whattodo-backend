import * as express from 'express';
import * as bodyParser from 'body-parser';
import {Routes} from './routes/crmRoutes';
import * as mongosse from 'mongoose';


class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = 'mongodb://localhost/CRMdb';
    
    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }

    private config(): void {
        // support application/json type post data 
        this.app.use(bodyParser.json());

        // support application/w-www-form-urlencooded post data 
        this.app.use(bodyParser.urlencoded({extended: false}))
    }

    private mongoSetup(): void {
        mongosse.Promise = global.Promise;
        mongosse.connect(this.mongoUrl);
    }
}

export default new App().app;