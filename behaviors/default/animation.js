// Animation control for glTF/GLB models authored in Blender (or any tool).
//
// HOW MICROVERSE PLAYS ANIMATIONS (no behavior required):
//   When a 3D card loads a .glb that contains animation clips, Microverse
//   automatically plays the first clip and loops it. Playback is driven by
//   the session's synchronized logical clock, so every user in the world sees
//   the exact same frame at the same time — no extra code needed.
//
// WHAT THIS BEHAVIOR ADDS:
//   Click-to-advance. Tapping the model steps through its animation clips
//   (clip 0 -> clip 1 -> ... -> last -> paused -> clip 0 ...). Because it goes
//   through the model-side `setAnimationClipIndex`, the change is synchronized:
//   if one user clicks, the clip changes for everyone, in lockstep.
//
// USAGE (in worlds/default.js, or via the in-world property sheet):
//   {
//       card: {
//           name: "my animated model",
//           type: "3d",
//           modelType: "glb",
//           dataLocation: "./assets/my-model.glb",   // or a dropped-in handle
//           layers: ["pointer"],                       // required to be clickable
//           behaviorModules: ["Animation"],
//           // animationClipIndex: 0,  // optional: which clip to start on
//       }
//   }
//
// A single-clip model becomes a click-to-play/pause toggle; a multi-clip model
// (several Blender actions/NLA strips) steps through each clip on each click.

class AnimationPawn {
    setup() {
        // The card must be on the "pointer" layer for taps to register.
        this.addEventListener("pointerTap", "onTap");
    }

    onTap() {
        // animationSpec is set by the engine once the glb (and its clips) load.
        let clips = this.animationSpec && this.animationSpec.animations;
        if (!clips || clips.length === 0) {return;}

        let count = clips.length;
        let current = this.actor._cardData.animationClipIndex;
        if (current === undefined) {current = 0;}

        // Cycle: each clip in turn, then a paused state (-1), then back to clip 0.
        let next;
        if (current < 0) {
            next = 0;                       // resume from paused
        } else if (current + 1 < count) {
            next = current + 1;             // next clip
        } else {
            next = -1;                      // pause after the last clip
        }

        // setAnimationClipIndex is a built-in card-actor method; saying it here
        // updates the model for every user and resets the synchronized start time.
        this.say("setAnimationClipIndex", next);
    }

    teardown() {
        this.removeEventListener("pointerTap", "onTap");
    }
}

export default {
    modules: [
        {
            name: "Animation",
            pawnBehaviors: [AnimationPawn]
        }
    ]
};

/* globals Microverse */
