const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas, true);

function createScene() {

    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(-6, 3, -5), scene);
    camera.attachControl(canvas, true);
    camera.rotation.y = BABYLON.Tools.ToRadians(50);
    camera.rotation.x = BABYLON.Tools.ToRadians(20);

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    
    faceUV = [];
    faceUV[3] = new BABYLON.Vector4(0, 0, 0.25, 1); //front
    faceUV[1] = new BABYLON.Vector4(0.25, 0, 0.5, 1); //right
    faceUV[2] = new BABYLON.Vector4(0.5, 0, 0.75, 1); //back
    faceUV[0] = new BABYLON.Vector4(0.75, 0, 1, 1); //left
    
    const box = BABYLON.MeshBuilder.CreateBox('box', {faceUV: faceUV, wrap:true}, scene);
    box.position.y = 0.5;

    const roof = BABYLON.MeshBuilder.CreateCylinder('roof', {diameter:1.3, height:1.2, tessellation:3});
    roof.position.y = 1.22;
    roof.rotation.z = BABYLON.Tools.ToRadians(90);
    

    const groundMat = new BABYLON.StandardMaterial('groundMat');
    groundMat.diffuseColor = new BABYLON.Color3.Green;

    const roofMat = new BABYLON.StandardMaterial('roofMat');
    roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg"
    , scene);

    const boxMat = new BABYLON.StandardMaterial('boxMat');
    boxMat.diffuseTexture = new BABYLON.Texture("cubehouse.png", scene);

    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width:10, height:10}, scene);
    ground.material = groundMat;

    const sound = new BABYLON.Sound("background_music", "emotional_background_music.wav",
    scene, null, { loop:true, autoplay:true });

    roof.material = roofMat;
    box.material = boxMat;

    const house = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);

    const detachedHouse = house.createInstance("detachedHouse");
    detachedHouse.position.x = 3;
    detachedHouse.scaling = new BABYLON.Vector3(2, 1, 1);

    

    return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});