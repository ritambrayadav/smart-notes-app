import dynamoose from "dynamoose";

const userSchema = new dynamoose.Schema(
  {
    userId: { type: String, hashKey: true, required: true },
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      index: {
        global: true,
        name: "email-index",
      },
    },
    password: {
      type: String,
      required: true,
    },
    lastActiveSessionId: { type: String, required: false },
    hasSeenOnboarding: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = dynamoose.model("Users", userSchema);

export default User;
