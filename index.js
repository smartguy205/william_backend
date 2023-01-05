import express from 'express';
import cors from 'cors';
import userRouter from './routes/user/userRoutes.js';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import fileupload from 'express-fileupload'
import adminRouter from './routes/admin/adminRoutes.js';
import Sentry from "@sentry/node";
import Tracing from "@sentry/tracing";

const app = express();

Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN_KEY,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({
            // to trace all requests to the default router
            app,
            // alternatively, you can specify the routes you want to trace:
            // router: someRouter,
        }),
    ],
    tracesSampleRate: 1.0,
});


dotenv.config();
app.use(
    Sentry.Handlers.errorHandler({
        shouldHandleError(error) {
            if (error.status >= 400 || error.status === 500) {
                return true;
            }
            return false;
        },
    })
);


app.use(cors());
app.use(fileupload());
app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.set('trust proxy', 'loopback')
app.use(Sentry.Handlers.errorHandler());

const uri = process.env.MONGODB_CONNECTION_URL;
const PORT = process.env.PORT || 5000;


// routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);


app.get("/", function (req, res) {
    // main()
    console.log(req.ip)
    return res.status(200).send("<h1>Hello World new</h1>")
})


// Setup your mongodb connection here
try {
    mongoose.connect(`${uri}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.connection.on('open', async () => {
        try {
            app.listen({ port: PORT, host: '0.0.0.0' }, () => {
                console.log('Server started and database connected')
            })
        } catch (err) { console.log(err) }
    })
}
catch (error) {
    console.log(error)
    process.exit(0);
}
