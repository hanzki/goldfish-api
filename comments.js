'use strict';
const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');

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

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: 'post_id = :pid',
    ExpressionAttributeValues: {
      ':pid': postId
    },
    ProjectionExpression: 'post_id, comment_timestamp, comment_author, comment_content'
  };

  const comments = await client.query(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Here are your comments',
      comments: comments.Items,
    }, null, 2),
  };

};

module.exports.createComment = async (event) => {

  const postId = Number(event.pathParameters.postId);
  const input = JSON.parse(event.body);
  const commentContent = input.comment;
  const commentAuthor = input.author || "Anonymous";

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      post_id: postId,
      comment_timestamp: moment().toISOString(),
      comment_author: commentAuthor,
      comment_content: commentContent
    }
  };

  await client.put(params).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Created a new comment',
      comment: params.Item,
    }, null, 2),
  };

};