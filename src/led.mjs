
function getElementByIdStrict(id) {
	let elem = document.getElementById(id);
	if (elem === null) {
		throw Error("指定された要素は存在しません。");
	}
	return elem;
}

/**
 * LEDパーツの集合を管理するクラス。
 */
export class LedManager {
	/** LEDパーツの集合 */
	#ledParts = [];

	/**
	 *  @param {Array<LedPart>} ledParts LEDパーツの集合
	 */
	constructor(ledParts) {
		if (!Array.isArray(ledParts)) 
			throw Error("ledPartsが配列ではありません。");
		this.#ledParts = ledParts;

		setInterval(() => {
			this.changeLang("ja");
		}, 500);
		setTimeout(() => {
			setInterval(() => {
				this.changeLang("en");
			}, 500);
		}, 250);
	}

	/** 表示言語の変更 */
	changeLang(lang) {
		this.#ledParts.forEach(v => {
			v.changeLang(lang);
		});
	}
}

/**
 * 一つのLEDパーツを表すクラス
 */
export class LedPart {
	/** 
	 * LEDパーツのルート要素ID
	 * @type {string}
	 */
	#displayRootId = "";
	/** 
	 * LEDパーツのルート要素
	 * @type {Element}
	 */
	#displayRootElement = null;
	/** 
	 * 入力のルート要素
	 * @type {Element}
	 */
	#inputElement = null;
	/** LED表示画像へのパス */
	#imagePath = "";
	/**
	 * LED表示のデータ
	 * @type {LedDisplayInfo[]}
	 */
	#table = [];
	/** 現在の表示言語 */
	#nowDisplayLang = "";
	/** 現在の表示ID */
	#nowDisplayId = "";
	/** LED設定 */
	#settings = new LedSettings();

	/**
	 * @param {string} displayId LEDパーツを表示するルート要素のID
	 * @param {string} inputId LEDパーツの入力要素のID
	 * @param {string} imagePath LED表示画像へのパス
	 * @param {LedDisplayInfo[]} table LED表示のデータ
	 * @param {LedSettings} settings LED表示の設定
	 * @param {string} lang 表示する言語
	 */
	constructor(displayId, inputId, imagePath, table, settings, lang) {
		this.#displayRootId = displayId;
		this.#displayRootElement = getElementByIdStrict(displayId);
		this.#inputElement = getElementByIdStrict(inputId);
		this.#imagePath = imagePath;
		this.#table = table;
		this.#settings = settings;
		this.#nowDisplayLang = lang;
		this.drawInputElement();
		this.#displayRootElement.innerHTML = `
            <div class="led-${displayId}-outer led-outer" style="width: ${settings.sizeX * settings.scale}px; height: ${settings.sizeY * settings.scale}px;">
                <div id="led-${displayId}-inner" class="${displayId}-inner led-inner" style="background-image: url(${imagePath}); width: ${settings.sizeX}px; height: ${settings.sizeY}px; transform: scale(${settings.scale});"></div>
                <div class="ami" style="transform: scale(${settings.scale / 5 })"></div>
            </div>`;
		this.drawDisplayElement(table[0].id);
	}

	#getDisplayOuterElement() {
		return getElementByIdStrict(`led-${this.#displayRootId}-outer`);
	}
	#getDisplayInnerElement() {
		return getElementByIdStrict(`led-${this.#displayRootId}-inner`);
	}

	/** 入力要素を更新する関数 */
	drawInputElement() {
		let html = `<select id="${this.#inputElement.id}-inner">`;
		for (const data of this.#table) {
			html += `<option value="${data.id}">${data.name}</option>`;
		}
		html += `</select>`;
		this.#inputElement.innerHTML = html;
		getElementByIdStrict(`${this.#inputElement.id}-inner`).onchange = () => {
			this.drawDisplayElement(getElementByIdStrict(`${this.#inputElement.id}-inner`).value);
		};
	}
	/** 
	 * 表示要素を更新する関数
	 * @param {string} id 
	 */
	drawDisplayElement(id) {
		const data = this.#table.find(v => v.id === id);
		this.#getDisplayInnerElement().style.backgroundPositionX = `-${data.coords.find(v => v.lang === this.#nowDisplayLang).coord.x * this.#settings.sizeX + this.#settings.offsetX}px`;
		this.#getDisplayInnerElement().style.backgroundPositionY = `-${data.coords.find(v => v.lang === this.#nowDisplayLang).coord.y * this.#settings.sizeY + this.#settings.offsetY}px`;
		this.#nowDisplayId = id;
	}

	/** 表示言語を変更する関数 */
	changeLang(lang) {
		this.#nowDisplayLang = lang;
		this.drawDisplayElement(this.#nowDisplayId);
	}
}

/**
 * LED表示を定義するクラス
 */
export class LedDisplayInfo {
	/**
	 * LED表示の識別ID
	 * @type {string}
	 */
	id = "";

	/**
	 * LED表示の表示名
	 * @type {string}
	 */
	name = "";

	/**
	 * LED表示の座標
	 * @type {{lang: string, coord: Coordinate}[]}
	 */
	coords = [];

	constructor(id, name, coords) {
		this.id = id;
		this.name = name;
		this.coords = coords;
	}
}

/**
 * LED表示の座標を表すクラス
 */
export class Coordinate {
	/** X座標(横) */
	x = 0;
	/** Y座標(縦) */
	y = 0;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

/**
 * LED表示の設定を表すクラス
 */
export class LedSettings {
	sizeX = 0;
	sizeY = 0;
	offsetX = 0;
	offsetY = 0;
	scale = 5;
}