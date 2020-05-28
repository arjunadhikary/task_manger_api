const mongoose = require('mongoose');
mongoose.connect(process.env.START_SERVER,{
    useFindAndModify:false,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useNewUrlParser:true
    
    
});
 