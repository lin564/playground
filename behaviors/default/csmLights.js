class LightPawn {
    setup() {
        console.log("LightPawn");
        let trm = this.service("ThreeRenderManager");
        let scene =  trm.scene;
        let camera = trm.camera;
        let group = this.shape;

        this.removeLights();
        this.lights = [];

        this.setupCSM(scene, camera, Microverse.THREE);

        const ambient = new Microverse.THREE.AmbientLight( 0xffffff, .5 );
        group.add(ambient);
        this.lights.push(ambient);

        this.constructBackground(this.actor._cardData);

        let moduleName = this._behavior.module.externalName;
        this.addUpdateRequest([`${moduleName}$LightPawn`, "update"]);

        this.listen("updateShape", "updateShape");
    }

    removeLights() {
        if (this.lights) {
            [...this.lights].forEach((light) => {
                light.dispose();
                this.shape.remove(light);
            });
        }
        delete this.lights;

        if (this.csm) {
	    for ( let i = 0; i < this.csm.lights.length; i ++ ) {
	        this.csm.parent.remove( this.csm.lights[ i ].target );
	    }
            this.csm.remove();
            this.csm.dispose();
            delete this.csm;
        }
    }

    teardown() {
        console.log("teardown lights");
        this.removeLights();
        let scene = this.service("ThreeRenderManager").scene;
        scene.background?.dispose();
        scene.environment?.dispose();
        scene.background = null;
        scene.environment = null;

    }

    updateShape(options) {
        this.constructBackground(options);
    }

    constructBackground(options) {
        let assetManager = this.service("AssetManager").assetManager;
        let dataType = options.dataType;
        // No environment map specified: paint a procedural gradient sky so the
        // scene never falls back to a black void. Fully offline, no asset needed.
        if (!options.dataLocation) {this.constructGradientSky(); return;}
        return this.getBuffer(options.dataLocation).then((buffer) => {
            return assetManager.load(buffer, dataType, Microverse.THREE, options).then((texture) => {
                let TRM = this.service("ThreeRenderManager");
                let renderer = TRM.renderer;
                let scene = TRM.scene;
                let pmremGenerator = new Microverse.THREE.PMREMGenerator(renderer);
                pmremGenerator.compileEquirectangularShader();

                let exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
                let exrBackground = exrCubeRenderTarget.texture;

                let bg = scene.background;
                let e = scene.environment;
                scene.background = exrBackground;
                scene.environment = exrBackground;
                if(e !== bg) if(bg) bg.dispose();
                if(e) e.dispose();
                texture.dispose();
            });
        }).catch((err) => {
            // e.g. the environment-map URL is unreachable — don't leave a black sky.
            console.warn("Light: environment map failed to load, using gradient sky", err);
            this.constructGradientSky();
        });
    }

    constructGradientSky() {
        let THREE = Microverse.THREE;
        let scene = this.service("ThreeRenderManager").scene;

        // Vertical gradient painted into a small canvas, used as the sky.
        let canvas = document.createElement("canvas");
        canvas.width = 2;
        canvas.height = 256;
        let ctx = canvas.getContext("2d");
        let grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0.0, "#6a8cc4"); // zenith
        grad.addColorStop(0.5, "#aac3e6"); // mid sky
        grad.addColorStop(1.0, "#e8eef5"); // horizon
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 2, 256);

        let texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        let old = scene.background;
        scene.background = texture;
        if (old && old.dispose) old.dispose();
    }

    setupCSM(scene, camera, THREE) {
        if (this.csm) {
            this.csm.remove();
            this.csm.dispose();
            this.csm = null;
        }

        let dir = new THREE.Vector3(-2,-2,-0.5);
        this.csm = new THREE.CSM({
            fade: true,
            far: camera.far,
            maxFar: 1000,
            cascades: 3,
            shadowMapSize: 2048,
            shadowbias: 0.00025,
            lightDirection: dir,
            camera: camera,
            parent: scene,
            lightIntensity: 0.6,
            lightFar: 1000,
            mode: "practical"
        });
        this.csm.update();
    }

    update(_time) {
        if(this.csm) this.csm.update();
    }
}

export default {
    modules: [
        {
            name: "Light",
            pawnBehaviors: [LightPawn]
        }
    ]
}

/* globals Microverse */
