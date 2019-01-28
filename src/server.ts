import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import IndexRoutes from './routes/indexRoutes';
import moongose from 'mongoose';
import compression from 'compression';
import cors from 'cors';

import PostsRoutes  from './routes/postsRoutes';
import UserRoutes from './routes/userRoutes';

class Server{
    public app: express.Application;
    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }
    
    config(){
        const MONGO_URI = 'mongodb://localhost/restapit';
        moongose.set('useFindAndModify', true);
        moongose.connect(MONGO_URI || process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
            .then(db => console.log('DB is connect'));
        // Settings
        this.app.set('port', process.env.PORT || 3000);
        // Middelwares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes(){
        this.app.use(IndexRoutes);
        this.app.use('/api/posts', PostsRoutes);
        this.app.use('/api/users', UserRoutes);
    }

    start (){
        this.app.listen(this.app.get('port'), () => {
        console.log('Server on Port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();