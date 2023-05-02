// SimpleSpin
// Copyright 2022 Ultisim and engageLively
// Croquet Microverse
// animate a card when an avatar approaches


class AnimateOnApproachActor {

    _setField(field, defaultValue) {
        const fieldSupplied = this._cardData.animateOnApproachConfig && this._cardData.animateOnApproachConfig[field];
        this[field] = fieldSupplied?this._cardData.animateOnApproachConfig[field]:defaultValue;
        

    }
    setup() {
        this.proximate  = false; // start with no one around

        // set up the configuration from the card
        const fields = [
            {name: 'proximateDistance', defaultValue: 10},
            {name: 'checkInterval', defaultValue: 20},
            {name: 'proximateAnimationClip', defaultValue: 0},
            {name: 'distantAnimationClip', defaultValue: 0}
        ]

        fields.forEach(field => {
            this._setField(field.name, field.defaultValue)
        })
        this._cardData.animationClipIndex = this.distantAnimationClip;

        this.future(1000).step();
        // this.addEventListener('pointerDown', 'showDistance')
    }

    _distanceSquare(avatar) {
        const xDist = avatar.translation[0] - this.translation[0]
        const zDist = avatar.translation[2] - this.translation[2]
        return xDist*xDist + zDist*zDist

    }

    // used for debugging only

    _showDistance() {
        const avatars = this._avatars();
        const dist = avatars.map(av => this._distanceSquare(av));
        console.log(`Distance is ${dist}`)
        return;

    }

    // get all of the 

    _avatars() {

        const cards = this.queryCards();
        if (cards.length == 0) {
            console.log("In AnimateOnApproach: no cards found")
            return []
        }
        const avatars = cards.filter(a => a.playerId)
        if (avatars.length == 0) {
            console.log(`In AnimateOnApproach: ${cards.length} cards found, but no avatars}`)
        }
        return avatars;

    }

    step() {
        
        this.future(this.checkInterval).step();
        const avatars = this._avatars();
        if (avatars.length > 0) {
            const distances = avatars.map(avatar => this._distanceSquare(avatar))
            const minDistance = distances.slice(1).reduce((prev, cur) => Math.min(prev, cur), distances[0])
            // console.log(minDistance)
            this._cardData.animationClipIndex = minDistance < this.proximateDistance?this.proximateAnimationClip:this.distantAnimationClip;
            
        } else {
            this._cardData.animationClipIndex = this.distantAnimationClip;
        }
    }

   
    teardown() {
        
    }
}

export default {
    modules: [
        {
            name: "AnimateOnApproach",
            actorBehaviors: [AnimateOnApproachActor],
        }
    ]
}
