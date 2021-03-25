const express = require("express");

const Question = require("../models/question");
const authenticate = require("../services/authentication")
const router = express.Router();

router.post("/createquestion",authenticate, async (req, res) => {
 try {
  const newQuestion = new Question({
   email: req.body.email,
   content: req.body.content,
   username: req.body.username,
   title: req.body.title,
   createdAt: new Date().toISOString(),
   tags: [
    {
     tag: req.body.tag1,
     username: req.body.username,
    },
    {
     tag: req.body.tag2,
     username: req.body.username,
    },
    
   ],
  });
  const question = await newQuestion.save();
  res.status(200).json({
   message: "question created successfully",
  });
 } catch (error) {
  console.log(error);
  res.status(400).json({
   message: "Error occured",
  });
 }
});

router.post("/createanswer",authenticate, async (req, res) => {
 try {
  const question = await Question.findOne({ _id: req.body.id })
  if (question) {
   question.answers.unshift({
    content: req.body.content,
    username: req.body.username,
    createdAt: new Date().toISOString(),
   });
   await question.save();
   res.status(200).json({
    message: "answer created"
   })
  } else {
   res.status(400).json({
    message: "question not found"
   })
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message: "Error occured"
  })
 }
})

router.put("/createcomment", authenticate, async (req, res) => {
 try {
  const question = await Question.findOne({ _id: req.body.id })
  if (question) {
   console.log(question.username)
   const answerIndex = question.answers.findIndex((c) => c.id === req.body.answerid);
   question.answers[answerIndex].comments.unshift({
    username: req.body.username,
    content: req.body.content,
    createdAt: new Date().toISOString(),
   })
   await question.save();
   res.status(200).json({
    message: "comment created"
   })
  } else {
   res.status(400).json({
    message: "question not found"
   })
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message: "Error occured"
  })
 }
})

router.post("/vote",authenticate, async (req, res) => {
 try {
  const question = await Question.findOne({ _id: req.body.id })
  if (question) {
   const answerIndex = question.answers.findIndex((c) => c.id === req.body.answerid);
   let myvote = question.answers[answerIndex]
   console.log(myvote.votes[0])
   console.log(myvote.votes.find((vote) => vote.username === req.body.username))
   if (question.answers[answerIndex].votes.find((vote) => vote.username === req.body.username)) {
    question.answers[answerIndex].votes = question.answers[answerIndex].votes.filter((vote) => vote.username !== req.body.username)
    await question.save();


    res.status(200).json({
     message: "vote deleted"
    })
   } else {
    question.answers[answerIndex].votes.push({
     username: req.body.username,
     createdAt: new Date().toISOString()
    })
    await question.save();
    res.status(200).json({
     message: "vote created"
    })

   }
  } else {
   res.status(400).json({
    message: "question not found"
   })
   await question.save();
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message: "Error occured"
  })
 }
})

router.post("/unvote",authenticate, async (req, res) => {
 try {
  const question = await Question.findOne({ _id: req.body.id })
  if (question) {
   const answerIndex = question.answers.findIndex((c) => c.id === req.body.answerid);

   if (question.answers[answerIndex].unvotes.find((vote) => vote.username === req.body.username)) {
    question.answers[answerIndex].unvotes = question.answers[answerIndex].unvotes.filter((vote) => vote.username !== req.body.username)
    await question.save();


    res.status(200).json({
     message: "unvote deleted"
    })
   } else {
    question.answers[answerIndex].unvotes.push({
     username: req.body.username,
     createdAt: new Date().toISOString()
    })
    await question.save();
    res.status(200).json({
     message: "unvote created"
    })

   }
  } else {
   res.status(400).json({
    message: "question not found"
   })
   await question.save();
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message: "Error occured"
  })
 }
})

router.get("/getquestions",authenticate, async (req, res) => {
 try {
  const questions = await Question.find().sort({ createdAt: -1 })
  if (questions) {
   res.status(200).json({
    questions
   })
  }
  else {
   res.status(400).json({
    message: "there are no questions"
   })
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message: "Error occured"
  })
 }
})

router.post("/getquestion", authenticate, async (req, res) => {
 try {
  const question = await Question.findOne({ _id: req.body.id })
  if (question) {
   res.status(200).json({
    question
   })
  }
  else {
   res.status(400).json({
    message: "there are no questions"
   })
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message: "Error occured"
  })
 }
})


module.exports = router
