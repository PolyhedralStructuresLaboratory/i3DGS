var renderer;
var orbit_ctrl;
//var camera;
var Ctrl_pts = [];
var Ctrl_tubes = [];
var trfm_ctrl;
var transformControls2;
var lattice_line_material = new THREE.MeshPhongMaterial({
    color: "green"
});
var lattice_line_material1 = new THREE.MeshPhongMaterial({
    color: 0x3b3b3b
});
var lattice_line_material2 = new THREE.MeshPhongMaterial({
    color: 0x3b3b3b
});
var lattice_line_material3 = new THREE.MeshPhongMaterial({
    color: 0x3b3b3b
});

var arrow_material = new THREE.MeshPhongMaterial({
    color: 0x000080
});

var DragPointMat = new THREE.MeshPhongMaterial({color: 0x696969, transparent: true, opacity: 0.8});

var rayCaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var f1;

var control_right;

var controls_scale = new function () {
    this.scale = 0;
    this.MaxScale = 3;

    this.Force_face = true;
    this.Arrow_face = false;
    this.Force_Arrow = true;
    this.Scale_face = false;

    this.Control_Face = false;
    this.ForceFace_left = false;

    this.Cell_Faces = false;

    this.A = false;
    this.B = false;
    this.C = false;
    this.D = false;

    this.AB = false;
    this.AC = false;
    this.AD = false;
    this.BC = false;
    this.BD = false;
    this.CD = false;

    this.Pair_Control = false;
};

var tubethick = new function () {
    this.v = 0.05;
}

var flen = new function () {
    this.l = 2;
}

var FP_B = new function () {
    this.x = 1;
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
var Dlen1 = new function () {
    this.l = 1;

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
    this.z = -1.2;

}
var cp2 = new function () {
    this.z = -1.2;

}
var cp3 = new function () {
    this.z = 1;

}
var cp4 = new function () {
    this.z = -1.2;

}

var fo = new function () {
    this.x = 0;
    this.y = 0;
    this.z = -2;

}

var fo2d = new function () {
    this.x = -0.5;
    this.y = 0;


}
var o1 = new function () {
    this.l = 2;


}

var o2 = new function () {
    this.l = 2;


}

var formo2 = new function () {
    this.l = 2;


}

var formG_AC = new function () {
    this.l = 1;


}

var formG_ACC = new function () {
    this.l = 0.6;


}

var formG_C1C = new function () {
    this.l = 0.6;


}

var formG_C1AC = new function () {
    this.l = 0.25;


}

var formG_C1BC = new function () {
    this.l = 0.15;


}

var formG_A1B1 = new function () {
    this.l = 0.2;


}


var foffset = new function () {
    this.l = 2;


}

var foffset2 = new function () {
    this.l = 0.8;


}

var triP3 = new function () {
    this.z = 0;

}


function initRender() {
    renderer = new THREE.WebGLRenderer({alpha: true});
    //renderer.setClearColor(new THREE.Color(0xf5f5f5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMaptype = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    //renderer.shadowMapType=THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    renderer.setPixelRatio(devicePixelRatio);


}

var camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight * 2), 0.1, 200);
    camera.position.set(10, 0, 0);

    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;

    camera.lookAt({
        x: 0,
        y: 0,
        z: 0
    });
    //resize window to maintaian the size of geometry
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / 2 / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


}

var scene, scene2;

function initScene() {
    scene = new THREE.Scene();

    scene2 = new THREE.Scene();
}

var light;

function initLight() {
    scene.add(new THREE.AmbientLight(0x404040));

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

}


var Tube_group;
var Tube_group_right;
var Face_group_left;
var wrapper;
var step_group_1
var step_group_2
var step_group_1_1
var trial_force
var trial_force_2d
var trial_form_2d
var form_group
var force_group
var force_cell
var form_trial
var form_closingplane
var form_greenfaces
var face_arrow1;
var face_arrow2;
var face_arrow3;
var face_arrow4;

var mesh_left;
var mesh_left_pair;
var mesh_left_ForceFace;
var corePoint_body;

var Change_N3N4 = false;

//var


function addControl(x, y, z) {
    var controls = new function () {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    return controls;
}

$("#FormtrialP3z").slider({
    orientation: "horizontal",

    range: "min",
    max: 1,
    min: -1.5,
    step: 0.01,
    round: 1


});

$("#Divlen1").slider({
    orientation: "horizontal",

    range: "min",
    max: 4,
    min: 1,
    step: 0.01,
    round: 1


});

$("#cpoint1").slider({
    orientation: "horizontal",

    range: "min",
    max: 0,
    min: -1.5,
    step: 0.01,
    round: 1


});

$("#cpoint2").slider({
    orientation: "horizontal",

    range: "min",
    max: 0,
    min: -1.5,
    step: 0.01,
    round: 1


});

$("#cpoint3").slider({
    orientation: "horizontal",

    range: "min",
    max: 2,
    min: -1.3,
    step: 0.01,
    round: 1


});

$("#cpoint4").slider({
    orientation: "horizontal",

    range: "min",
    max: 2,
    min: -2,
    step: 0.01,
    round: 1


});

$("#fpointox").slider({
    orientation: "horizontal",

    range: "min",
    max: 2,
    min: -2,
    step: 0.01,
    round: 1


});

$("#fpointoy").slider({
    orientation: "horizontal",

    range: "min",
    max: 2,
    min: -2,
    step: 0.01,
    round: 1


});

$("#fpointoz").slider({
    orientation: "horizontal",

    range: "min",
    max: 2,
    min: -2,
    step: 0.01,
    round: 1


});

$("#fpointox2d").slider({
    orientation: "horizontal",

    range: "min",
    max: 2,
    min: -2,
    step: 0.01,
    round: 1


});

$("#fpointoy2d").slider({
    orientation: "horizontal",

    range: "min",
    max: 2,
    min: -2,
    step: 0.01,
    round: 1


});

$("#o1len").slider({
    orientation: "horizontal",

    range: "min",
    max: 8,
    min: -5,
    step: 0.01,
    round: 1


});


$("#forceoffset").slider({
    orientation: "horizontal",

    range: "min",
    max: 4,
    min: 1.5,
    step: 0.01,
    round: 1


});

$("#forceoffset2").slider({
    orientation: "horizontal",

    range: "min",
    max: 1,
    min: 0,
    step: 0.01,
    round: 1


});

$("#FormtrialP3z").slider("value", -1);
$("#Divlen1").slider("value", 1);
$("#cpoint1").slider("value", -1.5);
$("#cpoint2").slider("value", -1.5);
$("#cpoint3").slider("value", 1);
$("#cpoint4").slider("value", -1.5);
$("#fpointox").slider("value", 0);
$("#fpointoy").slider("value", 0);
$("#fpointoz").slider("value", -2);
$("#fpointox2d").slider("value", -0.5);
$("#fpointoy2d").slider("value", 0);
$("#o1len").slider("value", 2);
$("#forceoffset").slider("value", 2);
$("#forceoffset2").slider("value", 0.8);

$("#FormtrialP3z").slider({
    slide: function (event, ui) {
        triP3.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        triP3.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#Divlen1").slider({
    slide: function (event, ui) {
        Dlen1.l = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        Dlen1.l = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#cpoint1").slider({
    slide: function (event, ui) {
        cp1.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        cp1.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#cpoint2").slider({
    slide: function (event, ui) {
        cp2.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        cp2.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#cpoint3").slider({
    slide: function (event, ui) {
        cp3.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        cp3.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#cpoint4").slider({
    slide: function (event, ui) {
        cp4.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        cp4.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#fpointox").slider({
    slide: function (event, ui) {
        fo.x = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        fo.x = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#fpointoy").slider({
    slide: function (event, ui) {
        fo.y = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        fo.y = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#fpointox2d").slider({
    slide: function (event, ui) {
        fo2d.x = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        fo2d.x = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#fpointoy2d").slider({
    slide: function (event, ui) {
        fo2d.y = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        fo2d.y = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#fpointoz").slider({
    slide: function (event, ui) {
        fo.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }


    },
    change: function (event, ui) {
        fo.z = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#o1len").slider({
    slide: function (event, ui) {
        o1.l = ui.value;
        redraw();

        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }


    },
    change: function (event, ui) {
        o1.l = ui.value;
        redraw();

        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#forceoffset").slider({
    slide: function (event, ui) {
        foffset.l = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        foffset.l = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});

$("#forceoffset2").slider({
    slide: function (event, ui) {
        foffset2.l = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    },
    change: function (event, ui) {
        foffset2.l = ui.value;
        redraw();
        for (i = 0; i <= 4; i++) {
            text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
        }
        for (i = 0; i <= 6; i++) {
            text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
        }

        form_trial.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });
        trial_force.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial").prop('checked');
            }
        });


        for (i = 0; i <= 1; i++) {
            text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        for (i = 0; i <= 4; i++) {
            text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
        }

        trial_form_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });
        trial_force_2d.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
            if (obj.type === "LineSegments") {
                obj.material.visible = $("#Trial2d").prop('checked');
            }
        });

        if ($("#ForceCell").prop('checked')) {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = false;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
            });
        } else {

            force_group.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = true;
                }
                if (obj.type === "Sprite") {
                    obj.material.visible = true;
                }
            });

            force_cell.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

        }

    }
});


$("#Trial").attr("checked", false);
$("#Trial").change(function () {

    redraw;

    for (i = 0; i <= 4; i++) {
        text_closingplane_trial_group.children[i].visible = $("#Trial").prop('checked');
    }
    for (i = 0; i <= 6; i++) {
        text_force_trial_group.children[i].visible = $("#Trial").prop('checked');
    }

    form_trial.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = $("#Trial").prop('checked');
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = $("#Trial").prop('checked');
        }
    });
    trial_force.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = $("#Trial").prop('checked');
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = $("#Trial").prop('checked');
        }
    });

});


$("#Trial2d").attr("checked", false);
$("#Trial2d").change(function () {

    redraw;


    for (i = 0; i <= 1; i++) {
        text_closingplane_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
    }

    for (i = 0; i <= 4; i++) {
        text_force_2dtrial_group.children[i].visible = $("#Trial2d").prop('checked');
    }

    trial_form_2d.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = $("#Trial2d").prop('checked');
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = $("#Trial2d").prop('checked');
        }
    });
    trial_force_2d.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = $("#Trial2d").prop('checked');
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = $("#Trial2d").prop('checked');
        }
    });

});

$("#ForceCell").attr("checked", false);
$("#ForceCell").change(function () {

    redraw;

    if ($("#ForceCell").prop('checked')) {

        force_group.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = false;
            }
            if (obj.type === "Sprite") {
                obj.material.visible = false;
            }
        });

        force_cell.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = true;
            }
        });
    } else {

        force_group.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = true;
            }
            if (obj.type === "Sprite") {
                obj.material.visible = true;
            }
        });

        force_cell.traverse(function (obj) {
            if (obj.type === "Mesh") {
                obj.material.visible = false;
            }
        });

    }


});


var TubePoints1 = [];
TubePoints1.push(addControl(0, 0, 0));
TubePoints1.push(addControl(0, 0, 1));

//vec2

var TubePoints2 = [];
TubePoints2.push(addControl(0, 0, 0));
TubePoints2.push(addControl(1, -1, -1));


//vec3

var TubePoints3 = [];
TubePoints3.push(addControl(0, 0, 0));
TubePoints3.push(addControl(-1.3660, -0.3660, -1));


//vec3

var TubePoints4 = [];
TubePoints4.push(addControl(0, 0, 0));
TubePoints4.push(addControl(0.3660, 1.3660, -1));

var newPoint1 = [];
newPoint1.push(addControl(-1.7, -1, -1));

var newPoint2 = [];
newPoint2.push(addControl(-0.5, -2, -1));

var newPoint3 = [];
newPoint3.push(addControl(1.7, 1, -1));

var newPoint4 = [];
newPoint4.push(addControl(0.5, 2, -1));

var newFP_B2;


var P_A;


var P_B;
var P_C;
var P_D;

var L;

var P_A_Right;
var P_B_Right;
var P_C_Right;
var P_D_Right;

var P_A_Left;
var P_B_Left;
var P_C_Left;
var P_D_Left;

var P_A_Left_Pair;
var P_B_Left_Pair;
var P_C_Left_Pair;
var P_D_Left_Pair;


var corePoint_temp = new THREE.Vector3(0, 0, 0);

var mesh;

var mesh_left_Cell1;
var mesh_left_Cell2;
var mesh_left_Cell3;
var mesh_left_Cell4;


function initModel() {

    //force

    L = 3;//scale

    Cal_ForcesPnt();
    Force_move();

    P_A_Right = Pnt_copy(P_A);
    P_B_Right = Pnt_copy(P_B);
    P_C_Right = Pnt_copy(P_C);
    P_D_Right = Pnt_copy(P_D);


    var vertices = [
        P_A_Right, P_B_Right, P_C_Right, P_D_Right
    ];

    corePoint_body = new THREE.Vector3();

    corePoint_body.x = (P_A_Right.x + P_B_Right.x + P_C_Right.x + P_D_Right.x) / 4;
    corePoint_body.y = (P_A_Right.y + P_B_Right.y + P_C_Right.y + P_D_Right.y) / 4;
    corePoint_body.z = (P_A_Right.z + P_B_Right.z + P_C_Right.z + P_D_Right.z) / 4;

    var faces = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(2, 3, 1)
    ];


    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();


    var hex = 0x009600;
    geom.faces[0].color.setHex(hex);


    for (i = 1; i < geom.faces.length; i++) {

        var hex1 = "lightgrey";
        geom.faces[i].color.setHex(hex1);
    }


    //  var materials = new THREE.MeshBasicMaterial( {
    // vertexColors: THREE.FaceColors
    // } );


    var materials = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "lightgrey", wireframe: true, transparent: true, opacity: 0.001}),
        new THREE.MeshLambertMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    ];


    mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);


    // var cubeEdges = new THREE.EdgesGeometry(geom, 1);

    // var edgesMtl =  new THREE.LineBasicMaterial({color: 0x4d4dff});

    //  // edgesMtl.depthTest = false; deep test
    // var cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);

    // mesh.add(cubeLine);
    mesh.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;

        // e.geometry.faces[0].color.set(0xff00ee);
        // e.geometry.facesNeedUpdate=true;
        e.geometry.elementsNeedUpdate = true;
        e.geometry.computeFaceNormals();
        //e.geometry.center();
    });

    mesh.children[0].castShadow = true;
    mesh.children[0].receiveShadow = false;


    //mesh.children[1].geometry.faces[0].color.set(0xFF6347);


    //scene2.add(mesh);


    L = controls_scale.scale;//scale

    Cal_ForcesPnt();
    Force_move_left();

    P_A_Left = Pnt_copy(P_A);
    P_B_Left = Pnt_copy(P_B);
    P_C_Left = Pnt_copy(P_C);
    P_D_Left = Pnt_copy(P_D);


    var vertices_left = [
        P_A_Left, P_B_Left, P_C_Left, P_D_Left
    ];

    var faces_left = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(0, 2, 3)
    ];

    var faces_step = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(0, 2, 3)

    ];

    var geom_left = new THREE.Geometry();
    geom_left.vertices = vertices_left;
    geom_left.faces = faces_left;
    geom_left.computeFaceNormals();

    var geom_step = new THREE.Geometry();
    geom_step.vertices = vertices_left;
    geom_step.faces = faces_step;
    geom_step.computeFaceNormals();


    for (i = 0; i < geom_left.faces.length; i++) {
        var hex = 0x156289;
        geom_left.faces[i].color.setHex(hex);
    }

    //  var materials = new THREE.MeshBasicMaterial( {
    // vertexColors: THREE.FaceColors
    // } );


    var materials_left = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "black", wireframe: true, transparent: true, opacity: 0.5}),
        new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    ];

    var materials_step = [
        new THREE.MeshPhongMaterial({color: "black", transparent: true, opacity: 0.5})
    ];


    mesh_left = new THREE.SceneUtils.createMultiMaterialObject(geom_left, materials_left);
    mesh_step = new THREE.SceneUtils.createMultiMaterialObject(geom_step, materials_step);

    // var cubeEdges = new THREE.EdgesGeometry(geom, 1);

    // var edgesMtl =  new THREE.LineBasicMaterial({color: 0x4d4dff});

    //  // edgesMtl.depthTest = false; deep test
    // var cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);

    // mesh.add(cubeLine);


    mesh_left.children[0].castShadow = true;
    mesh_left.children[0].receiveShadow = true;

    //scene.add(mesh_left);
    //scene.add(mesh_step);


    L = controls_scale.MaxScale - controls_scale.scale;//scale

    Cal_ForcesPnt();
    Force_move_left();

    P_A_Left_Pair = Pnt_copy(P_A);
    P_B_Left_Pair = Pnt_copy(P_B);
    P_C_Left_Pair = Pnt_copy(P_C);
    P_D_Left_Pair = Pnt_copy(P_D);


    var vertices_left_pair = [
        P_A_Left_Pair, P_B_Left_Pair, P_C_Left_Pair, P_D_Left_Pair
    ];

    var faces_left_pair = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(0, 2, 3)
    ];

    var geom_left_pair = new THREE.Geometry();
    geom_left_pair.vertices = vertices_left_pair;
    geom_left_pair.faces = faces_left_pair;
    geom_left_pair.computeFaceNormals();


    for (i = 0; i < geom_left_pair.faces.length; i++) {
        var hex = 0x156289;
        geom_left_pair.faces[i].color.setHex(hex);
    }

    //  var materials = new THREE.MeshBasicMaterial( {
    // vertexColors: THREE.FaceColors
    // } );


    var materials_left_pair = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "black", wireframe: true, transparent: true, opacity: 0.5}),
        new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    ];


    mesh_left_pair = new THREE.SceneUtils.createMultiMaterialObject(geom_left_pair, materials_left_pair);

    // var cubeEdges = new THREE.EdgesGeometry(geom, 1);

    // var edgesMtl =  new THREE.LineBasicMaterial({color: 0x4d4dff});

    //  // edgesMtl.depthTest = false; deep test
    // var cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);

    // mesh.add(cubeLine);


    mesh_left_pair.children[0].castShadow = true;
    // mesh_left_pair.children[0].receiveShadow=true;

    scene2.add(mesh_left_pair);


    var vertices_ForceFace = [
        new THREE.Vector3(0, 0, 0), TubePoints1[1], TubePoints2[1], TubePoints3[1], TubePoints4[1]
    ];

    var faces_left_ForceFace = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(0, 1, 4),
        new THREE.Face3(0, 2, 3),
        new THREE.Face3(0, 2, 4),
        new THREE.Face3(0, 3, 4)

    ];

    var geom_left_ForceFace = new THREE.Geometry();
    geom_left_ForceFace.vertices = vertices_ForceFace;
    geom_left_ForceFace.faces = faces_left_ForceFace;
    geom_left_ForceFace.computeFaceNormals();

    geom_left_ForceFace.faces[0].color.setHex(0x008000);
    geom_left_ForceFace.faces[1].color.setHex(0x008000);
    geom_left_ForceFace.faces[2].color.setHex(0x008000);


    for (i = 3; i < geom_left_ForceFace.faces.length; i++) {
        var hex = 0xCCCCCC;
        geom_left_ForceFace.faces[i].color.setHex(hex);
    }

    //  var materials = new THREE.MeshBasicMaterial( {
    // vertexColors: THREE.FaceColors
    // } );


    var materials_left_ForceFace = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "grey", wireframe: true, transparent: true, opacity: 0.1}),
        new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    ];


    mesh_left_ForceFace = new THREE.SceneUtils.createMultiMaterialObject(geom_left_ForceFace, materials_left_ForceFace);

    // var cubeEdges = new THREE.EdgesGeometry(geom, 1);

    // var edgesMtl =  new THREE.LineBasicMaterial({color: 0x4d4dff});

    //  // edgesMtl.depthTest = false; deep test
    // var cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);

    // mesh.add(cubeLine);


    scene.add(mesh_left_ForceFace);

    mesh_left_ForceFace.children[0].material.visible = false;
    mesh_left_ForceFace.children[1].material.visible = false;


    var Cell_left_ForceFace1 = [
        new THREE.Face3(0, 1, 4),
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 4)
    ];

    var Cell_Test = [
        new THREE.Face3(1, 2, 4),

    ];

    var geom_left_ForceFace1 = new THREE.Geometry();
    geom_left_ForceFace1.vertices = vertices_ForceFace;
    geom_left_ForceFace1.faces = Cell_left_ForceFace1;
    geom_left_ForceFace1.computeFaceNormals();

    var geom_Cell_Test = new THREE.Geometry();
    geom_Cell_Test.vertices = vertices_ForceFace;
    geom_Cell_Test.faces = Cell_Test;
    geom_Cell_Test.computeFaceNormals();

    var materials_geom_Cell_Test = new THREE.MeshPhongMaterial({
        color: "grey", transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false
    })

    var Cell_test_1 = new THREE.Mesh(geom_Cell_Test, materials_geom_Cell_Test);

    Cell_test_1.scale.set(0.7, 0.7, 0.7);

    //      scene.add(Cell_test_1);

    for (i = 0; i < geom_left_ForceFace1.faces.length; i++) {
        var hex = 0xCCCCCC;
        geom_left_ForceFace1.faces[i].color.setHex(hex);
    }

    //  var materials = new THREE.MeshBasicMaterial( {
    // vertexColors: THREE.FaceColors
    // } );

    var materials_left_Cell1 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.01}),
        new THREE.MeshPhongMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            depthWrite: false,
            //clippingPlanes:[clipPlanes],
            //clipIntersection: true
        })
    ];


    mesh_left_Cell1 = new THREE.SceneUtils.createMultiMaterialObject(geom_left_ForceFace1, materials_left_Cell1);

    var Cell_left_ForceFace2 = [
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3)

    ];

    var geom_left_ForceFace2 = new THREE.Geometry();
    geom_left_ForceFace2.vertices = vertices_ForceFace;
    geom_left_ForceFace2.faces = Cell_left_ForceFace2;
    geom_left_ForceFace2.computeFaceNormals();


    for (i = 0; i < geom_left_ForceFace2.faces.length; i++) {
        var hex = 0xCCCCCC;
        geom_left_ForceFace2.faces[i].color.setHex(hex);
    }


    var materials_left_Cell2 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
        new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            depthWrite: false,
            // clippingPlanes:[clipPlanes],
            //clipIntersection: true
        })
    ];


    mesh_left_Cell2 = new THREE.SceneUtils.createMultiMaterialObject(geom_left_ForceFace2, materials_left_Cell2);


    var Cell_left_ForceFace3 = [
        new THREE.Face3(0, 1, 4),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(0, 3, 4)

    ];

    var geom_left_ForceFace3 = new THREE.Geometry();
    geom_left_ForceFace3.vertices = vertices_ForceFace;
    geom_left_ForceFace3.faces = Cell_left_ForceFace3;
    geom_left_ForceFace3.computeFaceNormals();


    for (i = 0; i < geom_left_ForceFace3.faces.length; i++) {
        var hex = 0xCCCCCC;
        geom_left_ForceFace3.faces[i].color.setHex(hex);
    }


    var materials_left_Cell3 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
        new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            depthWrite: false,
            //  clippingPlanes:[clipPlanes],
            // clipIntersection: true
        })
    ];


    mesh_left_Cell3 = new THREE.SceneUtils.createMultiMaterialObject(geom_left_ForceFace3, materials_left_Cell3);

    var Cell_left_ForceFace4 = [
        new THREE.Face3(0, 2, 3),
        new THREE.Face3(0, 2, 4),
        new THREE.Face3(0, 3, 4)

    ];

    var geom_left_ForceFace4 = new THREE.Geometry();
    geom_left_ForceFace4.vertices = vertices_ForceFace;
    geom_left_ForceFace4.faces = Cell_left_ForceFace4;
    geom_left_ForceFace4.computeFaceNormals();


    for (i = 0; i < geom_left_ForceFace4.faces.length; i++) {
        var hex = 0xCCCCCC;
        geom_left_ForceFace4.faces[i].color.setHex(hex);
    }


    var materials_left_Cell4 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
        new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    ];


    mesh_left_Cell4 = new THREE.SceneUtils.createMultiMaterialObject(geom_left_ForceFace4, materials_left_Cell4);


    mesh_left_Cell1.scale.set(0.7, 0.7, 0.7);
    mesh_left_Cell2.scale.set(0.7, 0.7, 0.7);
    mesh_left_Cell3.scale.set(0.7, 0.7, 0.7);
    mesh_left_Cell4.scale.set(0.7, 0.7, 0.7);


    mesh_left_Cell1.position.set(0.2, 0, -0.05);

    mesh_left_Cell2.position.set(0, -0.2, -0.05);

    mesh_left_Cell3.position.set(-0.15, 0.2, -0.05);

    mesh_left_Cell4.position.set(0, 0, -0.2);

    scene.add(mesh_left_Cell1);
    scene.add(mesh_left_Cell2);
    scene.add(mesh_left_Cell3);
    //   scene.add(mesh_left_Cell4);

    for (i = 0; i < 2; i++) {
        mesh_left_Cell1.children[i].material.visible = false;
        mesh_left_Cell2.children[i].material.visible = false;
        mesh_left_Cell3.children[i].material.visible = false;
        mesh_left_Cell4.children[i].material.visible = false;

    }


    redraw();

    redraw_Force();

    redraw_right();

    Tube_group_right.traverse(function (obj) {//hide
        if (obj.type === "Mesh") {
            obj.material.visible = false;
        }
    });


    // Transform control (a triad)
    trfm_ctrl = new THREE.TransformControls(camera, renderer.domElement);
    trfm_ctrl.addEventListener('change', render);

    trfm_ctrl.addEventListener('objectChange', function () {

        if (Math.abs(selectObj.position.x) <= 2 && Math.abs(selectObj.position.y) <= 2 && Math.abs(selectObj.position.z) <= 2) {

            //     if(selectObj.name.charAt(2)==='1')
            //     {
            //          TubePoints1[1].x=selectObj.position.x;
            //          TubePoints1[1].y=selectObj.position.y;
            //          TubePoints1[1].z=selectObj.position.z;

            //     }

            //    if(selectObj.name.charAt(2)==='2')
            //     {
            //          TubePoints2[1].x=selectObj.position.x;
            //          TubePoints2[1].y=selectObj.position.y;
            //          TubePoints2[1].z=selectObj.position.z;

            //     }
            //     if(selectObj.name.charAt(2)==='3')
            //     {
            //          TubePoints3[1].x=selectObj.position.x;
            //          TubePoints3[1].y=selectObj.position.y;
            //          TubePoints3[1].z=selectObj.position.z;

            //     }
            //     if(selectObj.name.charAt(2)==='4')
            //     {
            //          TubePoints4[1].x=selectObj.position.x;
            //          TubePoints4[1].y=selectObj.position.y;
            //          TubePoints4[1].z=selectObj.position.z;

            //     }

            // if(selectObj.name.charAt(2)==='2')
            // {
            //      newFP_B2.x=selectObj.position.x;
            //      newFP_B2.y=selectObj.position.y;
            //      newFP_B2.z=selectObj.position.z;


            // }

            // if(selectObj.name.charAt(2)==='7')
            // {
            //      newPoint2[0].x=selectObj.position.x;
            //      newPoint2[0].y=selectObj.position.y;
            //      newPoint2[0].z=selectObj.position.z;


            // }
            // if(selectObj.name.charAt(2)==='8')
            // {
            //      newPoint3[0].x=selectObj.position.x;
            //      newPoint3[0].y=selectObj.position.y;
            //      newPoint3[0].z=selectObj.position.z;


            // }
            // if(selectObj.name.charAt(2)==='9')
            // {
            //      newPoint4[0].x=selectObj.position.x;
            //      newPoint4[0].y=selectObj.position.y;
            //      newPoint4[0].z=selectObj.position.z;


            // }

            redraw();
            if (controls_scale.Scale_face)
                redraw_Force();
            if (controls_scale.Control_Face)
                redraw_right();
            if (controls_scale.ForceFace_left)
                redraw_Faces6();
            if (controls_scale.Cell_Faces)
                redraw_Cell();
        }


        //render();
    });

    trfm_ctrl.addEventListener('mouseDown', () => {

        orbit_ctrl.enabled = false;
        if (controls_scale.Pair_Control) {

            for (i = 0; i <= 1; i++) {
                mesh_F1_pair.children[i].material.visible = false;
                mesh_F2_pair.children[i].material.visible = false;
                mesh_F3_pair.children[i].material.visible = false;
                mesh_F4_pair.children[i].material.visible = false;
                mesh_left_pair.children[i].material.visible = false;
            }

            redraw();
            for (i = 0; i <= 1; i++) {
                mesh.children[i].material.visible = true;
            }

            // mesh_left_ForceFace.children.forEach(function (e) {
            //     e.geometry.vertices = vertices;
            //     e.geometry.verticesNeedUpdate = true;

            //     // e.geometry.faces[0].color.set(0xff00ee);
            //     // e.geometry.facesNeedUpdate=true;
            //     e.geometry.elementsNeedUpdate = true;
            //     e.geometry.computeFaceNormals();
            //     //e.geometry.center();
            // });

            Tube_group_pair.traverse(function (obj) {//hide
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

            for (i = 0; i <= 1; i++) {
                mesh_F1.children[i].material.visible = false;
                mesh_F2.children[i].material.visible = false;
                mesh_F3.children[i].material.visible = false;
                mesh_F4.children[i].material.visible = false;
                mesh_left.children[i].material.visible = false;
            }
        }


    });
    trfm_ctrl.addEventListener('mouseUp', () => {

        orbit_ctrl.enabled = true;
    });


    scene.add(trfm_ctrl);


    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    document.oncontextmenu = function (event) {
        event.preventDefault();
    };


    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);
    scene2.add(ambient.clone());

    var light = new THREE.DirectionalLight(0xffffff);
    // light.position.set( 1, 1, 1 ).normalize();
    light.position.set(0, 0, 20);
    light.shadow.camera.left = -30; // or whatever value works for the scale of your scene
    light.shadow.camera.right = 30;
    light.shadow.camera.top = 30;
    light.shadow.camera.bottom = -30;
    light.shadow.camera.near = 0.01;
    light.shadow.camera.far = 100;
    light.castShadow = true;
    light.shadowMapHeight = 4096;
    light.shadowMapWidth = 4096;
    //light.shadow.map.width=512;
    //light.shadow.map.height=1000;

    scene.add(light);
    scene2.add(light.clone());

    // var helper = new THREE.CameraHelper( light.shadow.camera );
    // scene1.add( helper );


    // ground plane for shadow effects
    var FLOOR = -2.5;
    var geometry = new THREE.PlaneBufferGeometry(100, 100);
    // var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
    var planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.2;
    var ground = new THREE.Mesh(geometry, planeMaterial);
    ground.position.set(0, 0, FLOOR);
    ground.rotation.x = 0;
    ground.scale.set(100, 100, 100);
    ground.castShadow = false;
    ground.receiveShadow = true;
    scene.add(ground);
    scene2.add(ground.clone());


    for (i = 0; i <= 1; i++) {

        mesh_left.children[i].material.visible = false;
    }
    mesh_F1.children[0].material.visible = false;
    mesh_F2.children[0].material.visible = false;
    mesh_F3.children[0].material.visible = false;
    mesh_F4.children[0].material.visible = false;
    for (i = 0; i <= 1; i++) {


        mesh_left_pair.children[i].material.visible = false;
    }


    mesh_TriFace1.children[0].material.visible = false;
    mesh_TriFace2.children[0].material.visible = false;
    mesh_TriFace3.children[0].material.visible = false;
    mesh_TriFace4.children[0].material.visible = false;

    for (i = 1; i <= 3; i++) {
        mesh_TriFace1.children[i].visible = false;
        mesh_TriFace2.children[i].visible = false;
        mesh_TriFace3.children[i].visible = false;
        mesh_TriFace4.children[i].visible = false;
    }


}


function createCircleFaceArrow(centerPt, radius, arr_dir) {

    var Vec_a = cross(arr_dir, new THREE.Vector3(1, 0, 0)); // vec cal

    if (Vec_a.x === 0 && Vec_a.y === 0 && Vec_a.z === 0) {
        Vec_a = cross(arr_dir, new THREE.Vector3(0, 1, 0));//% vec cal
    }

    var Vec_b = cross(arr_dir, Vec_a);

    Vec_a.normalize();
    Vec_b.normalize();

    var points = [];
    var length = 20;


    for (i = 0; i <= length; i++) {
        var Pts_Circle = new THREE.Vector3(0, 0, 0);
        Pts_Circle.x = centerPt.x + radius * Vec_a.x * Math.cos(Math.PI * 1.5 * i / length) + radius * Vec_b.x * Math.sin(Math.PI * 1.5 * i / length);
        Pts_Circle.y = centerPt.y + radius * Vec_a.y * Math.cos(Math.PI * 1.5 * i / length) + radius * Vec_b.y * Math.sin(Math.PI * 1.5 * i / length);
        Pts_Circle.z = centerPt.z + radius * Vec_a.z * Math.cos(Math.PI * 1.5 * i / length) + radius * Vec_b.z * Math.sin(Math.PI * 1.5 * i / length);

        points.push(Pts_Circle);

    }

    var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints(points);
    //var line2 = new THREE.Line( geometrySpacedPoints, material);

    var arcMaterial = new THREE.LineDashedMaterial({
        color: 0x00ff00,//color
        dashSize: 0.1,//size
        gapSize: 0.05//dis
    });


    var CircleMesh = new THREE.Line(geometrySpacedPoints, arcMaterial);

    CircleMesh.computeLineDistances();//compute

    var arrow_material1 = new THREE.MeshBasicMaterial({
        color: "white"//green
    });

    // var CircleMesh=createCylinderMesh(points[0],points[1],arrow_material1,0.02,0.02);

    for (i = 0; i < length; i++) {
        var CircleMesh1 = createCylinderMesh(points[i], points[i + 1], arrow_material1, 0.005, 0.005);
        CircleMesh.add(CircleMesh1);
    }

    var Arr_Pt1 = new THREE.Vector3(0, 0, 0);

    Arr_Pt1.x = centerPt.x + radius * Vec_a.x * Math.cos(Math.PI * 1.6 * i / length) + radius * Vec_b.x * Math.sin(Math.PI * 1.6 * i / length);
    Arr_Pt1.y = centerPt.y + radius * Vec_a.y * Math.cos(Math.PI * 1.6 * i / length) + radius * Vec_b.y * Math.sin(Math.PI * 1.6 * i / length);
    Arr_Pt1.z = centerPt.z + radius * Vec_a.z * Math.cos(Math.PI * 1.6 * i / length) + radius * Vec_b.z * Math.sin(Math.PI * 1.6 * i / length);


    var face_arrow1 = createCylinderArrowMesh(points[length], Arr_Pt1, arrow_material1, 0.01, 0.02, 0.01);

    CircleMesh.add(face_arrow1);


    // CircleMesh.position.x=centerPt.x;
    // CircleMesh.position.y=centerPt.y;
    // CircleMesh.position.z=centerPt.z;
    //scene2.add(CircleMesh);

    return CircleMesh;


}

function createCircleFaceArrow2(centerPt, radius, arr_dir) {

    var Vec_a = cross(arr_dir, new THREE.Vector3(1, 0, 0)); // vec cal

    if (Vec_a.x === 0 && Vec_a.y === 0 && Vec_a.z === 0) {
        Vec_a = cross(arr_dir, new THREE.Vector3(0, 1, 0));//% vec cal
    }

    var Vec_b = cross(arr_dir, Vec_a);

    Vec_a.normalize();
    Vec_b.normalize();

    var points = [];
    var length = 20;


    for (i = 0; i <= length; i++) {
        var Pts_Circle = new THREE.Vector3(0, 0, 0);
        Pts_Circle.x = centerPt.x + radius * Vec_a.x * Math.cos(Math.PI * 1.5 * i / length) + radius * Vec_b.x * Math.sin(Math.PI * 1.5 * i / length);
        Pts_Circle.y = centerPt.y + radius * Vec_a.y * Math.cos(Math.PI * 1.5 * i / length) + radius * Vec_b.y * Math.sin(Math.PI * 1.5 * i / length);
        Pts_Circle.z = centerPt.z + radius * Vec_a.z * Math.cos(Math.PI * 1.5 * i / length) + radius * Vec_b.z * Math.sin(Math.PI * 1.5 * i / length);

        points.push(Pts_Circle);

    }

    var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints(points);
    //var line2 = new THREE.Line( geometrySpacedPoints, material);

    var arcMaterial = new THREE.LineDashedMaterial({
        color: 0x00ff00,//color
        dashSize: 0.1,//size
        gapSize: 0.05//dis
    });


    var CircleMesh = new THREE.Line(geometrySpacedPoints, arcMaterial);

    CircleMesh.computeLineDistances();//compute

    var arrow_material1 = new THREE.MeshPhongMaterial({
        color: 0x009600//green
    });

    // var CircleMesh=createCylinderMesh(points[0],points[1],arrow_material1,0.02,0.02);

    for (i = 0; i < length; i++) {
        var CircleMesh1 = createCylinderMesh(points[i], points[i + 1], arrow_material1, 0.005, 0.005);
        CircleMesh.add(CircleMesh1);
    }

    var Arr_Pt1 = new THREE.Vector3(0, 0, 0);

    Arr_Pt1.x = centerPt.x + radius * Vec_a.x * Math.cos(Math.PI * 1.6 * i / length) + radius * Vec_b.x * Math.sin(Math.PI * 1.6 * i / length);
    Arr_Pt1.y = centerPt.y + radius * Vec_a.y * Math.cos(Math.PI * 1.6 * i / length) + radius * Vec_b.y * Math.sin(Math.PI * 1.6 * i / length);
    Arr_Pt1.z = centerPt.z + radius * Vec_a.z * Math.cos(Math.PI * 1.6 * i / length) + radius * Vec_b.z * Math.sin(Math.PI * 1.6 * i / length);


    var face_arrow1 = createCylinderArrowMesh(points[length], Arr_Pt1, arrow_material1, 0.01, 0.02, 0.01);

    CircleMesh.add(face_arrow1);


    // CircleMesh.position.x=centerPt.x;
    // CircleMesh.position.y=centerPt.y;
    // CircleMesh.position.z=centerPt.z;
    //scene2.add(CircleMesh);

    return CircleMesh;


}


function createCylinderMesh(pointX, pointY, material1, radius, radius2) {
    if (radius === undefined) {
        radius = 1;
    }

    if (radius2 === undefined) {
        radius2 = radius;
    }

    var direction = new THREE.Vector3().subVectors(pointY, pointX);
    var orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1));
    var edgeGeometry = new THREE.CylinderGeometry(radius, radius2, direction.length(), 8, 1);
    var edge = new THREE.Mesh(edgeGeometry, material1);
    edge.applyMatrix4(orientation);
    // position based on midpoints - there may be a better solution than this
    edge.position.x = (pointY.x + pointX.x) / 2;
    edge.position.y = (pointY.y + pointX.y) / 2;
    edge.position.z = (pointY.z + pointX.z) / 2;

    return edge;
}

//minkow

function create_TriangleMesh(p1, p2, p3, direction, coreScale)//dir
{

    var corepoint = face_center(p1, p2, p3);


    var unit_direction = new THREE.Vector3();//normalize
    unit_direction.x = direction.x / norm(direction);
    unit_direction.y = direction.y / norm(direction);
    unit_direction.z = direction.z / norm(direction);


    // var Scale_direction=new THREE.Vector3();

    // Scale_direction.x=1.2*unit_direction.x;
    // Scale_direction.y=1.2*unit_direction.y;
    // Scale_direction.z=1.2*unit_direction.z;


    var direction1 = new THREE.Vector3().subVectors(coreScale, corepoint);
    var m = direction1.length();

    //var dis=distance(,);//dis

    //var m=Math.sqrt((dis*dis)/(norm(unit_direction)*norm(unit_direction)));

    // var out1=new THREE.Vector3();
    // out1.x=corepoint.x+0.2*unit_direction.x;
    // out1.y=corepoint.y+0.2*unit_direction.y;
    // out1.z=corepoint.z+0.2*unit_direction.z;

    // if(out1.length()<corepoint.length())
    // {
    //     unit_direction.multiplyScalar(-1);
    // }


    //move

    var p1_1 = new THREE.Vector3();
    p1_1.x = p1.x + m * unit_direction.x;
    p1_1.y = p1.y + m * unit_direction.y;
    p1_1.z = p1.z + m * unit_direction.z;

    var p2_1 = new THREE.Vector3();
    p2_1.x = p2.x + m * unit_direction.x;
    p2_1.y = p2.y + m * unit_direction.y;
    p2_1.z = p2.z + m * unit_direction.z;

    var p3_1 = new THREE.Vector3();
    p3_1.x = p3.x + m * unit_direction.x;
    p3_1.y = p3.y + m * unit_direction.y;
    p3_1.z = p3.z + m * unit_direction.z;

    //vector minkow

    var vertices_tri = [
        p1, p2, p3, p1_1, p2_1, p3_1
    ];

    var faces_tri = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 4, 1),
        new THREE.Face3(2, 1, 4),
        new THREE.Face3(0, 3, 4),
        new THREE.Face3(2, 4, 5),
        new THREE.Face3(0, 3, 5),
        new THREE.Face3(2, 0, 5),
        new THREE.Face3(3, 4, 5)

    ];


    var geom_tri = new THREE.Geometry();
    geom_tri.vertices = vertices_tri;
    geom_tri.faces = faces_tri;
    geom_tri.computeFaceNormals();


    for (i = 0; i < geom_tri.faces.length; i++) {
        var hex = 0x156289;
        geom_tri.faces[i].color.setHex(hex);
    }

    //  var materials = new THREE.MeshBasicMaterial( {
    // vertexColors: THREE.FaceColors
    // } );


    var materials_tri = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        //       new THREE.MeshBasicMaterial({color: 0x156289, wireframe: true,transparent: true,opacity:0.001}),
        new THREE.MeshPhongMaterial({
            vertexColors: THREE.FaceColors, transparent: true, opacity: 0.1, side: THREE.DoubleSide
        })
    ];


    //var polyhedron =createMesh(new THREE.PolyhedronGeometry(vertices,faces));
    return new THREE.SceneUtils.createMultiMaterialObject(geom_tri, materials_tri);

}


//minkow

function create_Tri_FaceMesh(p1, p2, p3, arr_face_dir, Is_First, arr_dir, text)//dir
{

    var corepoint = face_center(p1, p2, p3);
    var m = 0.2;//scale


    var dirA = new THREE.Vector3().subVectors(corepoint, p1);
    var dirB = new THREE.Vector3().subVectors(corepoint, p2);
    var dirC = new THREE.Vector3().subVectors(corepoint, p3);

    dirA.normalize();
    dirB.normalize();
    dirC.normalize();

    // var unit_dir1=new THREE.Vector3();//normalize
    // unit_dir1.x=dirA.x/norm(dirA);
    // unit_dir1.y=dirA.y/norm(dirA);
    // unit_dir1.z=dirA.z/norm(dirA);

    // var unit_dir2=new THREE.Vector3();//normalize
    // unit_dir2.x=dirB.x/norm(dirB);
    // unit_dir2.y=dirB.y/norm(dirB);
    // unit_dir2.z=dirB.z/norm(dirB);

    // var unit_dir3=new THREE.Vector3();//normalize
    // unit_dir3.x=dirC.x/norm(dirC);
    // unit_dir3.y=dirC.y/norm(dirC);
    // unit_dir3.z=dirC.z/norm(dirC);


    //move

    var p1_1 = new THREE.Vector3();
    // p1_1=subVec(p1,m*unit_dir1);
    p1_1.x = p1.x + m * dirA.x;
    p1_1.y = p1.y + m * dirA.y;
    p1_1.z = p1.z + m * dirA.z;

    var p2_1 = new THREE.Vector3();
    p2_1.x = p2.x + m * dirB.x;
    p2_1.y = p2.y + m * dirB.y;
    p2_1.z = p2.z + m * dirB.z;

    var p3_1 = new THREE.Vector3();
    p3_1.x = p3.x + m * dirC.x;
    p3_1.y = p3.y + m * dirC.y;
    p3_1.z = p3.z + m * dirC.z;


    var vertices_tri = [
        p1_1, p2_1, p3_1
    ];

    var faces_tri = [
        new THREE.Face3(2, 1, 0),

    ];


    var geom_tri = new THREE.Geometry();
    geom_tri.vertices = vertices_tri;
    geom_tri.faces = faces_tri;
    geom_tri.computeFaceNormals();


    for (i = 0; i < geom_tri.faces.length; i++) {
        if (Is_First) {
            var hex = 0x008000;
            geom_tri.faces[i].color.setHex(hex);
        } else {
            var hex = 0xa9a9a9;
            geom_tri.faces[i].color.setHex(hex);
        }

    }

    //  var materials = new THREE.MeshBasicMaterial( {
    // vertexColors: THREE.FaceColors
    // } );

    var materials_tri = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        // new THREE.MeshBasicMaterial({color: 0x4d4dff, wireframe: true,transparent: true,opacity:0.05}),
        new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors, transparent: true, opacity: 0.2, side: THREE.DoubleSide
        })
    ];

    var mesh_tri = new THREE.SceneUtils.createMultiMaterialObject(geom_tri, materials_tri);

    // return mesh_tri;

    //arrowHelper1.add(mesh_tri)

    //var arrowHelper1;


    //var length = 1;
    // var hex = 0x000000;//black
    if (Is_First)

        var arr_face_material = new THREE.MeshPhongMaterial({
            color: 0x009600//force face green
        });
    else
        var arr_face_material = new THREE.MeshPhongMaterial({
            color: 0x000000//force face black
        });

    if (arr_dir < 0)//
    {
        arrow_material2 = new THREE.MeshPhongMaterial({
            color: 0xC00000//red
        });

    } else {
        arrow_material2 = new THREE.MeshPhongMaterial({

            color: 0x0F3150//blue
        });

    }


    var forceFaceDir = Pnt_copy(arr_face_dir);
    forceFaceDir.normalize();


    var out1 = new THREE.Vector3();
    out1.x = corepoint.x + 0.2 * forceFaceDir.x;
    out1.y = corepoint.y + 0.2 * forceFaceDir.y;
    out1.z = corepoint.z + 0.2 * forceFaceDir.z;


    var out2 = new THREE.Vector3();
    out2.x = corepoint.x - 0.2 * forceFaceDir.x;
    out2.y = corepoint.y - 0.2 * forceFaceDir.y;
    out2.z = corepoint.z - 0.2 * forceFaceDir.z;

    var out1_core = new THREE.Vector3().subVectors(out1, corePoint_body);
    var out2_core = new THREE.Vector3().subVectors(out2, corePoint_body);

    if (out1_core.length() > out2_core.length()) {


        var arrowHP1 = createCylinderArrowMesh(p3_1, p1_1, arr_face_material, 0.01, 0.03, 0.9);//face arrow

        // var direction1 = new THREE.Vector3().subVectors(p1_1, p3_1);
        // var length1=direction1.length();
        // direction1.normalize();
        // var arrowHelper1 = new THREE.ArrowHelper(direction1, p3_1, length1,hex,0.2,0.05);
        mesh_tri.add(arrowHP1);

        // var direction2 = new THREE.Vector3().subVectors(p3_1, p2_1);
        // var length2=direction2.length();
        // direction2.normalize();
        // var arrowHelper2 = new THREE.ArrowHelper(direction2, p2_1, length2,hex,0.2,0.05);
        var arrowHP2 = createCylinderArrowMesh(p2_1, p3_1, arr_face_material, 0.01, 0.03, 0.9);//face arrow
        mesh_tri.add(arrowHP2);

        // var direction3 = new THREE.Vector3().subVectors(p2_1, p1_1);
        // var length3=direction3.length();
        // direction3.normalize();
        // var arrowHelper3 = new THREE.ArrowHelper(direction3, p1_1, length3,hex,0.2,0.05);
        var arrowHP3 = createCylinderArrowMesh(p1_1, p2_1, arr_face_material, 0.01, 0.03, 0.9);//face arrow
        mesh_tri.add(arrowHP3);

        //n arrow

        var corepoint2 = new THREE.Vector3();
        corepoint2.x = corepoint.x + 0.4 * forceFaceDir.x;
        corepoint2.y = corepoint.y + 0.4 * forceFaceDir.y;
        corepoint2.z = corepoint.z + 0.4 * forceFaceDir.z;

        var corepoint3 = new THREE.Vector3();
        corepoint3.x = corepoint.x + 0.37 * forceFaceDir.x;
        corepoint3.y = corepoint.y + 0.37 * forceFaceDir.y;
        corepoint3.z = corepoint.z + 0.37 * forceFaceDir.z;


        //=new THREE.ArrowHelper(forceFaceDir,corepoint,0.5*forceFaceDir.length(),0x00ff00,0.2,0.1);
        if (Is_First)//color diff
        {
            var arrow_material1 = new THREE.MeshPhongMaterial({
                color: 0x009600
            });
            var arrowN = createCylinderArrowMesh(corepoint, corepoint2, arrow_material1, 0.02, 0.05, 0.6);
            //
        } else
            var arrowN = createCylinderArrowMesh(corepoint, corepoint2, arrow_material2, 0.02, 0.05, 0.6);


        mesh_tri.add(arrowN);

        if (Is_First)//color diff
        {
            var arrow_material_outline = new THREE.MeshBasicMaterial({
                color: "white",
                transparent: false,
                side: THREE.BackSide
            });
        } else
            var arrow_material_outline = new THREE.MeshBasicMaterial({
                color: "white",
                transparent: false,
                side: THREE.BackSide
            });
        var arrowN_O = createCylinderArrowMesh(corepoint, corepoint3, arrow_material_outline, 0.025, 0.05, 0.55);


        mesh_tri.add(arrowN_O);
        arrowN_O.scale.multiplyScalar(1.2);

        var TXMesh = createSpriteText(text, corepoint2);

        text_group2.add(TXMesh);

        //face arrow

        var cir_dir = new THREE.Vector3().subVectors(corepoint, p1);
        cir_dir.normalize();

        var arrowpt = new THREE.Vector3();
        arrowpt.x = corepoint.x + 0.2 * cir_dir.x;
        arrowpt.y = corepoint.y + 0.2 * cir_dir.y;
        arrowpt.z = corepoint.z + 0.2 * cir_dir.z;

        //arr_dir.normalize();

        var direction1 = cir_dir.applyAxisAngle(forceFaceDir, Math.PI / 2);

        //var direction1 = new THREE.Vector3().subVectors(p1, p2);
        var length1 = 0.001;
        direction1.normalize();

        //cir arrow

        var circle_mesh = createCircleFaceArrow(corepoint, 0.1, forceFaceDir);
        mesh_tri.add(circle_mesh);

        //var step_1=createCircleFaceArrow2(TubePoints1[1],0.2,forceFaceDir);
        // Tube_group.add(step_1);


    } else {

        // var direction1 = new THREE.Vector3().subVectors(p2_1, p1_1);
        // var length1=direction1.length();
        // direction1.normalize();
        // var arrowHelper1 = new THREE.ArrowHelper(direction1, p1_1, length1,hex,0.1,0.05);
        var arrowHP1 = createCylinderArrowMesh(p1_1, p2_1, arr_face_material, 0.01, 0.03, 0.9);//face arrow
        mesh_tri.add(arrowHP1);

        // var direction2 = new THREE.Vector3().subVectors(p3_1, p2_1);
        // var length2=direction2.length();
        // direction2.normalize();
        // var arrowHelper2 = new THREE.ArrowHelper(direction2, p2_1, length2,hex,0.1,0.05);
        var arrowHP2 = createCylinderArrowMesh(p2_1, p3_1, arr_face_material, 0.01, 0.03, 0.9);//face arrow
        mesh_tri.add(arrowHP2);


        // var direction3 = new THREE.Vector3().subVectors(p1_1, p3_1);
        // var length3=direction3.length();
        // direction3.normalize();
        // var arrowHelper3 = new THREE.ArrowHelper(direction3, p3_1, length3,hex,0.1,0.05);
        var arrowHP3 = createCylinderArrowMesh(p3_1, p1_1, arr_face_material, 0.01, 0.03, 0.9);//face arrow
        mesh_tri.add(arrowHP3);


        var corepoint2 = new THREE.Vector3();
        corepoint2.x = corepoint.x - 0.4 * forceFaceDir.x;
        corepoint2.y = corepoint.y - 0.4 * forceFaceDir.y;
        corepoint2.z = corepoint.z - 0.4 * forceFaceDir.z;

        var corepoint3 = new THREE.Vector3();
        corepoint3.x = corepoint.x - 0.37 * forceFaceDir.x;
        corepoint3.y = corepoint.y - 0.37 * forceFaceDir.y;
        corepoint3.z = corepoint.z - 0.37 * forceFaceDir.z;

        if (Is_First)//color diff
        {
            var arrow_material1 = new THREE.MeshPhongMaterial({
                color: 0x009600
            });
            //var arrowN=createCylinderArrowMesh(corepoint,corepoint2,arrow_material1,0.02,0.05,0.7);
            var arrowN = createCylinderArrowMesh(corepoint2, corepoint, arrow_material1, 0.02, 0.05, 0.6);

        } else
            var arrowN = createCylinderArrowMesh(corepoint2, corepoint, arrow_material2, 0.02, 0.05, 0.6);


        //=new THREE.ArrowHelper(forceFaceDir,corepoint,0.5*forceFaceDir.length(),0x00ff00,0.2,0.1);


        //n arrow

        //var dirN=cross(direction2,direction1);

        //dirN.normalize();


        //var arrowN=new THREE.ArrowHelper(forceFaceDir,corepoint,0.5*forceFaceDir.length(),0x00ff00,0.2,0.1);
        mesh_tri.add(arrowN);

        if (Is_First)//color diff
        {
            var arrow_material_outline = new THREE.MeshBasicMaterial({
                color: "white",
                transparent: false,
                side: THREE.BackSide
            });
        } else
            var arrow_material_outline = new THREE.MeshBasicMaterial({
                color: "white",
                transparent: false,
                side: THREE.BackSide
            });
        var arrowN_O = createCylinderArrowMesh(corepoint3, corepoint, arrow_material_outline, 0.025, 0.05, 0.55);


        mesh_tri.add(arrowN_O);
        arrowN_O.scale.multiplyScalar(1.2);

        var TXMesh1 = createSpriteText(text, corepoint2);

        text_group2.add(TXMesh1);

        // var Line_center=new THREE.Vector3((p1.x+p2.x)/2,(p1.y+p2.y)/2,(p1.z+p2.z)/2);

        var cir_dir = new THREE.Vector3().subVectors(corepoint, p1);
        cir_dir.normalize();

        var arrowpt = new THREE.Vector3();
        arrowpt.x = corepoint.x + 0.2 * cir_dir.x;
        arrowpt.y = corepoint.y + 0.2 * cir_dir.y;
        arrowpt.z = corepoint.z + 0.2 * cir_dir.z;

        //arr_dir.normalize();

        var direction1 = cir_dir.applyAxisAngle(forceFaceDir, Math.PI / 2);

        //var direction1 = new THREE.Vector3().subVectors(p1, p2);
        var length1 = 0.001;
        direction1.normalize();

        //cir arrow

        var circle_mesh = createCircleFaceArrow(corepoint, 0.1, forceFaceDir);
        mesh_tri.add(circle_mesh);

        // arrow

        // var step_1=createCircleFaceArrow2(TubePoints1[1],0.4,Force_face_dir[0]);
        // Tube_group.add(step_1);


    }


    //n arrow


    return mesh_tri;


    //var polyhedron =createMesh(new THREE.PolyhedronGeometry(vertices,faces));


    // var Scale_direction=new THREE.Vector3();

    // Scale_direction.x=1.2*unit_direction.x;
    // Scale_direction.y=1.2*unit_direction.y;
    // Scale_direction.z=1.2*unit_direction.z;


    //var direction1 = new THREE.Vector3().subVectors(coreScale, corepoint);


    //var dis=distance(,);//dis

    //var m=Math.sqrt((dis*dis)/(norm(unit_direction)*norm(unit_direction)));

    //vector minkow


    //return arrowHelper1;


}

var fontloaded;


function createTextMesh(text, position) {


    //var text = "three.js";
    var loader = new THREE.FontLoader();
    var posdir = Pnt_copy(position);

    posdir.normalize();


    loader.load('libs/fonts/optimer_regular.typeface.json', function (font1) {


        // material
        var fontMaterial = new THREE.MeshLambertMaterial({
            color: 0x2F4F4F,
            side: THREE.DoubleSide
        });


        var options = {

            size: 0.15, //size
            height: 0.04, //h
            weight: 'normal', //bold
            font: font1, //type
            style: 'italics', //type
            bevelThickness: 0.01, //th
            bevelSize: 0.01, //wide
            curveSegments: 10,//seg
            bevelEnabled: true, //true

        }

        //var text1 = new THREE.FontLoader().load('libs/fonts/helvetiker_bold.typeface.json', function(text) {
        var gem = new THREE.TextGeometry(text, options);


        // 2d text
        //var shapes = font1.generateShapes(text, 1, 1);
        // var fontGeometry = new THREE.ShapeGeometry(shapes);

        // box
        //fontGeometry.computeBoundingBox();
        var font2 = new THREE.Mesh(gem, fontMaterial);

        // x = 0,pos

        font2.position.x = position.x + 0.5 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
        font2.position.y = position.y + 0.5 * posdir.y;
        font2.position.z = position.z + 0.5 * posdir.z;
        font2.rotation.x = Math.PI / 2;
        font2.rotation.y = Math.PI / 2;

        text_group1.add(font2);


    });


    //return font;


}

function create_supports_Text_P(text, pos) {

    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 190, 170);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y;
    textObj.position.z = pos.z - 0.1;


    return textObj;
}

function create_trial_Text_P_2(text, pos) {

    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 200, 120);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(2), 210, 120);


    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y;
    textObj.position.z = pos.z - 0.1;


    return textObj;
}

function create_trial_Text_P(text, pos) {

    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 200, 120);


    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y;
    textObj.position.z = pos.z - 0.1;


    return textObj;
}

function create_trial_Text_P_2d(text, pos) {

    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 200, 120);


    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y;
    textObj.position.z = pos.z + 0.1;


    return textObj;
}

function create_trial_force_x(text, pos) {

    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "80px Gabriola";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 170, 120);


    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y;
    textObj.position.z = pos.z + 0.1;


    return textObj;
}

function create_trial_force_l(text, pos) {

    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "80px Gabriola";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 170, 120);


    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y;
    textObj.position.z = pos.z - 0.1;


    return textObj;
}

function create_supports_Text_Normal(text, pos) {

    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "Bold 80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 190, 170);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(2), 210, 170);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x + 0.1 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y + 0.1 * posdir.y;
    textObj.position.z = pos.z + 0.1 * posdir.z;


    return textObj;
}

function create_trial_Text_Normal(text, pos) {

    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "Bold 80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 190, 170);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(2), 210, 170);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(3), 230, 170);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x + 0.05 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y + 0.05 * posdir.y;
    textObj.position.z = pos.z + 0.1 * posdir.z;


    return textObj;
}

function create_trial_Text_Normal_2d(text, pos) {

    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "Bold 80px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 190, 170);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(2), 210, 170);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(3), 230, 170);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;


    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y
    textObj.position.z = pos.z + 0.1;


    return textObj;
}

function createSpriteText(text, pos) {
    //can
    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "grey";
    ctx.font = "Bold 100px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "grey";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 210, 170);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //wod
    var material = new THREE.SpriteMaterial({map: texture, depthWrite: false});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x + 0.2 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y + 0.3 * posdir.y;
    textObj.position.z = pos.z + 0.1 * posdir.z;


    return textObj;
}


function createSpriteText3(text, pos) {
    //can
    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "Bold 100px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 190, 170);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //wod
    var material = new THREE.SpriteMaterial({map: texture, transparent: true});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x + 0.18 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y + 0.18 * posdir.y;
    textObj.position.z = pos.z + 0.18 * posdir.z;


    return textObj;
}

function createSpriteText5(text, pos) {
    //can
    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "Bold 100px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 190, 170);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //wod
    var material = new THREE.SpriteMaterial({map: texture, transparent: true});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x + 0.5 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y + 0.5 * posdir.y;
    textObj.position.z = pos.z + 0.5 * posdir.z;


    return textObj;
}

function createSpriteText6(text, pos) {
    //can
    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.font = "Bold 100px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = "black";
    ctx.font = "50px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 190, 170);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //wod
    var material = new THREE.SpriteMaterial({map: texture, transparent: true});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x + 0.2 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y + 0.2 * posdir.y;
    textObj.position.z = pos.z + 0.2 * posdir.z;


    return textObj;
}

function createSpriteText4(text, pos) {
    //can
    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = 0xDCDCDC;
    ctx.font = "80px Arial";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(0), 150, 150);
    ctx.fillStyle = 0xDCDCDC;
    ctx.font = "50px Arial";
    ctx.lineWidth = 2;
    ctx.fillText(text.charAt(1), 190, 150);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //wod
    var material = new THREE.SpriteMaterial({map: texture, transparent: true});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x + 0.1 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y + 0.1 * posdir.y;
    textObj.position.z = pos.z + 0.1 * posdir.z;


    return textObj;
}

function createSpriteText1(text, pos) {
    //can
    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "grey";
    ctx.font = "Bold 100px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text, 150, 150);


    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //wod
    var material = new THREE.SpriteMaterial({map: texture, transparent: true});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x + 0.1 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y + 0.1 * posdir.y;
    textObj.position.z = pos.z + 0.1 * posdir.z;


    return textObj;
}

function createSpriteTextstep1(text, pos) {
    //can
    var canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 240;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "grey";
    ctx.font = "100px Palatino";
    ctx.lineWidth = 2;
    ctx.fillText(text, 150, 150);


    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //wod
    var material = new THREE.SpriteMaterial({map: texture, transparent: true});
    var textObj = new THREE.Sprite(material);
    textObj.scale.set(0.5, 0.5, 0.5);


    //textObj.position.set(pos1);

    var posdir = Pnt_copy(pos);

    posdir.normalize();

    textObj.position.x = pos.x + 0.1 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    textObj.position.y = pos.y + 0.1 * posdir.y;
    textObj.position.z = pos.z + 0.1 * posdir.z;


    return textObj;
}

function createTextMesh1(text, position) {


    //var text = "three.js";
    var loader = new THREE.FontLoader();
    var posdir = Pnt_copy(position);

    posdir.normalize();


    loader.load('libs/fonts/optimer_regular.typeface.json', function (font1) {


        // material
        var fontMaterial = new THREE.MeshLambertMaterial({
            color: 0x2F4F4F,
            side: THREE.DoubleSide
        });


        var options = {

            size: 0.1, //size
            height: 0.03, //h
            weight: 'normal', //bold
            font: font1, //type
            style: 'italics', //type
            bevelThickness: 0.01, //th
            bevelSize: 0.01, //wide
            curveSegments: 10,//seg
            bevelEnabled: true, //true

        }

        //var text1 = new THREE.FontLoader().load('libs/fonts/helvetiker_bold.typeface.json', function(text) {
        var gem = new THREE.TextGeometry(text, options);


        // 2d text
        //var shapes = font1.generateShapes(text, 1, 1);
        // var fontGeometry = new THREE.ShapeGeometry(shapes);

        // box
        //fontGeometry.computeBoundingBox();
        var font2 = new THREE.Mesh(gem, fontMaterial);

        // x = 0,pos

        font2.position.x = position.x + 0.1 * posdir.x; //* (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
        font2.position.y = position.y + 0.1 * posdir.y;
        font2.position.z = position.z + 0.1 * posdir.z;
        font2.rotation.x = Math.PI / 2;
        font2.rotation.y = Math.PI / 2;

        text_group2.add(font2);


    });


    //return font;


}


function createCylinderArrowMesh(pointX, pointY, material, radius, radiusCone, edgeLengthRatio) {

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

    var orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1));

    var edgeGeometry;
    var coneGeometry;
    if (edgeLengthRatio !== undefined) {
        edgeGeometry = new THREE.CylinderGeometry(radius, radius, edgeLengthRatio * l, 8, 1);
        coneGeometry = new THREE.CylinderGeometry(0, radiusCone, (1 - edgeLengthRatio) * l, 8, 1);
        edgeGeometry.translate(0, -(0.5 - 0.5 * edgeLengthRatio) * l, 0);
        var translate = new THREE.Matrix4().makeTranslation(0, (0.5 - 0.5 * (1 - edgeLengthRatio)) * l, 0);
        edgeGeometry.merge(coneGeometry, translate);
    } else {
        // fixed length cone
        var fixedConeLength = 1;
        edgeGeometry = new THREE.CylinderGeometry(radius, radius, l - fixedConeLength, 8, 1);
        coneGeometry = new THREE.CylinderGeometry(0, radiusCone, fixedConeLength, 8, 1);
        edgeGeometry.translate(0, -0.5 * fixedConeLength, 0);
        var translate = new THREE.Matrix4().makeTranslation(0, 0.5 * (l - fixedConeLength), 0);
        edgeGeometry.merge(coneGeometry, translate);
    }


    var arrow = new THREE.Mesh(edgeGeometry, material);

    arrow.applyMatrix4(orientation);

    arrow.position.x = (pointY.x + pointX.x) / 2;
    arrow.position.y = (pointY.y + pointX.y) / 2;
    arrow.position.z = (pointY.z + pointX.z) / 2;


    return arrow;
}

window.addEventListener('keydown', function (event) {

    switch (event.keyCode) {

        case 87: // W
            trfm_ctrl.detach();
            //scene.remove(trfm_ctrl);
            break;


    }

});


var leftMouseDown, rightMouseDown;
var selectObj = null;
var lastPosition;
var lastIntersection, nowIntersection;
var mouseX, mouseY;
var control;

// var mouse = new THREE.Vector2();

function onMouseDown(event) {
    //event.preventDefault();

    rayCaster.setFromCamera(mouse, camera);


    //var rayCaster = getRay(event);
    var intersects = rayCaster.intersectObjects(Ctrl_pts);

    if (event.button === 2) {

        trfm_ctrl.detach();


    }


    //document.addEventListener('mousemove', onMouseMove);


    if (event.button === 0 && intersects[0]) {


        selectObj = intersects[0].object;
        //leftMouseDown = true;
        lastPosition = selectObj.position;
        //lastIntersection = getIntersection(event);

        if (controls_scale.Pair_Control) {

            for (i = 0; i <= 1; i++) {
                mesh_F1_pair.children[i].material.visible = false;
                mesh_F2_pair.children[i].material.visible = false;
                mesh_F3_pair.children[i].material.visible = false;
                mesh_F4_pair.children[i].material.visible = false;
                mesh_left_pair.children[i].material.visible = false;
            }

            redraw();
            for (i = 0; i <= 1; i++) {
                mesh.children[i].material.visible = true;
            }

            // mesh_left_ForceFace.children.forEach(function (e) {
            //     e.geometry.vertices = vertices;
            //     e.geometry.verticesNeedUpdate = true;

            //     // e.geometry.faces[0].color.set(0xff00ee);
            //     // e.geometry.facesNeedUpdate=true;
            //     e.geometry.elementsNeedUpdate = true;
            //     e.geometry.computeFaceNormals();
            //     //e.geometry.center();
            // });

            Tube_group_pair.traverse(function (obj) {//hide
                if (obj.type === "Mesh") {
                    obj.material.visible = false;
                }
            });

            for (i = 0; i <= 1; i++) {
                mesh_left.children[i].material.visible = false;
            }
            mesh_F1.children[0].material.visible = false;
            mesh_F2.children[0].material.visible = false;
            mesh_F3.children[0].material.visible = false;
            mesh_F4.children[0].material.visible = false;
        }


        trfm_ctrl.attach(selectObj);
        // leftMouseDown = true;
    }

    // mouseX = event.clientX;
    // mouseY = event.clientY;

    //document.addEventListener('mousemove', onMouseMove);
}


function onMouseUp() {
    leftMouseDown = false;
    rightMouseDown = false;
    //document.removeEventListener('mousemove', onMouseMove);
}

function onMouseMove(event) {


    event.preventDefault();
    mouse.x = ((event.clientX * 2) / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //mouse.x = ((event.clientX*2)/window.innerWidth) * 2 - 1;
    // mouse.y = -(event.clientY/window.innerHeight) * 2 + 1;

    //event.clientX=event.clientX/2;


    if (rightMouseDown) {

    }

    if (leftMouseDown) {

        for (i = 0; i <= 1; i++) {

            mesh_left.children[i].material.visible = false;
        }
        mesh_F1.children[0].material.visible = false;
        mesh_F2.children[0].material.visible = false;
        mesh_F3.children[0].material.visible = false;
        mesh_F4.children[0].material.visible = false;


        for (i = 0; i < 2; i++) {
            mesh_left_Cell1.children[i].material.visible = false;
            mesh_left_Cell2.children[i].material.visible = false;
            mesh_left_Cell3.children[i].material.visible = false;
            mesh_left_Cell4.children[i].material.visible = false;

        }


        // var deltaX = event.clientX - mouseX;
        // mouseX = event.clientX;
        // var deltaY = event.clientY - mouseY;
        // mouseY = event.clientY;
        // rotation(deltaX, deltaY);
    }
}


//var


function redraw_right() {

    scene2.remove(Tube_group_right);
    //scene.remove(Face_group_left);
    Tube_group_right = new THREE.Group();
    //Face_group_left=new THREE.Group();


    var materialA = new THREE.MeshPhongMaterial({color: 0xdcdcdc, transparent: false});

    var spGeomA = new THREE.SphereGeometry(0.02);
    var sp_TubeA = new THREE.Mesh(spGeomA, materialA);

    sp_TubeA.name = "fpA0";
    sp_TubeA.position.copy(P_A_Right);
    //sp_Tube0.castShadow=true;

    //Ctrl_tubes.push(sp_TubeA);


    Tube_group_right.add(sp_TubeA);

    var materialB = new THREE.MeshPhongMaterial({color: 0xdcdcdc, transparent: false});

    var spGeomB = new THREE.SphereGeometry(0.02);
    var sp_TubeB = new THREE.Mesh(spGeomB, materialB);

    sp_TubeB.name = "fpB1";
    sp_TubeB.position.copy(P_B_Right);
    //sp_Tube0.castShadow=true;

    //Ctrl_tubes.push(sp_TubeB);


    Tube_group_right.add(sp_TubeB);

    var materialC = new THREE.MeshPhongMaterial({color: 0xdcdcdc, transparent: false});

    var spGeomC = new THREE.SphereGeometry(0.02);
    var sp_TubeC = new THREE.Mesh(spGeomC, materialC);

    sp_TubeC.name = "fpC2";
    sp_TubeC.position.copy(P_C_Right);
    //sp_Tube0.castShadow=true;

    ///Ctrl_tubes.push(sp_TubeC);


    Tube_group_right.add(sp_TubeC);

    var materialD = new THREE.MeshPhongMaterial({color: 0xdcdcdc, transparent: false});

    var spGeomD = new THREE.SphereGeometry(0.02);
    var sp_TubeD = new THREE.Mesh(spGeomD, materialD);

    sp_TubeD.name = "fpD3";
    sp_TubeD.position.copy(P_D_Right);


    //sp_Tube0.castShadow=true;

    //Ctrl_tubes.push(sp_TubeD);


    Tube_group_right.add(sp_TubeD);


    var materialAB = new THREE.MeshPhongMaterial({color: 0xc0c0c0, transparent: false});
    var tubeMeshAB = createCylinderMesh(P_A_Right, P_B_Right, materialAB, 0.01, 0.01);

    tubeMeshAB.name = "ftAB0";
    Ctrl_tubes.push(tubeMeshAB);

    Tube_group_right.add(tubeMeshAB);

    var materialBC = new THREE.MeshPhongMaterial({color: 0xc0c0c0, transparent: false});
    var tubeMeshBC = createCylinderMesh(P_B_Right, P_C_Right, materialBC, 0.01, 0.01);

    tubeMeshBC.name = "ftBC1";
    Ctrl_tubes.push(tubeMeshBC);

    Tube_group_right.add(tubeMeshBC);

    var materialAC = new THREE.MeshPhongMaterial({color: 0xc0c0c0, transparent: false});
    var tubeMeshAC = createCylinderMesh(P_A_Right, P_C_Right, materialAC, 0.01, 0.01);

    tubeMeshAC.name = "ftAC2";
    Ctrl_tubes.push(tubeMeshAC);

    Tube_group_right.add(tubeMeshAC);

    var materialAD = new THREE.MeshPhongMaterial({color: 0xc0c0c0, transparent: false});
    var tubeMeshAD = createCylinderMesh(P_A_Right, P_D_Right, materialAD, 0.01, 0.01);

    tubeMeshAD.name = "ftAD3";
    Ctrl_tubes.push(tubeMeshAD);

    Tube_group_right.add(tubeMeshAD);


    var materialBD = new THREE.MeshPhongMaterial({color: 0xc0c0c0, transparent: false});
    var tubeMeshBD = createCylinderMesh(P_B_Right, P_D_Right, materialBD, 0.01, 0.01);

    tubeMeshBD.name = "ftBD4";
    Ctrl_tubes.push(tubeMeshBD);

    Tube_group_right.add(tubeMeshBD);

    var materialCD = new THREE.MeshPhongMaterial({color: 0xc0c0c0, transparent: false});
    var tubeMeshCD = createCylinderMesh(P_C_Right, P_D_Right, materialCD, 0.01, 0.01);

    tubeMeshCD.name = "ftCD5";
    Ctrl_tubes.push(tubeMeshCD);

    Tube_group_right.add(tubeMeshCD);


    scene2.add(Tube_group_right);

}


function redraw_Faces6() {


    var vertices = [
        new THREE.Vector3(0, 0, 0), TubePoints1[1], TubePoints2[1], TubePoints3[1], TubePoints4[1]
    ];

    // for (i = 0;i<geom.faces.length;i++){
    //         var hex = Math.random() * 0xffffff;
    //         geom.faces[i].color.setHex(hex);
    //     }

    mesh_left_ForceFace.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;

        // e.geometry.faces[0].color.set(0xff00ee);
        // e.geometry.facesNeedUpdate=true;
        e.geometry.elementsNeedUpdate = true;
        e.geometry.computeFaceNormals();
        //e.geometry.center();
    });
}


function redraw_Cell() {

    var vertices = [
        new THREE.Vector3(0, 0, 0), TubePoints1[1], TubePoints2[1], TubePoints3[1], TubePoints4[1]
    ];

    mesh_left_Cell1.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;

        // e.geometry.faces[0].color.set(0xff00ee);
        // e.geometry.facesNeedUpdate=true;
        e.geometry.elementsNeedUpdate = true;
        e.geometry.computeFaceNormals();
        //e.geometry.center();
    });

    mesh_left_Cell2.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;

        // e.geometry.faces[0].color.set(0xff00ee);
        // e.geometry.facesNeedUpdate=true;
        e.geometry.elementsNeedUpdate = true;
        e.geometry.computeFaceNormals();
        //e.geometry.center();
    });

    mesh_left_Cell3.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;

        // e.geometry.faces[0].color.set(0xff00ee);
        // e.geometry.facesNeedUpdate=true;
        e.geometry.elementsNeedUpdate = true;
        e.geometry.computeFaceNormals();
        //e.geometry.center();
    });

    mesh_left_Cell4.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;

        // e.geometry.faces[0].color.set(0xff00ee);
        // e.geometry.facesNeedUpdate=true;
        e.geometry.elementsNeedUpdate = true;
        e.geometry.computeFaceNormals();
        //e.geometry.center();
    });
}

//form


var mesh_TriFace1;
var mesh_TriFace2;
var mesh_TriFace3;
var mesh_TriFace4;

var text_group1;
var text_closingplane_group
var text_closingplane_trial_group
var text_closingplane_2dtrial_group
var text_force_trial_group
var text_force_2dtrial_group
var text_group2;
var Tube_group_pair;


function redraw() {


    scene.remove(Tube_group);
    // scene2.remove(Tube_group_pair);
    Ctrl_pts = [];
    Ctrl_tubes = [];
    scene.remove(step_group_1);
    scene.remove(step_group_2);
    // scene2.remove(face_arrow1);
    // scene2.remove(face_arrow2);
    // scene2.remove(face_arrow3);
    // scene2.remove(face_arrow4);

    scene.remove(form_group);
    scene.remove(form_trial);
    scene.remove(form_closingplane);
    scene.remove(form_greenfaces);
    scene.remove(trial_form_2d);

    scene2.remove(step_group_1_1);
    scene2.remove(mesh_TriFace1);
    scene2.remove(mesh_TriFace2);
    scene2.remove(mesh_TriFace3);
    scene2.remove(mesh_TriFace4);

    scene2.remove(trial_force);
    scene2.remove(trial_force_2d);
    scene2.remove(force_group);
    scene2.remove(force_cell);

    scene.remove(text_group1);
    scene.remove(text_closingplane_group);
    scene.remove(text_closingplane_trial_group);
    scene.remove(text_closingplane_2dtrial_group);
    scene2.remove(text_group2);
    scene2.remove(text_force_trial_group);
    scene2.remove(text_force_2dtrial_group);

    // scene.remove(textf1);
    // scene.remove(textf2);


    //dir
    var arr_direction = arrow_direction(TubePoints1[1], TubePoints2[1], TubePoints3[1], TubePoints4[1]);

    //formcenter

    Tube_group = new THREE.Group();
    step_group_1 = new THREE.Group();
    step_group_2 = new THREE.Group();
    step_group_1_1 = new THREE.Group();
    trial_force = new THREE.Group();
    trial_force_2d = new THREE.Group();
    trial_form_2d = new THREE.Group();
    form_group = new THREE.Group();
    force_group = new THREE.Group();
    force_cell = new THREE.Group();
    form_trial = new THREE.Group();
    form_closingplane = new THREE.Group();
    form_greenfaces = new THREE.Group();

    // Tube_group_pair=new THREE.Group();

    text_group1 = new THREE.Group();
    text_closingplane_group = new THREE.Group();
    text_closingplane_trial_group = new THREE.Group();
    text_closingplane_2dtrial_group = new THREE.Group();
    text_force_trial_group = new THREE.Group();
    text_force_2dtrial_group = new THREE.Group();
    text_group2 = new THREE.Group();

    var material = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

    var spGeom0 = new THREE.SphereGeometry(0.05);
    var sp_Tube0 = new THREE.Mesh(spGeom0, material);
    var sp_Tube5 = new THREE.Mesh(spGeom0, material);


    sp_Tube0.name = "sp0";
    sp_Tube0.position.copy(new THREE.Vector3(-0.5, -0.5, 0));
    sp_Tube0.castShadow = true;

    sp_Tube5.position.copy(new THREE.Vector3(0.5, 1, 0));
    sp_Tube5.castShadow = true;
    sp_Tube5.name = "sp5";

    Ctrl_tubes.push(sp_Tube0);
    Ctrl_pts.push(sp_Tube5);

    var outlineMaterial1 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMesh1 = new THREE.Mesh(spGeom0, outlineMaterial1);

    var outlineMesh2 = new THREE.Mesh(spGeom0, outlineMaterial1);
    outlineMesh1.position.copy(new THREE.Vector3(-0.5, -0.5, 0));
    outlineMesh1.scale.multiplyScalar(1.55);
    Tube_group.add(outlineMesh1);

    outlineMesh2.position.copy(new THREE.Vector3(0.5, 1, 0));
    outlineMesh2.scale.multiplyScalar(1.55);
    Tube_group.add(outlineMesh2);


    // ****************** New Construct *************************************************************************************************************************************************


    function create_force_apply_plane(vertice1, vertice2, vertice3) {

        var vertices = [
            vertice1, vertice2, vertice3
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),
        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        var material_AL = [
            //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
            new THREE.MeshBasicMaterial({color: "black", wireframe: true, transparent: true, opacity: 0.4}),
            new THREE.MeshPhongMaterial({
                color: 0x009600, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false
            })
        ];

        return THREE.SceneUtils.createMultiMaterialObject(geom, material_AL)

    }


    //Trial force faces

    function create_force_trial_plane(vertice1, vertice2) {

        var vertices = [
            vertice1, vertice2, TrialP_O
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),
        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        var material_trial = [
            //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
            new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
            new THREE.MeshPhongMaterial({
                color: "grey", transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false
            })
        ];

        return THREE.SceneUtils.createMultiMaterialObject(geom, material_trial)

    }

    function create_form_greenface_dashlines(point1, point1b) {

        var points = [];
        points.push(point1);
        points.push(point1b);

        var geo = new THREE.Geometry().setFromPoints(points);

        var line_dash = new THREE.LineDashedMaterial({
            color: 0x009600,//color
            dashSize: 0.05,
            gapSize: 0.03,
            linewidth: 1

        });

        var dashline = new THREE.LineSegments(geo, line_dash);
        dashline.computeLineDistances();//compute
        return dashline
    }


    function create_form_applyload(point) {

        var arrow_apply = new THREE.MeshPhongMaterial({color: 0x009600});

        var arrow_apply_outline = new THREE.MeshBasicMaterial({
            color: "white",
            transparent: false,
            side: THREE.BackSide
        });

        var apply_arrow1 = createCylinderArrowMesh(point, new THREE.Vector3(point.x, point.y, point.z - 0.3), arrow_apply, 0.015, 0.035, 0.6);
        var apply_arrow12 = createCylinderArrowMesh(new THREE.Vector3(point.x, point.y, point.z - 0.03), new THREE.Vector3(point.x, point.y, point.z - 0.3), arrow_apply_outline, 0.020, 0.035, 0.55);
        apply_arrow12.scale.multiplyScalar(1.2);
        form_group.add(apply_arrow1)
        form_group.add(apply_arrow12)


    }


    function create_form_intec(point1, point2, point3, point4) {

        var dir1 = new THREE.Vector3(); // create once an reuse it

        dir1.subVectors(point1, point2).normalize();

        var dir2 = new THREE.Vector3(); // create once an reuse it

        dir2.subVectors(point3, point4).normalize();

        return LinesSectPt(dir1, point1, dir2, point3)
    }

    function create_force_plane(vertice1, vertice2) {

        var vertices = [
            vertice1, vertice2, ForceO1
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),
        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        var material_trial = [
            //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
            new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
            new THREE.MeshPhongMaterial({
                color: 0x009600, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false
            })
        ];

        return THREE.SceneUtils.createMultiMaterialObject(geom, material_trial)

    }


    function create_force_face_area(point1, point2, pointO) {
        return new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(point1, pointO),
            new THREE.Vector3().subVectors(point2, pointO),
        ).length() / 2
    }


    function create_form_tubes(face_area, face_area_max, scale, startPoint, targetPoint, PointO) {
        var form_mesh = face_area / face_area_max
        tt = scale * face_area

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.06);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.06);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


        if (PointO.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                    color: 0x5B84AE
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_1, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                    color: 0x376D9B
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_2, tt, tt);
                // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                    color: 0x05416D
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_3, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                    color: 0x0F3150
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_4, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesh);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesh.castShadow = true;

        } else if (PointO.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


    }

    function create_form_tubes_t_1(face_area, face_area_max, scale, startPoint, targetPoint, PointO) {
        var form_mesh = face_area / face_area_max
        tt = scale * face_area

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.06);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.06);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


        if (PointO.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                    color: 0x5B84AE
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_1, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                    color: 0x376D9B
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_2, tt, tt);
                // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                    color: 0x05416D
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_3, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                    color: 0x0F3150
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_4, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesh);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesh.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z & cp4.z <= 0 && dis1a >= dis1b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


        if (PointO.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


    }

    function create_form_tubes_t_2(face_area, face_area_max, scale, startPoint, targetPoint, PointO) {
        var form_mesh = face_area / face_area_max
        tt = scale * face_area

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.06);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.06);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


        if (PointO.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                    color: 0x5B84AE
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_1, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                    color: 0x376D9B
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_2, tt, tt);
                // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                    color: 0x05416D
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_3, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                    color: 0x0F3150
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_4, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesh);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesh.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z & cp4.z <= 0 && dis2a >= dis2b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


        if (PointO.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


    }

    function create_form_tubes_t_3(face_area, face_area_max, scale, startPoint, targetPoint, PointO) {
        var form_mesh = face_area / face_area_max
        tt = scale * face_area

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.06);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.06);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


        if (PointO.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                    color: 0x5B84AE
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_1, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                    color: 0x376D9B
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_2, tt, tt);
                // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                    color: 0x05416D
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_3, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                    color: 0x0F3150
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_4, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesh);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesh.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z & cp4.z <= 0 && dis3a >= dis3b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


        if (PointO.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


    }

    function create_form_tubes_t_4(face_area, face_area_max, scale, startPoint, targetPoint, PointO) {
        var form_mesh = face_area / face_area_max
        tt = scale * face_area

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.06);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.06);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


        if (PointO.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                    color: 0x5B84AE
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_1, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                    color: 0x376D9B
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_2, tt, tt);
                // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                    color: 0x05416D
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_3, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                    color: 0x0F3150
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_4, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesh);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesh.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z & cp4.z <= 0 && dis4a >= dis4b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


        if (PointO.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


    }

    function create_form_tubes_t_5(face_area, face_area_max, scale, startPoint, targetPoint, PointO) {
        var form_mesh = face_area / face_area_max
        tt = scale * face_area

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.06);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.06);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


        if (PointO.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                    color: 0x5B84AE
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_1, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                    color: 0x376D9B
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_2, tt, tt);
                // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                    color: 0x05416D
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_3, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                    color: 0x0F3150
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_4, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesh);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesh.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z & cp4.z <= 0 && dis5a >= dis5b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


        if (PointO.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


    }

    function create_form_tubes_t_6(face_area, face_area_max, scale, startPoint, targetPoint, PointO) {
        var form_mesh = face_area / face_area_max
        tt = scale * face_area

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.06);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.06);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


        if (PointO.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                    color: 0x5B84AE
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_1, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                    color: 0x376D9B
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_2, tt, tt);
                // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                    color: 0x05416D
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_3, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                    color: 0x0F3150
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_4, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesh);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesh.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z & cp4.z <= 0 && dis6a >= dis6b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


        if (PointO.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


    }


    function create_form_tubes_t_7(face_area, face_area_max, scale, startPoint, targetPoint, PointO) {
        var form_mesh = face_area / face_area_max
        tt = scale * face_area

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.06);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.06);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


        if (PointO.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                    color: 0x5B84AE
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_1, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                    color: 0x376D9B
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_2, tt, tt);
                // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                    color: 0x05416D
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_3, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                    color: 0x0F3150
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_4, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesh);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesh.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z & cp4.z <= 0 && dis7a >= dis7b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


        if (PointO.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


    }

    function create_form_tubes_t_8(face_area, face_area_max, scale, startPoint, targetPoint, PointO) {
        var form_mesh = face_area / face_area_max
        tt = scale * face_area

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.06);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.06);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);


        if (PointO.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                    color: 0x5B84AE
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_1, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                    color: 0x376D9B
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_2, tt, tt);
                // var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2 ,FormCP3,Colorbar_blue_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                    color: 0x05416D
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_3, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                    color: 0x0F3150
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_blue_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesh = createCylinderMesh(Close_Point2, Close_Point, Colorbar_blue_4, tt, tt);
                //var tube_arrow_3o2=createCylinderArrowMesh(newArrowP3O2,FormCP3,Colorbar_blue_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesh);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesh.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }

        if (PointO.z <= ForceP_B.z & cp4.z <= 0 && dis8a >= dis8b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


        if (PointO.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                    color: 0xD72F62
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_1);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_1, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_1,0.02,0.05,0.6);
            }
            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                    color: 0xCC0549
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_2);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_2, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_2,0.02,0.05,0.6);
            }
            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                    color: 0x940041
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_3);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_3, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_3,0.02,0.05,0.6);
            }

            if (form_mesh >= 0.75) {
                var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                    color: 0x80002F
                });
                var spGeom_Point = new THREE.SphereGeometry(tt - 0.001);
                var sp_Point = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                var sp_Point2 = new THREE.Mesh(spGeom_Point, Colorbar_red_4);
                sp_Point.position.copy(Close_Point);
                sp_Point2.position.copy(Close_Point2);
                var tubeMesht = createCylinderMesh(Close_Point2, Close_Point, Colorbar_red_4, tt, tt);
                //var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),Colorbar_red_4,0.02,0.05,0.6);
            }
            form_group.add(sp_Point);
            form_group.add(sp_Point2);
            form_group.add(tubeMesht);
            // form_group.add(tube_arrow_3o2);
            sp_Point.castShadow = true;
            sp_Point2.castShadow = true;
            tubeMesht.castShadow = true;

        }


    }

    //add form nodes

    function create_form_node(point, size) {

        var materialpointo = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

        var spformPoints = new THREE.SphereGeometry(size);
        var new_formNodes = new THREE.Mesh(spformPoints, materialpointo);

        new_formNodes.position.copy(point);
        new_formNodes.castShadow = true;

        //Ctrl_tubes.push(sp_Tube0);

        var outlineMaterial1 = new THREE.MeshBasicMaterial({
            color: "black",
            transparent: false,
            side: THREE.BackSide
        });
        var outlineMeshnew1 = new THREE.Mesh(spformPoints, outlineMaterial1);
        outlineMeshnew1.position.copy(point);
        outlineMeshnew1.scale.multiplyScalar(1.55);

        form_group.add(new_formNodes);
        form_group.add(outlineMeshnew1);
    }

    //   var Form_P1_Node = create_form_node(Form_P1,0.03);
    //   var Form_P2_Node = create_form_node(Form_P2,0.03);
    //   var Form_P3_Node = create_form_node(Form_P3,0.03);
    //   var Form_P4_Node = create_form_node(Form_P4,0.03);
    //   var Form_P5_Node = create_form_node(Form_P5,0.03);
    //   var Form_P6_Node = create_form_node(Form_P6,0.03);
    //   var Form_P7_Node = create_form_node(Form_P7,0.03);
    //   var Form_P8_Node = create_form_node(Form_P8,0.03);

    //   var Form_P10_Node = create_form_node(Form_P10,0.03);
    //   var Form_P11_Node = create_form_node(Form_P11,0.03);
    //   var Form_P12_Node = create_form_node(Form_P12,0.03);
    //   var Form_P13_Node = create_form_node(Form_P13,0.03);
    //   var Form_P14_Node = create_form_node(Form_P14,0.03);


    //********************      bridge construction        ****************************************************************************************************************************************************************


    //step1: locate force point B,C,D,E

    //          var ForceP_A = new THREE.Vector3(-2,1,0);
    var ForceP_B = new THREE.Vector3(1, 1, 0);
    var ForceP_C = new THREE.Vector3(0, -1.2, 0);
    var ForceP_Cb = new THREE.Vector3(0, -1.2, -1.5);
    var ForceP_Bb = new THREE.Vector3(1, 1, -1.5);

    var ForceP_BC_mid = new THREE.Vector3((ForceP_B.x + ForceP_C.x) / 2, (ForceP_B.y + ForceP_C.y) / 2, (ForceP_B.z + ForceP_C.z) / 2);
    var ForceP_BC_midb = new THREE.Vector3(ForceP_BC_mid.x, ForceP_BC_mid.y, -1.5);


    var Vec_tri_BCCb = Cal_Vec_2(ForceP_B, ForceP_Cb, ForceP_C, 1.2);

    var ForceP_M = new THREE.Vector3(ForceP_BC_mid.x - foffset.l * Vec_tri_BCCb.x, ForceP_BC_mid.y - foffset.l * Vec_tri_BCCb.y, ForceP_BC_mid.z - foffset.l * Vec_tri_BCCb.z);
    var ForceP_Mb = new THREE.Vector3(ForceP_M.x, ForceP_M.y, -1.5)
    var ForceP_N = new THREE.Vector3(ForceP_BC_mid.x + foffset.l * Vec_tri_BCCb.x, ForceP_BC_mid.y + foffset.l * Vec_tri_BCCb.y, ForceP_BC_mid.z + foffset.l * Vec_tri_BCCb.z);
    var ForceP_Nb = new THREE.Vector3(ForceP_N.x, ForceP_N.y, -1.5)

    //new force Point ForceP_B, ForceP_C, ForceP_M, ForceP_N

    var ForceP_BC_2 = new THREE.Vector3((ForceP_B.x + ForceP_BC_mid.x) / 2, (ForceP_B.y + ForceP_BC_mid.y) / 2, (ForceP_B.z + ForceP_BC_mid.z) / 2);
    var ForceP_BC_2b = new THREE.Vector3(ForceP_BC_2.x, ForceP_BC_2.y, -1.5);
    var ForceP_BC_1 = new THREE.Vector3((ForceP_B.x + ForceP_BC_2.x) / 2, (ForceP_B.y + ForceP_BC_2.y) / 2, (ForceP_B.z + ForceP_BC_2.z) / 2);
    var ForceP_BC_1b = new THREE.Vector3(ForceP_BC_1.x, ForceP_BC_1.y, -1.5);
    var ForceP_BC_3 = new THREE.Vector3((ForceP_BC_mid.x + ForceP_BC_2.x) / 2, (ForceP_BC_mid.y + ForceP_BC_2.y) / 2, (ForceP_BC_mid.z + ForceP_BC_2.z) / 2);
    var ForceP_BC_3b = new THREE.Vector3(ForceP_BC_3.x, ForceP_BC_3.y, -1.5);

    var ForceP_CB_2 = new THREE.Vector3((ForceP_C.x + ForceP_BC_mid.x) / 2, (ForceP_C.y + ForceP_BC_mid.y) / 2, (ForceP_C.z + ForceP_BC_mid.z) / 2);
    var ForceP_CB_2b = new THREE.Vector3(ForceP_CB_2.x, ForceP_CB_2.y, -1.5);
    var ForceP_CB_1 = new THREE.Vector3((ForceP_C.x + ForceP_CB_2.x) / 2, (ForceP_C.y + ForceP_CB_2.y) / 2, (ForceP_C.z + ForceP_CB_2.z) / 2);
    var ForceP_CB_1b = new THREE.Vector3(ForceP_CB_1.x, ForceP_CB_1.y, -1.5);
    var ForceP_CB_3 = new THREE.Vector3((ForceP_BC_mid.x + ForceP_CB_2.x) / 2, (ForceP_BC_mid.y + ForceP_CB_2.y) / 2, (ForceP_BC_mid.z + ForceP_CB_2.z) / 2);
    var ForceP_CB_3b = new THREE.Vector3(ForceP_CB_3.x, ForceP_CB_3.y, -1.5);

    //create apply plane

    var Force_apply_MBB1 = create_force_apply_plane(ForceP_M, ForceP_BC_1, ForceP_B);
    var Force_apply_MBB2 = create_force_apply_plane(ForceP_M, ForceP_BC_2, ForceP_BC_1);
    var Force_apply_MBB3 = create_force_apply_plane(ForceP_M, ForceP_BC_3, ForceP_BC_2);
    var Force_apply_MBBm = create_force_apply_plane(ForceP_M, ForceP_BC_mid, ForceP_BC_3);

    var Force_apply_MCC1 = create_force_apply_plane(ForceP_M, ForceP_CB_1, ForceP_C);
    var Force_apply_MCC2 = create_force_apply_plane(ForceP_M, ForceP_CB_2, ForceP_CB_1);
    var Force_apply_MCC3 = create_force_apply_plane(ForceP_M, ForceP_CB_3, ForceP_CB_2);
    var Force_apply_MCCm = create_force_apply_plane(ForceP_M, ForceP_BC_mid, ForceP_CB_3);


    var Force_apply_NBB1 = create_force_apply_plane(ForceP_N, ForceP_BC_1, ForceP_B);
    var Force_apply_NBB2 = create_force_apply_plane(ForceP_N, ForceP_BC_2, ForceP_BC_1);
    var Force_apply_NBB3 = create_force_apply_plane(ForceP_N, ForceP_BC_3, ForceP_BC_2);
    var Force_apply_NBBm = create_force_apply_plane(ForceP_N, ForceP_BC_mid, ForceP_BC_3);

    var Force_apply_NCC1 = create_force_apply_plane(ForceP_N, ForceP_CB_1, ForceP_C);
    var Force_apply_NCC2 = create_force_apply_plane(ForceP_N, ForceP_CB_2, ForceP_CB_1);
    var Force_apply_NCC3 = create_force_apply_plane(ForceP_N, ForceP_CB_3, ForceP_CB_2);
    var Force_apply_NCCm = create_force_apply_plane(ForceP_N, ForceP_BC_mid, ForceP_CB_3);

    force_group.add(Force_apply_MBB1);
    force_group.add(Force_apply_MBB2);
    force_group.add(Force_apply_MBB3);
    force_group.add(Force_apply_MBBm);

    Force_apply_MBB1.children[0].castShadow = true;
    Force_apply_MBB2.children[0].castShadow = true;
    Force_apply_MBB3.children[0].castShadow = true;
    Force_apply_MBBm.children[0].castShadow = true;

    force_group.add(Force_apply_MCC1);
    force_group.add(Force_apply_MCC2);
    force_group.add(Force_apply_MCC3);
    force_group.add(Force_apply_MCCm);

    Force_apply_MCC1.children[0].castShadow = true;
    Force_apply_MCC2.children[0].castShadow = true;
    Force_apply_MCC3.children[0].castShadow = true;
    Force_apply_MCCm.children[0].castShadow = true;

    force_group.add(Force_apply_NBB1);
    force_group.add(Force_apply_NBB2);
    force_group.add(Force_apply_NBB3);
    force_group.add(Force_apply_NBBm);

    Force_apply_NBB1.children[0].castShadow = true;
    Force_apply_NBB2.children[0].castShadow = true;
    Force_apply_NBB3.children[0].castShadow = true;
    Force_apply_NBBm.children[0].castShadow = true;

    force_group.add(Force_apply_NCC1);
    force_group.add(Force_apply_NCC2);
    force_group.add(Force_apply_NCC3);
    force_group.add(Force_apply_NCCm);

    Force_apply_NCC1.children[0].castShadow = true;
    Force_apply_NCC2.children[0].castShadow = true;
    Force_apply_NCC3.children[0].castShadow = true;
    Force_apply_NCCm.children[0].castShadow = true;


    // construct 2D form

    //find temp points 1 2 3 4

    //temp
    var FormP_O = new THREE.Vector3(-1, -0.5, 1);

    var FormP_4a_temp = new THREE.Vector3(FormP_O.x, FormP_O.y, cp3.z);
    var FormP_4a_temp_b = new THREE.Vector3(FormP_4a_temp.x, FormP_4a_temp.y, -1);


    var Vec_BC = new THREE.Vector3(ForceP_C.x - ForceP_B.x, ForceP_C.y - ForceP_B.y, ForceP_C.z - ForceP_B.z)
    var Vec_tri_CBCb = Cal_Vec_2(ForceP_C, ForceP_Cb, ForceP_B, 1.2);

    var FormP_1a_temp = new THREE.Vector3(FormP_4a_temp.x - Dlen1.l * Vec_BC.x, FormP_4a_temp.y - Dlen1.l * Vec_BC.y, FormP_4a_temp.z - Dlen1.l * Vec_BC.z);
    var FormP_3a_temp = new THREE.Vector3(FormP_4a_temp.x - cp4.z * Vec_tri_CBCb.x, FormP_4a_temp.y - cp4.z * Vec_tri_CBCb.y, FormP_4a_temp.z - cp4.z * Vec_tri_CBCb.z);
    var FormP_3a_b = new THREE.Vector3(FormP_3a_temp.x, FormP_3a_temp.y, -1.5)

    //create form
    //find divided points

    var ForceP_CCB1 = new THREE.Vector3((ForceP_C.x + ForceP_CB_1.x) / 2, (ForceP_C.y + ForceP_CB_1.y) / 2, (ForceP_C.z + ForceP_CB_1.z) / 2);
    var ForceP_CB1CB2 = new THREE.Vector3((ForceP_CB_2.x + ForceP_CCB1.x) / 2, (ForceP_CB_2.y + ForceP_CCB1.y) / 2, (ForceP_CB_2.z + ForceP_CCB1.z) / 2);

    var Vec_force_mid_len = new THREE.Vector3(ForceP_CCB1.x - ForceP_CB1CB2.x, ForceP_CCB1.y - ForceP_CB1CB2.y, ForceP_CCB1.z - ForceP_CB1CB2.z)

    var FormP_4a1a_1 = new THREE.Vector3(FormP_4a_temp.x - Dlen1.l * Vec_force_mid_len.x, FormP_4a_temp.y - Dlen1.l * Vec_force_mid_len.y, FormP_4a_temp.z - Dlen1.l * Vec_force_mid_len.z);
    var FormP_3a2a_1 = new THREE.Vector3(FormP_3a_temp.x - Dlen1.l * Vec_force_mid_len.x, FormP_3a_temp.y - Dlen1.l * Vec_force_mid_len.y, FormP_3a_temp.z - Dlen1.l * Vec_force_mid_len.z);
    var Form_greendash_G1 = create_form_greenface_dashlines(FormP_4a1a_1, FormP_3a2a_1);

    var FormP_4a1a_2 = new THREE.Vector3(FormP_4a1a_1.x - Dlen1.l * Vec_force_mid_len.x, FormP_4a1a_1.y - Dlen1.l * Vec_force_mid_len.y, FormP_4a1a_1.z - Dlen1.l * Vec_force_mid_len.z);
    var FormP_3a2a_2 = new THREE.Vector3(FormP_3a2a_1.x - Dlen1.l * Vec_force_mid_len.x, FormP_3a2a_1.y - Dlen1.l * Vec_force_mid_len.y, FormP_3a2a_1.z - Dlen1.l * Vec_force_mid_len.z);
    var Form_greendash_G2 = create_form_greenface_dashlines(FormP_4a1a_2, FormP_3a2a_2);

    var FormP_4a1a_3 = new THREE.Vector3(FormP_4a1a_2.x - Dlen1.l * Vec_force_mid_len.x, FormP_4a1a_2.y - Dlen1.l * Vec_force_mid_len.y, FormP_4a1a_2.z - Dlen1.l * Vec_force_mid_len.z);
    var FormP_3a2a_3 = new THREE.Vector3(FormP_3a2a_2.x - Dlen1.l * Vec_force_mid_len.x, FormP_3a2a_2.y - Dlen1.l * Vec_force_mid_len.y, FormP_3a2a_2.z - Dlen1.l * Vec_force_mid_len.z);
    var Form_greendash_G3 = create_form_greenface_dashlines(FormP_4a1a_3, FormP_3a2a_3);

    var FormP_4a1a_4 = new THREE.Vector3(FormP_4a1a_3.x - Dlen1.l * Vec_force_mid_len.x, FormP_4a1a_3.y - Dlen1.l * Vec_force_mid_len.y, FormP_4a1a_3.z - Dlen1.l * Vec_force_mid_len.z);
    var FormP_3a2a_4 = new THREE.Vector3(FormP_3a2a_3.x - Dlen1.l * Vec_force_mid_len.x, FormP_3a2a_3.y - Dlen1.l * Vec_force_mid_len.y, FormP_3a2a_3.z - Dlen1.l * Vec_force_mid_len.z);
    var Form_greendash_G4 = create_form_greenface_dashlines(FormP_4a1a_4, FormP_3a2a_4);

    var FormP_4a1a_5 = new THREE.Vector3(FormP_4a1a_4.x - Dlen1.l * Vec_force_mid_len.x, FormP_4a1a_4.y - Dlen1.l * Vec_force_mid_len.y, FormP_4a1a_4.z - Dlen1.l * Vec_force_mid_len.z);
    var FormP_3a2a_5 = new THREE.Vector3(FormP_3a2a_4.x - Dlen1.l * Vec_force_mid_len.x, FormP_3a2a_4.y - Dlen1.l * Vec_force_mid_len.y, FormP_3a2a_4.z - Dlen1.l * Vec_force_mid_len.z);
    var Form_greendash_G5 = create_form_greenface_dashlines(FormP_4a1a_5, FormP_3a2a_5);

    var FormP_4a1a_6 = new THREE.Vector3(FormP_4a1a_5.x - Dlen1.l * Vec_force_mid_len.x, FormP_4a1a_5.y - Dlen1.l * Vec_force_mid_len.y, FormP_4a1a_5.z - Dlen1.l * Vec_force_mid_len.z);
    var FormP_3a2a_6 = new THREE.Vector3(FormP_3a2a_5.x - Dlen1.l * Vec_force_mid_len.x, FormP_3a2a_5.y - Dlen1.l * Vec_force_mid_len.y, FormP_3a2a_5.z - Dlen1.l * Vec_force_mid_len.z);
    var Form_greendash_G6 = create_form_greenface_dashlines(FormP_4a1a_6, FormP_3a2a_6);

    var FormP_4a1a_7 = new THREE.Vector3(FormP_4a1a_6.x - Dlen1.l * Vec_force_mid_len.x, FormP_4a1a_6.y - Dlen1.l * Vec_force_mid_len.y, FormP_4a1a_6.z - Dlen1.l * Vec_force_mid_len.z);
    var FormP_3a2a_7 = new THREE.Vector3(FormP_3a2a_6.x - Dlen1.l * Vec_force_mid_len.x, FormP_3a2a_6.y - Dlen1.l * Vec_force_mid_len.y, FormP_3a2a_6.z - Dlen1.l * Vec_force_mid_len.z);
    var Form_greendash_G7 = create_form_greenface_dashlines(FormP_4a1a_7, FormP_3a2a_7);

    var FormP_4a1a_8 = new THREE.Vector3(FormP_4a1a_7.x - Dlen1.l * Vec_force_mid_len.x, FormP_4a1a_7.y - Dlen1.l * Vec_force_mid_len.y, FormP_4a1a_7.z - Dlen1.l * Vec_force_mid_len.z);
    var FormP_3a2a_8 = new THREE.Vector3(FormP_3a2a_7.x - Dlen1.l * Vec_force_mid_len.x, FormP_3a2a_7.y - Dlen1.l * Vec_force_mid_len.y, FormP_3a2a_7.z - Dlen1.l * Vec_force_mid_len.z);
    var Form_greendash_G8 = create_form_greenface_dashlines(FormP_4a1a_8, FormP_3a2a_8);

    var FormP_1a = new THREE.Vector3(FormP_4a1a_8.x - Dlen1.l * Vec_force_mid_len.x, FormP_4a1a_8.y - Dlen1.l * Vec_force_mid_len.y, FormP_4a1a_8.z - Dlen1.l * Vec_force_mid_len.z);
    var FormP_2a = new THREE.Vector3(FormP_3a2a_8.x - Dlen1.l * Vec_force_mid_len.x, FormP_3a2a_8.y - Dlen1.l * Vec_force_mid_len.y, FormP_3a2a_8.z - Dlen1.l * Vec_force_mid_len.z);

    var trialline_dash = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    });

    var trial_line4a1a = createdashline(FormP_4a_temp, FormP_1a, trialline_dash);
    var trial_line3a2a = createdashline(FormP_3a_temp, FormP_2a, trialline_dash);
    var trial_line3a4a = createdashline(FormP_3a_temp, FormP_4a_temp, trialline_dash);
    var trial_line1a2a = createdashline(FormP_1a, FormP_2a, trialline_dash);


    form_greenfaces.add(Form_greendash_G1)
    form_greenfaces.add(Form_greendash_G2)
    form_greenfaces.add(Form_greendash_G3)
    form_greenfaces.add(Form_greendash_G4)
    form_greenfaces.add(Form_greendash_G5)
    form_greenfaces.add(Form_greendash_G6)
    form_greenfaces.add(Form_greendash_G7)
    form_greenfaces.add(Form_greendash_G8)

    form_greenfaces.add(trial_line4a1a)
    form_greenfaces.add(trial_line3a2a)
    form_greenfaces.add(trial_line3a4a)
    form_greenfaces.add(trial_line1a2a)


    // 2D

    //trial 2d force diagram

    //decomposoiton point o'
    var TrialP_O2d = new THREE.Vector3(fo2d.x, fo2d.y, 0);


    var OB = createline(TrialP_O2d, ForceP_B)
    var OBC1 = createline(TrialP_O2d, ForceP_BC_1)
    var OBC2 = createline(TrialP_O2d, ForceP_BC_2)
    var OBC3 = createline(TrialP_O2d, ForceP_BC_3)
    var OBCm = createline(TrialP_O2d, ForceP_BC_mid)
    var OCB3 = createline(TrialP_O2d, ForceP_CB_3)
    var OCB2 = createline(TrialP_O2d, ForceP_CB_2)
    var OCB1 = createline(TrialP_O2d, ForceP_CB_1)
    var OC = createline(TrialP_O2d, ForceP_C)

    trial_force_2d.add(OB);
    trial_force_2d.add(OBC1);
    trial_force_2d.add(OBC2);
    trial_force_2d.add(OBC3);
    trial_force_2d.add(OBCm);
    trial_force_2d.add(OCB3);
    trial_force_2d.add(OCB2);
    trial_force_2d.add(OCB1);
    trial_force_2d.add(OC);


    //trial 2d form diagram

    var FormP_2d_S = new THREE.Vector3(FormP_4a_temp.x + (FormP_4a_temp.x - FormP_3a_temp.x), FormP_4a_temp.y + (FormP_4a_temp.y - FormP_3a_temp.y), FormP_1a_temp.z);
    var FormP_2d_Sb = new THREE.Vector3(FormP_2d_S.x, FormP_2d_S.y, -1)


    var FormP_2d_1 = create_form_2d_intec(FormP_2d_S, ForceP_C, ForceP_Cb, TrialP_O2d, FormP_4a1a_1, FormP_3a2a_1)
    var FormP_2d_2 = create_form_2d_intec(FormP_2d_1, ForceP_CB_1, ForceP_CB_1b, TrialP_O2d, FormP_4a1a_2, FormP_3a2a_2)
    var FormP_2d_3 = create_form_2d_intec(FormP_2d_2, ForceP_CB_2, ForceP_CB_2b, TrialP_O2d, FormP_4a1a_3, FormP_3a2a_3)
    var FormP_2d_4 = create_form_2d_intec(FormP_2d_3, ForceP_CB_3, ForceP_CB_3b, TrialP_O2d, FormP_4a1a_4, FormP_3a2a_4)
    var FormP_2d_5 = create_form_2d_intec(FormP_2d_4, ForceP_BC_mid, ForceP_BC_midb, TrialP_O2d, FormP_4a1a_5, FormP_3a2a_5)
    var FormP_2d_6 = create_form_2d_intec(FormP_2d_5, ForceP_BC_3, ForceP_BC_3b, TrialP_O2d, FormP_4a1a_6, FormP_3a2a_6)
    var FormP_2d_7 = create_form_2d_intec(FormP_2d_6, ForceP_BC_2, ForceP_BC_2b, TrialP_O2d, FormP_4a1a_7, FormP_3a2a_7)
    var FormP_2d_8 = create_form_2d_intec(FormP_2d_7, ForceP_BC_1, ForceP_BC_1b, TrialP_O2d, FormP_4a1a_8, FormP_3a2a_8)

    var FormP_2d_E = create_form_2d_intec(FormP_2d_8, ForceP_B, ForceP_Bb, TrialP_O2d, FormP_1a, FormP_2a)

    var Form_Line1 = createdashline_2d_trial(FormP_2d_S, FormP_2d_1, trialline_dash)
    var Form_Line2 = createdashline_2d_trial(FormP_2d_1, FormP_2d_2, trialline_dash)
    var Form_Line3 = createdashline_2d_trial(FormP_2d_2, FormP_2d_3, trialline_dash)
    var Form_Line4 = createdashline_2d_trial(FormP_2d_3, FormP_2d_4, trialline_dash)
    var Form_Line5 = createdashline_2d_trial(FormP_2d_4, FormP_2d_5, trialline_dash)
    var Form_Line6 = createdashline_2d_trial(FormP_2d_5, FormP_2d_6, trialline_dash)
    var Form_Line7 = createdashline_2d_trial(FormP_2d_6, FormP_2d_7, trialline_dash)
    var Form_Line8 = createdashline_2d_trial(FormP_2d_7, FormP_2d_8, trialline_dash)
    var Form_Line9 = createdashline_2d_trial(FormP_2d_8, FormP_2d_E, trialline_dash)

    var Form_Line10 = createdashline(FormP_2d_S, FormP_2d_E, trialline_dash)

    var Form_trial_G1 = create_form_greenface_dashlines(FormP_4a1a_1, FormP_2d_1);
    var Form_trial_G2 = create_form_greenface_dashlines(FormP_4a1a_2, FormP_2d_2);
    var Form_trial_G3 = create_form_greenface_dashlines(FormP_4a1a_3, FormP_2d_3);
    var Form_trial_G4 = create_form_greenface_dashlines(FormP_4a1a_4, FormP_2d_4);
    var Form_trial_G5 = create_form_greenface_dashlines(FormP_4a1a_5, FormP_2d_5);
    var Form_trial_G6 = create_form_greenface_dashlines(FormP_4a1a_6, FormP_2d_6);
    var Form_trial_G7 = create_form_greenface_dashlines(FormP_4a1a_7, FormP_2d_7);
    var Form_trial_G8 = create_form_greenface_dashlines(FormP_4a1a_8, FormP_2d_8);

    trial_form_2d.add(Form_Line1);
    trial_form_2d.add(Form_Line2);
    trial_form_2d.add(Form_Line3);
    trial_form_2d.add(Form_Line4);
    trial_form_2d.add(Form_Line5);
    trial_form_2d.add(Form_Line6);
    trial_form_2d.add(Form_Line7);
    trial_form_2d.add(Form_Line8);
    trial_form_2d.add(Form_Line9);
    trial_form_2d.add(Form_Line10);

    trial_form_2d.add(Form_trial_G1);
    trial_form_2d.add(Form_trial_G2);
    trial_form_2d.add(Form_trial_G3);
    trial_form_2d.add(Form_trial_G4);
    trial_form_2d.add(Form_trial_G5);
    trial_form_2d.add(Form_trial_G6);
    trial_form_2d.add(Form_trial_G7);
    trial_form_2d.add(Form_trial_G8);


    //add form arrow

    var mid_SE2 = new THREE.Vector3((FormP_4a1a_1.x + FormP_4a1a_8.x) / 2, (FormP_4a1a_1.y + FormP_4a1a_8.y) / 2, (FormP_4a1a_1.z + FormP_4a1a_8.z) / 2)
    var vec_SE_temp2 = Cal_Vec_2(FormP_4a_temp, FormP_4a_temp_b, FormP_1a, 1.2)
    var trialnormal_SE2 = new THREE.Vector3(mid_SE2.x - 0.2 * vec_SE_temp2.x, mid_SE2.y - 0.2 * vec_SE_temp2.y, mid_SE2.z - 0.2 * vec_SE_temp2.z)

    var trial_normal_material = new THREE.MeshPhongMaterial({color: "red"})
    var trial_normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})

    var trial_normal_12 = createCylinderArrowMesh(mid_SE2, trialnormal_SE2, trial_normal_material, 0.015, 0.035, 0.55);
    var trial_normal_12_outline = createCylinderArrowMesh(mid_SE2, trialnormal_SE2, trial_normal_outlinematerial, 0.018, 0.038, 0.54);

    trial_form_2d.add(trial_normal_12);
    trial_form_2d.add(trial_normal_12_outline);
    trial_normal_12_outline.scale.multiplyScalar(1.05);

    //add trial arrow

    var mid_SE = new THREE.Vector3((FormP_2d_S.x + FormP_2d_E.x) / 2, (FormP_2d_S.y + FormP_2d_E.y) / 2, (FormP_2d_S.z + FormP_2d_E.z) / 2)
    var vec_SE_temp = Cal_Vec_2(FormP_2d_E, FormP_2d_Sb, FormP_2d_S, 1.2)
    var trialnormal_SE = new THREE.Vector3(mid_SE.x - 0.2 * vec_SE_temp.x, mid_SE.y - 0.2 * vec_SE_temp.y, mid_SE.z - 0.2 * vec_SE_temp.z)

    var trial_normal_material = new THREE.MeshPhongMaterial({color: "red"})
    var trial_normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})

    var trial_normal_1 = createCylinderArrowMesh(mid_SE, trialnormal_SE, trial_normal_material, 0.015, 0.035, 0.55);
    var trial_normal_1_outline = createCylinderArrowMesh(mid_SE, trialnormal_SE, trial_normal_outlinematerial, 0.018, 0.038, 0.54);

    trial_form_2d.add(trial_normal_1);
    trial_form_2d.add(trial_normal_1_outline);
    trial_normal_1_outline.scale.multiplyScalar(1.05);


    //find x1

    //    trial_S1,trial_P15,trial_P9

    var ForceX1_temp2d = new THREE.Vector3(TrialP_O2d.x - 1.2 * vec_SE_temp.x, TrialP_O2d.y - 1.2 * vec_SE_temp.y, TrialP_O2d.z - 1.2 * vec_SE_temp.z);

    //define intersection point x1
    var intersect_x1_vec2d = new THREE.Vector3(ForceX1_temp2d.x - TrialP_O2d.x, ForceX1_temp2d.y - TrialP_O2d.y, ForceX1_temp2d.z - TrialP_O2d.z);
    var applyplanevec2d = Cal_Vec_2(ForceP_Bb, ForceP_C, ForceP_B, 0.5);
    var ForceX12d = Cal_Plane_Line_Intersect_Point(TrialP_O2d, intersect_x1_vec2d, ForceP_C, applyplanevec2d);

    var line_ox12d = [];
    line_ox12d.push(TrialP_O2d);
    line_ox12d.push(ForceX12d);

    var line_ox1_geo = new THREE.Geometry().setFromPoints(line_ox12d);

    var applyline_1 = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.2,
        gapSize: 0.03,
        linewidth: 1

    });

    var applylineox12d = new THREE.LineSegments(line_ox1_geo, applyline_1);
    applylineox12d.computeLineDistances();//compute
    trial_force_2d.add(applylineox12d);

    //add x1 arrow

    var TrialP_O2d_sp1 = new THREE.Sphere(new THREE.Vector3(TrialP_O2d.x, TrialP_O2d.y, TrialP_O2d.z), 0.32);
    var x1_2dcloseP1 = TrialP_O2d_sp1.clampPoint(ForceX12d);

    var TrialP_O2d_sp2 = new THREE.Sphere(new THREE.Vector3(TrialP_O2d.x, TrialP_O2d.y, TrialP_O2d.z), 0.54);
    var x1_2dcloseP2 = TrialP_O2d_sp2.clampPoint(ForceX12d);

    var x1_arrow2d = createCylinderArrowMesh(x1_2dcloseP1, x1_2dcloseP2, trial_normal_material, 0.012, 0.025, 0.55);

    trial_force_2d.add(x1_arrow2d);

    var TrialP_O2d_sp3 = new THREE.Sphere(new THREE.Vector3(ForceP_M.x, ForceP_M.y, ForceP_M.z), 0.52);
    var x1_2dcloseP12 = TrialP_O2d_sp3.clampPoint(ForceX12d);

    var TrialP_O2d_sp4 = new THREE.Sphere(new THREE.Vector3(ForceP_M.x, ForceP_M.y, ForceP_M.z), 0.74);
    var x1_2dcloseP22 = TrialP_O2d_sp4.clampPoint(ForceX12d);

    var x1_arrow2d2 = createCylinderArrowMesh(x1_2dcloseP12, x1_2dcloseP22, trial_normal_material, 0.012, 0.025, 0.55);

    trial_force_2d.add(x1_arrow2d2);

    //add x1 sphere
    var materialpointx = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

    var spforcePointx = new THREE.SphereGeometry(0.01);
    var new_forcePointx = new THREE.Mesh(spforcePointx, materialpointx);

    new_forcePointx.position.copy(ForceX12d);


    //Ctrl_tubes.push(sp_Tube0);

    var outlineMaterialx = new THREE.MeshBasicMaterial({color: "red", transparent: false, side: THREE.BackSide});
    var outlineMeshnewx = new THREE.Mesh(spforcePointx, outlineMaterialx);
    outlineMeshnewx.position.copy(ForceX12d);
    outlineMeshnewx.scale.multiplyScalar(1.55);

    trial_force_2d.add(new_forcePointx);
    trial_force_2d.add(outlineMeshnewx);
    trial_force.add(new_forcePointx);
    trial_force.add(outlineMeshnewx);


    //Trial force faces

    //            //starting point FormP_4a_temp

    function create_form_2d_intec(startPoint, Forcepoint1, Forcepoint2, Forcepoint3, intecpoint1, intecpoint2) {

        var Vec = Cal_Vec_2(Forcepoint1, Forcepoint2, Forcepoint3, 1.2);
        var FormP_temp = new THREE.Vector3(startPoint.x - Vec.x, startPoint.y - Vec.y, startPoint.z - Vec.z);
        return create_form_intec(startPoint, FormP_temp, intecpoint1, intecpoint2)
    }

    var FormP_4a1a_1_a = create_form_2d_intec(FormP_4a_temp, ForceP_C, ForceP_Cb, ForceP_N, FormP_4a1a_1, FormP_3a2a_1)
    var FormP_4a1a_1_b = new THREE.Vector3(FormP_4a1a_1_a.x, FormP_4a1a_1_a.y, -1.5);
    var FormP_3a2a_1_a = create_form_2d_intec(FormP_3a_temp, ForceP_C, ForceP_Cb, ForceP_M, FormP_4a1a_1, FormP_3a2a_1)
    var FormP_3a2a_1_b = new THREE.Vector3(FormP_3a2a_1_a.x, FormP_3a2a_1_a.y, -1.5);

    var FormP_4a1a_2_a = create_form_2d_intec(FormP_4a1a_1_a, ForceP_CB_1, ForceP_CB_1b, ForceP_N, FormP_4a1a_2, FormP_3a2a_2)
    var FormP_4a1a_2_b = new THREE.Vector3(FormP_4a1a_2_a.x, FormP_4a1a_2_a.y, -1.5);
    var FormP_3a2a_2_a = create_form_2d_intec(FormP_3a2a_1_a, ForceP_CB_1, ForceP_CB_1b, ForceP_M, FormP_4a1a_2, FormP_3a2a_2)
    var FormP_3a2a_2_b = new THREE.Vector3(FormP_3a2a_2_a.x, FormP_3a2a_2_a.y, -1.5);

    var FormP_4a1a_3_a = create_form_2d_intec(FormP_4a1a_2_a, ForceP_CB_2, ForceP_CB_2b, ForceP_N, FormP_4a1a_3, FormP_3a2a_3)
    var FormP_4a1a_3_b = new THREE.Vector3(FormP_4a1a_3_a.x, FormP_4a1a_3_a.y, -1.5);
    var FormP_3a2a_3_a = create_form_2d_intec(FormP_3a2a_2_a, ForceP_CB_2, ForceP_CB_2b, ForceP_M, FormP_4a1a_3, FormP_3a2a_3)
    var FormP_3a2a_3_b = new THREE.Vector3(FormP_3a2a_3_a.x, FormP_3a2a_3_a.y, -1.5);

    var FormP_4a1a_4_a = create_form_2d_intec(FormP_4a1a_3_a, ForceP_CB_3, ForceP_CB_3b, ForceP_N, FormP_4a1a_4, FormP_3a2a_4)
    var FormP_4a1a_4_b = new THREE.Vector3(FormP_4a1a_4_a.x, FormP_4a1a_4_a.y, -1.5);
    var FormP_3a2a_4_a = create_form_2d_intec(FormP_3a2a_3_a, ForceP_CB_3, ForceP_CB_3b, ForceP_M, FormP_4a1a_4, FormP_3a2a_4)
    var FormP_3a2a_4_b = new THREE.Vector3(FormP_3a2a_4_a.x, FormP_3a2a_4_a.y, -1.5);

    var FormP_4a1a_5_a = create_form_2d_intec(FormP_1a, ForceP_N, ForceP_Nb, ForceP_B, FormP_4a1a_8, FormP_3a2a_8)
    var FormP_4a1a_5_b = new THREE.Vector3(FormP_4a1a_5_a.x, FormP_4a1a_5_a.y, -1.5);
    var FormP_3a2a_5_a = create_form_2d_intec(FormP_2a, ForceP_M, ForceP_Mb, ForceP_B, FormP_4a1a_8, FormP_3a2a_8)
    var FormP_3a2a_5_b = new THREE.Vector3(FormP_3a2a_5_a.x, FormP_3a2a_5_a.y, -1.5);

    var FormP_4a1a_6_a = create_form_2d_intec(FormP_4a1a_5_a, ForceP_BC_1, ForceP_BC_1b, ForceP_N, FormP_4a1a_7, FormP_3a2a_7)
    var FormP_4a1a_6_b = new THREE.Vector3(FormP_4a1a_6_a.x, FormP_4a1a_6_a.y, -1.5);
    var FormP_3a2a_6_a = create_form_2d_intec(FormP_3a2a_5_a, ForceP_BC_1, ForceP_BC_1b, ForceP_M, FormP_4a1a_7, FormP_3a2a_7)
    var FormP_3a2a_6_b = new THREE.Vector3(FormP_3a2a_6_a.x, FormP_3a2a_6_a.y, -1.5);

    var FormP_4a1a_7_a = create_form_2d_intec(FormP_4a1a_6_a, ForceP_BC_2, ForceP_BC_2b, ForceP_N, FormP_4a1a_6, FormP_3a2a_6)
    var FormP_4a1a_7_b = new THREE.Vector3(FormP_4a1a_7_a.x, FormP_4a1a_7_a.y, -1.5);
    var FormP_3a2a_7_a = create_form_2d_intec(FormP_3a2a_6_a, ForceP_BC_2, ForceP_BC_2b, ForceP_M, FormP_4a1a_6, FormP_3a2a_6)
    var FormP_3a2a_7_b = new THREE.Vector3(FormP_3a2a_7_a.x, FormP_3a2a_7_a.y, -1.5);

    var FormP_4a1a_8_a = create_form_2d_intec(FormP_4a1a_7_a, ForceP_BC_3, ForceP_BC_3b, ForceP_N, FormP_4a1a_5, FormP_3a2a_5)
    var FormP_4a1a_8_b = new THREE.Vector3(FormP_4a1a_8_a.x, FormP_4a1a_8_a.y, -1.5);
    var FormP_3a2a_8_a = create_form_2d_intec(FormP_3a2a_7_a, ForceP_BC_3, ForceP_BC_3b, ForceP_M, FormP_4a1a_5, FormP_3a2a_5)
    var FormP_3a2a_8_b = new THREE.Vector3(FormP_3a2a_8_a.x, FormP_3a2a_8_a.y, -1.5);

    var FormP_1a_b = new THREE.Vector3(FormP_1a.x, FormP_1a.y, -1.5);
    var FormP_2a_b = new THREE.Vector3(FormP_2a.x, FormP_2a.y, -1.5);

    create_form_node(FormP_4a1a_1_a, 0.02);
    create_form_node(FormP_4a1a_2_a, 0.02);
    create_form_node(FormP_4a1a_3_a, 0.02);
    create_form_node(FormP_4a1a_4_a, 0.02);
    create_form_node(FormP_4a1a_5_a, 0.02);
    create_form_node(FormP_4a1a_6_a, 0.02);
    create_form_node(FormP_4a1a_7_a, 0.02);
    create_form_node(FormP_4a1a_8_a, 0.02);

    create_form_node(FormP_3a2a_1_a, 0.02);
    create_form_node(FormP_3a2a_2_a, 0.02);
    create_form_node(FormP_3a2a_3_a, 0.02);
    create_form_node(FormP_3a2a_4_a, 0.02);
    create_form_node(FormP_3a2a_5_a, 0.02);
    create_form_node(FormP_3a2a_6_a, 0.02);
    create_form_node(FormP_3a2a_7_a, 0.02);
    create_form_node(FormP_3a2a_8_a, 0.02);

    //  var Form_arrow_G3 = create_form_applyload(FormG_3);

    create_form_applyload(FormP_4a1a_1_a);
    create_form_applyload(FormP_4a1a_2_a);
    create_form_applyload(FormP_4a1a_3_a);
    create_form_applyload(FormP_4a1a_4_a);
    create_form_applyload(FormP_4a1a_5_a);
    create_form_applyload(FormP_4a1a_6_a);
    create_form_applyload(FormP_4a1a_7_a);
    create_form_applyload(FormP_4a1a_8_a);

    create_form_applyload(FormP_3a2a_1_a);
    create_form_applyload(FormP_3a2a_2_a);
    create_form_applyload(FormP_3a2a_3_a);
    create_form_applyload(FormP_3a2a_4_a);
    create_form_applyload(FormP_3a2a_5_a);
    create_form_applyload(FormP_3a2a_6_a);
    create_form_applyload(FormP_3a2a_7_a);
    create_form_applyload(FormP_3a2a_8_a);

    //tension


    var dis1a = FormP_4a1a_1.distanceTo(FormP_4a1a_1_a);
    var dis1b = FormP_3a2a_1.distanceTo(FormP_4a1a_1_a);

    var dis2a = FormP_4a1a_2.distanceTo(FormP_4a1a_2_a);
    var dis2b = FormP_3a2a_2.distanceTo(FormP_4a1a_2_a);

    var dis3a = FormP_4a1a_3.distanceTo(FormP_4a1a_3_a);
    var dis3b = FormP_3a2a_3.distanceTo(FormP_4a1a_3_a);

    var dis4a = FormP_4a1a_4.distanceTo(FormP_4a1a_4_a);
    var dis4b = FormP_3a2a_4.distanceTo(FormP_4a1a_4_a);

    var dis5a = FormP_4a1a_5.distanceTo(FormP_4a1a_5_a);
    var dis5b = FormP_3a2a_5.distanceTo(FormP_4a1a_5_a);

    var dis6a = FormP_4a1a_6.distanceTo(FormP_4a1a_6_a);
    var dis6b = FormP_3a2a_6.distanceTo(FormP_4a1a_6_a);

    var dis7a = FormP_4a1a_7.distanceTo(FormP_4a1a_7_a);
    var dis7b = FormP_3a2a_7.distanceTo(FormP_4a1a_7_a);

    var dis8a = FormP_4a1a_8.distanceTo(FormP_4a1a_8_a);
    var dis8b = FormP_3a2a_8.distanceTo(FormP_4a1a_8_a);


    function create_form_2d_tubes(startPoint, targetPoint, thickness) {

        var Sphere_Point = new THREE.Sphere(new THREE.Vector3(targetPoint.x, targetPoint.y, targetPoint.z), 0.05);
        var Close_Point = Sphere_Point.clampPoint(startPoint);

        var Sphere_Point2 = new THREE.Sphere(new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z), 0.05);
        var Close_Point2 = Sphere_Point2.clampPoint(targetPoint);

        var Form_2d_matreial = new THREE.MeshPhongMaterial({
            color: 0x009600, transparent: true, opacity: 0.8
        })
        var spGeom_Point = new THREE.SphereGeometry(thickness - 0.001);
        var sp_Point = new THREE.Mesh(spGeom_Point, Form_2d_matreial);
        var sp_Point2 = new THREE.Mesh(spGeom_Point, Form_2d_matreial);
        sp_Point.position.copy(Close_Point);
        sp_Point2.position.copy(Close_Point2);
        var form_tube = createCylinderMesh(Close_Point, Close_Point2, Form_2d_matreial, thickness, thickness);

        form_group.add(sp_Point);
        form_group.add(sp_Point2);
        form_group.add(form_tube);
        // form_group.add(tube_arrow_3o2);
        sp_Point.castShadow = true;
        sp_Point2.castShadow = true;
        form_tube.castShadow = true;
    }

    create_form_2d_tubes(FormP_4a1a_1_a, FormP_3a2a_1_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_2_a, FormP_3a2a_2_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_3_a, FormP_3a2a_3_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_4_a, FormP_3a2a_4_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_5_a, FormP_3a2a_5_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_6_a, FormP_3a2a_6_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_7_a, FormP_3a2a_7_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_8_a, FormP_3a2a_8_a, 0.015);

    create_form_2d_tubes(FormP_4a_temp, FormP_4a1a_1_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_1_a, FormP_4a1a_2_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_2_a, FormP_4a1a_3_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_3_a, FormP_4a1a_4_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_4_a, FormP_4a1a_8_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_5_a, FormP_4a1a_6_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_6_a, FormP_4a1a_7_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_7_a, FormP_4a1a_8_a, 0.015);
    create_form_2d_tubes(FormP_4a1a_5_a, FormP_1a, 0.015);

    create_form_2d_tubes(FormP_3a_temp, FormP_3a2a_1_a, 0.015);
    create_form_2d_tubes(FormP_3a2a_1_a, FormP_3a2a_2_a, 0.015);
    create_form_2d_tubes(FormP_3a2a_2_a, FormP_3a2a_3_a, 0.015);
    create_form_2d_tubes(FormP_3a2a_3_a, FormP_3a2a_4_a, 0.015);
    create_form_2d_tubes(FormP_3a2a_4_a, FormP_3a2a_8_a, 0.015);
    create_form_2d_tubes(FormP_3a2a_5_a, FormP_3a2a_6_a, 0.015);
    create_form_2d_tubes(FormP_3a2a_6_a, FormP_3a2a_7_a, 0.015);
    create_form_2d_tubes(FormP_3a2a_7_a, FormP_3a2a_8_a, 0.015);
    create_form_2d_tubes(FormP_3a2a_5_a, FormP_2a, 0.015);


    //trial force diagram

    //decomposoiton point o'
    var TrialP_O = new THREE.Vector3(fo.x, fo.y, fo.z);

    //Trial force faces

    //Trail force faces - BCN

    var Force_trial_NB = create_force_trial_plane(ForceP_N, ForceP_B);
    var Force_trial_NBC1 = create_force_trial_plane(ForceP_N, ForceP_BC_1);
    var Force_trial_NBC2 = create_force_trial_plane(ForceP_N, ForceP_BC_2);
    var Force_trial_NBC3 = create_force_trial_plane(ForceP_N, ForceP_BC_3);
    var Force_trial_NBCm = create_force_trial_plane(ForceP_N, ForceP_BC_mid);
    var Force_trial_NCB3 = create_force_trial_plane(ForceP_N, ForceP_CB_3);
    var Force_trial_NCB2 = create_force_trial_plane(ForceP_N, ForceP_CB_2);
    var Force_trial_NCB1 = create_force_trial_plane(ForceP_N, ForceP_CB_1);
    var Force_trial_NC = create_force_trial_plane(ForceP_N, ForceP_C);

    trial_force.add(Force_trial_NB)
    trial_force.add(Force_trial_NBC1)
    trial_force.add(Force_trial_NBC2)
    trial_force.add(Force_trial_NBC3)
    trial_force.add(Force_trial_NBCm)
    trial_force.add(Force_trial_NCB3)
    trial_force.add(Force_trial_NCB2)
    trial_force.add(Force_trial_NCB1)
    trial_force.add(Force_trial_NC)

    var Force_trial_MB = create_force_trial_plane(ForceP_M, ForceP_B);
    var Force_trial_MBC1 = create_force_trial_plane(ForceP_M, ForceP_BC_1);
    var Force_trial_MBC2 = create_force_trial_plane(ForceP_M, ForceP_BC_2);
    var Force_trial_MBC3 = create_force_trial_plane(ForceP_M, ForceP_BC_3);
    var Force_trial_MBCm = create_force_trial_plane(ForceP_M, ForceP_BC_mid);
    var Force_trial_MCB3 = create_force_trial_plane(ForceP_M, ForceP_CB_3);
    var Force_trial_MCB2 = create_force_trial_plane(ForceP_M, ForceP_CB_2);
    var Force_trial_MCB1 = create_force_trial_plane(ForceP_M, ForceP_CB_1);
    var Force_trial_MC = create_force_trial_plane(ForceP_M, ForceP_C);

    trial_force.add(Force_trial_MB)
    trial_force.add(Force_trial_MBC1)
    trial_force.add(Force_trial_MBC2)
    trial_force.add(Force_trial_MBC3)
    trial_force.add(Force_trial_MBCm)
    trial_force.add(Force_trial_MCB3)
    trial_force.add(Force_trial_MCB2)
    trial_force.add(Force_trial_MCB1)
    trial_force.add(Force_trial_MC)

    //Trial form

    var trial_S1 = new THREE.Vector3(FormP_4a_temp.x, FormP_4a_temp.y, triP3.z)

    var trial_LP1 = create_trial_intec(trial_S1, ForceP_N, TrialP_O, ForceP_C, FormP_4a1a_1_a, FormP_4a1a_1_b);
    var trial_LP2 = create_trial_intec(trial_LP1, ForceP_N, TrialP_O, ForceP_CB_1, FormP_4a1a_2_a, FormP_4a1a_2_b);
    var trial_LP3 = create_trial_intec(trial_LP2, ForceP_N, TrialP_O, ForceP_CB_2, FormP_4a1a_3_a, FormP_4a1a_3_b);
    var trial_LP4 = create_trial_intec(trial_LP3, ForceP_N, TrialP_O, ForceP_CB_3, FormP_4a1a_4_a, FormP_4a1a_4_b);
    var trial_LP5 = create_trial_intec(trial_LP4, ForceP_N, TrialP_O, ForceP_BC_mid, FormP_4a1a_8_a, FormP_4a1a_8_b);
    var trial_LP6 = create_trial_intec(trial_LP5, ForceP_N, TrialP_O, ForceP_BC_3, FormP_4a1a_7_a, FormP_4a1a_7_b);
    var trial_LP7 = create_trial_intec(trial_LP6, ForceP_N, TrialP_O, ForceP_BC_2, FormP_4a1a_6_a, FormP_4a1a_6_b);
    var trial_LP8 = create_trial_intec(trial_LP7, ForceP_N, TrialP_O, ForceP_BC_1, FormP_4a1a_5_a, FormP_4a1a_5_b);
    var trial_LP9 = create_trial_intec(trial_LP8, ForceP_N, TrialP_O, ForceP_B, FormP_1a, FormP_1a_b);


    var trial_RP1 = create_trial_intec(trial_LP1, ForceP_C, TrialP_O, ForceP_CB_1, FormP_3a2a_1_a, FormP_3a2a_1_b);
    var trial_RP0 = create_trial_intec(trial_RP1, ForceP_C, TrialP_O, ForceP_M, FormP_3a_temp, FormP_3a_b);
    var trial_RP2 = create_trial_intec(trial_LP2, ForceP_CB_1, TrialP_O, ForceP_CB_2, FormP_3a2a_2_a, FormP_3a2a_2_b);
    var trial_RP3 = create_trial_intec(trial_LP3, ForceP_CB_2, TrialP_O, ForceP_CB_3, FormP_3a2a_3_a, FormP_3a2a_3_b);
    var trial_RP4 = create_trial_intec(trial_LP4, ForceP_CB_3, TrialP_O, ForceP_BC_mid, FormP_3a2a_4_a, FormP_3a2a_4_b);
    var trial_RP5 = create_trial_intec(trial_LP5, ForceP_BC_mid, TrialP_O, ForceP_BC_3, FormP_3a2a_8_a, FormP_3a2a_8_b);
    var trial_RP6 = create_trial_intec(trial_LP6, ForceP_BC_3, TrialP_O, ForceP_BC_2, FormP_3a2a_7_a, FormP_3a2a_7_b);
    var trial_RP7 = create_trial_intec(trial_LP7, ForceP_BC_2, TrialP_O, ForceP_BC_1, FormP_3a2a_6_a, FormP_3a2a_6_b);
    var trial_RP8 = create_trial_intec(trial_LP8, ForceP_BC_1, TrialP_O, ForceP_B, FormP_3a2a_5_a, FormP_3a2a_5_b);
    var trial_RP9 = create_trial_intec(trial_RP8, ForceP_M, TrialP_O, ForceP_B, FormP_2a, FormP_2a_b);


    var trial_mesh_L1 = createCylinderMesh(trial_S1, trial_LP1, DragPointMat, 0.02, 0.02);
    var trial_mesh_L2 = createCylinderMesh(trial_LP1, trial_LP2, DragPointMat, 0.02, 0.02);
    var trial_mesh_L3 = createCylinderMesh(trial_LP2, trial_LP3, DragPointMat, 0.02, 0.02);
    var trial_mesh_L4 = createCylinderMesh(trial_LP3, trial_LP4, DragPointMat, 0.02, 0.02);
    var trial_mesh_L5 = createCylinderMesh(trial_LP4, trial_LP5, DragPointMat, 0.02, 0.02);
    var trial_mesh_L6 = createCylinderMesh(trial_LP5, trial_LP6, DragPointMat, 0.02, 0.02);
    var trial_mesh_L7 = createCylinderMesh(trial_LP6, trial_LP7, DragPointMat, 0.02, 0.02);
    var trial_mesh_L8 = createCylinderMesh(trial_LP7, trial_LP8, DragPointMat, 0.02, 0.02);
    var trial_mesh_L9 = createCylinderMesh(trial_LP8, trial_LP9, DragPointMat, 0.02, 0.02);


    var trial_mesh_R1 = createCylinderMesh(trial_RP0, trial_RP1, DragPointMat, 0.02, 0.02);
    var trial_mesh_R2 = createCylinderMesh(trial_RP1, trial_RP2, DragPointMat, 0.02, 0.02);
    var trial_mesh_R3 = createCylinderMesh(trial_RP2, trial_RP3, DragPointMat, 0.02, 0.02);
    var trial_mesh_R4 = createCylinderMesh(trial_RP3, trial_RP4, DragPointMat, 0.02, 0.02);
    var trial_mesh_R5 = createCylinderMesh(trial_RP4, trial_RP5, DragPointMat, 0.02, 0.02);
    var trial_mesh_R6 = createCylinderMesh(trial_RP5, trial_RP6, DragPointMat, 0.02, 0.02);
    var trial_mesh_R7 = createCylinderMesh(trial_RP6, trial_RP7, DragPointMat, 0.02, 0.02);
    var trial_mesh_R8 = createCylinderMesh(trial_RP7, trial_RP8, DragPointMat, 0.02, 0.02);
    var trial_mesh_R9 = createCylinderMesh(trial_RP8, trial_RP9, DragPointMat, 0.02, 0.02);

    var trial_mesh_L1R1 = createCylinderMesh(trial_LP1, trial_RP1, DragPointMat, 0.02, 0.02);
    var trial_mesh_L2R2 = createCylinderMesh(trial_LP2, trial_RP2, DragPointMat, 0.02, 0.02);
    var trial_mesh_L3R3 = createCylinderMesh(trial_LP3, trial_RP3, DragPointMat, 0.02, 0.02);
    var trial_mesh_L4R4 = createCylinderMesh(trial_LP4, trial_RP4, DragPointMat, 0.02, 0.02);
    var trial_mesh_L5R5 = createCylinderMesh(trial_LP5, trial_RP5, DragPointMat, 0.02, 0.02);
    var trial_mesh_L6R6 = createCylinderMesh(trial_LP6, trial_RP6, DragPointMat, 0.02, 0.02);
    var trial_mesh_L7R7 = createCylinderMesh(trial_LP7, trial_RP7, DragPointMat, 0.02, 0.02);
    var trial_mesh_L8R8 = createCylinderMesh(trial_LP8, trial_RP8, DragPointMat, 0.02, 0.02);
    createCylinderMesh(trial_LP9, trial_RP9, DragPointMat, 0.02, 0.02);


    form_trial.add(trial_mesh_L1)
    form_trial.add(trial_mesh_L2)
    form_trial.add(trial_mesh_L3)
    form_trial.add(trial_mesh_L4)
    form_trial.add(trial_mesh_L5)
    form_trial.add(trial_mesh_L6)
    form_trial.add(trial_mesh_L7)
    form_trial.add(trial_mesh_L8)
    form_trial.add(trial_mesh_L9)

    form_trial.add(trial_mesh_R1)
    form_trial.add(trial_mesh_R2)
    form_trial.add(trial_mesh_R3)
    form_trial.add(trial_mesh_R4)
    form_trial.add(trial_mesh_R5)
    form_trial.add(trial_mesh_R6)
    form_trial.add(trial_mesh_R7)
    form_trial.add(trial_mesh_R8)
    form_trial.add(trial_mesh_R9)

    form_trial.add(trial_mesh_L1R1)
    form_trial.add(trial_mesh_L2R2)
    form_trial.add(trial_mesh_L3R3)
    form_trial.add(trial_mesh_L4R4)
    form_trial.add(trial_mesh_L5R5)
    form_trial.add(trial_mesh_L6R6)
    form_trial.add(trial_mesh_L7R7)
    form_trial.add(trial_mesh_L8R8)
    // form_trial.add(trial_mesh_L9R9)


    var trial_linep1p2 = createdashline(trial_S1, trial_RP0, trialline_dash)
    var trial_linep1p4 = createdashline(trial_S1, trial_LP9, trialline_dash)
    var trial_linep2p3 = createdashline(trial_RP0, trial_RP9, trialline_dash)
    var trial_linep3p4 = createdashline(trial_RP9, trial_LP9, trialline_dash)


    form_trial.add(trial_linep1p2);
    form_trial.add(trial_linep1p4);
    form_trial.add(trial_linep2p3);
    form_trial.add(trial_linep3p4);


    //face nromals

    if (cp4.z < 0) {

        var mid_p1p2p3p4 = new THREE.Vector3((trial_S1.x + trial_RP0.x + trial_LP9.x + trial_RP9.x) / 4, (trial_S1.y + trial_RP0.y + trial_LP9.y + trial_RP9.y) / 4, (trial_S1.z + trial_RP0.z + trial_LP9.z + trial_RP9.z) / 4)
        var vec_p1p2p3_temp = Cal_Vec_2(trial_RP9, trial_RP0, trial_LP9, 1.2)
        var trialnormal_p1p2p3 = new THREE.Vector3(mid_p1p2p3p4.x - 0.2 * vec_p1p2p3_temp.x, mid_p1p2p3p4.y - 0.2 * vec_p1p2p3_temp.y, mid_p1p2p3p4.z - 0.2 * vec_p1p2p3_temp.z)

        var trial_normal_material = new THREE.MeshPhongMaterial({color: "red"})
        var trial_normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})

        var trial_normal_1 = createCylinderArrowMesh(mid_p1p2p3p4, trialnormal_p1p2p3, trial_normal_material, 0.015, 0.035, 0.55);
        var trial_normal_1_outline = createCylinderArrowMesh(mid_p1p2p3p4, trialnormal_p1p2p3, trial_normal_outlinematerial, 0.018, 0.038, 0.54);

        form_trial.add(trial_normal_1);
        form_trial.add(trial_normal_1_outline);
        trial_normal_1_outline.scale.multiplyScalar(1.05);


        var vertices = [
            trial_S1, trial_RP0, trial_LP9, trial_RP9
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(2, 1, 3),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();
        var material_trial_closingplane = [
            //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
            new THREE.MeshBasicMaterial({color: "black", wireframe: false, transparent: true, opacity: 0.4}),
            new THREE.MeshPhongMaterial({
                color: "darkgrey", transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false
            })
        ];

        var trial_closingplane = THREE.SceneUtils.createMultiMaterialObject(geom, material_trial_closingplane);

        form_trial.add(trial_closingplane);
    }

    if (cp4.z >= 0) {

        var mid_p1p2p3p4 = new THREE.Vector3((trial_S1.x + trial_RP0.x + trial_LP9.x + trial_RP9.x) / 4, (trial_S1.y + trial_RP0.y + trial_LP9.y + trial_RP9.y) / 4, (trial_S1.z + trial_RP0.z + trial_LP9.z + trial_RP9.z) / 4)
        var vec_p1p2p3_temp = Cal_Vec_2(trial_LP9, trial_RP0, trial_RP9, 1.2)
        var trialnormal_p1p2p3 = new THREE.Vector3(mid_p1p2p3p4.x - 0.2 * vec_p1p2p3_temp.x, mid_p1p2p3p4.y - 0.2 * vec_p1p2p3_temp.y, mid_p1p2p3p4.z - 0.2 * vec_p1p2p3_temp.z)

        var trial_normal_material = new THREE.MeshPhongMaterial({color: "red"})
        var trial_normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})

        var trial_normal_1 = createCylinderArrowMesh(mid_p1p2p3p4, trialnormal_p1p2p3, trial_normal_material, 0.015, 0.035, 0.55);
        var trial_normal_1_outline = createCylinderArrowMesh(mid_p1p2p3p4, trialnormal_p1p2p3, trial_normal_outlinematerial, 0.018, 0.038, 0.54);

        form_trial.add(trial_normal_1);
        form_trial.add(trial_normal_1_outline);
        trial_normal_1_outline.scale.multiplyScalar(1.05);


        var vertices = [
            trial_S1, trial_RP0, trial_LP9, trial_RP9
        ];

        var faces = [
            new THREE.Face3(2, 1, 0),
            new THREE.Face3(3, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();
        var material_trial_closingplane = [
            //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
            new THREE.MeshBasicMaterial({color: "black", wireframe: false, transparent: true, opacity: 0.4}),
            new THREE.MeshPhongMaterial({
                color: "darkgrey", transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false
            })
        ];

        var trial_closingplane = THREE.SceneUtils.createMultiMaterialObject(geom, material_trial_closingplane);

        form_trial.add(trial_closingplane);
    }


    //find x1

    //    trial_S1,trial_P15,trial_P9

    var ForceX1_vec = Cal_Vec_2(trial_S1, trial_RP0, trial_LP9, 0.5);
    var ForceX1_temp = new THREE.Vector3(TrialP_O.x - 1.2 * ForceX1_vec.x, TrialP_O.y - 1.2 * ForceX1_vec.y, TrialP_O.z - 1.2 * ForceX1_vec.z);

    //define intersection point x1
    var intersect_x1_vec = new THREE.Vector3(ForceX1_temp.x - TrialP_O.x, ForceX1_temp.y - TrialP_O.y, ForceX1_temp.z - TrialP_O.z);
    var applyplanevec = Cal_Vec_2(ForceP_N, ForceP_C, ForceP_B, 0.5);
    var ForceX1 = Cal_Plane_Line_Intersect_Point(TrialP_O, intersect_x1_vec, ForceP_C, applyplanevec);

    var line_ox1 = [];
    line_ox1.push(TrialP_O);
    line_ox1.push(ForceX1);

    var line_ox1_geo = new THREE.Geometry().setFromPoints(line_ox1);

    var applyline_1 = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.2,
        gapSize: 0.03,
        linewidth: 1

    });

    var applylineox1 = new THREE.LineSegments(line_ox1_geo, applyline_1);
    applylineox1.computeLineDistances();//compute
    trial_force.add(applylineox1);

    //add x1 arrow

    var TrialP_O_sp1 = new THREE.Sphere(new THREE.Vector3(TrialP_O.x, TrialP_O.y, TrialP_O.z), 0.42);
    var x1_closeP1 = TrialP_O_sp1.clampPoint(ForceX1);

    var TrialP_O_sp2 = new THREE.Sphere(new THREE.Vector3(TrialP_O.x, TrialP_O.y, TrialP_O.z), 0.64);
    var x1_closeP2 = TrialP_O_sp2.clampPoint(ForceX1);

    var x1_arrow = createCylinderArrowMesh(x1_closeP1, x1_closeP2, trial_normal_material, 0.012, 0.025, 0.55);

    trial_force.add(x1_arrow);


    //find constrain point o1

    var FormCP1 = new THREE.Vector3(FormP_1a.x, FormP_1a.y, cp1.z);
    var FormCP2 = new THREE.Vector3(FormP_2a.x, FormP_2a.y, cp1.z);
    var FormCP3 = new THREE.Vector3(FormP_3a_temp.x, FormP_3a_temp.y, cp2.z);
    var FormCP4 = new THREE.Vector3(FormP_4a_temp.x, FormP_4a_temp.y, cp2.z);

    if (cp4.z < 0) {

        var ForceO1_temp = Cal_Vec_2(FormCP3, FormCP2, FormCP1, 0.5);
        var ForceO1 = new THREE.Vector3(ForceX1.x - o1.l * ForceO1_temp.x, ForceX1.y - o1.l * ForceO1_temp.y, ForceX1.z - o1.l * ForceO1_temp.z);

        var line_o1x1_temp = [];
        line_o1x1_temp.push(ForceX1);
        line_o1x1_temp.push(ForceO1);

        var line_o1x1_geo = new THREE.Geometry().setFromPoints(line_o1x1_temp);

        var line_o1x1 = new THREE.LineSegments(line_o1x1_geo, applyline_1);
        line_o1x1.computeLineDistances();//compute
    }

    if (cp4.z >= 0) {

        var ForceO1_temp = Cal_Vec_2(FormCP1, FormCP2, FormCP3, 0.5);
        var ForceO1 = new THREE.Vector3(ForceX1.x - o1.l * ForceO1_temp.x, ForceX1.y - o1.l * ForceO1_temp.y, ForceX1.z - o1.l * ForceO1_temp.z);

        var line_o1x1_temp = [];
        line_o1x1_temp.push(ForceX1);
        line_o1x1_temp.push(ForceO1);

        var line_o1x1_geo = new THREE.Geometry().setFromPoints(line_o1x1_temp);

        var line_o1x1 = new THREE.LineSegments(line_o1x1_geo, applyline_1);
        line_o1x1.computeLineDistances();//compute
    }
    trial_force.add(line_o1x1);

    //add o1 arrow

    var ForceO1_sp1 = new THREE.Sphere(new THREE.Vector3(ForceO1.x, ForceO1.y, ForceO1.z), 0.42);
    var ForceO1_closeP1 = ForceO1_sp1.clampPoint(ForceX1);

    var ForceO1_sp2 = new THREE.Sphere(new THREE.Vector3(ForceO1.x, ForceO1.y, ForceO1.z), 0.64);
    var ForceO1_closeP2 = ForceO1_sp2.clampPoint(ForceX1);

    var ForceO1_arrow = createCylinderArrowMesh(ForceO1_closeP1, ForceO1_closeP2, trial_normal_material, 0.012, 0.025, 0.55);

    trial_force.add(ForceO1_arrow);

    // location of supports


    var vertices = [
        FormCP1, FormCP2, FormCP3, FormCP4
    ];

    var faces = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3),


    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();
    var material_step_1 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: "white", transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    var form_closingmesh = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
    form_closingplane.add(form_closingmesh);

    //dash edges

    var form_linep1p2 = createdashline(FormCP1, FormCP2, trialline_dash)
    var form_linep2p3 = createdashline(FormCP2, FormCP3, trialline_dash)
    var form_linep3p4 = createdashline(FormCP3, FormCP4, trialline_dash)
    var form_linep1p4 = createdashline(FormCP1, FormCP4, trialline_dash)


    form_closingplane.add(form_linep1p2);
    form_closingplane.add(form_linep2p3);
    form_closingplane.add(form_linep3p4);
    form_closingplane.add(form_linep1p4);


    //face nromals

    if (cp4.z < 0) {

        var mid_p1p2p3p4 = new THREE.Vector3((FormCP1.x + FormCP2.x + FormCP3.x + FormCP4.x) / 4, (FormCP1.y + FormCP2.y + FormCP3.y + FormCP4.y) / 4, (FormCP1.z + FormCP2.z + FormCP3.z + FormCP4.z) / 4)
        var vec_p1p2p3_temp = Cal_Vec_2(FormCP1, FormCP2, FormCP3, 1.2)
        var normal_p1p2p3 = new THREE.Vector3(mid_p1p2p3p4.x - 0.2 * vec_p1p2p3_temp.x, mid_p1p2p3p4.y - 0.2 * vec_p1p2p3_temp.y, mid_p1p2p3p4.z - 0.2 * vec_p1p2p3_temp.z)

        var form_normal_material = new THREE.MeshPhongMaterial({color: "red"})
        var form_normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})

        var form_normal_1 = createCylinderArrowMesh(mid_p1p2p3p4, normal_p1p2p3, form_normal_material, 0.015, 0.035, 0.55);
        var form_normal_1_outline = createCylinderArrowMesh(mid_p1p2p3p4, normal_p1p2p3, form_normal_outlinematerial, 0.018, 0.038, 0.54);
    }

    if (cp4.z >= 0) {
        var mid_p1p2p3p4 = new THREE.Vector3((FormCP1.x + FormCP2.x + FormCP3.x + FormCP4.x) / 4, (FormCP1.y + FormCP2.y + FormCP3.y + FormCP4.y) / 4, (FormCP1.z + FormCP2.z + FormCP3.z + FormCP4.z) / 4)
        var vec_p1p2p3_temp = Cal_Vec_2(FormCP3, FormCP2, FormCP1, 1.2)
        var normal_p1p2p3 = new THREE.Vector3(mid_p1p2p3p4.x - 0.2 * vec_p1p2p3_temp.x, mid_p1p2p3p4.y - 0.2 * vec_p1p2p3_temp.y, mid_p1p2p3p4.z - 0.2 * vec_p1p2p3_temp.z)

        var form_normal_material = new THREE.MeshPhongMaterial({color: "red"})
        var form_normal_outlinematerial = new THREE.MeshPhongMaterial({color: "white", side: THREE.BackSide})

        var form_normal_1 = createCylinderArrowMesh(mid_p1p2p3p4, normal_p1p2p3, form_normal_material, 0.015, 0.035, 0.55);
        var form_normal_1_outline = createCylinderArrowMesh(mid_p1p2p3p4, normal_p1p2p3, form_normal_outlinematerial, 0.018, 0.038, 0.54);
    }


    form_closingplane.add(form_normal_1);
    form_closingplane.add(form_normal_1_outline);


    // final force diagram

    var Force_NB = create_force_plane(ForceP_N, ForceP_B);
    var Force_NBC1 = create_force_plane(ForceP_N, ForceP_BC_1);
    var Force_NBC2 = create_force_plane(ForceP_N, ForceP_BC_2);
    var Force_NBC3 = create_force_plane(ForceP_N, ForceP_BC_3);
    var Force_NBCm = create_force_plane(ForceP_N, ForceP_BC_mid);
    var Force_NCB3 = create_force_plane(ForceP_N, ForceP_CB_3);
    var Force_NCB2 = create_force_plane(ForceP_N, ForceP_CB_2);
    var Force_NCB1 = create_force_plane(ForceP_N, ForceP_CB_1);
    var Force_NC = create_force_plane(ForceP_N, ForceP_C);


    force_group.add(Force_NB)
    force_group.add(Force_NBC1)
    force_group.add(Force_NBC2)
    force_group.add(Force_NBC3)
    force_group.add(Force_NBCm)
    force_group.add(Force_NCB3)
    force_group.add(Force_NCB2)
    force_group.add(Force_NCB1)
    force_group.add(Force_NC)

    var Force_MB = create_force_plane(ForceP_M, ForceP_B);
    var Force_MBC1 = create_force_plane(ForceP_M, ForceP_BC_1);
    var Force_MBC2 = create_force_plane(ForceP_M, ForceP_BC_2);
    var Force_MBC3 = create_force_plane(ForceP_M, ForceP_BC_3);
    var Force_MBCm = create_force_plane(ForceP_M, ForceP_BC_mid);
    var Force_MCB3 = create_force_plane(ForceP_M, ForceP_CB_3);
    var Force_MCB2 = create_force_plane(ForceP_M, ForceP_CB_2);
    var Force_MCB1 = create_force_plane(ForceP_M, ForceP_CB_1);
    var Force_MC = create_force_plane(ForceP_M, ForceP_C);

    force_group.add(Force_MB)
    force_group.add(Force_MBC1)
    force_group.add(Force_MBC2)
    force_group.add(Force_MBC3)
    force_group.add(Force_MBCm)
    force_group.add(Force_MCB3)
    force_group.add(Force_MCB2)
    force_group.add(Force_MCB1)
    force_group.add(Force_MC)

    //final form construct

    // cal face areas

    var Force_area_NB = create_force_face_area(ForceP_N, ForceP_B, ForceO1);
    var Force_area_NBC1 = create_force_face_area(ForceP_N, ForceP_BC_1, ForceO1);
    var Force_area_NBC2 = create_force_face_area(ForceP_N, ForceP_BC_2, ForceO1);
    var Force_area_NBC3 = create_force_face_area(ForceP_N, ForceP_BC_3, ForceO1);
    var Force_area_NBCm = create_force_face_area(ForceP_N, ForceP_BC_mid, ForceO1);
    var Force_area_NCB3 = create_force_face_area(ForceP_N, ForceP_CB_3, ForceO1);
    var Force_area_NCB2 = create_force_face_area(ForceP_N, ForceP_CB_2, ForceO1);
    var Force_area_NCB1 = create_force_face_area(ForceP_N, ForceP_CB_1, ForceO1);
    var Force_area_NC = create_force_face_area(ForceP_N, ForceP_C, ForceO1);

    var Force_area_CCB1 = create_force_face_area(ForceP_CB_1, ForceP_C, ForceO1);
    var Force_area_CB1CB2 = create_force_face_area(ForceP_CB_1, ForceP_CB_2, ForceO1);
    var Force_area_CB2CB3 = create_force_face_area(ForceP_CB_2, ForceP_CB_3, ForceO1);
    var Force_area_CB3CBm = create_force_face_area(ForceP_CB_3, ForceP_BC_mid, ForceO1);
    var Force_area_CBmBC3 = create_force_face_area(ForceP_BC_mid, ForceP_BC_3, ForceO1);
    var Force_area_BC3BC2 = create_force_face_area(ForceP_BC_3, ForceP_BC_2, ForceO1);
    var Force_area_BC2BC1 = create_force_face_area(ForceP_BC_2, ForceP_BC_1, ForceO1);
    var Force_area_BC1B = create_force_face_area(ForceP_BC_1, ForceP_B, ForceO1);

    var Force_area_MB = create_force_face_area(ForceP_M, ForceP_B, ForceO1);
    var Force_area_MBC1 = create_force_face_area(ForceP_M, ForceP_BC_1, ForceO1);
    var Force_area_MBC2 = create_force_face_area(ForceP_M, ForceP_BC_2, ForceO1);
    var Force_area_MBC3 = create_force_face_area(ForceP_M, ForceP_BC_3, ForceO1);
    var Force_area_MBCm = create_force_face_area(ForceP_M, ForceP_BC_mid, ForceO1);
    var Force_area_MCB3 = create_force_face_area(ForceP_M, ForceP_CB_3, ForceO1);
    var Force_area_MCB2 = create_force_face_area(ForceP_M, ForceP_CB_2, ForceO1);
    var Force_area_MCB1 = create_force_face_area(ForceP_M, ForceP_CB_1, ForceO1);
    var Force_area_MC = create_force_face_area(ForceP_M, ForceP_C, ForceO1);


    var max = Math.max(
        Force_area_NB,
        Force_area_NBC1,
        Force_area_NBC2,
        Force_area_NBC3,
        Force_area_NBCm,
        Force_area_NCB3,
        Force_area_NCB2,
        Force_area_NCB1,
        Force_area_NC,

        Force_area_CCB1,
        Force_area_CB1CB2,
        Force_area_CB2CB3,
        Force_area_CB3CBm,
        Force_area_CBmBC3,
        Force_area_BC3BC2,
        Force_area_BC2BC1,
        Force_area_BC1B,

        Force_area_MB,
        Force_area_MBC1,
        Force_area_MBC2,
        Force_area_MBC3,
        Force_area_MBCm,
        Force_area_MCB3,
        Force_area_MCB2,
        Force_area_MCB1,
        Force_area_MC
    )


    var Form_LP1 = create_trial_intec(FormCP4, ForceP_N, ForceO1, ForceP_C, FormP_4a1a_1_a, FormP_4a1a_1_b);
    var Form_LP2 = create_trial_intec(Form_LP1, ForceP_N, ForceO1, ForceP_CB_1, FormP_4a1a_2_a, FormP_4a1a_2_b);
    var Form_LP3 = create_trial_intec(Form_LP2, ForceP_N, ForceO1, ForceP_CB_2, FormP_4a1a_3_a, FormP_4a1a_3_b);
    var Form_LP4 = create_trial_intec(Form_LP3, ForceP_N, ForceO1, ForceP_CB_3, FormP_4a1a_4_a, FormP_4a1a_4_b);
    var Form_LP5 = create_trial_intec(FormCP1, ForceP_N, ForceO1, ForceP_B, FormP_4a1a_5_a, FormP_4a1a_5_b);
    var Form_LP6 = create_trial_intec(Form_LP5, ForceP_N, ForceO1, ForceP_BC_1, FormP_4a1a_6_a, FormP_4a1a_6_b);
    var Form_LP7 = create_trial_intec(Form_LP6, ForceP_N, ForceO1, ForceP_BC_2, FormP_4a1a_7_a, FormP_4a1a_7_b);
    var Form_LP8 = create_trial_intec(Form_LP7, ForceP_N, ForceO1, ForceP_BC_3, FormP_4a1a_8_a, FormP_4a1a_8_b);

    var Form_RP1 = create_trial_intec(FormCP3, ForceP_M, ForceO1, ForceP_C, FormP_3a2a_1_a, FormP_3a2a_1_b);
    var Form_RP2 = create_trial_intec(Form_RP1, ForceP_M, ForceO1, ForceP_CB_1, FormP_3a2a_2_a, FormP_3a2a_2_b);
    var Form_RP3 = create_trial_intec(Form_RP2, ForceP_M, ForceO1, ForceP_CB_2, FormP_3a2a_3_a, FormP_3a2a_3_b);
    var Form_RP4 = create_trial_intec(Form_RP3, ForceP_M, ForceO1, ForceP_CB_3, FormP_3a2a_4_a, FormP_3a2a_4_b);
    var Form_RP5 = create_trial_intec(FormCP2, ForceP_M, ForceO1, ForceP_B, FormP_3a2a_5_a, FormP_3a2a_5_b);
    var Form_RP6 = create_trial_intec(Form_RP5, ForceP_M, ForceO1, ForceP_BC_1, FormP_3a2a_6_a, FormP_3a2a_6_b);
    var Form_RP7 = create_trial_intec(Form_RP6, ForceP_M, ForceO1, ForceP_BC_2, FormP_3a2a_7_a, FormP_3a2a_7_b);
    var Form_RP8 = create_trial_intec(Form_RP7, ForceP_M, ForceO1, ForceP_BC_3, FormP_3a2a_8_a, FormP_3a2a_8_b);

    create_form_tubes(Force_area_NC, max, 0.01, FormCP4, Form_LP1, ForceO1);
    create_form_tubes(Force_area_NCB1, max, 0.01, Form_LP1, Form_LP2, ForceO1);
    create_form_tubes(Force_area_NCB2, max, 0.01, Form_LP2, Form_LP3, ForceO1);
    create_form_tubes(Force_area_NCB3, max, 0.01, Form_LP3, Form_LP4, ForceO1);
    create_form_tubes(Force_area_NBCm, max, 0.01, Form_LP4, Form_LP8, ForceO1);
    create_form_tubes(Force_area_NBC3, max, 0.01, Form_LP8, Form_LP7, ForceO1);
    create_form_tubes(Force_area_NBC2, max, 0.01, Form_LP7, Form_LP6, ForceO1);
    create_form_tubes(Force_area_NBC1, max, 0.01, Form_LP6, Form_LP5, ForceO1);
    create_form_tubes(Force_area_NB, max, 0.01, Form_LP5, FormCP1, ForceO1);

    create_form_tubes(Force_area_MC, max, 0.01, FormCP3, Form_RP1, ForceO1);
    create_form_tubes(Force_area_MCB1, max, 0.01, Form_RP1, Form_RP2, ForceO1);
    create_form_tubes(Force_area_MCB2, max, 0.01, Form_RP2, Form_RP3, ForceO1);
    create_form_tubes(Force_area_MCB3, max, 0.01, Form_RP3, Form_RP4, ForceO1);
    create_form_tubes(Force_area_MBCm, max, 0.01, Form_RP4, Form_RP8, ForceO1);
    create_form_tubes(Force_area_MBC3, max, 0.01, Form_RP8, Form_RP7, ForceO1);
    create_form_tubes(Force_area_MBC2, max, 0.01, Form_RP7, Form_RP6, ForceO1);
    create_form_tubes(Force_area_MBC1, max, 0.01, Form_RP6, Form_RP5, ForceO1);
    create_form_tubes(Force_area_MB, max, 0.01, Form_RP5, FormCP2, ForceO1);

    create_form_tubes_t_1(Force_area_CCB1, max, 0.04, Form_LP1, Form_RP1, ForceO1);
    create_form_tubes_t_2(Force_area_CB1CB2, max, 0.04, Form_LP2, Form_RP2, ForceO1);
    create_form_tubes_t_3(Force_area_CB2CB3, max, 0.04, Form_LP3, Form_RP3, ForceO1);
    create_form_tubes_t_4(Force_area_CB3CBm, max, 0.04, Form_LP4, Form_RP4, ForceO1);
    create_form_tubes_t_5(Force_area_CBmBC3, max, 0.04, Form_LP5, Form_RP5, ForceO1);
    create_form_tubes_t_6(Force_area_BC3BC2, max, 0.04, Form_LP6, Form_RP6, ForceO1);
    create_form_tubes_t_7(Force_area_BC2BC1, max, 0.04, Form_LP7, Form_RP7, ForceO1);
    create_form_tubes_t_8(Force_area_BC1B, max, 0.04, Form_LP8, Form_RP8, ForceO1);

    create_form_node(Form_LP1, 0.03);
    create_form_node(Form_LP2, 0.03);
    create_form_node(Form_LP3, 0.03);
    create_form_node(Form_LP4, 0.03);
    create_form_node(Form_LP5, 0.03);
    create_form_node(Form_LP6, 0.03);
    create_form_node(Form_LP7, 0.03);
    create_form_node(Form_LP8, 0.03);

    create_form_node(Form_RP1, 0.03);
    create_form_node(Form_RP2, 0.03);
    create_form_node(Form_RP3, 0.03);
    create_form_node(Form_RP4, 0.03);
    create_form_node(Form_RP5, 0.03);
    create_form_node(Form_RP6, 0.03);
    create_form_node(Form_RP7, 0.03);
    create_form_node(Form_RP8, 0.03);

    // add form R arrow
    var arrow_r = new THREE.MeshPhongMaterial({color: 0x009600});
    var arrow_r2 = new THREE.MeshPhongMaterial({color: 0x009600});

    var arrow_r_outline = new THREE.MeshBasicMaterial({color: "white", transparent: false, side: THREE.BackSide});
    var arrow_r2_outline = new THREE.MeshBasicMaterial({color: "white", transparent: false, side: THREE.BackSide});


    var R_arrow_P1 = new THREE.Sphere(new THREE.Vector3(Form_LP5.x, Form_LP5.y, Form_LP5.z), 0.1);
    var R_closeP1 = R_arrow_P1.clampPoint(FormCP1);
    var R_vec1 = new THREE.Vector3(R_closeP1.x - Form_LP5.x, R_closeP1.y - Form_LP5.y, R_closeP1.z - Form_LP5.z);
    var R_arrow_1_a = new THREE.Vector3(FormCP1.x + 2.5 * R_vec1.x, FormCP1.y + 2.5 * R_vec1.y, FormCP1.z + 2.5 * R_vec1.z)

    var R_arrow_P2 = new THREE.Sphere(new THREE.Vector3(Form_RP5.x, Form_RP5.y, Form_RP5.z), 0.1);
    var R_closeP2 = R_arrow_P2.clampPoint(FormCP2);
    var R_vec2 = new THREE.Vector3(R_closeP2.x - Form_RP5.x, R_closeP2.y - Form_RP5.y, R_closeP2.z - Form_RP5.z);
    var R_arrow_2_a = new THREE.Vector3(FormCP2.x + 2.5 * R_vec2.x, FormCP2.y + 2.5 * R_vec2.y, FormCP2.z + 2.5 * R_vec2.z)

    var R_arrow_P3 = new THREE.Sphere(new THREE.Vector3(Form_RP1.x, Form_RP1.y, Form_RP1.z), 0.1);
    var R_closeP3 = R_arrow_P3.clampPoint(FormCP3);
    var R_vec3 = new THREE.Vector3(R_closeP3.x - Form_RP1.x, R_closeP3.y - Form_RP1.y, R_closeP3.z - Form_RP1.z);
    var R_arrow_3_a = new THREE.Vector3(FormCP3.x + 2.5 * R_vec3.x, FormCP3.y + 2.5 * R_vec3.y, FormCP3.z + 2.5 * R_vec3.z)

    var R_arrow_P4 = new THREE.Sphere(new THREE.Vector3(Form_LP1.x, Form_LP1.y, Form_LP1.z), 0.1);
    var R_closeP4 = R_arrow_P4.clampPoint(FormCP4);
    var R_vec4 = new THREE.Vector3(R_closeP4.x - Form_LP1.x, R_closeP4.y - Form_LP1.y, R_closeP4.z - Form_LP1.z);
    var R_arrow_4_a = new THREE.Vector3(FormCP4.x + 2.5 * R_vec4.x, FormCP4.y + 2.5 * R_vec4.y, FormCP4.z + 2.5 * R_vec4.z)

    if (ForceO1.z <= ForceP_B.z) {
        var R_arrow1 = createCylinderArrowMesh(R_arrow_1_a, FormCP1, arrow_r2, 0.015, 0.035, 0.6);
        var R_arrow1b = createCylinderArrowMesh(R_arrow_1_a, FormCP1, arrow_r2_outline, 0.02, 0.035, 0.57);
        R_arrow1b.scale.multiplyScalar(1.05);

        var R_arrow2 = createCylinderArrowMesh(R_arrow_2_a, FormCP2, arrow_r2, 0.015, 0.035, 0.6);
        var R_arrow2b = createCylinderArrowMesh(R_arrow_2_a, FormCP2, arrow_r2_outline, 0.02, 0.035, 0.57);
        R_arrow2b.scale.multiplyScalar(1.05);

        var R_arrow3 = createCylinderArrowMesh(R_arrow_3_a, FormCP3, arrow_r2, 0.015, 0.035, 0.6);
        var R_arrow3b = createCylinderArrowMesh(R_arrow_3_a, FormCP3, arrow_r2_outline, 0.02, 0.035, 0.57);
        R_arrow3b.scale.multiplyScalar(1.05);

        var R_arrow4 = createCylinderArrowMesh(R_arrow_4_a, FormCP4, arrow_r2, 0.015, 0.035, 0.6);
        var R_arrow4b = createCylinderArrowMesh(R_arrow_4_a, FormCP4, arrow_r2_outline, 0.02, 0.035, 0.57);
        R_arrow4b.scale.multiplyScalar(1.05);

        form_closingplane.add(R_arrow1);
        form_closingplane.add(R_arrow1b);

        form_closingplane.add(R_arrow2);
        form_closingplane.add(R_arrow2b);

        form_closingplane.add(R_arrow3);
        form_closingplane.add(R_arrow3b);

        form_closingplane.add(R_arrow4);
        form_closingplane.add(R_arrow4b);

    }


    if (ForceO1.z > ForceP_B.z) {
        var R_arrow1 = createCylinderArrowMesh(FormCP1, R_arrow_1_a, arrow_r2, 0.015, 0.035, 0.6);
        var R_arrow1b = createCylinderArrowMesh(FormCP1, R_arrow_1_a, arrow_r2_outline, 0.02, 0.035, 0.57);
        R_arrow1b.scale.multiplyScalar(1.05);

        var R_arrow2 = createCylinderArrowMesh(FormCP2, R_arrow_2_a, arrow_r2, 0.015, 0.035, 0.6);
        var R_arrow2b = createCylinderArrowMesh(FormCP2, R_arrow_2_a, arrow_r2_outline, 0.02, 0.035, 0.57);
        R_arrow2b.scale.multiplyScalar(1.05);

        var R_arrow3 = createCylinderArrowMesh(FormCP3, R_arrow_3_a, arrow_r2, 0.015, 0.035, 0.6);
        var R_arrow3b = createCylinderArrowMesh(FormCP3, R_arrow_3_a, arrow_r2_outline, 0.02, 0.035, 0.57);
        R_arrow3b.scale.multiplyScalar(1.05);

        var R_arrow4 = createCylinderArrowMesh(FormCP4, R_arrow_4_a, arrow_r2, 0.015, 0.035, 0.6);
        var R_arrow4b = createCylinderArrowMesh(FormCP4, R_arrow_4_a, arrow_r2_outline, 0.02, 0.035, 0.57);
        R_arrow4b.scale.multiplyScalar(1.05);

        form_closingplane.add(R_arrow1);
        form_closingplane.add(R_arrow1b);

        form_closingplane.add(R_arrow2);
        form_closingplane.add(R_arrow2b);

        form_closingplane.add(R_arrow3);
        form_closingplane.add(R_arrow3b);

        form_closingplane.add(R_arrow4);
        form_closingplane.add(R_arrow4b);

    }

    // add force f1 arrow

    var f_arrow_1 = new THREE.Vector3((ForceP_M.x + ForceP_B.x + ForceP_BC_1.x) / 3, (ForceP_M.y + ForceP_B.y + ForceP_BC_1.y) / 3, (ForceP_M.z + ForceP_B.z + ForceP_BC_1.z) / 3);
    var f_arrow_1_a = new THREE.Vector3(f_arrow_1.x, f_arrow_1.y, f_arrow_1.z + 0.3)
    var f_arrow_1_b = new THREE.Vector3(f_arrow_1.x, f_arrow_1.y, f_arrow_1.z - 0.3)

    if (ForceO1.z > ForceP_B.z) {
        var f_arrow1 = createCylinderArrowMesh(f_arrow_1, f_arrow_1_b, arrow_r, 0.015, 0.035, 0.6);
        var f_arrow1b = createCylinderArrowMesh(f_arrow_1, f_arrow_1_b, arrow_r_outline, 0.02, 0.035, 0.58);
        f_arrow1b.scale.multiplyScalar(1.05);

        force_group.add(f_arrow1);
        force_group.add(f_arrow1b);
    }

    if (ForceO1.z <= ForceP_B.z) {
        var f_arrow1 = createCylinderArrowMesh(f_arrow_1_a, f_arrow_1, arrow_r, 0.015, 0.035, 0.6);
        var f_arrow1b = createCylinderArrowMesh(f_arrow_1_a, f_arrow_1, arrow_r_outline, 0.02, 0.035, 0.58);
        f_arrow1b.scale.multiplyScalar(1.05);

        force_group.add(f_arrow1);
        force_group.add(f_arrow1b);
    }


    //add text

    //Form closing plane

    var TXMeshf1 = create_supports_Text_P("1", FormCP1);
    var TXMeshf2 = create_supports_Text_P("2", FormCP2);
    var TXMeshf3 = create_supports_Text_P("3", FormCP3);
    var TXMeshf4 = create_supports_Text_P("4", FormCP4);
    var TXMeshf5 = create_supports_Text_Normal("ncp", normal_p1p2p3);

    text_closingplane_group.add(TXMeshf1);
    text_closingplane_group.add(TXMeshf2);
    text_closingplane_group.add(TXMeshf3);
    text_closingplane_group.add(TXMeshf4);
    text_closingplane_group.add(TXMeshf5);

    //Form trial closing plane

    //   trial_S1,trial_RP0,trial_LP9,trial_RP9
    // x1_closeP1, x1_closeP2
    // ForceO1_closeP1, ForceO1_closeP2

    var TXMesht1 = create_trial_Text_P_2("1''", trial_LP9);
    var TXMesht2 = create_trial_Text_P_2("2''", trial_RP9);
    var TXMesht3 = create_trial_Text_P_2("3''", trial_RP0);
    var TXMesht4 = create_trial_Text_P_2("4''", trial_S1);
    var TXMesht5 = create_trial_Text_Normal("ncp'", trialnormal_p1p2p3);
    var TXMesht5f = create_trial_Text_Normal("ncp'", x1_closeP2);
    var TXMesht5b = create_trial_Text_Normal("ncs'", trialnormal_SE);
    var TXMesht5c = create_trial_Text_Normal_2d("ncs'", x1_2dcloseP2);
    var TXMesht5d = create_trial_Text_Normal_2d("ncs", x1_2dcloseP22);
    var TXMesht5e = create_trial_Text_Normal_2d("ncs", trialnormal_SE2);
    var TXMesht6 = create_trial_Text_P_2("O''", TrialP_O);
    var TXMesht7 = create_trial_force_x("x", ForceP_BC_mid);

    var TXMesht8 = create_trial_Text_P_2d("O'", TrialP_O2d);
    var TXMesht8b = create_trial_Text_P_2d("O", ForceP_M);
    var TXMesht8c = create_trial_Text_P_2("O", ForceO1);
    var TXMesht8d = create_trial_force_x("x", ForceP_BC_mid);


    var TXMesht5g = create_trial_force_l("l'", x1_closeP1);
    var TXMesht5h = create_trial_force_l("l", ForceO1_closeP1);
    var TXMeshf5i = create_supports_Text_Normal("ncp", ForceO1_closeP2);

    if (ForceO1.z > ForceP_B.z) {
        var TXMesht9 = create_trial_Text_Normal("f1", f_arrow_1_b);
        force_group.add(TXMesht9)
    }

    if (ForceO1.z <= ForceP_B.z) {
        var TXMesht9 = create_trial_Text_Normal("f1", f_arrow_1_a);
        force_group.add(TXMesht9)
    }


    var TXMesht10 = create_trial_Text_Normal("f1", new THREE.Vector3(FormP_3a2a_5_a.x, FormP_3a2a_5_a.y, FormP_3a2a_5_a.z - 0.2));
    text_closingplane_group.add(TXMesht10)


    text_closingplane_trial_group.add(TXMesht1);
    text_closingplane_trial_group.add(TXMesht2);
    text_closingplane_trial_group.add(TXMesht3);
    text_closingplane_trial_group.add(TXMesht4);
    text_closingplane_trial_group.add(TXMesht5);


    text_closingplane_2dtrial_group.add(TXMesht5b);
    text_closingplane_2dtrial_group.add(TXMesht5e);

    text_force_trial_group.add(TXMesht6);
    text_force_trial_group.add(TXMesht8d);
    text_force_trial_group.add(TXMesht5f);
    text_force_trial_group.add(TXMesht5g);
    text_force_trial_group.add(TXMesht5h);
    text_force_trial_group.add(TXMeshf5i);
    text_force_trial_group.add(TXMesht8c);

    text_force_2dtrial_group.add(TXMesht7);
    text_force_2dtrial_group.add(TXMesht8);
    text_force_2dtrial_group.add(TXMesht5c);
    text_force_2dtrial_group.add(TXMesht8b);
    text_force_2dtrial_group.add(TXMesht5d);


    // add force cells

    // var Form_mesh_L1R1 = create_form_tubes_t_1( Force_area_CCB1,max,0.04,Form_LP1,Form_RP1,ForceO1);
    // var Form_mesh_L2R2 = create_form_tubes_t_2( Force_area_CB1CB2,max,0.04,Form_LP2,Form_RP2,ForceO1);
    // var Form_mesh_L3R3 = create_form_tubes_t_3( Force_area_CB2CB3,max,0.04,Form_LP3,Form_RP3,ForceO1);
    // var Form_mesh_L4R4 = create_form_tubes_t_4( Force_area_CB3CBm,max,0.04,Form_LP4,Form_RP4,ForceO1);
    // var Form_mesh_L5R5 = create_form_tubes_t_5( Force_area_CBmBC3,max,0.04,Form_LP5,Form_RP5,ForceO1);
    // var Form_mesh_L6R6 = create_form_tubes_t_6( Force_area_BC3BC2,max,0.04,Form_LP6,Form_RP6,ForceO1);
    // var Form_mesh_L7R7 = create_form_tubes_t_7( Force_area_BC2BC1,max,0.04,Form_LP7,Form_RP7,ForceO1);
    // var Form_mesh_L8R8 = create_form_tubes_t_8( Force_area_BC1B,max,0.04,Form_LP8,Form_RP8,ForceO1);

    // left cell 1 & right cell 1

    var force_cell_face_NC = create_force_cell_face1(Force_area_NC, max, ForceP_N, ForceP_C, ForceP_CB_1, ForceO1, foffset2.l)
    var force_cell_face_NCB1 = create_force_cell_face1(Force_area_NCB1, max, ForceP_N, ForceP_CB_1, ForceP_C, ForceO1, foffset2.l)
    var force_cell_face_NCCB1 = create_force_cell_apply(ForceP_N, ForceP_CB_1, ForceP_C, ForceO1, foffset2.l)
    var force_cell_face_CCB1_N = create_force_cell_face_t_1(Force_area_CCB1, max, ForceP_C, ForceP_CB_1, ForceP_N, ForceO1, foffset2.l)

    var force_cell_face_MC = create_force_cell_face1(Force_area_MC, max, ForceP_M, ForceP_C, ForceP_CB_1, ForceO1, foffset2.l)
    var force_cell_face_MCB1 = create_force_cell_face1(Force_area_MCB1, max, ForceP_M, ForceP_CB_1, ForceP_C, ForceO1, foffset2.l)
    var force_cell_face_MCCB1 = create_force_cell_apply(ForceP_M, ForceP_CB_1, ForceP_C, ForceO1, foffset2.l)
    var force_cell_face_CCB1_M = create_force_cell_face_t_1(Force_area_CCB1, max, ForceP_C, ForceP_CB_1, ForceP_M, ForceO1, foffset2.l)


    force_cell.add(force_cell_face_NC)
    force_cell.add(force_cell_face_NCB1)
    force_cell.add(force_cell_face_NCCB1)
    force_cell.add(force_cell_face_CCB1_N)

    force_cell.add(force_cell_face_MC)
    force_cell.add(force_cell_face_MCB1)
    force_cell.add(force_cell_face_MCCB1)
    force_cell.add(force_cell_face_CCB1_M)

    // left cell 2 & right cell 2

    var force_cell_face_NCB1 = create_force_cell_face1(Force_area_NCB1, max, ForceP_N, ForceP_CB_1, ForceP_CB_2, ForceO1, foffset2.l)
    var force_cell_face_NCB2 = create_force_cell_face1(Force_area_NCB2, max, ForceP_N, ForceP_CB_2, ForceP_CB_1, ForceO1, foffset2.l)
    var force_cell_face_NCB1CB2 = create_force_cell_apply(ForceP_N, ForceP_CB_1, ForceP_CB_2, ForceO1, foffset2.l)
    var force_cell_face_CB1CB2_N = create_force_cell_face_t_2(Force_area_CB1CB2, max, ForceP_CB_1, ForceP_CB_2, ForceP_N, ForceO1, foffset2.l)

    var force_cell_face_MCB1 = create_force_cell_face1(Force_area_MCB1, max, ForceP_M, ForceP_CB_1, ForceP_CB_2, ForceO1, foffset2.l)
    var force_cell_face_MCB2 = create_force_cell_face1(Force_area_MCB2, max, ForceP_M, ForceP_CB_2, ForceP_CB_1, ForceO1, foffset2.l)
    var force_cell_face_MCB1CB2 = create_force_cell_apply(ForceP_M, ForceP_CB_1, ForceP_CB_2, ForceO1, foffset2.l)
    var force_cell_face_CB1CB2_M = create_force_cell_face_t_2(Force_area_CB1CB2, max, ForceP_CB_1, ForceP_CB_2, ForceP_M, ForceO1, foffset2.l)


    force_cell.add(force_cell_face_NCB1)
    force_cell.add(force_cell_face_NCB2)
    force_cell.add(force_cell_face_NCB1CB2)
    force_cell.add(force_cell_face_CB1CB2_N)

    force_cell.add(force_cell_face_MCB1)
    force_cell.add(force_cell_face_MCB2)
    force_cell.add(force_cell_face_MCB1CB2)
    force_cell.add(force_cell_face_CB1CB2_M)

    // left cell 3 & right cell 3

    var force_cell_face_NCB2 = create_force_cell_face1(Force_area_NCB2, max, ForceP_N, ForceP_CB_2, ForceP_CB_3, ForceO1, foffset2.l)
    var force_cell_face_NCB3 = create_force_cell_face1(Force_area_NCB3, max, ForceP_N, ForceP_CB_3, ForceP_CB_2, ForceO1, foffset2.l)
    var force_cell_face_NCB2CB3 = create_force_cell_apply(ForceP_N, ForceP_CB_2, ForceP_CB_3, ForceO1, foffset2.l)
    var force_cell_face_CB2CB3_N = create_force_cell_face_t_3(Force_area_CB2CB3, max, ForceP_CB_2, ForceP_CB_3, ForceP_N, ForceO1, foffset2.l)

    var force_cell_face_MCB2 = create_force_cell_face1(Force_area_MCB2, max, ForceP_M, ForceP_CB_2, ForceP_CB_3, ForceO1, foffset2.l)
    var force_cell_face_MCB3 = create_force_cell_face1(Force_area_MCB3, max, ForceP_M, ForceP_CB_3, ForceP_CB_2, ForceO1, foffset2.l)
    var force_cell_face_MCB2CB3 = create_force_cell_apply(ForceP_M, ForceP_CB_2, ForceP_CB_3, ForceO1, foffset2.l)
    var force_cell_face_CB2CB3_M = create_force_cell_face_t_3(Force_area_CB2CB3, max, ForceP_CB_2, ForceP_CB_3, ForceP_M, ForceO1, foffset2.l)

    force_cell.add(force_cell_face_NCB2)
    force_cell.add(force_cell_face_NCB3)
    force_cell.add(force_cell_face_NCB2CB3)
    force_cell.add(force_cell_face_CB2CB3_N)

    force_cell.add(force_cell_face_MCB2)
    force_cell.add(force_cell_face_MCB3)
    force_cell.add(force_cell_face_MCB2CB3)
    force_cell.add(force_cell_face_CB2CB3_M)

    // left cell 4 & right cell 4

    var force_cell_face_NCB3 = create_force_cell_face1(Force_area_NCB3, max, ForceP_N, ForceP_CB_3, ForceP_BC_mid, ForceO1, foffset2.l)
    var force_cell_face_NCBm = create_force_cell_face1(Force_area_NBCm, max, ForceP_N, ForceP_BC_mid, ForceP_CB_3, ForceO1, foffset2.l)
    var force_cell_face_NCB3CBm = create_force_cell_apply(ForceP_N, ForceP_CB_3, ForceP_BC_mid, ForceO1, foffset2.l)
    var force_cell_face_CB3BCm_N = create_force_cell_face_t_4(Force_area_CB3CBm, max, ForceP_CB_3, ForceP_BC_mid, ForceP_N, ForceO1, foffset2.l)

    var force_cell_face_MCB3 = create_force_cell_face1(Force_area_MCB3, max, ForceP_M, ForceP_CB_3, ForceP_BC_mid, ForceO1, foffset2.l)
    var force_cell_face_MCBm = create_force_cell_face1(Force_area_MBCm, max, ForceP_M, ForceP_BC_mid, ForceP_CB_3, ForceO1, foffset2.l)
    var force_cell_face_MCB3CBm = create_force_cell_apply(ForceP_M, ForceP_CB_3, ForceP_BC_mid, ForceO1, foffset2.l)
    var force_cell_face_CB3BCm_M = create_force_cell_face_t_4(Force_area_CB3CBm, max, ForceP_CB_3, ForceP_BC_mid, ForceP_M, ForceO1, foffset2.l)


    force_cell.add(force_cell_face_NCB3)
    force_cell.add(force_cell_face_NCBm)
    force_cell.add(force_cell_face_NCB3CBm)
    force_cell.add(force_cell_face_CB3BCm_N)

    force_cell.add(force_cell_face_MCB3)
    force_cell.add(force_cell_face_MCBm)
    force_cell.add(force_cell_face_MCB3CBm)
    force_cell.add(force_cell_face_CB3BCm_M)

    // left cell 5 & right cell 5

    var force_cell_face_NBCm = create_force_cell_face1(Force_area_NBCm, max, ForceP_N, ForceP_BC_mid, ForceP_BC_3, ForceO1, foffset2.l)
    var force_cell_face_NBC3 = create_force_cell_face1(Force_area_NBC3, max, ForceP_N, ForceP_BC_3, ForceP_BC_mid, ForceO1, foffset2.l)
    var force_cell_face_NBCmBC3 = create_force_cell_apply(ForceP_N, ForceP_BC_mid, ForceP_BC_3, ForceO1, foffset2.l)
    var force_cell_face_BCmBC3_N = create_force_cell_face_t_5(Force_area_CBmBC3, max, ForceP_BC_mid, ForceP_BC_3, ForceP_N, ForceO1, foffset2.l)

    var force_cell_face_MBCm = create_force_cell_face1(Force_area_MBCm, max, ForceP_M, ForceP_BC_mid, ForceP_BC_3, ForceO1, foffset2.l)
    var force_cell_face_MBC3 = create_force_cell_face1(Force_area_MBC3, max, ForceP_M, ForceP_BC_3, ForceP_BC_mid, ForceO1, foffset2.l)
    var force_cell_face_MBCmBC3 = create_force_cell_apply(ForceP_M, ForceP_BC_mid, ForceP_BC_3, ForceO1, foffset2.l)
    var force_cell_face_BCmBC3_M = create_force_cell_face_t_5(Force_area_CBmBC3, max, ForceP_BC_mid, ForceP_BC_3, ForceP_M, ForceO1, foffset2.l)

    force_cell.add(force_cell_face_NBCm)
    force_cell.add(force_cell_face_NBC3)
    force_cell.add(force_cell_face_NBCmBC3)
    force_cell.add(force_cell_face_BCmBC3_N)

    force_cell.add(force_cell_face_MBCm)
    force_cell.add(force_cell_face_MBC3)
    force_cell.add(force_cell_face_MBCmBC3)
    force_cell.add(force_cell_face_BCmBC3_M)

    // left cell 6 & right cell 6

    var force_cell_face_NBC3 = create_force_cell_face1(Force_area_NBC3, max, ForceP_N, ForceP_BC_3, ForceP_BC_2, ForceO1, foffset2.l)
    var force_cell_face_NBC2 = create_force_cell_face1(Force_area_NBC2, max, ForceP_N, ForceP_BC_2, ForceP_BC_3, ForceO1, foffset2.l)
    var force_cell_face_NBC3BC2 = create_force_cell_apply(ForceP_N, ForceP_BC_3, ForceP_BC_2, ForceO1, foffset2.l)
    var force_cell_face_BC3BC2_N = create_force_cell_face_t_6(Force_area_BC3BC2, max, ForceP_BC_3, ForceP_BC_2, ForceP_N, ForceO1, foffset2.l)

    var force_cell_face_MBC3 = create_force_cell_face1(Force_area_MBC3, max, ForceP_M, ForceP_BC_3, ForceP_BC_2, ForceO1, foffset2.l)
    var force_cell_face_MBC2 = create_force_cell_face1(Force_area_MBC2, max, ForceP_M, ForceP_BC_2, ForceP_BC_3, ForceO1, foffset2.l)
    var force_cell_face_MBC3BC2 = create_force_cell_apply(ForceP_M, ForceP_BC_3, ForceP_BC_2, ForceO1, foffset2.l)
    var force_cell_face_BC3BC2_M = create_force_cell_face_t_6(Force_area_BC3BC2, max, ForceP_BC_3, ForceP_BC_2, ForceP_M, ForceO1, foffset2.l)

    force_cell.add(force_cell_face_NBC3)
    force_cell.add(force_cell_face_NBC2)
    force_cell.add(force_cell_face_NBC3BC2)
    force_cell.add(force_cell_face_BC3BC2_N)

    force_cell.add(force_cell_face_MBC3)
    force_cell.add(force_cell_face_MBC2)
    force_cell.add(force_cell_face_MBC3BC2)
    force_cell.add(force_cell_face_BC3BC2_M)

    // left cell 7 & right cell 7

    var force_cell_face_NBC2 = create_force_cell_face1(Force_area_NBC2, max, ForceP_N, ForceP_BC_2, ForceP_BC_1, ForceO1, foffset2.l)
    var force_cell_face_NBC1 = create_force_cell_face1(Force_area_NBC1, max, ForceP_N, ForceP_BC_1, ForceP_BC_2, ForceO1, foffset2.l)
    var force_cell_face_NBC2BC1 = create_force_cell_apply(ForceP_N, ForceP_BC_2, ForceP_BC_1, ForceO1, foffset2.l)
    var force_cell_face_BC2BC1_N = create_force_cell_face_t_7(Force_area_BC2BC1, max, ForceP_BC_2, ForceP_BC_1, ForceP_N, ForceO1, foffset2.l)

    var force_cell_face_MBC2 = create_force_cell_face1(Force_area_MBC2, max, ForceP_M, ForceP_BC_2, ForceP_BC_1, ForceO1, foffset2.l)
    var force_cell_face_MBC1 = create_force_cell_face1(Force_area_MBC1, max, ForceP_M, ForceP_BC_1, ForceP_BC_2, ForceO1, foffset2.l)
    var force_cell_face_MBC2BC1 = create_force_cell_apply(ForceP_M, ForceP_BC_2, ForceP_BC_1, ForceO1, foffset2.l)
    var force_cell_face_BC2BC1_M = create_force_cell_face_t_7(Force_area_BC2BC1, max, ForceP_BC_2, ForceP_BC_1, ForceP_M, ForceO1, foffset2.l)

    force_cell.add(force_cell_face_NBC2)
    force_cell.add(force_cell_face_NBC1)
    force_cell.add(force_cell_face_NBC2BC1)
    force_cell.add(force_cell_face_BC2BC1_N)

    force_cell.add(force_cell_face_MBC2)
    force_cell.add(force_cell_face_MBC1)
    force_cell.add(force_cell_face_MBC2BC1)
    force_cell.add(force_cell_face_BC2BC1_M)

    // left cell 8 & right cell 8

    var force_cell_face_NBC1 = create_force_cell_face1(Force_area_NBC1, max, ForceP_N, ForceP_BC_1, ForceP_B, ForceO1, foffset2.l)
    var force_cell_face_NB = create_force_cell_face1(Force_area_NB, max, ForceP_N, ForceP_B, ForceP_BC_1, ForceO1, foffset2.l)
    var force_cell_face_NBC1B = create_force_cell_apply(ForceP_N, ForceP_BC_1, ForceP_B, ForceO1, foffset2.l)
    var force_cell_face_BC1B_N = create_force_cell_face_t_8(Force_area_BC1B, max, ForceP_BC_1, ForceP_B, ForceP_N, ForceO1, foffset2.l)

    var force_cell_face_MBC1 = create_force_cell_face1(Force_area_MBC1, max, ForceP_M, ForceP_BC_1, ForceP_B, ForceO1, foffset2.l)
    var force_cell_face_MB = create_force_cell_face1(Force_area_MB, max, ForceP_M, ForceP_B, ForceP_BC_1, ForceO1, foffset2.l)
    var force_cell_face_MBC1B = create_force_cell_apply(ForceP_M, ForceP_BC_1, ForceP_B, ForceO1, foffset2.l)
    var force_cell_face_BC1B_M = create_force_cell_face_t_8(Force_area_BC1B, max, ForceP_BC_1, ForceP_B, ForceP_M, ForceO1, foffset2.l)

    force_cell.add(force_cell_face_NBC1)
    force_cell.add(force_cell_face_NB)
    force_cell.add(force_cell_face_NBC1B)
    force_cell.add(force_cell_face_BC1B_N)

    force_cell.add(force_cell_face_MBC1)
    force_cell.add(force_cell_face_MB)
    force_cell.add(force_cell_face_MBC1B)
    force_cell.add(force_cell_face_BC1B_M)


    // testing on / off

    //3d trial
    for (i = 0; i <= 4; i++) {
        text_closingplane_trial_group.children[i].visible = false;
    }

    for (i = 0; i <= 6; i++) {
        text_force_trial_group.children[i].visible = false;
    }


    //   for(i=0;i<=4;i++){
    //     form_trial.children[i].material.visible=false;
    //   }

    form_trial.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = false;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = false;
        }
    });

    trial_force.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = false;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = false;
        }
    });

    // 2d trial

    for (i = 0; i <= 1; i++) {
        text_closingplane_2dtrial_group.children[i].visible = false;
    }

    for (i = 0; i <= 4; i++) {
        text_force_2dtrial_group.children[i].visible = false;
    }

    trial_form_2d.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = false;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = false;
        }
    });

    trial_force_2d.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = false;
        }
        if (obj.type === "LineSegments") {
            obj.material.visible = false;
        }
    });

    // force cell

    force_cell.traverse(function (obj) {
        if (obj.type === "Mesh") {
            obj.material.visible = false;
        }

    });


    //     const curve = new THREE.CatmullRomCurve3( [
    //     	new THREE.Vector3( -10, 0, 10 ),
    //     	new THREE.Vector3( -5, 5, 5 ),
    //     	new THREE.Vector3( 0, 0, 0 ),
    //     	new THREE.Vector3( 5, -5, 5 ),
    //     	new THREE.Vector3( 10, 0, 10 )
    //     ] );

    //     const points = curve.getPoints(7);
    //     const cgeometry = new THREE.BufferGeometry().setFromPoints( points );

    //     const cmaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    //     // Create the final object to add to the scene
    //     const curveObject = new THREE.Line( cgeometry, cmaterial );

    //     for(i=0;i<=6;i++){

    //         var line_test = [];
    //         line_test.push(points[i]);
    //         line_test.push(FormP_1a);
    //         var line_testd = new THREE.Geometry().setFromPoints( line_test );

    //         var applyline_1 = new THREE.LineDashedMaterial({
    //                      color: "black",//color
    //                      dashSize: 0.2,
    //                     gapSize: 0.03,
    //                     linewidth: 1

    //                      });

    //         var applylineox12dt = new THREE.LineSegments(line_testd,applyline_1);
    //         applylineox12dt.computeLineDistances();//compute
    //         form_group.add(applylineox12dt);

    //   }

    //     // var line_testd = new THREE.Geometry().setFromPoints( line_test );

    //     // var applyline_1 = new THREE.LineDashedMaterial({
    //     //              color: "black",//color
    //     //              dashSize: 0.2,
    //     //             gapSize: 0.03,
    //     //             linewidth: 1

    //     //              });

    //     // var applylineox12dt = new THREE.LineSegments(line_testd,applyline_1);
    //     // applylineox12dt.computeLineDistances();//compute
    //     // form_group.add(applylineox12dt);


    // testing cell function

    function create_force_cell_apply(point1, point2, point3, point4, scale) {

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);


        var scale_point3 = new THREE.Vector3(centroid.x + (point3.x - centroid.x) * scale, centroid.y + (point3.y - centroid.y) * scale, centroid.z + (point3.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point3
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();
        var material_step_1 = [
            //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
            new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
            new THREE.MeshPhongMaterial({
                color: 0x009600, side: THREE.DoubleSide
            })
        ];

        var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
        force_cell.children[0].castShadow = true;
        return force_cell

    }

    //        if(PointO.z<=ForceP_B.z & cp4.z>0)

    function create_force_cell_face1(face_area, face_area_max, point1, point2, point3, point4, scale) {
        var form_mesh = face_area / face_area_max

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);

        var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point4
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        if (ForceO1.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x5B84AE, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x376D9B, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x05416D, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x0F3150, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        } else if (ForceO1.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 & form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        return force_cell


    }

    function create_force_cell_face_t_1(face_area, face_area_max, point1, point2, point3, point4, scale) {
        var form_mesh = face_area / face_area_max

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);

        var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point4
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        if (ForceO1.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x5B84AE, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x376D9B, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x05416D, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x0F3150, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z & cp4.z <= 0 && dis1a >= dis1b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        return force_cell


    }

    function create_force_cell_face_t_2(face_area, face_area_max, point1, point2, point3, point4, scale) {
        var form_mesh = face_area / face_area_max

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);

        var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point4
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        if (ForceO1.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x5B84AE, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x376D9B, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x05416D, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x0F3150, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z & cp4.z <= 0 && dis2a >= dis2b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        return force_cell


    }


    function create_force_cell_face_t_3(face_area, face_area_max, point1, point2, point3, point4, scale) {
        var form_mesh = face_area / face_area_max

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);

        var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point4
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        if (ForceO1.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x5B84AE, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 & form_mesh >= 0.25) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x376D9B, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x05416D, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x0F3150, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z & cp4.z <= 0 && dis3a >= dis3b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        return force_cell


    }


    function create_force_cell_face_t_4(face_area, face_area_max, point1, point2, point3, point4, scale) {
        var form_mesh = face_area / face_area_max

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);

        var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point4
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        if (ForceO1.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x5B84AE, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x376D9B, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x05416D, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x0F3150, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z & cp4.z <= 0 && dis4a >= dis4b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        return force_cell


    }


    function create_force_cell_face_t_5(face_area, face_area_max, point1, point2, point3, point4, scale) {
        var form_mesh = face_area / face_area_max

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);

        var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point4
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        if (ForceO1.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x5B84AE, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x376D9B, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x05416D, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x0F3150, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z & cp4.z <= 0 && dis8a >= dis8b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        return force_cell


    }


    function create_force_cell_face_t_6(face_area, face_area_max, point1, point2, point3, point4, scale) {
        var form_mesh = face_area / face_area_max

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);

        var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point4
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        if (ForceO1.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x5B84AE, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x376D9B, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x05416D, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x0F3150, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z & cp4.z <= 0 && dis7a >= dis7b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        return force_cell


    }


    function create_force_cell_face_t_7(face_area, face_area_max, point1, point2, point3, point4, scale) {
        var form_mesh = face_area / face_area_max

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);

        var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point4
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        if (ForceO1.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x5B84AE, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x376D9B, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x05416D, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x0F3150, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z & cp4.z <= 0 && dis6a >= dis6b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        return force_cell


    }


    function create_force_cell_face_t_8(face_area, face_area_max, point1, point2, point3, point4, scale) {
        var form_mesh = face_area / face_area_max

        var centroid = new THREE.Vector3((point1.x + point2.x + point3.x + point4.x) / 4, (point1.y + point2.y + point3.y + point4.y) / 4, (point1.z + point2.z + point3.z + point4.z) / 4);


        var scale_point1 = new THREE.Vector3(centroid.x + (point1.x - centroid.x) * scale, centroid.y + (point1.y - centroid.y) * scale, centroid.z + (point1.z - centroid.z) * scale);


        var scale_point2 = new THREE.Vector3(centroid.x + (point2.x - centroid.x) * scale, centroid.y + (point2.y - centroid.y) * scale, centroid.z + (point2.z - centroid.z) * scale);

        var scale_point4 = new THREE.Vector3(centroid.x + (point4.x - centroid.x) * scale, centroid.y + (point4.y - centroid.y) * scale, centroid.z + (point4.z - centroid.z) * scale);

        var vertices = [
            scale_point1, scale_point2, scale_point4
        ];

        var faces = [
            new THREE.Face3(0, 1, 2),

        ];

        var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();

        if (ForceO1.z <= ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x5B84AE, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x376D9B, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x05416D, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {

                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x0F3150, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z > ForceP_B.z) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z && cp4.z > 0) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        if (ForceO1.z <= ForceP_B.z & cp4.z <= 0 && dis5a >= dis5b) {

            if (form_mesh < 0.25 && form_mesh >= 0) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xD72F62, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.5 && form_mesh >= 0.25) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0xCC0549, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh < 0.75 && form_mesh >= 0.5) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x940041, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }

            if (form_mesh >= 0.75) {
                var material_step_1 = [
                    //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
                    new THREE.MeshPhongMaterial({
                        color: 0x80002F, depthWrite: false, side: THREE.DoubleSide
                    })
                ];
                var force_cell = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_1);
            }
        }

        return force_cell


    }

    function create_trial_intec(startpoint, forceP1, forceP2, forceP3, intecP1, intecP1B) {

        var startpoint

        var trial_startpoint_vec = Cal_Vec_2(forceP1, forceP2, forceP3, 0.5);
        var trial_startpoint_intec_temp = new THREE.Vector3(startpoint.x - 1.2 * trial_startpoint_vec.x, startpoint.y - 1.2 * trial_startpoint_vec.y, startpoint.z - 1.2 * trial_startpoint_vec.z);

        var dirtsP = new THREE.Vector3(); // create once an reuse it

        dirtsP.subVectors(startpoint, trial_startpoint_intec_temp).normalize();

        var dirto = new THREE.Vector3(); // create once an reuse it

        dirto.subVectors(intecP1, intecP1B).normalize();

        return LinesSectPt(dirtsP, startpoint, dirto, intecP1)

    }

    function createdashline(point1, point2) {

        var dashline = [];
        dashline.push(point1);
        dashline.push(point2);


        var dashline_geo = new THREE.Geometry().setFromPoints(dashline);

        var trialline_dash = new THREE.LineDashedMaterial({
            color: "black",//color
            dashSize: 0.1,
            gapSize: 0.03,
            linewidth: 1

        });

        var dashline_edges = new THREE.LineSegments(dashline_geo, trialline_dash);
        dashline_edges.computeLineDistances();//compute
        return dashline_edges
    }

    function createdashline_2d_trial(point1, point2) {

        var dashline = [];
        dashline.push(point1);
        dashline.push(point2);


        var dashline_geo = new THREE.Geometry().setFromPoints(dashline);

        var trialline_dash = new THREE.LineDashedMaterial({
            color: "grey",//color
            dashSize: 0.1,
            gapSize: 0.03,
            linewidth: 1

        });

        var dashline_edges = new THREE.LineSegments(dashline_geo, trialline_dash);
        dashline_edges.computeLineDistances();//compute
        return dashline_edges
    }


    function createline(point1, point2) {

        var line = [];
        line.push(point1);
        line.push(point2);


        var line_geo = new THREE.Geometry().setFromPoints(line);

        var trialline = new THREE.LineBasicMaterial({
            color: "black",
            linewidth: 1

        });

        var line_edges = new THREE.LineSegments(line_geo, trialline);
        line_edges.computeLineDistances();//compute
        return line_edges
    }

    function Cal_Vec_2(vec1, vec2, vec3, n) {

        var cb = new THREE.Vector3(), ab = new THREE.Vector3(), normal = new THREE.Vector3();
        cb.subVectors(vec1, vec2);
        ab.subVectors(vec3, vec2);
        ab.cross(cb);
        normal.copy(ab).normalize();

        return new THREE.Vector3(n * normal.x, n * normal.y, n * normal.z);
    }


    //define function mesh IntersectPoint
    function Cal_Plane_Line_Intersect_Point(Point_online, LineVec, Point_onPlane, PlaneVec) {

        return new THREE.Vector3(
            //x
            Point_online.x + LineVec.x * ((Point_onPlane.x - Point_online.x) * PlaneVec.x + (Point_onPlane.y - Point_online.y) * PlaneVec.y + (Point_onPlane.z - Point_online.z) * PlaneVec.z) / (PlaneVec.x * LineVec.x + PlaneVec.y * LineVec.y + PlaneVec.z * LineVec.z),
            //y
            Point_online.y + LineVec.y * ((Point_onPlane.x - Point_online.x) * PlaneVec.x + (Point_onPlane.y - Point_online.y) * PlaneVec.y + (Point_onPlane.z - Point_online.z) * PlaneVec.z) / (PlaneVec.x * LineVec.x + PlaneVec.y * LineVec.y + PlaneVec.z * LineVec.z),
            //z
            Point_online.z + LineVec.z * ((Point_onPlane.x - Point_online.x) * PlaneVec.x + (Point_onPlane.y - Point_online.y) * PlaneVec.y + (Point_onPlane.z - Point_online.z) * PlaneVec.z) / (PlaneVec.x * LineVec.x + PlaneVec.y * LineVec.y + PlaneVec.z * LineVec.z));
    }


    var newSphereTest2 = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 0.12);
    var newPointClose = newSphereTest2.clampPoint(new THREE.Vector3(1, 1, 0));

    var newSphereTest2_1 = new THREE.Sphere(new THREE.Vector3(1, 1, 0), 0.12);
    var newPointClose2 = newSphereTest2_1.clampPoint(new THREE.Vector3(0, 0, 0));

    // var newPointClose2 = newSphereTest.clampPoint(new THREE.Vector3(TubePoints3[1].x,TubePoints3[1].y,TubePoints3[1].z));
    // var newPointClose3 = newSphereTest.clampPoint(new THREE.Vector3(TubePoints4[1].x,TubePoints4[1].y,TubePoints4[1].z));

    var newsp = new THREE.SphereGeometry(0.05);
    var new_sp_1 = new THREE.Mesh(newsp, material);
    var new_sp_2 = new THREE.Mesh(newsp, material);
    // var new_sp3 = new THREE.Mesh(newsp, material);

    new_sp_1.position.copy(new THREE.Vector3(newPointClose.x, newPointClose.y, newPointClose.z));
    new_sp_2.position.copy(new THREE.Vector3(newPointClose2.x, newPointClose2.y, newPointClose2.z));
    // new_sp3.position.copy(new THREE.Vector3(newPointClose3.x, newPointClose3.y,newPointClose3.z));

    step_group_1.add(new_sp_1);
    step_group_1.add(new_sp_2);
    // step_group_1.add(new_sp3);

    var newtubeMesh1_1 = createCylinderMesh(newPointClose2, newPointClose, material, 0.05, 0.05);
    // var newtubeMesh2=createCylinderMesh(TubePoints3[1],newPointClose2,material,0.05,0.05);
    // var newtubeMesh3=createCylinderMesh(TubePoints4[1],newPointClose3,material,0.05,0.05);
    step_group_1.add(newtubeMesh1_1);
    // step_group_1.add(newtubeMesh2);
    // step_group_1.add(newtubeMesh3);


    var SphereTest = new THREE.Sphere(new THREE.Vector3(TubePoints1[0].x, TubePoints1[0].y, TubePoints1[0].z), 0.07);
    var PointClose1 = SphereTest.clampPoint(TubePoints2[1]);
    var SphereTest2 = new THREE.Sphere(PointClose1, 0.05);
    var PointClose2 = SphereTest2.clampPoint(TubePoints2[1]);
    var arrow_apply_1 = new THREE.MeshPhongMaterial({
        color: 0x009600//green
    });


    var SphereTest4 = new THREE.Sphere(new THREE.Vector3(TubePoints1[0].x, TubePoints1[0].y, TubePoints1[0].z), 0.75);
    var PointClose3 = SphereTest4.clampPoint(TubePoints1[1]);
    createCylinderMesh(PointClose3, TubePoints1[1], arrow_apply_1, 0.01, 0.01);
    //Tube_group.add(tubeMesh_apply_1);
    var apply_1 = [];
    apply_1.push(new THREE.Vector3(0, 0, -1.5));
    apply_1.push(TubePoints1[1]);

    var apply_2 = [];
    apply_2.push(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints1[1].z));
    apply_2.push(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, -1.5));

    var apply_3 = [];
    apply_3.push(new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints1[1].z));
    apply_3.push(new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, -1.5));

    var apply_4 = [];
    apply_4.push(new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints1[1].z));
    apply_4.push(new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, -1.5));

    var apply_1_geo = new THREE.Geometry().setFromPoints(apply_1);

    var apply_2_geo = new THREE.Geometry().setFromPoints(apply_2);

    var apply_3_geo = new THREE.Geometry().setFromPoints(apply_3);

    var apply_4_geo = new THREE.Geometry().setFromPoints(apply_4);

    var applyline_1 = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.2,
        gapSize: 0.03,
        linewidth: 1

    });

    var applyline = new THREE.LineSegments(apply_1_geo, applyline_1);
    applyline.computeLineDistances();//compute
    step_group_1.add(applyline);

    var applyline2 = new THREE.LineSegments(apply_2_geo, applyline_1);
    applyline2.computeLineDistances();//compute
    step_group_1.add(applyline2);

    var applyline3 = new THREE.LineSegments(apply_3_geo, applyline_1);
    applyline3.computeLineDistances();//compute
    step_group_1.add(applyline3);


    var applyline4 = new THREE.LineSegments(apply_4_geo, applyline_1);
    applyline4.computeLineDistances();//compute
    step_group_1.add(applyline4);


    //    var tubeMesh_pj_1=createCylinderMesh(new THREE.Vector3(TubePoints2[1].x,TubePoints2[1].y,TubePoints1[1].z),TubePoints2[1],arrow_apply_1,0.004,0.004);
    //    Tube_group.add(tubeMesh_pj_1);
    //    var tubeMesh_pj_2=createCylinderMesh(new THREE.Vector3(TubePoints2[1].x,TubePoints2[1].y,TubePoints1[1].z),TubePoints1[1],arrow_apply_1,0.004,0.004);
    //    Tube_group.add(tubeMesh_pj_2);
    //    var tubeMesh_pj_3=createCylinderMesh(TubePoints2[1],new THREE.Vector3(0,0,TubePoints2[1].z),arrow_apply_1,0.004,0.004);
    //    Tube_group.add(tubeMesh_pj_3);
    //    var tubeMesh_pj_4=createCylinderMesh(TubePoints2[0],new THREE.Vector3(0,0,TubePoints2[1].z),arrow_apply_1,0.004,0.004);
    //    Tube_group.add(tubeMesh_pj_4);

    var vertices = [
        TubePoints2[1], TubePoints3[1], TubePoints4[1]
    ];

    var faces = [
        new THREE.Face3(0, 1, 2),


    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();
    var material_step_1 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: false, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: "black", transparent: true, opacity: 0.3, side: THREE.DoubleSide
        })
    ];

    var cb = new THREE.Vector3(),
        ab = new THREE.Vector3(),
        normal1 = new THREE.Vector3();
    cb.subVectors(TubePoints2[1], TubePoints4[1]);
    ab.subVectors(TubePoints4[1], TubePoints3[1]);
    normal1 = cb.cross(ab);

    //normal1.copy(cb).normalize();

    function distanceVector(v1, v2) {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        var dz = v1.z - v2.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    var l1 = distanceVector(P_D, normal1);
    var flength = flen.l

    var nn = new THREE.Vector3(P_D.x + (normal1.x - P_D.x) * flength / l1, P_D.y + (normal1.y - P_D.y) * flength / l1, P_D.z + (normal1.z - P_D.z) * flength / l1);
    var step1_arr2 = new THREE.MeshPhongMaterial({color: "darkblue"});
    var step1_arr3 = new THREE.MeshPhongMaterial({color: "red"});

    createCylinderArrowMesh(P_D, nn, step1_arr2, 0.01, 0.02, 0.6);
    //step_group_1_1.add(spacedivide_geo1a1);

    L = 3;//scale

    Cal_ForcesPnt();
    Force_move();

    P_A_Right = Pnt_copy(P_A);
    P_B_Right = Pnt_copy(P_B);
    P_C_Right = Pnt_copy(P_C);
    P_D_Right = Pnt_copy(P_D);


    var vertices = [
        P_A_Right, P_B_Right, P_C_Right, nn
    ];

    var faces = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(2, 3, 1)
    ];


    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();


    var hex = 0x009600;
    geom.faces[0].color.setHex(hex);


    for (i = 1; i < geom.faces.length; i++) {

        var hex1 = 0x0F3150;
        geom.faces[i].color.setHex(hex1);
    }

    var materials = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "lightgrey", wireframe: true, transparent: true, opacity: 0.001}),
        new THREE.MeshLambertMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    ];


    mesht = THREE.SceneUtils.createMultiMaterialObject(geom, materials);

    mesht.children[0].castShadow = true;
    mesht.children[0].receiveShadow = false;

    // step_group_1_1.add(mesht);
    var P_tr = new THREE.Vector3(1, 1, -1.8)

    var material = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});
    var trGeom0 = new THREE.SphereGeometry(0.02);
    var tr_Tube0 = new THREE.Mesh(trGeom0, material);


    tr_Tube0.name = "sp5";
    tr_Tube0.position.copy(P_tr);
    tr_Tube0.castShadow = true;

    Ctrl_tubes.push(tr_Tube0);

    //step_group_1_1.add(tr_Tube0);

    var P_tr = new THREE.Vector3(1, 1, -1.8)
    var verticestr = [
        P_A_Right, P_B_Right, P_C_Right, P_tr
    ];

    var facestr = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3),
        new THREE.Face3(0, 1, 3),
        new THREE.Face3(2, 3, 1)
    ];


    var geomtr = new THREE.Geometry();
    geomtr.vertices = verticestr;
    geomtr.faces = facestr;
    geomtr.computeFaceNormals();


    var hex = 0x009600;
    geomtr.faces[0].color.setHex(hex);


    for (i = 1; i < geom.faces.length; i++) {

        var hex1 = 0x0F3150;
        geom.faces[i].color.setHex(hex1);
    }

    var materials = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "black", wireframe: true, transparent: true, opacity: 0.5}),
        new THREE.MeshLambertMaterial({
            vertexColors: THREE.FaceColors,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    ];


    meshtr = THREE.SceneUtils.createMultiMaterialObject(geomtr, materials);

    meshtr.children[0].castShadow = true;
    meshtr.children[0].receiveShadow = false;

    // step_group_1_1.add(meshtr);

    var cb3 = new THREE.Vector3(),
        ab3 = new THREE.Vector3(),
        normal13 = new THREE.Vector3();
    cb3.subVectors(P_A, P_tr);
    ab3.subVectors(P_C, P_tr);
    ab3.cross(cb3);
    normal13.copy(ab3).normalize();

    var nn3 = new THREE.Vector3(0.2 * normal13.x, 0.2 * normal13.y, 0.2 * normal13.z);
    var newP_2 = new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints2[1].z + 1.1);

    var new2 = new THREE.Vector3(newP_2.x - 1.8 * nn3.x, newP_2.y - 1.8 * nn3.y, newP_2.z - 1.8 * nn3.z);
    var dir1_1 = new THREE.Vector3(); // create once an reuse it

    dir1_1.subVectors(newP_2, new2).normalize();

    var dir1_2 = new THREE.Vector3(); // create once an reuse it

    dir1_2.subVectors(TubePoints1[1], TubePoints1[0]).normalize();

    var newPo = LinesSectPt(dir1_1, new2, dir1_2, TubePoints1[0]);

    var trailMaterial = new THREE.MeshBasicMaterial({color: "black", transparent: true, opacity: 0.5});

    createCylinderMesh(newP_2, newPo, trailMaterial, 0.02, 0.02);
    //step_group_1.add(newtubeMesh_tr);

    var cb4 = new THREE.Vector3(),
        ab4 = new THREE.Vector3(),
        normal14 = new THREE.Vector3();
    cb4.subVectors(P_A, P_tr);
    ab4.subVectors(P_B, P_tr);
    ab4.cross(cb4);
    normal14.copy(ab4).normalize();

    var nn4 = new THREE.Vector3(0.2 * normal14.x, 0.2 * normal14.y, 0.2 * normal14.z);

    var new2_2 = new THREE.Vector3(newPo.x - 1.8 * nn4.x, newPo.y - 1.8 * nn4.y, newPo.z - 1.8 * nn4.z);

    var dir2_1 = new THREE.Vector3(); // create once an reuse it

    dir2_1.subVectors(newPo, new2_2).normalize();

    var dir2_2 = new THREE.Vector3(); // create once an reuse it
    var newP_4 = new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints3[1].z + 1.8);


    dir2_2.subVectors(TubePoints3[1], newP_4).normalize();

    var newPo_2 = LinesSectPt(dir2_1, newPo, dir2_2, TubePoints3[1]);

    var trailMaterial = new THREE.MeshBasicMaterial({color: "black", transparent: true, opacity: 0.5});

    createCylinderMesh(newPo_2, newPo, trailMaterial, 0.02, 0.02);
    //step_group_1.add(newtubeMesh_tr2);

    var cb5 = new THREE.Vector3(),
        ab5 = new THREE.Vector3(),
        normal15 = new THREE.Vector3();
    cb5.subVectors(P_C, P_tr);
    ab5.subVectors(P_B, P_tr);
    ab5.cross(cb5);
    normal15.copy(ab5).normalize();

    var nn5 = new THREE.Vector3(0.2 * normal15.x, 0.2 * normal15.y, 0.2 * normal15.z);

    var new2_3 = new THREE.Vector3(newPo.x - 1.8 * nn5.x, newPo.y - 1.8 * nn5.y, newPo.z - 1.8 * nn5.z);

    var dir3_1 = new THREE.Vector3(); // create once an reuse it

    dir3_1.subVectors(newPo, new2_3).normalize();

    var dir3_2 = new THREE.Vector3(); // create once an reuse it
    var newP_5 = new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints4[1].z + 1.8);


    dir3_2.subVectors(TubePoints4[1], newP_5).normalize();

    var newPo_3 = LinesSectPt(dir3_1, newPo, dir3_2, TubePoints4[1]);

    var trailMaterial = new THREE.MeshBasicMaterial({color: "black", transparent: true, opacity: 0.5});

    createCylinderMesh(newPo_3, newPo, trailMaterial, 0.02, 0.02);
    // step_group_1.add(newtubeMesh_tr3);


    var vertices = [
        newP_2, newPo_2, newPo_3
    ];

    var faces = [
        new THREE.Face3(0, 1, 2),
    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();
    var material_step_1 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "black", wireframe: true, transparent: true, opacity: 0.5}),
        new THREE.MeshPhongMaterial({
            color: "black", transparent: true, opacity: 0.2, side: THREE.DoubleSide
        })
    ];

    var facec = new THREE.Vector3((P_A_Right.x + P_B_Right.x + P_C_Right.x) / 3, (P_A_Right.y + P_B_Right.y + P_C_Right.y) / 3, (P_A_Right.z + P_B_Right.z + P_C_Right.z) / 3);

    createCylinderMesh(P_tr, facec, trailMaterial, 0.02, 0.02);
    //step_group_1_1.add(newtubeMesh_tr4);

    var tpoints = [];
    tpoints.push(P_tr);
    tpoints.push(facec);

    var dgeo = new THREE.Geometry().setFromPoints(tpoints);
    var dashline1 = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.2,
        gapSize: 0.03,
        linewidth: 1

    });

    var Dashl = new THREE.LineSegments(dgeo, dashline1);
    Dashl.computeLineDistances();//compute
    // step_group_1_1.add(Dashl);

    var tpoints2 = [];
    tpoints2.push(nn);
    tpoints2.push(facec);

    var dgeo2 = new THREE.Geometry().setFromPoints(tpoints2);
    var dashline1 = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.2,
        gapSize: 0.03,
        linewidth: 1

    });

    var Dashl2 = new THREE.LineSegments(dgeo2, dashline1);
    Dashl2.computeLineDistances();//compute
    //step_group_1_1.add(Dashl2);


    //var cb2 = new THREE.Vector3((nn.x-P_A.x),(nn.y-P_A.y),(nn.z-P_A.z));
    //var ab2 = new THREE.Vector3((P_C.x-P_A.x),(P_C.y-P_A.y),(P_C.z-P_A.z));
    //var normal2 = new THREE.Vector3();

    var cb2 = new THREE.Vector3(),
        ab2 = new THREE.Vector3(),
        normal12 = new THREE.Vector3();
    cb2.subVectors(P_A, nn);
    ab2.subVectors(P_C, nn);
    ab2.cross(cb2);
    normal12.copy(ab2).normalize();

    var nn2 = new THREE.Vector3(0.2 * normal12.x, 0.2 * normal12.y, 0.2 * normal12.z)

    var new1 = new THREE.Vector3(TubePoints2[1].x - 1.8 * nn2.x, TubePoints2[1].y - 1.8 * nn2.y, TubePoints2[1].z - 1.8 * nn2.z);
    var new1_1 = new THREE.Vector3(TubePoints2[1].x + 1.8 * nn2.x, TubePoints2[1].y + 1.8 * nn2.y, TubePoints2[1].z + 1.8 * nn2.z);

    var dir1 = new THREE.Vector3(); // create once an reuse it

    dir1.subVectors(TubePoints2[1], new1).normalize();

    var dir2 = new THREE.Vector3(); // create once an reuse it

    dir2.subVectors(TubePoints1[1], TubePoints1[0]).normalize();

    var arrow_material_outline = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });


    var newP2 = LinesSectPt(dir1, new1, dir2, TubePoints1[0]);

    if (nn.z > P_A.z) {
        createCylinderArrowMesh(TubePoints2[1], new1, step1_arr3, 0.02, 0.04, 0.6)
        var spacedivide_geo1a3_ol = createCylinderArrowMesh(TubePoints2[1], new1, arrow_material_outline, 0.023, 0.04, 0.58)
    }
    if (nn.z < P_A.z) {
        createCylinderArrowMesh(new1_1, TubePoints2[1], step1_arr2, 0.02, 0.04, 0.6)
        var spacedivide_geo1a3_ol = createCylinderArrowMesh(new1_1, TubePoints2[1], arrow_material_outline, 0.023, 0.04, 0.58)
    }

    // step_group_1.add(spacedivide_geo1a3);
    // step_group_1.add(spacedivide_geo1a3_ol);

    spacedivide_geo1a3_ol.scale.multiplyScalar(1.1);

    var material = new THREE.MeshPhongMaterial({color: "lightgrey", transparent: false});

    var spGeom0 = new THREE.SphereGeometry(0.05);
    var new_Tube0 = new THREE.Mesh(spGeom0, material);


    //new_Tube0.name="sp0";
    new_Tube0.position.copy(newP2);
    new_Tube0.castShadow = true;

    Ctrl_tubes.push(sp_Tube0);

    var outlineMaterial1 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMeshnew = new THREE.Mesh(spGeom0, outlineMaterial1);
    outlineMeshnew.position.copy(newP2);
    outlineMeshnew.scale.multiplyScalar(1.55);
    //step_group_1.add( outlineMeshnew );
    //scene.add(text0);
    //text0.position.copy(new THREE.vertices(0.2,0,0));
    //text_group1.add(text0);

    //step_group_1.add(new_Tube0);


    var newSphereTest = new THREE.Sphere(new THREE.Vector3(newP2.x, newP2.y, newP2.z), 0.12);
    var newPointClose = newSphereTest.clampPoint(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints2[1].z));
    var newPointClose2 = newSphereTest.clampPoint(new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints3[1].z));
    var newPointClose3 = newSphereTest.clampPoint(new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints4[1].z));

    var newsp = new THREE.SphereGeometry(0.05);
    var new_sp = new THREE.Mesh(newsp, material);
    var new_sp2 = new THREE.Mesh(newsp, material);
    var new_sp3 = new THREE.Mesh(newsp, material);

    new_sp.position.copy(new THREE.Vector3(newPointClose.x, newPointClose.y, newPointClose.z));
    new_sp2.position.copy(new THREE.Vector3(newPointClose2.x, newPointClose2.y, newPointClose2.z));
    new_sp3.position.copy(new THREE.Vector3(newPointClose3.x, newPointClose3.y, newPointClose3.z));

    // step_group_1.add(new_sp);
    // step_group_1.add(new_sp2);
    // step_group_1.add(new_sp3);

    createCylinderMesh(TubePoints2[1], newPointClose, material, 0.05, 0.05);
    createCylinderMesh(TubePoints3[1], newPointClose2, material, 0.05, 0.05);
    createCylinderMesh(TubePoints4[1], newPointClose3, material, 0.05, 0.05);
    // step_group_1.add(newtubeMesh1);
    // step_group_1.add(newtubeMesh2);
    // step_group_1.add(newtubeMesh3);

    createCylinderArrowMesh(newP2, TubePoints2[1], step1_arr2, 0.01, 0.02, 0.6);
    //step_group_1.add(new_geo1a1);


    var step_1_face_cor1 = new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints1[1].z);
    var step_1_face_cor2 = new THREE.Vector3(0, 0, -1.5);
    var step_1_face_cor3 = new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, -1.5);
    var vertices = [
        step_1_face_cor1, step_1_face_cor3, step_1_face_cor2, TubePoints1[1]
    ];

    var faces = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3),

    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();
    var material_step_1 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: false, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: 0x009600, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    var step_1_face_cor3 = new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints1[1].z);
    var step_1_face_cor4 = new THREE.Vector3(0, 0, -1.5);
    var step_1_face_cor5 = new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, -1.5);
    var vertices = [
        step_1_face_cor3, step_1_face_cor5, step_1_face_cor4, TubePoints1[1]
    ];

    var faces = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3),

    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();
    var material_step_2 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: false, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: 0x009600, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    var step_1_face_2 = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_2);
    step_group_1.add(step_1_face_2);

    var step_1_face_cor5 = new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints1[1].z);
    var step_1_face_cor6 = new THREE.Vector3(0, 0, -1.5);
    var step_1_face_cor7 = new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, -1.5);
    var vertices = [
        step_1_face_cor5, step_1_face_cor7, step_1_face_cor6, TubePoints1[1]
    ];

    var faces = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3),

    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();

    var material_step_3 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: false, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: 0x009600, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false
        })
    ];


    var step_1_face_3 = THREE.SceneUtils.createMultiMaterialObject(geom, material_step_3);
    //          var material_step_3 = new THREE.MeshPhongMaterial({color: 0x009600, transparent: true, opacity:0.3, side: THREE.DoubleSide});
    //          var step_1_face_3 = new THREE.Mesh(geom,material_step_3);
    step_group_1.add(step_1_face_3);

    function roundedCornerLine(points, radius, smoothness, closed) {

        radius = radius !== undefined ? radius : .1;
        smoothness = smoothness !== undefined ? Math.floor(smoothness) : 3;
        closed = closed !== undefined ? closed : false;

        let newGeometry = new THREE.BufferGeometry();

        if (points === undefined) {
            return newGeometry;
        }
        if (points.length < 3) {
            return newGeometry.setFromPoints(points);
        }

        // minimal segment
        let minVector = new THREE.Vector3();
        let minLength = minVector.subVectors(points[0], points[1]).length();
        for (let i = 1; i < points.length - 1; i++) {
            minLength = Math.min(minLength, minVector.subVectors(points[i], points[i + 1]).length());
        }
        if (closed) {
            minLength = Math.min(minLength, minVector.subVectors(points[points.length - 1], points[0]).length());
        }

        radius = radius > minLength * .5 ? minLength * .5 : radius; // radius can't be greater than a half of a minimal segment

        let startIndex = 1;
        let endIndex = points.length - 2;
        if (closed) {
            startIndex = 0;
            endIndex = points.length - 1;
        }

        let positions = [];
        if (!closed) {
            positions.push(points[0].clone())
        }

        for (let i = startIndex; i <= endIndex; i++) {

            let iStart = i - 1 < 0 ? points.length - 1 : i - 1;
            let iMid = i;
            let iEnd = i + 1 > points.length - 1 ? 0 : i + 1;
            let pStart = points[iStart];
            let pMid = points[iMid];
            let pEnd = points[iEnd];

            // key points
            let vStartMid = new THREE.Vector3().subVectors(pStart, pMid).normalize();
            let vEndMid = new THREE.Vector3().subVectors(pEnd, pMid).normalize();
            let vCenter = new THREE.Vector3().subVectors(vEndMid, vStartMid).divideScalar(2).add(vStartMid).normalize();
            let angle = vStartMid.angleTo(vEndMid);
            let halfAngle = angle * .5;

            let sideLength = radius / Math.tan(halfAngle);
            let centerLength = Math.sqrt(sideLength * sideLength + radius * radius);

            let startKeyPoint = vStartMid.multiplyScalar(sideLength);
            let centerKeyPoint = vCenter.multiplyScalar(centerLength);
            let endKeyPoint = vEndMid.multiplyScalar(sideLength);

            let cb = new THREE.Vector3(),
                ab = new THREE.Vector3(),
                normal = new THREE.Vector3();
            cb.subVectors(centerKeyPoint, endKeyPoint);
            ab.subVectors(startKeyPoint, endKeyPoint);
            cb.cross(ab);
            normal.copy(cb).normalize();

            let rotatingPointStart = new THREE.Vector3().subVectors(startKeyPoint, centerKeyPoint);
            let rotatingPointEnd = new THREE.Vector3().subVectors(endKeyPoint, centerKeyPoint);
            let rotatingAngle = rotatingPointStart.angleTo(rotatingPointEnd);
            let angleDelta = rotatingAngle / smoothness;
            let tempPoint = new THREE.Vector3();
            for (let a = 0; a < smoothness + 1; a++) {
                tempPoint.copy(rotatingPointStart).applyAxisAngle(normal, angleDelta * a).add(pMid).add(centerKeyPoint);
                positions.push(tempPoint.clone());
            }

        }

        if (!closed) {
            positions.push(points[points.length - 1].clone());
        } else {
            positions.push(positions[0].clone());
        }

        return newGeometry.setFromPoints(positions);

    }

    // offset test

    var Sphere_offset_1 = new THREE.Sphere(new THREE.Vector3(TubePoints1[1].x, TubePoints1[1].y, TubePoints1[1].z), 0.12);
    var Point_offset_1_1 = Sphere_offset_1.clampPoint(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints1[1].z));
    var Point_offset_1_2 = Sphere_offset_1.clampPoint(new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints1[1].z));
    var offset_mid_1 = new THREE.Vector3((Point_offset_1_1.x + Point_offset_1_2.x) / 2, (Point_offset_1_1.y + Point_offset_1_2.y) / 2, (Point_offset_1_1.z + Point_offset_1_2.z) / 2);

    //  offset_midpoint.position.copy(offset_mid_1);
    //  step_group_1.add(offset_midpoint);

    var Sphere_offset_2 = new THREE.Sphere(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints1[1].z), 0.2);
    var Point_offset_2_1 = Sphere_offset_2.clampPoint(new THREE.Vector3(TubePoints1[1].x, TubePoints1[1].y, TubePoints1[1].z));
    var Point_offset_2_2 = Sphere_offset_2.clampPoint(new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints1[1].z));
    var offset_mid_2 = new THREE.Vector3((Point_offset_2_1.x + Point_offset_2_2.x) / 2, (Point_offset_2_1.y + Point_offset_2_2.y) / 2, (Point_offset_2_1.z + Point_offset_2_2.z) / 2);
    var offset_mid_geo2 = new THREE.SphereGeometry(0.02);

    //    offset_midpoint2.position.copy(offset_mid_2);
    //    step_group_1.add(offset_midpoint2);

    var Sphere_offset_3 = new THREE.Sphere(new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints1[1].z), 0.2);
    var Point_offset_3_1 = Sphere_offset_3.clampPoint(new THREE.Vector3(TubePoints1[1].x, TubePoints1[1].y, TubePoints1[1].z));
    var Point_offset_3_2 = Sphere_offset_3.clampPoint(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints1[1].z));
    var offset_mid_3 = new THREE.Vector3((Point_offset_3_1.x + Point_offset_3_2.x) / 2, (Point_offset_3_1.y + Point_offset_3_2.y) / 2, (Point_offset_3_1.z + Point_offset_3_2.z) / 2);
    var offset_mid_geo3 = new THREE.SphereGeometry(0.02);

    //    offset_midpoint3.position.copy(offset_mid_3);
    //    step_group_1.add(offset_midpoint3);


    var points_offset = [
        new THREE.Vector3(offset_mid_1.x, offset_mid_1.y, offset_mid_1.z),
        new THREE.Vector3(offset_mid_2.x, offset_mid_2.y, offset_mid_2.z),
        new THREE.Vector3(offset_mid_3.x, offset_mid_3.y, offset_mid_3.z),
    ];

    var radius = 0.04;
    var smoothness = 12;

    var geom_offset = roundedCornerLine(points_offset, radius, smoothness, true);
    var line1_offset = new THREE.Line(geom_offset, new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    }));
    line1_offset.computeLineDistances();
    step_group_1.add(line1_offset);


    // offset test 2

    var Sphere_offset_12 = new THREE.Sphere(new THREE.Vector3(TubePoints1[1].x, TubePoints1[1].y, TubePoints1[1].z), 0.12);
    var Point_offset_1_12 = Sphere_offset_12.clampPoint(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints1[1].z));
    var Point_offset_1_22 = Sphere_offset_12.clampPoint(new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints1[1].z));
    var offset_mid_12 = new THREE.Vector3((Point_offset_1_12.x + Point_offset_1_22.x) / 2, (Point_offset_1_12.y + Point_offset_1_22.y) / 2, (Point_offset_1_12.z + Point_offset_1_22.z) / 2);
    var offset_mid_geo12 = new THREE.SphereGeometry(0.02);

    //  offset_midpoint.position.copy(offset_mid_1);
    //  step_group_1.add(offset_midpoint);

    var Point_offset_2_12 = Sphere_offset_2.clampPoint(new THREE.Vector3(TubePoints1[1].x, TubePoints1[1].y, TubePoints1[1].z));
    var Point_offset_2_22 = Sphere_offset_2.clampPoint(new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints1[1].z));
    var offset_mid_22 = new THREE.Vector3((Point_offset_2_12.x + Point_offset_2_22.x) / 2, (Point_offset_2_12.y + Point_offset_2_22.y) / 2, (Point_offset_2_12.z + Point_offset_2_22.z) / 2);
    var offset_mid_geo22 = new THREE.SphereGeometry(0.02);

    //    offset_midpoint2.position.copy(offset_mid_2);
    //    step_group_1.add(offset_midpoint2);

    var Sphere_offset_32 = new THREE.Sphere(new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints1[1].z), 0.2);
    var Point_offset_3_12 = Sphere_offset_32.clampPoint(new THREE.Vector3(TubePoints1[1].x, TubePoints1[1].y, TubePoints1[1].z));
    var Point_offset_3_22 = Sphere_offset_32.clampPoint(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints1[1].z));
    var offset_mid_32 = new THREE.Vector3((Point_offset_3_12.x + Point_offset_3_22.x) / 2, (Point_offset_3_12.y + Point_offset_3_22.y) / 2, (Point_offset_3_12.z + Point_offset_3_22.z) / 2);
    var offset_mid_geo32 = new THREE.SphereGeometry(0.02);

    //    offset_midpoint3.position.copy(offset_mid_3);
    //    step_group_1.add(offset_midpoint3);


    var points_offset2 = [
        new THREE.Vector3(offset_mid_12.x, offset_mid_12.y, offset_mid_12.z),
        new THREE.Vector3(offset_mid_22.x, offset_mid_22.y, offset_mid_22.z),
        new THREE.Vector3(offset_mid_32.x, offset_mid_32.y, offset_mid_32.z),
    ];

    var radius = 0.04;
    var smoothness = 12;

    var geom_offset2 = roundedCornerLine(points_offset2, radius, smoothness, true);
    var line1_offset2 = new THREE.Line(geom_offset2, new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    }));
    line1_offset2.computeLineDistances();
    step_group_1.add(line1_offset2);

    // offset test 3

    var Sphere_offset_13 = new THREE.Sphere(new THREE.Vector3(TubePoints1[1].x, TubePoints1[1].y, TubePoints1[1].z), 0.12);
    var Point_offset_1_13 = Sphere_offset_13.clampPoint(new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints1[1].z));
    var Point_offset_1_23 = Sphere_offset_13.clampPoint(new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints1[1].z));
    var offset_mid_13 = new THREE.Vector3((Point_offset_1_13.x + Point_offset_1_23.x) / 2, (Point_offset_1_13.y + Point_offset_1_23.y) / 2, (Point_offset_1_13.z + Point_offset_1_23.z) / 2);
    var offset_mid_geo13 = new THREE.SphereGeometry(0.02);

    //  offset_midpoint.position.copy(offset_mid_1);
    //  step_group_1.add(offset_midpoint);

    var Sphere_offset_23 = new THREE.Sphere(new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints1[1].z), 0.2);
    var Point_offset_2_13 = Sphere_offset_23.clampPoint(new THREE.Vector3(TubePoints1[1].x, TubePoints1[1].y, TubePoints1[1].z));
    var Point_offset_2_23 = Sphere_offset_23.clampPoint(new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints1[1].z));
    var offset_mid_23 = new THREE.Vector3((Point_offset_2_13.x + Point_offset_2_23.x) / 2, (Point_offset_2_13.y + Point_offset_2_23.y) / 2, (Point_offset_2_13.z + Point_offset_2_23.z) / 2);
    var offset_mid_geo23 = new THREE.SphereGeometry(0.02);

    //    offset_midpoint2.position.copy(offset_mid_2);
    //    step_group_1.add(offset_midpoint2);

    var Sphere_offset_33 = new THREE.Sphere(new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints1[1].z), 0.2);
    var Point_offset_3_13 = Sphere_offset_33.clampPoint(new THREE.Vector3(TubePoints1[1].x, TubePoints1[1].y, TubePoints1[1].z));
    var Point_offset_3_23 = Sphere_offset_33.clampPoint(new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints1[1].z));
    var offset_mid_33 = new THREE.Vector3((Point_offset_3_13.x + Point_offset_3_23.x) / 2, (Point_offset_3_13.y + Point_offset_3_23.y) / 2, (Point_offset_3_13.z + Point_offset_3_23.z) / 2);

    var points_offset3 = [
        new THREE.Vector3(offset_mid_13.x, offset_mid_13.y, offset_mid_13.z),
        new THREE.Vector3(offset_mid_23.x, offset_mid_23.y, offset_mid_23.z),
        new THREE.Vector3(offset_mid_33.x, offset_mid_33.y, offset_mid_33.z),
    ];

    var radius = 0.04;
    var smoothness = 12;

    var geom_offset3 = roundedCornerLine(points_offset3, radius, smoothness, true);
    var line1_offset3 = new THREE.Line(geom_offset3, new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    }));
    line1_offset3.computeLineDistances();
    step_group_1.add(line1_offset3);


    //draw step 1 space 1

    var point2z = new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints1[1].z);
    var point3z = new THREE.Vector3(TubePoints3[1].x, TubePoints3[1].y, TubePoints1[1].z);
    var point4z = new THREE.Vector3(TubePoints4[1].x, TubePoints4[1].y, TubePoints1[1].z);

    var midpoint_24 = new THREE.Vector3((point2z.x + point4z.x) / 2, (point2z.y + point4z.y) / 2, (point2z.z + point4z.z) / 2);
    var Sphere_step_1 = new THREE.Sphere(new THREE.Vector3(0, 0, TubePoints1[1].z), 0.4);
    var Point_step_1 = Sphere_step_1.clampPoint(midpoint_24);
    var spGeom_step_1 = new THREE.SphereGeometry(0.02);
    var sp_step_1 = new THREE.Mesh(spGeom_step_1, new THREE.MeshPhongMaterial({
        color: "black",
        transparent: true,
        opacity: 0.7
    }));
    sp_step_1.position.copy(Point_step_1);
    //  step_group_1.add(sp_step_1);

    var TXMeshS1 = createSpriteTextstep1("C", Point_step_1);

    step_group_1.add(TXMeshS1);


    var midpoint_23 = new THREE.Vector3((point2z.x + point3z.x) / 2, (point2z.y + point3z.y) / 2, (point2z.z + point3z.z) / 2);
    var Sphere_step_2 = new THREE.Sphere(new THREE.Vector3(0, 0, TubePoints1[1].z), 0.4);
    var Point_step_2 = Sphere_step_2.clampPoint(midpoint_23);
    var spGeom_step_2 = new THREE.SphereGeometry(0.02);
    var sp_step_2 = new THREE.Mesh(spGeom_step_2, new THREE.MeshPhongMaterial({
        color: "black",
        transparent: true,
        opacity: 0.7
    }));
    sp_step_2.position.copy(Point_step_2);
    //    step_group_1.add(sp_step_2);

    var TXMeshS2 = createSpriteTextstep1("A", Point_step_2);

    step_group_1.add(TXMeshS2);

    var midpoint_34 = new THREE.Vector3((point4z.x + point3z.x) / 2, (point4z.y + point3z.y) / 2, (point4z.z + point3z.z) / 2);
    var Point_step_3 = Sphere_step_2.clampPoint(midpoint_34);
    var spGeom_step_3 = new THREE.SphereGeometry(0.02);
    var sp_step_3 = new THREE.Mesh(spGeom_step_3, new THREE.MeshPhongMaterial({
        color: "black",
        transparent: true,
        opacity: 0.7
    }));
    sp_step_3.position.copy(Point_step_3);
    //    step_group_1.add(sp_step_3);

    var TXMeshS3 = createSpriteTextstep1("B", Point_step_3);

    step_group_1.add(TXMeshS3);


    geometry44 = new THREE.SphereGeometry(0.03);
    material44 = new THREE.MeshPhongMaterial({color: "grey"});

    mesh44 = new THREE.Mesh(geometry44, material44);
    //        scene2.add( mesh44 );

    P_A_Left = Pnt_copy(P_A);
    P_B_Left = Pnt_copy(P_B);
    P_C_Left = Pnt_copy(P_C);
    P_D_Left = Pnt_copy(P_D);

    geometry45 = new THREE.SphereGeometry(0.03);
    material45 = new THREE.MeshPhongMaterial({color: "black"});

    mesh45 = new THREE.Mesh(geometry45, material45);
    //step_group_1_1.add( mesh45 );
    mesh45.position.copy(P_A_Left);


    mesh46 = new THREE.Mesh(geometry45, material45);
    //step_group_1_1.add( mesh46 );
    mesh46.position.copy(P_B_Left);

    mesh47 = new THREE.Mesh(geometry45, material45);
    //step_group_1_1.add( mesh47 );
    mesh47.position.copy(P_C_Left);

    //var tween1 = new TWEEN.Tween( mesh44.position ).to( P_A_Right, 3000 );
    //var tween2 = new TWEEN.Tween( mesh44.position ).to( P_B_Right, 3000 );
    //var tween3 = new TWEEN.Tween( mesh44.position ).to( P_C_Right, 3000 );

    //  tween1.chain( tween2 );
    //  tween2.chain( tween3 );
    //  tween3.chain( tween1 );

    //tween1.start();


    P_A_Right = Pnt_copy(P_A);
    P_B_Right = Pnt_copy(P_B);
    P_C_Right = Pnt_copy(P_C);
    P_D_Right = Pnt_copy(P_D);


    var vertices2 = [
        P_A_Right, P_B_Right, P_C_Right
    ];

    //    var step_1_force = [];
    //    step_1_force.push(P_A_Right);
    //    step_1_force.push(P_B_Right);
    //    step_1_force.push(P_C_Right);

    //    var step_1_force_p = new THREE.Geometry().setFromPoints( step_1_force );

    var faces2 = [
        new THREE.Face3(0, 1, 2),

    ];


    var geomstep1 = new THREE.Geometry();
    geomstep1.vertices = vertices2;
    geomstep1.faces = faces2;
    geomstep1.computeFaceNormals();

    //    var step_1_line_Material = new THREE.LineDashedMaterial({
    //                             color: "black",//color
    //                             dashSize: 0.1,//size
    //                            gapSize: 0.05//dis
    //                             });


    //    var step_1_force_path = new THREE.LineSegments(step_1_force_p,step_1_line_Material);
    //    step_1_force_path.computeLineDistances();//compute

    //    step_1_force_path = THREE.SceneUtils.createMultiMaterialObject(geomstep1, materialsp1);
    //  step_1_force_path.children.forEach(function (e) {
    //      e.geometry.vertices = vertices2;
    //      e.geometry.verticesNeedUpdate = true;

    // e.geometry.faces[0].color.set(0xff00ee);
    // e.geometry.facesNeedUpdate=true;
    //      e.geometry.elementsNeedUpdate = true;
    //      e.geometry.computeFaceNormals();
    //e.geometry.center();
    //  });
    //  step_group_1_1.add( step_1_force_path );

    var materialsp1 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "black", wireframe: true, transparent: true, opacity: 0.2}),
        new THREE.MeshLambertMaterial({
            colors: 0x009600, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false
        })
    ];


    step_1_line_Path = THREE.SceneUtils.createMultiMaterialObject(geomstep1, materialsp1);
    step_1_line_Path.children.forEach(function (e) {
        e.geometry.vertices = vertices2;
        e.geometry.verticesNeedUpdate = true;

        // e.geometry.faces[0].color.set(0xff00ee);
        // e.geometry.facesNeedUpdate=true;
        e.geometry.elementsNeedUpdate = true;
        e.geometry.computeFaceNormals();
        //e.geometry.center();
    });

    //step_group_1_1.add( step_1_line_Path );

    var SphereTest_step_1 = new THREE.Sphere(P_A_Right, 2.5);
    var PointClose1_step_1 = SphereTest_step_1.clampPoint(P_B_Right);
    //        var SphereTest2_2 = new THREE.Sphere(PointClose1_2,0.05);
    //        var PointClose2_2 = SphereTest2_2.clampPoint(TubePoints3[1]);
    //        var SphereTest3_2 = new THREE.Sphere(PointClose2_2,0.045);


    var setp_1_arrow_1 = createCylinderArrowMesh(PointClose1_step_1, P_B_Right, material45, 0.023, 0.05, 0.55);
    //step_group_1_1.add( setp_1_arrow_1 );
    setp_1_arrow_1.position.copy(P_A_Right);

    var SphereTest_step_1_2 = new THREE.Sphere(P_B_Right, 2.5);
    var PointClose1_step_1_2 = SphereTest_step_1_2.clampPoint(P_C_Right);

    var setp_1_arrow_2 = createCylinderArrowMesh(PointClose1_step_1_2, P_C_Right, material45, 0.023, 0.05, 0.55);
    //step_group_1_1.add( setp_1_arrow_2 );
    setp_1_arrow_2.position.copy(P_B_Right);

    var SphereTest_step_1_3 = new THREE.Sphere(P_C_Right, 2.5);
    var PointClose1_step_1_3 = SphereTest_step_1_3.clampPoint(P_A_Right);

    var setp_1_arrow_3 = createCylinderArrowMesh(PointClose1_step_1_3, P_A_Right, material45, 0.023, 0.05, 0.55);
    //step_group_1_1.add( setp_1_arrow_3 );
    setp_1_arrow_3.position.copy(P_C_Right);

    //var tween4 = new TWEEN.Tween( setp_1_arrow_1.position ).to( P_B_Right, 2000 );
    //var tween5 = new TWEEN.Tween( setp_1_arrow_2.position ).to( P_C_Right, 2000 );
    //var tween6 = new TWEEN.Tween( setp_1_arrow_3.position ).to( P_A_Right, 2000 );

    //tween4.chain( tween5 );
    //tween5.chain( tween6 );
    //tween6.chain( tween4 );

    //tween4.start();
    //      tween5.start();
    //      tween6.start();
    //      step_1_line_Path.scale.set(0.5,0.5,0.5);


    var Sphere_step_2_1 = new THREE.Sphere(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints2[1].z), 0.9);
    var Point_step_2_1 = Sphere_step_2_1.clampPoint(TubePoints1[1]);
    var spGeom_step_2_1 = new THREE.SphereGeometry(0.02);
    var sp_step_2_1 = new THREE.Mesh(spGeom_step_2_1, new THREE.MeshPhongMaterial({
        color: "black",
        transparent: true,
        opacity: 0.7
    }));
    sp_step_2_1.position.copy(Point_step_2_1);
    //step_group_2.add(sp_step_2_1);

    var Sphere_step_2_12 = new THREE.Sphere(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints2[1].z), 0.8);
    var Point_step_2_12 = Sphere_step_2_12.clampPoint(TubePoints1[0]);
    var spGeom_step_2_12 = new THREE.SphereGeometry(0.2);
    var sp_step_2_12 = new THREE.Mesh(spGeom_step_2_12, new THREE.MeshPhongMaterial({
        color: "black",
        transparent: true,
        opacity: 0.7
    }));
    sp_step_2_12.position.copy(Point_step_2_12);
    //step_group_2.add(sp_step_2_12);

    var Sphere_step_2_13 = new THREE.Sphere(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints2[1].z), 0.9);
    var Point_step_2_13 = Sphere_step_2_13.clampPoint(TubePoints4[1]);
    var spGeom_step_2_13 = new THREE.SphereGeometry(0.2);
    var sp_step_2_13 = new THREE.Mesh(spGeom_step_2_13, new THREE.MeshPhongMaterial({
        color: "black",
        transparent: true,
        opacity: 0.7
    }));
    sp_step_2_13.position.copy(Point_step_2_13);
    //step_group_2.add(sp_step_2_13);

    var Sphere_step_2_14 = new THREE.Sphere(new THREE.Vector3(TubePoints2[1].x, TubePoints2[1].y, TubePoints2[1].z), 0.9);
    var Point_step_2_14 = Sphere_step_2_14.clampPoint(TubePoints3[1]);
    var spGeom_step_2_14 = new THREE.SphereGeometry(0.2);
    var sp_step_2_14 = new THREE.Mesh(spGeom_step_2_14, new THREE.MeshPhongMaterial({
        color: "black",
        transparent: true,
        opacity: 0.7
    }));
    sp_step_2_14.position.copy(Point_step_2_14);
    //step_group_2.add(sp_step_2_13);

    var vertices_step_21 = [
        TubePoints2[1], Point_step_2_1, Point_step_2_12, Point_step_2_13, Point_step_2_14
    ];

    var face_step_21 = [
        new THREE.Face3(0, 1, 2),
    ]
    var geom_step_21 = new THREE.Geometry();
    geom_step_21.vertices = vertices_step_21;
    geom_step_21.faces = face_step_21;
    geom_step_21.computeFaceNormals();

    var material_step_21 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: "grey", transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    var face_step_22 = [
        new THREE.Face3(0, 2, 3),
    ]
    var geom_step_22 = new THREE.Geometry();
    geom_step_22.vertices = vertices_step_21;
    geom_step_22.faces = face_step_22;
    geom_step_22.computeFaceNormals();

    var material_step_22 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: "grey", transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    var face_step_23 = [
        new THREE.Face3(0, 2, 4),
    ]
    var geom_step_23 = new THREE.Geometry();
    geom_step_23.vertices = vertices_step_21;
    geom_step_23.faces = face_step_23;
    geom_step_23.computeFaceNormals();

    var material_step_23 = [
        //new THREE.MeshLambertMaterial({color: 0x4d4dff, transparent: true}),
        new THREE.MeshBasicMaterial({color: "white", wireframe: true, transparent: true, opacity: 0.1}),
        new THREE.MeshPhongMaterial({
            color: "grey", transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false
        })
    ];

    var points4 = [
        Point_step_2_1,
        Point_step_2_12,
        Point_step_2_13,
    ];

    var radius = 0.01;
    var smoothness = 12;

    var geom4 = roundedCornerLine(points4, radius, smoothness, true);
    var line4 = new THREE.Line(geom4, new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    }));
    line4.computeLineDistances();
    //  step_group_2.add(line4);

    var points5 = [
        Point_step_2_1,
        Point_step_2_12,
        Point_step_2_14,
    ];

    var radius = 0.01;
    var smoothness = 12;

    var geom5 = roundedCornerLine(points5, radius, smoothness, true);
    var line5 = new THREE.Line(geom5, new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    }));
    line5.computeLineDistances();
    //step_group_2.add(line5);

    var points6 = [
        Point_step_2_12,
        Point_step_2_13,
        Point_step_2_14,
    ];

    var radius = 0.02;
    var smoothness = 12;

    var geom6 = roundedCornerLine(points6, radius, smoothness, true);
    var line6 = new THREE.Line(geom6, new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.1,
        gapSize: 0.03,
        linewidth: 1

    }));
    line6.computeLineDistances();
    //step_group_2.add(line6);


    //


    var SphereTest5 = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 0.7);
    var PointClose4 = SphereTest5.clampPoint(TubePoints1[1]);

    var SphereTest6 = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 0.45);
    var PointClose5 = SphereTest6.clampPoint(TubePoints1[1]);
    createCylinderMesh(PointClose4, PointClose5, arrow_apply_1, 0.01, 0.01);
    //Tube_group.add(tubeMesh_apply_2);

    var SphereTest7 = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 0.4);
    var PointClose6 = SphereTest7.clampPoint(TubePoints1[1]);

    var SphereTest8 = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 0.1);
    var PointClose7 = SphereTest8.clampPoint(TubePoints1[1]);
    createCylinderMesh(PointClose6, PointClose7, arrow_apply_1, 0.01, 0.01);
    //Tube_group.add(tubeMesh_apply_3);


    //mesh sphere1scene.remove(tubeMesh1);

    // var material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});
    var material2 = new THREE.MeshPhongMaterial({color: "white", transparent: true, opacity: 0.5});

    var spGeom1 = new THREE.SphereGeometry(0.015);
    var sp_tube1 = new THREE.Mesh(spGeom1, material2);


    sp_tube1.position.copy(TubePoints1[1]);

    sp_tube1.castShadow = false;

    sp_tube1.name = "sp1";//select

    // add the points as a group to the scene

    Tube_group.add(sp_tube1);

    Ctrl_pts.push(sp_tube1);

    var outlineMaterial3 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMesh3 = new THREE.Mesh(spGeom0, outlineMaterial3);
    outlineMesh3.position.copy(TubePoints1[1]);
    outlineMesh3.scale.multiplyScalar(0.3);
    Tube_group.add(outlineMesh3);


    var tubeMesh1 = createCylinderMesh(TubePoints1[0], TubePoints1[1], lattice_line_material, 0.02, 0.02);
    tubeMesh1.castShadow = true;
    tubeMesh1.name = "tb1";
    Ctrl_tubes.push(tubeMesh1);


    var tpoints = [];
    tpoints.push(TubePoints1[0]);
    tpoints.push(TubePoints1[1]);

    var dgeo = new THREE.Geometry().setFromPoints(tpoints);
    var dashline1 = new THREE.LineDashedMaterial({
        color: "black",//color
        dashSize: 0.2,
        gapSize: 0.03,
        linewidth: 1

    });

    var Dashl = new THREE.LineSegments(dgeo, dashline1);
    Dashl.computeLineDistances();//compute

    //      Tube_group.add(tubeMesh1);
    //        Tube_group.add(Dashl);

    var arrow_material1 = new THREE.MeshPhongMaterial({
        color: 0x009600
    });

    var arrow_material_outline = new THREE.MeshBasicMaterial({
        color: "white",
        transparent: false,
        side: THREE.BackSide
    });


    //arrow

    if (TubePoints1[1].z >= 0)//arrow p

        var tube_arrow1 = createCylinderArrowMesh(new THREE.Vector3(1.4 * TubePoints1[1].x, 1.4 * TubePoints1[1].y, 1.4 * TubePoints1[1].z), TubePoints1[1], arrow_material1, 0.02, 0.05, 0.6);
    else
        var tube_arrow1 = createCylinderArrowMesh(TubePoints1[1], new THREE.Vector3(1.4 * TubePoints1[1].x, 1.4 * TubePoints1[1].y, 1.4 * TubePoints1[1].z), arrow_material1, 0.02, 0.05, 0.6);

    Tube_group.add(tube_arrow1);

    if (TubePoints1[1].z >= 0)//arrow p

        var tube_arrow12 = createCylinderArrowMesh(new THREE.Vector3(1.37 * TubePoints1[1].x, 1.37 * TubePoints1[1].y, 1.37 * TubePoints1[1].z), TubePoints1[1], arrow_material_outline, 0.023, 0.05, 0.55);
    else
        var tube_arrow12 = createCylinderArrowMesh(TubePoints1[1], new THREE.Vector3(1.37 * TubePoints1[1].x, 1.37 * TubePoints1[1].y, 1.37 * TubePoints1[1].z), arrow_material_outline, 0.023, 0.05, 0.55);

    Tube_group.add(tube_arrow12);
    tube_arrow12.scale.multiplyScalar(1.2);


    //mesh sphere2

    var material3 = new THREE.MeshPhongMaterial({color: "white", transparent: true, opacity: 0.5});

    var spGeom2 = new THREE.SphereGeometry(0.022);
    var sp_tube2 = new THREE.Mesh(spGeom2, material3);
    sp_tube2.position.copy(TubePoints2[1]);
    // add the points as a group to the scene
    sp_tube2.name = "sp2";//select
    Ctrl_pts.push(sp_tube2);
    Tube_group.add(sp_tube2);
    sp_tube2.castShadow = false;

    var outlineMaterial2 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMesh2 = new THREE.Mesh(spGeom0, outlineMaterial2);
    outlineMesh2.position.copy(TubePoints2[1]);
    outlineMesh2.scale.multiplyScalar(0.6);
    Tube_group.add(outlineMesh2);


    //arrow

    if (arr_direction[0] >= 0)//arrow air
    {
        P_A_Right = Pnt_copy(P_A);
        P_B_Right = Pnt_copy(P_B);
        P_C_Right = Pnt_copy(P_C);
        P_D_Right = Pnt_copy(P_D);

        var face_bar_1_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_2_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_B_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_3_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_B_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_B_Right),
        ).length() / 2

        var max = Math.max(face_bar_1_area, face_bar_2_area, face_bar_3_area)
        var tubeMesh2_p1 = face_bar_1_area / max;

        tt = 0.5 * tubethick.v * face_bar_1_area;

        if (tubeMesh2_p1 < 0.25 && tubeMesh2_p1 >= 0) {
            var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                color: 0x5B84AE
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_1);
            var tubeMesh2 = createCylinderMesh(TubePoints2[1], PointClose2, Colorbar_blue_1, tt, tt);
            var tube_arrow2 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), TubePoints2[1], Colorbar_blue_1, 0.02, 0.05, 0.6);
        }
        if (tubeMesh2_p1 < 0.5 && tubeMesh2_p1 >= 0.25) {
            var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                color: 0x376D9B
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_2);
            var tubeMesh2 = createCylinderMesh(TubePoints2[1], PointClose2, Colorbar_blue_2, tt, tt);
            var tube_arrow2 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), TubePoints2[1], Colorbar_blue_2, 0.02, 0.05, 0.6);
        }
        if (tubeMesh2_p1 < 0.75 && tubeMesh2_p1 >= 0.5) {
            var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                color: 0x05416D
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_3);
            var tubeMesh2 = createCylinderMesh(TubePoints2[1], PointClose2, Colorbar_blue_3, tt, tt);
            var tube_arrow2 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), TubePoints2[1], Colorbar_blue_3, 0.02, 0.05, 0.6);
        }

        if (tubeMesh2_p1 >= 0.75) {
            var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                color: 0x0F3150
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_4);
            var tubeMesh2 = createCylinderMesh(TubePoints2[1], PointClose2, Colorbar_blue_4, tt, tt);
            var tube_arrow2 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), TubePoints2[1], Colorbar_blue_4, 0.02, 0.05, 0.6);
        }
        //                var tubeMesh2=createCylinderMesh(new THREE.Vector3(TubePoints2[0].x+0.05,TubePoints2[0].y-0.05,TubePoints2[0].z-0.05) ,TubePoints2[1],Colorbar_blue,tt,tt);

        //                var tube_arrow2=createCylinderArrowMesh(new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z) ,TubePoints2[1],arrow_material,0.02,0.05,0.6);

    } else {
        P_A_Right = Pnt_copy(P_A);
        P_B_Right = Pnt_copy(P_B);
        P_C_Right = Pnt_copy(P_C);
        P_D_Right = Pnt_copy(P_D);

        var face_bar_1_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_2_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_B_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_3_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_B_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_B_Right),
        ).length() / 2

        var max = Math.max(face_bar_1_area, face_bar_2_area, face_bar_3_area)
        var tubeMesh2_t1 = face_bar_1_area / max;

        tt = 0.5 * tubethick.v * face_bar_1_area;

        if (tubeMesh2_t1 < 0.25 && tubeMesh2_t1 >= 0) {
            var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                color: 0xD72F62
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_1);
            var tubeMesh2 = createCylinderMesh(TubePoints2[1], PointClose2, Colorbar_red_1, tt, tt);
            var tube_arrow2 = createCylinderArrowMesh(TubePoints2[1], new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), Colorbar_red_1, 0.02, 0.05, 0.6);
        }
        if (tubeMesh2_t1 < 0.5 && tubeMesh2_t1 >= 0.25) {
            var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                color: 0xCC0549
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_2);
            var tubeMesh2 = createCylinderMesh(TubePoints2[1], PointClose2, Colorbar_red_2, tt, tt);
            var tube_arrow2 = createCylinderArrowMesh(TubePoints2[1], new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), Colorbar_red_2, 0.02, 0.05, 0.6);
        }
        if (tubeMesh2_t1 < 0.75 && tubeMesh2_t1 >= 0.5) {
            var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                color: 0x940041
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_3);
            var tubeMesh2 = createCylinderMesh(TubePoints2[1], PointClose2, Colorbar_red_3, tt, tt);
            var tube_arrow2 = createCylinderArrowMesh(TubePoints2[1], new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), Colorbar_red_3, 0.02, 0.05, 0.6);
        }

        if (tubeMesh2_t1 >= 0.75) {
            var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                color: 0x80002F
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_4);
            var tubeMesh2 = createCylinderMesh(TubePoints2[1], PointClose2, Colorbar_red_4, tt, tt);
            var tube_arrow2 = createCylinderArrowMesh(TubePoints2[1], new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), Colorbar_red_4, 0.02, 0.05, 0.6);
        }

        //              var tubeMesh2=createCylinderMesh(new THREE.Vector3(TubePoints2[0].x-0.05,TubePoints2[0].y+0.05,TubePoints2[0].z+0.05) ,TubePoints2[1],Colorbar_red1,tt,tt);
        //              var tube_arrow2=createCylinderArrowMesh(TubePoints2[1],new THREE.Vector3(1.22*TubePoints2[1].x,1.22*TubePoints2[1].y,1.22*TubePoints2[1].z),arrow_material2,0.02,0.05,0.6);
    }
    tubeMesh2.castShadow = true;
    tubeMesh2.name = "tb2";
    Ctrl_tubes.push(tubeMesh2);
    SphereTest3_SP.position.copy(PointClose2);

    Tube_group.add(tubeMesh2);
    Tube_group.add(tube_arrow2);
    Tube_group.add(SphereTest3_SP);

    if (arr_direction[0] >= 0)//arrow air

        var tube_arrow22 = createCylinderArrowMesh(new THREE.Vector3(1.2 * TubePoints2[1].x, 1.2 * TubePoints2[1].y, 1.2 * TubePoints2[1].z), TubePoints2[1], arrow_material_outline, 0.023, 0.05, 0.54);

    else
        var tube_arrow22 = createCylinderArrowMesh(TubePoints2[1], new THREE.Vector3(1.2 * TubePoints2[1].x, 1.2 * TubePoints2[1].y, 1.2 * TubePoints2[1].z), arrow_material_outline, 0.023, 0.055, 0.62);

    //  Tube_group.add(tube_arrow22);
    tube_arrow22.scale.multiplyScalar(1.2);

    //mesh sphere3

    var material4 = new THREE.MeshPhongMaterial({color: "white", transparent: true, opacity: 0.5});

    var spGeom3 = new THREE.SphereGeometry(0.015);
    var sp_tube3 = new THREE.Mesh(spGeom3, material4);
    sp_tube3.position.copy(TubePoints3[1]);
    sp_tube3.name = "sp3";//select
    // add the points as a group to the scene
    Ctrl_pts.push(sp_tube3);
    Tube_group.add(sp_tube3);
    sp_tube3.castShadow = false;

    var outlineMaterial4 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMesh4 = new THREE.Mesh(spGeom0, outlineMaterial4);
    outlineMesh4.position.copy(TubePoints3[1]);
    outlineMesh4.scale.multiplyScalar(0.6);
    Tube_group.add(outlineMesh4);

    var SphereTest = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 0.07);
    var PointClose1_2 = SphereTest.clampPoint(TubePoints3[1]);
    var SphereTest2_2 = new THREE.Sphere(PointClose1_2, 0.05);
    var PointClose2_2 = SphereTest2_2.clampPoint(TubePoints3[1]);

    //arrow

    if (arr_direction[1] >= 0) {

        P_A_Right = Pnt_copy(P_A);
        P_B_Right = Pnt_copy(P_B);
        P_C_Right = Pnt_copy(P_C);
        P_D_Right = Pnt_copy(P_D);

        var face_bar_1_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_2_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_B_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_3_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_B_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_B_Right),
        ).length() / 2

        var max = Math.max(face_bar_1_area, face_bar_2_area, face_bar_3_area)
        var tubeMesh3_p2 = face_bar_2_area / max;
        tt = 0.5 * tubethick.v * face_bar_2_area;

        if (tubeMesh3_p2 < 0.25 && tubeMesh3_p2 >= 0) {
            var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                color: 0x5B84AE
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_2 = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_1);
            var tubeMesh3 = createCylinderMesh(TubePoints3[1], PointClose2_2, Colorbar_blue_1, tt, tt);
            var tube_arrow3 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), TubePoints3[1], Colorbar_blue_1, 0.02, 0.05, 0.6);
        }
        if (tubeMesh3_p2 < 0.5 && tubeMesh3_p2 >= 0.25) {
            var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                color: 0x376D9B
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_2 = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_2);
            var tubeMesh3 = createCylinderMesh(TubePoints3[1], PointClose2_2, Colorbar_blue_2, tt, tt);
            var tube_arrow3 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), TubePoints3[1], Colorbar_blue_2, 0.02, 0.05, 0.6);
        }
        if (tubeMesh3_p2 < 0.75 && tubeMesh3_p2 >= 0.5) {
            var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                color: 0x05416D
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_2 = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_3);
            var tubeMesh3 = createCylinderMesh(TubePoints3[1], PointClose2_2, Colorbar_blue_3, tt, tt);
            var tube_arrow3 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), TubePoints3[1], Colorbar_blue_3, 0.02, 0.05, 0.6);
        }

        if (tubeMesh3_p2 >= 0.75) {
            var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                color: 0x0F3150
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_2 = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_4);
            var tubeMesh3 = createCylinderMesh(TubePoints3[1], PointClose2_2, Colorbar_blue_4, tt, tt);
            var tube_arrow3 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), TubePoints3[1], Colorbar_blue_4, 0.02, 0.05, 0.6);
        }

        //                var tubeMesh3=createCylinderMesh(new THREE.Vector3(TubePoints3[0].x-0.07,TubePoints3[0].y-0.03,TubePoints3[0].z-0.03) ,TubePoints3[1],Colorbar_blue1,tt,tt);
        //                var tube_arrow3=createCylinderArrowMesh(new THREE.Vector3(1.22*TubePoints3[1].x,1.22*TubePoints3[1].y,1.22*TubePoints3[1].z) ,TubePoints3[1],arrow_material,0.02,0.05,0.6);
    } else {

        P_A_Right = Pnt_copy(P_A);
        P_B_Right = Pnt_copy(P_B);
        P_C_Right = Pnt_copy(P_C);
        P_D_Right = Pnt_copy(P_D);

        var face_bar_1_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_2_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_B_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_3_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_B_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_B_Right),
        ).length() / 2

        var max = Math.max(face_bar_1_area, face_bar_2_area, face_bar_3_area)
        var tubeMesh3_t2 = face_bar_2_area / max;
        tt = 0.5 * tubethick.v * face_bar_2_area;

        if (tubeMesh3_t2 < 0.25 && tubeMesh3_t2 >= 0) {
            var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                color: 0xD72F62
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_2 = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_1);
            var tubeMesh3 = createCylinderMesh(TubePoints3[1], PointClose2_2, Colorbar_red_1, tt, tt);
            var tube_arrow3 = createCylinderArrowMesh(TubePoints3[1], new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), Colorbar_red_1, 0.02, 0.05, 0.6);
        }
        if (tubeMesh3_t2 < 0.5 && tubeMesh3_t2 >= 0.25) {
            var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                color: 0xCC0549
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_2 = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_2);
            var tubeMesh3 = createCylinderMesh(TubePoints3[1], PointClose2_2, Colorbar_red_2, tt, tt);
            var tube_arrow3 = createCylinderArrowMesh(TubePoints3[1], new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), Colorbar_red_2, 0.02, 0.05, 0.6);
        }
        if (tubeMesh3_t2 < 0.75 && tubeMesh3_t2 >= 0.5) {
            var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                color: 0x940041
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_2 = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_3);
            var tubeMesh3 = createCylinderMesh(TubePoints3[1], PointClose2_2, Colorbar_red_3, tt, tt);
            var tube_arrow3 = createCylinderArrowMesh(TubePoints3[1], new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), Colorbar_red_3, 0.02, 0.05, 0.6);
        }

        if (tubeMesh3_t2 >= 0.75) {
            var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                color: 0x80002F
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_2 = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_4);
            var tubeMesh3 = createCylinderMesh(TubePoints3[1], PointClose2_2, Colorbar_red_4, tt, tt);
            var tube_arrow3 = createCylinderArrowMesh(TubePoints3[1], new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), Colorbar_red_4, 0.02, 0.05, 0.6);
        }

//                var tubeMesh3=createCylinderMesh(new THREE.Vector3(TubePoints3[0].x+0.07,TubePoints3[0].y+0.03,TubePoints3[0].z+0.03),TubePoints3[1],Colorbar_red1,tt,tt);
//                var tube_arrow3=createCylinderArrowMesh(TubePoints3[1],new THREE.Vector3(1.22*TubePoints3[1].x,1.22*TubePoints3[1].y,1.22*TubePoints3[1].z),arrow_material2,0.02,0.05,0.6);
    }

    tubeMesh3.castShadow = true;
    tubeMesh3.name = "tb3";
    Ctrl_tubes.push(tubeMesh3);
    SphereTest3_SP_2.position.copy(PointClose2_2);

    Tube_group.add(tubeMesh3);
    Tube_group.add(tube_arrow3);
    Tube_group.add(SphereTest3_SP_2);

    if (arr_direction[1] >= 0)

        var tube_arrow32 = createCylinderArrowMesh(new THREE.Vector3(1.2 * TubePoints3[1].x, 1.2 * TubePoints3[1].y, 1.2 * TubePoints3[1].z), TubePoints3[1], arrow_material_outline, 0.023, 0.05, 0.54);
    else
        var tube_arrow32 = createCylinderArrowMesh(TubePoints3[1], new THREE.Vector3(1.2 * TubePoints3[1].x, 1.2 * TubePoints3[1].y, 1.2 * TubePoints3[1].z), arrow_material_outline, 0.023, 0.055, 0.62);

    //   Tube_group.add(tube_arrow32);
    tube_arrow32.scale.multiplyScalar(1.2);

    //mesh sphere4
    var material5 = new THREE.MeshPhongMaterial({color: "white", transparent: true, opacity: 0.5});

    var spGeom4 = new THREE.SphereGeometry(0.015);
    var sp_tube4 = new THREE.Mesh(spGeom4, material5);
    sp_tube4.position.copy(TubePoints4[1]);
    sp_tube4.castShadow = false;

    sp_tube4.name = "sp4";//select
    Ctrl_pts.push(sp_tube4);
    // add the points as a group to the scene
    Tube_group.add(sp_tube4);

    var outlineMaterial5 = new THREE.MeshBasicMaterial({color: "black", transparent: false, side: THREE.BackSide});
    var outlineMesh5 = new THREE.Mesh(spGeom0, outlineMaterial5);
    outlineMesh5.position.copy(TubePoints4[1]);
    outlineMesh5.scale.multiplyScalar(0.6);
    Tube_group.add(outlineMesh5);

    var SphereTest = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 0.07);
    var PointClose1_3 = SphereTest.clampPoint(TubePoints4[1]);
    var SphereTest2_3 = new THREE.Sphere(PointClose1_3, 0.05);
    var PointClose2_3 = SphereTest2_3.clampPoint(TubePoints4[1]);

    //arrow

    if (arr_direction[2] >= 0) {
        P_A_Right = Pnt_copy(P_A);
        P_B_Right = Pnt_copy(P_B);
        P_C_Right = Pnt_copy(P_C);
        P_D_Right = Pnt_copy(P_D);

        var face_bar_1_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_2_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_B_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_3_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_B_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_B_Right),
        ).length() / 2

        var max = Math.max(face_bar_1_area, face_bar_2_area, face_bar_3_area)
        var tubeMesh4_p3 = face_bar_3_area / max;
        tt = 0.5 * tubethick.v * face_bar_3_area;

        if (tubeMesh4_p3 < 0.25 && tubeMesh4_p3 >= 0) {
            var Colorbar_blue_1 = new THREE.MeshPhongMaterial({
                color: 0x5B84AE
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_3 = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_1);
            var tubeMesh4 = createCylinderMesh(TubePoints4[1], PointClose2_3, Colorbar_blue_1, tt, tt);
            var tube_arrow4 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), TubePoints4[1], Colorbar_blue_1, 0.02, 0.05, 0.6);
        }
        if (tubeMesh4_p3 < 0.5 && tubeMesh4_p3 >= 0.25) {
            var Colorbar_blue_2 = new THREE.MeshPhongMaterial({
                color: 0x376D9B
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_3 = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_2);
            var tubeMesh4 = createCylinderMesh(TubePoints4[1], PointClose2_3, Colorbar_blue_2, tt, tt);
            var tube_arrow4 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), TubePoints4[1], Colorbar_blue_2, 0.02, 0.05, 0.6);
        }
        if (tubeMesh4_p3 < 0.75 && tubeMesh4_p3 >= 0.5) {
            var Colorbar_blue_3 = new THREE.MeshPhongMaterial({
                color: 0x05416D
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_3 = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_3);
            var tubeMesh4 = createCylinderMesh(TubePoints4[1], PointClose2_3, Colorbar_blue_3, tt, tt);
            var tube_arrow4 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), TubePoints4[1], Colorbar_blue_3, 0.02, 0.05, 0.6);
        }

        if (tubeMesh4_p3 >= 0.75) {
            var Colorbar_blue_4 = new THREE.MeshPhongMaterial({
                color: 0x0F3150
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_3 = new THREE.Mesh(SphereTest3_Geo, Colorbar_blue_4);
            var tubeMesh4 = createCylinderMesh(TubePoints4[1], PointClose2_3, Colorbar_blue_4, tt, tt);
            var tube_arrow4 = createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), TubePoints4[1], Colorbar_blue_4, 0.02, 0.05, 0.6);
        }

        //                var tubeMesh4=createCylinderMesh(new THREE.Vector3(TubePoints4[0].x+0.01,TubePoints4[0].y+0.07,TubePoints4[0].z-0.05) ,TubePoints4[1],Colorbar_blue1,tt,tt);
        //                var tube_arrow4=createCylinderArrowMesh(new THREE.Vector3(1.22*TubePoints4[1].x,1.22*TubePoints4[1].y,1.22*TubePoints4[1].z) ,TubePoints4[1],arrow_material,0.02,0.05,0.6);
    } else {
        P_A_Right = Pnt_copy(P_A);
        P_B_Right = Pnt_copy(P_B);
        P_C_Right = Pnt_copy(P_C);
        P_D_Right = Pnt_copy(P_D);

        var face_bar_1_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_2_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_B_Right, P_A_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_A_Right),
        ).length() / 2

        var face_bar_3_area = new THREE.Vector3().crossVectors(
            new THREE.Vector3().subVectors(P_C_Right, P_B_Right),
            new THREE.Vector3().subVectors(P_D_Right, P_B_Right),
        ).length() / 2

        var max = Math.max(face_bar_1_area, face_bar_2_area, face_bar_3_area)
        var tubeMesh4_t3 = face_bar_3_area / max;
        tt = 0.5 * tubethick.v * face_bar_3_area;

        if (tubeMesh4_t3 < 0.25 && tubeMesh4_t3 >= 0) {
            var Colorbar_red_1 = new THREE.MeshPhongMaterial({
                color: 0xD72F62
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_3 = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_1);
            var tubeMesh4 = createCylinderMesh(TubePoints4[1], PointClose2_3, Colorbar_red_1, tt, tt);
            var tube_arrow4 = createCylinderArrowMesh(TubePoints4[1], new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), Colorbar_red_1, 0.02, 0.05, 0.6);
        }
        if (tubeMesh4_t3 < 0.5 && tubeMesh4_t3 >= 0.25) {
            var Colorbar_red_2 = new THREE.MeshPhongMaterial({
                color: 0xCC0549
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_3 = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_2);
            var tubeMesh4 = createCylinderMesh(TubePoints4[1], PointClose2_3, Colorbar_red_2, tt, tt);
            var tube_arrow4 = createCylinderArrowMesh(TubePoints4[1], new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), Colorbar_red_2, 0.02, 0.05, 0.6);
        }
        if (tubeMesh4_t3 < 0.75 && tubeMesh4_t3 >= 0.5) {
            var Colorbar_red_3 = new THREE.MeshPhongMaterial({
                color: 0x940041
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_3 = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_3);
            var tubeMesh4 = createCylinderMesh(TubePoints4[1], PointClose2_3, Colorbar_red_3, tt, tt);
            var tube_arrow4 = createCylinderArrowMesh(TubePoints4[1], new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), Colorbar_red_3, 0.02, 0.05, 0.6);
        }

        if (tubeMesh4_t3 >= 0.75) {
            var Colorbar_red_4 = new THREE.MeshPhongMaterial({
                color: 0x80002F
            });
            var SphereTest3_Geo = new THREE.SphereGeometry(tt - 0.001);
            var SphereTest3_SP_3 = new THREE.Mesh(SphereTest3_Geo, Colorbar_red_4);
            var tubeMesh4 = createCylinderMesh(TubePoints4[1], PointClose2_3, Colorbar_red_4, tt, tt);
            var tube_arrow4 = createCylinderArrowMesh(TubePoints4[1], new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), Colorbar_red_4, 0.02, 0.05, 0.6);
        }

//                  var tubeMesh4=createCylinderMesh(new THREE.Vector3(TubePoints4[0].x-0.01,TubePoints4[0].y-0.07,TubePoints4[0].z+0.05),TubePoints4[1],Colorbar_red1,tt,tt);
//                  var tube_arrow4=createCylinderArrowMesh(TubePoints4[1],new THREE.Vector3(1.22*TubePoints4[1].x,1.22*TubePoints4[1].y,1.22*TubePoints4[1].z),arrow_material2,0.02,0.05,0.6);
    }
    tubeMesh4.castShadow = true;
    tubeMesh4.name = "tb4";
    Ctrl_tubes.push(tubeMesh4);
    SphereTest3_SP_3.position.copy(PointClose2_3);

    Tube_group.add(tubeMesh4);
    Tube_group.add(tube_arrow4);
    Tube_group.add(SphereTest3_SP_3);


    if (arr_direction[2] >= 0) {

        var tube_arrow42 = createCylinderArrowMesh(new THREE.Vector3(1.2 * TubePoints4[1].x, 1.2 * TubePoints4[1].y, 1.2 * TubePoints4[1].z), TubePoints4[1], arrow_material_outline, 0.023, 0.05, 0.54);
    } else {

        var tube_arrow42 = createCylinderArrowMesh(TubePoints4[1], new THREE.Vector3(1.2 * TubePoints4[1].x, 1.2 * TubePoints4[1].y, 1.2 * TubePoints4[1].z), arrow_material_outline, 0.023, 0.055, 0.62);
    }
    //  Tube_group.add(tube_arrow42);
    tube_arrow42.scale.multiplyScalar(1.2);


    //Tube_group.geometry.center();

    // scene.add(Tube_group);
    //  scene.add(step_group_1);
    scene.add(step_group_2);
    scene.add(form_group);
    scene.add(form_trial);
    scene.add(form_closingplane);
    scene.add(form_greenfaces);
    scene.add(trial_form_2d);
    scene2.add(step_group_1_1);
    scene2.add(trial_force);
    scene2.add(trial_force_2d);
    scene2.add(force_group);
    scene2.add(force_cell);


    //arrow

    L = 3//scale

    Cal_ForcesPnt();//point

    Force_move();

    P_A_Right = Pnt_copy(P_A);
    P_B_Right = Pnt_copy(P_B);
    P_C_Right = Pnt_copy(P_C);
    P_D_Right = Pnt_copy(P_D);


    var vertices = [
        P_A_Right, P_B_Right, P_C_Right, P_D_Right
    ];

    corePoint_body = new THREE.Vector3();

    corePoint_body.x = (P_A_Right.x + P_B_Right.x + P_C_Right.x + P_D_Right.x) / 4;
    corePoint_body.y = (P_A_Right.y + P_B_Right.y + P_C_Right.y + P_D_Right.y) / 4;
    corePoint_body.z = (P_A_Right.z + P_B_Right.z + P_C_Right.z + P_D_Right.z) / 4;

    // for (i = 0;i<geom.faces.length;i++){
    //         var hex = Math.random() * 0xffffff;
    //         geom.faces[i].color.setHex(hex);

    // mesh.children[1].geometry.faces[0].color.set(0xc4c400);
    //  mesh.children[1].geometry.facesNeedUpdate=true;
    //  mesh.children[1].geometry.elementsNeedUpdate = true;
    //     mesh.children[1].geometry.computeFaceNormals();

    // mesh.children[1].geometry.faces[0].color.set(0xFF6347);


    //                     //mesh.children[1].geometry.faces[Number(INTERSECTED.name.charAt(2))-1].material.opacity;
    // mesh.children[1].geometry.facesNeedUpdate=true;
    // mesh.children[1].geometry.elementsNeedUpdate = true;
    // mesh.children[1].geometry.computeFaceNormals();


    mesh.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;

        // e.geometry.faces[0].color.set(0xff00ee);
        // e.geometry.facesNeedUpdate=true;
        e.geometry.elementsNeedUpdate = true;
        e.geometry.computeFaceNormals();
        //e.geometry.center();
    });


    mesh_TriFace1 = create_Tri_FaceMesh(P_A_Right, P_B_Right, P_C_Right, Force_face_dir[0], true, TubePoints1[1].z, 'n1');


    if (Change_N3N4 && Change_BC) {

        mesh_TriFace2 = create_Tri_FaceMesh(P_A_Right, P_D_Right, P_B_Right, Force_face_dir[2], false, arr_direction[1], 'n3');
        mesh_TriFace3 = create_Tri_FaceMesh(P_B_Right, P_D_Right, P_C_Right, Force_face_dir[3], false, arr_direction[2], 'n4');
        mesh_TriFace4 = create_Tri_FaceMesh(P_A_Right, P_C_Right, P_D_Right, Force_face_dir[1], false, arr_direction[0], 'n2');


    } else if (!Change_N3N4 && Change_BC) {
        mesh_TriFace2 = create_Tri_FaceMesh(P_A_Right, P_D_Right, P_B_Right, Force_face_dir[2], false, arr_direction[2], 'n4');
        mesh_TriFace3 = create_Tri_FaceMesh(P_B_Right, P_D_Right, P_C_Right, Force_face_dir[3], false, arr_direction[1], 'n3');
        mesh_TriFace4 = create_Tri_FaceMesh(P_A_Right, P_C_Right, P_D_Right, Force_face_dir[1], false, arr_direction[0], 'n2');


    } else if (Change_N3N4 && !Change_BC) {
        mesh_TriFace2 = create_Tri_FaceMesh(P_A_Right, P_D_Right, P_B_Right, Force_face_dir[2], false, arr_direction[0], 'n2');
        mesh_TriFace3 = create_Tri_FaceMesh(P_B_Right, P_D_Right, P_C_Right, Force_face_dir[3], false, arr_direction[2], 'n4');
        mesh_TriFace4 = create_Tri_FaceMesh(P_A_Right, P_C_Right, P_D_Right, Force_face_dir[1], false, arr_direction[1], 'n3');

    } else if (!Change_N3N4 && !Change_BC) {
        mesh_TriFace2 = create_Tri_FaceMesh(P_A_Right, P_D_Right, P_B_Right, Force_face_dir[2], false, arr_direction[0], 'n2');
        mesh_TriFace3 = create_Tri_FaceMesh(P_B_Right, P_D_Right, P_C_Right, Force_face_dir[3], false, arr_direction[1], 'n3');
        mesh_TriFace4 = create_Tri_FaceMesh(P_A_Right, P_C_Right, P_D_Right, Force_face_dir[1], false, arr_direction[2], 'n4');

    }

    // scene2.add(mesh_TriFace1);
    // scene2.add(mesh_TriFace2);
    // scene2.add(mesh_TriFace3);
    // scene2.add(mesh_TriFace4);

    if (!controls_scale.Arrow_face) {
        mesh_TriFace1.children[0].material.visible = false;
        mesh_TriFace2.children[0].material.visible = false;
        mesh_TriFace3.children[0].material.visible = false;
        mesh_TriFace4.children[0].material.visible = false;

        for (i = 1; i <= 3; i++) {
            mesh_TriFace1.children[i].visible = false;
            mesh_TriFace2.children[i].visible = false;
            mesh_TriFace3.children[i].visible = false;
            mesh_TriFace4.children[i].visible = false;
        }
    }


    var TXMeshA = createSpriteText1("A", P_A_Right);
    var TXMeshB = createSpriteText1("B", P_B_Right);
    var TXMeshC = createSpriteText1("C", P_C_Right);
    var TXMeshD = createSpriteText1("D", P_D_Right);

    text_group2.add(TXMeshA);
    text_group2.add(TXMeshB);
    text_group2.add(TXMeshC);
    text_group2.add(TXMeshD);

    createSpriteText1("A", P_A);
    createSpriteText1("B", P_B);
    createSpriteText1("C", P_C);


    //    scene2.add(TXMeshA_2);
    //    scene2.add(TXMeshB_2);
    //    scene2.add(TXMeshC_2);


    for (i = 0; i <= 8; i++) {
        text_group2.children[4].material.visible = false;
        text_group2.children[5].material.visible = false;
        text_group2.children[6].material.visible = false;
        text_group2.children[7].material.visible = false;
    }


    // createTextMesh1('A',P_A_Right);
    // createTextMesh1('B',P_B_Right);
    // createTextMesh1('C',P_C_Right);
    // createTextMesh1('D',P_D_Right);


    scene.add(text_group1);
    scene.add(text_closingplane_group);
    scene.add(text_closingplane_trial_group);
    scene.add(text_closingplane_2dtrial_group);
    scene2.add(text_force_trial_group);
    scene2.add(text_force_2dtrial_group);

    //  scene2.add(text_group2);
}


function redraw_pair_base() {
    // scene.remove(textf1);
    // scene.remove(textf2);

    scene2.remove(Tube_group_pair);

    Tube_group_pair = new THREE.Group();


    //dir
    var arr_direction = arrow_direction(TubePoints1[1], TubePoints2[1], TubePoints3[1], TubePoints4[1]);

    var arrow_material_p = new THREE.MeshPhongMaterial({
        color: 0x000080
    });
    var arrow_material2 = new THREE.MeshPhongMaterial({
        color: 0xC00000
    });//color


    //formcenter


    var material = new THREE.MeshPhongMaterial({color: 0x5a5a5a, transparent: true, opacity: 0.2});

    var spGeom0 = new THREE.SphereGeometry(0.04);
    var sp_Tube0 = new THREE.Mesh(spGeom0, material);

    // sp_Tube0.name="sp0";
    sp_Tube0.position.copy(new THREE.Vector3(0, 0, 0));
    sp_Tube0.castShadow = true;

    //Ctrl_tubes.push(sp_Tube0);


    //scene.add(text0);
    //text0.position.copy(new THREE.vertices(0.2,0,0));
    //text_group1.add(text0);


    Tube_group_pair.add(sp_Tube0);
    // add the points as a group to the scene
    //scene.add(spMesh);


    //mesh sphere1scene.remove(tubeMesh1);

    // var material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});
    var material2 = new THREE.MeshPhongMaterial({color: 0x5a5a5a, transparent: false});

    var spGeom1 = new THREE.SphereGeometry(0.04);
    var sp_tube1 = new THREE.Mesh(spGeom1, material2);
    sp_tube1.position.copy(TubePoints1[1]);

    sp_tube1.castShadow = true;

    // sp_tube1.name="sp1";//select

    // add the points as a group to the scene
    //     Tube_group_pair.add(sp_tube1);

    // Ctrl_tubes.push(sp_tube1);

    var lattice_pair_material1 = new THREE.MeshPhongMaterial({
        color: 0xdcdcdc, transparent: true, opacity: 0.2
    });


    var tubeMesh1 = createCylinderMesh(TubePoints1[0], TubePoints1[1], lattice_pair_material1, 0.02, 0.02);
    tubeMesh1.castShadow = true;
    //tubeMesh1.name="tb1";
    //Ctrl_tubes.push(tubeMesh1);

    Tube_group_pair.add(tubeMesh1);

    var arrow_material1 = new THREE.MeshPhongMaterial({
        color: 0x009600
    });


    //arrow

    if (TubePoints1[1].z >= 0)//arrow p

        createCylinderArrowMesh(new THREE.Vector3(1.5 * TubePoints1[1].x, 1.5 * TubePoints1[1].y, 1.5 * TubePoints1[1].z), TubePoints1[1], arrow_material1, 0.02, 0.05, 0.7);
    else
        createCylinderArrowMesh(TubePoints1[1], new THREE.Vector3(1.5 * TubePoints1[1].x, 1.5 * TubePoints1[1].y, 1.5 * TubePoints1[1].z), arrow_material1, 0.02, 0.05, 0.7);

    //        Tube_group_pair.add(tube_arrow1);


    //mesh sphere2

    var material3 = new THREE.MeshPhongMaterial({color: 0x5a5a5a, transparent: false});

    var spGeom2 = new THREE.SphereGeometry(0.04);
    var sp_tube2 = new THREE.Mesh(spGeom2, material3);
    sp_tube2.position.copy(TubePoints2[1]);
    // add the points as a group to the scene
    // sp_tube2.name="sp2";//select
    // Ctrl_pts.push(sp_tube2);
    //         Tube_group_pair.add(sp_tube2);
    sp_tube2.castShadow = true;

    var lattice_pair_material2 = new THREE.MeshPhongMaterial({
        color: 0xdcdcdc, transparent: true, opacity: 0.2
    });

    var tubeMesh2 = createCylinderMesh(TubePoints2[0], TubePoints2[1], lattice_pair_material2, 0.02, 0.02);
    tubeMesh2.castShadow = true;
    //tubeMesh2.name="tb2";
    // Ctrl_tubes.push(tubeMesh2);

    Tube_group_pair.add(tubeMesh2);

    //arrow

    if (arr_direction[0] >= 0)//arrow air

        createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), TubePoints2[1], arrow_material_p, 0.02, 0.05, 0.6);

    else
        createCylinderArrowMesh(TubePoints2[1], new THREE.Vector3(1.22 * TubePoints2[1].x, 1.22 * TubePoints2[1].y, 1.22 * TubePoints2[1].z), arrow_material2, 0.02, 0.05, 0.6);

    //      Tube_group_pair.add(tube_arrow2);

    //mesh sphere3

    var material4 = new THREE.MeshPhongMaterial({color: 0x5a5a5a, transparent: false});

    var spGeom3 = new THREE.SphereGeometry(0.04);
    var sp_tube3 = new THREE.Mesh(spGeom3, material4);
    sp_tube3.position.copy(TubePoints3[1]);
    //sp_tube3.name="sp3";//select
    // add the points as a group to the scene
    // Ctrl_pts.push(sp_tube3);
    //           Tube_group_pair.add(sp_tube3);
    sp_tube3.castShadow = true;

    var lattice_pair_material3 = new THREE.MeshPhongMaterial({
        color: 0xdcdcdc, transparent: true, opacity: 0.2
    });

    var tubeMesh3 = createCylinderMesh(TubePoints3[0], TubePoints3[1], lattice_pair_material3, 0.02, 0.02);

    tubeMesh3.castShadow = true;
    // tubeMesh3.name="tb3";
    // Ctrl_tubes.push(tubeMesh3);

    Tube_group_pair.add(tubeMesh3);

    //arrow

    if (arr_direction[1] >= 0)

        createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), TubePoints3[1], arrow_material_p, 0.02, 0.05, 0.6);
    else
        createCylinderArrowMesh(TubePoints3[1], new THREE.Vector3(1.22 * TubePoints3[1].x, 1.22 * TubePoints3[1].y, 1.22 * TubePoints3[1].z), arrow_material2, 0.02, 0.05, 0.6);

    //          Tube_group_pair.add(tube_arrow3);

    //mesh sphere4
    var material5 = new THREE.MeshPhongMaterial({color: 0x5a5a5a, transparent: false});

    var spGeom4 = new THREE.SphereGeometry(0.04);
    var sp_tube4 = new THREE.Mesh(spGeom4, material5);
    sp_tube4.position.copy(TubePoints4[1]);
    sp_tube4.castShadow = true;

    // sp_tube4.name="sp4";//select
    // Ctrl_pts.push(sp_tube4);
    // add the points as a group to the scene
    //           Tube_group_pair.add(sp_tube4);

    var lattice_pair_material4 = new THREE.MeshPhongMaterial({
        color: 0xdcdcdc, transparent: true, opacity: 0.2
    });

    var tubeMesh4 = createCylinderMesh(TubePoints4[0], TubePoints4[1], lattice_pair_material4, 0.02, 0.02);

    tubeMesh4.castShadow = true;
    //tubeMesh4.name="tb4";
    //Ctrl_tubes.push(tubeMesh4);

    Tube_group_pair.add(tubeMesh4);

    //arrow

    if (arr_direction[2] >= 0)
        createCylinderArrowMesh(new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), TubePoints4[1], arrow_material_p, 0.02, 0.05, 0.6);
    else
        createCylinderArrowMesh(TubePoints4[1], new THREE.Vector3(1.22 * TubePoints4[1].x, 1.22 * TubePoints4[1].y, 1.22 * TubePoints4[1].z), arrow_material2, 0.02, 0.05, 0.6);

    //        Tube_group_pair.add(tube_arrow4);

    scene2.add(Tube_group_pair);
}


var mesh_F1;
var mesh_F2;
var mesh_F3;
var mesh_F4;

var mesh_F1_pair;
var mesh_F2_pair;
var mesh_F3_pair;
var mesh_F4_pair;


function redraw_Force() {


    scene.remove(mesh_F1);
    scene.remove(mesh_F2);
    scene.remove(mesh_F3);
    scene.remove(mesh_F4);


    //arrow
    if (controls_scale.scale < controls_scale.MaxScale)
        L = controls_scale.scale;
    else
        L = controls_scale.MaxScale;  //scale

    Cal_ForcesPnt();//point

    Force_move_left();

    P_A_Left = Pnt_copy(P_A);
    P_B_Left = Pnt_copy(P_B);
    P_C_Left = Pnt_copy(P_C);
    P_D_Left = Pnt_copy(P_D);


    var vertices = [
        P_A_Left, P_B_Left, P_C_Left, P_D_Left
    ];

    // for (i = 0;i<geom.faces.length;i++){
    //         var hex = Math.random() * 0xffffff;
    //         geom.faces[i].color.setHex(hex);
    //     }

    mesh_left.children.forEach(function (e) {
        e.geometry.vertices = vertices;
        e.geometry.verticesNeedUpdate = true;

        // e.geometry.faces[0].color.set(0xff00ee);
        // e.geometry.facesNeedUpdate=true;
        e.geometry.elementsNeedUpdate = true;
        e.geometry.computeFaceNormals();
        //e.geometry.center();
    });


    // scene.add(mesh_F1);

    L = controls_scale.MaxScale;   //scale

    Cal_ForcesPnt();//point

    Force_move_left();

    var P_A_Scale = Pnt_copy(P_A);
    var P_B_Scale = Pnt_copy(P_B);
    var P_C_Scale = Pnt_copy(P_C);
    var P_D_Scale = Pnt_copy(P_D);

    var coreN1 = face_center(P_A_Scale, P_B_Scale, P_C_Scale);
    var coreN2 = face_center(P_A_Scale, P_B_Scale, P_D_Scale);
    var coreN3 = face_center(P_B_Scale, P_C_Scale, P_D_Scale);
    var coreN4 = face_center(P_A_Scale, P_C_Scale, P_D_Scale);

    mesh_F1 = create_TriangleMesh(P_A_Left, P_B_Left, P_C_Left, TubePoints1[1], coreN1);
    mesh_F4 = create_TriangleMesh(P_A_Left, P_C_Left, P_D_Left, TubePoints2[1], coreN4);


    if (Change_N3N4) {
        mesh_F2 = create_TriangleMesh(P_A_Left, P_B_Left, P_D_Left, TubePoints3[1], coreN2);

        mesh_F3 = create_TriangleMesh(P_B_Left, P_C_Left, P_D_Left, TubePoints4[1], coreN3);

    } else {
        mesh_F2 = create_TriangleMesh(P_A_Left, P_B_Left, P_D_Left, TubePoints4[1], coreN2);

        mesh_F3 = create_TriangleMesh(P_B_Left, P_C_Left, P_D_Left, TubePoints3[1], coreN3);

    }


    scene.add(mesh_F1);
    scene.add(mesh_F2);
    scene.add(mesh_F3);
    scene.add(mesh_F4);


    if (controls_scale.Pair_Control) {


        scene2.remove(mesh_F1_pair);
        scene2.remove(mesh_F2_pair);
        scene2.remove(mesh_F3_pair);
        scene2.remove(mesh_F4_pair);

        if (controls_scale.scale < controls_scale.MaxScale)
            L = controls_scale.MaxScale - controls_scale.scale;
        else
            L = 0;


        Cal_ForcesPnt();//point

        Force_move_left();

        P_A_Left_Pair = Pnt_copy(P_A);
        P_B_Left_Pair = Pnt_copy(P_B);
        P_C_Left_Pair = Pnt_copy(P_C);
        P_D_Left_Pair = Pnt_copy(P_D);


        var vertices_pair = [
            P_A_Left_Pair, P_B_Left_Pair, P_C_Left_Pair, P_D_Left_Pair
        ];


        mesh_left_pair.children.forEach(function (e) {
            e.geometry.vertices = vertices_pair;
            e.geometry.verticesNeedUpdate = true;

            // e.geometry.faces[0].color.set(0xff00ee);
            // e.geometry.facesNeedUpdate=true;
            e.geometry.elementsNeedUpdate = true;
            e.geometry.computeFaceNormals();
            //e.geometry.center();
        });


        L = controls_scale.MaxScale;   //scale

        Cal_ForcesPnt();//point

        Force_move_left();

        var P_A_Scale_pair = Pnt_copy(P_A);
        var P_B_Scale_pair = Pnt_copy(P_B);
        var P_C_Scale_pair = Pnt_copy(P_C);
        var P_D_Scale_pair = Pnt_copy(P_D);

        var coreN1_pair = face_center(P_A_Scale_pair, P_B_Scale_pair, P_C_Scale_pair);
        var coreN2_pair = face_center(P_A_Scale_pair, P_B_Scale_pair, P_D_Scale_pair);
        var coreN3_pair = face_center(P_B_Scale_pair, P_C_Scale_pair, P_D_Scale_pair);
        var coreN4_pair = face_center(P_A_Scale_pair, P_C_Scale_pair, P_D_Scale_pair);

        mesh_F1_pair = create_TriangleMesh(P_A_Left_Pair, P_B_Left_Pair, P_C_Left_Pair, TubePoints1[1], coreN1_pair);
        mesh_F4_pair = create_TriangleMesh(P_A_Left_Pair, P_C_Left_Pair, P_D_Left_Pair, TubePoints2[1], coreN4_pair);


        if (Change_N3N4) {
            mesh_F2_pair = create_TriangleMesh(P_A_Left_Pair, P_B_Left_Pair, P_D_Left_Pair, TubePoints3[1], coreN2_pair);

            mesh_F3_pair = create_TriangleMesh(P_B_Left_Pair, P_C_Left_Pair, P_D_Left_Pair, TubePoints4[1], coreN3_pair);

        } else {
            mesh_F2_pair = create_TriangleMesh(P_A_Left_Pair, P_B_Left_Pair, P_D_Left_Pair, TubePoints4[1], coreN2_pair);

            mesh_F3_pair = create_TriangleMesh(P_B_Left_Pair, P_C_Left_Pair, P_D_Left_Pair, TubePoints3[1], coreN3_pair);

        }


        scene2.add(mesh_F1_pair);
        scene2.add(mesh_F2_pair);
        scene2.add(mesh_F3_pair);
        scene2.add(mesh_F4_pair);

    }


}


var Force_face_dir = [];
var Change_BC = false;

function Cal_ForcesPnt() {


    var origin_N1 = Pnt_copy(TubePoints1[1]);
    var origin_N2 = Pnt_copy(TubePoints2[1]);
    var origin_N3 = Pnt_copy(TubePoints3[1]);
    var origin_N4 = Pnt_copy(TubePoints4[1]);

    origin_N1.multiplyScalar(-1);
    origin_N2.multiplyScalar(-1);
    origin_N3.multiplyScalar(-1);
    origin_N4.multiplyScalar(-1);

    var aa = Cal_Arrange_AA(origin_N1, origin_N2, origin_N3, origin_N4);

    origin_N1.normalize();

    var L_AB = cross(origin_N1, aa[0]);

    P_A = new THREE.Vector3(0, 0, 0);
    //m=Math.sqrt()
    var m = Math.sqrt(L * L / Math.pow(norm(L_AB), 2));

    P_B = new THREE.Vector3((P_A.x + m * L_AB.x), (P_A.y + m * L_AB.y), (P_A.z + m * L_AB.z));

    var L_BC = cross(origin_N1, aa[1]);
    var L_CA = cross(origin_N1, aa[2]);

    P_C = new THREE.Vector3(0, 0, 0);
    P_C = LinesSectPt(L_BC, P_B, L_CA, P_A);

    var L_BD = cross(aa[1], aa[0]);
    var L_DC = cross(aa[1], aa[2]);

    P_D = new THREE.Vector3(0, 0, 0);

    P_D = LinesSectPt(L_BD, P_B, L_DC, P_C);

    Change_BC = false;

    var F1 = cross(P_B, P_C);

    if (F1.z > 0) {
        var temp = Pnt_copy(P_B);
        P_B = Pnt_copy(P_C);
        P_C = Pnt_copy(temp);
        Change_BC = true;
    }


    var P_BA = new THREE.Vector3().subVectors(P_B, P_A);
    var P_CB = new THREE.Vector3().subVectors(P_C, P_B);

    var P_CA = new THREE.Vector3().subVectors(P_C, P_A);
    var P_DC = new THREE.Vector3().subVectors(P_D, P_C);

    var P_DA = new THREE.Vector3().subVectors(P_D, P_A);
    var P_BD = new THREE.Vector3().subVectors(P_B, P_D);

    var P_DB = new THREE.Vector3().subVectors(P_D, P_B);
    var P_CD = new THREE.Vector3().subVectors(P_C, P_D);

    F1 = cross(P_BA, P_CB);
    var F2 = cross(P_CA, P_DC);
    var F3 = cross(P_DA, P_BD);
    var F4 = cross(P_DB, P_CD);

    Force_face_dir = [];

    Force_face_dir.push(F1);
    Force_face_dir.push(F2);
    Force_face_dir.push(F3);
    Force_face_dir.push(F4);


}


function Force_move() {
    var P_A_temp = Pnt_copy(P_A);

    P_A = subVec(P_A, P_A_temp);
    P_B = subVec(P_B, P_A_temp);
    P_C = subVec(P_C, P_A_temp);
    P_D = subVec(P_D, P_A_temp);


    var corePoint = new THREE.Vector3();
    corePoint.x = (P_A.x + P_B.x + P_C.x + P_D.x) / 4;
    corePoint.y = (P_A.y + P_B.y + P_C.y + P_D.y) / 4;
    corePoint.z = (P_A.z + P_B.z + P_C.z + P_D.z) / 4;


    if (corePoint_temp.x === 0 && corePoint_temp.y === 0 && corePoint_temp.z === 0) {
        corePoint_temp = Pnt_copy(corePoint);
    }

    P_A = subVec(P_A, corePoint_temp);
    P_B = subVec(P_B, corePoint_temp);
    P_C = subVec(P_C, corePoint_temp);
    P_D = subVec(P_D, corePoint_temp);

}


function Force_move_left() {

    var P_A_temp = Pnt_copy(P_A);

    P_A = subVec(P_A, P_A_temp);
    P_B = subVec(P_B, P_A_temp);
    P_C = subVec(P_C, P_A_temp);
    P_D = subVec(P_D, P_A_temp);


    var corePoint = new THREE.Vector3();
    corePoint.x = (P_A.x + P_B.x + P_C.x + P_D.x) / 4;
    corePoint.y = (P_A.y + P_B.y + P_C.y + P_D.y) / 4;
    corePoint.z = (P_A.z + P_B.z + P_C.z + P_D.z) / 4;


    P_A = subVec(P_A, corePoint);
    P_B = subVec(P_B, corePoint);
    P_C = subVec(P_C, corePoint);
    P_D = subVec(P_D, corePoint);

}


function subVec(n1, n2) {
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

function norm(n1) {
    return Math.sqrt(n1.x * n1.x + n1.y * n1.y + n1.z * n1.z);
}

function distance(n1, n2) {
    return Math.sqrt((n1.x - n2.x) * (n1.x - n2.x) + (n1.y - n2.y) * (n1.y - n2.y) + (n1.z - n2.z) * (n1.z - n2.z));
}

function face_center(n1, n2, n3) {

    var face_centerD = new THREE.Vector3();

    face_centerD.x = (n1.x + n2.x + n3.x) / 3;
    face_centerD.y = (n1.y + n2.y + n3.y) / 3;
    face_centerD.z = (n1.z + n2.z + n3.z) / 3;

    return face_centerD;


}


function Pnt_copy(n1) {

    var n2 = new THREE.Vector3(0, 0, 0);
    n2.x = n1.x;
    n2.y = n1.y;
    n2.z = n1.z;
    return n2;
}

function arrow_direction(n1, n2, n3, n4) {

    var matr3 = new THREE.Matrix3();
    matr3.elements = [n2.x, n2.y, n2.z, n3.x, n3.y, n3.z, n4.x, n4.y, n4.z];

    var matr3_Inver = new THREE.Matrix3();

    matr3_Inver.getInverse(matr3);

    var arr_direct = [];

    var Ma3 = matr3_Inver.elements;

    var a1 = Ma3[0] * (-1) * n1.x + Ma3[3] * (-1) * n1.y + Ma3[6] * (-1) * n1.z;
    //var a1=Ma3[0]*(-1)*n1.x+Ma3[3]*(-1)*n1.y+Ma3[6]*(-1)*n1.z;
    arr_direct.push(a1);

    var a2 = Ma3[1] * (-1) * n1.x + Ma3[4] * (-1) * n1.y + Ma3[7] * (-1) * n1.z;
    arr_direct.push(a2);

    var a3 = Ma3[2] * (-1) * n1.x + Ma3[5] * (-1) * n1.y + Ma3[8] * (-1) * n1.z;
    arr_direct.push(a3);

    return arr_direct;


}

function Cal_Arrange_AA(n1, n2, n3, n4) {

    var n11 = Pnt_copy(n1);
    var n22 = Pnt_copy(n2);
    var n33 = Pnt_copy(n3);
    var n44 = Pnt_copy(n4);

    n11.normalize();
    n22.normalize();
    n33.normalize();
    n44.normalize();

    Change_N3N4 = false;


    var CO = arrow_direction(n11, n22, n33, n44);
    var AngV = Math.atan2(n22.y, n22.x);


    if (CO[0] < 0) {
        n22.x = -n22.x;
        n22.y = -n22.y;
        n22.z = -n22.z;
    }
    if (CO[1] < 0) {
        n33.x = -n33.x;
        n33.y = -n33.y;
        n33.z = -n33.z;
    }
    if (CO[2] < 0) {
        n44.x = -n44.x;
        n44.y = -n44.y;
        n44.z = -n44.z;
    }


    Rotate_Vec(n22, new THREE.Vector3(0, 0, 1), -AngV);//反向旋转
    var n33_ang = Rotate_Vec(n33, new THREE.Vector3(0, 0, 1), -AngV);
    var n44_ang = Rotate_Vec(n44, new THREE.Vector3(0, 0, 1), -AngV);


    //var AngN33=Math.atan2(n33_ang.y,n33_ang.x);


    var AngN3 = Math.atan2(n33_ang.y, n33_ang.x);
    if (AngN3 < 0)
        AngN3 = AngN3 + 2.0 * Math.PI;
    var AngN4 = Math.atan2(n44_ang.y, n44_ang.x);
    if (AngN4 < 0)
        AngN4 = AngN4 + 2.0 * Math.PI;

    var AA = [];
    AA.push(n22);

    if (AngN3 < AngN4) {
        AA.push(n33);
        AA.push(n44);
    } else {
        AA.push(n44);
        AA.push(n33);
        Change_N3N4 = true;
    }

    return AA;
}


function Rotate_Vec(p1, R_V, Theta) {
    //  function [P2] = Rotate_Vec(P1, R_V, theta)

    var vector = Pnt_copy(p1);
    var axis = Pnt_copy(R_V);

    vector.applyAxisAngle(axis, Theta);
    return vector;
}


function LinesSectPt(L1_dir, P1_pnt, L2_dir, P2_pnt) {

    var L1_dir1 = Pnt_copy(L1_dir);
    var L2_dir2 = Pnt_copy(L2_dir);

    L1_dir1.x = L1_dir.x / norm(L1_dir);
    L1_dir1.y = L1_dir.y / norm(L1_dir);
    L1_dir1.z = L1_dir.z / norm(L1_dir);

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


function Cal_Vec(vec1, vec2, vec3, n) {

    var cb = new THREE.Vector3(),
        ab = new THREE.Vector3(),
        normal = new THREE.Vector3();
        cb.subVectors(vec1, vec2);
    ab.subVectors(vec3, vec2);
    ab.cross(cb);
    normal.copy(ab).normalize();


    return new THREE.Vector3(vec2.x - n * normal.x, vec2.y - n * normal.y, vec2.z - n * normal.z);
}


function generatePoints(points) {
    // add n random spheres
    var geometry = new THREE.Geometry();
    geometry.vertices.push(points[0]);
    geometry.vertices.push(points[1]);

    return new THREE.Line(geometry, lattice_line_material);
}


var stats;

function initStats() {
    stats = new Stats();
    //document.body.appendChild(stats.dom);
}

var gui;


var step = 0;

var INTERSECTED;
var SELECTED;

function render() {

    stats.update();


    var rayCaster2 = new THREE.Raycaster();
    rayCaster2.setFromCamera(mouse, camera);
    var intersects = rayCaster2.intersectObjects(Ctrl_tubes);

    // if(intersects.length>0) {

    //     intersects[0].object.material.color.set(0xff00ff);

    // }
    if (intersects.length > 0) {

        //geom.faces[0].color.set(0xff00ff);
        //mesh.materials[1].color.set(0xff00ff);
        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) {
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);


                if (INTERSECTED.name.charAt(0) === 's') {
                    // mesh.children[1].material.color.set(0x156289);
                    mesh.children[1].geometry.faces[0].color.set(0x009600);

                    for (i = 1; i <= 3; i++) {
                        mesh.children[1].geometry.faces[i].color.set(0x0F3150);
                    }

                    mesh.children[1].geometry.facesNeedUpdate = true;
                    mesh.children[1].geometry.elementsNeedUpdate = true;
                    mesh.children[1].geometry.computeFaceNormals();
                } else if (INTERSECTED.name.charAt(0) === 't') {
                    var num2 = Number(INTERSECTED.name.charAt(2)) - 1;
                    if (num2 > 0) {
                        mesh.children[1].geometry.faces[Number(INTERSECTED.name.charAt(2)) - 1].color.set(0x0F3150);

                    } else
                        mesh.children[1].geometry.faces[0].color.set(0x009600);

                    mesh.children[1].geometry.facesNeedUpdate = true;
                    mesh.children[1].geometry.elementsNeedUpdate = true;
                    mesh.children[1].geometry.computeFaceNormals();


                } else if (INTERSECTED.name.charAt(0) === 'f') {
                    if (INTERSECTED.name.charAt(1) === 'p') {


                    }
                    if (INTERSECTED.name.charAt(1) === 't') {

                    }
                }


            }


            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.set(0xFF6347);


            if (INTERSECTED.name.charAt(0) === 's') {
                for (i = 0; i <= 3; i++) {
                    mesh.children[1].geometry.faces[i].color.set(0xFF6347);
                }
                mesh.children[1].geometry.facesNeedUpdate = true;
                mesh.children[1].geometry.elementsNeedUpdate = true;
                mesh.children[1].geometry.computeFaceNormals();
                //mesh.children[1].material.color.set(0xFF6347);
            } else if (INTERSECTED.name.charAt(0) === 't') {

                mesh.children[1].geometry.faces[Number(INTERSECTED.name.charAt(2)) - 1].color.set(0xFF6347);


                //mesh.children[1].geometry.faces[Number(INTERSECTED.name.charAt(2))-1].material.opacity;
                mesh.children[1].geometry.facesNeedUpdate = true;
                mesh.children[1].geometry.elementsNeedUpdate = true;
                mesh.children[1].geometry.computeFaceNormals();

            } else if (INTERSECTED.name.charAt(0) === 'f') {
                if (INTERSECTED.name.charAt(1) === 'p') {


                }
                if (INTERSECTED.name.charAt(1) === 't') {

                }
            }
        }


    } else {
        if (INTERSECTED) {
            INTERSECTED.material.color.set(INTERSECTED.currentHex);


            if (INTERSECTED.name.charAt(0) === 's') {

                mesh.children[1].geometry.faces[0].color.set(0x009600);
                for (i = 1; i <= 3; i++) {
                    mesh.children[1].geometry.faces[i].color.set(0x0F3150);
                }
                mesh.children[1].geometry.facesNeedUpdate = true;
                mesh.children[1].geometry.elementsNeedUpdate = true;
                mesh.children[1].geometry.computeFaceNormals();

                //mesh.children[1].material.color.set(0x156289);
            } else if (INTERSECTED.name.charAt(0) === 't') {
                var num3 = Number(INTERSECTED.name.charAt(2)) - 1;
                if (num3 > 0) {
                    mesh.children[1].geometry.faces[Number(INTERSECTED.name.charAt(2)) - 1].color.set(0x0F3150);

                } else
                    mesh.children[1].geometry.faces[0].color.set(0x009600);

                mesh.children[1].geometry.facesNeedUpdate = true;

                mesh.children[1].geometry.elementsNeedUpdate = true;
                mesh.children[1].geometry.computeFaceNormals();
            } else if (INTERSECTED.name.charAt(0) === 'f') {
                if (INTERSECTED.name.charAt(1) === 'p') {


                }
                if (INTERSECTED.name.charAt(1) === 't') {

                }
            }

        }
        INTERSECTED = null;
    }


    renderer.clear();
    renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight)
    renderer.render(scene, camera);

    renderer.autoClear = false;
    renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight)
    renderer.render(scene2, camera);
}


function animate() {


    stats.update();
    requestAnimationFrame(animate);
    orbit_ctrl.update();
    //trfm_ctrl.update();
    render();
    TWEEN.update();
}


function draw() {
    initRender();
    initScene();
    initCamera();
    orbit_ctrl = new THREE.OrbitControls(camera, renderer.domElement);
    orbit_ctrl.maxDistance = 50;
    orbit_ctrl.minDistance = 1;
    //initLight();
    initModel();


    initStats();
    //initGui();

    animate();
    //window.onresize = onWindowResize;
}