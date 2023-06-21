import '/style.css'; //setup basic visual factors for the overall web

import * as THREE from 'three';
import * as Geo from '/Archive/js/functions.js';

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
    width: 2,
};
tab.pages[0].addInput(widthParams, 'width', {
    min: 1,
    max: 5,
}).on('change', (ev) => { //on change, dispose old geometry and create new
    boxMesh.geometry.dispose();
    globalWidth = ev.value;
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


// *********************** force diagram inital data ***********************

var force_group_v
var force_group_f
var force_group_e
var force_group_c
var force_general

var force_text


// *********************** redraw the form and force diagram when parametrer is changing ****************
function Redraw(){
  
  //form groups
  scene.remove(form_group_v);
  scene.remove(form_group_f);
  scene.remove(form_group_e);
  scene.remove(form_group_c);
  scene.remove(form_general);

  form_group_v = new THREE.Group();
  form_group_f = new THREE.Group();
  form_group_e = new THREE.Group();
  form_group_c = new THREE.Group();
  form_general = new THREE.Group();

  //force groups
  scene2.remove(force_group_v);
  scene2.remove(force_group_f);
  scene2.remove(force_group_e);
  scene2.remove(force_group_c);
  scene2.remove(force_general);

  scene2.remove(force_text);

  force_group_v = new THREE.Group();
  force_group_f = new THREE.Group();
  force_group_e = new THREE.Group();
  force_group_c = new THREE.Group();
  force_general = new THREE.Group();
  force_text = new THREE.Group();


  // *********************** form vertices **************************
  // set basic points in form diagram (one top, one mid (0,0,0), three bottoms)
  // 1st. mid point
  const vertice_0 = Geo.addVertice(0.05, "sp0", new THREE.Vector3(0,0,0));
  const vertice_0_out = Geo.addVerticeOut(0.05, new THREE.Vector3(0,0,0), 1.55)
  form_group_v.add(vertice_0);
  form_group_v.add(vertice_0_out);

  //2nd. bottom point (movable) - bottom vertice 1
  const vertice_1 = Geo.addVertice(0.04, "sp1", formBtPt1[1])
  Ctrl_pts.push(vertice_1); //adding to gumbal selection
  const vertice_1_out = Geo.addVerticeOut(0.04, vertice_1.position, 1.55);

  form_group_v.add(vertice_1);
  form_group_v.add(vertice_1_out);

  //3rd. bottom point (movable) - bottom vertice 2
  const vertice_2 = Geo.addVertice(0.04, "sp2", formBtPt2[1])
  Ctrl_pts.push(vertice_2); //adding to gumbal selection
  const vertice_2_out = Geo.addVerticeOut(0.04, vertice_2.position, 1.55);

  form_group_v.add(vertice_2);
  form_group_v.add(vertice_2_out);

  //4th. bottom point (movable) - bottom vertice 3
  const vertice_3 = Geo.addVertice(0.04, "sp3", formBtPt3[1])
  Ctrl_pts.push(vertice_3); //adding to gumbal selection
  const vertice_3_out = Geo.addVerticeOut(0.04, vertice_3.position, 1.55);
  form_group_v.add(vertice_3);
  form_group_v.add(vertice_3_out);



  // *********************** form faces **************************

  //face 1, 2, 3 - green color
  const formFace_1 = Geo.FormFace3ptGN(formTpPt[0], formTpPt[1], formBtPt1[1]);
  const formFace_2 = Geo.FormFace3ptGN(formTpPt[0], formTpPt[1], formBtPt2[1]);
  const formFace_3 = Geo.FormFace3ptGN(formTpPt[0], formTpPt[1], formBtPt3[1]);

  //face 4, 5, 6 - grey color
  const formFace_4 = Geo.FormFace3ptGR(formTpPt[0], formBtPt1[1], formBtPt2[1]);
  const formFace_5 = Geo.FormFace3ptGR(formTpPt[0], formBtPt2[1], formBtPt3[1]);
  const formFace_6 = Geo.FormFace3ptGR(formTpPt[0], formBtPt3[1], formBtPt1[1]);

  form_group_f.add(formFace_1);
  form_group_f.add(formFace_2);
  form_group_f.add(formFace_3);

  form_group_f.add(formFace_4);
  form_group_f.add(formFace_5);
  form_group_f.add(formFace_6);


  // *********************** form cells **************************
  const formCell1 = Geo.addCell3Face(formTpPt[0], formTpPt[1], formBtPt1[1], formBtPt2[1], 0.8)
  form_group_c.add(formCell1);

  const formCell2 = Geo.addCell3Face(formTpPt[0], formTpPt[1], formBtPt2[1], formBtPt3[1], 0.8)
  form_group_c.add(formCell2);

  const formCell3 = Geo.addCell3Face(formTpPt[0], formTpPt[1], formBtPt1[1], formBtPt3[1], 0.8)
  form_group_c.add(formCell3);

  const formCell4 = Geo.addCell3Face(formTpPt[0], formBtPt1[1], formBtPt2[1], formBtPt3[1],0.8)
  form_group_c.add(formCell4);


  // *********************** form apply loads dash lines **************************
  const dashline = Geo.dashLinesGR(formTpPt[0], formTpPt[1], 0.008, 0.01, 1.02);
  form_general.add(dashline);

  // *********************** form apply loads arrow **************************
  var applyArrowMaterial=new THREE.MeshPhongMaterial( {
    color:  0x009600//green
  } );

  var applyArrowMaterialOut=new THREE.MeshPhongMaterial( {
    color:  "white",
    transparent: false, 
    side: THREE.BackSide
  } );
  const applyArrow = Geo.createCylinderArrowMesh(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.3), formTpPt[1], applyArrowMaterial, 0.015,0.035,0.55);
  form_general.add(applyArrow);

  const applyArrowOut = Geo.createCylinderArrowMesh(new THREE.Vector3(formTpPt[1].x, formTpPt[1].y, formTpPt[1].z + 0.3), formTpPt[1], applyArrowMaterialOut, 0.02,0.04,0.545);
  form_general.add(applyArrowOut);



  // *****************
  // force
  // ******************

  // *********************** force diagram ***********************
  // *********************** force points ***********************
  var edgescale = 2; // size of the force diagram

  //PtA and PtB
  var forcePtA = new THREE.Vector3(0.5, 0, 0)

  var forcePtBtemp = Geo.CalNormalVectorUpdated(formBtPt1[1], formTpPt[1], formTpPt[0], edgescale );
  var forcePtB = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);

  //PtC

  var forcePtC1temp = Geo.CalNormalVectorUpdated(formBtPt2[1], formTpPt[1], formTpPt[0], edgescale);
  var forcePtC1 = new THREE.Vector3(forcePtB.x - forcePtC1temp.x, forcePtB.y - forcePtC1temp.y, forcePtB.z - forcePtC1temp.z);

  var forcePtC2temp = Geo.CalNormalVectorUpdated(formBtPt3[1], formTpPt[1], formTpPt[0], edgescale );
  var forcePtC2 = new THREE.Vector3(forcePtA.x - forcePtC2temp.x, forcePtA.y - forcePtC2temp.y, forcePtA.z - forcePtC2temp.z);

  var dirBC = new THREE.Vector3(); // create once an reuse it

  dirBC.subVectors(forcePtB, forcePtC1).normalize();

  var dirAC = new THREE.Vector3(); // create once an reuse it

  dirAC.subVectors(forcePtC2, forcePtA).normalize();
  var forcePtC = Geo.LinesSectPt(dirBC, forcePtB, dirAC, forcePtA);

  // *********************** caculating the normals for apply loads *********************** 
  // triangle ABC 
  var normalABC_a = Geo.subVec(forcePtA, forcePtB)
  var normalABC_b = Geo.subVec(forcePtB, forcePtC)
  var normalABC = Geo.cross(normalABC_a, normalABC_b)

  var edgeVector0 = Geo.subVec(formTpPt[0], formTpPt[1]);
  var resultapply = normalABC.dot(edgeVector0)

  var forcePtBUpdated, forcePtCUpdated
  
  // redefine the force points PtB, PtC ( one condition is that the force diagram flipped)

  if (resultapply<0){
    var forcePtBtemp = Geo.CalNormalVectorUpdated(formBtPt1[1], formTpPt[1], formTpPt[0], -edgescale );
    var forcePtBnew = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);
    forcePtB= forcePtBnew
    var lenAC = forcePtA.distanceTo(forcePtC);
    forcePtC=  Geo.addVectorAlongDir(forcePtA, forcePtC, lenAC)
  }


  // if (resultapply>0){
  //   forcePtBUpdated = forcePtB
  //   forcePtCUpdated= forcePtC
  // } else{
  //   var forcePtBtemp = Geo.CalNormalVectorUpdated(formBtPt1[1], formTpPt[1], formTpPt[0], -edgescale );
  //   var forcePtBnew = new THREE.Vector3(forcePtA.x - forcePtBtemp.x, forcePtA.y - forcePtBtemp.y, forcePtA.z - forcePtBtemp.z);
  //   forcePtCUpdated= forcePtBnew
  //   var lenAC = forcePtA.distanceTo(forcePtC);
  //   forcePtBUpdated =  Geo.addVectorAlongDir(forcePtA, forcePtC, lenAC)
  // }

  // redefine the force point PtD ( one condition is that the force diagram flipped)

  //PtD

  if (resultapply>0){
    var forcePtD1temp = Geo.CalNormalVectorUpdated(formBtPt1[1], formTpPt[0], formBtPt3[1], edgescale );
    var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

    var forcePtD2temp = Geo.CalNormalVectorUpdated(formBtPt2[1],  formTpPt[0], formBtPt1[1], edgescale );
    var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);

    var dirAD= new THREE.Vector3(); // create once an reuse it

    dirAD.subVectors(forcePtA, forcePtD1).normalize();

    var dirBD = new THREE.Vector3(); // create once an reuse it

    dirBD.subVectors(forcePtD2, forcePtB).normalize();
    var forcePtD = Geo.LinesSectPt(dirAD, forcePtA, dirBD, forcePtB);
  } else{
    var forcePtD1temp = Geo.CalNormalVectorUpdated(formBtPt2[1], formTpPt[0], formBtPt3[1], edgescale );
    var forcePtD1 = new THREE.Vector3(forcePtA.x - forcePtD1temp.x, forcePtA.y - forcePtD1temp.y, forcePtA.z - forcePtD1temp.z);

    var forcePtD2temp = Geo.CalNormalVectorUpdated(formBtPt2[1],  formTpPt[0], formBtPt1[1], edgescale );
    var forcePtD2 = new THREE.Vector3(forcePtB.x - forcePtD2temp.x, forcePtB.y - forcePtD2temp.y, forcePtB.z - forcePtD2temp.z);
  
    var dirAD= new THREE.Vector3(); // create once an reuse it
  
    dirAD.subVectors(forcePtA, forcePtD1).normalize();
  
    var dirBD = new THREE.Vector3(); // create once an reuse it
  
    dirBD.subVectors(forcePtD2, forcePtB).normalize();
    var forcePtD = Geo.LinesSectPt(dirAD, forcePtA, dirBD, forcePtB);
  }

  var forcePtA_text = Geo.createSpriteText('A',forcePtA)
  force_text.add(forcePtA_text)
  var forcePtB_text = Geo.createSpriteText('B',forcePtB)
  force_text.add(forcePtB_text)
  var forcePtC_text = Geo.createSpriteText('C',forcePtC)
  force_text.add(forcePtC_text)
  
  
  // *********************** caculating the areas of triangles (from the four points) *********************** 
 
  var areaABD = Geo.create_force_face_area(forcePtA,forcePtB,forcePtD);
  var areaBCD = Geo.create_force_face_area(forcePtB,forcePtC,forcePtD);
  var areaACD = Geo.create_force_face_area(forcePtA,forcePtC,forcePtD);

  var areaMax = Math.max(areaABD, areaBCD, areaACD);

  // *********************** caculating the normals for each triangle *********************** 

  // ****** caculating normals *******
  // A = p2 - p1, B = p3 - p1
  // Nx = Ay * Bz - Az * By
  // Ny = Az * Bx - Ax * Bz
  // Nz = Ax * By - Ay * Bx
  // ******
  
  // triangle ABD 
  var normalABD_a = Geo.subVec(forcePtB, forcePtA)
  var normalABD_b = Geo.subVec(forcePtA, forcePtD)
  var normalABD = Geo.cross(normalABD_a, normalABD_b)

  var edgeVector1 = Geo.subVec(formTpPt[0], formBtPt1[1]);

  // triangle BCD 
  var normalBCD_a = Geo.subVec(forcePtC, forcePtB)
  var normalBCD_b = Geo.subVec(forcePtB, forcePtD)
  var normalBCD = Geo.cross(normalBCD_a, normalBCD_b)

  var edgeVector2 = Geo.subVec(formTpPt[0], formBtPt2[1]);

  // triangle ACD 
  var normalCAD_a = Geo.subVec(forcePtA, forcePtC)
  var normalCAD_b = Geo.subVec(forcePtC, forcePtD)
  var normalCAD = Geo.cross(normalCAD_a, normalCAD_b)

  var edgeVector3 = Geo.subVec(formTpPt[0], formBtPt3[1]);

  // *********************** force cells **************************
  const forceCell = Geo.addCell4Face(forcePtD, forcePtA, forcePtB, forcePtC, forceCellScale )
  force_group_c.add(forceCell);
  force_group_c.traverse(function(obj) {
    if (obj.type === "Mesh") {
      obj.material.visible =false;
    }
  });

  // *********************** force edges (including vertices) **************************
  //testing the force edges
  var edgeSize = 0.005;
  var edgeColor = "lightgrey";

  var forceEdgeMaterial=new THREE.MeshPhongMaterial( {
    color:  edgeColor
  } );
  
  const forceEdgeAB = Geo.createCylinderMesh(forcePtA,forcePtB,forceEdgeMaterial,edgeSize,edgeSize);

  force_group_e.add(forceEdgeAB);
  
  const forceEdgeAC = Geo.createCylinderMesh(forcePtA,forcePtC,forceEdgeMaterial,edgeSize,edgeSize);

  force_group_e.add(forceEdgeAC);

  const forceEdgeBC = Geo.createCylinderMesh(forcePtB,forcePtC,forceEdgeMaterial,edgeSize,edgeSize);

  force_group_e.add(forceEdgeBC)

  const forceEdgeAD = Geo.createCylinderMesh(forcePtA,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);

  force_group_e.add(forceEdgeAD)

  const forceEdgeBD = Geo.createCylinderMesh(forcePtB,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);

  force_group_e.add(forceEdgeBD)

  const forceEdgeCD = Geo.createCylinderMesh(forcePtC,forcePtD,forceEdgeMaterial,edgeSize,edgeSize);

  force_group_e.add(forceEdgeCD)
  
  const endPtVerticePtA = Geo.addEdgeSphere(edgeSize, forcePtA, edgeColor)
  const endPtVerticePtB = Geo.addEdgeSphere(edgeSize, forcePtB, edgeColor)
  const endPtVerticePtC = Geo.addEdgeSphere(edgeSize, forcePtC, edgeColor)
  const endPtVerticePtD = Geo.addEdgeSphere(edgeSize, forcePtD, edgeColor)
  




  scene2.add(force_group_v);
  scene2.add(force_group_f);
  scene2.add(force_group_e);
  scene2.add(force_group_c);
  scene2.add(force_general);
  scene2.add(force_text);

  // *********************** form edges **************************
  var formedgeColor1, formedgeColor2, formedgeColor3

  if (resultapply>0){
   
    var edgeSize1 = areaABD * 0.05;
    var edgeSize2 = areaBCD * 0.05;
    var edgeSize3 = areaACD * 0.05;

    edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
    edgeSize2 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
    edgeSize3 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);

    var result1 = normalABD.dot(edgeVector1)
    var result2 = normalBCD.dot(edgeVector2)
    var result3 = normalCAD.dot(edgeVector3)

  } else{

    var edgeSize1 = areaBCD * 0.05;
    var edgeSize2 = areaABD * 0.05;
    var edgeSize3 = areaACD * 0.05;

    edgeSize1 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
    edgeSize2 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);
    edgeSize3 = THREE.MathUtils.clamp(edgeSize1, 0.01, 0.5);

    var result1 = normalBCD.dot(edgeVector1)
    var result2 = normalABD.dot(edgeVector2)
    var result3 = normalCAD.dot(edgeVector3)

  }
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


  if (result1 < 0){
    if (resultapply>0){
      if (areaABD/areaMax >= 0.75){
        formedgeColor1 = 0x80002F
      }
      if (0.5 <= areaABD/areaMax & areaABD/areaMax < 0.75){
        formedgeColor1 = 0x940041
      }
      if (0.25 <= areaABD/areaMax & areaABD/areaMax  < 0.5){
        formedgeColor1 = 0xCC0549
      }
      if (0 <= areaABD/areaMax & areaABD/areaMax < 0.25){
        formedgeColor1 = 0xCC0549
      }
      var forceFaceABD = Geo.ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor1);

    } else{
      if (areaBCD/areaMax >= 0.75){
        formedgeColor1 = 0x80002F
      }
      if (0.5 <= areaBCD/areaMax & areaBCD/areaMax  < 0.75){
        formedgeColor1 = 0x940041
      }
      if (0.25 <= areaBCD/areaMax & areaBCD/areaMax  < 0.5){
        formedgeColor1 = 0xCC0549
      }
      if (0 <= areaBCD/areaMax & areaBCD/areaMax < 0.25){
        formedgeColor1 = 0xCC0549
      }
      var forceFaceBCD = Geo.ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor1);
    }
  } else{
    if (resultapply>0){
      if (areaABD/areaMax >= 0.75){
        formedgeColor1 = 0x0F3150
      }
      if (0.5 <= areaABD/areaMax & areaABD/areaMax < 0.75){
        formedgeColor1 = 0x05416D
      }
      if (0.25 <= areaABD/areaMax & areaABD/areaMax  < 0.5){
        formedgeColor1 = 0x376D9B
      }
      if (0 <= areaABD/areaMax & areaABD/areaMax < 0.25){
        formedgeColor1 = 0xD72F62
      }
      var forceFaceABD = Geo.ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor1);

    } else{
      if (areaBCD/areaMax >= 0.75){
        formedgeColor1 = 0x0F3150
      }
      if (0.5 <= areaBCD/areaMax & areaBCD/areaMax  < 0.75){
        formedgeColor1 = 0x05416D
      }
      if (0.25 <= areaBCD/areaMax & areaBCD/areaMax  < 0.5){
        formedgeColor1 = 0x376D9B
      }
      if (0 <= areaBCD/areaMax & areaBCD/areaMax < 0.25){
        formedgeColor1 = 0xD72F62
      }
      var forceFaceBCD = Geo.ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor1);
    }
  }
  var formEdge1Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor1
  } );

  if (result2 < 0){
    if (resultapply>0){
      if (areaBCD/areaMax >= 0.75){
        formedgeColor2 = 0x80002F
      }
      if (0.5 <= areaBCD/areaMax & areaBCD/areaMax < 0.75){
        formedgeColor2 = 0x940041
      }
      if (0.25 <= areaBCD/areaMax & areaBCD/areaMax  < 0.5){
        formedgeColor2 = 0xCC0549
      }
      if (0 <= areaBCD/areaMax & areaBCD/areaMax < 0.25){
        formedgeColor2 = 0xCC0549
      }
      var forceFaceBCD = Geo.ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor2);

    } else{
      if (areaABD/areaMax >= 0.75){
        formedgeColor2 = 0x80002F
      }
      if (0.5 <= areaABD/areaMax & areaABD/areaMax  < 0.75){
        formedgeColor2 = 0x940041
      }
      if (0.25 <= areaABD/areaMax & areaABD/areaMax  < 0.5){
        formedgeColor2 = 0xCC0549
      }
      if (0 <= areaABD/areaMax & areaABD/areaMax < 0.25){
        formedgeColor2 = 0xCC0549
      }
      var forceFaceABD = Geo.ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor2);

    }
  } else{
    if (resultapply>0){
      if (areaBCD/areaMax >= 0.75){
        formedgeColor2 = 0x0F3150
      }
      if (0.5 <= areaBCD/areaMax & areaBCD/areaMax < 0.75){
        formedgeColor2 = 0x05416D
      }
      if (0.25 <= areaBCD/areaMax & areaBCD/areaMax  < 0.5){
        formedgeColor2 = 0x376D9B
      }
      if (0 <= areaBCD/areaMax & areaBCD/areaMax < 0.25){
        formedgeColor2 = 0xD72F62
      }
      var forceFaceBCD = Geo.ForceFace3pt(forcePtB, forcePtC, forcePtD, formedgeColor2);

    } else{
      if (areaABD/areaMax >= 0.75){
        formedgeColor2 = 0x0F3150
      }
      if (0.5 <= areaABD/areaMax & areaABD/areaMax  < 0.75){
        formedgeColor2 = 0x05416D
      }
      if (0.25 <= areaABD/areaMax & areaABD/areaMax  < 0.5){
        formedgeColor2 = 0x376D9B
      }
      if (0 <= areaABD/areaMax & areaABD/areaMax < 0.25){
        formedgeColor2 = 0xD72F62
      }
      var forceFaceABD = Geo.ForceFace3pt(forcePtA, forcePtB, forcePtD, formedgeColor2);

    }
  }
  var formEdge2Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor2
  } );

  if (result3 < 0){
    if (areaACD/areaMax >= 0.75){
      formedgeColor3 = 0x80002F
    }
    if (0.5 <= areaACD/areaMax & areaACD/areaMax < 0.75){
      formedgeColor3 = 0x940041
    }
    if (0.25 <= areaACD/areaMax & areaACD/areaMax  < 0.5){
      formedgeColor3 = 0xCC0549
    }
    if (0 <= areaACD/areaMax & areaACD/areaMax < 0.25){
      formedgeColor3 = 0xCC0549
    }
    var forceFaceACD = Geo.ForceFace3pt(forcePtA, forcePtC, forcePtD, formedgeColor3);

  } else{
    if (areaACD/areaMax >= 0.75){
      formedgeColor3 = 0x0F3150
    }
    if (0.5 <= areaACD/areaMax & areaACD/areaMax  < 0.75){
      formedgeColor3 = 0x05416D
    }
    if (0.25 <= areaACD/areaMax & areaACD/areaMax  < 0.5){
      formedgeColor3 = 0x376D9B
    }
    if (0 <= areaACD/areaMax & areaACD/areaMax < 0.25){
      formedgeColor3 = 0xD72F62
    }
    var forceFaceACD = Geo.ForceFace3pt(forcePtA, forcePtC, forcePtD, formedgeColor3);

  }
  var formEdge3Material=new THREE.MeshPhongMaterial( { 
    color:  formedgeColor3
  } );

  force_group_f.add(forceFaceACD)
  force_group_f.add(forceFaceBCD)
  force_group_f.add(forceFaceABD)



  //create end sphere for bottom vertice 1
  const endPtVertice1SpV = Geo.addVectorAlongDir(formBtPt1[1], formTpPt[0], -0.14);
  const endPtVertice1Sp = Geo.addEdgeSphere(edgeSize1, endPtVertice1SpV, formedgeColor1)
  //create edge bottom vertice 1
  const endPtVertice1 = Geo.addVectorAlongDir(formTpPt[0],formBtPt1[1],  -0.1);
  const formEdge1 = Geo.createCylinderMesh(endPtVertice1SpV,endPtVertice1,formEdge1Material,edgeSize1,edgeSize1);

  form_group_e.add(endPtVertice1Sp)
  form_group_e.add(formEdge1)

  //create end sphere for bottom vertice 2
  const endPtVertice2SpV = Geo.addVectorAlongDir(formBtPt2[1], formTpPt[0], -0.14);
  const endPtVertice2Sp = Geo.addEdgeSphere(edgeSize2, endPtVertice2SpV, formedgeColor2)
  //create edge bottom vertice 2
  const endPtVertice2 = Geo.addVectorAlongDir(formTpPt[0],formBtPt2[1],  -0.1);
  const formEdge2 = Geo.createCylinderMesh(endPtVertice2SpV,endPtVertice2,formEdge2Material,edgeSize2,edgeSize2);

  form_group_e.add(endPtVertice2Sp)
  form_group_e.add(formEdge2)

  //create end sphere for bottom vertice 3
  const endPtVertice3SpV = Geo.addVectorAlongDir(formBtPt3[1], formTpPt[0], -0.14);
  const endPtVertice3Sp = Geo.addEdgeSphere(edgeSize3, endPtVertice3SpV, formedgeColor3)
  //create edge bottom vertice 3
  const endPtVertice3 = Geo.addVectorAlongDir(formTpPt[0],formBtPt3[1],  -0.1);
  const formEdge3 = Geo.createCylinderMesh(endPtVertice3SpV,endPtVertice3,formEdge3Material,edgeSize3,edgeSize3);

  form_group_e.add(endPtVertice3Sp)
  form_group_e.add(formEdge3)
 

  scene.add(form_group_v);
  scene.add(form_group_f);
  scene.add(form_group_e);
  scene.add(form_group_c);
  scene.add(form_general);

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
        formBtPt1[1].x=selectObj.position.x;
        formBtPt1[1].y=selectObj.position.y;
        formBtPt1[1].z=selectObj.position.z;
      }

      if(selectObj.name.charAt(2)==='2')
      {
        formBtPt2[1].x=selectObj.position.x;
        formBtPt2[1].y=selectObj.position.y;
        formBtPt2[1].z=selectObj.position.z;
      }

      if(selectObj.name.charAt(2)==='3')
      {
        formBtPt3[1].x=selectObj.position.x;
        formBtPt3[1].y=selectObj.position.y;
        formBtPt3[1].z=selectObj.position.z;
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
        trfm_ctrl.position.update();
        console.log(selectObj.position)
        console.log(trfm_ctrl.position)
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
