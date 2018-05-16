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
import InGame from "./InGame";
import Rectangle from "./Rectangle";
const FRICTION_FACTOR = 1000;
const BOUND_SPEED_FACTOR = 3;
const DIE_BOUND_SPEED = 50;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    @property({url: cc.AudioClip})
    jumpAudio: cc.AudioClip = null;

    @property({url: cc.AudioClip})
    gameOverAudio: cc.AudioClip = null;

    velocity: cc.Vec2;
    isBound: boolean;
    isGrounding: boolean;
    boundSpeed: number;
    isAttachMiddleRectangle: boolean;

    //Game setting
    scrollSpeed: number;
    //

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));

        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    start () {
        this.isAttachMiddleRectangle = true;
        this.scrollSpeed = 100;
        this.isBound = false;
        this.isGrounding = true;
        this.velocity = cc.Vec2.ZERO;
        this.node.getComponent(cc.CircleCollider).radius = 2;

        this.startEffect();
        let animState = this.node.getComponent(cc.Animation).play("rollBall");
        animState.wrapMode = cc.WrapMode.Loop;
    }

    update (dt) {
        //check game over
        if (this.canvas.node.getComponent(InGame).isGameOver == true) {
            return;
        }

        if (this.boundSpeed < DIE_BOUND_SPEED && !this.isGrounding) {
            this.gameOver();
        }

        //scroll
        this.node.y += this.scrollSpeed * dt;


        if (this.isBound) {
            this.node.x += this.velocity.x * dt * this.boundSpeed;
            this.node.y += this.velocity.y * dt * this.boundSpeed;

            this.boundSpeed -= this.boundSpeed <= 0 ? 0 : FRICTION_FACTOR * dt;
        }

        this.rotatePlayer();
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
        if (this.isGrounding) {
            this.velocity = new cc.Vec2(touch.getLocation().x - touch.getStartLocation().x, touch.getLocation().y - touch.getStartLocation().y);
            this.boundSpeed = this.velocity.mag() * BOUND_SPEED_FACTOR;
            this.velocity.normalizeSelf();
            this.isBound = true;

            //audio
            cc.audioEngine.play(this.jumpAudio, false, 1);

            this.jumpEffect();
        }
    }

    onCollisionEnter (other, self) {
        switch (other.tag) {
            case 1: { //rectangle
                this.node.x = other.node.x;
                this.isAttachMiddleRectangle = true;
                this.isBound = false;
                this.boundSpeed = 0;
            } break;

            case 2: { //rectangle bounding box
                if (this.canvas.getComponent(InGame).isBegan == false) {
                    this.canvas.getComponent(InGame).isBegan = true;
                } else {
                    this.canvas.node.getComponent(InGame).gainScore();
                    this.deformation();
                    other.node.parent.getComponent(Rectangle).deformation();
                }
                
                this.isGrounding = true;
            }break;
        }
    }

    onCollisionStay (other, self) {
        switch (other.tag) {
            case 2: {

            } break;
        }
    }

    onCollisionExit (other, self) {
        switch (other.tag) {
            case 1: { //rectangle
                this.isAttachMiddleRectangle = false;
            } break;

            case 2: { //rectangle bounding box
                this.isGrounding = false;
                other.node.parent.getComponent(Rectangle).fall();
            }
        }
    }

    gameOver () {
        let self = this;
        this.canvas.node.getComponent(InGame).isGameOver = true;
        let dieEffect = cc.scaleTo(1, 0, 0);
        this.node.stopAllActions();

        this.node.runAction(cc.sequence(dieEffect, cc.callFunc(function () {
            self.canvas.node.getComponent(InGame).gameOver(); 
        })));

        cc.audioEngine.play(this.gameOverAudio, false, 1);
    }

    
    deformation () {
        this.node.stopAllActions();
        this.node.setScale(1, 1);
        let small = cc.scaleTo(0.2, 0.9, 0.9);
        let normal = cc.scaleTo(0.2, 1, 1);
        this.node.runAction(cc.sequence(small, normal));
    }

    jumpEffect () {
        let boundTime = (this.boundSpeed - DIE_BOUND_SPEED) / FRICTION_FACTOR;
        let large = cc.scaleTo(boundTime / 2, 1.5, 1.5);
        let normal = cc.scaleTo(boundTime / 2, 1, 1);
        this.node.runAction(cc.sequence(large, normal));
    }

    startEffect () {
        this.node.setScale(4, 4);
        this.node.runAction(cc.sequence(cc.scaleTo(0.5, 0.8, 0.8), cc.scaleTo(0.2, 1.2, 1.2), cc.scaleTo(0.2, 1, 1)));
    }

    rotatePlayer () {
        if (this.isBound) {
            let angle = this.velocity.angle(new cc.Vec2(0, 1)) * 180 / Math.PI;
            this.node.rotation = angle * Math.abs(this.velocity.x) / this.velocity.x;
        }

        if (!this.isBound || (this.isAttachMiddleRectangle == false && this.isGrounding)) {
            this.node.rotation = 0;
        }
    }
}
