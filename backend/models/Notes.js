import dynamoose from "dynamoose";

const noteSchema = new dynamoose.Schema(
  {
    noteId: {
      type: String,
      hashKey: true,
    },
    userId: {
      type: String,
      index: {
        name: "userId-index",
        global: true,
      },
    },
    title: String,
    content: String,
    summery: String,
    tags: {
      type: Array,
      schema: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Note = dynamoose.model("Notes", noteSchema);

export default Note;
