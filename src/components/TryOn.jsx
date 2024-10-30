// import { useEffect, useRef, useState } from "react";
// import { Button } from "./ui/button";
// import Modal from "./ui/modal";
// import * as posenet from "@tensorflow-models/posenet";
// import * as tfjs from "@tensorflow/tfjs";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as THREE from 'three'

// export default function TryOn() {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [net, setNet] = useState(null);
//   const [scene, setScene] = useState(null);
//   const [camera, setCamera] = useState(null);
//   const [renderer, setRenderer] = useState(null);

//   useEffect(() => {
//     let stream;

//     const startCamera = async () => {
//       try {
//         // Request access to the camera
//         stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         // Set the video source to the stream
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//         const loadedNet = await posenet.load();
//         setNet(loadedNet);

//         // Start detecting poses from the video stream
//         // initThree();
//         detectPose(loadedNet);
//       } catch (error) {
//         console.error("Error accessing camera: ", error);
//       }
//     };

//     const stopCamera = () => {
//       if (stream) {
//         const tracks = stream.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };

//     if (isModalOpen) {
//       startCamera();
//     } else {
//       stopCamera();
//     }

//     return () => stopCamera(); // Stop the camera stream when the component unmounts or modal closes
//   }, [isModalOpen]);

//   const initThree = () => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
//     camera.position.z = 5;

//     const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
//     renderer.setSize(640, 480);

//     // Lighting for the model
//     const light = new THREE.AmbientLight(0xffffff);
//     scene.add(light);

//     // Load 3D clothes model
//     const loader = new GLTFLoader();
//     loader.load("/dress_design_patent.glb", (gltf) => {
//       const model = gltf.scene;
//       scene.add(model);
//       setScene(scene);
//     });

//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();
//   };

//   const update3DModel = (keypoints) => {
//     if (!scene) return;

//     // Example: Positioning the 3D model on the shoulders
//     const leftShoulder = keypoints.find(k => k.part === "leftShoulder");
//     const rightShoulder = keypoints.find(k => k.part === "rightShoulder");

//     if (leftShoulder && rightShoulder) {
//       // Map shoulder positions to the 3D model's shoulder parts
//       const shoulderWidth = rightShoulder.position.x - leftShoulder.position.x;

//       // Assuming the clothes model has a torso part you want to position
//       const torso = scene.getObjectByName("Torso");
//       if (torso) {
//         torso.position.set(
//           (leftShoulder.position.x + rightShoulder.position.x) / 2, // Center between shoulders
//           leftShoulder.position.y, // Adjust vertical position
//           0 // Depth (z-axis) can be kept constant or adjusted
//         );
//         torso.scale.set(shoulderWidth / 100, 1, 1); // Scale the torso width according to shoulder width
//       }
//     }
//   };

//   const detectPose = async (net) => {
//     if (!net || !videoRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const poseDetection = async () => {
//       // Continuously detect poses in the video stream
//       const pose = await net.estimateSinglePose(video, {
//         flipHorizontal: false,
//       });

//       // Clear the canvas and draw the current frame from the video
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       // Draw pose landmarks on the canvas
//       drawPose(pose, ctx);
//     //   update3DModel(pose.keypoints);
//       requestAnimationFrame(poseDetection); // Repeat detection
//     };

//     poseDetection(); // Start the pose detection loop
//   };

//   const drawPose = (pose, ctx) => {
//     // Draw the keypoints
//     const keypoints = pose.keypoints;
//     keypoints.forEach((keypoint) => {
//       if (keypoint.score > 0.5) {
//         const { y, x } = keypoint.position;
//         ctx.beginPath();
//         ctx.arc(x, y, 5, 0, 2 * Math.PI);
//         ctx.fillStyle = "red";
//         ctx.fill();
//       }
//     });

//     // Draw the skeleton
//     const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, 0.5);
//     adjacentKeyPoints.forEach((keypoints) => {
//       const [start, end] = keypoints;
//       ctx.beginPath();
//       ctx.moveTo(start.position.x, start.position.y);
//       ctx.lineTo(end.position.x, end.position.y);
//       ctx.strokeStyle = "green";
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     });
//   };

//   return (
//     <div className="flex justify-center gap-4">
//       <Button variant="outline" onClick={() => setModalOpen(true)}>
//         Image
//       </Button>
//       <Button variant="outline">Carmera</Button>

//       {/* Modal Component */}
//       <Modal isOpen={isModalOpen} onOpenChange={setModalOpen}>
//         <h2 className="text-xl font-bold">Thử đồ trực tiếp</h2>
//         {/* camera */}
//         <div className="flex justify-center pt-4">
//           <video ref={videoRef} autoPlay className="hidden" width="640" height="480" />
//           <canvas ref={canvasRef} className="w-full h-auto rounded-md" width="640" height="480"></canvas>
//         </div>
//         <div className="flex justify-end pt-4">
//           <Button onClick={() => setModalOpen(false)} variant="secondary ">
//             thoát
//           </Button>
//         </div>
//       </Modal>
//     </div>
//   );
// }
