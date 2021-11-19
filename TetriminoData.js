const PIECE_TYPES = ["I", "J", "L", "O", "S", "T", "Z"];
const JLTSZ_WALLKICKS = {
    "initState": [
        {
            "targetState": [
                undefined,
                {
                    "testIndex": [ // 0 >> 1
                        { x: -1, y: 0 },
                        { x: -1, y: 1 },
                        { x: 0, y: -2 },
                        { x: -1, y: -2 }
                    ]
                },
                undefined,
                {
                    "testIndex": [ // 0 >> 3
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                        { x: 0, y: -2 },
                        { x: 1, y: -2 }
                    ]
                }
            ]
        },
        {
            "targetState": [
                {
                    "testIndex": [ // 1 >> 0
                        { x: 1, y: 0 },
                        { x: 1, y: -1 },
                        { x: 0, y: 2 },
                        { x: 1, y: 2 }
                    ]
                },
                undefined,
                {
                    "testIndex": [ // 1 >> 2
                        { x: 1, y: 0 },
                        { x: 1, y: -1 },
                        { x: 0, y: 2 },
                        { x: 1, y: 2 }
                    ]
                },
                undefined
            ]
        },
        {
            "targetState": [
                undefined,
                {
                    "testIndex": [ // 2 >> 1
                        { x: -1, y: 0 },
                        { x: -1, y: 1 },
                        { x: 0, y: -2 },
                        { x: -1, y: -2 }
                    ]
                },
                undefined,
                {
                    "testIndex": [ // 2 >> 3
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                        { x: 0, y: -2 },
                        { x: 1, y: -2 }
                    ]
                },
            ]
        },
        {
            "targetState": [
                {
                    "testIndex": [ // 3 >> 0
                        { x: -1, y: 0 },
                        { x: -1, y: -1 },
                        { x: 0, y: 2 },
                        { x: -1, y: 2 }
                    ]
                },
                undefined,
                {
                    "testIndex": [ // 3 >> 2
                        { x: -1, y: 0 },
                        { x: -1, y: -1 },
                        { x: 0, y: 2 },
                        { x: -1, y: 2 }
                    ]
                },
                undefined,
            ]
        }
    ]
}
const I_WALLKICKS = {
    "initState": [
        {
            "targetState": [
                undefined,
                {
                    "testIndex": [ // 0 >> 1
                        { x: -2, y: 0 },
                        { x: 1, y: 0 },
                        { x: -2, y: -1 },
                        { x: 1, y: 2 }
                    ]
                },
                undefined,
                {
                    "testIndex": [ // 0 >> 3
                        { x: -1, y: 0 },
                        { x: 2, y: 0 },
                        { x: -1, y: 2 },
                        { x: 2, y: -1 }
                    ]
                }
            ]
        },
        {
            "targetState": [
                {
                    "testIndex": [ // 1 >> 0
                        { x: 2, y: 0 },
                        { x: -1, y: 0 },
                        { x: 2, y: 1 },
                        { x: -1, y: -2 }
                    ]
                },
                undefined,
                {
                    "testIndex": [ // 1 >> 2
                        { x: -1, y: 0 },
                        { x: 2, y: 0 },
                        { x: -1, y: 2 },
                        { x: 2, y: -1 }
                    ]
                },
                undefined
            ]
        },
        {
            "targetState": [
                undefined,
                {
                    "testIndex": [ // 2 >> 1
                        { x: 1, y: 0 },
                        { x: -2, y: 0 },
                        { x: 1, y: -2 },
                        { x: -2, y: 1 }
                    ]
                },
                undefined,
                {
                    "testIndex": [ // 2 >> 3
                        { x: 2, y: 0 },
                        { x: -1, y: 0 },
                        { x: 2, y: 1 },
                        { x: -1, y: -2 }
                    ]
                },
            ]
        },
        {
            "targetState": [
                {
                    "testIndex": [ // 3 >> 0
                        { x: 1, y: 0 },
                        { x: -2, y: 0 },
                        { x: 1, y: -2 },
                        { x: -2, y: 1 }
                    ]
                },
                undefined,
                {
                    "testIndex": [ // 3 >> 2
                        { x: -2, y: 0 },
                        { x: 1, y: 0 },
                        { x: -2, y: -1 },
                        { x: 1, y: 2 }
                    ]
                },
                undefined,
            ]
        }
    ]
}

const tData = {
    "I": {
        "wallKicks": I_WALLKICKS,
        "color": "#42e6f5",
        "rotationStates": [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ]
    },
    "J": {
        "wallKicks": JLTSZ_WALLKICKS,
        "color": "#3538cc",
        "rotationStates": [
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ]
        ]
    },
    "L": {
        "wallKicks": JLTSZ_WALLKICKS,
        "color": "#e8cf4f",
        "rotationStates": [
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ]
        ]
    },
    "O": {
        "color": "#eaed15",
        "rotationStates": [
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ]
    },
    "S": {
        "wallKicks": JLTSZ_WALLKICKS,
        "color": "#46e01f",
        "rotationStates": [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0]
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ]
    },
    "T": {
        "wallKicks": JLTSZ_WALLKICKS,
        "color": "#a71fe0",
        "rotationStates": [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ]
    },
    "Z": {
        "wallKicks": JLTSZ_WALLKICKS,
        "color": "#e32222",
        "rotationStates": [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [1, 0, 0]
            ]
        ]
    }

}
