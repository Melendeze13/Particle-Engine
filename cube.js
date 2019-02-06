// GLOBAL VARIABLES


var camera, scene, renderer;
var geometry, material, mesh, cameraControl;
var particleSystem,particleCount,particles, particle;
var clock = new THREE.Clock(),optionsProjectile, projectileSpawnerOptions, particleSystem,
container, tick = 0, tock = 0, delta, delta2;

var stats;
var projectileSpawnerOptionsArray = [];
var explosionSpawnerOptionsArray = []; 

// var Rainbow = require('rainbowvis.js');
var myRainbow = new Rainbow();

console.log("0x" + myRainbow.colourAt(0));






init();
animate();

function init() {

    // Create Camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000 );
    camera.position.z = 50;

    // Create scene Along with Cube
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );


    // Controls
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 5;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );

    // Stats such as FPS
    stats = new Stats();
    container = document.getElementById( 'container' );
    container.appendChild( stats.dom );

    // Create a static array of directions
    // All fireworks are deterministic
    fireworksInit();

}

// While loop
function animate() {
    requestAnimationFrame( animate );

    controls.update();
    
    if (exploded === true)
    {
        explosionPhysics();
    }
    else
    {
        fireworksPhysics();
    }

    render();
    stats.update();
}

// Render function
function render() {
    renderer.render( scene, camera );
}

// Dynamic Window Resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
    render();
}

// Static Project and Explosion Options
function fireworksInit() {

    particleSystem = new THREE.GPUParticleSystem( {
        maxParticles: 10000
    } ); 
    scene.add( particleSystem );

    optionsProjectile = {
        position: new THREE.Vector3(),
        positionRandomness: 0.4,
        velocity: new THREE.Vector3(),
        velocityRandomness: 0.5,
        color: 0xe25822,
        colorRandomness: 0.2,
        turbulence: 0.50,
        lifetime: 5,
        size: 20,
        sizeRandomness: 1
    };

    optionsExplosion = {
        position: new THREE.Vector3(),
        positionRandomness: 0.0,
        velocity: new THREE.Vector3(),
        velocityRandomness: 0.5,
        color: 0xfff,
        colorRandomness: 0.8,
        turbulence: 0.08,
        lifetime: 5,
        size: 20,
        sizeRandomness: 1
    };

    // Create x different amount of particles
    for (let x = 0; x < 500; x++)
    {
        explosionSpawnerOptions = {
            spawnRate: 1,
            horizontalSpeed: 1,
            verticalSpeed: 1,
            zSpeed: 1,
            timeScale: 1,
            gravitySpeed: 0
        };

        // Use a unit sphere when sampling random directions
        var unitSphereCoordinate = new THREE.Vector3(0,0,0);
        var max = 1, min = -1;

        // Choose random positive and negative values
        unitSphereCoordinate.x = Math.random() * ((+max) - (+min)) + (+min);
        unitSphereCoordinate.y = Math.random() * ((+max) - (+min)) + (+min);
        unitSphereCoordinate.z = Math.random() * ((+max) - (+min)) + (+min);

        // Normalize the vector to create sphereical effect
        // This is the essential step to unit sphere sampling
        unitSphereCoordinate = unitSphereCoordinate.normalize();


        // Set XYZ direction for explosion
        explosionSpawnerOptions.horizontalSpeed = unitSphereCoordinate.x * 20;
        explosionSpawnerOptions.verticalSpeed = unitSphereCoordinate.y * 20;
        explosionSpawnerOptions.zSpeed = unitSphereCoordinate.z * 20;


        // Set Gravity to vertical speed the we decrement it
        explosionSpawnerOptions.gravitySpeed = explosionSpawnerOptions.verticalSpeed;

        // Push everything into an array
        explosionSpawnerOptionsArray.push(explosionSpawnerOptions);
    }

    for (let x = 0; x < 10; x++)
    {
        projectileSpawnerOptions = {
            spawnRate: 1,
            horizontalSpeed: 1,
            verticalSpeed: 1,
            zSpeed: 1,
            timeScale: 1,
            gravitySpeed: 0
        };

        // Choose random direction for each xyz vector
        projectileSpawnerOptions.horizontalSpeed = ((Math.random() * projectileSpawnerOptions.horizontalSpeed) - (projectileSpawnerOptions.horizontalSpeed/2)) * 50;
        projectileSpawnerOptions.verticalSpeed = ((Math.random() * projectileSpawnerOptions.verticalSpeed)) * 50;
        projectileSpawnerOptions.zSpeed = ((Math.random() * projectileSpawnerOptions.zSpeed) - (projectileSpawnerOptions.zSpeed/2)) * 50;

        // Set Gravity to vertical speed the we decrement it
        projectileSpawnerOptions.gravitySpeed = projectileSpawnerOptions.verticalSpeed;

        // Push everything into an array
        projectileSpawnerOptionsArray.push(projectileSpawnerOptions);
    }
}


