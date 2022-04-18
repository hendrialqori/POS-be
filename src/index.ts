import express, { Express } from 'express';
import {dbAuthenticate} from './Configs/Database';
import { config } from 'dotenv';
import morgan from 'morgan'
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors'
import { router } from './Routes/routes';
import { rateLimit } from 'express-rate-limit';

const app:Express = express();
const PORT:number | string = process.env.PORT || 8080 

function main(): void{


    config()

    // dbAuthenticate();
    app.use(express.json())
    app.use(express.static('template'))
    app.use(compression())
    app.use(helmet())
    app.use(morgan('dev'))

    const whitelist = ['http://localhost:3000', 'https://qorypos.netlify.app']
    app.use(cors({
        origin : whitelist[1],
        credentials : true
    }))
    
    app.use(router)


    app.use(rateLimit({
        windowMs : 10000,
        max      : 10,
        message   : 'Too many request, try again letter'
    }))

    app.get('/', (req, res) => {
        res.render('index.html')
    })

    app.listen(PORT, ()=> console.log(`Server is running on http://localhost:${PORT}`))
}

main();

