'use strict';
const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');

module.exports.listComments = async (postId) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: 'post_id = :pid',
    ExpressionAttributeValues: {
      ':pid': postId
    },
    ProjectionExpression: 'post_id, comment_timestamp, comment_author, comment_content'
  };

  const comments = await client.query(params).promise();

  return comments.Items;
};

module.exports.createComment = async (postId, comment) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      post_id: postId,
      comment_timestamp: moment().toISOString(),
      comment_author: comment.author,
      comment_content: comment.content
    }
  };

  await client.put(params).promise();

  return params.Item;
};