function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}

// Explosion Physics
function explosionPhysics()
{
    var delta2 = clock.getDelta() * explosionSpawnerOptions.timeScale;
    tock += delta2;

    // optionsExplosion.color = ((optionsExplosion.color + delta) % 255);

    for (var x = 0; x < explosionSpawnerOptionsArray.length; x++)
    {
            // console.log("hello");

        if ( tock < 0 ) tock = 0;
        if ( delta2 > 0 ) {
            if (optionsExplosion.position.x < (-50 + lastXY[0]) || optionsExplosion.position.y < (-50 + lastXY[1]) || optionsExplosion.position.x > (50 + lastXY[0]) || optionsExplosion.position.y > (50 + lastXY[1]))
            {
                // console.log(posx);
                 optionsExplosion.lifetime -= 0.1;
                if (optionsExplosion.lifetime < 0)
                {
                    resetProjectile();

                    // tock = 0;
                    for (let x = 0; x < explosionSpawnerOptionsArray.length; x++)
                    {
                    // spawnerOptionsArray[x].verticalSpeed = 0;
                    // spawnerOptionsArray[x].horizontalSpeed = 0;
                    // spawnerOptionsArray[x].zSpeed = 0;
                    // spawnerOptionsArray[x].verticalSpeed = 0;
                    // explosionSpawnerOptionsArray[x].gravitySpeed = explosionSpawnerOptionsArray[x].verticalSpeed;
                    }
                }



            }
            // explosionSpawnerOptionsArray[x].gravitySpeed -= 0.09;
            // console.log(spawnerOptionsArray[x].gravitySpeed);

            optionsExplosion.position.x = lastXY[0] + explosionSpawnerOptionsArray[x].horizontalSpeed * tock;
            optionsExplosion.position.y = lastXY[1] + (explosionSpawnerOptionsArray[x].gravitySpeed - 0.09)* tock;
            optionsExplosion.position.z = explosionSpawnerOptionsArray[x].zSpeed * tock;
            particleSystem.spawnParticle( optionsExplosion );

        }
    }
    particleSystem.update( tock );
}

var exploded = false;
var lastXY = [0,0];
var projectileIndex = 1;

function fireworksPhysics() 
{
    // if (projectileIndex === (projectileSpawnerOptionsArray.length - 1)) projectileIndex = 0;
    delta = clock.getDelta() * projectileSpawnerOptions.timeScale;
    tick += delta;
        if ( tick < 0 ) tick = 0;
        if ( delta > 0 ) {
            // Create boundary for fireworks
            if (optionsProjectile.position.y < -30 || optionsProjectile.position.x < -30 || optionsProjectile.position.y > 30 || optionsProjectile.position.x > 30)
            {
                // optionsProjectile.lifetime -= 0.1;
                if (1)
                {
                    resetExplosion();
                    lastXY[0] = (optionsProjectile.position.x);
                    lastXY[1] = (optionsProjectile.position.y);

                    for (let x = 0; x < projectileSpawnerOptionsArray.length; x++)
                    {
                    // spawnerOptionsArray[x].verticalSpeed = 0;
                    // spawnerOptionsArray[x].horizontalSpeed = 0;
                    // spawnerOptionsArray[x].zSpeed = 0;
                    // spawnerOptionsArray[x].verticalSpeed = 0;
                    projectileSpawnerOptionsArray[x].gravitySpeed = projectileSpawnerOptionsArray[x].verticalSpeed;
                    }
                }


            }
            // Make sure the firework is always shot up
            // TODO

            projectileSpawnerOptionsArray[projectileIndex].gravitySpeed -= 0.09;
            optionsProjectile.position.y = projectileSpawnerOptionsArray[projectileIndex].gravitySpeed * tick;
            optionsProjectile.position.x = projectileSpawnerOptionsArray[projectileIndex].horizontalSpeed * tick;
            particleSystem.spawnParticle( optionsProjectile );
        }   
    particleSystem.update( tick );
}

function resetProjectile()
{
    optionsProjectile.lifetime = 1;
    exploded = false;
    tock = 0;
    projectileIndex++;

}

function resetExplosion()
{
    optionsExplosion.lifetime = 1;
    exploded = true;
    tick = 0;
}
