import Common from './stitck_common'
const {ccclass, property} = cc._decorator;

@ccclass
export default class StickBg extends cc.Component {

    @property({
        type: cc.Node,
        displayName: "速度"
    })
    speedValueShow: cc.Node = null

    @property({
        type: cc.Node,
        displayName: "角度"
    })
    rotateValueShow: cc.Node = null

    @property({
        type: cc.Node,
        displayName: "摇杆节点",
    })
    dot: cc.Node = null;

    @property({
        displayName: 'joy Node'
    })
    joyCom = null

    @property({
        type: cc.Node,
        displayName: '被操作的目标Node'
    })
    playerNode: cc.Node = null

    @property({
        displayName: '当前触摸的角度'
    })
    _angle = null

    @property({
        displayName: '弧度'
    })
    _radian = null

    _speed: number = 0          //实际速度
    _maxSpeed: number = 100         //最大速度
    _opacity: number = 0        //透明度

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // joy下的Game组件
        this.joyCom = this.node.parent.getComponent('stick_game');
        // game组件下的player节点
        // this._playerNode = this._joyCom;
        console.log('_playerNode', this.playerNode, this._angle)
        console.log('angle', this._angle)
        if(this.joyCom.touchType == Common.TouchType.DEFAULT){
            //对圆圈的触摸监听
            this._initTouchEvent();
        }
    }

    start () {

    }

    update (dt) {
        // console.log('this._speed', this._speed)
        switch (this.joyCom.directionType)
        {
            case Common.DirectionType.ALL:   
                this._allDirectionsMove();
                break;
            default :
                break;
        }
    }

    //对圆圈的触摸监听
    _initTouchEvent()
    {
        var self = this;

        self.node.on(cc.Node.EventType.TOUCH_START, this._touchStartEvent, self);

        self.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveEvent, self);

        // 触摸在圆圈内离开或在圆圈外离开后，摇杆归位，player速度为0
        self.node.on(cc.Node.EventType.TOUCH_END, this._touchEndEvent, self);
        self.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndEvent, self);
    }

    //全方向移动
    _allDirectionsMove()
    {
        this.playerNode.x += Math.cos(this._angle * (Math.PI/180)) * this._speed;
        this.playerNode.y += Math.sin(this._angle * (Math.PI/180)) * this._speed;
    }

     //计算两点间的距离并返回
    _getDistance(pos1, pos2)
    {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) +
        Math.pow(pos1.y - pos2.y, 2));
    }

    /*角度/弧度转换
    角度 = 弧度 * 180 / Math.PI
    弧度 = 角度 * Math.PI / 180*/
    //计算弧度并返回
    _getRadian(point)
    {
        this._radian = Math.PI / 180 * this._getAngle(point);
        return this._radian;
    }

    //计算角度并返回
    _getAngle(point)
    {
        var pos = this.node.getPosition();
        this._angle = Math.atan2(point.y - pos.y, point.x - pos.x) * (180/Math.PI);
        this.rotateValueShow.getComponent(cc.Label).string =  this._angle.toFixed(2).toString()
        return this._angle;
    }

     //设置实际速度
    _setSpeed(point)
    {
        //触摸点和遥控杆中心的距离
        var distance = this._getDistance(point, this.node.getPosition());
        this._speed = distance / this._maxSpeed;
        this.speedValueShow.getComponent(cc.Label).string =  this._speed.toFixed(2).toString()
    }

    _touchStartEvent(event) {
        // 获取触摸位置的世界坐标转换成圆圈的相对坐标（以圆圈的锚点为基准）
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        //触摸点与圆圈中心的距离
        var distance = this._getDistance(touchPos,cc.v2(0,0));
        //圆圈半径
        var radius = this.node.width / 2;
        // 记录摇杆位置，给touch move使用
        // this._stickPos = touchPos;
        var posX = this.node.getPosition().x + touchPos.x;
        var posY = this.node.getPosition().y + touchPos.y;
         //手指在圆圈内触摸,控杆跟随触摸点
        if(radius > distance)
        {
            this.dot.setPosition(cc.v2(posX, posY));
            return true;
        }
        return false;
    }

    _touchMoveEvent(event){
        var touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        var distance = this._getDistance(touchPos,cc.v2(0,0));
        var radius = this.node.width / 2;
        // 由于摇杆的postion是以父节点为锚点，所以定位要加上ring和dot当前的位置(stickX,stickY)
        var posX = this.node.getPosition().x + touchPos.x;
        var posY = this.node.getPosition().y + touchPos.y;
        if(radius > distance)
        {
            this.dot.setPosition(cc.v2(posX, posY));
        }
        else
        {
            //控杆永远保持在圈内，并在圈内跟随触摸更新角度
            var x = this.node.getPosition().x + Math.cos(this._getRadian(cc.v2(posX,posY))) * radius;
            var y = this.node.getPosition().y + Math.sin(this._getRadian(cc.v2(posX,posY))) * radius;
            this.dot.setPosition(cc.v2(x, y));
        }
        //更新角度
        this._getAngle(cc.v2(posX,posY));
        //设置实际速度
        this._setSpeed(cc.v2(posX,posY));

    }

    _touchEndEvent(){
        const parentNode = this.node.parent.parent.parent
        console.log('_touchEndEvent stick_bg', this._speed, this._radian, this._angle)
        this.dot.setPosition(this.node.getPosition());
        parentNode.getComponent('game').addArrow(this._angle * 3, 1000 * this._speed, -this._angle * 1 / 4)
        this._speed = 0;
    }
}
