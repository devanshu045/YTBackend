import dotenv from 'dotenv'
import ConnectDb from './Db/Connectdb.js'
import {app} from './app.js'
dotenv.config({
    path:'./.env'
});


ConnectDb().then(()=>{
  app.listen(process.env.PORT||8080,()=>{
        console.log(`App Listening on port ${process.env.PORT}`);
  })
})
.catch(err =>
{
     console.log("MONGO db connection failed !!! ", err);
}
)





