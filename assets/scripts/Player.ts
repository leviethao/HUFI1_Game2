// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;


    velocity: cc.Vec2;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    }

    start () {
        this.velocity = cc.Vec2.ZERO;

    }

    update (dt) {
        this.node.x += this.velocity.x * dt;
        this.node.y += this.velocity.y * dt;
    }

    onTouchStart () {

    }

    onTouchMove (touch: cc.Event.EventTouch) {
        let drawing: cc.Graphics = this.canvas.node.getChildByName("Drawing").getComponent(cc.Graphics);
        let startLoc = this.canvas.node.convertToWorldSpace(touch.getStartLocation());
        startLoc = drawing.node.convertToNodeSpaceAR(startLoc);
        let curLoc = this.canvas.node.convertToWorldSpace(touch.getLocation());
        curLoc = drawing.node.convertToNodeSpaceAR(curLoc);

        drawing.clear();
        drawing.moveTo(startLoc.x, startLoc.y);
        drawing.lineTo(curLoc.x, curLoc.y);
        drawing.stroke();
    }

    onTouchEnd (touch: cc.Event.EventTouch) {
        let drawing: cc.Graphics = this.canvas.node.getChildByName("Drawing").getComponent(cc.Graphics);
        drawing.clear();

        //bound
        this.velocity = new cc.Vec2(-1 * (touch.getLocation().x - touch.getStartLocation().x), -2 * (touch.getLocation().y - touch.getStartLocation().y));
    }
}
