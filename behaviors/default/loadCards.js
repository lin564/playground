// Load cards into a Croquet world.  This is designed for only setup to be executed
// Since worlds update when behaviors (but not templates) change, adding cards to this setup routine will 
// dyanmically load them into the world
// Copyright 2023 Ultisim and engageLively

class LoadActor {
    setup() {
        if (this.loadedCards) {
            this.loadedCards.forEach(card => card.destroy());
        }

        const cards = [
            {
                animationClipIndex:0,
                animationStartTime: 4365797,
                animateOnApproachConfig: {
                    proximateDistance: 10,
                    checkInterval: 20,
                    proximateAnimationClip: 2,
                    distantAnimationClip: 0
                },
                behaviorModules: ['AnimateOnApproach'],
                name: '/spiderman-rigged.glb',
                fileName: '/spiderman-rigged.glb',
                dataLocation: "3nkvssiWbp4Kp3XVeZZoG39fIaYeDr7K0gMYQqBjPja4BhoaHh1UQUEIBwILHUAbHUANHAEfGwsaQAcBQRtBAAchHCUoWFtcBiApOwA9XB4AGiVYKj88XCcfXEENAQNAGwIaBx0HA0ACBwAKD0AMCxwADxwKQAMHDRwBGAscHQtBBVsmDDxaFzQhAyEoXxgpIzsUGjYJJF8_Pj1aHgMLNAk7Vg9aLF8oXBknI0EKDxoPQSocXgsgACUkFiIdWzEaNiEWWwAkMQ1YCiUUASkGNhgiKgQ3L1kKLwhdFB0",
                dataScale: [226, 226, 226],
                layers: ['pointer'],
                modelType: 'glb',
                rotation: [0, 0, 0, 1],
                scale: [0.5, 0.5, 0.5],
                shadow: true,
                singleSided: true,
                translation: [-1.4, -1.6, -16.8],
                type: '3d'
            },
            {
                animationClipIndex: 0,
                animationStartTime: 2695996,
                animateOnApproachConfig: {
                    proximateDistance: 10,
                    checkInterval: 20,
                    proximateAnimationClip: 2,
                    distantAnimationClip: 0
                },
                behaviorModules: ['AnimateOnApproach'],
                dataLocation: "3lF7xee8O-kWX2Oj2490O_dw-MLOUGp7LMwdrttAnQ3UBBgYHB9WQ0MKBQAJH0IZH0IPHgMdGQkYQgUDQxlDAgUjHicqWlleBCIrOQI_XhwCGCdaKD0-XiUdXkMPAwFCGQAYBR8FAUIABQIIDUIOCR4CDR4IQgEFDx4DGgkeHwlDB1kkDj5YFTYjASMqXRorITkWGDQLJl09PD9YHAEJNgs5VA1YLl0qXhslIUMIDRgNQwQLHic6LjYLFgpaIyYZHRgIBV8nHTwWHAUgIBguWyYHASMWOzsFHx8IAws",
                dataScale: [0.75, 0.75, 0.75],
                fileName: '/superman_v2.glb',
                layers:['pointer'],
                modelType: 'glb',
                rotation: [0, -0.44, 0, 1],
                scale: [1.14, 1.14, 1.14],
                shadow: true,
                singleSided: true,
                translation: [0.9, -1.1, -18.7],
                type: '3d'

            }
        ]
        this.loadedCards = cards.map(card => this.createCard(card));
    }
}

export default {
    modules: [
        {
            name: "LoadCards",
            actorBehaviors: [LoadActor]
        }
    ]
}