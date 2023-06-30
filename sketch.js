// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/bmvOjW7n6/';

// Video
let video;
let flippedVideo;

let constraints;

// To store the classification
let label = '';

// To store the sound
const audio = document.getElementById('myAudio');

let counter = 0;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  // Adjust canvas size based on container width
  const containerWidth = select('.container').width;
  const canvasSize = containerWidth * 0.8; // You can adjust the percentage as needed

  createCanvas(canvasSize, canvasSize * (3 / 4)); // Adjust the aspect ratio as needed
  constraints = {
    video: { facingMode: 'environment' }, // "environment" for rear camera, "user" for front camera
  };
  // Create the video
  video = createCapture(constraints, function (stream) {
    // Stream loaded callback
    video.play();
  });

  video.size(canvasSize, canvasSize * (3 / 4));
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;

  // play sound
  if (label == 'helmet') {
    counter++;
    // Play sound if "helmet" is continuously predicted for 5 times
    if (counter >= 25) {
      audio.play();
      counter = 0; // Reset the counter
    }
  } else {
    counter = 0; // Reset the counter if prediction is not "helmet"
  }

  // Classifiy again!
  classifyVideo();
}

// Function to switch the camera
function switchCamera() {
  // Stop the current video stream
  video.stop();

  // Toggle the camera facing mode
  if (constraints.video.facingMode === 'environment') {
    constraints.video.facingMode = 'user';
  } else {
    constraints.video.facingMode = 'environment';
  }

  // Create a new video element with the updated constraints
  video = createCapture(constraints, function (stream) {
    // Stream loaded callback
    video.play();
  });
}
