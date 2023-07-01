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
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/w9s2b6M3p/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = '';
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
  // Create the video
  video = createCapture(VIDEO);
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
  if (label == 'with-obstacles') {
    counter++;
    // Play sound if "helmet" is continuously predicted for 5 times
    if (counter >= 2) {
      audio.play();
      counter = 0; // Reset the counter
    }
  } else {
    counter = 0; // Reset the counter if prediction is not "helmet"
  }

  // Classifiy again!
  classifyVideo();
}
