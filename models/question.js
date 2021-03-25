const { model, Schema } = require("mongoose");

const questionSchema = new Schema({
  title: String,
  username: String,
  email: String,
  content: String,
  createdAt: String,
  tags: [
    {
      tag: String,
      username: String,
    },
  ],
  answers: [
    {
      content: String,
      createdAt: String,
      username: String,
      comments: [
        {
          username: String,
          content: String,
          createdAt: String,
        },
      ],
      votes: [
        {
          username: String,
          createdAt: String,
        },
      ],
      unvotes: [
        {
          username: String,
          createdAt: String,
        }
      ]
    },
  ],
});

module.exports = model('Question', questionSchema)
