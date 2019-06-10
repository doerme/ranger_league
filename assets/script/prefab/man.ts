import { Gravity } from '../config'

const {ccclass, property} = cc._decorator;

@ccclass
export default class ManPreFabClass extends cc.Component {

    // 人体Y轴速度
    manYSpeed: number = 0

    // 人体Y轴加速度
    manYAcceleration: number = -Gravity

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt: any) {
      this._updateMan(dt)
    }

    /**
     * 跳起
     */
    jump():void {
      this.manYSpeed = 300
    }

    // 人体重力
    _updateMan(dt: any): void {
      // console.log(dt)
      this.manYSpeed += dt* this.manYAcceleration
      this.node.y += dt * this.manYSpeed + 1/2 * this.manYAcceleration * dt * dt
    }

    onCollisionEnter(other: any, self: any) {
      this.manYAcceleration = 0
      this.manYSpeed = 0
      this.node.y = other.node.y + self.node.height / 2
      // console.log('man on collision enter', other, self)
    }

    onCollisionStay() {
      // console.log('man collision stay')
    }

    onCollisionExit() {
      this.manYAcceleration = -200
      // console.log('man on collision exit')
    }
}
