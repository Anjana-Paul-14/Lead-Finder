// import mongoose from "mongoose"

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// })

// export default mongoose.models.User || mongoose.model("User", UserSchema)


import mongoose from "mongoose"

const UserSchema = new mongoose.Schema ({
  name: { type: String, required: true },
 email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedPlaces: [
    {
      name: String,
      vicinity: String,
      rating: mongoose.Schema.Types.Mixed,
      website: String,
      place_id: String,
    },
  ],
})


const User = mongoose.models.User || mongoose.model("User", UserSchema)
export default User;