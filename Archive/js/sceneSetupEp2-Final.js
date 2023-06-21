import '/Users/chenwx/college coding/i3dgs/style.css'; //setup basic visual factors for the overall web

import * as THREE from 'three';
import * as Geo from '/Archive/js/functions.js';
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils';


import {Pane} from 'tweakpane';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import $ from 'jquery';


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
        {title: 'Parameters'},
        {title: 'Advanced'},
    ],
});

// tweakpane - width

const widthParams = {
    MSscale: 0.1,
};
tab.pages[0].addInput(widthParams, 'MSscale', {
    min: 0.05,
    max: 0.8,
}).on('change', (ev) => { //on change, dispose old geometry and create new
  minkscale.l = ev.value;
  Redraw();
});

// tweakpane - height

const heightParams = {
    height: 2,
};
tab.pages[0].addInput(heightParams, 'height', {
    min: 1,
    max: 5,
}).on('change', (ev) => { //on change, dispose old geometry and create new
    boxMesh.geometry.dispose();
    globalHeight = ev.value;
    boxMesh.geometry = new THREE.BoxGeometry(
        globalWidth,
        globalHeight,
        globalDepth
    );
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        globalWidth * globalPlaneFactor,
        globalHeight * globalPlaneFactor,
        10,
        10
    );
});

// tweakpane - depth

const depthParams = {
    depth: 2,
};
tab.pages[0].addInput(depthParams, 'depth', {
    min: 1,
    max: 5,
}).on('change', (ev) => { //on change, dispose old geometry and create new
    boxMesh.geometry.dispose();
    globalDepth = ev.value;
    boxMesh.geometry = new THREE.BoxGeometry(
        globalWidth,
        globalHeight,
        globalDepth
    );
});

//tweakpane - color (new feature!)

const colorParams = {
    skin: '#FF0005'
};
tab.pages[1].addInput(colorParams, 'skin')
    .on('change', (ev) => boxMesh.material.color.set(ev.value));

//tweakpane - new panel (right)

const hiddenPane = new Pane({
    container: document.getElementById('right_container'),
});

const planeVisibilityCheckboxParams = {
    'force cell': false, //at first, box is unchecked so value is "false"
};

//make the checkbox
const planeVisibilityCheckbox = hiddenPane.addInput(planeVisibilityCheckboxParams, 'force cell').on('change', (ev) => { //on change, dispose old plane geometry and create new
     force_group_c.traverse(function(obj) {
      if (obj.type === "Mesh") {
        obj.material.visible =ev.value;
      }
      });
});

const planeFolder = hiddenPane.addFolder({
    title: 'cell scale',
});

planeFolder.hidden = true; //hide the plane folder b/c box is unchecked at first

const planeSizeSliderParams = {
    size: 0.7, //starts as double the size of the box's params
};
var forceCellScale = 0.7
//make the plane size slider
planeFolder.addInput(planeSizeSliderParams, 'size', {
    min: 0.5, //min = double the size of the box's params
    max: 1, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new
    forceCellScale = ev.value;
    Redraw();
    force_group_c.traverse(function(obj) {
      if (obj.type === "Mesh") {
        obj.material.visible =ev.value;
      }
      });
});

planeVisibilityCheckbox.on('change', (ev) => { //on change, change the hidden and visibility values set
    planeFolder.hidden = !planeFolder.hidden;
});


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















var minkscale= new function () {
  this.l = 0.1
}


// *********************** form diagram inital data ***********************



var formBtPt1 = new THREE.Vector3(-0.24,-1.5,-1);
var formBtPt2 = new THREE.Vector3(-1.743,-0.82,-1);
var formBtPt3 = new THREE.Vector3(0.39,1.03,-1);
var formBtPt4 = new THREE.Vector3(1.11,0.31,-1);

var Ctrl_pts=[];

var form_general

var form_group_v
var form_group_f
var form_group_e
var form_group_c
var form_group_e_trial
var form_general_trial

var form_group_mink

var triP1 = new function () {
  this.z = 0.6;
}


// *********************** force diagram inital data ***********************

var force_group_v
var force_group_f
var force_group_e
var force_group_c
var force_general

var force_group_f_trial
var force_group_e_trial
var force_general_trial

var force_group_mink

var force_text

var fo = new function () {
  this.x = -1;
  this.y = -1;
  this.z = -2;
}
var o1 = new function () {
  this.l = 2; 
}

