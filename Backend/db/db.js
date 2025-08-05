import mongoose from "mongoose";


export const dbconnect = async() =>{
           try {
            await mongoose.connect(process.env.URI).then(()=>{
                console.log(`connected to database`);
                
            })

           } catch (error) {
            console.log(error,`unable to connect to database`);
            
           }
}