import '/style.css'; //setup basic visual factors for the overall web

import * as THREE from 'three';
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';


export function create_force_face_area(point1,point2,pointO){
    var face_area = new THREE.Vector3().crossVectors(
       new THREE.Vector3().subVectors( point1, pointO ),
       new THREE.Vector3().subVectors( point2, pointO ),
       ).length()/2

    return face_area
}


export function subVec(n1, n2) {
    var sub = new THREE.Vector3(0, 0, 0);
    sub.x = n1.x - n2.x;
    sub.y = n1.y - n2.y;
    sub.z = n1.z - n2.z;
    return sub;
}


export function cross(n1, n2) {
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

export function LinesSectPt(L1_dir, P1_pnt, L2_dir, P2_pnt) {

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
export function CalNormalVector(vec1, vec2, vec3, n) {

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

export function CalNormalVectorUpdated(vec1, vec2, vec3, n) {

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
export function addVectorAlongDir (pt1, pt2, len){
    var C = new THREE.Vector3();
    C.subVectors( pt2, pt1 ).multiplyScalar( 1 + ( len / C.length() ) ).add( pt1 );
    return C
}
//****************** arrow *****************************
export function createCylinderArrowMesh(pointX, pointY, material, radius, radiusCone, edgeLengthRatio) 
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
export function createCylinderMesh(pointX, pointY, material1, radius, radius2) 
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
export function addVertice(size, name, location){
    var pt_material = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var pt_geo = new THREE.SphereGeometry(size);
    var pt_sphare = new THREE.Mesh(pt_geo, pt_material);
    
    pt_sphare.name= name;
    pt_sphare.position.copy(location);
    pt_sphare.castShadow=true;

    return pt_sphare
}

//construct vertices outlines
export function addVerticeOut(size, location, scale){
    var pt_material_outline = new THREE.MeshBasicMaterial( { color: "black", transparent: false, side: THREE.BackSide } );
    var pt_geo = new THREE.SphereGeometry(size);
    var pt_geo_outline = new THREE.Mesh( pt_geo, pt_material_outline );
    pt_geo_outline.position.copy(location);
    pt_geo_outline.scale.multiplyScalar(scale);

    return pt_geo_outline
}

//***************** construct form edge ***********************
export function addEdgeSphere(size, location, color){
    var pt_material = new THREE.MeshPhongMaterial({color: color, transparent: false});
    var pt_geo = new THREE.SphereGeometry(size);
    var pt_sphare = new THREE.Mesh(pt_geo, pt_material);
    
    pt_sphare.position.copy(location);
    pt_sphare.castShadow=true;

    return pt_sphare
}


//***************** construct faces ***********************
//form faces - green color
export function FormFace3ptGN(pt1, pt2, pt3){ 
    
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
export function FormFace3ptGR(pt1, pt2, pt3){
    
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
export function ForceFace3pt(pt1, pt2, pt3, color){
    
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


export function FormPlane(pt1, pt2, pt3, pt4){
    
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
export function ForceFace4ptGN(pt1, pt2, pt3, pt4){
    

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

export function FormFace4ptGN(pt1, pt2, pt3, pt4){
    

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
export function ForceTrialFace(pt1, pt2, pt3, pt4, ptO){
    
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
export function dashLinesGR(pt1, pt2, sizein, sizeout, scale){
    
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

export function addCell3Face(point1,point2,point3,point4, scale){

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


export function addCell4Face(point1,point2,point3,point4, scale){

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

export function create_trial_intec (startpoint,forceP1,forceP2,forceP3,intecP1,intecP1B){
                            
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

export function createdashline (point1, point2,trialline_dash){

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

export function Cal_Plane_Line_Intersect_Point(Point_online,LineVec,Point_onPlane,PlaneVec){
   
    var IntersectPoint = new THREE.Vector3(
        //x
        Point_online.x+LineVec.x*((Point_onPlane.x - Point_online.x)*PlaneVec.x+(Point_onPlane.y - Point_online.y)*PlaneVec.y+(Point_onPlane.z - Point_online.z)*PlaneVec.z) / (PlaneVec.x* LineVec.x+ PlaneVec.y* LineVec.y+ PlaneVec.z* LineVec.z), 
        //y
        Point_online.y+LineVec.y*((Point_onPlane.x - Point_online.x)*PlaneVec.x+(Point_onPlane.y - Point_online.y)*PlaneVec.y+(Point_onPlane.z - Point_online.z)*PlaneVec.z) / (PlaneVec.x* LineVec.x+ PlaneVec.y* LineVec.y+ PlaneVec.z* LineVec.z),
        //z
        Point_online.z+LineVec.z*((Point_onPlane.x - Point_online.x)*PlaneVec.x+(Point_onPlane.y - Point_online.y)*PlaneVec.y+(Point_onPlane.z - Point_online.z)*PlaneVec.z) / (PlaneVec.x* LineVec.x+ PlaneVec.y* LineVec.y+ PlaneVec.z* LineVec.z))

   return IntersectPoint;
}

export function ForceFace(pt0, pt1, pt2, pt3, pt4, pt5){
    
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

export function create_form_tubes(face_area,face_area_max,scale,startPoint,targetPoint,PointO){
    var form_mesh = face_area/face_area_max
    var tt = scale*face_area
   
    var Close_Point = addVectorAlongDir(startPoint, targetPoint, -1);
    var Close_Point2 = addVectorAlongDir(targetPoint, startPoint, -1);

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
             var tubeMesh=createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_1,tt,tt);
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
             var tubeMesh=createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_2,tt,tt);
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
             var tubeMesh=createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_3,tt,tt);
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
             var tubeMesh=createCylinderMesh(Close_Point2,Close_Point,Colorbar_blue_4,tt,tt);
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
             var tubeMesht=createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_1,tt,tt);
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
             var tubeMesht=createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_2,tt,tt);
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
             var tubeMesht=createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_3,tt,tt);
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
             var tubeMesht=createCylinderMesh(Close_Point2,Close_Point,Colorbar_red_4,tt,tt);
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



  }

export function face_center(n1,n2,n3){

    var face_centerD=new THREE.Vector3();

        face_centerD.x=(n1.x+n2.x+n3.x)/3;
        face_centerD.y=(n1.y+n2.y+n3.y)/3;
        face_centerD.z=(n1.z+n2.z+n3.z)/3;

        return face_centerD;

}

export function create_Tri_FaceMesh(p1,p2,p3,arr_face_dir,Is_First,arr_dir,text)
        {

            var corepoint=face_center(p1,p2,p3);
            var m = 0.2;//scale

            //move point
            var dirA=new THREE.Vector3().subVectors(corepoint,p1);
            var dirB=new THREE.Vector3().subVectors(corepoint,p2);
            var dirC=new THREE.Vector3().subVectors(corepoint,p3);

            dirA.normalize();
            dirB.normalize();
            dirC.normalize();

            // var unit_dir1=new THREE.Vector3();//normal
            // unit_dir1.x=dirA.x/norm(dirA);
            // unit_dir1.y=dirA.y/norm(dirA);
            // unit_dir1.z=dirA.z/norm(dirA);

            // var unit_dir2=new THREE.Vector3();//normal
            // unit_dir2.x=dirB.x/norm(dirB);
            // unit_dir2.y=dirB.y/norm(dirB);
            // unit_dir2.z=dirB.z/norm(dirB);

            // var unit_dir3=new THREE.Vector3();//normal
            // unit_dir3.x=dirC.x/norm(dirC);
            // unit_dir3.y=dirC.y/norm(dirC);
            // unit_dir3.z=dirC.z/norm(dirC);


            //move point

            var p1_1=new THREE.Vector3();
           // p1_1=subVec(p1,m*unit_dir1);
            p1_1.x=p1.x+m*dirA.x;
            p1_1.y=p1.y+m*dirA.y;
            p1_1.z=p1.z+m*dirA.z;

            var p2_1=new THREE.Vector3();
            p2_1.x=p2.x+m*dirB.x;
            p2_1.y=p2.y+m*dirB.y;
            p2_1.z=p2.z+m*dirB.z;

            var p3_1=new THREE.Vector3();
            p3_1.x=p3.x+m*dirC.x;
            p3_1.y=p3.y+m*dirC.y;
            p3_1.z=p3.z+m*dirC.z;



            var vertices_tri=[
            p1_1,p2_1,p3_1
            ];

            var faces_tri=[
            new THREE.Face3(2,1,0),

            ];


            var geom_tri = new THREE.Geometry();
            geom_tri.vertices = vertices_tri;
            geom_tri.faces = faces_tri;
            geom_tri.computeFaceNormals();


            for (i = 0;i<geom_tri.faces.length;i++){
            if(Is_First)
            {
                var hex =0x008000;
                geom_tri.faces[i].color.setHex(hex);
            }
            else
            {
                var hex =0xa9a9a9;
                geom_tri.faces[i].color.setHex(hex);
                }

            }

            //  var materials = new THREE.MeshBasicMaterial( {
            // vertexColors: THREE.FaceColors
            // } );

            var materials_tri = [
            //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
            // new THREE.MeshBasicMaterial({color: 0x4d4dff, wireframe: true,transparent: true,opacity:0.05}),
            new THREE.MeshBasicMaterial( {
            vertexColors: THREE.FaceColors,transparent: true,opacity:0.2,side:THREE.DoubleSide
            } )
            ];

            var mesh_tri = new THREE.SceneUtils.createMultiMaterialObject(geom_tri, materials_tri);

            // return mesh_tri;

            //arrowHelper1.add(mesh_tri)

            //var arrowHelper1;


            //var length = 1;
            // var hex = 0x000000;//black
            if(Is_First)

            var arr_face_material=new THREE.MeshPhongMaterial( {
                color:  0x009600//force face green
            } );
            else
            var arr_face_material=new THREE.MeshPhongMaterial( {
                color:  0x000000//force face black
            } );

            var arr_material2;

                if(arr_dir<0)//c or t
                {
                    arrow_material2=new THREE.MeshPhongMaterial( {
                color: 0xC00000//red
                });

                }
                else
                {
                    arrow_material2=new THREE.MeshPhongMaterial( {

                color: 0x0F3150//blue
                });

                }


            //in or out

            var forceFaceDir=Pnt_copy(arr_face_dir);
            forceFaceDir.normalize();

                //in or out
                var out1=new THREE.Vector3();
                out1.x=corepoint.x+0.2*forceFaceDir.x;
                out1.y=corepoint.y+0.2*forceFaceDir.y;
                out1.z=corepoint.z+0.2*forceFaceDir.z;


                var out2=new THREE.Vector3();
                out2.x=corepoint.x-0.2*forceFaceDir.x;
                out2.y=corepoint.y-0.2*forceFaceDir.y;
                out2.z=corepoint.z-0.2*forceFaceDir.z;

                var out1_core=new THREE.Vector3().subVectors(out1,corePoint_body2);
                var out2_core=new THREE.Vector3().subVectors(out2,corePoint_body2);

                if(out1_core.length()>out2_core.length())//out
                {


                var arrowHP1=createCylinderArrowMesh(p3_1,p1_1,arr_face_material,0.01,0.03,0.9);//face arr

                // var direction1 = new THREE.Vector3().subVectors(p1_1, p3_1);
                // var length1=direction1.length();
                // direction1.normalize();
                // var arrowHelper1 = new THREE.ArrowHelper(direction1, p3_1, length1,hex,0.2,0.05);
               mesh_tri.add(arrowHP1);

                // var direction2 = new THREE.Vector3().subVectors(p3_1, p2_1);
                // var length2=direction2.length();
                // direction2.normalize();
                // var arrowHelper2 = new THREE.ArrowHelper(direction2, p2_1, length2,hex,0.2,0.05);
                 var arrowHP2=createCylinderArrowMesh(p2_1,p3_1,arr_face_material,0.01,0.03,0.9);//face arr
                mesh_tri.add(arrowHP2);

                // var direction3 = new THREE.Vector3().subVectors(p2_1, p1_1);
                // var length3=direction3.length();
                // direction3.normalize();
                // var arrowHelper3 = new THREE.ArrowHelper(direction3, p1_1, length3,hex,0.2,0.05);
                 var arrowHP3=createCylinderArrowMesh(p1_1,p2_1,arr_face_material,0.01,0.03,0.9);//face arr
                mesh_tri.add(arrowHP3);

                 //draw normal

                var corepoint2=new THREE.Vector3();
                corepoint2.x=corepoint.x+0.4*forceFaceDir.x;
                corepoint2.y=corepoint.y+0.4*forceFaceDir.y;
                corepoint2.z=corepoint.z+0.4*forceFaceDir.z;

                var corepoint3=new THREE.Vector3();
                corepoint3.x=corepoint.x+0.37*forceFaceDir.x;
                corepoint3.y=corepoint.y+0.37*forceFaceDir.y;
                corepoint3.z=corepoint.z+0.37*forceFaceDir.z;



                //=new THREE.ArrowHelper(forceFaceDir,corepoint,0.5*forceFaceDir.length(),0x00ff00,0.2,0.1);
                if(Is_First)//color diff
                {
                    var arrow_material1=new THREE.MeshPhongMaterial( {
                color: 0x009600
            } );
                 var arrowN=createCylinderArrowMesh(corepoint,corepoint2,arrow_material1,0.02,0.05,0.6);
                 //
                }
                else
                 var arrowN=createCylinderArrowMesh(corepoint,corepoint2,arrow_material2,0.02,0.05,0.6);


                mesh_tri.add(arrowN);

                if(Is_First)//color diff
                {
                    var arrow_material_outline= new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
                 var arrowN_O=createCylinderArrowMesh(corepoint,corepoint3,arrow_material_outline,0.025,0.05,0.55);
                 //
                }
                else
                    var arrow_material_outline= new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
                    var arrowN_O=createCylinderArrowMesh(corepoint,corepoint3,arrow_material_outline,0.025,0.05,0.55);



                mesh_tri.add(arrowN_O);
                arrowN_O.scale.multiplyScalar(1.2);

                var TXMesh=createSpriteText(text,corepoint2);

                text_group2.add(TXMesh);

                //face arr

                 var cir_dir=new THREE.Vector3().subVectors(corepoint,p1);
                cir_dir.normalize();

                var arrowpt=new THREE.Vector3();
                arrowpt.x=corepoint.x+0.2*cir_dir.x;
                arrowpt.y=corepoint.y+0.2*cir_dir.y;
                arrowpt.z=corepoint.z+0.2*cir_dir.z;

                     //arr_dir.normalize();

                var direction1=cir_dir.applyAxisAngle(forceFaceDir,Math.PI/2);

             //var direction1 = new THREE.Vector3().subVectors(p1, p2);
                var length1=0.001;
                direction1.normalize();
                var arrowHelper1 = new THREE.ArrowHelper(direction1, arrowpt, length1,"black",0.1,0.05);

        //        mesh_tri.add(arrowHelper1);


               //cir arr

               var circle_mesh=createCircleFaceArrow(corepoint,0.1,forceFaceDir);
               mesh_tri.add(circle_mesh);

               //var step_1=createCircleFaceArrow2(TubePoints1[1],0.2,forceFaceDir);
              // Tube_group.add(step_1);


                }
                else
                {

                // var direction1 = new THREE.Vector3().subVectors(p2_1, p1_1);
                // var length1=direction1.length();
                // direction1.normalize();
                // var arrowHelper1 = new THREE.ArrowHelper(direction1, p1_1, length1,hex,0.1,0.05);
                var arrowHP1=createCylinderArrowMesh(p1_1,p2_1,arr_face_material,0.01,0.03,0.9);//face arr
                mesh_tri.add(arrowHP1);

                // var direction2 = new THREE.Vector3().subVectors(p3_1, p2_1);
                // var length2=direction2.length();
                // direction2.normalize();
                // var arrowHelper2 = new THREE.ArrowHelper(direction2, p2_1, length2,hex,0.1,0.05);
                var arrowHP2=createCylinderArrowMesh(p2_1,p3_1,arr_face_material,0.01,0.03,0.9);//face arr
                mesh_tri.add(arrowHP2);



                // var direction3 = new THREE.Vector3().subVectors(p1_1, p3_1);
                // var length3=direction3.length();
                // direction3.normalize();
                // var arrowHelper3 = new THREE.ArrowHelper(direction3, p3_1, length3,hex,0.1,0.05);
                var arrowHP3=createCylinderArrowMesh(p3_1,p1_1,arr_face_material,0.01,0.03,0.9);//face arr
                mesh_tri.add(arrowHP3);



                var corepoint2=new THREE.Vector3();
                corepoint2.x=corepoint.x-0.4*forceFaceDir.x;
                corepoint2.y=corepoint.y-0.4*forceFaceDir.y;
                corepoint2.z=corepoint.z-0.4*forceFaceDir.z;

                var corepoint3=new THREE.Vector3();
                corepoint3.x=corepoint.x-0.37*forceFaceDir.x;
                corepoint3.y=corepoint.y-0.37*forceFaceDir.y;
                corepoint3.z=corepoint.z-0.37*forceFaceDir.z;

                if(Is_First)//color diff
                {
                    var arrow_material1=new THREE.MeshPhongMaterial( {
                color: 0x009600
            } );
                 //var arrowN=createCylinderArrowMesh(corepoint,corepoint2,arrow_material1,0.02,0.05,0.7);
                 var arrowN=createCylinderArrowMesh(corepoint2,corepoint,arrow_material1,0.02,0.05,0.6);

                }
                else
                 var arrowN=createCylinderArrowMesh(corepoint2,corepoint,arrow_material2,0.02,0.05,0.6);


                //=new THREE.ArrowHelper(forceFaceDir,corepoint,0.5*forceFaceDir.length(),0x00ff00,0.2,0.1);



                //draw normal

                //var dirN=cross(direction2,direction1);

                //dirN.normalize();


                //var arrowN=new THREE.ArrowHelper(forceFaceDir,corepoint,0.5*forceFaceDir.length(),0x00ff00,0.2,0.1);
                mesh_tri.add(arrowN);

                if(Is_First)//color diff
                {
                    var arrow_material_outline= new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
                 var arrowN_O=createCylinderArrowMesh(corepoint3,corepoint,arrow_material_outline,0.025,0.05,0.55);
                 //
                }
                else
                    var arrow_material_outline= new THREE.MeshBasicMaterial( { color: "white", transparent: false, side: THREE.BackSide } );
                    var arrowN_O=createCylinderArrowMesh(corepoint3,corepoint,arrow_material_outline,0.025,0.05,0.55);



                mesh_tri.add(arrowN_O);
                arrowN_O.scale.multiplyScalar(1.2);

                var TXMesh1=createSpriteText(text,corepoint2);

                text_group2.add(TXMesh1);

                // var Line_center=new THREE.Vector3((p1.x+p2.x)/2,(p1.y+p2.y)/2,(p1.z+p2.z)/2);

                var cir_dir=new THREE.Vector3().subVectors(corepoint,p1);
                cir_dir.normalize();

                var arrowpt=new THREE.Vector3();
                arrowpt.x=corepoint.x+0.2*cir_dir.x;
                arrowpt.y=corepoint.y+0.2*cir_dir.y;
                arrowpt.z=corepoint.z+0.2*cir_dir.z;

                     //arr_dir.normalize();

                var direction1=cir_dir.applyAxisAngle(forceFaceDir,Math.PI/2);

             //var direction1 = new THREE.Vector3().subVectors(p1, p2);
                var length1=0.001;
                direction1.normalize();
               var arrowHelper1 = new THREE.ArrowHelper(direction1, arrowpt, length1,"black",0.1,0.1);

    //            mesh_tri.add(arrowHelper1);


               //cir arr

               var circle_mesh=createCircleFaceArrow(corepoint,0.1,forceFaceDir);
               mesh_tri.add(circle_mesh);

         

              // var step_1=createCircleFaceArrow2(TubePoints1[1],0.4,Force_face_dir[0]);
              // Tube_group.add(step_1);


                }







            //draw normal



            return mesh_tri;



            //var polyhedron =createMesh(new THREE.PolyhedronGeometry(vertices,faces));



        }

export function createSpriteText(text,pos){
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
    