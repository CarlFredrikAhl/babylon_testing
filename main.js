const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas, true);

function createScene() {

    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(-20, 10, -20), scene);
    camera.attachControl(canvas, true);
    camera.rotation.y = BABYLON.Tools.ToRadians(50);
    camera.rotation.x = BABYLON.Tools.ToRadians(20);
    
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

    //OBJECTS
    const ground = buildGround(30, 30);

    //const box = buildBox(2);
    const regularHouse = buildHouse(1);
    const semiHouse = buildHouse(2);
    semiHouse.position.z = 3;

    //Create village from the first houses
    const places = []; // [house type, rotation, x, z]
    places.push([1, BABYLON.Tools.ToRadians(20), -3, -5]);
    places.push([2, BABYLON.Tools.ToRadians(45), -3, 12]);
    places.push([1, BABYLON.Tools.ToRadians(50), -10, 5]);
    places.push([1, BABYLON.Tools.ToRadians(30), 12, 5]);
    places.push([2, BABYLON.Tools.ToRadians(60), -7, -5]);
    places.push([2, BABYLON.Tools.ToRadians(70), -3, -8]);
    places.push([2, BABYLON.Tools.ToRadians(80), 9, 5]);
    places.push([1, BABYLON.Tools.ToRadians(90), 2,  10]);
    places.push([1, BABYLON.Tools.ToRadians(100), -13, -5]);
    places.push([1, BABYLON.Tools.ToRadians(110), -12, -12]);
    places.push([2, BABYLON.Tools.ToRadians(112), 4, -5]);
    places.push([1, BABYLON.Tools.ToRadians(113), -3, 1]);
    places.push([1, BABYLON.Tools.ToRadians(180), -10, -5]);

    const houses = [];

    for(let i = 0; i < places.length; i++) {
        
        if(places[i][0] == 1) {
            houses[i] = regularHouse.createInstance("house" + i);
        } else {
            houses[i] = semiHouse.createInstance("house" + i);
        }
        houses[i].rotation.y = places[i][1];
        houses[i].position.x = places[i][2];
        houses[i].position.z = places[i][3];
    }
    
    //SOUND
    const sound = new BABYLON.Sound("background_music", "emotional_background_music.wav",
    scene, null, { loop:true, autoplay:true });

    return scene;
}

function buildHouse(width) {
    const box = buildBox(width);
    const roof = buildRoof(width);

    return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
}

function buildBox (width){
    
    const boxMat = new BABYLON.StandardMaterial('boxMat');
    
    const faceUV = [];
    
    if(width == 1) {
        
        boxMat.diffuseTexture = new BABYLON.Texture("cubehouse.png");

        faceUV[3] = new BABYLON.Vector4(0, 0, 0.25, 1); //front
        faceUV[1] = new BABYLON.Vector4(0.25, 0, 0.5, 1); //right
        faceUV[2] = new BABYLON.Vector4(0.5, 0, 0.75, 1); //back
        faceUV[0] = new BABYLON.Vector4(0.75, 0, 1, 1); //left
    
    } else {
        
        boxMat.diffuseTexture = new BABYLON.Texture("semihouse.png");

        faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
        faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
        faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
        faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
    }

    const box = BABYLON.MeshBuilder.CreateBox("box", { width:width, faceUV: faceUV, wrap:true});
    box.material = boxMat;
    box.position.y = 0.5;

    return box;
}

function buildRoof(width) {
    
    const roofMat = new BABYLON.StandardMaterial('roofMat');
    roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");

    const roof = BABYLON.MeshBuilder.CreateCylinder('roof', {diameter:1.3, height:1.2, tessellation:3});
    roof.rotation.z = BABYLON.Tools.ToRadians(90);
    roof.material = roofMat;
    roof.scaling.y = width;
    roof.position.y = 1.22;
    roof.scaling.x = 0.75;

    return roof;
}

function buildGround(width, height) {
    
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3.Green;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width:width, height:height});
    ground.material = groundMat;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});