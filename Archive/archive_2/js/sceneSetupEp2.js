import '/style.css'; //setup basic visual factors for the overall web

import * as THREE from 'three';
import * as Geo from '/Archive/js/functions.js';

import {Pane} from 'tweakpane';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { Sphere } from 'three';
import $ from 'jquery';
import { SphereGeometry } from 'three';
// *********************** Basic settings ***********************
//claim variables
var renderer;
var camera;
var scene, scene2;
var light;

var orbit_ctrl;
var trfm_ctrl;
var mouse = new THREE.Vector2();
var rayCaster = new THREE.Raycaster();


var selectObj=null;
var leftMouseDown;
var rightMouseDown;


var DragPointMat = new THREE.MeshPhongMaterial({color: 0x696969, transparent: true, opacity:0.8});

// ******** construct render setting
function initRender(){
  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setClearAlpha(0); 
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  renderer.shadowMaptype = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  renderer.setPixelRatio(devicePixelRatio);
  document.body.appendChild(renderer.domElement);//insert this into body
}

// ******** construct camera setting
function initCamera(){

  camera = new THREE.PerspectiveCamera(45, window.innerWidth/(window.innerHeight*2), 0.1, 200);
  camera.position.set(8, 0, 0);

  camera.up.x = 0;
  camera.up.y = 0;
  camera.up.z = 1;

  camera.lookAt({
    x : 0,
    y : 0,
    z : 0
  });

  //resize window to maintaian the size of geometry
  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize(){
      camera.aspect = window.innerWidth/2 / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
  }

}

// ********* scene setting
function initScene(){
  scene = new THREE.Scene();
  scene2 = new THREE.Scene();
}

//*********************** testing new UI (tweakpane) *********************

/** MOVABLE LEFT DIV **/

const leftWrapper = document.querySelector("#left_container_wrapper");
const rightWrapper = document.querySelector("#right_container_wrapper");

function onLeftDrag(event) {
    let getStyle = window.getComputedStyle(leftWrapper);
    let leftPosition = parseInt(getStyle.left);
    let topPosition = parseInt(getStyle.top);

    leftWrapper.style.left = `${leftPosition + event.movementX}px`;
    leftWrapper.style.top = `${topPosition + event.movementY}px`;
}

function onRightDrag(event) {
    let getStyle = window.getComputedStyle(rightWrapper);
    let leftPosition = parseInt(getStyle.left);
    let topPosition = parseInt(getStyle.top);

    rightWrapper.style.left = `${leftPosition + event.movementX}px`;
    rightWrapper.style.top = `${topPosition + event.movementY}px`;
}

let isMouseDownOnLeft = false;
let isMouseDownOnRight = false;

const leftHeader = document.getElementById("left_container_header");
const rightHeader = document.getElementById("right_container_header");

leftHeader.addEventListener("mousedown", ()=> {
    isMouseDownOnLeft = true;
});

rightHeader.addEventListener("mousedown", ()=> {
    isMouseDownOnRight = true;
});

window.addEventListener("mouseup", ()=> {
    isMouseDownOnLeft = false;
    isMouseDownOnRight = false;
});

window.addEventListener("mousemove", function (event) {
    if (isMouseDownOnLeft) {
        onLeftDrag(event);
    }
    if (isMouseDownOnRight) {
        onRightDrag(event);
    }
});

//initialize global variables
let globalWidth = 2, globalHeight = 2, globalDepth = 2, globalPlaneFactor = 2;

//creating the first pane (left)
const paneLeft = new Pane({
    container: document.getElementById('left_container'),
});

const tab = paneLeft.addTab({
    pages: [
        {title: 'Height'},
        {title: 'Length'},
        {title: 'Trial'}
    ],
});

// tweakpane - width

const widthParams = {
  Point1z: -1,
};
tab.pages[0].addInput(widthParams, 'Point1z', {
    min: -1.5,
    max: 1,
}).on('change', (ev) => { //on change, dispose old geometry and create new
    Redraw();
    cp1.z = ev.value;

});

// tweakpane - height

const heightParams = {
  Point2z: -1.1,
};
tab.pages[0].addInput(heightParams, 'Point2z', {
    min: -1.5,
    max: 1,
}).on('change', (ev) => { //on change, dispose old geometry and create new
  Redraw();
  cp2.z = ev.value;
});

// tweakpane - depth

const depthParams = {
  Point3z: -1.2,
};
tab.pages[0].addInput(depthParams, 'Point3z', {
  min: -1.5,
  max: 1,
}).on('change', (ev) => { //on change, dispose old geometry and create new
  Redraw();
  cp3.z = ev.value;
});

const Point4hParams = {
  Point4z: -1.2,
};
tab.pages[0].addInput(Point4hParams, 'Point4z', {
  min: -1.5,
  max: 1,
}).on('change', (ev) => { //on change, dispose old geometry and create new
  Redraw();
  cp4.z = ev.value;
});

//tweakpane - color (new feature!)

const Point1lParams = {
  Point1l: 0.5,
};
tab.pages[1].addInput(Point1lParams, 'Point1l',{
  min: -1.5,
  max: 1,
}).on('change', (ev) => {
  Redraw();
  Dlen1.l = ev.value;
});

const Point2lParams = {
  Point2l: 0.5,
};
tab.pages[1].addInput(Point2lParams, 'Point2l',{
  min: -1.5,
  max: 1,
}).on('change', (ev) => {
  Redraw();
  Dlen2.l = ev.value;
});

const Point3lParams = {
  Point3l: 0.5,
};
tab.pages[1].addInput(Point3lParams, 'Point3l',{
  min: -1.5,
  max: 1,
}).on('change', (ev) => {
  Redraw();
  Dlen3.l = ev.value;
});

const Point4lParams = {
  Point4l: 0.5,
};
tab.pages[1].addInput(Point4lParams, 'Point4l',{
  min: -1.5,
  max: 1,
}).on('change', (ev) => {
  Redraw();
  Dlen4.l = ev.value;
});

const Point0lParams = {
  Point0l: 1,
};
tab.pages[1].addInput(Point0lParams, 'Point0l',{
  min: 0,
  max: 1.5,
}).on('change', (ev) => {
  Redraw();
  formo2.l = ev.value;
});

const trialVisibilityCheckboxParams = {
  'form & force': false, //at first, box is unchecked so value is "false"
};

//make the checkbox
const trialVisibilityCheckbox = tab.pages[2].addInput(trialVisibilityCheckboxParams, 'form & force').on('change', (ev) => { //on change, dispose old plane geometry and create new
   form_group_e_trial.traverse(function(obj) {
    if (obj.type === "Mesh") {
      obj.material.visible =ev.value;
    }
    });
    
    force_general_trial.traverse(function(obj) {
      if (obj.type === "Mesh") {
        obj.material.visible =ev.value;
      }
      });
    
    force_group_f_trial.traverse(function(obj) {
      if (obj.type === "Mesh") {
        obj.material.visible =ev.value;
      }
    });
});

const trialHeightFolder = tab.pages[2].addFolder({
  title: 'show',
});

trialHeightFolder.hidden = true; //hide the plane folder b/c box is unchecked at first

const trialHeightSliderParams = {
  triheight: 0.7, //starts as double the size of the box's params
};
trialHeightFolder.addInput(trialHeightSliderParams, 'triheight', {
  min: 0.5, //min = double the size of the box's params
  max: 1, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
  triP3.z = ev.value;
  Redraw();
  // force_group_c.traverse(function(obj) {
  //   if (obj.type === "Mesh") {
  //     obj.material.visible =ev.value;
  //   }
  //   });
});

trialVisibilityCheckbox.on('change', (ev) => { //on change, change the hidden and visibility values set
  trialHeightFolder.hidden = !trialHeightFolder.hidden;
});


//tweakpane - new panel (right)

const hiddenPane = new Pane({
    container: document.getElementById('right_container'),
});
const tabright = hiddenPane.addTab({
  pages: [
      {title: 'Height'},
      {title: 'Length'},
      {title: 'Trial'}
  ],
});

const Pointo1hParams = {
  PointO1h: 2,
};
tabright.pages[0].addInput(Pointo1hParams, 'PointO1h',{
  min: 1.5,
  max: 2.5,
}).on('change', (ev) => {
  Redraw();
  o1.l = ev.value;
});

const Pointo2hParams = {
  PointO2h: 2,
};
tabright.pages[0].addInput(Pointo2hParams, 'PointO2h',{
  min: 1.5,
  max: 2.5,
}).on('change', (ev) => {
  Redraw();
  o2.l = ev.value;
});



// const planeVisibilityCheckboxParams = {
//     'force cell': false, //at first, box is unchecked so value is "false"
// };

// //make the checkbox
// const planeVisibilityCheckbox = tabright.pages[0].addInput(planeVisibilityCheckboxParams, 'force cell').on('change', (ev) => { //on change, dispose old plane geometry and create new
//      force_group_c.traverse(function(obj) {
//       if (obj.type === "Mesh") {
//         obj.material.visible =ev.value;
//       }
//       });
// });

// const planeFolder = tabright.pages[0].addFolder({
//     title: 'cell scale',
// });

// planeFolder.hidden = true; //hide the plane folder b/c box is unchecked at first

// const planeSizeSliderParams = {
//     size: 0.7, //starts as double the size of the box's params
// };
// var forceCellScale = 0.7
// //make the plane size slider
// planeFolder.addInput(planeSizeSliderParams, 'size', {
//     min: 0.5, //min = double the size of the box's params
//     max: 1, //max = quadruple the size of the box's params
// }).on('change', (ev) => { //on change, dispose old plane geometry and create new
//     forceCellScale = ev.value;
//     Redraw();
//     force_group_c.traverse(function(obj) {
//       if (obj.type === "Mesh") {
//         obj.material.visible =ev.value;
//       }
//       });
// });

// planeVisibilityCheckbox.on('change', (ev) => { //on change, change the hidden and visibility values set
//     planeFolder.hidden = !planeFolder.hidden;
// });


//create new OrbitControls object
//orbit_ctrl = new OrbitControls(camera, renderer.domElement);

//add a box
//parameters: width, height, depth
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);

//won't see anything unless you create a mesh, so create a mesh + object

//MeshPhongMaterial adds lighting to plane in comparison to MeshBasicMaterial
const boxMaterial = new THREE.MeshPhongMaterial(
    {
        //colors: https://libxlsxwriter.github.io/working_with_colors.html
        color: 0x800000,

        //make back visible
        side: THREE.DoubleSide,

        //make vertices making the plane visible
        //flatShading: THREE.FlatShading,
        //castShadow: true
    });

//adds the mesh to the scene
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
const boxMesh2 = new THREE.Mesh(boxGeometry, boxMaterial);

//scene.add(boxMesh);
//scene2.add(boxMesh2);

//add a plane
//parameters: width, height, widthSegments, heightSegments
const planeGeometry = new THREE.PlaneGeometry(4, 4, 10, 10);

//won't see anything unless you create a mesh, so create a mesh + object

//MeshPhongMaterial adds lighting to plane in comparison to MeshBasicMaterial
const planeMaterial2 = new THREE.MeshPhongMaterial(
    {
        //colors: https://libxlsxwriter.github.io/working_with_colors.html
        color:'#0b008a',

        //make back visible
        side: THREE.DoubleSide,

        //make vertices making the plane visible
        //flatShading: THREE.FlatShading,

        opacity: 0.5,
        transparent: true, //make translucent

        //castShadow: true
    });

//adds the mesh to the scene
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial2);

//scene.add(planeMesh);
planeMesh.visible = false;


// ******************      Trial Construction       ****************************************

// Trial Construction 
// Trial Force Diagram
// Construct Force Diagram
// ******************    locate apply loads point A,B,C,D   **************
var FP_B = new function () {
  this.x = 0;
  this.y = 1;
}
var FP_C = new function () {
  this.x = 0;
  this.y = -1.2;
}

var FP_D = new function () {
  this.x = -1;
  this.y = -1;
}
var fo = new function () {
  this.x = -1;
  this.y = 0;
  this.z = -2;
}
var formo2 = new function () {
  this.l = 1;
}

var Dlen1 = new function () {
  this.l = 0.5;
 
}
var Dlen2 = new function () {
  this.l = 0.5;
 
}
var Dlen3 = new function () {
  this.l = 0.5;
 
}
var Dlen4 = new function () {
  this.l = 0.5;
 
}
var cp1 = new function () {
  this.z = -1;
 
}
var cp2 = new function () {
  this.z = -1.2;
 
}
var cp3 = new function () {
  this.z = -1.2;
 
}
var cp4 = new function () {
  this.z = -1.2;
 
}
var o1 = new function () {
  this.l = 2;
  
 
}

var o2 = new function () {
  this.l = 2;
  
 
}

var formo2 = new function () {
  this.l = 1;
}

var foffset = new function () {
  this.l = 0.8;
  
 
}

var triP3 = new function () {
  this.z = 0;
}


var ForceP_A = new THREE.Vector3(-2,1,0);
var ForceP_B = new THREE.Vector3(FP_B.x,FP_B.y,0);
var ForceP_C = new THREE.Vector3(FP_C.x,FP_C.y,0);
var ForceP_D = new THREE.Vector3(FP_D.x,FP_D.y,0);

// *******************     locate the force trial point O ****************





// *********************** form diagram inital data ***********************

var formTpPt = [];
formTpPt.push(new THREE.Vector3(0,0,0));
formTpPt.push(new THREE.Vector3(0,0,1));

var formBtPt1 = [];
formBtPt1.push(new THREE.Vector3(0,0,0));
formBtPt1.push(new THREE.Vector3(1,-1,-1));

var formBtPt2= [];
formBtPt2.push(new THREE.Vector3(0,0,0));
formBtPt2.push(new THREE.Vector3(-1.3660,-0.3660,-1));

var formBtPt3 = [];
formBtPt3.push(new THREE.Vector3(0,0,0));
formBtPt3.push(new THREE.Vector3(0.3660,1.3660,-1));

var Ctrl_pts=[];

