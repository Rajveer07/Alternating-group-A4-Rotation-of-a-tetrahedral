let scene, camera, renderer, tetrahedron, axisLines = [];

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.TetrahedronGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, opacity: 0.5, transparent: true });
    tetrahedron = new THREE.Mesh(geometry, material);
    scene.add(tetrahedron);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
}

const rotations = [
    { axis: [0, 0, 0], angle: 0, axisPoints: [] },
    { axis: [1, 0, 0], angle: Math.PI, axisPoints: [[1, 1, 1], [-1, -1, 1]] },
    { axis: [0, 1, 0], angle: Math.PI, axisPoints: [[1, 1, 1], [-1, 1, -1]] },
    { axis: [0, 0, 1], angle: Math.PI, axisPoints: [[1, 1, 1], [1, -1, -1]] },
    { axis: [1, 1, 1], angle: (2 * Math.PI) / 3, axisPoints: [[1, 1, 1], [0, 0, 0]] },
    { axis: [1, -1, 1], angle: (2 * Math.PI) / 3, axisPoints: [[1, -1, 1], [0, 0, 0]] },
    { axis: [1, 1, -1], angle: (2 * Math.PI) / 3, axisPoints: [[1, 1, -1], [0, 0, 0]] },
    { axis: [-1, 1, 1], angle: (2 * Math.PI) / 3, axisPoints: [[-1, 1, 1], [0, 0, 0]] },
    { axis: [1, 1, 1], angle: -(2 * Math.PI) / 3, axisPoints: [[1, 1, 1], [0, 0, 0]] },
    { axis: [1, -1, 1], angle: -(2 * Math.PI) / 3, axisPoints: [[1, -1, 1], [0, 0, 0]] },
    { axis: [1, 1, -1], angle: -(2 * Math.PI) / 3, axisPoints: [[1, 1, -1], [0, 0, 0]] },
    { axis: [-1, 1, 1], angle: -(2 * Math.PI) / 3, axisPoints: [[-1, 1, 1], [0, 0, 0]] },
];

function drawAxis(axisPoints) {
    clearAxes();
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const points = axisPoints.map(p => new THREE.Vector3(...p));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    axisLines.push(line);
    scene.add(line);
}

function clearAxes() {
    axisLines.forEach(line => scene.remove(line));
    axisLines = [];
}

function rotateTetrahedron(index) {
    const rotation = rotations[index];
    const axis = new THREE.Vector3(...rotation.axis).normalize();
    const angle = rotation.angle;
    const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

    if (rotation.axisPoints.length > 0) {
        drawAxis(rotation.axisPoints);
    }

    new TWEEN.Tween(tetrahedron.rotation)
        .to({ x: quaternion.x, y: quaternion.y, z: quaternion.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => clearAxes())
        .start();
}

window.onload = init;
