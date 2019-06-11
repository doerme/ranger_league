import JoystickBG from './stick_bg'
import Common from './stitck_common'
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.Node,
        displayName: "摇杆节点",
    })
    dot: cc.Node = null;

    @property({
        type: JoystickBG,
        displayName: "摇杆背景节点",
    })
    ring = null;

    @property({
        displayName: "摇杆X位置",
    })
    stickX = 0;

    @property({
        displayName: "摇杆Y位置",
    })
    stickY = 0;

    @property({
        type: Common.TouchType,
        displayName: '触摸类型',
    })
    touchType = Common.TouchType.DEFAULT

    @property({
        type: Common.DirectionType,
        displayName: '方向类型',
    })
    directionType = Common.DirectionType.ALL

    @property({
        type: cc.Node,
        displayName: '操控的目标',
    })
    sprite = null

    _stickPos: cc.Node = null // 摇杆当前位置

    _touchLocation: cc.Node = null // 摇杆当前位置



    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._createStickSprite();
        //当触摸类型为FOLLOW会在此对圆圈的触摸监听
        if(this.touchType == Common.TouchType.FOLLOW){
            this._initTouchEvent();
        }
    }

    start () {

    }

    // update (dt) {}

    _createStickSprite()
    {
        //调整摇杆的位置
        this.ring.node.setPosition(this.stickX, this.stickY);
        this.dot.setPosition(this.stickX, this.stickY);
    }

    _initTouchEvent()
    {
        var self = this;

        self.node.on(cc.Node.EventType.TOUCH_START, self._touchStartEvent, self);

        self.node.on(cc.Node.EventType.TOUCH_MOVE, self._touchMoveEvent, self);

        // 触摸在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        self.node.on(cc.Node.EventType.TOUCH_END, self._touchEndEvent,self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, self._touchEndEvent,self);
    }

    _touchStartEvent(event) {
        // 记录触摸的世界坐标，给touch move使用
        this._touchLocation = event.getLocation();
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        // 更改摇杆的位置
        this.ring.node.setPosition(touchPos);
        this.dot.setPosition(touchPos);
        // 记录摇杆位置，给touch move使用
        // this._stickPos = touchPos;
    }

    _touchMoveEvent(event) {

        // 如果touch start位置和touch move相同，禁止移动
        if (this._touchLocation.x == event.getLocation().x && this._touchLocation.y == event.getLocation().y){
            return false;
        }
        // 以圆圈为锚点获取触摸坐标
        var touchPos = this.ring.node.convertToNodeSpaceAR(event.getLocation());
        var distance = this.ring._getDistance(touchPos,cc.v2(0,0));
        var radius = this.ring.node.width / 2;

        // 由于摇杆的postion是以父节点为锚点，所以定位要加上touch start时的位置
        var posX = this._stickPos.x + touchPos.x;
        var posY = this._stickPos.y + touchPos.y;
        if(radius > distance)
        {
            this.dot.setPosition(cc.v2(posX, posY));
        }
        else
        {
            //控杆永远保持在圈内，并在圈内跟随触摸更新角度
            var x = this._stickPos.x + Math.cos(this.ring._getRadian(cc.v2(posX,posY))) * radius;
            var y = this._stickPos.y + Math.sin(this.ring._getRadian(cc.v2(posX,posY))) * radius;
            this.dot.setPosition(cc.v2(x, y));
        }
        //更新角度
        this.ring._getAngle(cc.v2(posX,posY));
        //设置实际速度
        this.ring._setSpeed(cc.v2(posX,posY));
    }

    _touchEndEvent(){
        console.log('_touchEndEvent stick_game')
        this.dot.setPosition(this.ring.node.getPosition());
        this.ring._speed = 0;
    }
}