var o2 = new function () {
  this.l = 2;
}



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
  scene.remove(form_group_mink);


  form_group_v = new THREE.Group();
  form_group_f = new THREE.Group();
  form_group_e = new THREE.Group();
  form_group_c = new THREE.Group();
  form_general = new THREE.Group();
  form_general_trial = new THREE.Group();
  form_group_mink = new THREE.Group();

  form_group_e_trial = new THREE.Group();

  //force groups
  scene2.remove(force_group_v);
  scene2.remove(force_group_f);
  scene2.remove(force_group_e);
  scene2.remove(force_group_c);
  scene2.remove(force_general);
  scene2.remove(force_group_f_trial);
  scene2.remove(force_group_e_trial);
  scene2.remove(force_general_trial);
  scene2.remove(force_group_mink);
  
  scene2.remove(force_text);

  force_group_v = new THREE.Group();
  force_group_f = new THREE.Group();
  force_group_e = new THREE.Group();
  force_group_c = new THREE.Group();
  force_general = new THREE.Group();
  force_text = new THREE.Group();

  force_group_f_trial = new THREE.Group();
  force_group_e_trial = new THREE.Group();
  force_general_trial = new THREE.Group();
  force_group_mink = new THREE.Group();


  // *********************** form vertices **************************

  //1nd. bottom point (movable) - bottom vertice 1
  const vertice_1 = addVertice(0.04, "sp1", formBtPt1)
  Ctrl_pts.push(vertice_1); //adding to gumbal selection
  const vertice_1_out = addVerticeOut(0.04, vertice_1.position, 1.55);

  form_group_v.add(vertice_1);
  form_group_v.add(vertice_1_out);

  //2nd. bottom point (movable) - bottom vertice 2
  const vertice_2 = addVertice(0.04, "sp2", formBtPt2)
  Ctrl_pts.push(vertice_2); //adding to gumbal selection
  const vertice_2_out = addVerticeOut(0.04, vertice_2.position, 1.55);

  form_group_v.add(vertice_2);
  form_group_v.add(vertice_2_out);

  //3rd. bottom point (movable) - bottom vertice 3
  const vertice_3 = addVertice(0.04, "sp3", formBtPt3)
  Ctrl_pts.push(vertice_3); //adding to gumbal selection
  const vertice_3_out = addVerticeOut(0.04, vertice_3.position, 1.55);
  form_group_v.add(vertice_3);
  form_group_v.add(vertice_3_out);

  //4th. bottom point (movable) - bottom vertice 4
  const vertice_4 = addVertice(0.04, "sp4", formBtPt4)
  Ctrl_pts.push(vertice_4); //adding to gumbal selection
  const vertice_4_out = addVerticeOut(0.04, vertice_4.position, 1.55);
  form_group_v.add(vertice_4);
  form_group_v.add(vertice_4_out);

  // apply loads locations o1 and o2
  var formPtO1 = new THREE.Vector3(-0.5,-0.5,1);
  var formPtO2 = new THREE.Vector3(0.38,0.31,1);

  var formPtO1b = new THREE.Vector3(-0.5,-0.5,-1.5);
  var formPtO2b = new THREE.Vector3(0.38,0.31,-1.5);

  // add apply loads arrows

  var arrow_apply =new THREE.MeshPhongMaterial( {color: 0x009600} );
  var arrow_apply_outline = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );

  var apply_arrow1 = createCylinderArrowMesh(formPtO1,new THREE.Vector3(formPtO1.x,formPtO1.y,formPtO1.z-0.4),arrow_apply,0.02,0.05,0.56);
  var apply_arrow2 = createCylinderArrowMesh(formPtO2,new THREE.Vector3(formPtO2.x,formPtO2.y,formPtO2.z-0.4),arrow_apply,0.02,0.05,0.56);

  form_general.add(apply_arrow1);
  form_general.add(apply_arrow2);

  var apply_arrow12 = createCylinderArrowMesh(new THREE.Vector3(formPtO1.x,formPtO1.y,formPtO1.z+0.005),new THREE.Vector3(formPtO1.x,formPtO1.y,formPtO1.z-0.425),arrow_apply_outline,0.025,0.06,0.53);
  var apply_arrow22 = createCylinderArrowMesh(new THREE.Vector3(formPtO2.x,formPtO2.y,formPtO2.z+0.005),new THREE.Vector3(formPtO2.x,formPtO2.y,formPtO2.z-0.425),arrow_apply_outline,0.025,0.06,0.53);

  form_general.add(apply_arrow22);
  form_general.add(apply_arrow12);

  // add dash lines o1o1B, o2o2B
  var applyline_dash_form = new THREE.LineDashedMaterial({
    color: 0x009600,//color
    dashSize: 0.05,
    gapSize: 0.03,
    linewidth: 1
  });

  var apply_o1o1B = [];
  apply_o1o1B.push(formPtO1);
  apply_o1o1B.push(formPtO1b);
  var apply_1_geo = new THREE.BufferGeometry().setFromPoints( apply_o1o1B );
  var applyline_o1B = new THREE.LineSegments(apply_1_geo,applyline_dash_form);
  applyline_o1B.computeLineDistances();//compute
  form_general.add(applyline_o1B);

  var apply_o2o2B = [];
  apply_o2o2B.push(formPtO2);
  apply_o2o2B.push(formPtO2b);
  var apply_2_geo = new THREE.BufferGeometry().setFromPoints( apply_o2o2B );
  var applyline_o2B = new THREE.LineSegments(apply_2_geo,applyline_dash_form);
  applyline_o2B.computeLineDistances();//compute
  form_general.add(applyline_o2B);

  // ***********************            form faces                **************************

  // green faces : o1 o2
  var greenface_O1O2 = FormFace4ptGN( formPtO1,formPtO1b,formPtO2b,formPtO2)
  form_group_f.add(greenface_O1O2);

  // green faces : o1 o1b point1 
  var greenface_p1 = FormFace4ptGN(
    new THREE.Vector3(formBtPt1.x,formBtPt1.y, -1.5),
    new THREE.Vector3(formBtPt1.x,formBtPt1.y, formPtO1.z),
    formPtO1,
    formPtO1b
    )
  form_group_f.add(greenface_p1);

  var green_p1 = [];
  green_p1.push(new THREE.Vector3(formBtPt1.x,formBtPt1.y, -1.5));
  green_p1.push(new THREE.Vector3(formBtPt1.x,formBtPt1.y, formPtO1.z));
  var green_p1_geo = new THREE.BufferGeometry().setFromPoints(green_p1);
  var dashline_p1 = new THREE.LineSegments(green_p1_geo,applyline_dash_form);
  dashline_p1.computeLineDistances();//compute
  form_group_f.add(dashline_p1);

  // green faces : o1 o1b point2 
  var greenface_p2 = FormFace4ptGN(
    new THREE.Vector3(formBtPt2.x,formBtPt2.y, -1.5),
    new THREE.Vector3(formBtPt2.x,formBtPt2.y, formPtO1.z),
    formPtO1,
    formPtO1b
    )
  form_group_f.add(greenface_p2);

  var green_p2 = [];
  green_p2.push(new THREE.Vector3(formBtPt2.x,formBtPt2.y, -1.5));
  green_p2.push(new THREE.Vector3(formBtPt2.x,formBtPt2.y, formPtO1.z));
  var green_p2_geo = new THREE.BufferGeometry().setFromPoints(green_p2);
  var dashline_p2 = new THREE.LineSegments(green_p2_geo,applyline_dash_form);
  dashline_p2.computeLineDistances();//compute
  form_group_f.add(dashline_p2);

  // green faces : o2 o2b point3 
  var greenface_p3 = FormFace4ptGN(
    new THREE.Vector3(formBtPt3.x,formBtPt3.y, -1.5),
    new THREE.Vector3(formBtPt3.x,formBtPt3.y, formPtO2.z),
    formPtO2,
    formPtO2b
    )
  form_group_f.add(greenface_p3);

  var green_p3 = [];
  green_p3.push(new THREE.Vector3(formBtPt3.x,formBtPt3.y, -1.5));
  green_p3.push(new THREE.Vector3(formBtPt3.x,formBtPt3.y, formPtO1.z));
  var green_p3_geo = new THREE.BufferGeometry().setFromPoints(green_p3);
  var dashline_p3 = new THREE.LineSegments(green_p3_geo,applyline_dash_form);
  dashline_p3.computeLineDistances();//compute
  form_group_f.add(dashline_p3);

  // green faces : o2 o2b point4 
  var greenface_p4 = FormFace4ptGN(
    new THREE.Vector3(formBtPt4.x,formBtPt4.y, -1.5),
    new THREE.Vector3(formBtPt4.x,formBtPt4.y, formPtO2.z),
    formPtO2,
    formPtO2b
    )
  form_group_f.add(greenface_p4);

  var green_p4 = [];
  green_p4.push(new THREE.Vector3(formBtPt4.x,formBtPt4.y, -1.5));
  green_p4.push(new THREE.Vector3(formBtPt4.x,formBtPt4.y, formPtO1.z));
  var green_p4_geo = new THREE.BufferGeometry().setFromPoints(green_p4);
  var dashline_p4 = new THREE.LineSegments(green_p4_geo,applyline_dash_form);
  dashline_p4.computeLineDistances();//compute
  form_group_f.add(dashline_p4);

  //form closing plane                  
  //plane mesh
  var form_closingplane = FormPlane(formBtPt2,formBtPt1,formBtPt4,formBtPt3)
  form_general.add(form_closingplane);

  var formline_dash = new THREE.LineDashedMaterial({
    color: "black",//color
    dashSize: 0.1,
    gapSize: 0.03,
    linewidth: 1

  });
 
  var form_linep1p2 = createdashline (formBtPt1, formBtPt2,formline_dash)
  var form_linep2p3 = createdashline (formBtPt2, formBtPt3,formline_dash)
  var form_linep2p4 = createdashline (formBtPt2, formBtPt4,formline_dash)
  var form_linep3p4 = createdashline (formBtPt3, formBtPt4,formline_dash)
  var form_linep1p4 = createdashline (formBtPt1, formBtPt4,formline_dash)

  form_general.add(form_linep1p2);
  form_general.add(form_linep2p3);
  form_general.add(form_linep2p4);
  form_general.add(form_linep3p4);
  form_general.add(form_linep1p4);

  //plane face nromals
  var normal_material = new THREE.MeshPhongMaterial({color:"red"})
  var normal_outlinematerial = new THREE.MeshPhongMaterial({color:"white", side:THREE.BackSide})
  var force_normal_material = new THREE.MeshPhongMaterial({color:"red"})
  //normal 124
  var mid_p1p2p4 = new THREE.Vector3((formBtPt1.x+formBtPt2.x+formBtPt4.x)/3,(formBtPt1.y+formBtPt2.y+formBtPt4.y)/3,(formBtPt1.z+formBtPt2.z+formBtPt4.z)/3 )
  var vec_p1p2p4_temp = CalNormalVectorUpdated(formBtPt4,formBtPt2,formBtPt1,1.2)
  var normal_p1p2p4 = new THREE.Vector3(mid_p1p2p4.x-0.2*vec_p1p2p4_temp.x, mid_p1p2p4.y-0.2*vec_p1p2p4_temp.y, mid_p1p2p4.z-0.2*vec_p1p2p4_temp.z)

  var form_normal_1 = createCylinderArrowMesh(mid_p1p2p4,normal_p1p2p4,normal_material,0.015,0.035,0.55);
  var form_normal_1_outline = createCylinderArrowMesh(mid_p1p2p4,normal_p1p2p4,normal_outlinematerial,0.018,0.038,0.54);

  form_general.add(form_normal_1);
  form_general.add(form_normal_1_outline);

  //normal 234
  var mid_p2p3p4 = new THREE.Vector3((formBtPt3.x+formBtPt2.x+formBtPt4.x)/3,(formBtPt3.y+formBtPt2.y+formBtPt4.y)/3,(formBtPt3.z+formBtPt2.z+formBtPt4.z)/3 )
  var vec_p2p3p4_temp = CalNormalVectorUpdated(formBtPt4,formBtPt3,formBtPt2,1.2)
  var normal_p2p3p4 = new THREE.Vector3(mid_p2p3p4.x-0.2*vec_p2p3p4_temp.x, mid_p2p3p4.y-0.2*vec_p2p3p4_temp.y, mid_p2p3p4.z-0.2*vec_p2p3p4_temp.z)

  var form_normal_2 = createCylinderArrowMesh(mid_p2p3p4,normal_p2p3p4 ,normal_material,0.015,0.035,0.55);
  var form_normal_2_outline = createCylinderArrowMesh(mid_p2p3p4,normal_p2p3p4 ,normal_outlinematerial,0.018,0.038,0.54);

  form_general.add(form_normal_2);
  form_general.add(form_normal_2_outline);

  // ***********************            foce diagram            **************************
  var edgescale = 2; // size of the force diagram

  //PtA
  var forcePtA = new THREE.Vector3(0,-1,0);

  //PtB
  var forcePtBtemp = CalNormalVectorUpdated(formBtPt1, formPtO1, formPtO1b, edgescale );
  var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

  //PtC
  var forcePtC1temp = CalNormalVectorUpdated(formBtPt2, formPtO1, formPtO1b, edgescale);
  var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);
  var forcePtC2temp = CalNormalVectorUpdated( formPtO1,  formPtO2,  formPtO2b, edgescale );
  var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);
  var dirBC = new THREE.Vector3(); // create once an reuse it
  dirBC.subVectors(forcePtB, forcePtC1).normalize();
  var dirAC = new THREE.Vector3(); // create once an reuse it
  dirAC.subVectors(forcePtC2, forcePtA).normalize();

  var forcePtC = LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

  //PtD
  var forcePtD1temp = CalNormalVectorUpdated(formBtPt3, formPtO2, formPtO2b, edgescale);
  var forcePtD1 = new THREE.Vector3(forcePtC.x - forcePtD1temp.x, forcePtC.y - forcePtD1temp.y, forcePtC.z - forcePtD1temp.z);
  var forcePtD2temp = CalNormalVectorUpdated( formPtO2,  formBtPt4,  formPtO2b, edgescale );
  var forcePtD2 = new THREE.Vector3(forcePtA.x - forcePtD2temp.x, forcePtA.y - forcePtD2temp.y, forcePtA.z - forcePtD2temp.z);

  var dirCD = new THREE.Vector3(); // create once an reuse it
  dirCD.subVectors(forcePtC, forcePtD1).normalize();
  var dirAD = new THREE.Vector3(); // create once an reuse it
  dirAD.subVectors(forcePtD2, forcePtA).normalize();
  var forcePtD = LinesSectPt(dirCD, forcePtC, dirAD, forcePtA);

  //force edges
  var edgeSize = 0.005;
  var edgeColor = "lightgrey";

  var forceEdgeMaterial=new THREE.MeshPhongMaterial( {
    color:  edgeColor
  } );

  const forceEdgeAB = createCylinderMesh(forcePtA,forcePtB,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeAB);
  
  const forceEdgeAC = createCylinderMesh(forcePtA,forcePtC,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeAC);

  const forceEdgeBC = createCylinderMesh(forcePtB,forcePtC,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeBC)

  const forceEdgeAD = createCylinderMesh(forcePtA,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeAD)

  const forceEdgeCD = createCylinderMesh(forcePtC,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeCD)

  // *********************** force trial point O **************************

  var TrialP_O = new THREE.Vector3(fo.x,fo.y,fo.z);

  const TrialP_0Sp = addVertice(0.01, "sp1", TrialP_O);
  const TrialP_0Sp_out = Geo.addVerticeOut(0.01, TrialP_0Sp.position, 1.55)
  force_group_v.add(TrialP_0Sp);
  force_group_v.add(TrialP_0Sp_out);

  const TrialFaces = ForceTrialFace(forcePtA,forcePtB,forcePtC,forcePtD,TrialP_O)
  force_group_f_trial.add(TrialFaces)

  // ***********************           trial form                **************************
  var DragPointMat = new THREE.MeshPhongMaterial({color: 0x696969, transparent: true, opacity:0.8});

  var trial_P1 = new THREE.Vector3(formBtPt1.x,formBtPt1.y,triP1.z)

  var trial_o1 = create_trial_intec (trial_P1,forcePtA,TrialP_O,forcePtB,formPtO1,formPtO1b);
  var trial_P2 = create_trial_intec (trial_o1,forcePtB,TrialP_O,forcePtC,formBtPt2,new THREE.Vector3(formBtPt2.x,formBtPt2.y,formBtPt2.z - 1));
  var trial_o2 = create_trial_intec (trial_o1,forcePtA,TrialP_O,forcePtC,formPtO2,formPtO2b);
  var trial_P3 = create_trial_intec (trial_o2,forcePtC,TrialP_O,forcePtD,formBtPt3,new THREE.Vector3(formBtPt3.x,formBtPt3.y,formBtPt3.z - 1));
  var trial_P4 = create_trial_intec (trial_o2,forcePtA,TrialP_O,forcePtD,formBtPt4,new THREE.Vector3(formBtPt4.x,formBtPt4.y,formBtPt4.z - 1));

  var trial_mesh_p1o1 = createCylinderMesh(trial_o1,trial_P1,DragPointMat,0.02,0.02);
  var trial_mesh_p2o1 = createCylinderMesh(trial_o1,trial_P2,DragPointMat,0.02,0.02);
  var trial_mesh_o1o2 = createCylinderMesh(trial_o1,trial_o2,DragPointMat,0.02,0.02);
  var trial_mesh_p3o2 = createCylinderMesh(trial_P3,trial_o2,DragPointMat,0.02,0.02);
  var trial_mesh_p4o2 = createCylinderMesh(trial_P4,trial_o2,DragPointMat,0.02,0.02);

  form_group_e_trial.add(trial_mesh_p1o1);
  form_group_e_trial.add(trial_mesh_p2o1);
  form_group_e_trial.add(trial_mesh_o1o2);
  form_group_e_trial.add(trial_mesh_p3o2);
  form_group_e_trial.add(trial_mesh_p4o2);

  //trial form closing plane                  
  //plane mesh
  var trial_closingplane = Geo.FormPlane(trial_P2,trial_P1,trial_P4,trial_P3)
  form_general_trial.add(trial_closingplane);
  
  var trialline_dash = new THREE.LineDashedMaterial({
    color: "black",//color
    dashSize: 0.1,
    gapSize: 0.03,
    linewidth: 1

  });
 
  var trial_linep1p2 = createdashline ( trial_P1,  trial_P2,trialline_dash)
  var trial_linep2p4 = createdashline ( trial_P2,  trial_P4,trialline_dash)
  var trial_linep1p4 = createdashline ( trial_P1,  trial_P4,trialline_dash)
  var trial_linep2p3 = createdashline ( trial_P2,  trial_P3,trialline_dash)
  var trial_linep3p4 = createdashline ( trial_P3,  trial_P4,trialline_dash)

  form_general_trial.add(trial_linep1p2);
  form_general_trial.add(trial_linep2p4);
  form_general_trial.add(trial_linep1p4);
  form_general_trial.add(trial_linep2p3);
  form_general_trial.add(trial_linep3p4);
  

  //trial plane face nromals

  var trialmid_p1p2p4 = new THREE.Vector3((trial_P1.x+trial_P2.x+trial_P4.x)/3,(trial_P1.y+trial_P2.y+trial_P4.y)/3,(trial_P1.z+trial_P2.z+trial_P4.z)/3 )
  var vec_p1p2p4_temp = CalNormalVectorUpdated(trial_P4,trial_P2,trial_P1,1.2)
  var trialnormal_p1p2p4 = new THREE.Vector3(trialmid_p1p2p4.x-0.2*vec_p1p2p4_temp.x, trialmid_p1p2p4.y-0.2*vec_p1p2p4_temp.y, trialmid_p1p2p4.z-0.2*vec_p1p2p4_temp.z)

  var trial_normal_material = new THREE.MeshPhongMaterial({color:"red"})
  var trial_normal_outlinematerial = new THREE.MeshPhongMaterial({color:"white", side:THREE.BackSide})
  var force_normal_material = new THREE.MeshPhongMaterial({color:"red"})

  var trial_normal_1 = createCylinderArrowMesh(trialmid_p1p2p4,trialnormal_p1p2p4,trial_normal_material,0.015,0.035,0.55);
  var trial_normal_1_outline = createCylinderArrowMesh(trialmid_p1p2p4,trialnormal_p1p2p4,trial_normal_outlinematerial,0.018,0.038,0.54);

  form_general_trial.add(trial_normal_1);
  form_general_trial.add(trial_normal_1_outline);
  

  var trialmid_p2p3p4 = new THREE.Vector3((trial_P2.x+trial_P3.x+trial_P4.x)/3,(trial_P2.y+trial_P3.y+trial_P4.y)/3,(trial_P2.z+trial_P3.z+trial_P4.z)/3 )
  var vec_p2p3p4_temp = CalNormalVectorUpdated(trial_P4,trial_P3,trial_P2,1.2)
  var trialnormal_p2p3p4 = new THREE.Vector3(trialmid_p2p3p4.x-0.2*vec_p2p3p4_temp.x, trialmid_p2p3p4.y-0.2*vec_p2p3p4_temp.y, trialmid_p2p3p4.z-0.2*vec_p2p3p4_temp.z)

  var trial_normal_2 = createCylinderArrowMesh(trialmid_p2p3p4,trialnormal_p2p3p4,trial_normal_material,0.015,0.035,0.55);
  var trial_normal_2_outline = createCylinderArrowMesh(trialmid_p2p3p4,trialnormal_p2p3p4,trial_normal_outlinematerial,0.018,0.038,0.54);

  form_general_trial.add(trial_normal_2);
  form_general_trial.add(trial_normal_2_outline);

 // ***********************          find trial force point x1 and x2              **************************

  //location of x1 x2
  //find x1
  var ForceX1_vec = CalNormalVectorUpdated(trial_P1,trial_P2,trial_P4,0.5);
  var ForceX1_temp = new THREE.Vector3(TrialP_O.x-1.2*ForceX1_vec.x, TrialP_O.y-1.2*ForceX1_vec.y,TrialP_O.z-1.2*ForceX1_vec.z);   

  //define intersection point x1
  var intersect_x1_vec = new THREE.Vector3(ForceX1_temp.x-TrialP_O.x,ForceX1_temp.y-TrialP_O.y,ForceX1_temp.z-TrialP_O.z);
  var applyplanevec = CalNormalVectorUpdated(forcePtA,forcePtB,forcePtC,0.5);
  var ForceX1 = Cal_Plane_Line_Intersect_Point(TrialP_O,intersect_x1_vec,forcePtB,applyplanevec);

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

  var ForceX2_vec = CalNormalVectorUpdated(trial_P2,trial_P4,trial_P3,0.5);
  var ForceX2_temp = new THREE.Vector3(TrialP_O.x-1.2*ForceX2_vec.x, TrialP_O.y-1.2*ForceX2_vec.y,TrialP_O.z-1.2*ForceX2_vec.z);   

  var intersect_x2_vec = new THREE.Vector3(ForceX2_temp.x-TrialP_O.x,ForceX2_temp.y-TrialP_O.y,ForceX2_temp.z-TrialP_O.z);
  var ForceX2 = Cal_Plane_Line_Intersect_Point(TrialP_O,intersect_x2_vec,forcePtB,applyplanevec);

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

  force_general.add(new_forcePointx1); 
  force_general.add(outlineMeshnewx1); 

  var new_forcePointx2 = new THREE.Mesh(spforcePointx, materialpointx);
  
  new_forcePointx2.position.copy(ForceX2);
  
  var outlineMaterialx = new THREE.MeshBasicMaterial( { color: "red", transparent: false, side: THREE.BackSide } );
  var outlineMeshnewx2 = new THREE.Mesh( spforcePointx, outlineMaterialx );
  outlineMeshnewx2.position.copy(ForceX2);
  outlineMeshnewx2.scale.multiplyScalar(1.55);

  force_general.add(new_forcePointx2); 
  force_general.add(outlineMeshnewx2); 

  //draw x1o1, x2o2
  //find constrain point o1

  var ForceO1_temp = CalNormalVectorUpdated(formBtPt1,formBtPt2,formBtPt4,0.5);
  var ForceO1 = new THREE.Vector3(ForceX1.x-o1.l*ForceO1_temp.x, ForceX1.y-o1.l*ForceO1_temp.y,ForceX1.z-o1.l*ForceO1_temp.z);   

  var line_o1x1_temp = [];
  line_o1x1_temp.push(ForceX1);
  line_o1x1_temp.push(ForceO1);

  var line_o1x1_geo = new THREE.BufferGeometry().setFromPoints( line_o1x1_temp );
  var line_o1x1 = new THREE.LineSegments(line_o1x1_geo,applyline_1);
  line_o1x1.computeLineDistances();//compute
  force_general.add(line_o1x1);

  //add o1 arrow
  var ForceO1_closeP1 = addVectorAlongDir(ForceO1, ForceX1, -0.6);
  var ForceO1_closeP2 = addVectorAlongDir(ForceO1, ForceX1, -0.4);
  var ForceO1_arrow = createCylinderArrowMesh(ForceO1_closeP1,ForceO1_closeP2,force_normal_material,0.012,0.025,0.55);

  force_general.add(ForceO1_arrow);

  //find constrain point o2

  var ForceO2_temp = CalNormalVectorUpdated(formBtPt2,formBtPt3,formBtPt4,0.5);
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
  force_general.add(line_o2x2);

  //add o2 arrow

  var ForceO2_closeP1 = addVectorAlongDir(ForceO2, ForceX2, -0.6);
  var ForceO2_closeP2 = addVectorAlongDir(ForceO2, ForceX2, -0.4);

  var ForceO2_arrow = createCylinderArrowMesh(ForceO2_closeP1,ForceO2_closeP2,force_normal_material,0.012,0.025,0.55);

  force_general.add(ForceO2_arrow);

  // ***********************          find force edges        **************************

  const forceEdgeAO1 = createCylinderMesh(forcePtA,ForceO1,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeAO1);

  const forceEdgeAO2 = createCylinderMesh(forcePtA,ForceO2,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeAO2);

  const forceEdgeO1O2 = createCylinderMesh(ForceO1,ForceO2,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeO1O2);

  const forceEdgeBO1 = createCylinderMesh(forcePtB,ForceO1,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeBO1);

  const forceEdgeCO1 = createCylinderMesh(forcePtC,ForceO1,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeCO1);

  const forceEdgeCO2 = createCylinderMesh(forcePtC,ForceO2,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeCO2);

  const forceEdgeDO2 = createCylinderMesh(forcePtD,ForceO2,forceEdgeMaterial,edgeSize,edgeSize);
  force_group_e.add(forceEdgeDO2);


  
  // ***********************          find form edges        **************************

  //New Point o1
  var formPt1 =  CalNormalVectorUpdated(forcePtA,ForceO1,forcePtB,0.5);
  var formPt1end = new THREE.Vector3(formBtPt1.x-1.2*formPt1.x, formBtPt1.y-1.2*formPt1.y,formBtPt1.z-1.2*formPt1.z);  
  var formPt2 =  CalNormalVectorUpdated (forcePtC,ForceO1,forcePtB,0.5);
  var formPt2end = new THREE.Vector3(formBtPt2.x-1.2*formPt2.x, formBtPt2.y-1.2*formPt2.y,formBtPt2.z-1.2*formPt2.z);  

  var diro1 = new THREE.Vector3(); // create once an reuse it
  diro1.subVectors( formBtPt1,formPt1end  ).normalize();
  var diro12 = new THREE.Vector3(); // create once an reuse it
  diro12.subVectors(formBtPt2,formPt2end  ).normalize();
  var formPtO1new = LinesSectPt(diro1,formBtPt1, diro12,formBtPt2);
  var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
  var spformPointO1 = new THREE.SphereGeometry(0.04);
  var new_formPtO1 = new THREE.Mesh(spformPointO1, materialpointo);
  new_formPtO1.position.copy(formPtO1new);
  new_formPtO1.castShadow=true;
  var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
  var outlineMeshnew1 = new THREE.Mesh( spformPointO1, outlineMaterial1 );
  outlineMeshnew1.position.copy(formPtO1new);
  outlineMeshnew1.scale.multiplyScalar(1.55);

  form_group_v.add(new_formPtO1); 
  form_group_v.add(outlineMeshnew1); 

  //New Point o2
  var formPt3 =  CalNormalVectorUpdated(forcePtD,forcePtC,ForceO2,0.5);
  var formPt3end = new THREE.Vector3(formBtPt3.x-1.2*formPt3.x, formBtPt3.y-1.2*formPt3.y,formBtPt3.z-1.2*formPt3.z);  
  var formPt4 =  CalNormalVectorUpdated (forcePtA,forcePtD,ForceO2,0.5);
  var formPt4end = new THREE.Vector3(formBtPt4.x-1.2*formPt4.x, formBtPt4.y-1.2*formPt4.y,formBtPt4.z-1.2*formPt4.z);  

  var diro2 = new THREE.Vector3(); // create once an reuse it
  diro2.subVectors( formBtPt3,formPt3end  ).normalize();
  var diro22 = new THREE.Vector3(); // create once an reuse it
  diro22.subVectors(formBtPt4,formPt4end  ).normalize();
  var formPtO2new = LinesSectPt(diro2,formBtPt3, diro22,formBtPt4);
  var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
  var spformPointO2 = new THREE.SphereGeometry(0.04);
  var new_formPtO2 = new THREE.Mesh(spformPointO2, materialpointo);
  new_formPtO2.position.copy(formPtO2new);
  new_formPtO2.castShadow=true;
  var outlineMaterial2 = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
  var outlineMeshnew2 = new THREE.Mesh( spformPointO2, outlineMaterial2 );
  outlineMeshnew2.position.copy(formPtO2new);
  outlineMeshnew2.scale.multiplyScalar(1.55);

  form_group_v.add(new_formPtO2); 
  form_group_v.add(outlineMeshnew2); 

  //New Point o3
  var formPtO3a =  CalNormalVectorUpdated(forcePtC,forcePtA,ForceO1,0.5);
  var formPtO3aend = new THREE.Vector3(formPtO1new.x-1.2*formPtO3a.x, formPtO1new.y-1.2*formPtO3a.y,formPtO1new.z-1.2*formPtO3a.z);  
  var formPtO3b =  CalNormalVectorUpdated (forcePtA,forcePtC,ForceO2,0.5);
  var formPtO3bend = new THREE.Vector3(formPtO2new.x-1.2*formPtO3b.x, formPtO2new.y-1.2*formPtO3b.y,formPtO2new.z-1.2*formPtO3b.z);  

  var diro3 = new THREE.Vector3(); // create once an reuse it
  diro3.subVectors( formPtO1new,formPtO3aend  ).normalize();
  var diro32 = new THREE.Vector3(); // create once an reuse it
  diro32.subVectors(formPtO2new,formPtO3bend  ).normalize();
  var formPtO3new = LinesSectPt(diro3,formPtO1new, diro32,formPtO2new);
  var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
  var spformPointO3 = new THREE.SphereGeometry(0.04);
  var new_formPtO3 = new THREE.Mesh(spformPointO3, materialpointo);
  new_formPtO3.position.copy(formPtO3new);
  new_formPtO3.castShadow=true;
  var outlineMaterial3 = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
  var outlineMeshnew3 = new THREE.Mesh( spformPointO3, outlineMaterial3 );
  outlineMeshnew3.position.copy(formPtO3new);
  outlineMeshnew3.scale.multiplyScalar(1.55);

  form_group_v.add(new_formPtO3); 
  form_group_v.add(outlineMeshnew3); 

  //Cal areas
  var areaACO2 = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors( forcePtA, ForceO2 ),
    new THREE.Vector3().subVectors( forcePtC, ForceO2 ),
  ).length()/2

  var areaCO1O2 = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors( ForceO1, forcePtC ),
    new THREE.Vector3().subVectors( ForceO2, forcePtC ),
  ).length()/2

  var areaAO1O2 = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors( ForceO1, forcePtA ),
    new THREE.Vector3().subVectors( ForceO2, forcePtA ),
  ).length()/2

  var areaACO1 = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors( forcePtC, ForceO1 ),
    new THREE.Vector3().subVectors( forcePtA, ForceO1 ),
  ).length()/2

  var areaABO1 = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors( forcePtB, ForceO1 ),
    new THREE.Vector3().subVectors( forcePtA, ForceO1 ),
  ).length()/2

  var areaBCO1 = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors( forcePtB, ForceO1 ),
    new THREE.Vector3().subVectors( forcePtC, ForceO1 ),
  ).length()/2
  
  var areaCDO2 = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors(forcePtC, ForceO2 ),
  new THREE.Vector3().subVectors( forcePtD, ForceO2 ),
  ).length()/2

  var areaADO2 = new THREE.Vector3().crossVectors(
  new THREE.Vector3().subVectors(forcePtA, ForceO2 ),
  new THREE.Vector3().subVectors( forcePtD, ForceO2 ),
  ).length()/2

  var areaMax = Math.max(areaACO2, areaCO1O2, areaAO1O2,areaACO1, areaABO1, areaBCO1, areaCDO2,areaADO2)

  // *********************** caculating the normals for each triangle *********************** 

  //red color options:
  //0.75 - 0x80002F
  //0.5 - 0.75 - 0x940041
  //0.25 - 0.5 - 0xCC0549
  //0 - 0.25 - 0xD72F62

  //blue color options:
  //0.75 - 0x0F3150
  //0.5 - 0.75 - 0x05416D
  //0.25 - 0.5 - 0x376D9B
  //0 - 0.25 - 0x5B84AE


  var formedgeColor1, formedgeColor2, formedgeColor3, formedgeColor4, formedgeColor5, formedgeColor6, formedgeColor7, formedgeColor8;

  // triangle ABO1 - 1 
  var normalABO1_a = subVec(forcePtB, forcePtA)
  var normalABO1_b = subVec(forcePtA, ForceO1)
  var normalABO1 = cross(normalABO1_a, normalABO1_b)
  var edgePt1O1 = subVec(formBtPt1, formPtO1new);
  var resultPt1O1 = normalABO1.dot(edgePt1O1)

  if (resultPt1O1 <0){
    if (areaABO1/areaMax >= 0.75){
      formedgeColor1 = 0x0F3150
    }
    if (0.5 <= areaABO1/areaMax & areaABO1/areaMax < 0.75){
      formedgeColor1 = 0x05416D
    }
    if (0.25 <= areaABO1/areaMax & areaABO1/areaMax  < 0.5){
      formedgeColor1 = 0x376D9B
    }
    if (0 <= areaABO1/areaMax & areaABO1/areaMax < 0.25){
      formedgeColor1 = 0x5B84AE
    }
    var forceFaceABO1 = ForceFace3pt(forcePtA, forcePtB, ForceO1, formedgeColor1);
  } else{
    if (areaABO1/areaMax >= 0.75){
      formedgeColor1 = 0x80002F
    }
    if (0.5 <= areaABO1/areaMax & areaABO1/areaMax < 0.75){
      formedgeColor1 = 0x940041
    }
    if (0.25 <= areaABO1/areaMax & areaABO1/areaMax  < 0.5){
      formedgeColor1 = 0xCC0549
    }
    if (0 <= areaABO1/areaMax & areaABO1/areaMax < 0.25){
      formedgeColor1 = 0xD72F62
    }
    var forceFaceABO1 = ForceFace3pt(forcePtA, forcePtB, ForceO1, formedgeColor1);
  }
  var formEdgePt1O1Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor1
  } );
  force_group_f.add(forceFaceABO1)

  var edgeSize1 = areaABO1 * 0.02;
  edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
 
  //create end sphere for bottom vertice 1
  const endPtVertice1SpV = addVectorAlongDir(formBtPt1, formPtO1new, -0.14);
  const endPtVertice1Sp = addEdgeSphere(edgeSize1, endPtVertice1SpV, formedgeColor1)
  //create edge bottom vertice 1
  const endPtVertice1 = addVectorAlongDir(formPtO1new,formBtPt1,  -0.1);
  const formEdge1 = createCylinderMesh(endPtVertice1SpV,endPtVertice1,formEdgePt1O1Material,edgeSize1,edgeSize1);

  form_group_e.add(endPtVertice1Sp)
  form_group_e.add(formEdge1)

  // triangle BCO1 -2 
  var normalBCO1_a = subVec(forcePtC, forcePtB)
  var normalBCO1_b = subVec(forcePtB, ForceO1)
  var normalBCO1 = cross(normalBCO1_a, normalBCO1_b)
  var edgePt2O1 = subVec(formBtPt2, formPtO1new);
  var resultPt2O1 = normalBCO1.dot(edgePt2O1)

  if (resultPt2O1 <0){
    if (areaBCO1/areaMax >= 0.75){
      formedgeColor2 = 0x0F3150
    }
    if (0.5 <= areaBCO1/areaMax & areaBCO1/areaMax < 0.75){
      formedgeColor2 = 0x05416D
    }
    if (0.25 <= areaBCO1/areaMax & areaBCO1/areaMax  < 0.5){
      formedgeColor2 = 0x376D9B
    }
    if (0 <= areaBCO1/areaMax & areaBCO1/areaMax < 0.25){
      formedgeColor2 = 0x5B84AE
    }
    var forceFaceBCO1 = ForceFace3pt(forcePtB, forcePtC, ForceO1, formedgeColor2);
  } else{
    if (areaBCO1/areaMax >= 0.75){
      formedgeColor2 = 0x80002F
    }
    if (0.5 <= areaBCO1/areaMax & areaBCO1/areaMax < 0.75){
      formedgeColor2 = 0x940041
    }
    if (0.25 <= areaBCO1/areaMax & areaBCO1/areaMax  < 0.5){
      formedgeColor2 = 0xCC0549
    }
    if (0 <= areaBCO1/areaMax & areaBCO1/areaMax < 0.25){
      formedgeColor2 = 0xD72F62
    }
    var forceFaceBCO1 = ForceFace3pt(forcePtB, forcePtC, ForceO1, formedgeColor2);
  }
  var formEdgePt2O1Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor2
  } );
  force_group_f.add(forceFaceBCO1)

  var edgeSize2 = areaBCO1 * 0.02;
  edgeSize2 = THREE.MathUtils.clamp(edgeSize2, 0.01, 0.5);

  //create end sphere for bottom vertice 1
  const endPtVertice2SpV = addVectorAlongDir(formBtPt2, formPtO1new, -0.14);
  const endPtVertice2Sp = addEdgeSphere(edgeSize2, endPtVertice2SpV, formedgeColor2)
  //create edge bottom vertice 1
  const endPtVertice2 = addVectorAlongDir(formPtO1new,formBtPt2,  -0.1);
  const formEdge2 = createCylinderMesh(endPtVertice2SpV,endPtVertice2,formEdgePt2O1Material,edgeSize2,edgeSize2);

  form_group_e.add(endPtVertice2Sp)
  form_group_e.add(formEdge2)

  // triangle CO1O2 - 3
  var normalCO1O2_a = subVec(forcePtC, ForceO1);
  var normalCO1O2_b = subVec(ForceO1, ForceO2);
  var normalCO1O2 = cross(normalCO1O2_a, normalCO1O2_b);
  var edgePt2O3 = subVec(formBtPt2, formPtO3new);
  var resultPt2O3 = normalCO1O2.dot(edgePt2O3);

  if (resultPt2O3 < 0){
    if (areaCO1O2/areaMax >= 0.75){
      formedgeColor3 = 0x0F3150
    }
    if (0.5 <= areaCO1O2/areaMax & areaCO1O2/areaMax < 0.75){
      formedgeColor3 = 0x05416D
    }
    if (0.25 <= areaCO1O2/areaMax & areaCO1O2/areaMax  < 0.5){
      formedgeColor3 = 0x376D9B
    }
    if (0 <= areaCO1O2/areaMax & areaCO1O2/areaMax < 0.25){
      formedgeColor3 = 0x5B84AE
    }
    var forceFaceCO1O2 = ForceFace3pt(forcePtC, ForceO2, ForceO1, formedgeColor3);
  } else{
    if (areaCO1O2/areaMax >= 0.75){
      formedgeColor3 = 0x80002F
    }
    if (0.5 <= areaCO1O2/areaMax & areaCO1O2/areaMax < 0.75){
      formedgeColor3 = 0x940041
    }
    if (0.25 <= areaCO1O2/areaMax & areaCO1O2/areaMax  < 0.5){
      formedgeColor3 = 0xCC0549
    }
    if (0 <= areaCO1O2/areaMax & areaCO1O2/areaMax < 0.25){
      formedgeColor3 = 0xD72F62
    }
    var forceFaceCO1O2 = ForceFace3pt(forcePtC, ForceO2, ForceO1, formedgeColor3); 
  }
  
  var formEdgePt2O3Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor3
  } );
  force_group_f.add(forceFaceCO1O2)

  var edgeSize3 = areaCO1O2 * 0.02;
  edgeSize3 = THREE.MathUtils.clamp(edgeSize3, 0.01, 0.5);
  
  //create end sphere for bottom vertice 1
  const endPtVertice3SpV = addVectorAlongDir(formBtPt2, formPtO3new, -0.14);
  const endPtVertice3Sp = addEdgeSphere(edgeSize3, endPtVertice3SpV, formedgeColor3)
  //create edge bottom vertice 1
  const endPtVertice3 = addVectorAlongDir(formPtO3new,formBtPt2,  -0.1);
  const formEdge3 = createCylinderMesh(endPtVertice3SpV,endPtVertice3,formEdgePt2O3Material,edgeSize3,edgeSize3);

  form_group_e.add(endPtVertice3Sp)
  form_group_e.add(formEdge3)

  // triangle ACO1 - 4
  var normalACO1_a = subVec(forcePtC, forcePtA);
  var normalACO1_b = subVec(forcePtA, ForceO1);
  var normalACO1 = cross(normalACO1_a, normalACO1_b);
  var edgePtO1O3 = subVec(formPtO1new, formPtO3new);
  var resultPtO1O3 = normalACO1.dot(edgePtO1O3);

  if (resultPtO1O3 < 0){
    if (areaACO1/areaMax >= 0.75){
      formedgeColor4 = 0x0F3150
    }
    if (0.5 <= areaACO1/areaMax & areaACO1/areaMax < 0.75){
      formedgeColor4 = 0x05416D
    }
    if (0.25 <= areaACO1/areaMax & areaACO1/areaMax  < 0.5){
      formedgeColor4 = 0x376D9B
    }
    if (0 <= areaACO1/areaMax & areaACO1/areaMax < 0.25){
      formedgeColor4 = 0x5B84AE
    }
    var forceFaceACO1 = ForceFace3pt(forcePtC, forcePtA, ForceO1, formedgeColor4);
  } else{
    if (areaACO1/areaMax >= 0.75){
      formedgeColor4 = 0x80002F
    }
    if (0.5 <= areaACO1/areaMax & areaACO1/areaMax < 0.75){
      formedgeColor4 = 0x940041
    }
    if (0.25 <= areaACO1/areaMax & areaACO1/areaMax  < 0.5){
      formedgeColor4 = 0xCC0549
    }
    if (0 <= areaACO1/areaMax & areaACO1/areaMax < 0.25){
      formedgeColor4 = 0xD72F62
    }
    var forceFaceACO1 = ForceFace3pt(forcePtC, forcePtA, ForceO1, formedgeColor4); 
  }
  
  var formEdgePtO1O3Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor4
  } );
  force_group_f.add(forceFaceACO1)

  var edgeSize4 = areaACO1 * 0.02;
  edgeSize4 = THREE.MathUtils.clamp(edgeSize4, 0.01, 0.5);
  
  //create end sphere for bottom vertice 1
  const endPtVertice4SpV = addVectorAlongDir(formPtO1new, formPtO3new, -0.14);
  const endPtVertice4SpV2 = addVectorAlongDir(formPtO3new, formPtO1new, -0.14);
  const endPtVertice4Sp = addEdgeSphere(edgeSize4, endPtVertice4SpV, formedgeColor4)
  const endPtVertice4Sp2 = addEdgeSphere(edgeSize4, endPtVertice4SpV2, formedgeColor4)
  //create edge bottom vertice 1
  const endPtVertice4 = addVectorAlongDir(formPtO3new,formPtO1new,  -0.14);
  const formEdge4 = createCylinderMesh(endPtVertice4SpV,endPtVertice4,formEdgePtO1O3Material,edgeSize4,edgeSize4);

  form_group_e.add(endPtVertice4Sp)
  form_group_e.add(endPtVertice4Sp2)
  form_group_e.add(formEdge4)


  // triangle AO1O2 - 5
  var normalAO1O2_a = subVec(forcePtA, ForceO2);
  var normalAO1O2_b = subVec(ForceO2, ForceO1);
  var normalAO1O2 = cross(normalAO1O2_a, normalAO1O2_b);
  var edgePt4O3 = subVec(formBtPt4, formPtO3new);
  var resultPt4O3 = normalAO1O2.dot(edgePt4O3);

  if (resultPt4O3 < 0){
    if (areaAO1O2/areaMax >= 0.75){
      formedgeColor5 = 0x0F3150
    }
    if (0.5 <= areaAO1O2/areaMax & areaAO1O2/areaMax < 0.75){
      formedgeColor5 = 0x05416D
    }
    if (0.25 <= areaAO1O2/areaMax & areaAO1O2/areaMax  < 0.5){
      formedgeColor5 = 0x376D9B
    }
    if (0 <= areaAO1O2/areaMax & areaAO1O2/areaMax < 0.25){
      formedgeColor5 = 0x5B84AE
    }
    var forceFaceAO1O2 = ForceFace3pt(forcePtA, ForceO1, ForceO2, formedgeColor5);
  } else{
    if (areaAO1O2/areaMax >= 0.75){
      formedgeColor5 = 0x80002F
    }
    if (0.5 <= areaAO1O2/areaMax & areaAO1O2/areaMax < 0.75){
      formedgeColor5 = 0x940041
    }
    if (0.25 <= areaAO1O2/areaMax & areaAO1O2/areaMax  < 0.5){
      formedgeColor5 = 0xCC0549
    }
    if (0 <= areaAO1O2/areaMax & areaAO1O2/areaMax < 0.25){
      formedgeColor5 = 0xD72F62
    }
    var forceFaceAO1O2 = ForceFace3pt(forcePtA, ForceO1, ForceO2, formedgeColor5); 
  }
  
  var formEdgePt4O3Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor5
  } );
  force_group_f.add(forceFaceAO1O2)

  var edgeSize5 = areaAO1O2 * 0.02;
  edgeSize5 = THREE.MathUtils.clamp(edgeSize5, 0.01, 0.5);
  
  //create end sphere for bottom vertice 1
  const endPtVertice5SpV = addVectorAlongDir(formBtPt4, formPtO3new, -0.14);
  const endPtVertice5Sp = addEdgeSphere(edgeSize5, endPtVertice5SpV, formedgeColor5)
  //create edge bottom vertice 1
  const endPtVertice5 = addVectorAlongDir(formPtO3new,formBtPt4,  -0.1);
  const formEdge5 = createCylinderMesh(endPtVertice5SpV,endPtVertice5,formEdgePt4O3Material,edgeSize5,edgeSize5);

  form_group_e.add(endPtVertice5Sp)
  form_group_e.add(formEdge5)

  // triangle ACO2 - 6
  var normalACO2_a = subVec(forcePtA, forcePtC);
  var normalACO2_b = subVec(forcePtC, ForceO2);
  var normalACO2 = cross(normalACO2_a, normalACO2_b);
  var edgePtO2O3 = subVec(formPtO2new, formPtO3new);
  var resultPtO2O3 = normalACO2.dot(edgePtO2O3);

  if (resultPtO2O3 < 0){
    if (areaACO2/areaMax >= 0.75){
      formedgeColor6 = 0x0F3150
    }
    if (0.5 <= areaACO2/areaMax & areaACO2/areaMax < 0.75){
      formedgeColor6 = 0x05416D
    }
    if (0.25 <= areaACO2/areaMax & areaACO2/areaMax  < 0.5){
      formedgeColor6 = 0x376D9B
    }
    if (0 <= areaACO2/areaMax & areaACO2/areaMax < 0.25){
      formedgeColor6 = 0x5B84AE
    }
    var forceFaceACO2 = ForceFace3pt(forcePtA, forcePtC, ForceO2, formedgeColor6);
  } else{
    if (areaACO2/areaMax >= 0.75){
      formedgeColor6 = 0x80002F
    }
    if (0.5 <= areaACO2/areaMax & areaACO2/areaMax < 0.75){
      formedgeColor6 = 0x940041
    }
    if (0.25 <= areaACO2/areaMax & areaACO2/areaMax  < 0.5){
      formedgeColor6 = 0xCC0549
    }
    if (0 <= areaACO2/areaMax & areaACO2/areaMax < 0.25){
      formedgeColor6 = 0xD72F62
    }
    var forceFaceACO2 = ForceFace3pt(forcePtA, forcePtC, ForceO2, formedgeColor6); 
  }
  
  var formEdgePtO2O3Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor6
  } );
  force_group_f.add(forceFaceACO2)

  var edgeSize6 = areaACO2 * 0.02;
  edgeSize6 = THREE.MathUtils.clamp(edgeSize6, 0.01, 0.5);
  
  //create end sphere for bottom vertice 1
  const endPtVertice6SpV = addVectorAlongDir(formPtO3new, formPtO2new, -0.14);
  const endPtVertice6SpV2 = addVectorAlongDir(formPtO2new, formPtO3new, -0.14);
  const endPtVertice6Sp = addEdgeSphere(edgeSize6, endPtVertice6SpV, formedgeColor6)
  const endPtVertice6Sp2 = addEdgeSphere(edgeSize6, endPtVertice6SpV2, formedgeColor6)
  //create edge bottom vertice 1
  const endPtVertice6 = addVectorAlongDir(formPtO2new,formPtO3new,  -0.14);
  const formEdge6 = createCylinderMesh(endPtVertice6SpV,endPtVertice6,formEdgePtO2O3Material,edgeSize6,edgeSize6);

  form_group_e.add(endPtVertice6Sp)
  form_group_e.add(endPtVertice6Sp2)
  form_group_e.add(formEdge6)

  // triangle ADO2 - 7
  var normalADO2_a = subVec(forcePtA, forcePtD);
  var normalADO2_b = subVec(forcePtD, ForceO2);
  var normalADO2 = cross(normalADO2_a, normalADO2_b);
  var edgePt4O2 = subVec(formBtPt4, formPtO2new);
  var resultPt4O2 = normalADO2.dot(edgePt4O2);

  if (resultPt4O2 < 0){
    if (areaADO2/areaMax >= 0.75){
      formedgeColor7 = 0x0F3150
    }
    if (0.5 <= areaADO2/areaMax & areaADO2/areaMax < 0.75){
      formedgeColor7 = 0x05416D
    }
    if (0.25 <= areaADO2/areaMax & areaADO2/areaMax  < 0.5){
      formedgeColor7 = 0x376D9B
    }
    if (0 <= areaADO2/areaMax & areaADO2/areaMax < 0.25){
      formedgeColor7 = 0x5B84AE
    }
    var forceFaceADO2 = ForceFace3pt(forcePtA, ForceO2, forcePtD, formedgeColor7);
  } else{
    if (areaADO2/areaMax >= 0.75){
      formedgeColor7 = 0x80002F
    }
    if (0.5 <= areaADO2/areaMax & areaADO2/areaMax < 0.75){
      formedgeColor7 = 0x940041
    }
    if (0.25 <= areaADO2/areaMax & areaADO2/areaMax  < 0.5){
      formedgeColor7 = 0xCC0549
    }
    if (0 <= areaADO2/areaMax & areaADO2/areaMax < 0.25){
      formedgeColor7 = 0xD72F62
    }
    var forceFaceADO2 = ForceFace3pt(forcePtA, ForceO2, forcePtD, formedgeColor7); 
  }
  
  var formEdgePt4O2Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor7
  } );
  force_group_f.add(forceFaceADO2)

  var edgeSize7 = areaADO2 * 0.02;
  edgeSize7 = THREE.MathUtils.clamp(edgeSize7, 0.01, 0.5);
  
  //create end sphere for bottom vertice 1
  const endPtVertice7SpV = addVectorAlongDir(formBtPt4, formPtO2new, -0.14);
  const endPtVertice7Sp = addEdgeSphere(edgeSize7, endPtVertice7SpV, formedgeColor7)
  //create edge bottom vertice 1
  const endPtVertice7 = addVectorAlongDir(formPtO2new,formBtPt4,  -0.1);
  const formEdge7 = createCylinderMesh(endPtVertice7SpV,endPtVertice7,formEdgePt4O2Material,edgeSize7,edgeSize7);

  form_group_e.add(endPtVertice7Sp)
  form_group_e.add(formEdge7)


  // triangle CDO2 - 8
  var normalCDO2_a = subVec(forcePtD, forcePtC);
  var normalCDO2_b = subVec(forcePtC, ForceO2);
  var normalCDO2 = cross(normalCDO2_a, normalCDO2_b);
  var edgePt3O2 = subVec(formBtPt3, formPtO2new);
  var resultPt3O2 = normalCDO2.dot(edgePt3O2);

  if (resultPt3O2 < 0){
    if (areaCDO2/areaMax >= 0.75){
      formedgeColor8 = 0x0F3150
    }
    if (0.5 <= areaCDO2/areaMax & areaCDO2/areaMax < 0.75){
      formedgeColor8 = 0x05416D
    }
    if (0.25 <= areaCDO2/areaMax & areaCDO2/areaMax  < 0.5){
      formedgeColor8 = 0x376D9B
    }
    if (0 <= areaCDO2/areaMax & areaCDO2/areaMax < 0.25){
      formedgeColor8 = 0x5B84AE
    }
    var forceFaceCDO2 = ForceFace3pt(forcePtD, ForceO2, forcePtC, formedgeColor8);
  } else{
    if (areaCDO2/areaMax >= 0.75){
      formedgeColor8 = 0x80002F
    }
    if (0.5 <= areaCDO2/areaMax & areaCDO2/areaMax < 0.75){
      formedgeColor8 = 0x940041
    }
    if (0.25 <= areaCDO2/areaMax & areaCDO2/areaMax  < 0.5){
      formedgeColor8 = 0xCC0549
    }
    if (0 <= areaCDO2/areaMax & areaCDO2/areaMax < 0.25){
      formedgeColor8 = 0xD72F62
    }
    var forceFaceCDO2 = ForceFace3pt(forcePtD, ForceO2, forcePtC, formedgeColor8); 
  }
  
  var formEdgePt3O2Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor8
  } );
  force_group_f.add(forceFaceCDO2)

  var edgeSize8 = areaCDO2 * 0.02;
  edgeSize8 = THREE.MathUtils.clamp(edgeSize8, 0.01, 0.5);
  
  //create end sphere for bottom vertice 1
  const endPtVertice8SpV = addVectorAlongDir(formBtPt3, formPtO2new, -0.14);
  const endPtVertice8Sp = addEdgeSphere(edgeSize8, endPtVertice8SpV, formedgeColor8)
  //create edge bottom vertice 1
  const endPtVertice8 = addVectorAlongDir(formPtO2new,formBtPt3,  -0.1);
  const formEdge8 = createCylinderMesh(endPtVertice8SpV,endPtVertice8,formEdgePt3O2Material,edgeSize8,edgeSize8);

  form_group_e.add(endPtVertice8Sp)
  form_group_e.add(formEdge8)






  // ********************************** Minkowski Sum Generation ************************************

  //Minkowski Test
  var formMSedgeMaterial=new THREE.MeshPhongMaterial( { 
    color:  "lightgrey"
  } );

  var minkedgeSize = 0.005
  // chose the start point - formPtO1new (z - 0.5)
  var minkStPt = new THREE.Vector3(formPtO1new.x, formPtO1new.y, formPtO1new.z)

  // 1 - force cell ABCO1
  var formMSedgeBO1temp = subVecUpdated(forcePtB, ForceO1)
  var formMSptBO1 = new THREE.Vector3(minkStPt.x - minkscale.l * formMSedgeBO1temp.x, minkStPt.y - minkscale.l * formMSedgeBO1temp.y, minkStPt.z - minkscale.l * formMSedgeBO1temp.z);
  const formMSedgeBO1 = createCylinderMesh(minkStPt,formMSptBO1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeBO1)

  var formMSedgeAO1temp = subVecUpdated(forcePtA, ForceO1)
  var formMSptAO1 = new THREE.Vector3(minkStPt.x - minkscale.l * formMSedgeAO1temp.x, minkStPt.y - minkscale.l * formMSedgeAO1temp.y, minkStPt.z - minkscale.l * formMSedgeAO1temp.z);
  const formMSedgeAO1 = createCylinderMesh(minkStPt,formMSptAO1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeAO1)

  var formMSedgeCO1temp = subVecUpdated(forcePtC, ForceO1)
  var formMSptCO1 = new THREE.Vector3(minkStPt.x - minkscale.l * formMSedgeCO1temp.x, minkStPt.y - minkscale.l * formMSedgeCO1temp.y, minkStPt.z - minkscale.l * formMSedgeCO1temp.z);
  const formMSedgeCO1 = createCylinderMesh(minkStPt,formMSptCO1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeCO1)

  const formMSedgeBO1AO1 = createCylinderMesh(formMSptBO1,formMSptAO1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeBO1AO1 )
  const formMSedgeBO1CO1 = createCylinderMesh(formMSptBO1,formMSptCO1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeBO1CO1 )
  const formMSedgeAO1CO1 = createCylinderMesh(formMSptAO1,formMSptCO1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeAO1CO1 )

  // 1.1 - project to formBtPt1
  // a. from formMSptBO1 (0.8 is the max number of minkscale.l)
  var formMSptPt1O1temp = subVecUpdated(formPtO1new, formBtPt1);
  var formMSptBO1_Pt1O1 = new THREE.Vector3(formMSptBO1.x + (0.8-minkscale.l) * formMSptPt1O1temp.x, formMSptBO1.y + (0.8-minkscale.l)  * formMSptPt1O1temp.y, formMSptBO1.z + (0.8-minkscale.l)  * formMSptPt1O1temp.z);
  const formMSedgeBO1_Pt1O1 = createCylinderMesh(formMSptBO1,formMSptBO1_Pt1O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeBO1_Pt1O1 )

  var formMSptAO1_Pt1O1 = new THREE.Vector3(formMSptAO1.x + (0.8-minkscale.l) * formMSptPt1O1temp.x, formMSptAO1.y + (0.8-minkscale.l)  * formMSptPt1O1temp.y, formMSptAO1.z + (0.8-minkscale.l)  * formMSptPt1O1temp.z);
  const formMSedgeAO1_Pt1O1 = createCylinderMesh(formMSptAO1,formMSptAO1_Pt1O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeAO1_Pt1O1 )

  var formMSptO1_Pt1O1 = new THREE.Vector3(minkStPt.x + (0.8-minkscale.l) * formMSptPt1O1temp.x, minkStPt.y + (0.8-minkscale.l)  * formMSptPt1O1temp.y, minkStPt.z + (0.8-minkscale.l)  * formMSptPt1O1temp.z);
  const formMSedgeO1_Pt1O1 = createCylinderMesh(minkStPt,formMSptO1_Pt1O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeO1_Pt1O1 )

  const formMSedgeformBtPt1_1 = createCylinderMesh(formMSptBO1_Pt1O1,formMSptAO1_Pt1O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformBtPt1_1 )
  const formMSedgeformBtPt1_2 = createCylinderMesh(formMSptBO1_Pt1O1,formMSptO1_Pt1O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformBtPt1_2 )
  const formMSedgeformBtPt1_3 = createCylinderMesh(formMSptAO1_Pt1O1,formMSptO1_Pt1O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformBtPt1_3 )

  // 1.2 - project to formBtPt2
  var formMSptPt2O1temp = subVecUpdated(formPtO1new, formBtPt2);
  var formMSptBO1_Pt2O1 = new THREE.Vector3(formMSptBO1.x + (0.8-minkscale.l) * formMSptPt2O1temp.x, formMSptBO1.y + (0.8-minkscale.l)  * formMSptPt2O1temp.y, formMSptBO1.z + (0.8-minkscale.l)  * formMSptPt2O1temp.z);
  const formMSedgeBO1_Pt2O1 = createCylinderMesh(formMSptBO1,formMSptBO1_Pt2O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeBO1_Pt2O1 )

  var formMSptCO1_Pt2O1 = new THREE.Vector3(formMSptCO1.x + (0.8-minkscale.l) * formMSptPt2O1temp.x, formMSptCO1.y + (0.8-minkscale.l)  * formMSptPt2O1temp.y, formMSptCO1.z + (0.8-minkscale.l)  * formMSptPt2O1temp.z);
  const formMSedgeCO1_Pt2O1 = createCylinderMesh(formMSptCO1,formMSptCO1_Pt2O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeCO1_Pt2O1 )

  var formMSptO1_Pt2O1 = new THREE.Vector3(minkStPt.x + (0.8-minkscale.l) * formMSptPt2O1temp.x, minkStPt.y + (0.8-minkscale.l)  * formMSptPt2O1temp.y, minkStPt.z + (0.8-minkscale.l)  * formMSptPt2O1temp.z);
  const formMSedgeO1_Pt2O1 = createCylinderMesh(minkStPt,formMSptO1_Pt2O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeO1_Pt2O1 )

  const formMSedgeformBtPt2_1 = createCylinderMesh(formMSptBO1_Pt2O1,formMSptCO1_Pt2O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformBtPt2_1 )
  const formMSedgeformBtPt2_2 = createCylinderMesh(formMSptBO1_Pt2O1,formMSptO1_Pt2O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformBtPt2_2 )
  const formMSedgeformBtPt2_3 = createCylinderMesh(formMSptCO1_Pt2O1,formMSptO1_Pt2O1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformBtPt2_3 )

  // 2 - force cell ACO1O2
  // 2.1 - project face ACO1 to formPtO3new
  var formMSptO1O3temp = subVecUpdated(formPtO1new, formPtO3new);  
  var formMSptAO1_ACO1O2 = new THREE.Vector3(minkStPt.x + (0.8-minkscale.l)  * formMSptO1O3temp.x, minkStPt.y + (0.8-minkscale.l)  * formMSptO1O3temp.y, minkStPt.z + (0.8-minkscale.l)  * formMSptO1O3temp.z);
  const formMSedgeAO1_ACO1O2  = createCylinderMesh(minkStPt,formMSptAO1_ACO1O2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeAO1_ACO1O2)

  var formMSptO1_ACO1O2 = new THREE.Vector3(formMSptAO1.x + (0.8-minkscale.l)  * formMSptO1O3temp.x, formMSptAO1.y + (0.8-minkscale.l)  * formMSptO1O3temp.y, formMSptAO1.z + (0.8-minkscale.l)  * formMSptO1O3temp.z);
  const formMSedgeO1_ACO1O2  = createCylinderMesh(formMSptAO1,formMSptO1_ACO1O2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeO1_ACO1O2)

  var formMSptCO1_ACO1O2 = new THREE.Vector3(formMSptCO1.x + (0.8-minkscale.l)  * formMSptO1O3temp.x, formMSptCO1.y + (0.8-minkscale.l)  * formMSptO1O3temp.y, formMSptCO1.z + (0.8-minkscale.l)  * formMSptO1O3temp.z);
  const formMSedgeCO1_ACO1O2  = createCylinderMesh(formMSptCO1,formMSptCO1_ACO1O2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeCO1_ACO1O2)
  // 2.2 - find projected o2 for ACO1O2
  var formMSedgeO1O2temp = subVecUpdated(ForceO2, ForceO1)
  var formMSptO1O2 = new THREE.Vector3( formMSptAO1_ACO1O2.x - minkscale.l * formMSedgeO1O2temp.x,  formMSptAO1_ACO1O2.y - minkscale.l * formMSedgeO1O2temp.y,  formMSptAO1_ACO1O2.z - minkscale.l * formMSedgeO1O2temp.z);
  const formMSedgeO1O2 = createCylinderMesh( formMSptAO1_ACO1O2,formMSptO1O2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeO1O2)

  const formMSedgeformO3_1 = createCylinderMesh(formMSptAO1_ACO1O2,formMSptO1_ACO1O2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformO3_1 )
  const formMSedgeformO3_2 = createCylinderMesh(formMSptO1O2,formMSptO1_ACO1O2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformO3_2 )
  const formMSedgeformO3_3 = createCylinderMesh(formMSptAO1_ACO1O2,formMSptCO1_ACO1O2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformO3_3 )
  const formMSedgeformO3_4 = createCylinderMesh(formMSptO1O2,formMSptCO1_ACO1O2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformO3_4 )
  const formMSedgeformO3_5 = createCylinderMesh(formMSptO1_ACO1O2,formMSptCO1_ACO1O2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedgeformO3_5 )
  
  // 2.2 - projected to formBtPt2
  var formMSptPt2O1temp_ACO1O2 = subVecUpdated(formPtO3new, formBtPt2);
  var formMSpt_ACO1O2_1 = new THREE.Vector3(formMSptO1O2.x + (0.8-minkscale.l) * formMSptPt2O1temp_ACO1O2.x, formMSptO1O2.y + (0.8-minkscale.l)  * formMSptPt2O1temp_ACO1O2.y, formMSptO1O2.z + (0.8-minkscale.l)  * formMSptPt2O1temp_ACO1O2.z);
  const formMSedge_ACO1O2_Pt2O3_1 = createCylinderMesh(formMSptO1O2,formMSpt_ACO1O2_1 ,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedge_ACO1O2_Pt2O3_1 )

  var formMSpt_ACO1O2_2 = new THREE.Vector3(formMSptCO1_ACO1O2.x + (0.8-minkscale.l) * formMSptPt2O1temp_ACO1O2.x, formMSptCO1_ACO1O2.y + (0.8-minkscale.l)  * formMSptPt2O1temp_ACO1O2.y, formMSptCO1_ACO1O2.z + (0.8-minkscale.l)  * formMSptPt2O1temp_ACO1O2.z);
  const formMSedge_ACO1O2_Pt2O3_2 = createCylinderMesh(formMSptCO1_ACO1O2,formMSpt_ACO1O2_2 ,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedge_ACO1O2_Pt2O3_2 )

  var formMSpt_ACO1O2_3 = new THREE.Vector3(formMSptAO1_ACO1O2.x + (0.8-minkscale.l) * formMSptPt2O1temp_ACO1O2.x, formMSptAO1_ACO1O2.y + (0.8-minkscale.l)  * formMSptPt2O1temp_ACO1O2.y, formMSptAO1_ACO1O2.z + (0.8-minkscale.l)  * formMSptPt2O1temp_ACO1O2.z);
  const formMSedge_ACO1O2_Pt2O3_3 = createCylinderMesh(formMSptAO1_ACO1O2,formMSpt_ACO1O2_3 ,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedge_ACO1O2_Pt2O3_3 )
  //triangle projected at formBtPt2
  const formMSedge_tri_Pt2O3_1 = createCylinderMesh(formMSpt_ACO1O2_1,formMSpt_ACO1O2_2 ,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  const formMSedge_tri_Pt2O3_2 = createCylinderMesh(formMSpt_ACO1O2_1,formMSpt_ACO1O2_3 ,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  const formMSedge_tri_Pt2O3_3 = createCylinderMesh(formMSpt_ACO1O2_2,formMSpt_ACO1O2_3 ,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add( formMSedge_tri_Pt2O3_1 )
  form_group_mink.add( formMSedge_tri_Pt2O3_2 )
  form_group_mink.add( formMSedge_tri_Pt2O3_3 )

  // 3 - force cell ADO2
  // 3.1 - project face ACO2 to formPtO2new
  var formMSptO2O3temp = subVecUpdated(formPtO3new, formPtO2new);  
  var formMSptADO2_1 = new THREE.Vector3(formMSptO1O2.x + (0.8-minkscale.l)  * formMSptO2O3temp.x, formMSptO1O2.y + (0.8-minkscale.l)  * formMSptO2O3temp.y, formMSptO1O2.z + (0.8-minkscale.l)  * formMSptO2O3temp.z);
  const formMSedgeADO2_1 = createCylinderMesh(formMSptO1O2,formMSptADO2_1,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeADO2_1)

  var formMSptADO2_2 = new THREE.Vector3(formMSptCO1_ACO1O2.x + (0.8-minkscale.l)  * formMSptO2O3temp.x, formMSptCO1_ACO1O2.y + (0.8-minkscale.l)  * formMSptO2O3temp.y, formMSptCO1_ACO1O2.z + (0.8-minkscale.l)  * formMSptO2O3temp.z);
  const formMSedgeADO2_2 = createCylinderMesh(formMSptCO1_ACO1O2,formMSptADO2_2,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeADO2_2)

  var formMSptADO2_3 = new THREE.Vector3(formMSptO1_ACO1O2.x + (0.8-minkscale.l)  * formMSptO2O3temp.x, formMSptO1_ACO1O2.y + (0.8-minkscale.l)  * formMSptO2O3temp.y, formMSptO1_ACO1O2.z + (0.8-minkscale.l)  * formMSptO2O3temp.z);
  const formMSedgeADO2_3 = createCylinderMesh(formMSptO1_ACO1O2,formMSptADO2_3,formMSedgeMaterial,minkedgeSize,minkedgeSize);
  form_group_mink.add(formMSedgeADO2_3)





















  scene.add(form_group_v);
  scene.add(form_group_f);
  scene.add(form_group_e);
  scene.add(form_group_c);
  scene.add(form_general);
  // scene.add(form_group_e_trial);
  // scene.add(form_general_trial);
  scene.add(form_group_mink);

  scene2.add(force_group_v);
  scene2.add(force_group_f);
  scene2.add(force_group_e);
  scene2.add(force_group_c);
  scene2.add(force_general);

  scene2.add(force_group_e_trial);
  scene2.add(force_group_f_trial);
  scene2.add(force_general_trial);
  scene2.add(force_group_mink);


}















function initModel() {
  Redraw();
  trfm_ctrl = new TransformControls(camera, renderer.domElement);

  trfm_ctrl.addEventListener('change', render);
  trfm_ctrl.addEventListener('objectChange', function(e) {
    if(Math.abs(selectObj.position.x) <= 2 && Math.abs(selectObj.position.y)<=2 && Math.abs(selectObj.position.z) <= 2)
    {
      if(selectObj.name.charAt(2)==='1')
      {
        formBtPt1.x=selectObj.position.x;
        formBtPt1.y=selectObj.position.y;
        formBtPt1.z=selectObj.position.z;
      }

      if(selectObj.name.charAt(2)==='2')
      {
        formBtPt2.x=selectObj.position.x;
        formBtPt2.y=selectObj.position.y;
        formBtPt2.z=selectObj.position.z;
      }

      if(selectObj.name.charAt(2)==='3')
      {
        formBtPt3.x=selectObj.position.x;
        formBtPt3.y=selectObj.position.y;
        formBtPt3.z=selectObj.position.z;
      }

      if(selectObj.name.charAt(2)==='4')
      {
        formBtPt4.x=selectObj.position.x;
        formBtPt4.y=selectObj.position.y;
        formBtPt4.z=selectObj.position.z;
      }
      Redraw();
    }
  })

  trfm_ctrl.addEventListener('mouseDown', (evt) => {
    orbit_ctrl.enabled = false;
    
    });

  trfm_ctrl.addEventListener('mouseUp', (evt) => {

    orbit_ctrl.enabled = true;
  });

  function onMouseDown(event) 
  {
  
    //event.preventDefault();
    rayCaster.setFromCamera(mouse, camera);
    //var rayCaster = getRay(event);
    var intersects = rayCaster.intersectObjects(Ctrl_pts);
    
    if (event.button === 2) { 
      trfm_ctrl.detach();
    }
    //document.addEventListener('mousemove', onMouseMove);

    if (event.button === 0&&intersects[0]) 
      {
        selectObj = intersects[0].object;
        trfm_ctrl.attach(selectObj);

        // trfm_ctrl.position.update();
        // console.log(selectObj.position)
        // console.log(trfm_ctrl.position)
      }
  }
  function onMouseUp(event) 
  {
    leftMouseDown = false;
    rightMouseDown = false;
    //document.removeEventListener('mousemove', onMouseMove);
  }
    
  function onMouseMove(event) 
  {
    event.preventDefault();
    
    mouse.x = ((event.clientX*2)/window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY/window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( Ctrl_pts);

    if(intersects.length > 0) {
        $('html,body').css('cursor', 'pointer');
    } else {
        $('html,body').css('cursor', 'default');
    }
  }
  
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousemove', onMouseMove);

  document.oncontextmenu = function (event) {
    event.preventDefault();
  };

  scene.add(trfm_ctrl);

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




// *********************** Basic settings ***********************

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


var INTERSECTED;
//rendering the scenes
function render() 
{

  //var rayCaster=new THREE.Raycaster();
  rayCaster.setFromCamera(mouse, camera);
  var intersects = rayCaster.intersectObjects(Ctrl_pts);

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
            //console.log("selectobj.name="+intersects[0].object.name.charAt(2));
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

// *************** support functions *******************


function create_force_face(point1,point2,pointO){
  var face = new THREE.Vector3().crossVectors(
     new THREE.Vector3().subVectors( point1, pointO ),
     new THREE.Vector3().subVectors( point2, pointO ),
     ).length()/2

  return face
}


function subVec(n1, n2) {
  var sub = new THREE.Vector3(0, 0, 0);
  sub.x = n1.x - n2.x;
  sub.y = n1.y - n2.y;
  sub.z = n1.z - n2.z;
  return sub;
}

function subVecUpdated(n2, n1) {
  var sub = new THREE.Vector3(0, 0, 0);
  sub.x = n1.x - n2.x;
  sub.y = n1.y - n2.y;
  sub.z = n1.z - n2.z;
  return sub;
}


function cross(n1, n2) {
  var ncross = new THREE.Vector3(0, 0, 0);
  ncross.x = ((n1.y * n2.z) - (n1.z * n2.y));
  ncross.y = ((n1.z * n2.x) - (n1.x * n2.z));
  ncross.z = ((n1.x * n2.y) - (n1.y * n2.x));
  return ncross;

}
function Pnt_copy(n1) {

  var n2 = new THREE.Vector3(0, 0, 0);
  n2.x = n1.x;
  n2.y = n1.y;
  n2.z = n1.z;
  return n2;
}
function norm(n1) {
  var nnorm = Math.sqrt(n1.x * n1.x + n1.y * n1.y + n1.z * n1.z);
  return nnorm;
}

function LinesSectPt(L1_dir, P1_pnt, L2_dir, P2_pnt) {

  var L1_dir1 = new THREE.Vector3(0, 0, 0);
  var L2_dir2 = new THREE.Vector3(0, 0, 0);

  L1_dir1 = Pnt_copy(L1_dir);
  L2_dir2 = Pnt_copy(L2_dir);



  L1_dir1.x = L1_dir.x / norm(L1_dir);
  L1_dir1.y = L1_dir.y / norm(L1_dir);

  L2_dir2.x = L2_dir.x / norm(L2_dir);
  L2_dir2.y = L2_dir.y / norm(L2_dir);
  L2_dir2.z = L2_dir.z / norm(L2_dir);


  var P1P2_Vec = new THREE.Vector3(0, 0, 0);
  P1P2_Vec.x = P2_pnt.x - P1_pnt.x;
  P1P2_Vec.y = P2_pnt.y - P1_pnt.y;
  P1P2_Vec.z = P2_pnt.z - P1_pnt.z;


  var P2P3_Norm = norm(cross(P1P2_Vec, L1_dir1));



  var P3_pnt = new THREE.Vector3(0, 0, 0);

  P3_pnt.x = P1_pnt.x + ((P1P2_Vec.x * L1_dir1.x + P1P2_Vec.y * L1_dir1.y + P1P2_Vec.z * L1_dir1.z)) * L1_dir1.x;
  P3_pnt.y = P1_pnt.y + ((P1P2_Vec.x * L1_dir1.x + P1P2_Vec.y * L1_dir1.y + P1P2_Vec.z * L1_dir1.z)) * L1_dir1.y;
  P3_pnt.z = P1_pnt.z + ((P1P2_Vec.x * L1_dir1.x + P1P2_Vec.y * L1_dir1.y + P1P2_Vec.z * L1_dir1.z)) * L1_dir1.z;

  var CosTheta = Math.abs(L1_dir1.x * L2_dir2.x + L1_dir1.y * L2_dir2.y + L1_dir1.z * L2_dir2.z);


  var k_pnt = new THREE.Vector3(0, 0, 0);

  if (CosTheta < 0) {
      k_pnt = Pnt_copy(P3_pnt);

  }

  if (CosTheta > 0) {
      var Tantheta = Math.sqrt((1 - Math.pow(CosTheta, 2))) / CosTheta;
      var KP3_Norm = P2P3_Norm / Tantheta;

      var K1_pnt = new THREE.Vector3((P3_pnt.x + KP3_Norm * L1_dir1.x), (P3_pnt.y + KP3_Norm * L1_dir1.y), (P3_pnt.z + KP3_Norm * L1_dir1.z));
      var K2_pnt = new THREE.Vector3((P3_pnt.x - KP3_Norm * L1_dir1.x), (P3_pnt.y - KP3_Norm * L1_dir1.y), (P3_pnt.z - KP3_Norm * L1_dir1.z));



      var P2K1_vec = new THREE.Vector3((K1_pnt.x - P2_pnt.x), (K1_pnt.y - P2_pnt.y), (K1_pnt.z - P2_pnt.z));
      var P2K2_vec = new THREE.Vector3((K2_pnt.x - P2_pnt.x), (K2_pnt.y - P2_pnt.y), (K2_pnt.z - P2_pnt.z));

      var D1 = norm(cross(P2K1_vec, L2_dir2));
      var D2 = norm(cross(P2K2_vec, L2_dir2));


      if (D1 < D2)
          k_pnt = Pnt_copy(K1_pnt);
      else
          k_pnt = Pnt_copy(K2_pnt);

  }

  return k_pnt;


}


// ****************** normal directions *******************
function CalNormalVector(vec1, vec2, vec3, n) {

  const VecCB = new THREE.Vector3();
  const VecAB = new THREE.Vector3();
  const normal = new THREE.Vector3();
  VecCB.subVectors(vec1, vec2);
  VecAB.subVectors(vec3, vec2);
  VecAB.cross(VecCB);
  normal.copy(VecAB).normalize();


  var newPoint = new THREE.Vector3(n * normal.x, n * normal.y, n * normal.z);
  return newPoint;
}

function CalNormalVectorUpdated(vec1, vec2, vec3, n) {

  const VecCB = new THREE.Vector3();
  const VecAB = new THREE.Vector3();
  const normal = new THREE.Vector3();
  VecCB.subVectors(vec1, vec2);
  VecAB.subVectors(vec2, vec3);
  VecAB.cross(VecCB);
  normal.copy(VecAB).normalize();


  var newPoint = new THREE.Vector3(n * normal.x, n * normal.y, n * normal.z);
  return newPoint;
}



//****************** arrow *****************************
function addVectorAlongDir (pt1, pt2, len){
  var C = new THREE.Vector3();
  C.subVectors( pt2, pt1 ).multiplyScalar( 1 + ( len / C.length() ) ).add( pt1 );
  return C
}
//****************** arrow *****************************
function createCylinderArrowMesh(pointX, pointY, material, radius, radiusCone, edgeLengthRatio) 
{
var arrows = new THREE.Group();
var direction = new THREE.Vector3().subVectors(pointY, pointX);
var l = direction.length();
if (radius === undefined) {
  radius = l * 0.01;
}
// fixedConeLength = fixedConeLength !== undefined ? fixedConeLength : 4;
if (radiusCone === undefined) {
  radiusCone = 2 * radius;
}
// edgeLengthRatio = edgeLengthRatio !== undefined ? edgeLengthRatio : 0.7 ;
var pointMid = new THREE.Vector3().addVectors(pointX, edgeLengthRatio * direction);
var orientation = new THREE.Matrix4();
orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
orientation.multiply(new THREE.Matrix4().set
  (1, 0, 0, 0,
  0, 0, 1, 0,
  0, -1, 0, 0,
  0, 0, 0, 1));

var edgeGeometry;
var coneGeometry;
if (edgeLengthRatio !== undefined) {
  edgeGeometry = new THREE.CylinderGeometry(radius, radius, edgeLengthRatio * l, 8, 1);
  coneGeometry = new THREE.CylinderGeometry(0, radiusCone, (1-edgeLengthRatio) * l, 8, 1);
  edgeGeometry.translate( 0,  -(0.5 - 0.5 * edgeLengthRatio) * l, 0 );
  coneGeometry.translate( 0,  (0.5 - 0.5 * (1 - edgeLengthRatio)) * l, 0 );

} else {
  // fixed length cone
  var fixedConeLength = 1;
  edgeGeometry = new THREE.CylinderGeometry(radius, radius, l - fixedConeLength, 8, 1);
  coneGeometry = new THREE.CylinderGeometry(0, radiusCone, fixedConeLength, 8, 1);
  edgeGeometry.translate( 0, - 0.5 * fixedConeLength, 0 );
  coneGeometry.translate( 0, 0.5 * (l - fixedConeLength), 0 );
  
}
var arrow = new THREE.Mesh(edgeGeometry, material);
arrow.applyMatrix4(orientation);
arrow.position.x = (pointY.x + pointX.x) / 2;
arrow.position.y = (pointY.y + pointX.y) / 2;
arrow.position.z = (pointY.z + pointX.z) / 2;

var arrow2 = new THREE.Mesh(coneGeometry, material);
arrow2.applyMatrix4(orientation);
arrow2.position.x = (pointY.x + pointX.x) / 2;
arrow2.position.y = (pointY.y + pointX.y) / 2;
arrow2.position.z = (pointY.z + pointX.z) / 2;

arrows.add(arrow);
arrows.add(arrow2);
return arrows;
}

//****************** cylinder *****************************
function createCylinderMesh(pointX, pointY, material1, radius, radius2) 
{
if (radius === undefined) {
  radius = 1;
}
if (radius2 === undefined) {
  radius2 = radius;
}
var direction = new THREE.Vector3().subVectors(pointY, pointX);
var orientation = new THREE.Matrix4();
orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
orientation.multiply(new THREE.Matrix4().set
  (1, 0, 0, 0,
  0, 0, 1, 0,
  0, -1, 0, 0,
  0, 0, 0, 1));
var edgeGeometry = new THREE.CylinderGeometry(radius, radius2, direction.length(), 40, 1);
var edge = new THREE.Mesh(edgeGeometry, material1);
edge.applyMatrix4(orientation);
// position based on midpoints - there may be a better solution than this
edge.position.x = (pointY.x + pointX.x) / 2;
edge.position.y = (pointY.y + pointX.y) / 2;
edge.position.z = (pointY.z + pointX.z) / 2;
//console.log("pos=", edge.position.x);
edge.castShadow = true;
return edge;
}

//***************** construct form vertices ***********************
function addVertice(size, name, location){
  var pt_material = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
  var pt_geo = new THREE.SphereGeometry(size);
  var pt_sphare = new THREE.Mesh(pt_geo, pt_material);
  
  pt_sphare.name= name;
  pt_sphare.position.copy(location);
  pt_sphare.castShadow=true;

  return pt_sphare
}

//construct vertices outlines
function addVerticeOut(size, location, scale){
  var pt_material_outline = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
  var pt_geo = new THREE.SphereGeometry(size);
  var pt_geo_outline = new THREE.Mesh( pt_geo, pt_material_outline );
  pt_geo_outline.position.copy(location);
  pt_geo_outline.scale.multiplyScalar(scale);

  return pt_geo_outline
}

//***************** construct form edge ***********************
function addEdgeSphere(size, location, color){
  var pt_material = new THREE.MeshPhongMaterial({color: color, transparent: false});
  var pt_geo = new THREE.SphereGeometry(size);
  var pt_sphare = new THREE.Mesh(pt_geo, pt_material);
  
  pt_sphare.position.copy(location);
  pt_sphare.castShadow=true;

  return pt_sphare
}


//***************** construct faces ***********************
//form faces - green color
function FormFace3ptGN(pt1, pt2, pt3){ 
  
  let geometry = new THREE.BufferGeometry()
  const points = [
      pt1,
      pt2,
      pt3,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()
  const material_greenfaces = [
      //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
      new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 1 }),
      new THREE.MeshPhongMaterial({
          color: 0x009600, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

//form faces - grey color
function FormFace3ptGR(pt1, pt2, pt3){
  
  let geometry = new THREE.BufferGeometry()
  const points = [
      pt1,
      pt2,
      pt3,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()
  const material_greenfaces = [
      //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
      new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({
          color: 0x808080, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

//force faces
function ForceFace3pt(pt1, pt2, pt3, color){
  
  let geometry = new THREE.BufferGeometry()
  const points = [
      pt1,
      pt2,
      pt3,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()
  const material_greenfaces = [
      //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
      //new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({
          color: color, 
          // transparent: true, 
          // opacity: 0.7, 
          side: THREE.DoubleSide, 
          // depthWrite: false 
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}


function FormPlane(pt1, pt2, pt3, pt4){
  
  let geometry = new THREE.BufferGeometry()
  const points = [
      pt1,
      pt2,
      pt3,

      pt1,
      pt3,
      pt4,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()
  const material_greenfaces = [
      //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
      //new THREE.MeshBasicMaterial({ color: "black", wireframe: false, transparent: true, opacity: 0.4 }),
      new THREE.MeshPhongMaterial({
          color: "darkgrey", transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}


//force faces - green color
function ForceFace4ptGN(pt1, pt2, pt3, pt4){
  

  let geometry = new THREE.BufferGeometry()
  const points = [
      pt1,
      pt2,
      pt3,

      pt1,
      pt3,
      pt4,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()
  const material_greenfaces = [
      //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
      new THREE.MeshBasicMaterial({ color: "black", wireframe: true, transparent: true, opacity: 0.8 }),
      new THREE.MeshPhongMaterial({
          color: 0x009600, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

function FormFace4ptGN(pt1, pt2, pt3, pt4){
  

  let geometry = new THREE.BufferGeometry()
  const points = [
      pt1,
      pt2,
      pt3,

      pt1,
      pt3,
      pt4,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()
  const material_greenfaces = [
      //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
      //new THREE.MeshBasicMaterial({ color: 0x009600, wireframe: false, transparent: true, opacity: 0.1}),
      new THREE.MeshPhongMaterial({
          color: 0x009600, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

//force trial faces - grey color
function ForceTrialFace(pt1, pt2, pt3, pt4, ptO){
  
  let geometry = new THREE.BufferGeometry()
  const points = [
      pt1,
      pt2,
      ptO,

      pt2,
      pt3,
      ptO,

      pt3,
      pt4,
      ptO,

      pt1,
      pt4,
      ptO,

      pt1,
      pt3,
      ptO,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()
  const material_greenfaces = [
      //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
      new THREE.MeshBasicMaterial({ color: "white", wireframe: true, transparent: true, opacity: 0.2 }),
      new THREE.MeshPhongMaterial({
          color: "grey", transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  
  return mesh
}

//***************** construct dash lines ***********************
function dashLinesGR(pt1, pt2, sizein, sizeout, scale){
  
  var dashline = new THREE.Group();

  var dashlineMaterial=new THREE.MeshPhongMaterial( {
      color:  0x009600//green
    } );
  var dashlineMaterial_out = new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
    
  var od1 = pt1.distanceTo(pt2);

  var dl0 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.08/od1),(pt1.y + (pt2.y-pt1.y)*0.08/od1),(pt1.z + (pt2.z-pt1.z)*0.08/od1));
  var dl1 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.25/od1),(pt1.y + (pt2.y-pt1.y)*0.25/od1),(pt1.z + (pt2.z-pt1.z)*0.25/od1));

  var dl2 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.28/od1),(pt1.y + (pt2.y-pt1.y)*0.28/od1),(pt1.z + (pt2.z-pt1.z)*0.28/od1));
  var dl3 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.45/od1),(pt1.y + (pt2.y-pt1.y)*0.45/od1),(pt1.z + (pt2.z-pt1.z)*0.45/od1));
  
  var dl4 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.48/od1),(pt1.y + (pt2.y-pt1.y)*0.48/od1),(pt1.z + (pt2.z-pt1.z)*0.48/od1));
  var dl5 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.65/od1),(pt1.y + (pt2.y-pt1.y)*0.65/od1),(pt1.z + (pt2.z-pt1.z)*0.65/od1));

  var dl6 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.68/od1),(pt1.y + (pt2.y-pt1.y)*0.68/od1),(pt1.z + (pt2.z-pt1.z)*0.68/od1));
  var dl7 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.85/od1),(pt1.y + (pt2.y-pt1.y)*0.85/od1),(pt1.z + (pt2.z-pt1.z)*0.85/od1));

  var dl8 = new THREE.Vector3((pt1.x + (pt2.x-pt1.x)*0.88/od1),(pt1.y + (pt2.y-pt1.y)*0.88/od1),(pt1.z + (pt2.z-pt1.z)*0.88/od1));

  var al1 = createCylinderMesh(dl0,dl1,dashlineMaterial,sizein,sizein);
  var al1Out = createCylinderMesh(dl0,dl1,dashlineMaterial_out,sizeout,sizeout);
  al1Out.scale.multiplyScalar(scale);
  dashline.add(al1);
  dashline.add(al1Out);

  var al2 = createCylinderMesh(dl2,dl3,dashlineMaterial,sizein,sizein);
  var al2Out = createCylinderMesh(dl2,dl3,dashlineMaterial_out,sizeout,sizeout);
  al2Out.scale.multiplyScalar(scale);
  dashline.add(al2);
  dashline.add(al2Out);

  var al3 = createCylinderMesh(dl4,dl5,dashlineMaterial,sizein,sizein);
  var al3Out = createCylinderMesh(dl4,dl5,dashlineMaterial_out,sizeout,sizeout);
  al3Out.scale.multiplyScalar(scale);
  dashline.add(al3);
  dashline.add(al3Out);

  var al4 = createCylinderMesh(dl6,dl7,dashlineMaterial,sizein,sizein);
  var al4Out = createCylinderMesh(dl6,dl7,dashlineMaterial_out,sizeout,sizeout);
  al4Out.scale.multiplyScalar(scale);
  dashline.add(al4);
  dashline.add(al4Out);
  
  var al5 = createCylinderMesh(dl8,pt2,dashlineMaterial,sizein,sizein);
  var al5Out = createCylinderMesh(dl8,pt2,dashlineMaterial_out,sizeout,sizeout);
  al5Out.scale.multiplyScalar(scale);
  dashline.add(al5);
  dashline.add(al5Out);
  return dashline
}

function addCell3Face(point1,point2,point3,point4, scale){

  var centroid = new THREE.Vector3((point1.x+point2.x+point3.x+point4.x)/4,(point1.y+point2.y+point3.y+point4.y)/4,(point1.z+point2.z+point3.z+point4.z)/4);
  

  var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x)*scale, centroid.y + (point1.y - centroid.y)*scale, centroid.z + (point1.z - centroid.z)*scale );


  var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x)*scale, centroid.y + (point2.y - centroid.y)*scale, centroid.z + (point2.z - centroid.z)*scale );


  var scale_point3 = new THREE.Vector3(centroid.x + (point3.x - centroid.x)*scale, centroid.y + (point3.y - centroid.y)*scale, centroid.z + (point3.z - centroid.z)*scale );

  var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x)*scale, centroid.y + (point4.y - centroid.y)*scale, centroid.z + (point4.z - centroid.z)*scale );

   
  let geometry = new THREE.BufferGeometry()
  const points = [
      scale_point1,
      scale_point2,
      scale_point3,

      scale_point1,
      scale_point3,
      scale_point4,

      scale_point1,
      scale_point2,
      scale_point4,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()

  var material = [
  //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
  new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true,opacity:0.7}),
  new THREE.MeshPhongMaterial({
  color: "darkgrey",transparent: true,opacity:0.6,side:THREE.DoubleSide,depthWrite:false
  } )
  ];
  
  var cell = new createMultiMaterialObject(geometry, material);
  cell.castShadow = true;

  return cell

}


function addCell4Face(point1,point2,point3,point4, scale){

  var centroid = new THREE.Vector3((point1.x+point2.x+point3.x+point4.x)/4,(point1.y+point2.y+point3.y+point4.y)/4,(point1.z+point2.z+point3.z+point4.z)/4);
  

  var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x)*scale, centroid.y + (point1.y - centroid.y)*scale, centroid.z + (point1.z - centroid.z)*scale );


  var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x)*scale, centroid.y + (point2.y - centroid.y)*scale, centroid.z + (point2.z - centroid.z)*scale );


  var scale_point3 = new THREE.Vector3(centroid.x + (point3.x - centroid.x)*scale, centroid.y + (point3.y - centroid.y)*scale, centroid.z + (point3.z - centroid.z)*scale );

  var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x)*scale, centroid.y + (point4.y - centroid.y)*scale, centroid.z + (point4.z - centroid.z)*scale );

   
  let geometry = new THREE.BufferGeometry()
  const points = [
      scale_point1,
      scale_point2,
      scale_point3,

      scale_point1,
      scale_point3,
      scale_point4,

      scale_point1,
      scale_point2,
      scale_point4,

      scale_point2,
      scale_point3,
      scale_point4,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()

  var material = [
  //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
  new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true,opacity:0.7}),
  new THREE.MeshPhongMaterial({
  color: "darkgrey",side:THREE.DoubleSide,
  // depthWrite:false,
  // transparent: true,opacity:1,
  } )
  ];
  
  var cell = new createMultiMaterialObject(geometry, material);
  cell.castShadow = true;

  return cell

}

function create_trial_intec (startpoint,forceP1,forceP2,forceP3,intecP1,intecP1B){
                          
  var startpoint 
  
  var trial_startpoint_vec = CalNormalVector(forceP1,forceP2,forceP3,0.5);
  var trial_startpoint_intec_temp = new THREE.Vector3(startpoint.x-1.2*trial_startpoint_vec.x, startpoint.y-1.2*trial_startpoint_vec.y,startpoint.z-1.2*trial_startpoint_vec.z);   
  
  var dirtsP = new THREE.Vector3(); // create once an reuse it
  
  dirtsP.subVectors( startpoint,trial_startpoint_intec_temp ).normalize();
  
  var dirto = new THREE.Vector3(); // create once an reuse it
  
  dirto.subVectors( intecP1,intecP1B).normalize();
  
  var trial_intec = LinesSectPt(dirtsP,startpoint,dirto,intecP1);
  return  trial_intec

}

function createdashline (point1, point2,trialline_dash){

  var dashline = [];
  dashline.push(point1);
  dashline.push(point2);
 

  var dashline_geo = new THREE.BufferGeometry().setFromPoints( dashline );

  var trialline_dash = new THREE.LineDashedMaterial({
               color: "black",//color
               dashSize: 0.1,
              gapSize: 0.03,
              linewidth: 1

               });

  var dashline_edges = new THREE.LineSegments(dashline_geo,trialline_dash);
  dashline_edges.computeLineDistances();//compute
  return dashline_edges
}

function Cal_Plane_Line_Intersect_Point(Point_online,LineVec,Point_onPlane,PlaneVec){
 
  var IntersectPoint = new THREE.Vector3(
      //x
      Point_online.x+LineVec.x*((Point_onPlane.x - Point_online.x)*PlaneVec.x+(Point_onPlane.y - Point_online.y)*PlaneVec.y+(Point_onPlane.z - Point_online.z)*PlaneVec.z) / (PlaneVec.x* LineVec.x+ PlaneVec.y* LineVec.y+ PlaneVec.z* LineVec.z), 
      //y
      Point_online.y+LineVec.y*((Point_onPlane.x - Point_online.x)*PlaneVec.x+(Point_onPlane.y - Point_online.y)*PlaneVec.y+(Point_onPlane.z - Point_online.z)*PlaneVec.z) / (PlaneVec.x* LineVec.x+ PlaneVec.y* LineVec.y+ PlaneVec.z* LineVec.z),
      //z
      Point_online.z+LineVec.z*((Point_onPlane.x - Point_online.x)*PlaneVec.x+(Point_onPlane.y - Point_online.y)*PlaneVec.y+(Point_onPlane.z - Point_online.z)*PlaneVec.z) / (PlaneVec.x* LineVec.x+ PlaneVec.y* LineVec.y+ PlaneVec.z* LineVec.z))

 return IntersectPoint;
}

function ForceFace(pt0, pt1, pt2, pt3, pt4, pt5){
  
  let geometry = new THREE.BufferGeometry()
  const points = [
      pt0,
      pt1,
      pt5,

      pt1,
      pt2,
      pt5,

      pt0,
      pt2,
      pt5,

      pt0,
      pt3,
      pt4,

      pt2,
      pt3,
      pt4,

      pt0,
      pt2,
      pt4,

      pt2,
      pt4,
      pt5,

      pt0,
      pt4,
      pt5,
  ]

  geometry.setFromPoints(points)
  geometry.computeVertexNormals()
  const material_greenfaces = [
      //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
      new THREE.MeshBasicMaterial({ color: "black", wireframe: true, transparent: false, opacity: 0.01 }),
      new THREE.MeshPhongMaterial({
          color: 0x009600, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false
      })
  ];

  var mesh = new createMultiMaterialObject(geometry, material_greenfaces);
  mesh.children[0].castShadow = true;
  return mesh
}



function face_center(n1,n2,n3){

  var face_centerD=new THREE.Vector3();

      face_centerD.x=(n1.x+n2.x+n3.x)/3;
      face_centerD.y=(n1.y+n2.y+n3.y)/3;
      face_centerD.z=(n1.z+n2.z+n3.z)/3;

      return face_centerD;

}

function createSpriteText(text,pos){
  //canva
  var canvas = document.createElement("canvas");
  canvas.width=240;
  canvas.height=240;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "grey";
  ctx.font = "100px Palatino";
  ctx.lineWidth = 2;
  ctx.fillText(text.charAt(0),150,150);
  ctx.fillStyle = "grey";
  ctx.font = "50px Palatino";
  ctx.lineWidth = 2;
  ctx.fillText(text.charAt(1),210,170);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  //text
  var material = new THREE.SpriteMaterial({map:texture,transparent:true});
  var textObj = new THREE.Sprite(material);
  textObj.scale.set(0.5, 0.5, 0.5);


  //textObj.position.set(pos1);

  var posdir=Pnt_copy(pos);

  posdir.normalize();

  textObj.position.x =pos.x+0.1*posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
  textObj.position.y =pos.y+0.1*posdir.y;
  textObj.position.z =pos.z+0.1*posdir.z;


  return textObj;
}