var form_general
var form_group_v
var form_group_f
var form_group_e
var form_group_c
var form_group_e_trial
var form_general_trial


// *********************** force diagram inital data ***********************

var force_group_v
var force_group_f
var force_group_e
var force_group_c
var force_general
var force_general_trial


var force_group_f_trial

var TrialP_O = new THREE.Vector3(fo.x,fo.y,fo.z);

// *********************** redraw the form and force diagram when parametrer is changing ****************
function Redraw(){
  
  //form groups
  scene.remove(form_group_v);
  scene.remove(form_group_f);
  scene.remove(form_group_e);
  scene.remove(form_group_c);
  scene.remove(form_general);
  scene.remove(form_group_e_trial);
  scene.remove(form_general_trial);

  form_group_v = new THREE.Group();
  form_group_f = new THREE.Group();
  form_group_e = new THREE.Group();
  form_group_c = new THREE.Group();
  form_general = new THREE.Group();
  form_group_e_trial = new THREE.Group();
  form_general_trial = new THREE.Group();

  //force groups
  scene2.remove(force_group_v);
  scene2.remove(force_group_f);
  scene2.remove(force_group_e);
  scene2.remove(force_group_c);
  scene2.remove(force_general);
  scene2.remove(force_group_f_trial);
  scene2.remove(force_general_trial);

  force_group_v = new THREE.Group();
  force_group_f = new THREE.Group();
  force_group_e = new THREE.Group();
  force_group_c = new THREE.Group();
  force_general = new THREE.Group();
  force_group_f_trial = new THREE.Group();
  force_general_trial = new THREE.Group();

  // *********************** force apply loads faces **************************
  var forceApplyFaces = Geo.ForceFace4ptGN(ForceP_A, ForceP_B, ForceP_C, ForceP_D)
  force_group_f.add(forceApplyFaces)

  // *********************** force trial point O **************************

  const TrialP_0Sp = Geo.addVertice(0.01, "sp1", TrialP_O);
  const TrialP_0Sp_out = Geo.addVerticeOut(0.01, TrialP_0Sp.position, 1.55)
  force_group_v.add(TrialP_0Sp);
  force_group_v.add(TrialP_0Sp_out);

  const TrialFaces = Geo.ForceTrialFace(ForceP_A,ForceP_B,ForceP_C,ForceP_D,TrialP_O)
  force_group_f_trial.add(TrialFaces)

  // *********************** form vertices **************************
  var FormP_O1 = new THREE.Vector3(-0.5,-0.5,1);

  // find point O2 from triangle ACC2, c2=c.z-1

  let ForceP_C_2 = new THREE.Vector3(ForceP_C.x,ForceP_C.y,ForceP_C.z-1);

  var Vec_tri_ACC2 = Geo.CalNormalVector(ForceP_A,ForceP_C_2,ForceP_C,1.2);
  var FormP_O2 = new THREE.Vector3(FormP_O1.x-formo2.l*Vec_tri_ACC2.x,FormP_O1.y-formo2.l*Vec_tri_ACC2.y,FormP_O1.z-formo2.l*Vec_tri_ACC2.z);
  console.log(FormP_O2)
  // find FormP_O1, FormP_O2
  var FormP_O1B = new THREE.Vector3(-0.5,-0.5,-1.5);
  var FormP_O2B = new THREE.Vector3(FormP_O2.x,FormP_O2.y,-1.5);

  // add apply loads arrows

  var arrow_apply=new THREE.MeshPhongMaterial( {color: 0x009600} );

  var arrow_apply_outline = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );


  var apply_arrow1=Geo.createCylinderArrowMesh(FormP_O1,new THREE.Vector3(FormP_O1.x,FormP_O1.y,FormP_O1.z-0.4),arrow_apply,0.02,0.05,0.56);
  var apply_arrow2=Geo.createCylinderArrowMesh(FormP_O2,new THREE.Vector3(FormP_O2.x,FormP_O2.y,FormP_O2.z-0.4),arrow_apply,0.02,0.05,0.56);

  form_general.add(apply_arrow1);
  form_general.add(apply_arrow2);

  var apply_arrow12=Geo.createCylinderArrowMesh(new THREE.Vector3(FormP_O1.x,FormP_O1.y,FormP_O1.z-0.015),new THREE.Vector3(FormP_O1.x,FormP_O1.y,FormP_O1.z-0.4),arrow_apply_outline,0.025,0.05,0.53);
  var apply_arrow22=Geo.createCylinderArrowMesh(new THREE.Vector3(FormP_O2.x,FormP_O2.y,FormP_O2.z-0.015),new THREE.Vector3(FormP_O2.x,FormP_O2.y,FormP_O2.z-0.4),arrow_apply_outline,0.025,0.05,0.53);
  //const applyArrow = Geo.createCylinderArrowMesh(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.3), formTpPt[1], applyArrowMaterial, 0.015,0.035,0.55);

  form_general.add(apply_arrow22);
  form_general.add(apply_arrow12);
 
  // add dash lines o1o1B, o2o2B
  var apply_o1o1B = [];
  apply_o1o1B.push(FormP_O1);
  apply_o1o1B.push(FormP_O1B);

  var apply_1_geo = new THREE.BufferGeometry().setFromPoints( apply_o1o1B );

  var applyline_dash = new THREE.LineDashedMaterial({
    color: 0x009600,//color
    dashSize: 0.05,
    gapSize: 0.03,
    linewidth: 1

  });

  var applyline_dash_form = new THREE.LineDashedMaterial({
    color: 0x009600,//color
    dashSize: 0.05,
    gapSize: 0.03,
    linewidth: 1

  });

  var applyline_o1B = new THREE.LineSegments(apply_1_geo,applyline_dash_form);
  applyline_o1B.computeLineDistances();//compute
  form_general.add(applyline_o1B);

  var apply_o2o2B = [];
  apply_o2o2B.push(FormP_O2);
  apply_o2o2B.push(FormP_O2B);

  var apply_2_geo = new THREE.BufferGeometry().setFromPoints( apply_o2o2B );

  var applyline_o2B = new THREE.LineSegments(apply_2_geo,applyline_dash_form);
  applyline_o2B.computeLineDistances();//compute
  form_general.add(applyline_o2B);
  
  // ***********************            form faces                **************************

  // green faces : o1 o2
  var greenface_O1O2 = Geo.FormFace4ptGN( FormP_O1,FormP_O1B,FormP_O2B,FormP_O2)
  form_group_f.add(greenface_O1O2);

  // green faces : o2 o2B point3 (perpendicular to BC)

  var Vec_tri_BCC2 = Geo.CalNormalVector(ForceP_B,ForceP_C_2,ForceP_C,1.2);

  var FormP_3_temp = new THREE.Vector3(FormP_O2.x-1.2*Vec_tri_BCC2.x,FormP_O2.y-1.2*Vec_tri_BCC2.y,FormP_O2.z-1.2*Vec_tri_BCC2.z);
  var oldlen = FormP_O2.distanceTo(FormP_3_temp);
  var newlen = oldlen - Dlen1.l*oldlen;

  var FormP_3 = new THREE.Vector3(FormP_O2.x+(FormP_3_temp.x-FormP_O2.x)*newlen/oldlen, FormP_O2.y+(FormP_3_temp.y-FormP_O2.y)*newlen/oldlen, FormP_O2.z+(FormP_3_temp.z-FormP_O2.z)*newlen/oldlen);
  var FormP_3B = new THREE.Vector3(FormP_3.x, FormP_3.y,-1.5);

  var greenface_O2P3 = Geo.FormFace4ptGN( FormP_O2,FormP_O2B,FormP_3B,FormP_3)
  form_group_f.add(greenface_O2P3);

  var green_p3 = [];
  green_p3.push(FormP_3);
  green_p3.push(FormP_3B);

  var green_p3_geo = new THREE.BufferGeometry().setFromPoints( green_p3 );

  var dashline_p3 = new THREE.LineSegments(green_p3_geo,applyline_dash);
  dashline_p3.computeLineDistances();//compute
  form_group_f.add(dashline_p3);

  // green faces : o2 o2B point4 (perpendicular to AB)

  let ForceP_A_2 = new THREE.Vector3(ForceP_A.x,ForceP_A.y,ForceP_A.z-1);
  var Vec_tri_AA2B = Geo.CalNormalVector(ForceP_A,ForceP_A_2,ForceP_B,1.2);

  var FormP_4_temp = new THREE.Vector3(FormP_O2.x-1.2*Vec_tri_AA2B.x,FormP_O2.y-1.2*Vec_tri_AA2B.y,FormP_O2.z-1.2*Vec_tri_AA2B.z);
  var oldlen = FormP_O2.distanceTo(FormP_4_temp);
  var newlen = oldlen - Dlen2.l*oldlen;
  
  var FormP_4 = new THREE.Vector3(FormP_O2.x+(FormP_4_temp.x-FormP_O2.x)*newlen/oldlen, FormP_O2.y+(FormP_4_temp.y-FormP_O2.y)*newlen/oldlen, FormP_O2.z+(FormP_4_temp.z-FormP_O2.z)*newlen/oldlen);
  var FormP_4B = new THREE.Vector3(FormP_4.x, FormP_4.y,-1.5);

  var greenface_O2P4 = Geo.FormFace4ptGN( FormP_O2,FormP_O2B,FormP_4B,FormP_4)
  form_group_f.add(greenface_O2P4);

  var green_p4 = [];
  green_p4.push(FormP_4);
  green_p4.push(FormP_4B);

  var green_p4_geo = new THREE.BufferGeometry().setFromPoints( green_p4 );

  var dashline_p4 = new THREE.LineSegments(green_p4_geo,applyline_dash);
  dashline_p4.computeLineDistances();//compute
  form_group_f.add(dashline_p4);

  // green faces : o1 o1B point2 (perpendicular to CD)

  var Vec_tri_CC2D = Geo.CalNormalVector(ForceP_C,ForceP_C_2,ForceP_D,1.2);
   
  var FormP_2_temp = new THREE.Vector3(FormP_O1.x-1.2*Vec_tri_CC2D.x,FormP_O1.y-1.2*Vec_tri_CC2D.y,FormP_O1.z-1.2*Vec_tri_CC2D.z);
  var oldlen = FormP_O1.distanceTo(FormP_2_temp);
  var newlen = oldlen - Dlen4.l*oldlen;
  
  var FormP_2 = new THREE.Vector3(FormP_O1.x+(FormP_2_temp.x-FormP_O1.x)*newlen/oldlen, FormP_O1.y+(FormP_2_temp.y-FormP_O1.y)*newlen/oldlen, FormP_O1.z+(FormP_2_temp.z-FormP_O1.z)*newlen/oldlen);
  var FormP_2B = new THREE.Vector3(FormP_2.x, FormP_2.y,-1.5);

  var greenface_O1P2 = Geo.FormFace4ptGN( FormP_O1,FormP_O1B,FormP_2B,FormP_2)
  form_group_f.add(greenface_O1P2);

  var green_p2 = [];
  green_p2.push(FormP_2);
  green_p2.push(FormP_2B);

  var green_p2_geo = new THREE.BufferGeometry().setFromPoints( green_p2 );

  var dashline_p2 = new THREE.LineSegments(green_p2_geo,applyline_dash);
  dashline_p2.computeLineDistances();//compute
  form_group_f.add(dashline_p2);

  // green faces : o1 o1B point1 (perpendicular to AD)

  var Vec_tri_AA2D = Geo.CalNormalVector(ForceP_D,ForceP_A_2,ForceP_A,1.2);
    
  var FormP_1_temp = new THREE.Vector3(FormP_O1.x-1.2*Vec_tri_AA2D.x,FormP_O1.y-1.2*Vec_tri_AA2D.y,FormP_O1.z-1.2*Vec_tri_AA2D.z);
  var oldlen = FormP_O1.distanceTo(FormP_1_temp);
  var newlen = oldlen - Dlen3.l*oldlen;
  
  var FormP_1 = new THREE.Vector3(FormP_O1.x+(FormP_1_temp.x-FormP_O1.x)*newlen/oldlen, FormP_O1.y+(FormP_1_temp.y-FormP_O1.y)*newlen/oldlen, FormP_O1.z+(FormP_1_temp.z-FormP_O1.z)*newlen/oldlen);
  var FormP_1B = new THREE.Vector3(FormP_1.x, FormP_1.y,-1.5);

  var greenface_O1P1 = Geo.FormFace4ptGN( FormP_O1,FormP_O1B,FormP_1B,FormP_1)
  form_group_f.add(greenface_O1P1);

  var green_p1 = [];
  green_p1.push(FormP_1);
  green_p1.push(FormP_1B);

  var green_p1_geo = new THREE.BufferGeometry().setFromPoints( green_p1 );

  var dashline_p1 = new THREE.LineSegments(green_p1_geo,applyline_dash);
  dashline_p1.computeLineDistances();//compute
  form_group_f.add(dashline_p1);

  // ***********************           trial form                **************************
  var trial_P3 = new THREE.Vector3(FormP_3.x,FormP_3.y,triP3.z)

  var trial_o2 = Geo.create_trial_intec (trial_P3,ForceP_C,TrialP_O,ForceP_B,FormP_O2,FormP_O2B);
  var trial_P4 = Geo.create_trial_intec (trial_o2,ForceP_A,TrialP_O,ForceP_B,FormP_4,FormP_4B);
  var trial_o1 = Geo.create_trial_intec (trial_o2,ForceP_C,TrialP_O,ForceP_A,FormP_O1,FormP_O1B);
  var trial_P2 = Geo.create_trial_intec (trial_o1,ForceP_C,TrialP_O,ForceP_D,FormP_2,FormP_2B);
  var trial_P1 = Geo.create_trial_intec (trial_o1,ForceP_A,TrialP_O,ForceP_D,FormP_1,FormP_1B);

  var trial_mesh_p3o2 = Geo.createCylinderMesh(trial_o2,trial_P3,DragPointMat,0.02,0.02);
  var trial_mesh_p4o2 = Geo.createCylinderMesh(trial_o2,trial_P4,DragPointMat,0.02,0.02);
  var trial_mesh_o1o2 = Geo.createCylinderMesh(trial_o2,trial_o1,DragPointMat,0.02,0.02);
  var trial_mesh_p2o1 = Geo.createCylinderMesh(trial_o1,trial_P2,DragPointMat,0.02,0.02);
  var trial_mesh_p1o1 = Geo.createCylinderMesh(trial_o1,trial_P1,DragPointMat,0.02,0.02);


  form_group_e_trial.add(trial_mesh_p3o2)
  form_group_e_trial.add(trial_mesh_p4o2)
  form_group_e_trial.add(trial_mesh_o1o2)
  form_group_e_trial.add(trial_mesh_p2o1)
  form_group_e_trial.add(trial_mesh_p1o1)

  //trial form closing plane                  
  //plane mesh
  var trial_closingplane = Geo.FormPlane(trial_P1,trial_P2,trial_P3,trial_P4)
  form_general_trial.add(trial_closingplane);
  
  var trialline_dash = new THREE.LineDashedMaterial({
    color: "black",//color
    dashSize: 0.1,
    gapSize: 0.03,
    linewidth: 1

  });
 
  var trial_linep1p2 = Geo.createdashline ( trial_P1,  trial_P2,trialline_dash)
  var trial_linep1p3 = Geo.createdashline ( trial_P1,  trial_P3,trialline_dash)
  var trial_linep1p4 = Geo.createdashline ( trial_P1,  trial_P4,trialline_dash)
  var trial_linep2p3 = Geo.createdashline ( trial_P2,  trial_P3,trialline_dash)
  var trial_linep3p4 = Geo.createdashline ( trial_P3,  trial_P4,trialline_dash)


  form_general_trial.add(trial_linep1p2);
  form_general_trial.add(trial_linep1p3);
  form_general_trial.add(trial_linep1p4);
  form_general_trial.add(trial_linep2p3);
  form_general_trial.add(trial_linep3p4);

  //trial plane face nromals

  var trialmid_p1p2p3 = new THREE.Vector3((trial_P1.x+trial_P2.x+trial_P3.x)/3,(trial_P1.y+trial_P2.y+trial_P3.y)/3,(trial_P1.z+trial_P2.z+trial_P3.z)/3 )
  var vec_p1p2p3_temp = Geo.CalNormalVector(trial_P3,trial_P2,trial_P1,1.2)
  var trialnormal_p1p2p3 = new THREE.Vector3(trialmid_p1p2p3.x-0.2*vec_p1p2p3_temp.x, trialmid_p1p2p3.y-0.2*vec_p1p2p3_temp.y, trialmid_p1p2p3.z-0.2*vec_p1p2p3_temp.z)

  var trial_normal_material = new THREE.MeshPhongMaterial({color:"red"})
  var trial_normal_outlinematerial = new THREE.MeshPhongMaterial({color:"white", side:THREE.BackSide})
  var force_normal_material = new THREE.MeshPhongMaterial({color:"red"})

  var trial_normal_1 = Geo.createCylinderArrowMesh(trialmid_p1p2p3,trialnormal_p1p2p3,trial_normal_material,0.015,0.035,0.55);
  var trial_normal_1_outline = Geo.createCylinderArrowMesh(trialmid_p1p2p3,trialnormal_p1p2p3,trial_normal_outlinematerial,0.018,0.038,0.54);

  form_general_trial.add(trial_normal_1);
  form_general_trial.add(trial_normal_1_outline);
  

  var trialmid_p1p3p4 = new THREE.Vector3((trial_P1.x+trial_P3.x+trial_P4.x)/3,(trial_P1.y+trial_P3.y+trial_P4.y)/3,(trial_P1.z+trial_P3.z+trial_P4.z)/3 )
  var vec_p1p3p4_temp = Geo.CalNormalVector(trial_P1,trial_P4,trial_P3,1.2)
  var trialnormal_p1p3p4 = new THREE.Vector3(trialmid_p1p3p4.x-0.2*vec_p1p3p4_temp.x, trialmid_p1p3p4.y-0.2*vec_p1p3p4_temp.y, trialmid_p1p3p4.z-0.2*vec_p1p3p4_temp.z)

  var trial_normal_2 = Geo.createCylinderArrowMesh(trialmid_p1p3p4,trialnormal_p1p3p4,trial_normal_material,0.015,0.035,0.55);
  var trial_normal_2_outline = Geo.createCylinderArrowMesh(trialmid_p1p3p4,trialnormal_p1p3p4,trial_normal_outlinematerial,0.018,0.038,0.54);

  form_general_trial.add(trial_normal_2);
  form_general_trial.add(trial_normal_2_outline);
 
  // ***********************          final form planes           **************************
 //location of supports
  //plane mesh
  var FormCP1 = new THREE.Vector3(FormP_1.x,FormP_1.y,cp1.z);
  var FormCP2 = new THREE.Vector3(FormP_2.x,FormP_2.y,cp2.z);
  var FormCP3 = new THREE.Vector3(FormP_3.x,FormP_3.y,cp3.z);
  var FormCP4 = new THREE.Vector3(FormP_4.x,FormP_4.y,cp4.z);

  console.log(FormCP4)

  var form_closingplane = Geo.FormPlane(FormCP1,FormCP2,FormCP3,FormCP4)
  form_general.add(form_closingplane);

  var form_linep1p2 = Geo. createdashline ( FormCP1,  FormCP2,trialline_dash)
  var form_linep1p3 = Geo. createdashline ( FormCP1,  FormCP3,trialline_dash)
  var form_linep1p4 = Geo. createdashline ( FormCP1,  FormCP4,trialline_dash)
  var form_linep2p3 = Geo. createdashline ( FormCP2,  FormCP3,trialline_dash)
  var form_linep3p4 = Geo. createdashline ( FormCP3,  FormCP4,trialline_dash)


  form_general.add(form_linep1p2);
  form_general.add(form_linep1p3);
  form_general.add(form_linep1p4);
  form_general.add(form_linep2p3);
  form_general.add(form_linep3p4); 

  //face nromals

  var mid_p1p2p3 = new THREE.Vector3((FormCP1.x+FormCP2.x+FormCP3.x)/3,(FormCP1.y+FormCP2.y+FormCP3.y)/3,(FormCP1.z+FormCP2.z+FormCP3.z)/3 )
  var vec_p1p2p3_temp =Geo.CalNormalVector(FormCP3,FormCP2,FormCP1,1.2)
  var normal_p1p2p3 = new THREE.Vector3(mid_p1p2p3.x-0.2*vec_p1p2p3_temp.x, mid_p1p2p3.y-0.2*vec_p1p2p3_temp.y, mid_p1p2p3.z-0.2*vec_p1p2p3_temp.z)

  var form_normal_material = new THREE.MeshPhongMaterial({color:"red"})
  var form_normal_outlinematerial = new THREE.MeshPhongMaterial({color:"white", side:THREE.BackSide})

  var form_normal_1 = Geo.createCylinderArrowMesh(mid_p1p2p3,normal_p1p2p3,form_normal_material,0.015,0.035,0.55);
  var form_normal_1_outline = Geo.createCylinderArrowMesh(mid_p1p2p3,normal_p1p2p3,form_normal_outlinematerial,0.018,0.038,0.54);

  form_general.add(form_normal_1);
  form_general.add(form_normal_1_outline);

  var mid_p1p3p4 = new THREE.Vector3((FormCP1.x+FormCP3.x+FormCP4.x)/3,(FormCP1.y+FormCP3.y+FormCP4.y)/3,(FormCP1.z+FormCP3.z+FormCP4.z)/3 )
  var vec_p1p3p4_temp = Geo.CalNormalVector(FormCP1,FormCP4,FormCP3,1.2)
  var normal_p1p3p4 = new THREE.Vector3(mid_p1p3p4.x-0.2*vec_p1p3p4_temp.x, mid_p1p3p4.y-0.2*vec_p1p3p4_temp.y, mid_p1p3p4.z-0.2*vec_p1p3p4_temp.z)

  var form_normal_2 = Geo.createCylinderArrowMesh(mid_p1p3p4,normal_p1p3p4,form_normal_material,0.015,0.035,0.55);
  var form_normal_2_outline = Geo.createCylinderArrowMesh(mid_p1p3p4,normal_p1p3p4,form_normal_outlinematerial,0.018,0.038,0.54);

  form_general.add(form_normal_2);
  form_general.add(form_normal_2_outline);
 
  // ***********************          find trial force point x1 and x2              **************************

  //location of x1 x2
  //find x1
  var ForceX1_vec = Geo.CalNormalVector(trial_P3,trial_P2,trial_P1,0.5);
  var ForceX1_temp = new THREE.Vector3(TrialP_O.x-1.2*ForceX1_vec.x, TrialP_O.y-1.2*ForceX1_vec.y,TrialP_O.z-1.2*ForceX1_vec.z);   

  //define intersection point x1
  var intersect_x1_vec = new THREE.Vector3(ForceX1_temp.x-TrialP_O.x,ForceX1_temp.y-TrialP_O.y,ForceX1_temp.z-TrialP_O.z);
  var applyplanevec = Geo.CalNormalVector(ForceP_A,ForceP_B,ForceP_C,0.5);
  var ForceX1 = Geo.Cal_Plane_Line_Intersect_Point(TrialP_O,intersect_x1_vec,ForceP_B,applyplanevec);

  var line_ox1 = [];
  line_ox1.push(TrialP_O);
  line_ox1.push(ForceX1);

  var line_ox1_geo = new THREE.BufferGeometry().setFromPoints( line_ox1 );

  var applyline_1 = new THREE.LineDashedMaterial({
    color: "black",//color
    dashSize: 0.2,
    gapSize: 0.03,
    linewidth: 1
  });

  var applylineox1 = new THREE.LineSegments(line_ox1_geo,applyline_1);
  applylineox1.computeLineDistances();//compute
  force_general_trial.add(applylineox1);

  //find x2

  var ForceX2_vec = Geo.CalNormalVector(trial_P1,trial_P4,trial_P3,0.5);
  var ForceX2_temp = new THREE.Vector3(TrialP_O.x-1.2*ForceX2_vec.x, TrialP_O.y-1.2*ForceX2_vec.y,TrialP_O.z-1.2*ForceX2_vec.z);   

  var intersect_x2_vec = new THREE.Vector3(ForceX2_temp.x-TrialP_O.x,ForceX2_temp.y-TrialP_O.y,ForceX2_temp.z-TrialP_O.z);
  var ForceX2 = Geo.Cal_Plane_Line_Intersect_Point(TrialP_O,intersect_x2_vec,ForceP_B,applyplanevec);

  var line_ox2 = [];
  line_ox2.push(TrialP_O);
  line_ox2.push(ForceX2);

  var line_ox2_geo = new THREE.BufferGeometry().setFromPoints( line_ox2 );
  var applylineox2 = new THREE.LineSegments(line_ox2_geo,applyline_1);
  applylineox2.computeLineDistances();//compute
  force_general_trial.add(applylineox2);

  //add x1 x2 arrow

  var x1_closeP1 = Geo.addVectorAlongDir(TrialP_O, ForceX1, -1);
  var x1_closeP2 = Geo.addVectorAlongDir(TrialP_O, ForceX1, -0.8);

  var x1_arrow = Geo.createCylinderArrowMesh(x1_closeP1,x1_closeP2,force_normal_material,0.012,0.025,0.55);

  force_general_trial.add(x1_arrow);

  var x2_closeP1 =  Geo.addVectorAlongDir(TrialP_O, ForceX2, -1);

  var x2_closeP2 = Geo.addVectorAlongDir(TrialP_O, ForceX2, -0.8);

  var x2_arrow = Geo.createCylinderArrowMesh(x2_closeP1,x2_closeP2,force_normal_material,0.012,0.025,0.55);

  force_general_trial.add(x2_arrow);

  //add x1 x2 sphere
  var materialpointx = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
                      
  var spforcePointx = new THREE.SphereGeometry(0.01);
  var new_forcePointx1 = new THREE.Mesh(spforcePointx, materialpointx);
  
  new_forcePointx1.position.copy(ForceX1);
  
  var outlineMaterialx = new THREE.MeshBasicMaterial( { color: "red", transparent: false, side: THREE.BackSide } );
  var outlineMeshnewx1 = new THREE.Mesh( spforcePointx, outlineMaterialx );
  outlineMeshnewx1.position.copy(ForceX1);
  outlineMeshnewx1.scale.multiplyScalar(1.55);

  force_general_trial.add(new_forcePointx1); 
  force_general_trial.add(outlineMeshnewx1); 

  var new_forcePointx2 = new THREE.Mesh(spforcePointx, materialpointx);
  
  new_forcePointx2.position.copy(ForceX2);
  
  var outlineMaterialx = new THREE.MeshBasicMaterial( { color: "red", transparent: false, side: THREE.BackSide } );
  var outlineMeshnewx2 = new THREE.Mesh( spforcePointx, outlineMaterialx );
  outlineMeshnewx2.position.copy(ForceX2);
  outlineMeshnewx2.scale.multiplyScalar(1.55);

  force_general_trial.add(new_forcePointx2); 
  force_general_trial.add(outlineMeshnewx2); 

  //draw x1o1, x2o2

  //find constrain point o1

  var ForceO1_temp = Geo.CalNormalVector(FormCP1,FormCP2,FormCP3,0.5);
  var ForceO1 = new THREE.Vector3(ForceX1.x-o1.l*ForceO1_temp.x, ForceX1.y-o1.l*ForceO1_temp.y,ForceX1.z-o1.l*ForceO1_temp.z);   

  var line_o1x1_temp = [];
  line_o1x1_temp.push(ForceX1);
  line_o1x1_temp.push(ForceO1);

  var line_o1x1_geo = new THREE.BufferGeometry().setFromPoints( line_o1x1_temp );

  var line_o1x1 = new THREE.LineSegments(line_o1x1_geo,applyline_1);
  line_o1x1.computeLineDistances();//compute
  force_general_trial.add(line_o1x1);

  //add o1 arrow

  var ForceO1_closeP1 = Geo.addVectorAlongDir(ForceO1, ForceX1, -0.6);
  var ForceO1_closeP2 = Geo.addVectorAlongDir(ForceO1, ForceX1, -0.4);

  var ForceO1_arrow = Geo.createCylinderArrowMesh(ForceO1_closeP1,ForceO1_closeP2,force_normal_material,0.012,0.025,0.55);

  force_general_trial.add(ForceO1_arrow);

  //find constrain point o2

  var ForceO2_temp = Geo.CalNormalVector(FormCP3,FormCP4,FormCP1,0.5);
  var ForceO2 = new THREE.Vector3(ForceX2.x-o2.l*ForceO2_temp.x, ForceX2.y-o2.l*ForceO2_temp.y,ForceX2.z-o2.l*ForceO2_temp.z);   

  var line_o2x2_temp = [];
  line_o2x2_temp.push(ForceX2);
  line_o2x2_temp.push(ForceO2);

  var line_o2x2_geo = new THREE.BufferGeometry().setFromPoints( line_o2x2_temp );

  var applyline_2 = new THREE.LineDashedMaterial({
    color: "black",//color
    dashSize: 0.2,
    gapSize: 0.03,
    linewidth: 1
  });

  var line_o2x2 = new THREE.LineSegments(line_o2x2_geo,applyline_2);
  line_o2x2.computeLineDistances();//compute
  force_general_trial.add(line_o2x2);

  //add o2 arrow

  var ForceO2_closeP1 = Geo.addVectorAlongDir(ForceO2, ForceX2, -0.6);
  var ForceO2_closeP2 = Geo.addVectorAlongDir(ForceO2, ForceX2, -0.4);

  var ForceO2_arrow = Geo.createCylinderArrowMesh(ForceO2_closeP1,ForceO2_closeP2,force_normal_material,0.012,0.025,0.55);

  force_general_trial.add(ForceO2_arrow);

  // ***********************          find force diagram            **************************
  var force_exfaces = Geo.ForceFace( ForceP_A,ForceP_B,ForceP_C,ForceP_D,ForceO1,ForceO2)
  force_group_f.add(force_exfaces);

  
  var corePoint_body2=new THREE.Vector3();

  corePoint_body2.x=(ForceP_A.x+ForceP_B.x+ForceP_C.x+ForceP_D.x+ForceO1.x+ForceO2.x)/6;
  corePoint_body2.y=(ForceP_A.y+ForceP_B.y+ForceP_C.y+ForceP_D.y+ForceO1.y+ForceO2.y)/6;
  corePoint_body2.z=(ForceP_A.z+ForceP_B.z+ForceP_C.z+ForceP_D.z+ForceO1.z+ForceO2.z)/6;

  function create_offset_point(point1,point2,point3,point4,scale){

    var centroid = new THREE.Vector3((point1.x+point2.x+point3.x+point4.x)/4,(point1.y+point2.y+point3.y+point4.y)/4,(point1.z+point2.z+point3.z+point4.z)/4);                              
    var scale_point = new THREE.Vector3(centroid.x + (point1.x - centroid.x)*scale, centroid.y + (point1.y - centroid.y)*scale, centroid.z + (point1.z - centroid.z)*scale );
    return scale_point
  }
  //cell ABCO2

  //point A
  var offset_FP_A = create_offset_point(ForceP_A,ForceP_B,ForceP_C,ForceO2,foffset.l)
  //point B
  var offset_FP_B = create_offset_point(ForceP_B,ForceP_A,ForceP_C,ForceO2,foffset.l)
  //point C
  var offset_FP_C = create_offset_point(ForceP_C,ForceP_A,ForceP_B,ForceO2,foffset.l)
  //point o2
  var offset_FP_O2 = create_offset_point(ForceO2,ForceP_A,ForceP_B,ForceP_C,foffset.l)

  var offset_FP_BA = new THREE.Vector3().subVectors(offset_FP_B, offset_FP_A);
  var offset_FP_CB=new THREE.Vector3().subVectors(offset_FP_C, offset_FP_B);
  var offset_FV1= Geo.cross(offset_FP_BA,offset_FP_CB);

   //var offset_force_ABC= Geo.create_Tri_FaceMesh(offset_FP_A,offset_FP_B,offset_FP_C,offset_FV1,true,TubePoints1[1].z,'n1')

  // force_cell.add(offset_force_ABC)

  var offset_FP_BO2 = new THREE.Vector3().subVectors(offset_FP_B, offset_FP_O2);
  var offset_FP_CB=new THREE.Vector3().subVectors(offset_FP_C, offset_FP_B);
  var offset_FV2= Geo.cross(offset_FP_CB,offset_FP_BO2);

  //var  offset_force_BCO2= Geo.create_Tri_FaceMesh(offset_FP_B,offset_FP_O2,offset_FP_C,offset_FV2,false,TubePoints1[1].z,'n1')

  //  force_cell.add(offset_force_BCO2)

  var offset_FP_BO2 = new THREE.Vector3().subVectors(offset_FP_O2, offset_FP_B);
  var offset_FP_AB=new THREE.Vector3().subVectors(offset_FP_B, offset_FP_A);
  var offset_FV3= Geo.cross(offset_FP_BO2,offset_FP_AB);

  //var offset_force_ABO2= Geo.create_Tri_FaceMesh(offset_FP_B,offset_FP_A,offset_FP_O2,offset_FV3,false,TubePoints1[1].z,'n1')

  //  force_cell.add(offset_force_ABO2)

  var offset_FP_AO2 = new THREE.Vector3().subVectors(offset_FP_O2, offset_FP_A);
  var offset_FP_AC=new THREE.Vector3().subVectors(offset_FP_A, offset_FP_C);
  var offset_FV4= Geo.cross(offset_FP_AO2,offset_FP_AC);

 // var offset_force_ACO2= Geo.create_Tri_FaceMesh(offset_FP_A,offset_FP_C,offset_FP_O2,offset_FV4,false,TubePoints1[1].z,'n1')

  //  force_cell.add(offset_force_ACO2)

  //cell ACDO1

  //point A
  var offset_FP_A2 = create_offset_point(ForceP_A,ForceP_C,ForceP_D,ForceO1,foffset.l)
  //point B
  var offset_FP_C2 = create_offset_point(ForceP_C,ForceP_A,ForceP_D,ForceO1,foffset.l)
  //point C
  var offset_FP_D2 = create_offset_point(ForceP_D,ForceP_A,ForceP_C,ForceO1,foffset.l)
  //point o2
  var offset_FP_O1 = create_offset_point(ForceO1,ForceP_A,ForceP_C,ForceP_D,foffset.l)

  var offset_FP_DA = new THREE.Vector3().subVectors(offset_FP_D2, offset_FP_A2);
  var offset_FP_CD=new THREE.Vector3().subVectors(offset_FP_C2, offset_FP_D2);
  var offset_FV12= Geo.cross(offset_FP_CD,offset_FP_DA);

  //var offset_force_ACD= Geo.create_Tri_FaceMesh(offset_FP_C2,offset_FP_D2,offset_FP_A2,offset_FV12,true,TubePoints1[1].z,'n1')

  // force_cell.add(offset_force_ACD)

  var offset_FP_DO1 = new THREE.Vector3().subVectors(offset_FP_D2, offset_FP_O1);
  var offset_FP_CD=new THREE.Vector3().subVectors(offset_FP_C2, offset_FP_D2);
  var offset_FV22= Geo.cross(offset_FP_DO1,offset_FP_CD);

  //var offset_force_CDO1= Geo.create_Tri_FaceMesh(offset_FP_C2,offset_FP_O1,offset_FP_D2,offset_FV22,false,TubePoints1[1].z,'n1')

  //  force_cell.add(offset_force_CDO1)

  var offset_FP_DO1 = new THREE.Vector3().subVectors(offset_FP_O1, offset_FP_D2);
  var offset_FP_AD=new THREE.Vector3().subVectors(offset_FP_D2, offset_FP_A2);
  var offset_FV32= Geo.cross(offset_FP_AD,offset_FP_DO1);

  //var offset_force_ADO1= Geo.create_Tri_FaceMesh(offset_FP_O1,offset_FP_A2,offset_FP_D2,offset_FV32,false,TubePoints1[1].z,'n1')

  //  force_cell.add(offset_force_ADO1)

  var offset_FP_AO1 = new THREE.Vector3().subVectors(offset_FP_O1, offset_FP_A2);
  var offset_FP_AC=new THREE.Vector3().subVectors(offset_FP_A2, offset_FP_C2);
  var offset_FV42= Geo.cross(offset_FP_AC,offset_FP_AO1);

 // var offset_force_ACO1= Geo.create_Tri_FaceMesh(offset_FP_O1,offset_FP_C2,offset_FP_A2,offset_FV42,false,TubePoints1[1].z,'n1')

  //  force_cell.add(offset_force_ACO1)


  //cell ACO1O2

  //point A
  var offset_FP_A3 = create_offset_point(ForceP_A,ForceP_C,ForceO2,ForceO1,foffset.l)
  //point B
  var offset_FP_C3 = create_offset_point(ForceP_C,ForceP_A,ForceO2,ForceO1,foffset.l)
  //point C
  var offset_FP_O22 = create_offset_point(ForceO2,ForceP_A,ForceP_C,ForceO1,foffset.l)
  //point o2
  var offset_FP_O12 = create_offset_point(ForceO1,ForceP_A,ForceP_C,ForceO1,foffset.l)

  var offset_FP_AC = new THREE.Vector3().subVectors(offset_FP_C3, offset_FP_A3);
  var offset_FP_CO2=new THREE.Vector3().subVectors(offset_FP_C3, offset_FP_O22);
  var offset_FV13= Geo.cross(offset_FP_AC,offset_FP_CO2);

  //offset_force_ACO2= Geo.create_Tri_FaceMesh(offset_FP_A3,offset_FP_O22,offset_FP_C3,offset_FV13,false,TubePoints1[1].z,'n1')

  //  force_cell.add(offset_force_ACO2)

  var offset_FP_CO1 = new THREE.Vector3().subVectors(offset_FP_C3, offset_FP_O12);
  var offset_FP_O1O2=new THREE.Vector3().subVectors(offset_FP_O12, offset_FP_O22);
  var offset_FV23= Geo.cross(offset_FP_O1O2,offset_FP_CO1);

  //var offset_force_CO1O2= Geo.create_Tri_FaceMesh(offset_FP_C3,offset_FP_O22,offset_FP_O12,offset_FV23,false,TubePoints1[1].z,'n1')

  // force_cell.add(offset_force_CO1O2)

  var offset_FP_AC = new THREE.Vector3().subVectors(offset_FP_C3, offset_FP_A3);
  var offset_FP_CO1=new THREE.Vector3().subVectors(offset_FP_O12, offset_FP_C3);
  var offset_FV33= Geo.cross(offset_FP_AC,offset_FP_CO1);

   //var offset_force_ACO1= Geo.create_Tri_FaceMesh(offset_FP_C3,offset_FP_O12,offset_FP_A3,offset_FV33,false,TubePoints1[1].z,'n1')

  //    force_cell.add(offset_force_ACO1)

  var offset_FP_AO2 = new THREE.Vector3().subVectors(offset_FP_A3, offset_FP_O22);
  var offset_FP_O1O2=new THREE.Vector3().subVectors(offset_FP_O12, offset_FP_O22);
  var offset_FV43= Geo.cross(offset_FP_AO2,offset_FP_O1O2);

  //var offset_force_AO1O2= Geo.create_Tri_FaceMesh(offset_FP_O12,offset_FP_O22,offset_FP_A3,offset_FV43,false,TubePoints1[1].z,'n1')

  // force_cell.add(offset_force_AO1O2)



  
  // ***********************         final form diagram            **************************
  // step1 : find nodeO2 (intersecting from CP3 & CP4)

  var formPoint3 =  Geo.CalNormalVector(ForceP_C,ForceO2,ForceP_B,0.5);
  var formPoint3end = new THREE.Vector3(FormCP3.x-1.2*formPoint3.x, FormCP3.y-1.2*formPoint3.y,FormCP3.z-1.2*formPoint3.z);  

  var formPoint4 =  Geo.CalNormalVector(ForceP_B,ForceO2,ForceP_A,0.5);
  var formPoint4end = new THREE.Vector3(FormCP4.x-1.2*formPoint4.x, FormCP4.y-1.2*formPoint4.y,FormCP4.z-1.2*formPoint4.z);  

  //Point o2
  var diro2 = new THREE.Vector3(); // create once an reuse it

  diro2.subVectors( FormCP3,formPoint3end  ).normalize();

  var diro22 = new THREE.Vector3(); // create once an reuse it

  diro22.subVectors(FormCP4,formPoint4end  ).normalize();
  var formPointO2 = Geo.LinesSectPt(diro2,FormCP3, diro22,FormCP4);

  var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

  var spformPointO2 = new THREE.SphereGeometry(0.04);
  var new_formPointO2 = new THREE.Mesh(spformPointO2, materialpointo);

  new_formPointO2.position.copy(formPointO2);
  new_formPointO2.castShadow=true;

  var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
  var outlineMeshnew1 = new THREE.Mesh( spformPointO2, outlineMaterial1 );
  outlineMeshnew1.position.copy(formPointO2);
  outlineMeshnew1.scale.multiplyScalar(1.55);

  form_group_v.add(new_formPointO2); 
  form_group_v.add(outlineMeshnew1); 

  // step2 : find nodeO1 (intersecting from CP1 & CP2)

  //Point o1
  var formPointo3 = Geo.CalNormalVector(ForceO1,ForceP_C,ForceO2,0.5);
  var formPointo3end = new THREE.Vector3(FormCP3.x-1.2*formPointo3.x, FormCP3.y-1.2*formPointo3.y,FormCP3.z-1.2*formPointo3.z);  


  var formPoint1 = Geo.CalNormalVector(ForceP_D,ForceO1,ForceP_A,0.5);
  var formPoint1end = new THREE.Vector3(FormCP1.x-1.2*formPoint1.x, FormCP1.y-1.2*formPoint1.y,FormCP1.z-1.2*formPoint1.z);  


  var formPoint2 = Geo.CalNormalVector(ForceP_C,ForceO1,ForceP_D,0.5);
  var formPoint2end = new THREE.Vector3(FormCP2.x-1.2*formPoint2.x, FormCP2.y-1.2*formPoint2.y,FormCP2.z-1.2*formPoint2.z);  

  var diro1 = new THREE.Vector3(); // create once an reuse it

  diro1.subVectors( FormCP1,formPoint1end  ).normalize();

  var diro12 = new THREE.Vector3(); // create once an reuse it

  diro12.subVectors( FormCP2,formPoint2end  ).normalize();
  var formPointO1 = Geo.LinesSectPt(diro1,FormCP1, diro12,FormCP2);

  var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

  var spformPointO1 = new THREE.SphereGeometry(0.04);
  var new_formPointO1 = new THREE.Mesh(spformPointO1, materialpointo);

  new_formPointO1.position.copy(formPointO1);
  new_formPointO1.castShadow=true;

  var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
  var outlineMeshnew2 = new THREE.Mesh( spformPointO1, outlineMaterial1 );
  outlineMeshnew2.position.copy(formPointO1);
  outlineMeshnew2.scale.multiplyScalar(1.55);

  form_group_v.add(new_formPointO1); 
  form_group_v.add(outlineMeshnew2); 

  // step3 : find nodeO3 (intersecting from o1 & o2)

                   
  var formPointo4 = Geo.CalNormalVector(ForceO1,ForceP_A,ForceO2,0.5);
  var formPointo4end = new THREE.Vector3(FormCP1.x-1.2*formPointo4.x, FormCP1.y-1.2*formPointo4.y,FormCP1.z-1.2*formPointo4.z);  

  var diro5 = new THREE.Vector3(); // create once an reuse it

  diro5.subVectors( FormCP3,formPointo3end  ).normalize();

  var diro52 = new THREE.Vector3(); // create once an reuse it

  diro52.subVectors( FormCP1,formPointo4end  ).normalize();
  var formPointO5 = Geo.LinesSectPt(diro5,FormCP3, diro52,FormCP1);

  var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

  var spformPointO3 = new THREE.SphereGeometry(0.04);
  var new_formPointO3 = new THREE.Mesh(spformPointO3, materialpointo);
 
  new_formPointO3.position.copy(formPointO5);
  new_formPointO3.castShadow=true;
 
     //Ctrl_tubes.push(sp_Tube0);
 
  var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
  var outlineMeshnew3 = new THREE.Mesh( spformPointO3, outlineMaterial1 );
  outlineMeshnew3.position.copy(formPointO5);
  outlineMeshnew3.scale.multiplyScalar(1.55);
 
  form_group_v.add(new_formPointO3); 
  form_group_v.add(outlineMeshnew3); 

  //step4: Cal areas

  var face_BCO2_area = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors( ForceP_B, ForceO2 ),
  new THREE.Vector3().subVectors( ForceP_C, ForceO2 ),
  ).length()/2

  var face_CO1O2_area = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors( ForceO1, ForceP_C ),
  new THREE.Vector3().subVectors( ForceO2, ForceP_C ),
  ).length()/2

  var face_CDO1_area = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors(ForceP_C, ForceO1 ),
  new THREE.Vector3().subVectors( ForceP_D, ForceO1 ),
  ).length()/2

  var face_ADO1_area = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors(ForceP_A, ForceO1 ),
  new THREE.Vector3().subVectors( ForceP_D, ForceO1 ),
  ).length()/2

  var face_AO1O2_area = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors( ForceO1, ForceP_A ),
  new THREE.Vector3().subVectors( ForceO2, ForceP_A ),
  ).length()/2

  var face_ABO2_area = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors( ForceP_B, ForceO2 ),
  new THREE.Vector3().subVectors( ForceP_A, ForceO2 ),
  ).length()/2

  var face_ACO1_area = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors( ForceP_C, ForceO1 ),
  new THREE.Vector3().subVectors( ForceP_A, ForceO1 ),
  ).length()/2

  var face_ACO2_area = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors( ForceP_C, ForceO2 ),
  new THREE.Vector3().subVectors( ForceP_A, ForceO2 ),
  ).length()/2


  var max = Math.max(face_BCO2_area, face_CO1O2_area, face_CDO1_area,face_ADO1_area, face_AO1O2_area,face_ABO2_area, face_ACO1_area,face_ACO2_area)

  var form_mesh_1 = create_form_tubes( face_BCO2_area,max,0.025,FormCP3,formPointO2,ForceO2);
  form_group_e.add(form_mesh_1)

  var form_mesh_2 = create_form_tubes( face_ABO2_area,max,0.025,FormCP4,formPointO2,ForceO2);
  form_group_e.add(form_mesh_2)

  var form_mesh_4 = create_form_tubes( face_CDO1_area,max,0.025,FormCP2,formPointO1,ForceO1);
  form_group_e.add(form_mesh_4)

  var form_mesh_5 = create_form_tubes( face_ADO1_area,max,0.025,FormCP1,formPointO1,ForceO1);
  form_group_e.add(form_mesh_5)

  var arrow_r=new THREE.MeshPhongMaterial( {color: 0x009600} );
  var arrow_r2=new THREE.MeshPhongMaterial( {color: 0x009600} );

  var arrow_r_outline = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
  var arrow_r2_outline = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );

