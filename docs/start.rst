Generating this project with AWS tools
======================================

This project did began as a Couchbase/ExpressJS/Apollo/React application
stack.  However setting up Couchbase on AWS requires a costly EC2 instance. So
I moved to using DynamoDB_, then I swapped out Apollo in favour of Amplify_
which gives me a set of tools to update the schema automatically.

Node
====

Install and run::

   npm install
   npm start

Codegen
=======

Tools are also provided to generate project code for the client application.
The simple steps to get started were::

   npm install -g @aws-amplify/cli
   amplify init
   amplify add codegen --apiId 4mzaxzujzje6bmfzc4e7nfiwtm
   amplify codegen

The files `src/aws-exports.js` and `src/graphql/*.js` have been created.

Updating the schema
-------------------

From the `AppSync Console`_ the schema can be updated which will also then
generate the DynamoDB_ tables necessary to store the data.


After any updates to the API's schema then the client code can be regenerated
with that final command::

   amplify codegen

Struggling Here
---------------

Finding myself deleting everything on aws in order to update dynamodb. So I delete everything on aws service, the app, dynamodb, bucket, auth, ...

And then start again with::

   amplify init

.. _`AppSync Console`: http://console.amazon.com/appsync
.. _DynamoDB: http://aws.amazon.com/dynamodb
.. _Amplify: https://aws-amplify.github.io
