const container = document.querySelector(".container");

// Create boxes
const boxA = createBox("A", 100, 200, "red");
const boxB = createBox("B", 700, 600, "red");

const boxC = createRelativeBox("C", boxA, boxB, "lightblue", 4/6);
const boxD = createRelativeBox("D", boxA, boxB, "lightblue", 2/6);

let startX = 0,
    startY = 0,
    newX = 0,
    newY = 0,
    selectedBox = null



function createBox(name, posX, posY, color){
    const box = document.createElement("div");
    if(document.querySelectorAll('.box').length < 2){
        box.classList.add('anchor');
    }
    box.classList.add("box");
    box.textContent = name;
    box.style.setProperty("--boxColor", color);
    box.style.transform = `translate(${posX}px, ${posY}px)`;
    box.addEventListener('mousedown', mouseDown)
    container.appendChild(box);

    return box
}

function createRelativeBox(name, elemA, elemB, color, space){
    const box = document.createElement("div");
    box.classList.add("box");
    box.textContent = name;
    box.style.setProperty("--boxColor", color);
    const {x, y} = vLinInt(elemA, elemB, space);
    box.style.transform = `translate(${x}px, ${y}px)`;
    container.appendChild(box)

    elemA.addEventListener('mousemove', () => {
        const {x, y} = vLinInt(elemA, elemB, space);
        box.style.transform = `translate(${x}px, ${y}px)`;
    })

    elemB.addEventListener('mousemove', () => {
        const {x, y} = vLinInt(elemA, elemB, space);
        box.style.transform = `translate(${x}px, ${y}px)`;
    })
}

function vLinInt(A, B, t){
    let AStyles = getComputedStyle(A);
    let BStyles = getComputedStyle(B);
    let matrixA = new DOMMatrixReadOnly(AStyles.transform);
    let matrixB = new DOMMatrixReadOnly(BStyles.transform);
    let Ax = matrixA.m41;
    let Ay = matrixA.m42;
    let Bx = matrixB.m41;
    let By = matrixB.m42;

    return {
        x: Ax + (Bx - Ax) * t,
        y: Ay + (By - Ay) * t
    }

}

function mouseDown(e){
    startX = e.clientX;
    startY = e.clientY;
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    selectedBox = e.target.closest('.box');
    selectedBox.style.scale = 1.1;
    selectedBox.style.transformOrigin = `${startX}px ${startY}px`;
}

function mouseMove(e){
    //Direction du déplacement
    newX = startX - e.clientX;
    newY = startY - e.clientY;

    // On reset la position de base de la souris
    startX = e.clientX;
    startY = e.clientY;
    
    let boxStyles = getComputedStyle(selectedBox);
    let matrix = new DOMMatrixReadOnly(boxStyles.transform);
    let transformX = matrix.m41;
    let transformY = matrix.m42;

    //On modifie la position de la box de sa valeur + 1 pixel du mouvement
    selectedBox.style.transformOrigin = `${transformX - newX}px ${transformY - newY}px`;
    selectedBox.style.transform = `translate(${transformX - newX}px, ${transformY - newY}px)`;
}

function mouseUp(e){
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
    selectedBox.style.scale = 1;
    selectedBox = null;
}