export class Inicio extends Phaser.Scene {
    constructor() {
        // El string 'Inicio' es el identificador único de esta escena
        super('Inicio');
    }

    preload() {
        // Cargar el spritesheet del botón
        this.load.spritesheet(
            'botonSprite',
            'assets/Given/Inicio/spritesheet.png', 
        {
            frameWidth: 657,
            frameHeight: 480
        });

        // Cargar el spritesheet de la bola
        this.load.spritesheet(
            'bolasprite',
            'assets/Given/Inicio/BolaSS.png', 
        {
            frameWidth: 1080,
            frameHeight: 810
        });

        //Sonido de la Bola
        this.load.audio('sonidoBola', 'assets/Given/Sounds/BolaSound.mp3');

        //Imágenes
            //Título
        this.load.image('title', 'assets/Given/Inicio/titulo_cloudee.png');
            //Bola
        this.load.image('bola', 'assets/Given/Inicio/bola.png');
            //Íconos
        this.load.image('star', 'assets/Given/Inicio/star.png');
        this.load.image('nota', 'assets/Given/Inicio/Nota.png');
        this.load.image('cree', 'assets/Given/Inicio/CreeAC.png');
        this.load.image('espiral', 'assets/Given/Inicio/espiral.png');
        this.load.audio('musicaFondo', 'assets/Given/Sounds/Intro-Ganar.mp3');
        this.load.audio('sonidoBoton', 'assets/Given/Sounds/PlayClick.mp3')

    
    }

