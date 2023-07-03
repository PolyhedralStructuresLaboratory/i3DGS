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

leftHeader.addEventListener("mousedown", () => {
    isMouseDownOnLeft = true;
});

rightHeader.addEventListener("mousedown", () => {
    isMouseDownOnRight = true;
});

window.addEventListener("mouseup", () => {
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

//creating the first Tweakpane.Pane (left)
const paneLeft = new Tweakpane.Pane({
    container: document.getElementById('left_container'),
});

const tab = paneLeft.addTab({
    pages: [
        {title: 'SubD'},
        {title: 'Trial'},
        {title: 'Initial'}
    ],
});

//tweakpane - left panel (second tab)
const subdCheckboxParams = {
    'on': false, //at first, box is unchecked so value is "false"
};
const subdCheckbox = tab.pages[0].addInput(subdCheckboxParams, 'on').on
('change', () => { //on change, dispose old plane geometry and create new

});

const offsetSliderParams = {
    'GDoF length': 0.4, //starts as double the size of the box's params
};
//make the plane size slider
const offsetSlider = tab.pages[0].addInput(offsetSliderParams, 'GDoF length', {
    min: 0.2, //min = double the size of the box's params
    max: 0.8, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new

});

offsetSlider.hidden = true;

subdCheckbox.on('change', () => { //on change, change the hidden and visibility values set
    offsetSlider.hidden = !offsetSlider.hidden;
});

//tweakpane - left panel (second tab)

const trialVisibilityCheckboxParams = {
    'show': false, //at first, box is unchecked so value is "false"
};
const trialVisibilityCheckbox = tab.pages[1].addInput(trialVisibilityCheckboxParams, 'show').on
('change', () => { //on change, dispose old plane geometry and create new

});
const trialHeightSliderParams = {
    trialHeight: -2,
};
const trialHeightSlider = tab.pages[1].addInput(trialHeightSliderParams, 'trialHeight', {
    min: -4, //min = double the size of the box's params
    max: 1, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new

});

const heightSliderParams = {
    height: 0.7, //starts as double the size of the box's params
};
//make the plane size slider
const heightSlider = tab.pages[1].addInput(heightSliderParams, 'height', {
    min: 0.5, //min = double the size of the box's params
    max: 1, //max = quadruple the size of the box's params
}).on('change', (ev) => { //on change, dispose old plane geometry and create new

});

trialHeightSlider.hidden = true;
heightSlider.hidden = true;

const faceVisibilityCheckboxParams = {
    'face': false,
};

const faceVisibilityCheckbox = tab.pages[2].addInput(faceVisibilityCheckboxParams, 'face').on
('change', () => { //on change, dispose old plane geometry and create new

});

const globalVisibilityCheckboxParams = {
    'global': false, //at first, box is unchecked so value is "false"
};
const globalVisibilityCheckbox = tab.pages[2].addInput(globalVisibilityCheckboxParams, 'global').on
('change', (ev) => { //on change, dispose old plane geometry and create new

});


//tweakpane - new panel (right)

const paneRight = new Tweakpane.Pane({
    container: document.getElementById('right_container'),
});

const heightParams = {
    height: 2,
};
const oSlider = paneRight.addInput(heightParams, 'height', {
    min: -2,
    max: 4,
})
oSlider.on('change', (ev) => { //on change, dispose old geometry and create new

});

trialVisibilityCheckbox.on('change', () => { //on change, change the hidden and visibility values set
    trialHeightSlider.hidden = !trialHeightSlider.hidden;
    heightSlider.hidden = !heightSlider.hidden;
    oSlider.disabled = !oSlider.disabled;
});