
/**
 * LED式行先表示器を描画するクラス
 */
class LedDisplay {
    #element = null;
    #inner_element = null;
    #now_lang = "ja";

    constructor(id, imagePath, sizeX, sizeY, offsetX, offsetY, scale) {

        this.id = id || "";
        this.sizeX = sizeX || 0;
        this.sizeY = sizeY || 0;
        this.offsetX = offsetX || 0;
        this.offsetY = offsetY || 0;
        this.scale = scale || 1;

        this.#element = document.getElementById(id);
        this.#element.innerHTML = `
            <div class="led-${id}-outer led-outer" style="width: ${sizeX * scale}px; height: ${sizeY * scale}px;" data-x="0" data-y="0">
                <div id="led-${id}-inner" class="${id}-inner led-inner" style="width: ${sizeX}px; height: ${sizeY}px; transform: scale(${scale});" ></div>
                <div class="ami"></div>
            </div>`;
        this.#element.classList.add("led-root");
        this.#element.style.width = `${sizeX * scale}px`;
        this.#element.style.height = `${sizeY * scale}px`;
        this.#inner_element = document.getElementById(`led-${id}-inner`);
        this.#inner_element.style.backgroundImage = `url(${imagePath})`;
        this.#inner_element.style.backgroundPositionX = `-${offsetX}px`;
        this.#inner_element.style.backgroundPositionY = `-${offsetY}px`;
        this.#inner_element.style.width = `${sizeX}px`;
        this.#inner_element.style.height = `${sizeY}px`;
        this.#inner_element.style.imageRendering = `pixelated`;
    }

    update(x, y) {
        const data = {
            x: this.#element.dataset.x,
            y: this.#element.dataset.y,
        };
        x = Number(x) || data.x || 0;
        y = Number(y) || data.y || 0;
        this.#element.dataset.x = Number(x).toString();
        this.#element.dataset.y = Number(y).toString();

        console.log(this.#now_lang)
        if (this.#now_lang == "ja") {
            console.log((x) * this.sizeX + this.offsetX);
            this.#inner_element.style.backgroundPositionX = `-${x * this.sizeX + this.offsetX}px`;
            this.#inner_element.style.backgroundPositionY = `-${y * this.sizeY + this.offsetY}px`;
        } else if (this.#now_lang == "en") {
            console.log((x + 1) * this.sizeX + this.offsetX);
            this.#inner_element.style.backgroundPositionX = `-${(x + 1) * this.sizeX + this.offsetX}px`;
            this.#inner_element.style.backgroundPositionY = `-${y * this.sizeY + this.offsetY}px`;
        }
    }
    changeLang() {
        if (this.#now_lang == "ja") {
            this.#now_lang = "en";
        } else if (this.#now_lang = "en") {
            this.#now_lang = "ja";
        }
        this.update(this.#element.dataset.x, this.#element.dataset.y);
    }
}

/**
 * 幕式方向幕を描画するクラス
 */
class MakuDisplay {
    #element = null;
    #inner_element = null;
    #now_position_y = 0;
    #roll_speed = 30; // pixel/sec

    /**
     * 
     * @param {string} id 描画対象のElementID
     * @param {string} imagePath 描画する画像へのパス
     * @param {number} sizeX 1コマのXサイズ
     * @param {number} sizeY 1コマのYサイズ
     * @param {number} offsetX X方向のオフセット
     * @param {number} offsetY Y方向のオフセット
     * @param {number} scale 要素を何倍に拡大するか
     * @param {number} marginX コマ間のXマージン
     * @param {number} marginY コマ間のYマージン
     */
    constructor(id, imagePath, sizeX, sizeY, offsetX, offsetY, marginX, marginY, scale, speed) {
        this.id = id || "";
        this.sizeX = sizeX || 0;
        this.sizeY = sizeY || 0;
        this.offsetX = offsetX || 0;
        this.offsetY = offsetY || 0;
        this.marginX = marginX || 0;
        this.marginY = marginY || 0;
        this.scale = scale || 1;
        this.#roll_speed = speed || 30;
        this.#element = document.getElementById(id);
        this.#element.innerHTML = `
            <div class="maku-${id}-outer maku-outer" style="width: ${sizeX * scale}px; height: ${sizeY * scale}px;">
                <div id="maku-${id}-inner" class="${id}-inner maku-inner" style="width: ${sizeX}px; height: ${sizeY}px; transform: scale(${scale});" ></div>
            </div>`;
        this.#inner_element = document.getElementById(`maku-${id}-inner`);
        this.#inner_element.style.backgroundImage = `url(${imagePath})`;
        this.#inner_element.style.backgroundPositionX = `-${offsetX}px`;
        this.#inner_element.style.backgroundPositionY = `-${offsetY}px`;
        this.#inner_element.style.width = `${sizeX}px`;
        this.#inner_element.style.height = `${sizeY}px`;
        // this.#inner_element.style.imageRendering = `pixelated`;

        this.update(0);
    }

    update(yIndex, onfinish) {
        const transformY = (yIndex-this.#now_position_y) * (this.sizeY+this.marginY);
        const animation = [
            { backgroundPosition: `${-this.offsetX}px ${-this.offsetY - (this.sizeY+this.marginY)*this.#now_position_y}px` },
            { backgroundPosition: `${-this.offsetX}px ${-this.offsetY - (this.sizeY+this.marginY)*this.#now_position_y - transformY}px` },
        ];
        const timing = {
            duration: Math.abs(transformY / this.#roll_speed * 1000),
            iterations: 1,
        };          
        const animate = this.#inner_element.animate(animation, timing);
        animate.onfinish = () => {
            onfinish && onfinish();
            this.#inner_element.style.backgroundPosition = `${this.offsetX}px ${-this.offsetY - (this.sizeY+this.marginY) * yIndex}px`
        };
        this.#now_position_y = yIndex;
    }
}