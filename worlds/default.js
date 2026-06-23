// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

export function init(Constants) {
    Constants.AvatarNames = ["newwhite"];

    /* Alternatively, you can specify a card spec for an avatar,
       instead of a string for the partical file name, to create your own avatar.
       You can add behaviorModules here. Also, if the system detects a behavior module
       named AvatarEventHandler, that is automatically installed to the avatar.
        {
            type: "3d",
            modelType: "glb",
            name: "rabbit",
            dataLocation: "./assets/avatars/newwhite.zip",
            dataRotation: [0, Math.PI, 0],
            dataScale: [0.3, 0.3, 0.3],
        }
    */

    Constants.UserBehaviorDirectory = "behaviors/default";
    Constants.UserBehaviorModules = [
        "csmLights.js",
        "animation.js"
    ];

    Constants.DefaultCards = [
        {
            // Walkable ground. This is a placeholder plane — drag-and-drop your
            // own .glb environment into the running world (tag it "walk" to walk
            // on it) or replace this card with a `dataLocation`/`fileName` model.
            card: {
                name:"world model",
                layers: ["walk"],
                type: "3d",
                singleSided: true,
                shadow: true,
                translation:[0, -1.7, 0],
                placeholder: true,
                placeholderSize: [400, 0.1, 400],
                placeholderColor: 0x808080,
                placeholderOffset: [0, 0, 0],
            }
        },
        {
            // Scene lighting (see behaviors/default/csmLights.js). With no
            // environment map, csmLights paints a procedural gradient sky so the
            // world is fully self-contained / offline. To use a photographic sky
            // later, add a local equirectangular image under ./assets and set
            // dataLocation + fileName + dataType here.
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
            }
        }

        // ---------------------------------------------------------------------
        // Example: a Blender-authored animated model. Drop your exported .glb in
        // ./assets, uncomment this card, and set dataLocation to its path. The
        // model auto-plays its first clip (looped, synced for all users); with
        // the "Animation" behavior + "pointer" layer, clicking it steps through
        // the clips. See docs/BLENDER.md for the export pipeline.
        //
        // ,{
        //     card: {
        //         name: "animated model",
        //         type: "3d",
        //         modelType: "glb",
        //         dataLocation: "./assets/my-model.glb",
        //         layers: ["pointer"],
        //         behaviorModules: ["Animation"],
        //         translation: [0, 0, -6],
        //         scale: [1, 1, 1],
        //         shadow: true,
        //     }
        // }
    ];
}