    create() {

        //Música/Sonidos
        this.musica = this.sound.add(
            'musicaFondo',
            { loop: true,
            volume: 0.5 });

        this.musica.play();

        //Animaciones Spritesheet
        if (!this.anims.exists('botonAnimado')) {
        this.anims.create({
            key: 'botonAnimado',
            frames: this.anims.generateFrameNumbers('botonSprite', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });
        }

        if (!this.anims.exists('bolaAnimacion')) {
            this.anims.create({
                key: 'bolaAnimacion',
                frames: this.anims.generateFrameNumbers('bolasprite', { start: 0, end: 14 }),
                frameRate: 12,
                repeat: 0
            });
        }



        // 1. Fondo blanco: dibujamos un rectángulo que cubra toda la pantalla
        this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0xffffff)
            .setOrigin(0, 0); 
        // setOrigin(0,0) asegura que el rectángulo empiece desde la esquina superior izquierda



        //3. Imágenes
            //Bola de papel
        const bola = this.add.image(
            this.sys.game.config.width / 2, 
            this.sys.game.config.height / 2 + 30, 
            'bola'
        )
        .setOrigin(0.5)
        .setScale(1.15);

            //Íconos
        const estrella = this.add.image(
            this.sys.game.config.width / 2 - 330, 
            this.sys.game.config.height / 2 - 70, 
            'star'
        )
        .setOrigin(0.5)
        .setScale(0.2);

        // Alternar rotación bruscamente cada 500ms
        let rotacionIzquierda = Phaser.Math.DegToRad(-30);
        let rotacionDerecha = Phaser.Math.DegToRad(30);
        let estado = true; // true = izquierda, false = derecha

        this.time.addEvent({
            delay: 300, // medio segundo
            loop: true,
            callback: () => {
                estrella.rotation = estado ? rotacionIzquierda : rotacionDerecha;
                nota.rotation = estado ? rotacionIzquierda : rotacionDerecha;
                espiral.rotation = estado ? rotacionIzquierda : rotacionDerecha;
  
                estado = !estado; // alterna entre izquierda y derecha
            }
        });

        const grados = -20;
        const grados2 = 120;
        const radianes = Phaser.Math.DegToRad(grados);    
        const radianes2 = Phaser.Math.DegToRad(grados2);    


        const nota = this.add.image(
            this.sys.game.config.width / 2 + 320, 
            this.sys.game.config.height / 2 - 250, 
            'nota'
        )
        .setOrigin(0.5)
        .setScale(0.15)
        .setRotation(radianes);


        const espiral = this.add.image(
            this.sys.game.config.width / 2 + 190, 
            this.sys.game.config.height / 2 + 170, 
            'espiral'
        )
        .setOrigin(0.5)
        .setScale(0.15)
        .setAlpha(0.6)
        .setRotation(radianes2);

            //Título
        const titulo = this.add.image(
            this.sys.game.config.width / 2, 
            this.sys.game.config.height / 2 - 80, 
            'title'
        )
        .setOrigin(0.5)
        .setScale(0.7);

        // 2. Botón
        // Crear el sprite del botón en el centro de la pantalla
        const boton = this.add.sprite(
            this.sys.game.config.width / 2, 
            this.sys.game.config.height / 2 + 90,
            'botonSprite'
            )
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive({ cursor: 'pointer' });

        // Reproducir la animación
        boton.play('botonAnimado');


        // Dentro de create(), después de crear el botón
        let estadosEscala = [0.6, 0.5, 0.4, 0.5]; // agranda → normal → achica → normal
        let indiceEscala = 0;

        this.time.addEvent({
            delay: 250, // cada medio segundo
            loop: true,
            callback: () => {
                boton.setScale(estadosEscala[indiceEscala]);
                indiceEscala = (indiceEscala + 1) % estadosEscala.length;
            }
        });


        boton.on('pointerdown', () => {
        const sonido = this.sound.add('sonidoBoton');

        // callback que se ejecuta cuando el sonido de click termina
        const onClickSoundComplete = () => {
            try { if (this.musica && this.musica.isPlaying) this.musica.stop(); } catch(e){}

            // Reanudar por si algo quedó pausado
            try { this.time.timeScale = 1; } catch(e){}
            try { if (this.sound && this.sound.context && this.sound.context.resume) this.sound.context.resume(); } catch(e){}
            try { if (this.anims && this.anims.resumeAll) this.anims.resumeAll(); } catch(e){ /* resumeAll puede no existir en tu versión */ }

            // Fade out de elementos
            const elementosFade = [estrella, nota, espiral, titulo, boton, byAC];
            elementosFade.forEach(el => {
            if (!el) return;
            this.tweens.add({
                targets: el,
                alpha: 0,
                duration: 800,
                ease: 'Linear'
            });
            });

            // Destruir la imagen estática si existe
            try { if (bola && bola.destroy) bola.destroy(); } catch(e){}

            // Asegurar que la animación exista (ideal: mover esto a Boot/Preload)
            if (!this.anims.exists('bolaAnimacion')) {
            console.warn('bolaAnimacion no existe en AnimationManager. Creando de nuevo (fallback).');
            this.anims.create({
                key: 'bolaAnimacion',
                frames: this.anims.generateFrameNumbers('bolasprite', { start: 0, end: 14 }),
                frameRate: 12,
                repeat: 0
            });
            }

            // Crear sprite animado
            const bolaAnimada = this.add.sprite(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2 + 30,
            'bolasprite'
            ).setOrigin(0.5).setScale(1.15);

            // Debug: eventos para ver qué pasa
            bolaAnimada.on('animationstart', () => console.log('bolaAnimada animationstart'));
            bolaAnimada.on('animationstop', () => console.log('bolaAnimada animationstop'));
            bolaAnimada.on('animationupdate', (anim, frame) => {/* opcional */});

            // Reproducir sonido de bola
            const sonidoBola = this.sound.add('sonidoBola');
            sonidoBola.play();

            // Registrar listener ANTES de play para evitar race conditions
            const onAnimComplete = () => {
            console.log('bolaAnimacion complete -> iniciar escena Juego');
            try { sonidoBola.stop(); } catch(e){}
            // limpiar listeners si hace falta
            try { bolaAnimada.removeAllListeners('animationcomplete-bolaAnimacion'); } catch(e){}
            // iniciar escena de juego
            this.scene.start('Juego');
            };
            bolaAnimada.once('animationcomplete-bolaAnimacion', onAnimComplete);

            // Forzar reinicio y reproducir
            try { bolaAnimada.anims.restart(); } catch(e){}
            bolaAnimada.play('bolaAnimacion');

            // Fallback: si no llega el complete, forzar avance tras la duración esperada + margen
            const animDurationMs = Math.ceil((15 / 12) * 1000) + 300; // frames/frameRate + margen (ajusta si cambias)
            this.time.delayedCall(animDurationMs, () => {
            if (bolaAnimada && (!bolaAnimada.anims || !bolaAnimada.anims.isPlaying)) {
                // Si no está reproduciendo y no se llamó al complete, forzamos
                console.warn('Fallback: animación no completó correctamente, forzando start Juego');
                try { sonidoBola.stop(); } catch(e){}
                try { this.scene.start('Juego'); } catch(e){}
            }
            }, [], this);
        };

        // Registrar complete del sonido ANTES de play para evitar race
        sonido.once('complete', onClickSoundComplete);
        sonido.play();
        });



        //ByCreeAc
        const byAC = this.add.image(
            this.sys.game.config.width / 2, 
            this.sys.game.config.height / 2 + 306, 
            'cree'
        )
        .setOrigin(0.5)
        .setScale(0.28);
    }
}
