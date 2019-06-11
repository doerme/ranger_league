import { Gravity } from '../config'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ArrowPrefabClass extends cc.Component {

    @property({
        displayName: "x轴速度",
    })
    arrowXSpeed: number = 1000

    @property({
        displayName: "y轴速度",
    })
    arrowYSpeed: number = 0

    @property({
        displayName: "y轴加速度",
    })
    arrowYSpeedA: number = -Gravity

    @property({
        displayName: "角度增量",
    })
    anchorAdd: number = 30

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    _arrowRun(dt: any):void {
        this.arrowYSpeed+=this.arrowYSpeedA*dt
        this.node.x += this.arrowXSpeed*dt
        this.node.y += this.arrowYSpeed*dt
        this.node.rotation += this.anchorAdd*dt
    }

    update (dt: any) {
        // console.log(`arrow update`)
        this._arrowRun(dt)
    }

    onCollisionEnter() {
        console.log('arrow on collision enter')
        this.node.removeFromParent()
    }

    // onCollisionStay() {
    //     console.log('arrow on collision stay')
    // }

    // onCollisionExit() {
    //     console.log('arrow on collision exit')
    // }
}
