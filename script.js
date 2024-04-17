class Scene1 extends Phaser.Scene 
{
    constructor() {
        super({
            key: 'scene1'
        });
    }

    preload() {
        this.load.image('fondo', 'https://i.ibb.co/PgXGwrf/fondo.png');
    }

    create() {
        this.add.image(150, 250, 'fondo');

        this.add.text(0, 100, 'Presiona ESPACIO', { fontSize: '29px', fill: '#fff' });

        this.add.text(0, 130, 'para iniciar', { fontSize: '29px', fill: '#fff' });
        
        this.input.keyboard.on('keydown-SPACE', this.iniciarJuego, this);
    }

    iniciarJuego() {
        setTimeout(() => {
            this.scene.start('scene2');
        }, 100); 
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

class Scene2 extends Phaser.Scene
{
    constructor(){
        super('scene2');
      }

    player;    
    cursors;
    enemies;
    background;

    preload ()
    {
        this.load.image('fondo', 'https://i.ibb.co/PgXGwrf/fondo.png');
        this.load.image('bullet', 'https://i.ibb.co/MCS7mT8/bala.png');
        this.load.image('bulletE', 'https://i.ibb.co/DpWb0rN/bala-Enemigo.png');
        this.load.image('dude', 'https://i.ibb.co/R7DsmQD/player.png');
        this.load.image('enemigo', 'https://i.ibb.co/cr8MjRQ/enemigo.png');        
        //this.load.audio('shotSound', '');
        //this.load.audio('enemyKill', '');
    }

    create ()
    {
        //MAPA
        //this.add.image(150, 250, 'fondo');
        this.background = this.add.tileSprite(150, 250, 300, 500, 'fondo');


        //JUGADOR
        this.player = this.physics.add.image(150, 420, 'dude');

        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);

        //ENEMIGO
        this.enemies = this.physics.add.group({
            key: 'enemigo',
            frameQuantity: 20,
            maxSize: 16,
            active: false,
            visible: false,
            enable: false,
            collideWorldBounds: true,
            bounceX: 1
        });

        for (var y = 1; y < 5; y++) {
            for (var x = 1; x < 5; x++) {
                const enemigo = this.enemies.get();
                enemigo
                    .enableBody(true, y*40, x*50, true, true)
                    .setVelocity(60 + x*5, 0);
                enemigo.body.allowGravity = false;
            }
        }

        //CONTROLES
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update ()
    {
        //REPRODUCIR ANIMACION DEL ENEMIGO
        if (!this.lastFired || this.time.now - this.lastFired >= 1000) {
            this.enemies.getChildren().forEach(enemigo => {
                const randomNumber = Phaser.Math.Between(1, 10);
    
                if (randomNumber === 7) {
                    const bulletE = this.physics.add.image(enemigo.x, enemigo.y, 'bulletE');
    
                    if (bulletE) {
                        bulletE.enableBody(true, enemigo.x, enemigo.y, true, true);
                        bulletE.setActive(true);
                        bulletE.setVisible(true);
                        bulletE.setVelocityY(200);
                        bulletE.body.allowGravity = false;
    
                        // Escucha la colisión de las balas con las plataformas
                        this.physics.add.collider(bulletE, this.player, this.bulletPlayerCollision, null, this);
                    }
                }
            });
    
            // Actualizamos el tiempo del último disparo
            this.lastFired = this.time.now;
        }

        if (this.player.active) {
        //MOVIMIENTO Y ANIMACIONES DEL JUGADOR
            if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-180);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(180);
            }
            else
            {
                this.player.setVelocityX(0);
            }
            if (this.cursors.up.isDown)
            {
                this.player.setVelocityY(-180);
            }else if (this.cursors.down.isDown)
            {
                this.player.setVelocityY(180);
            } else
            {
                this.player.setVelocityY(0);
            }

            if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE'))) {
                this.disparar();
                //this.sound.play('shotSound');
            }
        }

        this.background.tilePositionY -= 0.25; 
    }

    disparar() {
        const bullet = this.physics.add.image(this.player.x, this.player.y, 'bullet');

        if (bullet) {
            bullet.enableBody(true, this.player.x, this.player.y, true, true);
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocityY(-400);
            bullet.body.allowGravity = false;

            // Escucha la colisión de las balas con las plataformas
            this.physics.add.collider(bullet, this.enemies, this.bulletEnemyCollision, null, this);
        }
    }

    destroyBullet(bullet) {
        bullet.destroy();
    }

    bulletEnemyCollision(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        //this.sound.play('enemyKill');
    }

    bulletPlayerCollision(bulletE) {
        bulletE.destroy();
        this.player.setActive(false);
        this.player.setVisible(false);
        //this.sound.play('enemyKill');
    }    
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

const config = {
    type: Phaser.AUTO,
    width: 300,
    height: 500,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Scene1, Scene2]
};

const game = new Phaser.Game(config);