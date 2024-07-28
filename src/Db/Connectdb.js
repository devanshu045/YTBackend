import mongoose from 'mongoose';


const ConnectDb = async() => {
    console.log(`${process.env.Db_Url}/${process.env.DBName}`)

   try{ await mongoose.connect(`${process.env.Db_Url}/${process.env.DBName}`);
    // console.log(connectDB)
    console.log(`DataBase Connected`);
    }
    catch{
        console.log("DataBase Connection Failed");
        process.exit(1); // this is nodejs fucntion it return 1 and 0 if any err then 1 other 0 and in err it ends the program
    }

}
export default ConnectDb;

