// THROWAWAY test world for debugging the Fox model load.
// Open with:  ?world=foxtest&q=foxtest1&reflector=wss://reflector.ultisim.com
// It runs in its own session, isolated from the real (default) world.
// Delete this file once the Fox is working in worlds/default.js.

export function init(Constants) {
    Constants.AvatarNames = ["newwhite"];

    Constants.UserBehaviorDirectory = "behaviors/default";
    Constants.UserBehaviorModules = [
        "csmLights.js",
        "animation.js"
    ];

    Constants.DefaultCards = [
        {
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
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
            }
        },
        {
            // The Fox card under test — same spec that hung the default world.
            card: {
                name: "fox",
                type: "3d",
                modelType: "glb",
                dataLocation: "./assets/Fox.glb",
                layers: ["pointer"],
                behaviorModules: ["Animation"],
                translation: [0, -1.7, -8],
                scale: [0.05, 0.05, 0.05],
                shadow: true,
            }
        }
    ];
}
