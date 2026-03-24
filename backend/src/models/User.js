import mongoose from 'mongoose';
import bycrpyt from 'bcryptjs'; // Import bcryptjs for password hashing

const userSchema = new mongoose.Schema({
    fullName:{
        required: true,
        type: String,
    },
    email:{
        required: true,
        type: String,
        unique: true, // Ensure email is unique
    },
    password:{
        required: true,
        type: String,
    },
    profilePic:{
        type: String,
        default:""
    },
    NativeLanguage:{
        
        type: String,
        default:""
    },
    LearningLanguage:{
        
        type: String,
        default:""
    },
    location:{
        
        type: String,
        default:""
    },
    Bio:{
        
        type: String,
        default:""
    },
    isOnboarded:{
        type: Boolean,
        default: false, // Default value for isOnboarded
    },
    friends:[
        {
        type:mongoose.Schema.Types.ObjectId, // Array of ObjectIds referencing User model
        ref: 'User' // Reference to User model
        }
    ]

},{
    timestamps: true, // Automatically manage createdAt and updatedAt fields
})

// this is called a pre-save hook, it runs before the document is saved to the database
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next(); // If password is not modified, skip hashing
    try{
        const salt = await bycrpyt.genSalt(10); // Generate a salt with 10 rounds
        this.password = await bycrpyt.hash(this.password,salt); // Hash the password with the generated salt
        next();
    }
    catch(err){
        next(err);
    }
})

//this is created very later when login work was done
userSchema.methods.matchPassword = async function(enteredPassword){
    // we will use bcryptjs to compare the entered password with the hashed password
    const isCorrect =await bycrpyt.compare(enteredPassword, this.password);
    return isCorrect;
}
// the fayda for making this as method is we need not to import function for compare passwords just want the user and can directly use it

const User = mongoose.model('User', userSchema);

export default User;