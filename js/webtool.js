function init() {

  var stats = initStats();

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );

  // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(40, 40, 1, 1);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 'white'});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;

  // add the plane to the scene
  scene.add(plane);

  // position and point the camera to the center of the scene
  camera.position.x = -20;
  camera.position.y = 25;
  camera.position.z = 20;
  camera.lookAt(new THREE.Vector3(5, 0, 0));

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x494949);
  scene.add(ambientLight);

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // call the render function

  var v0 = new THREE.Vector3(0, 3, 0);
  var v1 = new THREE.Vector3(0, 5, 0);
  var v2 = new THREE.Vector3(2.6, 0, -1.5);
  var v3 = new THREE.Vector3(-2.6, 0, -1.5);
  var v4 = new THREE.Vector3(0, 0, 3);
  var v5 = new THREE.Vector3();
  var v6 = new THREE.Vector3(10, 2.5, 0);
  var v7 = new THREE.Vector3(10, 5, 0);

  // test perpendicular lines
  var lineGeom1 = new THREE.Geometry();
  lineGeom1.vertices.push(v0, v1)
  var line1 = new THREE.Line(lineGeom1, new THREE.LineBasicMaterial({
  color: 0xff0000
  }));


  var lineGeom2 = new THREE.Geometry();
  lineGeom2.vertices.push(v0, v3)
  var line2 = new THREE.Line(lineGeom2, new THREE.LineBasicMaterial({
  color: 0x0040ff
  }));

  var triangle = new THREE.Triangle(v0, v1, v3);
  triangle.getNormal(v5);

  var lineGeom4 = new THREE.Geometry();
  lineGeom4.vertices.push(v6, v5.multiplyScalar(5).add(v6));
  var line4 = new THREE.Line(lineGeom4, new THREE.LineBasicMaterial({
  color: 0x1bff00
  }));

  var group = new THREE.Group();
  group.add( line1 );
  group.add( line2 );
  group.add( line4 );

  scene.add( group );

  //test surface
  var surface2 = new THREE.Geometry();

  surface2.vertices.push(v0);
  surface2.vertices.push(v1);
  surface2.vertices.push(v2);

  surface2.faces.push(new THREE.Face3(0, 1, 2));

  var materials = [
    new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}),
    new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true})
  ];

  var s2 = THREE.SceneUtils.createMultiMaterialObject(surface2, materials);

  s2.traverse( function( node ) {
      if( node.material ) {
          node.material.side = THREE.DoubleSide;
      }
  });

  scene.add( s2 );

  //original face construction
  var faces = [
      new THREE.Face3(0, 1, 4),
      new THREE.Face3(0, 1, 2),
      new THREE.Face3(0, 1, 3),
      new THREE.Face3(0, 4, 3),
      new THREE.Face3(0, 2, 4),
      new THREE.Face3(0, 3, 2),
  ];

  var geom = new THREE.Geometry();
  geom.vertices = [v0, v1, v2, v3, v4];
  geom.faces = faces;
  geom.computeFaceNormals();

  var materials = [
    new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}),
    new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true})
  ];

  var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
  mesh.castShadow = true;
  mesh.children.forEach(function (e) {
      e.castShadow = true
  });

  mesh.traverse( function( node ) {
      if( node.material ) {
          node.material.side = THREE.DoubleSide;
      }
  });

  scene.add(mesh);

  scene.add(new THREE.GridHelper(40, 15));

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI/4);
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.position.set(-40, 30, 30);
  spotLight.castShadow = true;
  spotLight.lookAt(mesh);
  scene.add(spotLight);

  function addControl(x, y, z) {
      var controls = new function () {
          this.x = x;
          this.y = y;
          this.z = z;
      };

      return controls;
  }

  var controlPoints = [];
  controlPoints.push(addControl(0, 3, 0));
  controlPoints.push(addControl(0, 5, 0));
  controlPoints.push(addControl(2.6, 0, -1.5));
  controlPoints.push(addControl(-2.6, 0, -1.5));
  controlPoints.push(addControl(0, 0, 3));


  var gui = new dat.GUI();

  for (var i = 0; i < 5; i++) {

      f1 = gui.addFolder('Vertices ' + (i + 1));
      f1.add(controlPoints[i], 'x', -10, 10);
      f1.add(controlPoints[i], 'y', -10, 10);
      f1.add(controlPoints[i], 'z', -10, 10);

  }

  var contols = new THREE.OrbitControls(camera, renderer.domElement);

  control = new THREE.TransformControls( camera, renderer.domElement );
  control.addEventListener( 'change', render );
  control.attach(mesh);
  scene.add( control );

  window.addEventListener( 'keydown', function ( event ) {

					switch ( event.keyCode ) {

            case 87: // W
            	control.setMode( "translate" );
            	break;
            case 69: // E
            	control.setMode( "rotate" );
            	break;
            case 82: // R
							control.setMode( "scale" );
							break;

            }

      } );

  render();

  function render() {
      stats.update();

      var vertices = [];
      for (var i = 0; i < 5; i++) {
          vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
      }

      mesh.children.forEach(function (e) {
          e.geometry.vertices = vertices;
          e.geometry.verticesNeedUpdate = true;
          e.geometry.elementsNeedUpdate = true;
          e.geometry.computeFaceNormals();
      });

      var vertices2 = [];
      vertices2.push(new THREE.Vector3(controlPoints[0].x, controlPoints[0].y, controlPoints[0].z));
      vertices2.push(new THREE.Vector3(controlPoints[1].x, controlPoints[1].y, controlPoints[1].z));
      vertices2.push(new THREE.Vector3(controlPoints[2].x, controlPoints[2].y, controlPoints[2].z));

      s2.children.forEach(function (e) {
          e.geometry.vertices = vertices2;
          e.geometry.verticesNeedUpdate = true;
          e.geometry.elementsNeedUpdate = true;
          e.geometry.computeFaceNormals();
      });

      var vertices3 = [];
      vertices3.push(new THREE.Vector3(controlPoints[0].x, controlPoints[0].y, controlPoints[0].z));
      vertices3.push(new THREE.Vector3(controlPoints[1].x, controlPoints[1].y, controlPoints[1].z));

      line1.geometry.vertices = vertices3;
      line1.geometry.verticesNeedUpdate = true;

      var vertices4 = [];
      vertices4.push(new THREE.Vector3(controlPoints[0].x, controlPoints[0].y, controlPoints[0].z));
      vertices4.push(new THREE.Vector3(controlPoints[3].x, controlPoints[3].y, controlPoints[3].z));

      line2.geometry.vertices = vertices4;
      line2.geometry.verticesNeedUpdate = true;


      // render using requestAnimationFrame
      requestAnimationFrame(render);
      renderer.render(scene, camera);
  }
}
