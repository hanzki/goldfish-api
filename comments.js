'use strict';
const dynamodb = require('./dynamodb');

module.exports.hello = async (event) => {

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };

};

module.exports.listComments = async (event) => {

  const postId = Number(event.pathParameters.postId);
  const comments = await dynamodb.listComments(postId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Here are your comments',
      comments: comments,
    }, null, 2),
  };

};

module.exports.createComment = async (event) => {

  const postId = Number(event.pathParameters.postId);
  const input = JSON.parse(event.body);
  const comment = {
    author: input.author || "Anonymous",
    content: input.comment
  };

  const newComment = await dynamodb.createComment(postId, comment);

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Created a new comment',
      comment: newComment,
    }, null, 2),
  };

};