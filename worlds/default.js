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
        "csmLights.js"
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
                dataLocation: "3OF2-s4U1ZOJduGATmLEIXo1iTkQHd5ZBknKgL5SvqpQJzs7Pzx1YGApJiMqPGE6PGEsPSA-Oio7YSYgYDpgCCsZLTYjBjwOJB4sDRcrfAg3Ljk2OBoEGBYWfWAmIGEsPSA-Oio7YSImLD0gOSo9PCpgPwB9AAIIISx8YiYneScqKyQaIisNLHkaGT8YKg56JQwQfHstPiNiGQ49e2ArLjsuYCMBPgMiCQt3OQskGhcleSp9HQIIfXseHgo7EAo9CB48FRwpegsCLH4OIwY",
                fileName: "/abandoned_parking_4k.jpg",
                dataType: "jpg",
            }
        },
        {
                "card": {
                    "animationClipIndex": 0,
                    "animationStartTime": 137315,
                    "dataLocation": "35lwX9HzAE37OmfHIL4Ev70VZ3mgflGQ3lijemXAu6iUXUFBRUYPGhpTXFlQRhtARhtWR1pEQFBBG1xaGkAaW1x6R35zAwAHXXtyYFtmB0VbQX4DcWRnB3xEBxpWWlgbQFlBXEZcWBtZXFtRVBtXUEdbVEdRG1hcVkdaQ1BHRlAaB0VmRxh6fF0FbXJeTXhkfFd0BX9Xe3JccHsGegRhU0AFfWoYYGZbZANqeBpRVEFUGgNsBVxCU1hZT3BbAQVWYXhdB0BXV1RTBXcEDQZCXFhHZQ1QfU1fb15nWGQ",
                    "dataScale": [
                        0.7688558240644012,
                        0.7688558240644012,
                        0.7688558240644012
                    ],
                    "fileName": "/sci-fi_door_game.glb",
                    "layers": [
                        "pointer"
                    ],
                    "modelType": "glb",
                    "name": "/sci-fi_door_game.glb",
                    "rotation": [
                        -0.48614005308290364,
                        0.5040992164578587,
                        -0.5110412268594684,
                        -0.49838608849474614
                    ],
                    "scale": [
                        1.7055147984074983,
                        1.7055147984074983,
                        1.7055147984074983
                    ],
                    "shadow": true,
                    "singleSided": true,
                    "translation": [
                        1.0448955042409604,
                        0,
                        -5.368281701021959
                    ],
                    "type": "3d"
                },
            },
            {
                "card": {
                    "dataLocation": "3a9A88w3SfZLt-vmUh1b9A1dcZFsCl7nhy5HtrjXS-R0CRUVERJbTk4HCA0EEk8UEk8CEw4QFAQVTwgOThRODwguEyonV1RTCS8mNA8yUxEPFSpXJTAzUygQU04CDgxPFA0VCBIIDE8NCA8FAE8DBBMPABMFTwwIAhMOFwQTEgROUxEyE0wuKAlROSYKGSwwKAMgUSsDLyYIJC9SLlA1BxRRKT5MNDIPMFc-LE4FABUAThM5BC8IFRsHJVkFIA1TWD4mLw4iVCw4LRERES4yKgJXNTAgKRtROxUHIwY",
                    "dataScale": [
                        19.994001697444432,
                        19.994001697444432,
                        19.994001697444432
                    ],
                    "fileName": "/Sci-fi_Tunnel.glb",
                    "layers": [
                        "pointer"
                    ],
                    "modelType": "glb",
                    "name": "/Sci-fi_Tunnel.glb",
                    "rotation": [
                        0,
                        -0.6982607308571664,
                        0,
                        0.7158435246216979
                    ],
                    "scale": [
                        13.020875687066836,
                        13.020875687066836,
                        13.020875687066836
                    ],
                    "shadow": true,
                    "singleSided": true,
                    "translation": [
                        -1.114267359992995,
                        -4.161783203592657,
                        -31.56338066238369
                    ],
                    "type": "3d"
                }
            },
            {
                "card": {
                    "animationClipIndex": 3,
                    "animationStartTime": 4365797,
                    "dataLocation": "3nkvssiWbp4Kp3XVeZZoG39fIaYeDr7K0gMYQqBjPja4BhoaHh1UQUEIBwILHUAbHUANHAEfGwsaQAcBQRtBAAchHCUoWFtcBiApOwA9XB4AGiVYKj88XCcfXEENAQNAGwIaBx0HA0ACBwAKD0AMCxwADxwKQAMHDRwBGAscHQtBBVsmDDxaFzQhAyEoXxgpIzsUGjYJJF8_Pj1aHgMLNAk7Vg9aLF8oXBknI0EKDxoPQSocXgsgACUkFiIdWzEaNiEWWwAkMQ1YCiUUASkGNhgiKgQ3L1kKLwhdFB0",
                    "dataScale": [
                        226.00709485280012,
                        226.00709485280012,
                        226.00709485280012
                    ],
                    "fileName": "/spiderman_rigged.glb",
                    "layers": [
                        "pointer"
                    ],
                    "modelType": "glb",
                    "name": "/spiderman_rigged.glb",
                    "rotation": [
                        0,
                        0.02935309697235665,
                        0,
                        0.9995691050138211
                    ],
                    "scale": [
                        0.5137060243209486,
                        0.5137060243209486,
                        0.5137060243209486
                    ],
                    "shadow": true,
                    "singleSided": true,
                    "translation": [
                        -1.3994778734393791,
                        -1.6343351833024617,
                        -16.77734783249003
                    ],
                    "type": "3d"
                }
            },
            {
                "card": {
                    "animationClipIndex": 2,
                    "animationStartTime": 2695996,
                    "dataLocation": "3lF7xee8O-kWX2Oj2490O_dw-MLOUGp7LMwdrttAnQ3UBBgYHB9WQ0MKBQAJH0IZH0IPHgMdGQkYQgUDQxlDAgUjHicqWlleBCIrOQI_XhwCGCdaKD0-XiUdXkMPAwFCGQAYBR8FAUIABQIIDUIOCR4CDR4IQgEFDx4DGgkeHwlDB1kkDj5YFTYjASMqXRorITkWGDQLJl09PD9YHAEJNgs5VA1YLl0qXhslIUMIDRgNQwQLHic6LjYLFgpaIyYZHRgIBV8nHTwWHAUgIBguWyYHASMWOzsFHx8IAws",
                    "dataScale": [
                        0.7409493662313277,
                        0.7409493662313277,
                        0.7409493662313277
                    ],
                    "fileName": "/superman_v2.glb",
                    "layers": [
                        "pointer"
                    ],
                    "modelType": "glb",
                    "name": "/superman_v2.glb",
                    "rotation": [
                        0,
                        -0.43716693583416694,
                        0,
                        0.8993803812699971
                    ],
                    "scale": [
                        1.1418481807639504,
                        1.1418481807639504,
                        1.1418481807639504
                    ],
                    "shadow": true,
                    "singleSided": true,
                    "translation": [
                        0.8869747834590964,
                        -1.0503662283842374,
                        -18.74592155273224
                    ],
                    "type": "3d"
                }
            }

    ];
}
