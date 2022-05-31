const { v4: uuidv4 } = require("uuid");

const DUMMY_COMMENTS = [
  {
    id: "c1",
    user: "u1",
    commentText: "t1",
    time: "10:52",
  },
  {
    id: "c2",
    user: "u2",
    commentText: "t2",
    time: "11:30",
  },
];

const createComment = (req, res, next) => {
  const { id, user, commentText, time } = req.body;
  const createdComment = {
    id: uuidv4(),
    user: user,
    commentText: commentText,
    time: time,
  };
  DUMMY_COMMENTS.push(createdComment);

  res.status(201).json({ comment: createdComment });
};

exports.createComment = createComment;