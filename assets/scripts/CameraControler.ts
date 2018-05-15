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

    @property(cc.Node)
    target: cc.Node = null;

    camera: cc.Camera = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.camera = this.node.getComponent(cc.Camera);
    }

    start () {
        
    }

    update (dt) {
        
    }

    onEnable () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    }

    onDisable () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    }

    lateUpdate () {
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        this.node.x -= this.target.x;
    }
}
