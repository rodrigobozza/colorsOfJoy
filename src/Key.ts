import Phaser from 'phaser';

const KeyState = {
    UP: 0,
    RELEASED: 1,
    PRESSED: 2,
    DOWN: 3
};

export default class Key {
    previousKeyState:number;
    currentKeyState:number;
    key: Phaser.Input.Keyboard.Key;

    constructor(k:Phaser.Input.Keyboard.Key) {
        this.previousKeyState = KeyState.UP;
        this.currentKeyState = KeyState.UP;
        this.key = k;
    }

    update() {
        this.previousKeyState = this.currentKeyState;
        
        if( this.previousKeyState === KeyState.UP && this.key.isDown ) {
            this.currentKeyState = KeyState.PRESSED;
            return;
        }
        else if( this.previousKeyState === KeyState.RELEASED && this.key.isDown ) {
            this.currentKeyState = KeyState.PRESSED;
            return;
        }
        else if( this.previousKeyState === KeyState.PRESSED && this.key.isDown ) {
            this.currentKeyState = KeyState.DOWN;
            return;
        }
        else if( this.previousKeyState === KeyState.DOWN && this.key.isDown ) {
            this.currentKeyState = KeyState.DOWN;
            return;
        }
        if( this.previousKeyState === KeyState.UP && !this.key.isDown ) {
            this.currentKeyState = KeyState.UP;
            return;
        }
        else if( this.previousKeyState === KeyState.RELEASED && !this.key.isDown ) {
            this.currentKeyState = KeyState.UP;
            return;
        }
        else if( this.previousKeyState === KeyState.PRESSED && !this.key.isDown ) {
            this.currentKeyState = KeyState.RELEASED;
            return;
        }
        else if( this.previousKeyState === KeyState.DOWN && !this.key.isDown ) {
            this.currentKeyState = KeyState.RELEASED;
            return;
        }
    }

    isPressed() {
        return this.currentKeyState === KeyState.PRESSED;
    }

}
