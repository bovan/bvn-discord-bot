declare interface HueLightState {
    on: boolean;
    reachable: boolean;
    hue: number;
    sat: number;
    bri: number;
}

declare interface HueLight {
    name: string;
    state: HueLightState;
}

declare interface HueLights {
    [light: number]: HueLight;
}

declare interface HueColor {
    h: number;
    s: number;
    v: number;
}

declare class HueUtil
{
    constructor(name: string, ipAddress: string, username: string, onUsernameChange: (username: string) => void);
    getLights(): HueLights;
}

declare module "hue-util" {
    export = HueUtil;
}
//constructor(name: string, ip: string, username: string, callback: Function);