// CO1O2

  var offset_CO1 = new THREE.Vector3().subVectors(ForceP_C, ForceO2);
  var offset_O1O2=new THREE.Vector3().subVectors(ForceO1, ForceO2);
  var Vec_CO1O2= Geo.cross(offset_O1O2,offset_CO1);
  Vec_CO1O2.normalize();

  var cen_CO1O2= Geo.face_center(ForceP_C,ForceO1,ForceO2);

  var arrow_start = new THREE.Vector3(cen_CO1O2.x - 0.3*Vec_CO1O2.x, cen_CO1O2.y - 0.3*Vec_CO1O2.y, cen_CO1O2.z - 0.3*Vec_CO1O2.z);
  

  var arr_comp=new THREE.MeshPhongMaterial( {color:  "black"} );

  //var arrow_CO1O2=createCylinderArrowMesh(arrow_start,cen_CO1O2,arr_comp,0.02,0.05,0.6);

  //add R arrow in form

  var arrow_vec = new THREE.Vector3(cen_CO1O2.x-arrow_start.x, cen_CO1O2.y-arrow_start.y,cen_CO1O2.z-arrow_start.z)
  arrow_vec.normalize();

  var arrow_start_form = new THREE.Vector3(FormCP3.x - 0.3*arrow_vec.x, FormCP3.y - 0.3*arrow_vec.y, FormCP3.z - 0.3*arrow_vec.z);

  var dis1a =  formPointO5.distanceTo( arrow_start_form );
  var dis1b =  formPointO5.distanceTo( FormCP3 );

  if (dis1a<dis1b){

      var arrow_end_form = new THREE.Vector3(FormCP3.x + 0.3*arrow_vec.x, FormCP3.y + 0.3*arrow_vec.y, FormCP3.z + 0.3*arrow_vec.z);
      var arrow_CO1O2_form=Geo.createCylinderArrowMesh(FormCP3,arrow_end_form,arrow_r,0.015,0.035,0.6);
      var arrow_CO1O2_formb=Geo.createCylinderArrowMesh(FormCP3,arrow_end_form,arrow_r_outline,0.02,0.035,0.57);
    
      form_general.add(arrow_CO1O2_form);
      form_general.add(arrow_CO1O2_formb);
  }

  if (dis1a>=dis1b){
      var arrow_CO1O2_form=Geo.createCylinderArrowMesh(arrow_start_form ,FormCP3,arrow_r,0.017,0.035,0.6);
      var arrow_CO1O2_formb=Geo.createCylinderArrowMesh(arrow_start_form ,FormCP3,arrow_r_outline,0.02,0.035,0.58);
      
      form_general.add(arrow_CO1O2_form);
      form_general.add(arrow_CO1O2_formb);
      
  }
  var form_mesh_3 = create_form_tubes_t( face_CO1O2_area,max,0.025,FormCP3,formPointO5);
  form_group_e.add(form_mesh_3)
  // AO1O2

  var offset_AO2 = new THREE.Vector3().subVectors(offset_FP_A3, offset_FP_O22);
  var offset_O1O2=new THREE.Vector3().subVectors(offset_FP_O12, offset_FP_O22);
  var Vec_AO1O2=Geo.cross(offset_AO2,offset_O1O2);
  Vec_AO1O2.normalize();

  var cen_AO1O2=Geo.face_center(ForceP_A,ForceO1,ForceO2);

  var arrow_start2 = new THREE.Vector3(cen_AO1O2.x - 0.3*Vec_AO1O2.x, cen_AO1O2.y - 0.3*Vec_AO1O2.y, cen_AO1O2.z - 0.3*Vec_AO1O2.z);
  
  var arr_comp=new THREE.MeshPhongMaterial( {color:  "black"} );
  
  var arrow_AO1O2=Geo.createCylinderArrowMesh(arrow_start2,cen_AO1O2,arr_comp,0.02,0.05,0.6);
  
  //   force_cell.add(arrow_AO1O2);

  //add R arrow in form

  var arrow_vec2 = new THREE.Vector3(cen_AO1O2.x-arrow_start2.x, cen_AO1O2.y-arrow_start2.y,cen_AO1O2.z-arrow_start2.z)
  arrow_vec2.normalize();

  var arrow_start_form2 = new THREE.Vector3(FormCP1.x - 0.3*arrow_vec2.x, FormCP1.y - 0.3*arrow_vec2.y, FormCP1.z - 0.3*arrow_vec2.z);

  var dis2a =  formPointO5.distanceTo( arrow_start_form2 );
  var dis2b =  formPointO5.distanceTo( FormCP1 );

  if (dis2a<dis2b){

      var arrow_end_form2 = new THREE.Vector3(FormCP1.x + 0.3*arrow_vec2.x, FormCP1.y + 0.3*arrow_vec2.y, FormCP1.z + 0.3*arrow_vec2.z);
      var arrow_AO1O2_form=Geo.createCylinderArrowMesh(FormCP1,arrow_end_form2,arrow_r,0.015,0.035,0.6);
      var arrow_AO1O2_formb=Geo.createCylinderArrowMesh(FormCP1,arrow_end_form2,arrow_r_outline,0.02,0.035,0.57);
   
      form_general.add(arrow_AO1O2_form);
      form_general.add(arrow_AO1O2_formb);
  }

  if (dis2a>=dis2b){
      var arrow_AO1O2_form=Geo.createCylinderArrowMesh(arrow_start_form2 ,FormCP1,arrow_r,0.015,0.035,0.6);
      var arrow_AO1O2_formb=Geo.createCylinderArrowMesh(arrow_start_form2 ,FormCP1,arrow_r_outline,0.02,0.035,0.57);
   
      form_general.add(arrow_AO1O2_form);
      form_general.add(arrow_AO1O2_formb);
      
  }

  var form_mesh_6 = create_form_tubes_t2( face_AO1O2_area,max,0.025,FormCP1,formPointO5);
  form_group_e.add(form_mesh_6)

  
  // ACO1

  var offset_AO1 = new THREE.Vector3().subVectors(offset_FP_O1, offset_FP_A2);
  var offset_AC=new THREE.Vector3().subVectors(offset_FP_A2, offset_FP_C2);
  var Vec_ACO1= Geo.cross(offset_AO1,offset_AC);
  Vec_ACO1.normalize();

  var cen_ACO1=Geo.face_center(ForceP_A,ForceO1,ForceP_C);

  var arrow_start6 = new THREE.Vector3(cen_ACO1.x - 0.3*Vec_ACO1.x, cen_ACO1.y - 0.3*Vec_ACO1.y, cen_ACO1.z - 0.3*Vec_ACO1.z);
  
  var arr_comp=new THREE.MeshPhongMaterial( {color:  "black"} );
  
  var arrow_ACO1=Geo.createCylinderArrowMesh(arrow_start6,cen_ACO1,arr_comp,0.02,0.05,0.6);
  
  //   force_cell.add(arrow_ACO1);

  //  add R arrow in form

  var arrow_vec6 = new THREE.Vector3(cen_ACO1.x-arrow_start6.x, cen_ACO1.y-arrow_start6.y,cen_ACO1.z-arrow_start6.z)
  arrow_vec6.normalize();

  var arrow_start_form6 = new THREE.Vector3(formPointO1.x - 0.3*arrow_vec6.x, formPointO1.y - 0.3*arrow_vec6.y, formPointO1.z - 0.3*arrow_vec6.z);

  var dis3a =  formPointO5.distanceTo( arrow_start_form6 );
  var dis3b =  formPointO5.distanceTo( formPointO1 );
  var form_mesh_7 = create_form_tubes_t3( face_ACO1_area,max,0.025,formPointO1,formPointO5,ForceO1);  
  form_group_e.add(form_mesh_7)

  // ACO2


  var offset_AO2 = new THREE.Vector3().subVectors(offset_FP_O2, offset_FP_A2);
  var offset_AC=new THREE.Vector3().subVectors(offset_FP_A2, offset_FP_C2);
  var Vec_ACO2=Geo.cross(offset_AC,offset_AO2);
  Vec_ACO2.normalize();

  var cen_ACO2=Geo.face_center(ForceP_A,ForceO2,ForceP_C);

  var arrow_start7 = new THREE.Vector3(cen_ACO2.x - 0.3*Vec_ACO2.x, cen_ACO2.y - 0.3*Vec_ACO2.y, cen_ACO2.z - 0.3*Vec_ACO2.z);
  
  var arr_comp=new THREE.MeshPhongMaterial( {color:  "black"} );
  
  var arrow_ACO2=Geo.createCylinderArrowMesh(arrow_start7,cen_ACO2,arr_comp,0.02,0.05,0.6);
  
  //  force_cell.add(arrow_ACO2);

  //  add R arrow in form

  var arrow_vec7 = new THREE.Vector3(cen_ACO2.x-arrow_start7.x, cen_ACO2.y-arrow_start7.y,cen_ACO2.z-arrow_start7.z)
  arrow_vec7.normalize();

  var arrow_start_form7 = new THREE.Vector3(formPointO2.x - 0.3*arrow_vec7.x, formPointO2.y - 0.3*arrow_vec7.y, formPointO2.z - 0.3*arrow_vec7.z);

  var dis4a =  formPointO5.distanceTo( arrow_start_form7 );
  var dis4b =  formPointO5.distanceTo( formPointO2 );

  var form_mesh_8 = create_form_tubes_t4( face_ACO2_area,max,0.025,formPointO2,formPointO5,ForceO1);   
  form_group_e.add(form_mesh_8)

   // add rest R arrow
            
  //CP1 O1

  var arrow_vec3 = new THREE.Vector3(formPointO1.x-FormCP1.x, formPointO1.y-FormCP1.y, formPointO1.z-FormCP1.z)
  arrow_vec3.normalize();

  var arrow_start_form3 = new THREE.Vector3(FormCP1.x - 0.3*arrow_vec3.x, FormCP1.y - 0.3*arrow_vec3.y, FormCP1.z - 0.3*arrow_vec3.z);
  if(ForceO1.z<=ForceP_B.z){
      var arrow_R_CP1O1=Geo.createCylinderArrowMesh(arrow_start_form3 ,FormCP1,arrow_r,0.015,0.035,0.6);
      var arrow_R_CP1O1b=Geo.createCylinderArrowMesh(arrow_start_form3 ,FormCP1,arrow_r_outline,0.02,0.035,0.57);
      }
  if(ForceO1.z>ForceP_B.z){
      var arrow_R_CP1O1=Geo.createCylinderArrowMesh(FormCP1,arrow_start_form3,arrow_r,0.015,0.035,0.6);
      var arrow_R_CP1O1b=Geo.createCylinderArrowMesh(FormCP1,arrow_start_form3,arrow_r_outline,0.02,0.035,0.57);
      }

  form_general.add(arrow_R_CP1O1);
  form_general.add(arrow_R_CP1O1b);

  //CP2 O1

  var arrow_vec4 = new THREE.Vector3(formPointO1.x-FormCP2.x, formPointO1.y-FormCP2.y, formPointO1.z-FormCP2.z)
  arrow_vec4.normalize();

  var arrow_start_form4 = new THREE.Vector3(FormCP2.x - 0.3*arrow_vec4.x, FormCP2.y - 0.3*arrow_vec4.y, FormCP2.z - 0.3*arrow_vec4.z);
  if(ForceO1.z<=ForceP_B.z){
      var arrow_R_CP2O1=Geo.createCylinderArrowMesh(arrow_start_form4 ,FormCP2,arrow_r,0.015,0.035,0.6);
      var arrow_R_CP2O1b=Geo.createCylinderArrowMesh(arrow_start_form4 ,FormCP2,arrow_r_outline,0.02,0.035,0.57);
     
      }
  if(ForceO1.z>ForceP_B.z){
      var arrow_R_CP2O1=Geo.createCylinderArrowMesh(FormCP2,arrow_start_form4,arrow_r,0.015,0.035,0.6);
      var arrow_R_CP2O1b=Geo.createCylinderArrowMesh(FormCP2,arrow_start_form4,arrow_r_outline,0.02,0.035,0.57);
 
      }

  form_general.add(arrow_R_CP2O1);
  form_general.add(arrow_R_CP2O1b);   

  //CP3 O2

  var arrow_vec5 = new THREE.Vector3(formPointO2.x-FormCP3.x, formPointO2.y-FormCP3.y, formPointO2.z-FormCP3.z)
  arrow_vec5.normalize();

  var arrow_start_form5 = new THREE.Vector3(FormCP3.x - 0.3*arrow_vec5.x, FormCP3.y - 0.3*arrow_vec5.y, FormCP3.z - 0.3*arrow_vec5.z);
  if(ForceO2.z<=ForceP_B.z){
      var arrow_R_CP3O2=Geo.createCylinderArrowMesh(arrow_start_form5 ,FormCP3,arrow_r,0.015,0.035,0.6);
      var arrow_R_CP3O2b=Geo.createCylinderArrowMesh(arrow_start_form5 ,FormCP3,arrow_r_outline,0.02,0.035,0.57);
     
      }
  if(ForceO2.z>ForceP_B.z){
      var arrow_R_CP3O2=Geo.createCylinderArrowMesh(FormCP3,arrow_start_form5,arrow_r,0.015,0.035,0.6);
      var arrow_R_CP3O2b=Geo.createCylinderArrowMesh(FormCP3,arrow_start_form5,arrow_r_outline,0.02,0.035,0.57);
   
      }

  form_general.add(arrow_R_CP3O2);
  form_general.add(arrow_R_CP3O2b);      

  //CP4 O2

  var arrow_vec8 = new THREE.Vector3(formPointO2.x-FormCP4.x, formPointO2.y-FormCP4.y, formPointO2.z-FormCP4.z)
  arrow_vec8.normalize();

  var arrow_start_form8 = new THREE.Vector3(FormCP4.x - 0.3*arrow_vec8.x, FormCP4.y - 0.3*arrow_vec8.y, FormCP4.z - 0.3*arrow_vec8.z);
  if(ForceO2.z<=ForceP_B.z){
      var arrow_R_CP4O2=Geo.createCylinderArrowMesh(arrow_start_form8 ,FormCP4,arrow_r,0.015,0.035,0.6);
      var arrow_R_CP4O2b=Geo.createCylinderArrowMesh(arrow_start_form8 ,FormCP4,arrow_r_outline,0.02,0.035,0.57);
  
      }
  if(ForceO2.z>ForceP_B.z){
      var arrow_R_CP4O2=Geo.createCylinderArrowMesh(FormCP4,arrow_start_form8,arrow_r,0.015,0.035,0.6);
      var arrow_R_CP4O2b=Geo.createCylinderArrowMesh(FormCP4,arrow_start_form8,arrow_r_outline,0.02,0.035,0.57);
   
      }

  form_general.add(arrow_R_CP4O2);
  form_general.add(arrow_R_CP4O2b);  

  // add force f1 arrow

  var f_arrow_1 = new THREE.Vector3((ForceP_A.x+ForceP_C.x+ForceP_D.x)/3,(ForceP_A.y+ForceP_C.y+ForceP_D.y)/3,(ForceP_A.z+ForceP_C.z+ForceP_D.z)/3);
  var f_arrow_1_a = new THREE.Vector3(f_arrow_1.x,f_arrow_1.y,f_arrow_1.z+0.3)
  var f_arrow_1_b = new THREE.Vector3(f_arrow_1.x,f_arrow_1.y,f_arrow_1.z-0.3)

  if(ForceO1.z>ForceP_B.z){
  var f_arrow1 =  Geo.createCylinderArrowMesh(f_arrow_1,f_arrow_1_b,arrow_r,0.015,0.035,0.6);
  var f_arrow1b = Geo.createCylinderArrowMesh(f_arrow_1,f_arrow_1_b,arrow_r_outline,0.02,0.035,0.58);

  force_general.add(f_arrow1);
  force_general.add(f_arrow1b);
  }

  if(ForceO1.z<=ForceP_B.z){
  var f_arrow1 =  Geo.createCylinderArrowMesh(f_arrow_1_a,f_arrow_1,arrow_r2,0.015,0.035,0.6);
  var f_arrow1b = Geo.createCylinderArrowMesh(f_arrow_1_a,f_arrow_1,arrow_r2_outline,0.02,0.035,0.58);

  force_general.add(f_arrow1);
  force_general.add(f_arrow1b);

  }
  // add force f2 arrow

  var f_arrow_2 = new THREE.Vector3((ForceP_A.x+ForceP_C.x+ForceP_B.x)/3,(ForceP_A.y+ForceP_C.y+ForceP_B.y)/3,(ForceP_A.z+ForceP_C.z+ForceP_B.z)/3);
  var f_arrow_2_a = new THREE.Vector3(f_arrow_2.x,f_arrow_2.y,f_arrow_2.z+0.3)
  var f_arrow_2_b = new THREE.Vector3(f_arrow_2.x,f_arrow_2.y,f_arrow_2.z-0.3)

  if(ForceO2.z>ForceP_B.z){
  var f_arrow2 =  Geo.createCylinderArrowMesh(f_arrow_2,f_arrow_2_b,arrow_r2,0.015,0.035,0.6);
  var f_arrow2b = Geo.createCylinderArrowMesh(f_arrow_2,f_arrow_2_b,arrow_r2_outline,0.02,0.035,0.58);


  force_general.add(f_arrow2);
  force_general.add(f_arrow2b);
  }

  if(ForceO2.z<=ForceP_B.z){
  var f_arrow2 =  Geo.createCylinderArrowMesh(f_arrow_2_a,f_arrow_2,arrow_r2,0.015,0.035,0.6);
  var f_arrow2b = Geo.createCylinderArrowMesh(f_arrow_2_a,f_arrow_2,arrow_r2_outline,0.02,0.035,0.58);


  force_general.add(f_arrow2);
  force_general.add(f_arrow2b);
  }



  function create_form_tubes(face_area,face_area_max,scale,startPoint,targetPoint,PointO){
    var form_group = new THREE.Group();
    var form_mesh = face_area/face_area_max
    var tt = scale*face_area
   
    var Close_Point = Geo.addVectorAlongDir(startPoint, targetPoint, -0.11);
    var Close_Point2 = Geo.addVectorAlongDir(targetPoint, startPoint, -0.11);

    // var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x,targetPoint.y,targetPoint.z),0.1);
    // var Close_Point = Sphere_Point.clampPoint(startPoint);

    // var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x,startPoint.y,startPoint.z),0.1);
    // var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


    if (PointO.z<=ForceP_A.z){

            if (form_mesh<0.25 & form_mesh>=0)
              { var Colorbar_blue_1 = new THREE.MeshPhongMaterial( {
                                  color: 0x5B84AE
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_1,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
                            }
            if (form_mesh<0.5 & form_mesh>=0.25)
            {  var Colorbar_blue_2 = new THREE.MeshPhongMaterial( {
                                  color: 0x376D9B
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_2,tt,tt);
            // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
                            }
            if (form_mesh<0.75 & form_mesh>=0.5)
            {  var Colorbar_blue_3 = new THREE.MeshPhongMaterial( {
                                  color: 0x05416D
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_3,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh>=0.75)
            {  var Colorbar_blue_4 = new THREE.MeshPhongMaterial( {
                                  color: 0x0F3150
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_4,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesh); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesh.castShadow=true;

    }

   else if(PointO.z>ForceP_A.z){

        if (form_mesh<0.25 & form_mesh>=0)
        { var Colorbar_red_1 = new THREE.MeshPhongMaterial( {
                             color: 0xD72F62
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_1,tt,tt);
             //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
                       }
       if (form_mesh<0.5 & form_mesh>=0.25)
       {  var Colorbar_red_2 = new THREE.MeshPhongMaterial( {
                             color: 0xCC0549
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_2,tt,tt);
              //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
                       }
       if (form_mesh<0.75 & form_mesh>=0.5)
       {  var Colorbar_red_3 = new THREE.MeshPhongMaterial( {
                             color: 0x940041
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_3,tt,tt);
             //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
       }

       if (form_mesh>=0.75)
       {  var Colorbar_red_4 = new THREE.MeshPhongMaterial( {
                             color: 0x80002F
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_4,tt,tt);
        //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
       }
       form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesht); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesht.castShadow=true;
                             
                       }

                       return form_group



  }

  function create_form_tubes_t(face_area,face_area_max,scale,startPoint,targetPoint){
    var form_group = new THREE.Group();
    var form_mesh = face_area/face_area_max
    var tt = scale*face_area
   
    var Close_Point = Geo.addVectorAlongDir(startPoint, targetPoint, -0.11);
    var Close_Point2 = Geo.addVectorAlongDir(targetPoint, startPoint, -0.11);


    if (dis1a>=dis1b){

            if (form_mesh<0.25 & form_mesh>=0)
              { var Colorbar_blue_1 = new THREE.MeshPhongMaterial( {
                                  color: 0x5B84AE
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_1,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
                            }
            if (form_mesh<0.5 & form_mesh>=0.25)
            {  var Colorbar_blue_2 = new THREE.MeshPhongMaterial( {
                                  color: 0x376D9B
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_2,tt,tt);
            // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
                            }
            if (form_mesh<0.75 & form_mesh>=0.5)
            {  var Colorbar_blue_3 = new THREE.MeshPhongMaterial( {
                                  color: 0x05416D
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_3,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh>=0.75)
            {  var Colorbar_blue_4 = new THREE.MeshPhongMaterial( {
                                  color: 0x0F3150
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_4,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesh); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesh.castShadow=true;

    }

   if(dis1a<dis1b){

        if (form_mesh<0.25 & form_mesh>=0)
        { var Colorbar_red_1 = new THREE.MeshPhongMaterial( {
                             color: 0xD72F62
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_1,tt,tt);
             //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
                       }
       if (form_mesh<0.5 & form_mesh>=0.25)
       {  var Colorbar_red_2 = new THREE.MeshPhongMaterial( {
                             color: 0xCC0549
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_2,tt,tt);
              //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
                       }
       if (form_mesh<0.75 & form_mesh>=0.5)
       {  var Colorbar_red_3 = new THREE.MeshPhongMaterial( {
                             color: 0x940041
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_3,tt,tt);
             //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
       }

       if (form_mesh>=0.75)
       {  var Colorbar_red_4 = new THREE.MeshPhongMaterial( {
                             color: 0x80002F
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_4,tt,tt);
        //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
       }
       form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesht); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesht.castShadow=true;
                             
                       }
  return  form_group


  }

  function create_form_tubes_t2(face_area,face_area_max,scale,startPoint,targetPoint){
    var form_group = new THREE.Group();
    var form_mesh = face_area/face_area_max
    var tt = scale*face_area
   
    var Close_Point = Geo.addVectorAlongDir(startPoint, targetPoint, -0.11);
    var Close_Point2 = Geo.addVectorAlongDir(targetPoint, startPoint, -0.11);


    if (dis2a>=dis2b){

            if (form_mesh<0.25 & form_mesh>=0)
              { var Colorbar_blue_1 = new THREE.MeshPhongMaterial( {
                                  color: 0x5B84AE
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh= Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_1,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
                            }
            if (form_mesh<0.5 & form_mesh>=0.25)
            {  var Colorbar_blue_2 = new THREE.MeshPhongMaterial( {
                                  color: 0x376D9B
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_2,tt,tt);
            // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
                            }
            if (form_mesh<0.75 & form_mesh>=0.5)
            {  var Colorbar_blue_3 = new THREE.MeshPhongMaterial( {
                                  color: 0x05416D
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_3,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh>=0.75)
            {  var Colorbar_blue_4 = new THREE.MeshPhongMaterial( {
                                  color: 0x0F3150
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_4,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesh); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesh.castShadow=true;

    }

   if(dis2a<dis2b){

        if (form_mesh<0.25 & form_mesh>=0)
        { var Colorbar_red_1 = new THREE.MeshPhongMaterial( {
                             color: 0xD72F62
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_1,tt,tt);
             //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
                       }
       if (form_mesh<0.5 & form_mesh>=0.25)
       {  var Colorbar_red_2 = new THREE.MeshPhongMaterial( {
                             color: 0xCC0549
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_2,tt,tt);
              //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
                       }
       if (form_mesh<0.75 & form_mesh>=0.5)
       {  var Colorbar_red_3 = new THREE.MeshPhongMaterial( {
                             color: 0x940041
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_3,tt,tt);
             //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
       }

       if (form_mesh>=0.75)
       {  var Colorbar_red_4 = new THREE.MeshPhongMaterial( {
                             color: 0x80002F
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_4,tt,tt);
        //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
       }
       form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesht); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesht.castShadow=true;
                             
                       }
return form_group


  }

  function create_form_tubes_t3(face_area,face_area_max,scale,startPoint,targetPoint){
    var form_group = new THREE.Group();
    var form_mesh = face_area/face_area_max
    var tt = scale*face_area
   
    var Close_Point = Geo.addVectorAlongDir(startPoint, targetPoint, -0.11);
    var Close_Point2 = Geo.addVectorAlongDir(targetPoint, startPoint, -0.11);

    if (dis3a>=dis3b){

            if (form_mesh<0.25 & form_mesh>=0)
              { var Colorbar_blue_1 = new THREE.MeshPhongMaterial( {
                                  color: 0x5B84AE
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_1,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
                            }
            if (form_mesh<0.5 & form_mesh>=0.25)
            {  var Colorbar_blue_2 = new THREE.MeshPhongMaterial( {
                                  color: 0x376D9B
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_2,tt,tt);
            // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
                            }
            if (form_mesh<0.75 & form_mesh>=0.5)
            {  var Colorbar_blue_3 = new THREE.MeshPhongMaterial( {
                                  color: 0x05416D
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_3,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh>=0.75)
            {  var Colorbar_blue_4 = new THREE.MeshPhongMaterial( {
                                  color: 0x0F3150
                              } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_4,tt,tt);
             //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesh); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesh.castShadow=true;

    }

   if(dis3a<dis3b){

        if (form_mesh<0.25 & form_mesh>=0)
        { var Colorbar_red_1 = new THREE.MeshPhongMaterial( {
                             color: 0xD72F62
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_1,tt,tt);
             //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
                       }
       if (form_mesh<0.5 & form_mesh>=0.25)
       {  var Colorbar_red_2 = new THREE.MeshPhongMaterial( {
                             color: 0xCC0549
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_2,tt,tt);
              //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
                       }
       if (form_mesh<0.75 & form_mesh>=0.5)
       {  var Colorbar_red_3 = new THREE.MeshPhongMaterial( {
                             color: 0x940041
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_3,tt,tt);
             //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
       }

       if (form_mesh>=0.75)
       {  var Colorbar_red_4 = new THREE.MeshPhongMaterial( {
                             color: 0x80002F
                         } );
             var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
             var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
             var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
             sp_Point.position.copy(Close_Point);
             sp_Point2.position.copy(Close_Point2);
             var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_4,tt,tt);
        //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
       }
       form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesht); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesht.castShadow=true;
                             
                       }

return form_group

  }

  function create_form_tubes_t4(face_area,face_area_max,scale,startPoint,targetPoint){
    var form_group = new THREE.Group();
    var form_mesh = face_area/face_area_max
    var tt = scale*face_area
   
    var Close_Point = Geo.addVectorAlongDir(startPoint, targetPoint, -0.11);
    var Close_Point2 = Geo.addVectorAlongDir(targetPoint, startPoint, -0.11);



    if (dis4a>=dis4b){

            if (form_mesh<0.25 & form_mesh>=0)
              { var Colorbar_blue_1 = new THREE.MeshPhongMaterial( {
                                  color: 0x5B84AE
                              } );
              var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
              var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
              var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
              sp_Point.position.copy(Close_Point);
              sp_Point2.position.copy(Close_Point2);
              var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_1,tt,tt);
              //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
                            }
            if (form_mesh<0.5 & form_mesh>=0.25)
            {  var Colorbar_blue_2 = new THREE.MeshPhongMaterial( {
                                  color: 0x376D9B
                              } );
              var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
              var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
              var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
              sp_Point.position.copy(Close_Point);
              sp_Point2.position.copy(Close_Point2);
              var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_2,tt,tt);
            // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
                            }
            if (form_mesh<0.75 & form_mesh>=0.5)
            {  var Colorbar_blue_3 = new THREE.MeshPhongMaterial( {
                                  color: 0x05416D
                              } );
              var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
              var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
              var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
              sp_Point.position.copy(Close_Point);
              sp_Point2.position.copy(Close_Point2);
              var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_3,tt,tt);
              //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh>=0.75)
            {  var Colorbar_blue_4 = new THREE.MeshPhongMaterial( {
                                  color: 0x0F3150
                              } );
              var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
              var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
              var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
              sp_Point.position.copy(Close_Point);
              sp_Point2.position.copy(Close_Point2);
              var tubeMesh=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_4,tt,tt);
              //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesh); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesh.castShadow=true;

    }

    if(dis4a<dis4b){

        if (form_mesh<0.25 & form_mesh>=0)
        { var Colorbar_red_1 = new THREE.MeshPhongMaterial( {
                              color: 0xD72F62
                          } );
              var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
              var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
              var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
              sp_Point.position.copy(Close_Point);
              sp_Point2.position.copy(Close_Point2);
              var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_1,tt,tt);
              //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
                        }
        if (form_mesh<0.5 & form_mesh>=0.25)
        {  var Colorbar_red_2 = new THREE.MeshPhongMaterial( {
                              color: 0xCC0549
                          } );
              var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
              var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
              var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
              sp_Point.position.copy(Close_Point);
              sp_Point2.position.copy(Close_Point2);
              var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_2,tt,tt);
              //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
                        }
        if (form_mesh<0.75 & form_mesh>=0.5)
        {  var Colorbar_red_3 = new THREE.MeshPhongMaterial( {
                              color: 0x940041
                          } );
              var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
              var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
              var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
              sp_Point.position.copy(Close_Point);
              sp_Point2.position.copy(Close_Point2);
              var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_3,tt,tt);
              //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
        }

        if (form_mesh>=0.75)
        {  var Colorbar_red_4 = new THREE.MeshPhongMaterial( {
                              color: 0x80002F
                          } );
              var spGeom_Point = new THREE.SphereGeometry(tt-0.001);
              var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
              var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
              sp_Point.position.copy(Close_Point);
              sp_Point2.position.copy(Close_Point2);
              var tubeMesht=Geo.createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_4,tt,tt);
        //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
        }
        form_group.add(sp_Point); 
        form_group.add(sp_Point2);
        form_group.add(tubeMesht); 
        // form_group.add(tube_arrow_3o2); 
        sp_Point.castShadow=true;
        sp_Point2.castShadow=true;
        tubeMesht.castShadow=true;
                              
                        }
return form_group


  }
  // // *********************** form vertices **************************
  // // set basic points in form diagram (one top, one mid (0,0,0), three bottoms)
  // // 1st. mid point
  // const vertice_0 = Geo.addVertice(0.05, "sp0", new THREE.Vector3(0,0,0));
  // const vertice_0_out = Geo.addVerticeOut(0.05, new THREE.Vector3(0,0,0), 1.55)
  // form_group_v.add(vertice_0);
  // form_group_v.add(vertice_0_out);

  // //2nd. bottom point (movable) - bottom vertice 1
  // const vertice_1 = Geo.addVertice(0.04, "sp1", formBtPt1[1])
  // Ctrl_pts.push(vertice_1); //adding to gumbal selection
  // const vertice_1_out = Geo.addVerticeOut(0.04, vertice_1.position, 1.55);

  // form_group_v.add(vertice_1);
  // form_group_v.add(vertice_1_out);

  // //3rd. bottom point (movable) - bottom vertice 2
  // const vertice_2 = Geo.addVertice(0.04, "sp2", formBtPt2[1])
  // Ctrl_pts.push(vertice_2); //adding to gumbal selection
  // const vertice_2_out = Geo.addVerticeOut(0.04, vertice_2.position, 1.55);

  // form_group_v.add(vertice_2);
  // form_group_v.add(vertice_2_out);

  // //4th. bottom point (movable) - bottom vertice 3
  // const vertice_3 = Geo.addVertice(0.04, "sp3", formBtPt3[1])
  // Ctrl_pts.push(vertice_3); //adding to gumbal selection
  // const vertice_3_out = Geo.addVerticeOut(0.04, vertice_3.position, 1.55);
  // form_group_v.add(vertice_3);
  // form_group_v.add(vertice_3_out);

  // // *********************** form faces **************************

  // //face 1, 2, 3 - green color
  // const formFace_1 = Geo.FormFace3ptGN(formTpPt[0], formTpPt[1], formBtPt1[1]);
  // const formFace_2 = Geo.FormFace3ptGN(formTpPt[0], formTpPt[1], formBtPt2[1]);
  // const formFace_3 = Geo.FormFace3ptGN(formTpPt[0], formTpPt[1], formBtPt3[1]);

  // //face 4, 5, 6 - grey color
  // const formFace_4 = Geo.FormFace3ptGR(formTpPt[0], formBtPt1[1], formBtPt2[1]);
  // const formFace_5 = Geo.FormFace3ptGR(formTpPt[0], formBtPt2[1], formBtPt3[1]);
  // const formFace_6 = Geo.FormFace3ptGR(formTpPt[0], formBtPt3[1], formBtPt1[1]);

  // form_group_f.add(formFace_1);
  // form_group_f.add(formFace_2);
  // form_group_f.add(formFace_3);

  // form_group_f.add(formFace_4);
  // form_group_f.add(formFace_5);
  // form_group_f.add(formFace_6);

  // // *********************** form cells **************************
  // const formCell1 = Geo.addCell3Face(formTpPt[0], formTpPt[1], formBtPt1[1], formBtPt2[1], 0.8)
  // form_group_c.add(formCell1);

  // const formCell2 = Geo.addCell3Face(formTpPt[0], formTpPt[1], formBtPt2[1], formBtPt3[1], 0.8)
  // form_group_c.add(formCell2);

  // const formCell3 = Geo.addCell3Face(formTpPt[0], formTpPt[1], formBtPt1[1], formBtPt3[1], 0.8)
  // form_group_c.add(formCell3);

  // const formCell4 = Geo.addCell3Face(formTpPt[0], formBtPt1[1], formBtPt2[1], formBtPt3[1],0.8)
  // form_group_c.add(formCell4);

  // // *********************** form apply loads dash lines **************************
  // const dashline = Geo.dashLinesGR(formTpPt[0], formTpPt[1], 0.008, 0.01, 1.02);
  // form_general.add(dashline);

  // // *********************** form apply loads arrow **************************
  // var applyArrowMaterial=new THREE.MeshPhongMaterial( {
  //   color:  0x009600//green
  // } );

  // var applyArrowMaterialOut=new THREE.MeshPhongMaterial( {
  //   color:  "white",
  //   transparent: false, 
  //   side: THREE.BackSide
  // } );
  // const applyArrow = Geo.createCylinderArrowMesh(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.3), formTpPt[1], applyArrowMaterial, 0.015,0.035,0.55);
  // form_general.add(applyArrow);

  // const applyArrowOut = Geo.createCylinderArrowMesh(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.3), formTpPt[1], applyArrowMaterialOut, 0.02,0.04,0.545);
  // form_general.add(applyArrowOut);

  // // *********************** force diagram ***********************
  // // *********************** force points ***********************
  // var edgescale = 2; // size of the force diagram

  // //PtA and PtB
  // var forcePtA = new THREE.Vector3(0.5, 0, 0)
  // var forcePtBtemp = Geo.CalNormalVector(formTpPt[0], formTpPt[1], formBtPt1[1], edgescale );
  // var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

  // //PtC
  // var forcePtC1temp = Geo.CalNormalVector(formTpPt[0], formTpPt[1], formBtPt2[1], edgescale );
  // var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);

  // var forcePtC2temp = Geo.CalNormalVector(formTpPt[0], formTpPt[1], formBtPt3[1], edgescale );
  // var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);

  // var dirBC = new THREE.Vector3(); // create once an reuse it

  // dirBC.subVectors(forcePtB, forcePtC1).normalize();

  // var dirAC = new THREE.Vector3(); // create once an reuse it

  // dirAC.subVectors(forcePtC2, forcePtA).normalize();
  // var forcePtC = Geo.LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

  // //PtD
  // var forcePtD1temp = Geo.CalNormalVector(formTpPt[0], formBtPt1[1], formBtPt3[1], edgescale );
  // var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

  // var forcePtD2temp = Geo.CalNormalVector(formTpPt[0], formBtPt2[1], formBtPt1[1], edgescale );
  // var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);

  // var dirAD= new THREE.Vector3(); // create once an reuse it

  // dirAD.subVectors(forcePtA, forcePtD1).normalize();

  // var dirBD = new THREE.Vector3(); // create once an reuse it

  // dirBD.subVectors(forcePtD2, forcePtB).normalize();
  // var forcePtD = Geo.LinesSectPt(dirAD, forcePtA, dirBD, forcePtB);

  // // *********************** caculating the areas of triangles (from the four points) *********************** 
  // var areaABD = Geo.create_force_face_area(forcePtA,forcePtB,forcePtD);
  // var areaBCD = Geo.create_force_face_area(forcePtB,forcePtC,forcePtD);
  // var areaACD = Geo.create_force_face_area(forcePtA,forcePtC,forcePtD);

  // // *********************** caculating the normals for each triangle *********************** 

  // // ****** caculating normals *******
  // // A = p2 - p1, B = p3 - p1
  // // Nx = Ay * Bz - Az * By
  // // Ny = Az * Bx - Ax * Bz
  // // Nz = Ax * By - Ay * Bx
  // // ******

  // // triangle ABD 
  // var normalABD_a = Geo.subVec(forcePtB, forcePtA)
  // var normalABD_b = Geo.subVec(forcePtD, forcePtA)
  // var normalABD = Geo.cross(normalABD_a, normalABD_b)

  // var edgeVector1 = Geo.subVec(formTpPt[0], formBtPt1[1]);

  // // triangle BCD 
  // var normalBCD_a = Geo.subVec(forcePtC, forcePtB)
  // var normalBCD_b = Geo.subVec(forcePtD, forcePtB)
  // var normalBCD = Geo.cross(normalBCD_a, normalBCD_b)

  // var edgeVector2 = Geo.subVec(formTpPt[0], formBtPt2[1]);

  // // triangle ACD 
  // var normalCAD_a = Geo.subVec(forcePtA, forcePtC)
  // var normalCAD_b = Geo.subVec(forcePtD, forcePtC)
  // var normalCAD = Geo.cross(normalCAD_a, normalCAD_b)

  // var edgeVector3 = Geo.subVec(formTpPt[0], formBtPt3[1]);

  // // *********************** force cells **************************
  // const forceCell = Geo.addCell4Face(forcePtD, forcePtA, forcePtB, forcePtC, forceCellScale )
  // force_group_c.add(forceCell);
  // force_group_c.traverse(function(obj) {
  //   if (obj.type === "Mesh") {
  //     obj.material.visible =false;
  //   }
  //   });
  // //console.log(forceCellScale)

  // //testing the force edges
  // var edgeSize = 0.02;
  // var edgeColor = "lightgrey";

  // var forceEdgeMaterial=new THREE.MeshPhongMaterial( {
  //   color:  edgeColor
  // } );
  
  // const forceEdgeAB = Geo.createCylinderMesh(forcePtA,forcePtB,forceEdgeMaterial,edgeSize,edgeSize);

  // force_group_e.add(forceEdgeAB);
  
  // const forceEdgeAC = Geo.createCylinderMesh(forcePtA,forcePtC,forceEdgeMaterial,edgeSize,edgeSize);

  // force_group_e.add(forceEdgeAC);

  // const forceEdgeBC = Geo.createCylinderMesh(forcePtB,forcePtC,forceEdgeMaterial,edgeSize,edgeSize);

  // force_group_e.add(forceEdgeBC)

  // const forceEdgeAD = Geo.createCylinderMesh(forcePtA,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);

  // force_group_e.add(forceEdgeAD)

  // const forceEdgeBD = Geo.createCylinderMesh(forcePtB,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);

  // force_group_e.add(forceEdgeBD)

  // const forceEdgeCD = Geo.createCylinderMesh(forcePtC,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);

  // force_group_e.add(forceEdgeCD)

  // scene2.add(force_group_v);
  // scene2.add(force_group_f);
  // scene2.add(force_group_e);
  // scene2.add(force_group_c);
  // scene2.add(force_general);

  // // *********************** form edges **************************

  // //var edgeSize = 0.04;
  // var edgeSize1 = areaABD * 0.05;
  // var edgeSize2 = areaBCD * 0.05;
  // var edgeSize3 = areaACD * 0.05;
  // //var edgeColor = 0x054c92;

  // var formedgeColor1, formedgeColor2, formedgeColor3
  // var result1 = normalABD.dot(edgeVector1)
  // var result2 = normalBCD.dot(edgeVector2)
  // var result3 = normalCAD.dot(edgeVector3)
 
  // if (result1 < 0){
  //   formedgeColor1 = 'blue';
  // } else{
  //   formedgeColor1 = 'red';
  // }
  // var formEdge1Material=new THREE.MeshPhongMaterial( { 
  //   color:  formedgeColor1
  // } );

  // if (result2 < 0){
  //   formedgeColor2 = 'blue';
  // } else{
  //   formedgeColor2 = 'red';
  // }
  // var formEdge2Material=new THREE.MeshPhongMaterial( { 
  //   color:  formedgeColor2
  // } );

  // if (result3 < 0){
  //   formedgeColor3 = 'blue';
  // } else{
  //   formedgeColor3 = 'red';
  // }
  // var formEdge3Material=new THREE.MeshPhongMaterial( { 
  //   color:  formedgeColor3
  // } );

  // //create end sphere for bottom vertice 1
  // const endPtVertice1SpV = Geo.addVectorAlongDir(formBtPt1[1], formTpPt[0], -0.14);
  // const endPtVertice1Sp = Geo.addEdgeSphere(edgeSize1, endPtVertice1SpV, formedgeColor1)
  // //create edge bottom vertice 1
  // const endPtVertice1 = Geo.addVectorAlongDir(formTpPt[0],formBtPt1[1],  -0.1);
  // const formEdge1 = Geo.createCylinderMesh(endPtVertice1SpV,endPtVertice1,formEdge1Material,edgeSize1,edgeSize1);

  // form_group_e.add(endPtVertice1Sp)
  // form_group_e.add(formEdge1)

  // //create end sphere for bottom vertice 2
  // const endPtVertice2SpV = Geo.addVectorAlongDir(formBtPt2[1], formTpPt[0], -0.14);
  // const endPtVertice2Sp = Geo.addEdgeSphere(edgeSize2, endPtVertice2SpV, formedgeColor2)
  // //create edge bottom vertice 2
  // const endPtVertice2 = Geo.addVectorAlongDir(formTpPt[0],formBtPt2[1],  -0.1);
  // const formEdge2 = Geo.createCylinderMesh(endPtVertice2SpV,endPtVertice2,formEdge2Material,edgeSize2,edgeSize2);

  // form_group_e.add(endPtVertice2Sp)
  // form_group_e.add(formEdge2)

  // //create end sphere for bottom vertice 3
  // const endPtVertice3SpV = Geo.addVectorAlongDir(formBtPt3[1], formTpPt[0], -0.14);
  // const endPtVertice3Sp = Geo.addEdgeSphere(edgeSize3, endPtVertice3SpV, formedgeColor3)
  // //create edge bottom vertice 3
  // const endPtVertice3 = Geo.addVectorAlongDir(formTpPt[0],formBtPt3[1],  -0.1);
  // const formEdge3 = Geo.createCylinderMesh(endPtVertice3SpV,endPtVertice3,formEdge3Material,edgeSize3,edgeSize3);

  // form_group_e.add(endPtVertice3Sp)
  // form_group_e.add(formEdge3)


  scene.add(form_group_v);
  scene.add(form_group_f);
  scene.add(form_group_e);
  scene.add(form_group_c);
  scene.add(form_general);
  scene.add(form_group_e_trial);
  scene.add(form_general_trial);

  scene2.add(force_group_v);
  scene2.add(force_group_f);
  scene2.add(force_group_e);
  scene2.add(force_group_c);
  scene2.add(force_general);
  scene2.add(force_group_f_trial);
  scene2.add(force_general_trial);
}










function initModel() {
  Redraw();
  // trfm_ctrl = new TransformControls(camera, renderer.domElement);

  // trfm_ctrl.addEventListener('change', render);
  // trfm_ctrl.addEventListener('objectChange', function(e) {
  //   if(Math.abs(selectObj.position.x) <= 2 && Math.abs(selectObj.position.y)<=2 && Math.abs(selectObj.position.z) <= 2)
  //   {
  //     if(selectObj.name.charAt(2)==='1')
  //     {
  //       TrialP_O.x=selectObj.position.x;
  //       TrialP_O.y=selectObj.position.y;
  //       TrialP_O.z=selectObj.position.z;
  //     }

  //     if(selectObj.name.charAt(2)==='2')
  //     {
  //       formBtPt2[1].x=selectObj.position.x;
  //       formBtPt2[1].y=selectObj.position.y;
  //       formBtPt2[1].z=selectObj.position.z;
  //     }

  //     if(selectObj.name.charAt(2)==='3')
  //     {
  //       formBtPt3[1].x=selectObj.position.x;
  //       formBtPt3[1].y=selectObj.position.y;
  //       formBtPt3[1].z=selectObj.position.z;
  //     }
  //     Redraw();
  //   }
  // })

  // trfm_ctrl.addEventListener('mouseDown', (evt) => {
  //   orbit_ctrl.enabled = false;
    
  //   });

  // trfm_ctrl.addEventListener('mouseUp', (evt) => {

  //   orbit_ctrl.enabled = true;
  // });

  // function onMouseDown(event) 
  // {
  
  //   //event.preventDefault();
  //   rayCaster.setFromCamera(mouse, camera);
  //   //var rayCaster = getRay(event);
  //   var intersects = rayCaster.intersectObjects(Ctrl_pts);
    
  //   if (event.button === 2) { 
  //     trfm_ctrl.detach();
  //   }
  //   //document.addEventListener('mousemove', onMouseMove);

  //   if (event.button === 0&&intersects[0]) 
  //     {
  //       selectObj = intersects[0].object;
  //       trfm_ctrl.attach(selectObj);
  //     }
  // }
  // function onMouseUp(event) 
  // {
  //   leftMouseDown = false;
  //   rightMouseDown = false;
  //   //document.removeEventListener('mousemove', onMouseMove);
  // }

  // function onMouseMove(event) 
  // {
  //   event.preventDefault();
    
  //   mouse.x = ((event.clientX*2)/window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY/window.innerHeight) * 2 + 1;
  //   var raycaster = new THREE.Raycaster();
  //   raycaster.setFromCamera( mouse, camera );
  //   var intersects = raycaster.intersectObjects( Ctrl_pts);

  //   if(intersects.length > 0) {
  //       $('html,body').css('cursor', 'pointer');
  //   } else {
  //       $('html,body').css('cursor', 'default');
  //   }
  // }
  
  // document.addEventListener('mousedown', onMouseDown);
  // document.addEventListener('mouseup', onMouseUp);
  // document.addEventListener('mousemove', onMouseMove);

  // document.oncontextmenu = function (event) {
  //   event.preventDefault();
  // };

  // scene.add(trfm_ctrl);

  //light setting
  var ambient = new THREE.AmbientLight(0xffffff );
  scene.add( ambient );
  scene2.add( ambient.clone() );

  light = new THREE.DirectionalLight( 0xffffff );
  // light.position.set( 1, 1, 1 ).normalize();
  light.position.set( 0, 0, 10 );
  light.shadow.camera.left = -2; // or whatever value works for the scale of scene
  light.shadow.camera.right = 2;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  light.shadow.camera.near = 0.01;
  light.shadow.camera.far = 200;
  light.castShadow = true;
  light.shadowMapHeight=4096;
  light.shadowMapWidth=4096;
  //light.shadow.map.width=512;
  //light.shadow.map.height=1000;

  scene.add( light );
  scene2.add( light.clone() );

  // ground plane for shadow effects
  var FLOOR = - 2.5;
  var geometry = new THREE.PlaneGeometry( 100, 100 );
  // var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
  const planeMaterial = new THREE.ShadowMaterial();
  planeMaterial.opacity = 0.2;
  var ground = new THREE.Mesh( geometry, planeMaterial);
  ground.position.set( 0, 0, FLOOR);
  ground.rotation.x = 0;
  ground.scale.set( 100, 100, 100 );
  ground.castShadow = false;
  ground.receiveShadow = true;
  scene.add( ground );
  scene2.add( ground.clone() );

}










var INTERSECTED;
//rendering the scenes
function render() 
{

  var rayCaster2=new THREE.Raycaster();
  rayCaster2.setFromCamera(mouse, camera);
  var intersects = rayCaster2.intersectObjects(Ctrl_pts);

  if (intersects.length > 0) {//有相交的object时
   
    if (INTERSECTED != intersects[0].object) {

      if (INTERSECTED) //
      {
        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        if (event.button === 2) { 
          trfm_ctrl.detach();
        }
        //document.addEventListener('mousemove', onMouseMove);
    
        if (event.button === 0&&intersects[0]) 
          {
          
            selectObj = intersects[0].object;
            console.log("selectobj.name="+intersects[0].object.name.charAt(2));
            trfm_ctrl.attach(selectObj);
          }
          
      }
      
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
      INTERSECTED.material.color.set(0xF0F02D);
    }
  }
  else
  {
  
    if (INTERSECTED)
    {
      INTERSECTED.material.color.set(INTERSECTED.currentHex);
    }
    INTERSECTED = null;
  }

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  renderer.clear();
  renderer.setViewport(0,0,window.innerWidth/2,window.innerHeight)
  renderer.render(scene, camera);

  renderer.autoClear = false;
  renderer.setViewport(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight)
  renderer.render(scene2, camera);
}



//create recursive function to keep updating the animation
function animate() {
  requestAnimationFrame(animate);
  orbit_ctrl.update();
  render();
}





//call the recursive function
initRender();
initScene();
initCamera();
orbit_ctrl = new OrbitControls(camera, renderer.domElement);
initModel();
animate();
