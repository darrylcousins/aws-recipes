Node
====

Install and run::

   npm install
   npm start

Amplify
=======

Build::

   amplify publish

At this point Cloudfront hosting is failing so I'm manually uploading to an S3 bucket::

   cd build/
   aws s3 cp . s3://recipe-bucket/ --recursive

Need to work out how to set up bucket for `photos`.

It all has become a bit confusing with `aws` but hopefully I'll get it worked out.
