export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const LANES = [120, 240, 360];
export const LANE_SWITCH_DURATION = 150;

export const PLAYER_Y = 650;
export const PLAYER_WIDTH = 50;
export const PLAYER_HEIGHT = 70;
export const PLAYER_SLIDE_HEIGHT = 35;

export const BASE_SPEED = 5;
export const JUMP_VELOCITY = -500;
export const GRAVITY = 1200;

export const OBSTACLE_TYPES = {
    TRAIN: 'train',
    BARRIER_LOW: 'barrier_low',
    BARRIER_HIGH: 'barrier_high',
    TUNNEL: 'tunnel'
};

export const POWER_UP_TYPES = {
    MAGNET: 'magnet',
    JETPACK: 'jetpack',
    MULTIPLIER: 'multiplier',
    SHIELD: 'shield'
};

export const POWER_UP_DURATIONS = {
    magnet: 15000,
    jetpack: 10000,
    multiplier: 15000,
    shield: Infinity
};

export const COIN_SCORE = 10;

export const STAGES = [
    {
        id: 1,
        name: 'City Streets',
        nameLocal: 'Хотын гудамж',
        distanceThreshold: 0,
        speed: 5,
        spawnInterval: 1500,
        obstacleTypes: [OBSTACLE_TYPES.TRAIN],
        bgColor: 0x87CEEB,
        groundColor: 0x808080,
        buildingColor: 0xC0C0C0
    },
    {
        id: 2,
        name: 'Subway Tunnels',
        nameLocal: 'Метроны туннель',
        distanceThreshold: 1000,
        speed: 6.5,
        spawnInterval: 1200,
        obstacleTypes: [OBSTACLE_TYPES.TRAIN, OBSTACLE_TYPES.BARRIER_LOW],
        bgColor: 0x2C2C3E,
        groundColor: 0x4A4A5A,
        buildingColor: 0x3A3A4A
    },
    {
        id: 3,
        name: 'Industrial Zone',
        nameLocal: 'Үйлдвэрийн бүс',
        distanceThreshold: 3000,
        speed: 8,
        spawnInterval: 1000,
        obstacleTypes: [OBSTACLE_TYPES.TRAIN, OBSTACLE_TYPES.BARRIER_LOW, OBSTACLE_TYPES.BARRIER_HIGH],
        bgColor: 0xD4A574,
        groundColor: 0x8B7355,
        buildingColor: 0xB8860B
    },
    {
        id: 4,
        name: 'Express Lines',
        nameLocal: 'Шуурхай шугам',
        distanceThreshold: 6000,
        speed: 10,
        spawnInterval: 800,
        obstacleTypes: [OBSTACLE_TYPES.TRAIN, OBSTACLE_TYPES.BARRIER_LOW, OBSTACLE_TYPES.BARRIER_HIGH, OBSTACLE_TYPES.TUNNEL],
        bgColor: 0x4169E1,
        groundColor: 0x696969,
        buildingColor: 0x4682B4
    },
    {
        id: 5,
        name: 'Night Rush',
        nameLocal: 'Шөнийн уралдаан',
        distanceThreshold: 10000,
        speed: 12,
        spawnInterval: 600,
        obstacleTypes: [OBSTACLE_TYPES.TRAIN, OBSTACLE_TYPES.BARRIER_LOW, OBSTACLE_TYPES.BARRIER_HIGH, OBSTACLE_TYPES.TUNNEL],
        bgColor: 0x0F0F23,
        groundColor: 0x2F2F3F,
        buildingColor: 0x1A1A3A
    }
];

export const COLORS = {
    PLAYER: 0x00BFFF,
    TRAIN: 0xFF4444,
    BARRIER_LOW: 0xFF8C00,
    BARRIER_HIGH: 0x9932CC,
    TUNNEL: 0x696969,
    COIN: 0xFFD700,
    MAGNET: 0xFF1493,
    JETPACK: 0x00FF7F,
    MULTIPLIER: 0xFFFF00,
    SHIELD: 0x00CED1,
    RAIL: 0xAAAAAA,
    RAIL_TIE: 0x8B4513
};
