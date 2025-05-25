import dynamoose from "dynamoose";

const noteSchema = new dynamoose.Schema({
  noteId: {
    type: String,
    hashKey: true,
  },
  userId: {
    type: String,
    index: {
      name: "userId-createdAt-index",
      global: true,
      rangeKey: "createdAt",
    },
  },
  title: String,
  content: String,
  summery: String,
  tags: {
    type: Array,
    schema: [String],
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
    required: true,
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString(),
    required: true,
  },
});

const Note = dynamoose.model("Notes", noteSchema);

export default Note;
